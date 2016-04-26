'use strict';

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

        // get vacancies and the stage of each application for the agency.
    
        reply.view('agencymyjobs', opts, layout);

        }
      }
    });
  return next();
};

exports.register.attributes = {
  name: 'AgencyMyJobs'
};
