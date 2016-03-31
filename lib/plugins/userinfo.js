'use strict';
const getList = require('../db/redis.js').getList;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/userinfo',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {

                getList('approvedUsers', (res) => {
                    if (res) {
                        reply.view('userinfo', {
                            userData: res
                        });
                    } else {
                        reply.view('userinfo', {
                            userData: res,
                            message: 'Looks like there aren\'t any users awaiting approval at the moment!'
                        });
                    }
                });

            }
        }
    });

    return next();

};

exports.register.attributes = {
    name: 'UserInfo'
};
