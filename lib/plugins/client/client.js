'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

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
                let opts     = { title: 'My jobs' };
                let layout   = { layout: 'client' };
                let id       = request.state.user.profile.id;
                let jobsList = id + 'jobs';

                getSetMembersInfo(jobsList, (vacancies) => {
                    if (vacancies) {
                        opts.data = vacancies;
                    } else {
                        opts.message = 'You have no vacancies listed at current... Submit one <a href="/submitjob">here</a>';
                    }
                    reply.view('client', opts, layout);
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Client'
};
