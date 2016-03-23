'use strict'

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Bell = require('bell');
const AuthCookie = require('hapi-auth-cookie');
require('env2')('config.env');

const Home = require('./lib/plugins/home.js');
const ClientLogin =require('./lib/plugins/clientlogin.js');

const Auth = [ Bell,  AuthCookie];
const Plugins = [Inert, Vision, Home, ClientLogin];


exports.init = (port,next)=> {

	const server = new Hapi.Server();



	server.connection({port: port})

	server.register(Auth, (err) =>{

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

	server.register(Plugins , (err) => {

		if(err) throw err ;

		server.views({
			engines: {
				html: require('handlebars')
			},
			relativeTo: __dirname,
			layoutPath: 'public/views/layout',
			path:'public/views'
		});

		server.start( (err) => {
			return next(err,server);
		});

	});




};



