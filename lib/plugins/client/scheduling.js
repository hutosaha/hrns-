'use strict';

const emailAgencyOnClientShortlistRejection = require('../utils/app.js').emailAgencyOnClientShortlistRejection;
const addRemoveFromSets                     = require('../../db/redis.js').addRemoveFromSets;
const getHashKeyValue                       = require('../../db/redis.js').getHashKeyValue;
const setHashKeyValue                       = require('../../db/redis.js').setHashKeyValue;
const getSetMembersInfo                     = require('../../db/redis.js').getSetMembersInfo;
const removeCV                              = require('../../db/redis.js').removeCV;

const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/client/scheduling/{vid}/{jobTitle}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: ['client', 'admin']
                },
                handler: (request, reply) => {
                    let vid  = request.params.vid;
                    let jobTitle = request.params.jobTitle;
                    let opts = { title: 'Scheduling', vid: vid, jobTitle: jobTitle};
                    let stagesArray = [vid + 'stageOne', vid + 'stageTwo', vid + 'stageThree', vid + 'stageFour'];
                    let data = [];
                    let count = 0;

                    stagesArray.forEach((stageSet) => {
                          getSetMembersInfo(stageSet, (res) => {
                              if (res) {
                                data.push(res);
                              }
                             count++;
                             if(count === 4){
                                  let progressData = data.reduce(function(a,b){
                                      return a.concat(b);
                                  },[]);
                                    opts.data = progressData;
                                    reply.view('scheduling', opts , layout);
                             }
                          });
                    });
                }
              }
        }, {
            method: 'GET',
            path: '/client/scheduling/reject',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let agencyEmail = request.query.email;
                    let stage       = request.query.stage;
                    let reason      = request.query.reason;
                    let vid         = request.query.vid;
                    let cvid        = request.query.cvid;
                    let set         = vid + stage;

                    emailAgencyOnClientShortlistRejection(agencyEmail, vid, cvid, reason, (res) => {
                        if (res) {
                            removeCV(cvid, set, (res) => {

                                if (res) {
                                    reply(true);
                                } else {
                                    reply(false);
                                }
                            });
                        } else {
                            reply(false);
                        }
                    });
                }
              }
      },
        {
          method: 'GET',
          path: '/client/scheduling/{vid}/update',
          config: {
            auth: {
              strategy: 'hrns-cookie',
              scope: 'client'
            },
            handler: (request, reply) => {
              let vid = request.params.vid;
              let cvid = request.query.cvid;
              let nextStage = request.query.stage;
              let nextStageSet = vid + '' + nextStage;

              getHashKeyValue(cvid, 'stage', (res) => {
                if (res) {
                  let prevStage = res;
                  let prevStageSet = vid + '' + prevStage;

                  if (prevStage === nextStage) { return reply(true); }

                  setHashKeyValue(cvid, 'stage', nextStage, (res) => {
                    if (res) {
                      addRemoveFromSets(nextStageSet, prevStageSet, cvid, (res) => {
                        if (res) {
                          reply(true);
                        } else {
                          reply(false);
                        }
                      });
                    } else {
                      reply(false);
                    }
                  });
                } else {
                  reply(false);
                }
              });
            }
          }
        }]);
    return next();
};

exports.register.attributes = {
    name: 'Scheduling'
};
