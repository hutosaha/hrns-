'use strict';

// const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/agency/myjobs',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'agency'
      },
      handler: (request, reply) => {
        let opts   = { title: 'My Jobs' };
        let layout = { layout: 'agency' };
        // let agencyId = request.auth.credentials.profile.id;

        reply.view('scheduling', opts, layout);
        }
      }
    });
  return next();
};

exports.register.attributes = {
  name: 'AgencyMyJobs'
};
