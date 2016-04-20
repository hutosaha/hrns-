'use strict';

const emailClientShortlistRejection = require('../utils/app.js').emailClientShortlistRejection;
const getVacancyDetails             = require('../../db/redis.js').getVacancyDetails;
const getSetMembersInfo             = require('../../db/redis.js').getSetMembersInfo;
const removeVacancy                 = require('../../db/redis.js').removeVacancy;
const removeCV                      = require('../../db/redis.js').removeCV;
const layout                        = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/client/job/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let vid    = request.params.vid;
                    let opts   = { title: 'Job page', vid: vid };

                    getVacancyDetails(vid, (res) => {
                        if (res) {
                            opts.data = res;
                            let shortlist = vid + 'clientShortlist';
                            getSetMembersInfo(shortlist, (res) => {
                                if(res){
                                    console.log('res',res);
                                    opts.cvs =res;
                                }else{
                                    opts.message ='There are no candidates submitted against this Vacancy';
                                }
                                reply.view('clientjob', opts, layout);
                            });

                        } else {
                            opts.message ='Sorry, something went wrong, please try again';
                            reply.view('message', opts, layout);
                        }
                    });
               }
            }
        }, {
            method: 'GET',
            path: '/client/job/remove/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let opts    = { title: 'Removal successful!' };
                    let vid     = request.params.vid;
                    let id      = request.state.user.profile.id;

                    removeVacancy(vid, id, (res) => {
                        if (res) {
                            opts.message = 'You have successfully removed this vacancy... Return <a href="/client">home</a>';
                        } else {
                            opts.title   = 'Sorry...';
                            opts.message = 'Something went wrong, please go back and try <a href="/client">again</a>';
                        }
                        reply.view('message', opts, layout);
                    });
                }
            }
        }, {
          method: 'GET',
          path: '/client/job/reject',
          config: {
            auth: {
              strategy: 'hrns-cookie',
              scope: 'client'
            },
            handler: (request, reply) => {
              let agencyEmail = request.query.email;
              let reason = request.query.reason;
              let vid = request.query.vid;
              let cvid = request.query.cvid;
              let set = vid + 'clientShortlist';
              console.log('query>>>>>', request.query);

              emailClientShortlistRejection(agencyEmail, vid, cvid, reason, (res) => {
                if (res) {
                  removeCV(cvid, set, (res) => {
                    if (res) {
                      console.log('res 1');
                      reply(true);
                    } else {
                      console.log('res 2');

                      reply(false);
                    }
                  });
                } else {
                  console.log('res 3');

                  reply(false);
                }
              });
            }
          }
        }]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
