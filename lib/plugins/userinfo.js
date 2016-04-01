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
                  if (array) {
                    let clients = array.filter((user) => user.type === 'client');
                    let agencies = array.filter((user) => user.type === 'agency');

                    if (request.params.type === 'agencies') {
                      reply.view('userinfo', {
                        agencies: agencies
                      });
                    } else {
                      reply.view('userinfo',{
                        clients:clients
                      });
                    }
                  } else {
                    reply.view('userinfo', {
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
