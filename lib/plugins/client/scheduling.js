'use strict';

const getSchedulingInfo = require('../../db/redis.js').getSchedulingInfo;
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const getHashKeyValue   = require('../../db/redis.js').getHashKeyValue;
const setHashKeyValue   = require('../../db/redis.js').setHashKeyValue;
const getHash           = require('../../db/redis.js').getHash;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([
            {
            method: 'GET',
            path: '/client/scheduling/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client' // admin scope aswell? (HUW)
                },
                handler: (request, reply) => {
                    let vid  = request.params.vid;
                                 
                    let opts = { title: 'Scheduling', vid: vid };

                    let stagesArray = [vid+'stageOne', vid+'stageTwo',vid+'stageThree',vid+'stageFour'];
                    
                    
                    let data = [];
                    let count = 0;
                    stagesArray.forEach( (stageList) => {
                          getSetMembersInfo(stageList, (res) => {
                              if (res) {
                                data.push(res);                                             
                              } else {
                                console.log('ERROR empty list',res);
                              }
                             count ++;
                             if(count === 4 ){
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
     

              getHashKeyValue(cvid, 'stage', (res) => {
      
                if (res) {
                  let prevStage = res;
                  let prevStageSet = vid + '' + prevStage;
           

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
