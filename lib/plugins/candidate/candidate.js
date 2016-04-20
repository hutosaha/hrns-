'use strict';

const submitCandidateSchema = require('../utils/joiSchema.js').submitCandidateSchema;
const setHashKeyValue       = require('../../db/redis.js').setHashKeyValue;
const getHashKeyValue       = require('../../db/redis.js').getHashKeyValue;
const frontendInput         = require('../utils/joiSchema.js').frontendInput;
const cleanPayload          = require('../utils/app.js').cleanPayload;
const phoneNumber           = require('../utils/joiSchema.js').phoneNumber;
const emailAdmin            = require('../utils/app.js').emailAdmin;
const url                   = require('../utils/joiSchema.js').url;

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/candidate',
    config: {
      auth: {
        scope: 'candidate',
        strategy: 'hrns-cookie'
      },
      handler: (request,reply) => {
          console.log('credentials', request.auth.credentials);
          let id   = request.auth.credentials.profile.id;
          let opts = {
            frontendInput: frontendInput,
            url: url,
            phoneNumber: phoneNumber,
            id: id // take this out!!! TODO 
          };
          getHashKeyValue(id, 'hasSubmittedCV', (res) => {
              if (res) {
                opts.message = "Hey! Great to see you again, but don't worry, we have your CV already - if you would like to submit an updated profile, go ahead!";
                reply.view('candidate', opts);
              } else {
                reply.view('candidate', opts);
              }
          });
      }
    }
  }, {
    method: 'POST',
    path: '/candidate',
    config: {
      auth: {
        scope: 'candidate',
        strategy: 'hrns-cookie'
      },
      validate: {
        payload: submitCandidateSchema
      },
      handler: (request, reply) => {
          let id   = request.auth.credentials.profile.id;
          let opts = {};
          let payload = cleanPayload(request.payload);

          setHashKeyValue(id, 'hasSubmittedCV', true, (res) => {
              if (res) {
                emailAdmin(payload, 'candidate', (res) => {
                    if (res) {
                        opts.title   = 'Success!';
                        opts.message = 'Thanks so much for signing up! We\'ll find you a job with one of our great companies in no time!';
                        reply.view('message', opts);
                    } else {
                        opts.title   = 'Sign up failed...';
                        opts.message = 'Sorry, something went wrong... please try <a href="/candidate">again</a>';
                        reply.view('message', opts);
                    }
                });
              } else {
                opts.title   = 'Sign up failed...';
                opts.message = 'Sorry, something went wrong... please try <a href="/candidate">again</a>';
                reply.view('message', opts);
              }
          });
      }
    }
  }]);
  return next();
};

exports.register.attributes = {
  name: 'Candidate'
};
