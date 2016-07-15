'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const filterHarnessTalent =require('../utils/app.js').filterHarnessTalent;

exports.register = (server, options, next) => {

    server.route(
        [{
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
                    console.log('qqqqq', query, request.auth);
                    let set = 'HarnessTalent';
                    let response = {};
                    response.userType = request.auth.type;

                    if (response.userType !== 'client') {
                        response.userType = 'admin';
                    }
                    getSetMembersInfo(set, (harnessTalentList) => {

                        if (Object.keys(harnessTalentList).length === 0 || Object.keys(query).length === 0) {
                            console.log('Hello null', harnessTalentList);
                            response.array = harnessTalentList;
                            reply(response);
                        } else {
                            response.array = filterHarnessTalent();
                            reply(response);                            
                        }
                    });
                }
            }

        }]);
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
