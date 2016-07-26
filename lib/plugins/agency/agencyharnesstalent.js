'use strict';

const getSetMembersInfo  = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route(
      {
        method: 'GET',
        path: '/agency/harnesstalent',
        config: {
            auth: {
              strategy:'hrns-cookie'
            },
            handler: (request, reply) => {
              let layout = { layout: 'agency' };
              let id = request.state.user.profile.id;
        
                  let set = id+'HarnessTalentShortList';
                  getSetMembersInfo(set, (res)=> {
                    let opts ={};
                    if(res){
                      opts.data = res;
                      reply.view('agencyharnesstalent', opts, layout);
                    }else{
                       opts.message = 'There is no talent get recruiting';
                       reply.view('agencyharnesstalent', opts, layout);
                    }
                  });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Agencyharnesstalent'
};
