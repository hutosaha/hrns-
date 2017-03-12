'use strict';

require('env2')('config.env');
const AuthCookie = require('hapi-auth-cookie');
const Hapi = require('hapi');
const Bell = require('bell');
const HapiError = require('hapi-error');

const Plugins = require('./plugins.js');
const Config = require('./config.js');


exports.init = (port, next) => {

    const server = new Hapi.Server();
    server.connection({ port: port });

    server.register([Bell, AuthCookie], () => {
        server.auth.strategy('hrns-cookie','cookie', Config.authCookie);
        server.auth.strategy('linkedin-oauth','bell', Config.bell);
        server.auth.default('hrns-cookie');
    });

    const config = {
          statusCodes: {
            "404": {
                "message": "going where no being has gone before, that page is not available."
            },
            "403": {
                "message": function(message, req) {
                  let scope =  req.path.split('/')[1];
                  scope =  scope  === 'client' ? 'a '+scope : 'an '+scope;
                  let  user = req.auth.credentials.scope;
                  user =  user === 'client' ? 'a '+user : 'an '+user;
                  return "Insufficent scope. you are logged in as " + user + ", you need to login as "+ scope +". Please login again.";
                },
                "error": "bull shit"
            },
            "500": {
                "message": "okay something has gone wrong with our server please try again"
            }
        }
    };

    server.register({
        register: HapiError,
        options: config
    });

    server.register(Plugins, () => {

        server.views(Config.views);

        server.start((err) => {
            return next(err, server);
        });
    });
};
