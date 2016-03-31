'use strict';

const isExistingUser = require('../db/redis.js').isExistingUser;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/agency',
    config: {
      auth: {
          strategy: 'hrns-cookie',
          scope: 'agency'
      },
      handler: (request,reply) => {
        let id = request.auth.credentials.profile.id;

        isExistingUser(id, (res) => {
          if (res) {
            reply.view('agency');
          } else {
            reply.redirect('/agencysignup');
          }
        });
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'Agency'
};
