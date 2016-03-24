'use strict'

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/client',
    config: {
      auth: {
        scope: 'client',
        strategy: 'hrns-cookie'
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
}
