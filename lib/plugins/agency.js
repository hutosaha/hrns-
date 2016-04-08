'use strict';

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/agency',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let opts   = { title: 'Live Jobs' };
                let layout = { layout: 'agency' };

                getSetMembersInfo('liveJobs', (res) => {
                    if (res) {
                        opts.userData = res;
                        reply.view('agency', opts, layout);
                    } else {
                        opts.message = 'There are no vacancies at current, please check back later!';
                        reply.view('agency', opts, layout);
                    }
                });
            }
        }
    });

    return next();

};

exports.register.attributes = {
    name: 'Agency'
};
