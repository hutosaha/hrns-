'use strict';

const addAgencySignUpDetails = require('../../db/redis.js').addAgencySignUpDetails;
const agencySignUpSchema     = require('../utils/joiSchema.js').agencySignUpSchema;
const getHashKeyValue        = require('../../db/redis.js').getHashKeyValue;
const isExistingUser         = require('../../db/redis.js').isExistingUser;
const frontendInput          = require('../utils/joiSchema.js').frontendInput;
const cleanPayload           = require('../utils/app.js').cleanPayload;
const getName                = require('../utils/app.js').getName;

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
            getHashKeyValue(id, 'type', (type) => {
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
        let payload = cleanPayload(request.payload);
        let id = request.auth.credentials.profile.id +'agencyId';
        let name = getName(request.auth.credentials);
    
        if (name !== '') { opts.name = name; }

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
