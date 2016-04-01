'use strict';

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

        reply.view('agency');

        }
      }
   });

  return next();

};

exports.register.attributes = {
  name: 'Agency'
};
