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
        let opts = {};
        let vid = request.params.vid;
        getVacancyDetails(vid, (res) => {
          if (res) {
            opts.vacancyInfo = res;
            reply.view('adminjob', opts);
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('adminjob', opts);
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
