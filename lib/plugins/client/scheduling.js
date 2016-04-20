'use strict';



exports.register = (server, options, next) => {

    server.route({
            method: 'GET',
            path: '/client/job/{vid}/scheduling',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                  // scheduling handler
                   var stage = request.params.stage;
                   console.log('STAGE',stage);
                   // add stage to cv profile against job
                  reply(stage);
               }
            }
        });
    return next();
};

exports.register.attributes = {
    name: 'Scheduling'
};
