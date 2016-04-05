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
        let opts = {};
        let vid = request.params.vid;
        getVacancyDetails(vid, (res) => {
          if (res) {
            opts.vacancyInfo = res;
            reply.view('clientjob', opts);
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('clientjob', opts);
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
