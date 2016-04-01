'use strict';

const addAgencySignUpDetails = require('../db/redis.js').addAgencySignUpDetails;
const Joi              = require('joi');
const getName          = require('./utils/app.js').getName;

const backendInput = new RegExp(/^[a-zA-Z0-9 .,?\-@!:;]*$/);
const frontendInput ='[a-zA-Z0-9 .,?\-@!:;]*';

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
        strategy: 'hrns-cookie',
        scope: 'agency'
      },
      handler: (request, reply) => {
        let name = getName(request.auth.credentials);
        if (name !== '') {
          opts.name = name;
        }
        reply.view('agencysignup', opts);
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
