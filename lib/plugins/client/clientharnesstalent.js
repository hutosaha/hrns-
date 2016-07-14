'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route(
        [
            /*{
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
    }*/


            {
                method: 'GET',
                path: '/client/harnesstalent',
                config: {
                    auth: {
                        strategy: 'hrns-cookie'
                    },
                    handler: (request, reply) => {
                        reply.file('./public/views/harnesstalent.html')
                    }
                }


            }, {
                method: 'GET',
                path: '/harnesstalent/results',
                config: {
                    auth: {
                        strategy: 'hrns-cookie'
                    },
                    handler: (request, reply) => {
                        let layout = { layout: 'client' };
                        let query = request.query
                        console.log('qqqqq', query);
                        let set = 'HarnessTalent';

                        getSetMembersInfo(set, (res) => {
                            let checkCandidate = (candidate, i, array) => {
                                return candidate.jobTitle === query.jobTitle &&
                                    // candidate.company === query.company
                                    // candidate.jobCategory === query.jobCategory
                                    candidate.location === query.city
                                    // candidate.salary === query.salary
                                    // candidate.contractType === query.contractType
                            }
                            let filteredResponse = res.filter(checkCandidate)

                            console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', filteredResponse)
                            let opts = {};
                            if (res) {
                                opts.data = res;
                                if(Object.keys(query).length === 0 ){                       
                                reply(res);
                                } else {
                                reply(filteredResponse);
                                }
                            } else {
                                opts.message = 'There is no talent get recruiting';
                                reply.view('harnesstalent', opts, layout);
                            }
                        });
                    }
                }

            }
        ]);
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
