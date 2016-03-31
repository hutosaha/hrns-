'use strict';

const getAwaitingApprovalList = require('../db/redis.js').getAwaitingApprovalList;

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
          getAwaitingApprovalList((res) => {
            if (res) {
              console.log('res', res);
              reply.view('approveusers', {
                userData: res
              });
            } else {
              reply.view('approveusers', {
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
  name: 'ApproveUsers'
};
