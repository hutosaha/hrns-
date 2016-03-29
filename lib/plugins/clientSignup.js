'use strict';

const addSignUpDetails = require('../db/redis.js').addSignUpDetails;

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/clientsignup',
    config: {
      auth:{
          strategy: 'hrns-cookie'
      },
      handler: (request,reply) => {
        reply.view('clientsignup');
      }
    }
  }, {
      method: 'POST',
      path: '/clientsignup',
      config: {
        auth:{
            strategy: 'hrns-cookie'
        },
        handler: (request,reply) => {

          let body = request.payload; // validate this?
          let id = request.auth.credentials.profile.id;

          console.log(body);

          addSignUpDetails(body, id, (res) => {
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
