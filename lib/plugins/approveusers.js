'use strict';

const getList = require('../db/redis.js').getList;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/approveusers',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {
          getList('awaitingApproval',(res) => {
            if (res) {
              reply.view('approveusers', {
                userData: res
              });
            } else {
              reply.view('approveusers', {
                userData:res,
                message:'Nobody waiting for approval'
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
