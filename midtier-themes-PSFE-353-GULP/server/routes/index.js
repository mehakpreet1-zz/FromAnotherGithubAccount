'use strict';

const express = require('express');
// Makes fs use promises
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const tc5kParser = require('ad-theme-customizer-client');
const bootstrap = require('../models/bootstrap');
const tc5kDeps = require('../models/dependencies');
const zipCreation = require('../javascript/zipCreation');
const router = express.Router();
const path = require('path');

var ml = require('../../gulpfile');
// url is defined here and used in this way in order to avoid trying to load a language that does not exist.
// For example, if someone goes from wacom/italian to rogers, this will allow rogers to switch to its first language (en-US) instead of not loading.
var url;

const THEME_ROOT = path.join(__dirname, '..', '..', 'themes');

function getPath(company, language, file) {
	return `${THEME_ROOT}/${company[0]}/${company}/default/${file}.html`;
}

function readAlphabetDirs() {
	return fs.readdirAsync(THEME_ROOT)
		.then(function(dirs) {
			return dirs.filter(item => !(/(zip|test|DS_Store)/.test(item)));
		});
}

function readThemeDirs(alphabet) {
	return fs.readdirAsync(path.join(THEME_ROOT, alphabet))
		.then(function(dirs) {
			return dirs.filter(item => !(/(zip|test|DS_Store)/.test(item)));
		});
}

function readHeaderNames(location) {
	return fs.readdirAsync(location)
		.catch({
			code: 'ENOENT'
		}, function() {
			return '';
		})
		.then(function(dirs) {
			var headerNames = [];
			for (var i = 0; i < dirs.length; i++) {
				if (dirs[i] === 'logged-out.html') {
					headerNames.push('logged-out');
				} else if (dirs[i] === 'logged-in.html') {
					headerNames.push('logged-in');
				} else if (dirs[i] === 'checkout.html') {
					headerNames.push('checkout');
				}
			}
			return headerNames;
		});
}

function getThemeLanguages(company) {
	return fs.readdirAsync(`${THEME_ROOT}/${company[0]}/${company}`)
		.then(function(dirs) {
			return dirs.filter(item => !(/(zip|test|DS_Store)/.test(item)));
		});
}

function getHtml(company, language, file, type) {
	return fs.readFileAsync(getPath(company, language, file), 'utf8')
		.catch({
			code: 'ENOENT'
		}, function() {
			return Promise.join(getThemeLanguages(company), function(languages) {
				if (type === 'header') {
					url = `/${company}/${languages[0]}/logged-out`;
				}
				return fs.readFileAsync(getPath(company, languages[0], 'logged-out'), 'utf8');
			});
		});
}

function render(res, file, company, language, folderName) {
	return (alphabetDirectories, directories, headerNames, header, footer, languages) => {
		const templates = {
			header: header,
			footer: footer
		};
		const parsedTemplates = tc5kParser.parse(templates, bootstrap, tc5kDeps);
		res.render('index', {
			title: company,
			header: parsedTemplates.header,
			headerNames: headerNames,
			footer: parsedTemplates.footer,
			status: file,
			url: url,
			directory: folderName,
			company: company,
			language: language,
			themes: directories,
			alphabets: alphabetDirectories,
			themeLanguages: languages
		});
	};
}

function getThemeBranding(company) {
	fs.readFile(`${THEME_ROOT}/${company}/default/design-properties.json`, 'utf8', function(err, branding) {
		if (err) return;

		console.log(branding);
	});
}

router.get('/:company/createZip', function(req, res, next) {
	zipCreation.createZip(req.params.company);
	res.end();
});

router.get('/:company/:language/:file', function(req, res, next) {
	const file = req.params.file;
	// if js, css or zip file...
	if (/\.(js|css|zip)$/.test(file)) {
		// ...don't serve it, let it go to static
		return next();
	}
	var company = req.params.company;
	var language = req.params.language;

	url = '/' + company + '/' + language + '/';

	if (company == '_alphabet') {
		var dirList = [];
		fs.readdir(path.join(THEME_ROOT, language.trim()), function(err, list) {
			if (list.length) {
				res.writeHead(301, {
					Location: '/themes/' + list[0] + '/default/logged-out'
				});
			} else {
				res.writeHead(301, {
					Location: '/themes/acme/default/logged-out'
				});
			}
			res.end();
		});
	} else {
		console.log('else working');
		console.log(company[0]);
		console.log(company);
		console.log(path.join(THEME_ROOT, company[0], company, language));
		console.log(company, language, file, 'header');

		// check if the css.css file for this company is present
		// if present let the execute below code
		// if no : generate css.css
		var flag = 'css not present';
		fs.readdir(path.join(THEME_ROOT, company[0], company, language), (err, files) => {
			if (err) {
				console.log('Error:' + err);
			} else {
				files.forEach(file => {
					if (path.extname(file) === ('.css')) {
						flag = 'css present';
					}
				});
				if (flag === ('css not present')) {
					ml.compileSass(company);
				}
			}
		});

		Promise.join(
			readAlphabetDirs(),
			readThemeDirs(company[0]),
			readHeaderNames(path.join(THEME_ROOT, company[0], company, language)),
			getHtml(company, language, file, 'header'),
			getHtml(company, language, 'footer'),
			getThemeLanguages(company),
			render(res, file, company, language, company[0]));
	}
});
module.exports = router;
