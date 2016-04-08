'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/agency/submitcandidate',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'agency'
      },
      handler: (request, reply) => {
        let opts   = { title: 'Submit Candidate' };
        let layout = { layout: 'agency' };

        reply.view('submitcandidate', opts, layout);

        }
      }
    });
  return next();
};

exports.register.attributes = {
  name: 'SubmitCandidate'
};
