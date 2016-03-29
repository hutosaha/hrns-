'use strict';

const isApprovedClient = require('../db/redis.js').isApprovedClient;
const isExistingUser = require('../db/redis.js').isExistingUser;

exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/login/{user*}',
        config: {
            auth: 'linkedin-oauth',
            handler: (request, reply) => {

                let credentials = request.auth.credentials;
                let userType = request.params.user;
                let id = request.auth.credentials.profile.id;

                if (request.auth.isAuthenticated) {
                	console.log(credentials);

                    request.cookieAuth.set(credentials);

                    if (userType === 'candidate') {


                        const candidate = {
                            type: 'candidate',
                            scope: 'candidate'
                        };
                        request.cookieAuth.set(candidate);

                        reply.redirect('/candidate');

                    } else if (userType === 'client') {

                        request.cookieAuth.set('type', 'client');

                        isExistingUser(id, (res) => {
                            if (!res) {
                                reply.redirect('/clientsignup');
                            } else {
                                isApprovedClient(id, (res) => {
                                    if (res) {
                                        request.cookieAuth.set('scope', 'client');
                                        reply.redirect('/client');
                                    } else {
                                        reply.view('unapproved');
                                    }
                                });
                            }
                        });
                    } else if (userType === 'admin') {
            	         reply.redirect('/admindashboard');
                  	} else {
                      reply('Bad request... return <a href="/">home</a>');
                    }
                } else {
                  reply('Please try again...')
                    .code(401);
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Login'
};
