'use strict';

const getVacancyDetails = require('../db/redis.js').getVacancyDetails;

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
        let opts   = {};
        let layout = { layout: 'client' };
        let vid    = request.params.vid;

        getVacancyDetails(vid, (res) => {
          if (res) {
            opts.data = res;
            reply.view('clientjob', opts, layout);
          } else {
            opts.message = 'Sorry, something went wrong, please try <a href="/client"> again </a>';
            reply.view('message', opts, layout);
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'ClientJob'
};
