'use strict';

const submitCandidateSchema = require('./utils/joiSchema.js').submitCandidateSchema;
const frontendInput         = require('./utils/joiSchema.js').frontendInput;
const cleanPayload          = require('./utils/app.js').cleanPayload;
const phoneNumber           = require('./utils/joiSchema.js').phoneNumber;
const emailAdmin            = require('./utils/app.js').emailAdmin;
const url                   = require('./utils/joiSchema.js').url;

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
          let opts = {
            frontendInput: frontendInput,
            url: url,
            phoneNumber: phoneNumber
          };
          reply.view('candidate', opts); // think default layout is fine here
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
          let opts = {};
          let payload = cleanPayload(request.payload);

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
      }
    }
  }]);
  return next();
};

exports.register.attributes = {
  name: 'Candidate'
};
