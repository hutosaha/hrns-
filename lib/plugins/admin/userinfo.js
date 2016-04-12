'use strict';
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/userinfo/{type*}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts = { title: 'User Info' };
                let layout = { layout: 'admin' };

                getSetMembersInfo('approvedUsers', (array) => {
                    if (array) {
                        let clients = array.filter((user) => user.type === 'client');
                        let agencies = array.filter((user) => user.type === 'agency');
                        
                        if(clients.length === 0){ 
                           opts.message = 'There are no approved clients';
                        }
                        if(agencies.length === 0){ 
                            opts.message = 'There are no approved agencies';
                        }
                        opts.agencies = agencies;
                        opts.clients =clients;

                        reply.view('userinfo', opts, layout);
                    } else {
                        opts.message = 'There are no users in the database, try adding some!';
                        reply.view('message', opts, layout);
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
