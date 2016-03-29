'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/candidate',
    config: {
      auth: {
        scope: 'candidate',
        strategy: 'hrns-cookie'
      },
      handler: (request,reply) => {
        reply.view('candidate');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'Candidate'
};
