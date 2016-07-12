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

              client.hget( id, 'type' , (err, type) =>{
                  let set,view;
                  console.log(type);
                  switch(type){
                      case 'agency':
                      set = id+'HarnessTalentShortList';
                      view = 'agencyharnesstalent'
                      layout = { layout : 'agency'}
                      break;
                      case 'client':
                      set = 'HarnessTalent';
                      view ='harnesstalent';
                      layout = { layout : 'client'}
                  }

                  getSetMembersInfo(set, (res)=> {
                    let opts ={};
                    if(res){
                      opts.data = res;
                      reply.view(view, opts, layout);
                    }else{
                       opts.message = 'There is no talent get recruiting';
                       reply.view(view, opts, layout);
                    }
                  })
              });



            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'HarnessTalent'
};
