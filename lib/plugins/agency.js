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

                getSetMembersInfo('liveJobs', (res) => {
                    const opts = { userData: res };
                    if (!res) opts.message = 'There are no vacancies at current, check back later!';
                    reply.view('agency', opts);
                });
            }
        }
    });

    return next();

};

exports.register.attributes = {
    name: 'Agency'
};
