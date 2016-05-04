'use strict';

const client            = require('../../db/client.js');
const cleanUpSet        = require('../../db/redis.js').cleanUpSet;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/agency/myjobs',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let opts = { title: 'My Jobs' };
                let layout = { layout: 'agency' };
                const agencyId = request.auth.credentials.profile.id;
                let set = agencyId + 'agencyScheduling';


                cleanUpSet(set, (res) => {
                    if(res){
                        getSetMembersInfo(set, (res) => {
                           if(res.length === 0 || !res ){
                              return reply.view('agencymyjobs', opts, layout);
                           }

                            let count = 0;
                            let stageCount =0;
                            let vacancies =[];
                            let finish = res.length * 4;
                            
                            res.forEach((elem) => {

                                let vacancy = elem;

                                function doneAll(count, finish){
                                    if(stageCount=== 4){
                                      stageCount = 0;
                                      vacancies.push(vacancy) ;
                                    }

                                    if (finish === count){
                                      opts.data =vacancies;
                                     return  reply.view('agencymyjobs', opts, layout);
                                    }
                                }

                                function numberOfCvsAtStage(vacancy, stage, doneAll) {

                                    client.exists(vacancy.vid + stage, (err, res) => {
                                        if (res) {
                                            getSetMembersInfo(vacancy.vid + stage, (res) => {
                                                let filteredArr = res.filter((cv) => {
                                                    return agencyId === cv.agencyId;
                                                });
                                                                              
                                                if(stage === 'stageOne' ) {
                                                  vacancy.stageone = filteredArr.length;
                                                } else if ( stage === 'stageTwo') {     
                                                  vacancy.stagetwo = filteredArr.length;
                                                } else if (stage === 'stageThree') {
                                                  vacancy.stagethree = filteredArr.length;
                                                } else if ( stage === 'stageFour') {                                          
                                                  vacancy.stagefour = filteredArr.length;
                                                }
                                                stageCount++;
                                                count ++;
                                                doneAll(count, finish);
                                            });

                                        } else {
                                            if(stage === 'stageOne' ){
                                                vacancy.stageone = 0;
                                            }else if ( stage === 'stageTwo') {
                                                vacancy.stagetwo = 0;
                                            }else if (stage === 'stageThree') {
                                                vacancy.stagethree = 0;
                                            }else if ( stage === 'stageFour') {
                                                vacancy.stagefour = 0;
                                            }
                                         
                                            stageCount++;
                                            count ++;
                                            doneAll(count, finish);
                                        }
                                    });
                                }
                                numberOfCvsAtStage(vacancy,'stageOne' ,doneAll);
                                numberOfCvsAtStage(vacancy,'stageTwo', doneAll);
                                numberOfCvsAtStage(vacancy,'stageThree', doneAll);
                                numberOfCvsAtStage(vacancy,'stageFour', doneAll);
                            });
                        });
                    } else {
                      opts.message = 'Sorry something went wrong, please try again';
                      reply.view('agencymyjobs', opts, layout);
                    }
                });
            }
        }
    },
    {
        method: 'GET',
        path: '/agency/myjobs/remove',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let vid = request.query.vid;
                const agencyId = request.auth.credentials.profile.id;
                let vacancies = agencyId + 'agencyScheduling';

                /// remove from agency scheduling
                client.srem(vacancies , vid, (err,res) => {
                        if(res){
                            reply(vid);
                        }else {
                            reply(false);
                        }
                });


            }
        }
    }
    
    ]);
    return next();
};

exports.register.attributes = {
    name: 'AgencyMyJobs'
};

