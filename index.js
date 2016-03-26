'use strict';

require('env2')('config.env');
const AuthCookie     = require('hapi-auth-cookie');
const Vision		 = require('vision');
const Blipp 		 = require('blipp');
const Inert 		 = require('inert');
const Hapi 			 = require('hapi');
const Bell 			 = require('bell');

const Candidate 	= require('./lib/plugins/candidate.js');
const Login 		= require('./lib/plugins/login.js');
const Client		= require('./lib/plugins/client.js');
const ClientSignUp  = require('./lib/plugins/clientSignup.js');
const Home 			= require('./lib/plugins/home.js');

const Auth = [Bell,  AuthCookie];
const Plugins = [Blipp, Inert, Vision, Home, Login, Candidate, Client, ClientSignUp];

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
				html: require('handlebars')
			},
			relativeTo: __dirname,
			layoutPath: 'public/views/layout',
			path:'public/views'
		});

		server.start((err) => {
			return next(err, server);
		});
	});
};
