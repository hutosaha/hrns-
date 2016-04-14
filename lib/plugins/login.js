'use strict';

require('env2')('config.env');
const isAMemberOfSet = require('../db/redis.js').isAMemberOfSet;
const isExistingUser = require('../db/redis.js').isExistingUser;

exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/login/{user*}',
        config: {
            auth: {
                strategies: ['hrns-cookie', 'linkedin-oauth']
            },
            handler: (request, reply) => {

                let credentials = request.auth.credentials;
                let userType = request.params.user;
                let id = credentials.profile.id;

                if (request.auth.isAuthenticated) {

                    request.cookieAuth.set(credentials);

                    if (userType === 'candidate') {

                        request.cookieAuth.set('type', 'candidate');
                        request.cookieAuth.set('scope', 'candidate');

                        reply.redirect('/candidate');

                    } else if (userType === 'client') {

                        request.cookieAuth.set('type', 'client');

                        isExistingUser(id, (res) => {
                            if (!res) {
                                reply.redirect('/clientsignup');
                            } else {
                                isAMemberOfSet(id, 'approvedUsers', (res) => {
                                    if (res) {
                                        request.cookieAuth.set('scope', 'client');
                                        reply.redirect('/client');
                                    } else {
                                        reply.view('message',{
                                            message: 'Looks like the admin still needs to approve your account - keep an eye on your emails!'
                                        });
                                    }
                                });
                            }
                        });
                    } else if (userType === 'admin') {
                      reply.redirect('/admindashboard');
                    } else if (userType === process.env.AGENCY_AUTH_ENDPOINT) {
                      request.cookieAuth.set('type', 'agency');
                      reply.redirect('/agencysignup');
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
