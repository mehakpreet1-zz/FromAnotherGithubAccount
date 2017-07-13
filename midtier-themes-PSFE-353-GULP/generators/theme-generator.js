/**
 * Theme folder generator
 * Outputs the folders and files for a given theme and locale
 */

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function createTheme(theme) {
	try {
		fs.lstatSync(`./themes/${theme}`);
	} catch (e) {
		fs.mkdirSync(`./themes/${theme}`);
		console.log(`Theme ${theme} created`);
	}
}

function createLocaleFiles(theme, locale) {
	locale = locale || 'en-US';
	const dest = `./themes/${theme}/${locale}`;
	try {
		fs.lstatSync(dest);
	} catch (e) {
		fs.mkdirSync(dest);
		fs.writeFileSync(`${dest}/css.css`, '', 'utf8');
		fs.writeFileSync(`${dest}/logged-in.html`, '', 'utf8');
		fs.writeFileSync(`${dest}/logged-out.html`, '', 'utf8');
		fs.writeFileSync(`${dest}/checkout.html`, '', 'utf8');
		fs.writeFileSync(`${dest}/footer.html`, '', 'utf8');

		console.log(`Locale ${locale} created`);
	}
}

rl.question('Theme Name? ', (theme) => {
	createTheme(theme);

	rl.question('Locale? (en-US) ', (locale) => {
		createLocaleFiles(theme, locale);
		rl.close();
	});
});
