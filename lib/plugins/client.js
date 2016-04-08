'use strict';

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/client',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                const id = request.state.user.profile.id;
                const jobsList = id + 'jobs';
                let opts = {};
                getSetMembersInfo(jobsList, (res) => {
                    opts.userData = res;
                    if (!res) {
                      opts.message = 'You have no vacancies listed';
                    }
                    reply.view('client', opts, {
                        layout: 'client'
                    });
                });

            }
        }
    });

    return next();

};

exports.register.attributes = {
    name: 'Client'
};
