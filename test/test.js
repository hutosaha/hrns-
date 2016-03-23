'use strict'

const server = require('../index.js');
const test = require('tape');
const Hapi = require('hapi');
const shot = require('shot')

 
test('Server is running', (t)=>{

	server.init(0 , (err,server) => {
		t.equal(server instanceof Hapi.Server, true ,' Server is an instance of the Hapi Server');
		server.stop(t.end);
	})
});


test('root endpoint serves home page ', (t)=>{
	let actual, expected;
	
	var options = {
		url:'/',
		method:'GET'
	};
	server.init(0,(err,server) => {

		server.inject(options, (response)=>{
			console.log(response.statusCode);
			actual =response.statusCode;
			expected = 200;
			t.equal(actual,expected, 'root takes us to home');
		});
		server.stop(t.end);
	});

});