'use strict'

const server = require('../index.js');
const test = require('tape');
const Hapi = require('hapi');
const shot = require('shot');
const redis = require('../lib/db/client.js');
const fs = require('fs');

test('Server is running', (t) => {

	server.init(0, (err,server) => {

		t.equal(server instanceof Hapi.Server, true ,' Server is an instance of the Hapi Server');
		server.stop(t.end);
	
	})
});

test('root endpoint serves home page for new user or expired users', (t) => {
	let actual, expected;

	let options = {
		url:'/',
		method:'GET'
	};

	server.init(0,(err,server) => {

		server.inject(options, (response) => {
			
			actual = response.statusCode;
			expected = 200;
			t.equal(actual, expected, 'the / response status code 200');
			
			actual = fs.readFileSync('./public/views/home.html').toString();
			expected = response.payload;
			t.equal(actual,expected , 'new user gets home page');
		
		});

		options.credentials = {
    		scope:'client'
    	};
	
		server.inject(options, (response) => {
			console.log('cleint Dashboard', response.payload);
			
			actual = response.statusCode;
        	expected = 200;
        	t.equal(actual,expected,'scope client / with status code 200');
			
			actual = fs.readFileSync('./public/views/client.html').toString();
			expected = response.payload;
			t.equal(actual,expected , 'approved client gets client page');
		
		});

		server.stop(t.end);
		redis.quit();
	});
});
// last test call redis.quit();