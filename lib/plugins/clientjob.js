'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/client/job/{vid}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'client'
      },
      handler: (request, reply) => {
        reply.view('clientjob');
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'ClientJob'
};
