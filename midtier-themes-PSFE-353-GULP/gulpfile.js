'use strict';

process.env.DEBUG = 'gulp-live-server';

var path = require('path');
var fs = require('fs-extra');
var gulp = require('gulp');
var gls = require('gulp-live-server');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCSS = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var filter = require('gulp-filter');
var flatmap = require('gulp-flatmap');
var sourcemaps = require('gulp-sourcemaps');
var uif = require('uif-sass');
var sassLint = require('gulp-sass-lint');
var htmllint = require('gulp-htmllint');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var readline = require('readline');
var rp = require('request-promise');
var parseArgs = require('minimist')(process.argv.slice(2));
const zipCreation = require('./server/javascript/zipCreation');

function getThemeCode(file, limiter) {
	// return file.path.split('/themes/')[1].split(limiter)[0];
	return file.path.split('/themes/')[1].split('/')[1];
}

function getThemesStream(glob, limiter, cb) {
	const themeKeys = {};
	return gulp.src(glob)
		.pipe(filter(file => {
			const themeKey = getThemeCode(file, limiter);
			const result = !(themeKey in themeKeys);
			themeKeys[themeKey] = true;
			return result;
		}))
		.pipe(flatmap((stream, file) => {
			return cb(getThemeCode(file, limiter));
		}));
}

function optionalTask(glob, limiter, param, cb) {
	if (parseArgs.theme) {
		const themeCode = parseArgs.theme;
		cb(themeCode);
	} else {
		const optIndex = process.argv.indexOf(param);
		const themeCode = process.argv[optIndex + 1];
		return optIndex > -1 ?
			cb(themeCode) :
			getThemesStream(glob, limiter, cb);
	}
}

// Creates a file to be compiled (this could be done manually, but is not encouraged)
gulp.task('build:manifest', function(done) {
	var manifest = uif.manifest({
			vars: false,
			palettevars: false,
			settingvars: false,
			mixins: false,
			extensions: false,
			legacy: false
		}),
		out = path.join(__dirname, 'server', 'dist', 'generated-styles.scss');
	fs.outputFileSync(out, manifest);
	done();
});

// Compiles the scss file
gulp.task('build:css', ['build:manifest'], function() {
	return gulp.src(path.join(__dirname, 'server', 'dist', 'generated-styles.scss'))
		.pipe(sass({
			includePaths: uif.includePaths,
			onSuccess: () => {},
			onError: () => {},
			errLogToConsole: false
		}))
		.pipe(gulp.dest('./server/dist'));
});

// Allows for using SASS to build a theme css.css
var compileSass = function(themeCode) {
	console.log(`Compiling sass for theme: ${themeCode[0]} / ${themeCode}`);
	return gulp.src(`themes/${themeCode[0]}/${themeCode}/default/assets/scss/**/*.scss`)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: uif.includePaths.concat(
				'node_modules/bootstrap-sass/assets/stylesheets'
			)
		}).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(concatCSS('css.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(`themes/${themeCode[0]}/${themeCode}/default`));
};

function lintSass(themeCode) {
	console.log(`Running sass-lint for theme:${themeCode[0]} / ${themeCode}`);
	return gulp.src(`themes/${themeCode[0]}/${themeCode}/assets/scss/**/*.scss`)
		.pipe(sassLint())
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());
}

gulp.task('sass', function() {
	return optionalTask('themes/**/**/assets/scss/**/*.scss', '/assets/scss/', '--theme', compileSass);
});


gulp.task('sass:lint', function() {
	return optionalTask('themes/**/**/assets/scss/**/*.scss', '/assets/scss/', '--theme', lintSass);
});


gulp.task('html:lint', function() {
	return gulp.src('src/index.html')
		.pipe(htmllint({}, htmllintReporter));
});

function lintHtml(themeCode) {
	console.log(`Running htmllint for theme: ${themeCode}`);
	return gulp.src(`themes/${themeCode[0]}/${themeCode}`)
		.pipe(htmllint({
			'config': '.htmllintrc'
		}, htmllintReporter));
}


function htmllintReporter(filepath, issues) {
	if (issues.length > 0) {
		issues.forEach(function(issue) {
			gutil.log(gutil.colors.cyan('[gulp-htmllint] ') + gutil.colors.blue(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + gutil.colors.red('(' + issue.code + ') ' + issue.msg));
		});

		process.exitCode = 1;
	}
}

function generateThemeCss(designPropertiesPath, themeCode) {
	console.log('Generating css according to design-properties for theme:' + themeCode);
	var themeJson = JSON.parse(fs.readFileSync(designPropertiesPath.path));
	var options = {
		method: 'POST',
		uri: 'http://localhost:5555/compile',
		body: themeJson,
		headers: {
			'content-type': 'application/json'
		},
		json: true
	};
	rp(options)
		.then(function(parsedBody) {
			fs.writeFile('server/dist/generated-styles-custom.css', parsedBody, function(err) {
				if (err) return console.log(err);
				console.log('Generated css for theme:' + themeCode);
			});
		})
		.catch(function(err) {
			console.log(err);
		});
}

// Minify css for browser
function gulpCleanCSS(themeCode) {
	return gulp.src(`themes/${themeCode[0]}/${themeCode}/css.css`)
		.pipe(cleanCSS({
			debug: true
		}))
		.pipe(gulp.dest(`themes/${themeCode[0]}/${themeCode}`));
}

gulp.task('export', ['sass'], function() {
	return optionalTask('themes/**/**/css.css', '/css.css', '--theme', gulpCleanCSS);
});

gulp.task('default', ['build:css', 'sass'], function() {
	const server = gls('server/index.js', {}, 35728);
	server.start();
	const adThemeCompilerServer = gls('node_modules/ad-theme-compiler/src/index.js', {}, 35729);
	adThemeCompilerServer.start();

	function reloadPage() {
		server.lr.changed({
			body: {
				files: ['/']
			}
		});
	}

	// Listen to HTML files to trigger html-lint
	gulp.watch('themes/**/**/*.html', e => lintHtml(getThemeCode(e, '/assets/scss/')));

	// Listen to SASS files to trigger sass-lint
	gulp.watch('themes/**/**/*.scss', e => lintSass(getThemeCode(e, '/assets/scss/')));

	// Listen to SASS files to trigger recompilation of a theme
	gulp.watch('themes/**/**/*.scss', e => compileSass(getThemeCode(e, '/assets/scss/')));

	// Listen to design-properties.json files to generate theme specific css according to deign properties
	gulp.watch('themes/**/**/*.json', e => generateThemeCss(e, getThemeCode(e, '/')));

	// Listen to theme files to livereload the server
	gulp.watch(['themes/**/**/*.css', 'themes/**/*.js', 'themes/**/*.html'], function(file) {
		server.notify.apply(server, [file]);
	});

	// Reloads express server
	gulp.watch(['server/**/*.*'], () => {
		server.start.apply(server);
		setTimeout(reloadPage, 500);
	});
});

gulp.task('create:zip', function() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => {
		rl.question('Theme Name?', (theme) => {
			zipCreation.createZip(theme);
			rl.close();
			resolve(theme);
		});
	});
});

module.exports = {
	compileSass: compileSass
};
