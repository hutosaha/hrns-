'use strict';

const addSignUpDetails = require('../db/redis.js').addSignUpDetails;
const Joi              = require('joi');

const allowedInput = new RegExp(/^[a-zA-Z0-9 .,?-@]+$/);
const frontendInput ='[a-zA-Z0-9 .,?-@]+';
const url = 'https?://.+';

var opts = {
  url: url,
  frontendInput: frontendInput
};

const JoiOpts = {
    contactName: Joi.string().min(1).max(30).required().regex(allowedInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(),
    companyName: Joi.string().min(1).max(50).required().regex(allowedInput),
    companyDescription: Joi.string().min(1).max(50).required().regex(allowedInput),
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

          for (var i in payload) {
            if (payload[i] === '') {
              delete payload[i];
            }
          }
          console.log('payload', payload);
          addSignUpDetails(payload, id, (res) => {
            if (res) {
              opts.message = 'Thanks! We\'ll be in touch when you\'ve been approved!';
              reply.view('clientsignup', opts);
            } else {
              opts.message = 'Sorry, something went wrong, please try again';
              reply.view('clientsignup', opts);
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
