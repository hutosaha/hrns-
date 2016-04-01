'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/client',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'client'
      },
      handler: (request,reply) => {
          reply.view('client');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'Client'
};
