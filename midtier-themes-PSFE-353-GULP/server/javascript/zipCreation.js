'use strict';

var gulp = require('gulp');
var zip = require('gulp-zip');
var fs1 = require('fs-extra');
const path = require('path');
const THEME_ROOT = path.join(__dirname, '..', '..', 'themes');

function getCurrentDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	}
	return yyyy + '-' + mm + '-' + dd;
}

function createThemeZip(theme) {
	const zipLocation = `${THEME_ROOT}/${theme[0]}/${theme}/zip`;
	const container = `${THEME_ROOT}/${theme[0]}/${theme}/container`;
	console.log(zipLocation);
	return Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src([`${container}/**/*`])
				.pipe(zip(theme.toUpperCase() + '_' + getCurrentDate() + '.zip'))
				.pipe(gulp.dest(`${zipLocation}`))
				.on('end', resolve);
		})
	]).then(function() {
		fs1.remove(`${THEME_ROOT}/${theme[0]}/${theme}/container`, function(err) {
			if (err) return console.error(err);
			console.log(`created zip for ` + theme.toUpperCase() + '_' + getCurrentDate() + '.zip');
		});
	});
}

function createThemeZipContainer(theme) {
	const container = `${THEME_ROOT}/${theme[0]}/${theme}/container`;
	const themeFolder = `${THEME_ROOT}/${theme[0]}/${theme}/default`;
	return Promise.all([
		new Promise(function(resolve, reject) {
			gulp.src([`${themeFolder}/css.css`, `${themeFolder}/logged-in.html`, `${themeFolder}/logged-out.html`, `${themeFolder}/checkout.html`, `${themeFolder}/footer.html`])
				.pipe(gulp.dest(`${container}/en-US`))
				.on('end', resolve);
		}),
		new Promise(function(resolve, reject) {
			gulp.src([`${themeFolder}/design-properties.json`])
				.pipe(gulp.dest(`${container}`))
				.on('end', resolve);
		})
	]).then(function() {
		createThemeZip(theme);
	});
}

module.exports = {
	createZip: createThemeZipContainer
};
