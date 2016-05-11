'use strict';

const client            = require('../../db/client.js');
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route([{
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
    },{
      method: 'GET',
      path: '/approveusers/clientlogo/',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
              let id       = request.query.id;
              let logo_url = request.query.logo_url;

              client.hset(id, 'logo_url', logo_url, () => {
                reply('Success! logo added to client profile!');
              });
          }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'ApproveUsers'
};
