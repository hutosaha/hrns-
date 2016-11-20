'use strict';
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const client            = require('../../db/client.js');
const removeUser        = require('../../db/redis.js').removeUser;
exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/user/remove',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts = { title: 'User Info' };
                let layout = { layout: 'admin' };

                opts.message = 'We have users'
                reply.view('removeuser', opts, layout);
            }
        }
    },
    {
        method: 'GET',
        path: '/user/remove/results',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                getSetMembersInfo('approvedUsers', (array) => {
                    if(array){
                        var results ={}
                        results.items = array
                        reply(results);
                    }
                });
            }
        }
    },
    {
        method: 'POST',
        path: '/user/remove/delete',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                console.log('request', request.payload.id);
                const type = request.payload.type;
                const id =request.payload.id;
                let message;
                let set= '';

                if ( type === 'client' ){
                     set = id+'jobs'
                }  
                removeUser(id, set, (res)=>{
                    return reply(res);
                });
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'removeuser'
};
