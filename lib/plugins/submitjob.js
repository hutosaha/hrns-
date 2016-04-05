'use strict';

const uuid = require('uuid');

const addJob            = require('../db/redis.js').addJob;
const mailgun           = require('./utils/mailgun.js');
const getAgenciesEmails = require('../db/redis.js').getAgenciesEmails;
const notifyAgencies    = require('./utils/mailgun.js').notifyAgenciesOfNewJob;

const submitJobSchema   = require('./utils/joiSchema.js').submitJobSchema;
const frontendInput     = require('./utils/joiSchema.js').frontendInput;
const cleanPayload      = require('./utils/app.js').cleanPayload;


let opts = {
  frontendInput: frontendInput
};

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
        reply.view('submitjob', opts, { layout: 'client' });
      }
    }
  }, {
    method: 'POST',
    path: '/submitjob',
    config: {
      auth: {
        strategy: 'hrns-cookie'
      },
      validate: {
        payload: submitJobSchema
      },
      handler: (request, reply) => {
        let profile = request.auth.credentials.profile
        let id = profile.id;
        let payload = request.payload;
        let vid = uuid.v1();

        payload = cleanPayload(payload);
        
        const clientName = profile.name.first +' '+profile.name.last;
        payload.clientName = clientName;
        console.log('request' , request.state.user , 'PAYLOAD',payload);
        addJob(payload, id, vid, (res) => {
          if (res) {
            getAgenciesEmails((res) => {
              if (res && res !==[]) {
                notifyAgencies.to = res;
                mailgun.messages().send(notifyAgencies, (error, body) => console.log('body', body));
                opts.message = 'Thanks for submitting a new job! We\'ll be supplying you with great candidates in no time!';
                reply.view('submitjob', opts, { layout: 'client' });
              } else {
                opts.message = 'Sorry, something went wrong, please try again';
                reply.view('submitjob', opts, { layout: 'client' });
              }
            });
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
            reply.view('submitjob', opts, { layout: 'client' });
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
