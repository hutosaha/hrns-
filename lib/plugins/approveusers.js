'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/approveusers',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
          reply.view('approveusers');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'ApproveUsers'
};
