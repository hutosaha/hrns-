'use strict';

require('env2')('config.env');
const isAMemberOfSet = require('../db/redis.js').isAMemberOfSet;
const isExistingUser = require('../db/redis.js').isExistingUser;

exports.register = (server, options, next) => {

      server.ext({
        type: 'onRequest',
        method: (request, reply) => {
          let error;
          if (request.query.error) { error = request.query.error;}
          //console.log(' REQUEST >>>>>>>>>>', request);
          if (error === 'access_denied' && request.url.path.indexOf(process.env.AGENCY_AUTH_ENDPOINT) > -1) {
            request.setUrl('/' + process.env.AGENCY_LOGIN_ENDPOINT);
          } else if (error === 'access_denied') {
            request.setUrl('/');
          }
          if(error === 'Unauthorized'){
            request.setUrl('/');
          }
            return reply.continue();
        }
    });

    server.route({

        method: 'GET',
        path: '/login/{user*}',
        config: {
            auth: {
                strategies: ['hrns-cookie','linkedin-oauth']
            },
            plugins: { 'hapi-auth-cookie': { redirectTo: false } }, // stops redirecting to home if not authenticated.
            handler: (request, reply) => {
                let failOpts = { message: 'Bad request... please return <a href="/">home</a> and try again'};
                const credentials = request.auth.credentials;
                if (request.auth.isAuthenticated) {

                    let userType = request.params.user;
                    let id = credentials.profile.id;
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
                      reply.view('message', failOpts);
                    }
                } else {
                    reply.view('message', failOpts)
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
