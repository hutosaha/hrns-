'use strict';
require('env2')('config.env');

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/' + process.env.AGENCY_LOGIN_ENDPOINT,
    config: {
      auth: false,
      handler: (request,reply) => {
        reply.view('agencylogin', {
          agencyAuthEndpoint: process.env.AGENCY_AUTH_ENDPOINT
        });
      }
    }
   });

  return next();

};

exports.register.attributes = {
  name: 'AgencyLogin'
};
