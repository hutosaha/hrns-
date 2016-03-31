'use strict';

require('env2')('config.env');
const AuthCookie = require('hapi-auth-cookie');
const Hapi 			 = require('hapi');
const Bell 			 = require('bell');
const Handlebars = require('handlebars');

const Plugins 	 = require('./plugins.js');

const Auth = [Bell,  AuthCookie];

Handlebars.registerHelper('userInfo', (array) => {
	let out = '<div class="users">';

	array.forEach((elem) => {
		console.log('foreach out', out);
		out += '<ul id="' + elem['id'] + '">';
		for(var key in elem) {
			console.log('for in out', out);
			out += '<li>' + elem[key] + '</li>';
		}
		out += '</ul>' +
		'<input type="checkbox" id="' + elem['id'] + '"> <label for="'+ elem['id'] + '">Approve this user</label>' +
		'<br><br>';
	});
	console.log('final out', out);
	return out += '<button action="/approveusers" method="POST"> Save changes </button>' +
	'</div>';
});

exports.init = (port, next) => {

	const server = new Hapi.Server();

	server.connection({ port: port });

	server.register(Auth, (err) => {

		if (err) throw err ;

		let authCookieOptions = {
			password: process.env.COOKIE_PASSWORD,
			cookie: 'user',
			isSecure: false
		};

		server.auth.strategy('hrns-cookie', 'cookie', authCookieOptions);

		let bellAuthOptions = {
			provider: 'linkedin',
			password: process.env.LINKEDIN_PASSWORD,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			isSecure: false
		};

		server.auth.strategy('linkedin-oauth', 'bell', bellAuthOptions);

		server.auth.default('hrns-cookie');
	});

	server.register(Plugins, (err) => {

		if (err) throw err ;

		server.views({
			engines: {
				html: Handlebars
			},
			relativeTo: __dirname,
			layoutPath: '../public/views/layout',
			layout: 'default',
			path:'../public/views'
		});

		server.start((err) => {
			return next(err, server);
		});
	});
};
