'use strict';

const getSetMembersInfo   = require('../../db/redis.js').getSetMembersInfo;
const filterHarnessTalent = require('../utils/app.js').filterHarnessTalent;


exports.register = (server, options, next) => {

    server.route(
        [
            {
                method: 'GET',
                path: '/harnesstalent',
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
                        let query = request.query
                        console.log('qqqqq', query , request.auth);
                        let set = 'HarnessTalent';
                        let response = {};
                        response.userType = request.auth.type;
                       
                        if(response.userType !== 'client'){
                            response.userType = 'admin';
                        }
                        getSetMembersInfo(set, (harnessTalentList) => {
                           
                            if(Object.keys(harnessTalentList).length === 0  || Object.keys(query).length === 0) {
                                console.log('Hello null' , harnessTalentList);
                                response.array = harnessTalentList;
                                reply(response);
                            } else {
                                function filterHarnessTalent(){
                                    let filterKeys = Object.keys(query).filter((key) => {
                                        return query[key] !== 'All';
                                    });
                                    let checkCandidate = (candidate, i) => {
                                    /// for each key in the array filter the data and return an array 
                                       if( filterKeys.length === 0 ){ return true}
                                       for(var i =0; i< filterKeys.length; i++){
                                            console.log('Filter',filterKeys[i] ,candidate[filterKeys[i]]);
                                            return candidate[filterKeys[i]] === query[filterKeys[i]] && 
                                                   candidate[filterKeys[i+1]]===query[filterKeys[i+1]] &&
                                                   candidate[filterKeys[i+2]]===query[filterKeys[i+2]] &&
                                                   candidate[filterKeys[i+3]]===query[filterKeys[i+3]] &&
                                                   candidate[filterKeys[i+4]]===query[filterKeys[i+4]] &&
                                                   candidate[filterKeys[i+5]]===query[filterKeys[i+5]] 
                                        }
                                    }
                                    let filteredResponse = harnessTalentList.filter(checkCandidate);
                                    return filteredResponse;
                                }
                                response.array = filterHarnessTalent();
                                reply(response);
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
