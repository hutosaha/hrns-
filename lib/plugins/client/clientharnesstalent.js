'use strict';

const getSetMembersInfo  = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route(
      {
        method: 'GET',
        path: '/client/harnesstalent',
        config: {
            auth: {
              strategy:'hrns-cookie'
            },
            handler: (request, reply) => {
              let layout = { layout: 'client' };
    
                  let set ='HarnessTalent';
                  getSetMembersInfo(set, (res)=> {
                    let opts ={};
                    if(res){
                      opts.data = res;
                      reply.view('harnesstalent', opts, layout);
                    }else{
                       opts.message = 'There is no talent get recruiting';
                       reply.view('harnesstalent', opts, layout);
                    }
                  });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
