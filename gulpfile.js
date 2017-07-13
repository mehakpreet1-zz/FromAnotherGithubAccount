var gulp = require('gulp'),

	gutil = require('gulp-util'),

	concat = require('gulp-concat'),

	uglify = require('gulp-uglify'),

	rename = require('gulp-rename'),

	imagemin = require('gulp-imagemin'),

	sass = require('gulp-sass'),
	rm = require('gulp-rimraf'),
	prettify = require('gulp-jsbeautifier');

// cache = require('gulp-cache');

var build = '/Users/mehakpreetkaur/gulp_workspace';

gulp.task('mehak', function() {
	//do whatever you want to...
	gutil.log(' mehak gulp is running');
});


gulp.task('copy-file', function() {
	//Copy file...
	gulp.src('/Users/mehakpreetkaur/gulp_workspace/src/html/*.html')
		.pipe(gulp.dest('/Users/mehakpreetkaur/gulp_workspace/dest/html'));
	gutil.log(' *** files copied ***');
});



gulp.task('js-concat', function() {
	//concat, uglify and rename all js files...
	gulp.src(`${build}/src/javascript/*.js`)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(`${build}/dest`))

	// .pipe(uglify())
	// 	.pipe(rename('all.min.js'))
	// 	.pipe(gulp.dest(`${build}/dest`));
	// gutil.log(' *** all js files concatinated ***');

});

gulp.task('js-prettify', function() {
	gulp.src(`${build}/src/javascript/all.min.js`)
		.pipe(prettify())
		.pipe(rename('prettify.js'))
		.pipe(gulp.dest(`${build}/dest`))
});

gulp.task('img-opt', function() {
	gulp.src(`${build}/src/images/**/*`)
		.pipe(imagemin({
			optimizationLevel: 5,
			progressive: true
		}))

	.pipe(gulp.dest(`${build}/dest/images`));
});



// gulp.task('sass', function() {
// 	gulp.src(`${build}/src/scss/*.scss`)
// 		.pipe(sass({
// 			outputStyle: 'compressed'
// 		}).on('error', sass.logError))
// 		.pipe(concat('style.css'))
// 		.pipe(gulp.dest(`${build}/dest`));
// 	gutil.log(' *** all scsss files concatinated ***');
// });

gulp.task('watch', function() {
	//watch html files
	gulp.watch('/Users/mehakpreetkaur/gulp_workspace/src/html/*.html', ['copy-file']);
	// Watch .js files
	gulp.watch(`${build}/src/javascript/*.js`, ['js-concat']);
	// Watch image files
	// gulp.watch(`${build}/src/images/**/*`, ['img-opt']);

});


gulp.task('default', ['js-concat', 'copy-file', 'watch'], function() {
	gutil.log('gulp DEFAULT is running');

});

// gulp.task('clean', function() {
// 	gulp.src(`${build}/dest/*`).pipe(rm());
// });
