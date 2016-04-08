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
                let opts   = { title: 'All vacancies' };
                let layout = { layout: 'admin' };

                getSetMembersInfo('liveJobs', (res) => {
                    if (res) {
                      opts.data = res;
                      reply.view('adminvacancies', opts, layout);
                    } else {
                      opts.message = 'No live vacancies, come back when there are! Return <a href="/admindashboard">home</a>';
                      reply.view('message', opts);
                    }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminVacancies'
};
