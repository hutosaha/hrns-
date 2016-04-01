'use strict';

const addAgencySignUpDetails = require('../db/redis.js').addAgencySignUpDetails;
const Joi              = require('joi');
const getName          = require('./utils/app.js').getName;

const backendInput = new RegExp(/^[a-zA-Z0-9 .,?\-@!:;]*$/);
const frontendInput ='[a-zA-Z0-9 .,?\-@!:;]*';

const checkUserType  = require('../db/redis.js').checkUserType;
const isExistingUser = require('../db/redis.js').isExistingUser;

var opts = {
  frontendInput: frontendInput
};

const JoiOpts = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    contactNumber: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    companySize: Joi.string(),
    agencySpecialism: Joi.string()
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

        isExistingUser(id, (res) => {
          if (res) {
            checkUserType(id, (type) => {
              console.log('type', type);
              if (type === 'client') {
                opts.message = 'You\'ve already signed up as a client, please re-sign up as an agency';
                reply.view('agencysignup', opts);
              } else {
                request.cookieAuth.set('scope', 'agency');
                reply.redirect('/agency');
              }
            });
          } else {

            let name = getName(request.auth.credentials);

            if (name !== '') {
              opts.name = name;
            }

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
          payload: JoiOpts
      },
      handler: (request,reply) => {
        let payload = request.payload;
        let id = request.auth.credentials.profile.id;
        let name = getName(request.auth.credentials);

        if (name !== '') {
          opts.name = name;
        }

        for (var i in payload) {
          if (payload[i] === '') {
            delete payload[i];
          }
        }

        addAgencySignUpDetails(payload, id, (res) => {
          if (res) {
            request.cookieAuth.set('scope', 'agency');
            reply.view('signupsuccess', {
              message: 'You can now <a href="/agency">check out all the live vacancies!</a>'
            });
          } else {
            reply.view('failure', {
              message: 'Please try <a href="/agencysignup">again</a>'
            });
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
