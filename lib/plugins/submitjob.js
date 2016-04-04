'use strict';

const uuid = require('uuid');

const addJob            = require('../db/redis.js').addJob;
const mailgun           = require('./utils/mailgun.js');
const getAgenciesEmails = require('../db/redis.js').getAgenciesEmails;
const notifyAgencies    = require('./utils/mailgun.js').notifyAgenciesOfNewJob;

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
            getAgenciesEmails((res) => {
              if (res) {
                notifyAgencies.to = res;
                mailgun.messages().send(notifyAgencies, (error, body) => console.log(body));
                opts.message = 'Thanks for submitting a new job! Our specialised agencies will be on it right away!';
                reply.view('submitjob', opts);
              } else {
                opts.message = 'Sorry, something went wrong, please try again';
                reply.view('submitjob', opts);
              }
            });
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
