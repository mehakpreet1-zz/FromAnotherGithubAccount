'use strict';

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

const express = require('express');
const path = require('path');
const __slice = [].slice;
const expressStatic = function() {
	const args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	return express.static(path.join.apply(path, [__dirname].concat(args)));
};

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', __dirname + '/templates');
app.set('view engine', 'pug');

if (process.env.NODE_ENV === 'development') {

	// Disable views cache
	app.set('view cache', false);
	app.set('etag', false);

	app.use(function disable304(req, res, next) {
		res.setHeader('Last-Modified', (new Date()).toUTCString());
		next();
	});
} else if (process.env.NODE_ENV === 'production') {
	app.set('view cache', true);
	app.locals.cache = 'memory';
}

app.use(require('connect-livereload')({
	port: 35728
}));

app.use(require('morgan')('dev', {
	skip: (req, res) => /\.(js|css|png|otf|woff)/.test(req.url)  //don't log resources
}))

app.use('/themes', require('./routes'));

app.use('/themes', expressStatic('..', 'themes')); //if not handled by /themes ./routes

app.use('/styles', expressStatic('dist'));
app.use('/css', expressStatic('templates/styles'));
app.use('/javascript', expressStatic('javascript'));
app.use('/lib', expressStatic('..', 'node_modules'));

app.use(expressStatic('static'));

app.get('*', function(req, res) {
	res.render('404');
});

app.listen(PORT, function() {
	console.log('Server started on http://localhost:' + PORT);
});
