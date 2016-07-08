'use strict';

const getSetMembersInfo  = require('../db/redis.js').getSetMembersInfo;
const client             = require('../db/client.js');

exports.register = (server, options, next) => {

    server.route(
      {
        method: 'GET',
        path: '/harnesstalent',
        config: {
            auth: {
              strategy:'hrns-cookie'
            },
            handler: (request, reply) => {
              let layout = { layout: 'admin' };
              let id = request.state.user.profile.id;
              console.log('>>>>>>>>>>>>>>>', id, request.state.user);

              client.hget('id', 'type' , (err, reply) =>{
                  let set;
                  switch(reply){
                      case 'agency';
                      set = id+'HarnessTalentShortList';
                      break;
                      case 'client' || 'admin'
                      set = 'HarnessTalent'
                  }

                  getSetMembersInfo(set, (res)=> {
                    let opts ={};
                    if(res){
                      opts.data = res;                     
                      return reply.view('harnesstalent', opts, layout);
                    }else{
                       opts.message = 'There is no talent get recruiting';
                      return reply.view('harnesstalent', opts, layout);
                    }               
                  })
              }}

            
              
              
              
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'HarnessTalent'
};
