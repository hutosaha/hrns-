'use strict';

const getVacancyDetails = require('../db/redis.js').getVacancyDetails;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/admin/job/{vid}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request, reply) => {
        let opts   = { title: 'Job page'};
        let layout = { layout: 'admin'};
        let vid    = request.params.vid;

        getVacancyDetails(vid, (res) => {
          if (res) {
            opts.data = res;
            reply.view('adminjob', opts, layout);
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('adminjob', opts, layout);
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'AdminJob'
};
