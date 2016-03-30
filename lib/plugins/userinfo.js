'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/userinfo',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
          reply.view('userinfo');
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'UserInfo'
};
