'use strict';

const approveUser  = require('../db/redis.js').approveUser;
const mailgun = require('./utils/mailgun');

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/approveuser/{id}/{email}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
        const id = request.params.id ;
        const email =request.aprams.email;
        approveUser(id, (res) => {
          if (res) {
            console.log('RES',email , id);
         
            mailgun.messages().send(mailgun.approved, function(error, body) {
                    console.log(body);
            });

            reply.redirect('/approveusers');
          } else {
            reply('Sorry, didn\'t work'); // change that
          }
        });
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'ApproveUser'
};
