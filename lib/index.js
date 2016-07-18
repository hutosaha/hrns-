'use strict';

require('env2')('config.env');
const AuthCookie     = require('hapi-auth-cookie');
const Hapi 			 = require('hapi');
const Bell 			 = require('bell');

const Plugins 	     = require('./plugins.js');
const Config		 = require('./config.js');

exports.init = (port, next) => {

	const server = new Hapi.Server();

	server.connection({ port: port });

	server.register([ AuthCookie], () => {

		server.auth.strategy('hrns-cookie', 'cookie', Config.authCookie);
		server.auth.strategy('linkedin-oauth','bell', Config.bell);
		server.auth.default('hrns-cookie');
	});

	server.register(Plugins, () => {

		server.views(Config.views);

		server.start((err) => {
			return next(err, server);
		});
	});
};
