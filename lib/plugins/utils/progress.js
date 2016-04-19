'use strict';



exports.register = (server, options, next) => {

    server.route({
            method: 'GET',
            path: '/progress/{cvid}/{vid}/{stage}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
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
    name: 'progress'
};
