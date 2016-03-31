'use strict';

const ApproveUser  = require('../db/redis.js').approveUser;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/approveusers/{id*}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
        const id = request.params.id ; 
        ApproveUser(id);
        reply.redirect('/approveusers');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'ApproveUser'
};
