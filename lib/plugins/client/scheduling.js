'use strict';

const getSchedulingInfo = require('../../db/redis.js').getSchedulingInfo;
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const getHashKeyValue   = require('../../db/redis.js').getHashKeyValue;
const setHashKeyValue   = require('../../db/redis.js').setHashKeyValue;
const getHash           = require('../../db/redis.js').getHash;
const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/client/job/{vid}/scheduling',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client' // admin scope aswell? (HUW)
                },
                handler: (request, reply) => {
                  let vid  = request.params.vid;
                  let opts = { title: 'Scheduling', vid: vid };

                  getHash(vid, (res) => {
                    if (res) {
                      opts.jobTitle = res.jobTitle;
                      getSchedulingInfo(vid, (res) => {
                        console.log('SCHEDULING res', res);
                        if (res) {
                          opts.cvs = res;
                          console.log('opts.cvs', opts.cvs);
                          reply.view('scheduling', opts, layout);
                        } else {
                          opts.message = 'Sorry, something went wrong. Please try <a href="/client/job/ ' + vid + '/scheduling">again</a>';
                          reply.view('message', opts, layout);
                        }
                      });
                    } else {
                      opts.message = 'Sorry, something went wrong. Please try <a href="/client/job/ ' + vid + '/scheduling">again</a>';
                      reply.view('message', opts, layout);
                    }
                  });
               }
            }
        }, {
          method: 'GET',
          path: '/client/job/{vid}/scheduling/update',
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
              console.log('vid', vid);
              console.log('cvid', cvid);
              console.log('nextStage', nextStage);
              console.log('nextStageSet', nextStageSet);

              getHashKeyValue(cvid, 'stage', (res) => {
                console.log('STAGE res', res);
                if (res) {
                  let prevStage = res;
                  let prevStageSet = vid + '' + prevStage;
                  console.log('prevStage', prevStage);
                  console.log('prevStageSet', prevStageSet);

                  setHashKeyValue(cvid, 'stage', nextStage, (res) => {
                    console.log('SET STAGE res', res);

                    if (res) {
                      addRemoveFromSets(nextStageSet, prevStageSet, cvid, (res) => {
                        console.log('ADD REMOVE res', res);
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
