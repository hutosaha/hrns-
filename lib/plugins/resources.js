'use strict';

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/public/{params*}',
    config: {
      auth: false,
      handler: {
        directory: {
          path: 'public'
        }
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'Resources'
};
