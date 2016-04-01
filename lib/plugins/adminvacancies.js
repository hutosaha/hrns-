'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/adminvacancies',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
          reply.view('adminvacancies');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'AdminVacancies'
};
