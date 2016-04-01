'use strict';

const addClientSignUpDetails = require('../db/redis.js').addClientSignUpDetails;
const Joi              = require('joi');
const getName          = require('./helpers/helper.js').getName;

const backendInput = new RegExp(/^[a-zA-Z0-9 .,?-@!:;]+$/);
const frontendInput ='[a-zA-Z0-9 .,?-@!:;]+';
const url = 'https?://.+';

var opts = {
  url: url,
  frontendInput: frontendInput
};

const JoiOpts = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    companyDescription: Joi.string().max(500).regex(backendInput),
    companySize: Joi.string(),
    website: Joi.any().optional(),
    twitter: Joi.any().optional(),
    facebook: Joi.any().optional(),
    linkedin: Joi.any().optional()
};

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/clientsignup',
    config: {
      auth:{
          strategy: 'hrns-cookie'
      },
      handler: (request,reply) => {
        let name = getName(request.auth.credentials);
        if (name !== '') {
          opts.name = name;
        }
        reply.view('clientsignup', opts);
      }
    }
  }, {
      method: 'POST',
      path: '/clientsignup',
      config: {
        auth:{
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

          addClientSignUpDetails(payload, id, (res) => {
            if (res) {
              reply.view('signupsuccess', {
                message: 'We will let you know by email when you can use the site! ' // change this to Ben's copy
              });
            } else {
              reply.view('failure', {
                message: 'Please try <a href="/clientsignup">again</a>'
              });
            }
          });
        }
      }
    }
  ]);
  return next();
};

exports.register.attributes = {
  name: 'ClientSignUp'
};
