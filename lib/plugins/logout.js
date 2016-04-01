'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      auth: false,
      handler: (request,reply) => {
        request.cookieAuth.clear();
        reply.view('logout', null, {
          layout: 'logout'
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'Logout'
};
