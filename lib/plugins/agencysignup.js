'use strict';

const addAgencySignUpDetails = require('../db/redis.js').addAgencySignUpDetails;
const getName                = require('./utils/app.js').getName;
const frontendInput          = require('./utils/joiSchema.js').frontendInput;
const checkUserType          = require('../db/redis.js').checkUserType;
const isExistingUser         = require('../db/redis.js').isExistingUser;
const agencySignUpSchema     = require('./utils/joiSchema.js').agencySignUpSchema;
const cleanPayload           = require('./utils/app.js').cleanPayload;

let opts = {
  frontendInput: frontendInput,
  title: 'Sign up'
};

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/agencysignup',
    config: {
      auth: {
        strategy: 'hrns-cookie'
      },
      handler: (request, reply) => {
        let id = request.auth.credentials.profile.id;
        let name = getName(request.auth.credentials);

        if (name !== '') {
          opts.name = name;
        }

        isExistingUser(id, (res) => {
          if (res) {
            checkUserType(id, (type) => {
              if (type === 'client') {
                opts.message = 'You\'ve already signed up as a client, please re-sign up as an agency';
                reply.view('agencysignup', opts);
              } else {
                request.cookieAuth.set('scope', 'agency');
                reply.redirect('/agency');
              }
            });
          } else {
            reply.view('agencysignup', opts);
          }
        });
      }
    }
  }, {
    method: 'POST',
    path: '/agencysignup',
    config: {
      auth: {
          strategy: 'hrns-cookie'
      },
      validate: {
          payload: agencySignUpSchema
      },
      handler: (request,reply) => {
        let payload = request.payload;
        let id = request.auth.credentials.profile.id;
        let name = getName(request.auth.credentials);

        if (name !== '') {
          opts.name = name;
        }

        payload = cleanPayload(payload);

        addAgencySignUpDetails(payload, id, (res) => {
          if (res) {
            request.cookieAuth.set('scope', 'agency');
            opts.message = 'Thanks for signing up! You can now <a href="/agency">check out all the live vacancies!</a>';
            reply.view('message', opts);
          } else {
            opts.message = 'Sorry, something went wrong. please try <a href="/agencysignup">again</a>';
            reply.view('message', opts);
          }
        });
      }
    }
  }]);
  return next();
};

exports.register.attributes = {
  name: 'AgencySignUp'
};
