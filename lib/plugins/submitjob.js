'use strict';

const uuid = require('uuid');
const Joi  = require('joi');

const addJob            = require('../db/redis.js').addJob;
const mailgun           = require('./utils/mailgun.js');
const getAgenciesEmails = require('../db/redis.js').getAgenciesEmails;
const notifyAgencies    = require('./utils/mailgun.js').notifyAgenciesOfNewJob;

const backendInput = new RegExp(/^[a-zA-Z0-9 .,?\-@!:;]*$/);
const frontendInput ='[a-zA-Z0-9 .,£$€?\-@!:;]*';

const joiOpts = {
  jobTitle: Joi.string().min(1).max(30).required().regex(backendInput),
  jobDescription: Joi.string().min(1).max(3000).required().regex(backendInput),
  teamCulture: Joi.string().min(1).max(100).required().regex(backendInput),
  typesOfProjects: Joi.string().min(1).max(100).required().regex(backendInput),
  skillOne: Joi.any().optional(),
  skillTwo: Joi.any().optional(),
  skillThree: Joi.any().optional(),
  personality: Joi.any().optional(),
  salary: Joi.any().optional(),
  searchDeadline: Joi.date()
};

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
        payload: joiOpts
      },
      handler: (request, reply) => {
        let id = request.auth.credentials.profile.id;
        let payload = request.payload;
        let vid = uuid.v1();

        for (var i in payload) {
          if (payload[i] === '') {
            delete payload[i];
          }
        }

        addJob(payload, id, vid, (res) => {
          if (res) {
            getAgenciesEmails((res) => {
              if (res) {
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
