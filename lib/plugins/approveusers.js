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
                getSetMembersInfo('awaitingApproval', (res) => {
              
                    if (res) {
                        reply.view('approveusers', {
                            userData: res
                        });
                    } else {
                        reply.view('approveusers', {
                            userData: res,
                            message: 'Nobody waiting for approval'
                        });
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
