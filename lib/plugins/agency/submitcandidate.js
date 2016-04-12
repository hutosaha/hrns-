'use strict';

const submitCandidateSchema = require('../utils/joiSchema.js').submitCandidateSchema;
const getHashKeyValue       = require('../../db/redis/gethashkeyvalue.js');
const frontendInput         = require('../utils/joiSchema.js').frontendInput;
const cleanPayload          = require('../utils/app.js').cleanPayload;
const phoneNumber           = require('../utils/joiSchema.js').phoneNumber;
const emailAdmin            = require('../utils/app.js').emailAdmin;
const layout                = { layout: 'agency' };
const url                   = require('../utils/joiSchema.js').url;

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/agency/submitcandidate',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'agency'
      },
      handler: (request, reply) => {
        let opts   = {
          title: 'Submit Candidate',
          frontendInput: frontendInput,
          phoneNumber: phoneNumber,
          url: url
        };
        reply.view('submitcandidate', opts, layout);
        }
      }
    }, {
      method: 'POST',
      path: '/agency/submitcandidate',
      config: {
        auth: {
          strategy: 'hrns-cookie',
          scope: 'agency'
        },
        validate: {
          payload: submitCandidateSchema
        },
        handler: (request, reply) => {
            let id      = request.auth.credentials.profile.id;
            let opts    = {};
            let payload = cleanPayload(request.payload);

            payload.agencyId = id;

            getHashKeyValue(id, 'email', (res) => { // so we can supply the agency's email to the email to Admin
              if (res) {
                payload.agencyEmail = res;
              }
              emailAdmin(payload, 'agency', (res) => {
                if (res) {
                    opts.title   = 'Success!';
                    opts.message = 'Thanks for submitting your candidate, we\'ll let you know if our clients are interested!'; // TODO - Ben?
                    reply.view('message', opts, layout);
                } else {
                    opts.title   = 'Submission failed...';
                    opts.message = 'Sorry, something went wrong... please try <a href="/agency/submitcandidate">again</a>';
                    reply.view('message', opts, layout);
                }
              });
            });
        }
      }
    }]);
  return next();
};

exports.register.attributes = {
  name: 'SubmitCandidate'
};