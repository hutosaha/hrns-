'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const filterHarnessTalent = require('../utils/app.js').filterHarnessTalent;

const cleanPayload = require('../utils/app.js').cleanPayload;
const convertSalaryToNumber = require('../utils/app.js').convertSalaryToNumber;
const removeSalaryMinMax = require('../utils/app.js').removeSalaryMinMax;
const getComapnies = require('../utils/app.js').getCompanies;

const interviewSchema = require('../utils/joiSchema.js').interviewSchema;
const client = require('../../db/client.js');
const getInterviewDetails = require('../../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../../db/redis/moveToNextInterviewStage');
const uuid = require('uuid');

const fs = require('fs');
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
                        strategy: 'hrns-cookie',
                        scope:['client','admin']
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
                        strategy: 'hrns-cookie',
                        scope:['client','admin']
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

                            function getCompanies(set){
                                let companies = set.map((candidate) => {
                                    return candidate.company;
                                })
                                return companies
                            }
                            let companies = !harnessTalentList ? 'No candidates' : getCompanies(harnessTalentList);
                            response.companies = companies;

                            if (Object.keys(harnessTalentList).length === 0 || Object.keys(query).length === 0) {
                                console.log('Initial Render and no query Render', Object.keys(harnessTalentList), query);

                      
                                response.array = harnessTalentList;
                                reply(response);

                            } else {

                                let filterKeys = findKeysWithoutValueAll(query);
                                let filterKeyExcSalary = removeSalaryMinMax(filterKeys);
                                // if all queris are 'All';
                                let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);
                                let filterKeyExcSalaryLength = filterKeyExcSalary.length;

                                let filterSet = filtereredArray(filterKeyExcSalaryLength, query, harnessTalentList);
                                response.array = filterSet;
                                reply(response);

                                function findKeysWithoutValueAll(query) {
                                    let filterKeys = Object.keys(query).filter((key) => {
                                        return query[key] !== 'All'
                                    });
                                    return filterKeys;
                                }

                                function checkCandidate(candidate) {
                                    for (var i = 0; i < filterKeyExcSalary.length; i++) {
                                        return candidate[filterKeyExcSalary[i]] === query[filterKeyExcSalary[i]] &&
                                            candidate[filterKeyExcSalary[i + 1]] === query[filterKeyExcSalary[i + 1]] &&
                                            candidate[filterKeyExcSalary[i + 2]] === query[filterKeyExcSalary[i + 2]] &&
                                            candidate[filterKeyExcSalary[i + 3]] === query[filterKeyExcSalary[i + 3]] &&
                                            candidate[filterKeyExcSalary[i + 4]] === query[filterKeyExcSalary[i + 4]]
                                    }
                                }

                                function filterBySalaryMax(array, query) {
                                    let candidatesFiltered = array.filter((candidate) => {
                                        let salary = convertSalaryToNumber(candidate.salary);
                                        return salary <= query.salaryMax
                                    });
                                    return candidatesFiltered;
                                }

                                function filterBySalaryMin(array, query) {
                                    let candidatesFiltered = array.filter((candidate) => {
                                        let salary = convertSalaryToNumber(candidate.salary);
                                        return salary >= query.salaryMin
                                    })

                                    return candidatesFiltered;
                                }


                                function filterBySalaryRange(array, query) {
                                    let candidatesFiltered = array.filter((candidate) => {
                                        let salary = convertSalaryToNumber(candidate.salary);
                                        return salary >= query.salaryMin && salary <= query.salaryMax;
                                    })
                                    return candidatesFiltered;
                                }



                                function filtereredArray(filterKeyExcSalaryLength, query, harnessTalentList) {

                                    switch (true) {
                                        case (filterKeyExcSalaryLength === 0 && query.salaryMax !== 'All' && query.salaryMin === 'All'):
                                            return filterBySalaryMax(harnessTalentList, query)

                                        case (filterKeyExcSalaryLength > 0 && query.salaryMax !== 'All' && query.salaryMin === 'All'):
                                            return filterBySalaryMax(candidatesFilteredExcSalary, query);

                                        case (filterKeyExcSalaryLength === 0 && query.salaryMin !== 'All' && query.salaryMax === 'All'):
                                            return filterBySalaryMin(harnessTalentList, query);

                                        case (filterKeyExcSalaryLength > 0 && query.salaryMax === 'All' && query.salaryMin !== 'All'):
                                            return filterBySalaryMin(candidatesFilteredExcSalary, query);

                                        case (filterKeyExcSalaryLength === 0 && query.salaryMin !== 'All' && query.salaryMax !== 'All'):
                                            return filterBySalaryRange(harnessTalentList, query);

                                        case (filterKeyExcSalaryLength > 0 && query.salaryMin !== 'All' && query.salaryMax !== 'All'):
                                            return filterBySalaryRange(candidatesFilteredExcSalary, query);

                                        case (filterKeyExcSalaryLength > 0):
                                            return candidatesFilteredExcSalary;

                                        case (filterKeyExcSalaryLength === 0):
                                            return harnessTalentList;
                                    }
                                }

                            }
                        });
                    }
                }

            }, {
                method: 'POST',
                path: '/harnesstalent/interview/proposed',
                config: {
                    auth: {
                        strategy: 'hrns-cookie',
                        scope: ['client', 'agent']
                    },
                    validate: {
                        payload: interviewSchema
                    },
                    handler: (request, reply) => {
                        ///  must update stage in db;
                        const newTimes = request.payload;
                        const clientId = request.auth.credentials.profile.id;
        
                        const interviewId = uuid.v1() + 'interviewId';
                        newTimes.interviewId = interviewId;
                        newTimes.confirmed = false;

                        /// get the agency email and then send an email with a link to the agency with proposed
                        // job title and salary also link back to interview page. need to create interview hash include in link
                        let agencyId = newTimes.agencyId;
                        let cvid = newTimes.cvid;

                        client.hgetallAsync(agencyId)
                            .then((agency) => {
                                newTimes.agencyEmail = agency.email;
                                newTimes.agencyContactName = agency.contactName;
                                client.hgetallAsync(clientId)
                                    .then((clientDetails) => {
                                        newTimes.clientCompanyName = clientDetails.companyName;
                                        newTimes.clientEmail = clientDetails.email;

                                        let contextEmail = Object.assign({}, proposedInterview);

                                        contextEmail.html = contextEmail.html
                                            .replace('-agencyContactName-', newTimes.agencyContactName)                                            
                                            .replace('-candidateName-', newTimes.candidateName)
                                            .replace('-jobTitle-', newTimes.jobTitle) //switch to client jobTitle.
                                            .replace('-companyName-', newTimes.clientCompanyName)
                                            .replace('-interviewId-', newTimes.interviewId);

                                        contextEmail.to = newTimes.agencyEmail;
                                        mailgun.messages().send(contextEmail)

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
