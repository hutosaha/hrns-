'use strict';

const addSignUpDetails = require('../db/redis.js').addSignUpDetails;
const Joi              = require('joi');

const allowedInput = new RegExp(/^[a-zA-Z0-9 .,?-@]+$/);

const frontendInput ='[a-zA-Z0-9 .,?-@]+';
const url = '[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/clientsignup',
    config: {
      auth:{
          strategy: 'hrns-cookie'
      },
      handler: (request,reply) => {
        reply.view('clientsignup', { url: url , frontendInput : frontendInput});
      }
    }
  }, {
      method: 'POST',
      path: '/clientsignup',
      config: {
        auth:{
            strategy: 'hrns-cookie'
        },
        validate:{
            payload: { 
                contactName: Joi.string().min(1).max(30).required().regex(allowedInput),
                email: Joi.string().email().required(),
                contactNumber: Joi.string().alphanum().required(),
                companyName: Joi.string().min(1).max(50).required().regex(allowedInput),
                companyDescription: Joi.string().min(1).max(50).required().regex(allowedInput),
                companySize: Joi.string(),
                website: Joi.string().optional(),
                twitter: Joi.string().optional(),
                facebook: Joi.string().optional(),
                linkedin: Joi.string().optional() 
            }
        },
        response:{
            failAction: 'log'
        },
        handler: (request,reply) => {

          let payload = request.payload; // validate this?
          let id = request.auth.credentials.profile.id;

          console.log('request.response', Object.keys(request));

          addSignUpDetails(payload, id, (res) => {
            if (res) {
              reply.view('clientsignup', {
                message: 'Thanks! We\'ll be in touch when you\'ve been approved!'
              });
            } else {
              reply.view('clientsignup', {
                message: 'Sorry, something went wrong, please try again'
              });
            }
          });
          reply.view('clientsignup');
        }
      }
    }
  ]);

  return next();

};

exports.register.attributes = {
  name: 'ClientSignUp'
};
