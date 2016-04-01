'use strict';

require('env2')('config.env');
const AuthCookie = require('hapi-auth-cookie');
const Hapi 			 = require('hapi');
const Bell 			 = require('bell');
const Handlebars = require('handlebars');

const Plugins 	 = require('./plugins.js');

const Auth = [Bell,  AuthCookie];

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
			isSecure: true,
			forceHttps:true
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
			path:'../public/views',
			helpersPath: '../public/views/helpers'
		});

		server.start((err) => {
			return next(err, server);
		});
	});
};
