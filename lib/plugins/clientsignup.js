'use strict';

const addClientSignUpDetails = require('../db/redis.js').addClientSignUpDetails;
const getName                = require('./utils/app.js').getName;
const frontendInput          = require('./utils/joiSchema.js').frontendInput;
const url                    = require('./utils/joiSchema.js').url;
const clientSignUpSchema     = require('./utils/joiSchema.js').clientSignUpSchema;
const cleanPayload           = require('./utils/app.js').cleanPayload;

var opts = {
  url: url,
  frontendInput: frontendInput
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
            payload: clientSignUpSchema
        },
        handler: (request,reply) => {

          let payload = request.payload;
          let id = request.auth.credentials.profile.id;
          let name = getName(request.auth.credentials);

          if (name !== '') {
            opts.name = name;
          }

          payload = cleanPayload(payload);
          console.log('payload',payload);
          addClientSignUpDetails(payload, id, (res) => {
            if (res) {
              reply.view('signupsuccess', {
                message: 'Thanks so much for signing up! We will let you know by email when you can use the site!' // change this to Ben's copy
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
