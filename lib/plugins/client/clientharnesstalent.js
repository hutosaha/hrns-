'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const filter = require('../utils/filter.js');

const cleanPayload = require('../utils/app.js').cleanPayload;
const interviewSchema = require('../utils/joiSchema.js').interviewSchema;
const client = require('../../db/client.js');
const getInterviewDetails = require('../../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../../db/redis/moveToNextInterviewStage');
const uuid = require('uuid');

const fs = require('fs');
const changeInterview = require('../utils/mailgun.js').changeInterview;
const interviewConfirmation = require('../utils/mailgun.js').interviewConfirmation;
const proposedInterview = require('../utils/mailgun.js').proposedInterview;

const mailgun = require('../utils/mailgun.js');

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
                        let set = 'HarnessTalent';
                        let response = {};
                        response.userType = request.auth.type;

                        if (response.userType !== 'client') {
                            response.userType = 'admin';
                        }
                        getSetMembersInfo(set, (harnessTalentList) => {

                            if (Object.keys(harnessTalentList).length === 0 || Object.keys(query).length === 0) {
                                response.array = harnessTalentList;
                                reply(response);


                            } else {


                                let filterKeys = filter.findSelectedKeys(query);

                                let filterKeyExcSalary = filter.removeSalaryMinMax(filterKeys);

                                let candidatesFilteredExcSalary = harnessTalentList.filter(filter.checkCandidate);
                                let filterKeyExcSalaryLength = filterKeyExcSalary.length;

                                response.array = filter.filtereredArray(filterKeyExcSalaryLength, query);
                                reply(response);

         
                            }
                        });
                    }
                }

            }, {
                method: 'POST',
                path: '/harnesstalent/interview/proposed',
                config: {
                    auth: {
                        strategy: 'hrns-cookie'
                            // scope: ['client', 'agent']
                    },
                    validate: {
                        payload: interviewSchema
                    },
                    handler: (request, reply) => {
                        ///  must update stage in db;
                        const newTimes = request.payload;
                        const clientId = request.auth.credentials.profile.id;
                        console.log(clientId);

                        const interviewId = uuid.v1() + 'interviewId';
                        newTimes.interviewId = interviewId;
                        newTimes.confirmed = false;

                        /// get the agency email and then send an email with a link to the agency with proposed
                        // job title and salary also link back to interview page. need to create interview hash include in link 
                        let agencyId = newTimes.agencyId;
                        let cvid = newTimes.cvid;

                        client.hgetAsync(agencyId, 'email')
                            .then((agencyEmail) => {
                                newTimes.agencyEmail = agencyEmail;

                                client.hgetAsync(clientId, 'companyName')
                                    .then((clientCompanyName) => {
                                        newTimes.clientCompanyName = clientCompanyName;

                                        let newProposedInterview = Object.assign({}, proposedInterview);

                                        newProposedInterview.html = newProposedInterview.html
                                            .replace('-candidateName-', newTimes.candidateName)
                                            .replace('-jobTitle-', newTimes.jobTitle) //switch to client jobTitle. 
                                            .replace('-companyName-', newTimes.clientCompanyName)
                                            .replace('-interviewId-', newTimes.interviewId);

                                        newProposedInterview.to = agencyEmail;
                                        mailgun.messages().send(newProposedInterview)

                                    })
                                    .then(() => {
                                        let interview = cleanPayload(newTimes);
                                        client.hincrby(cvid, 'interviewsRequested', 1);
                                        client.hmsetAsync(interviewId, interview);
                                    })
                                    .then(() => {
                                        return reply(cvid);
                                    })
                                    .catch(() => {
                                        return reply(false)
                                    });
                            })
                    }
                }
            }

        ]);
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
