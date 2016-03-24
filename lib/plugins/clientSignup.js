'use strict'

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/clientSignUp',
    config: {
      auth: 'hrns-cookie',
      handler: (request,reply) => {
        reply.view('clientsignup');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'ClientSignUp'
}
