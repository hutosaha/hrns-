'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;

exports.register = (server, options, next) => {

    server.route(
        [
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

                        getSetMembersInfo(set, (harnessTalentList) => {
                           
                            if(Object.keys(harnessTalentList).length === 0  || Object.keys(query).length === 0) {
                                console.log('Hello null' , harnessTalentList);
                                reply(harnessTalentList);
                            } else {
                                let checkCandidate = (candidate, i, array) => {
                                return candidate.jobTitle === query.jobTitle &&
                                       candidate.company === query.company &&
                                       candidate.jobCategory === query.jobCategory &&
                                       candidate.location === query.city &&
                                       //candidate.salary === query.salary
                                       candidate.contractType === query.contractType 
                            }
                                let filteredResponse = harnessTalentList.filter(checkCandidate);
                                reply(filteredResponse);
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
