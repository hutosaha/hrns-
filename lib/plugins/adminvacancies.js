'use strict';

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/adminvacancies',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request,reply) => {

          getSetMembersInfo('livejobs', (res) => {
            console.log('RES', res);
            if(res) {
              reply.view('adminvacancies',{
                    userData: res

              });
            } else {

              reply.view('adminvacancies', {
                    userData: res,
                    message: 'No live vacancies'
              });
            }
          });

          reply.view('adminvacancies');
      }
    }
   });

  return next();
};

exports.register.attributes = {
  name: 'AdminVacancies'
};
