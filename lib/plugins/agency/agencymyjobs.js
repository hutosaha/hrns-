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
                let agencyId = request.auth.credentials.profile.id;
                let agencySchedulingSet = agencyId + 'agencyScheduling';

                cleanUpSet(agencySchedulingSet, (res) => {
                    if (res) {
                        getSetMembersInfo(agencySchedulingSet, (vacancies) => {
                           if(vacancies.length === 0 || !vacancies) {
                              return reply.view('agencymyjobs', opts, layout);
                           } else {
                             let finish = vacancies.length * 4;
                             let count = 0;
                             vacancies.forEach((e, i) => {
                               let vid = e.vid;
                               let stages = [vid + 'stageOne', vid + 'stageTwo', vid + 'stageThree', vid + 'stageFour'];

                               stages.forEach((elem, j) => {
                                 j++;
                                 getSetMembersInfo(elem, (cvids) => {
                                   if (cvids) {
                                     var filteredCvs = cvids.filter((cv) => {
                                       return agencyId === cv.agencyId;
                                     });
                                     vacancies[i]["stage" + j + "Count"] = filteredCvs.length;
                                     count++;
                                     if (count === finish) {
                                       opts.data = vacancies;
                                       return reply.view('agencymyjobs', opts, layout);
                                     }
                                   } else {
                                     count++;
                                     vacancies[i]["stage" + j + "Count"] = 0;
                                   }
                                 });
                               });
                             });
                           }
                         });
                    } else {
                      opts.message = 'Sorry something went wrong, please try again';
                      return reply.view('agencymyjobs', opts, layout);
                    }
                });
                reply.view('agencymyjobs',opts,layout);
            }
        }
    }, {
        method: 'GET',
        path: '/agency/myjobs/remove',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let vid = request.query.vid;
                const agencyId = request.auth.credentials.profile.id ;
                let vacancies = agencyId + 'agencyScheduling';

                client.srem(vacancies, vid, (err,res) => {
                        if(res){
                            reply(vid);
                        } else {
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
