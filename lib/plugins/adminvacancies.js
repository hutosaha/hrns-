'use strict';

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/adminvacancies',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
              let opts = {};

                getSetMembersInfo('liveJobs', (res) => {
                    opts.userData = res;
                    if (!res || res === []) {
                      opts.message = 'No live vacancies';
                    }
                    reply.view('vacancies', opts, {
                        layout: 'admin'
                    });
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminVacancies'
};
