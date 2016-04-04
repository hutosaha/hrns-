'use strict';

const uuid = require('uuid');

const emailAgencies = require('./utils/notifyAgenciesOfNewJob.js');
const addJob        = require('../db/redis.js').addJob;

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/submitjob',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'client'
      },
      handler: (request, reply) => {
        reply.view('submitjob');
      }
    }
  }, {
    method: 'POST',
    path: '/submitjob',
    config: {
      auth: {
        strategy: 'hrns-cookie'
      },
      handler: (request, reply) => {
        let id = request.auth.credentials.profile.id;
        let payload = request.payload;
        let vid = uuid.v1();
        let opts;

        addJob(payload, id, vid, (res) => {
          if (res) {
            emailAgencies(); // TODO
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('submitjob', opts);
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('submitjob', opts);
          }
        });
      }
    }
  }]);
  return next();
};

exports.register.attributes = {
  name: 'SubmitJob'
};
