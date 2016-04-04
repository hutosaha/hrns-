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
                // Rertrieve all memebers of uidlist vacancy list and display 
                const uuid = request.state.user.profile.id;
                const jobsList = uuid + 'jobs';
                getSetMembersInfo(jobsList, (res) => {
                    const opts = { userData: res };
                    if (!res) opts.message = 'You have no vacancies listed';
                    reply.view('vacancies', opts, {
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
