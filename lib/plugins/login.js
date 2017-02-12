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
                console.log('AUTH', request.auth);

                if (request.auth.isAuthenticated) {
                    let credentials = request.auth.credentials;
                    console.log('CREDENTIALS' , credentials, request.params);
                    let userType = request.params.user.indexOf(process.env.AGENCY_AUTH_ENDPOINT) >-1? 'agency': request.params.user;
                    let id = credentials.profile.id;

                    request.cookieAuth.set(credentials);
                    request.cookieAuth.set('type', userType);
                    request.cookieAuth.set('scope', userType);

                    switch(userType) {
                        case 'client':
                            return isExistingUser(id, (res) => {
                                if (!res) {
                                   return  reply.redirect('/clientsignup');
                                } else {
                                    isAMemberOfSet(id, 'approvedUsers', (res) => {
                                        if (res) {
                                            return reply.redirect('/client');
                                        } else {
                                            return reply.view('message',{
                                                message: 'Looks like the admin still needs to approve your account - keep an eye on your emails!'
                                            });
                                        }
                                    });
                                }
                            });
                        case 'candidate':
                            return reply.redirect('/candidate');
                        case  'admin':
                            return reply.redirect('/admindashboard');
                        case 'agency':
                            return reply.redirect('/agencysignup');
                        default:
                            return  reply.view('message', failOpts);
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
