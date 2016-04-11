'use strict';

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/approveusers',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts   = { title: 'Approve Users' };
                let layout = { layout: 'admin' };

                getSetMembersInfo('awaitingApproval', (res) => {
                    if (res) {
                        opts.data = res;
                        reply.view('approveusers', opts, layout);
                    } else {
                        opts.message = 'There\'s nobody waiting for approval - please come back later.';
                        reply.view('approveusers', opts, layout);
                    }
                });
            }
        }
    });

    return next();

};

exports.register.attributes = {
    name: 'ApproveUsers'
};
