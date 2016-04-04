'use strict';
const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

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

                getSetMembersInfo('approvedUsers', (array) => {
                  let  opts = {}; 
                  if (array) {
                    let clients = array.filter((user) => user.type === 'client');
                    let agencies = array.filter((user) => user.type === 'agency');
                                                                  
                    if (request.params.type === 'agencies') {
                        opts.agencies = agencies;
                        if (agencies.length === 0)  opts.message ='There are no agency users';
                    } else {
                        opts.clients = clients;
                        if (clients.length === 0)   opts.message ='There are no clients users';
                    }                 
                 } else {
                    opts.message =  'There are no users in the database';
                 }
                  reply.view('userinfo', opts);
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'UserInfo'
};
