'use strict';
const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/userinfo/{params*}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {

                getSetMembersInfo('approvedUsers', (array) => {
                    if (array) {
                        let clients = array.filter((user) => user.type === 'client');
                        let agencies = array.filter((user) => user.type === 'agency');
                   
                        if(request.params === 'agencies'){
                                reply.view('userinfo',{
                                           userData : agencies
                            });
                        } else {
                            reply.view('userinfo' , {
                                        userData : clients
                            });
                        }

                   
                    } else {
                        reply.view('userinfo', {
                            userData: array,
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
