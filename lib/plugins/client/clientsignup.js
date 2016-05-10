'use strict';

const addClientSignUpDetails = require('../../db/redis.js').addClientSignUpDetails;
const clientSignUpSchema     = require('../utils/joiSchema.js').clientSignUpSchema;
const frontendInput          = require('../utils/joiSchema.js').frontendInput;
const cleanPayload           = require('../utils/app.js').cleanPayload;
const getName                = require('../utils/app.js').getName;
const url                    = require('../utils/joiSchema.js').url;


let opts = {
  url: url,
  frontendInput: frontendInput,
  title: 'Sign up'
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
        if (name !== '') { opts.name = name; }
        reply.view('clientsignup', opts); // default layout should be fine
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
          let payload = cleanPayload(request.payload);
          let id      = request.auth.credentials.profile.id;
          let name    = getName(request.auth.credentials);

          if (name !== '') { opts.name = name; }

          addClientSignUpDetails(payload, id, (res) => {
            if (res) {
              opts.title = 'Success!';
              opts.message = 'Thanks for signing-up! We will let you know by email when you can use the site!';
            } else {
              opts.title = 'Sorry...';
              opts.message = 'Sorry, something went wrong. Please try <a href="/clientsignup">again</a>';
            }
            reply.view('message', opts);
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

