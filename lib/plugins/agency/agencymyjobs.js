'use strict';

const client            = require('../../db/client.js');
const cleanUpSet        = require('../../db/redis.js').cleanUpSet;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route({
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
                let vacancies = agencyId + 'agencyScheduling';


                cleanUpSet(vacancies, (res) => {
                    if(res){
                        getSetMembersInfo(vacancies, (res) => {
                           if(res.length === 0 ){
                              reply.view('agencymyjobs', opts, layout);
                           }

                            let count = 0;
                            let stageCount =0;
                            let vacancies =[];
                            let finish = res.length * 4;
                            res.forEach((vacancy) => {

                                function doneAll(count, finish){
                                    if(stageCount=== 4){
                                      stageCount = 0;
                                      vacancies.push(vacancy) ;
                                    }

                                    if (finish === count){
                                      opts.data =vacancies;
                                      reply.view('agencymyjobs', opts, layout);
                                    }
                                }

                                function numberOfCvsAtStage(stage, doneAll) {

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
                                numberOfCvsAtStage('stageOne' ,doneAll);
                                numberOfCvsAtStage('stageTwo', doneAll);
                                numberOfCvsAtStage('stageThree', doneAll);
                                numberOfCvsAtStage('stageFour', doneAll);
                            });
                        });
                    } else {
                      opts.message = 'Sorry something went wrong, please try again';
                      reply.view('agencymyjobs', opts, layout);
                    }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AgencyMyJobs'
};

