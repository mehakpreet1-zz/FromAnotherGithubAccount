'use strict';
var expect = require('chai').expect;
var request = require('request');
const fs = require('fs');
var loggedOut;
var loggedIn;
var checkout;
var footer;

fs.readFile('./fixtures/logged-out.html', 'utf8', (err, data) => {
	if (err) throw err;
	loggedOut = data;
});
fs.readFile('./fixtures/logged-in.html', 'utf8', (err, data) => {
	if (err) throw err;
	loggedIn = data;
});
fs.readFile('./fixtures/checkout.html', 'utf8', (err, data) => {
	if (err) throw err;
	checkout = data;
});
fs.readFile('./fixtures/footer.html', 'utf8', (err, data) => {
	if (err) throw err;
	footer = data;
});

describe('Insertion tests', function() {
	describe('logged-in page', function() {
		var url = 'http://localhost:3000/themes/test/en-US/logged-in';
		it('returns status 200', function(done) {
			request(url, function(error, response) {
				expect(response.statusCode).to.equal(200);
				done();
			});
		});
		it('correctly displays the logged-in header', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(loggedIn);
				done();
			});
		});
		it('correctly displays the footer', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(footer);
				done();
			});
		});
	});
	describe('logged-out page', function() {
		var url = 'http://localhost:3000/themes/test/en-US/logged-out';
		it('returns status 200', function(done) {
			request(url, function(error, response) {
				expect(response.statusCode).to.equal(200);
				done();
			});
		});
		it('correctly displays the logged-out header', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(loggedOut);
				done();
			});
		});
		it('correctly displays the footer', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(footer);
				done();
			});
		});
	});
	describe('checkout page', function() {
		var url = 'http://localhost:3000/themes/test/en-US/checkout';
		it('returns status 200', function(done) {
			request(url, function(error, response) {
				expect(response.statusCode).to.equal(200);
				done();
			});
		});
		it('correctly displays the checkout header', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(checkout);
				done();
			});
		});
		it('correctly displays the footer', function(done) {
			request(url, function(error, response, body) {
				expect(body).to.contains(footer);
				done();
			});
		});
	});
});
