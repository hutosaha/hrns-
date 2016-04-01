'use strict';

const approveUser  = require('../db/redis.js').approveUser;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/approveuser/{id*}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
        const id = request.params.id ;
        approveUser(id, (res) => {
          if (res) {
            reply.redirect('/approveusers');
          } else {
            reply('Sorry, didn\'t work'); // change that
          }
        });
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'ApproveUser'
};
