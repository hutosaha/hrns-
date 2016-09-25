'use strict';

const cleanPayload = require('./utils/app.js').cleanPayload;
const interviewSchema = require('./utils/joiSchema.js').interviewSchema;
const client = require('../db/client.js');
const getInterviewDetails = require('../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../db/redis/moveToNextInterviewStage');
const getSetMembersInfo = require('../db/redis/getsetmembersinfo.js');
const uuid = require('uuid');

const fs = require('fs');
const changeInterview = require('./utils/mailgun.js').changeInterview;
const interviewConfirmation = require('./utils/mailgun.js').interviewConfirmation;
const proposedInterview = require('./utils/mailgun.js').proposedInterview;

const mailgun = require('./utils/mailgun.js');

exports.register = (server, options, next) => {

    server.route([

        {
            method: 'POST',
            path: '/interview/proposed',
            config: {
                auth: {
                    strategy: 'hrns-cookie'
                    // scope: ['client', 'agent']
                },
                validate: {
                    payload: interviewSchema
                },
                handler: (request, reply) => {
                
                    const newTimes = request.payload;
                    const interviewId = uuid.v1() + 'interviewId';
                    newTimes.interviewId = interviewId;
                    newTimes.confirmed = false;

                    getInterviewDetails(newTimes, (interviewData) => {

                        if (interviewData) {
                            let emailContext = Object.assign({}, proposedInterview);
                           
                            emailContext.html = emailContext.html
                                .replace('-agencyContactName-', interviewData.agencyContactName)
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle) //switch to client jobTitle.
                                .replace('-companyName-', interviewData.clientCompanyName)
                                .replace('-interviewId-', interviewData.interviewId);

                            emailContext.to = interviewData.agencyEmail;

                            mailgun.messages().send(emailContext, (error, body) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(body);
                                    client.hmset(interviewId, interviewData, (err, res) => {
                                        if (err) {
                                            console.log('err', err);

                                            return reply(false);
                                        }
                                        if (res) {
                                            client.sadd(interviewData.clientId + 'InterviewsRequested', interviewId, (err, res) => {
                                                if (err) {
                                                    console.log('err', err);
                                                    return reply(false);
                                                } else {
                                                    return reply(interviewData.cvid);
                                                }
                                            });

                                        }
                                    });

                                }
                            });

                        } else {
                            console.log('error', err)
                            return reply(false);
                        }

                    });

                }
            }
        }, {
            method: 'GET',
            path: '/interview/email/{interviewId*}',
            config: {
                auth: false,
                handler: (request, reply) => {

                    let opts = {};
                    const interviewId = request.params.interviewId;

                    client.hgetall(interviewId, (err, res) => {
                        if ((res) && (res.confirmed === 'false')) {
                            opts = res;
                            opts.interviewId = interviewId;
                            opts.title = 'Interview Page';
                            let cleanedPayload = cleanPayload(opts);
                            return reply.view('interview', cleanedPayload);

                        } else {
                            opts.title = 'Interview Page';
                            opts.message = 'This link has expired';
                            return reply.view('message', opts);
                        }

                    });
                }
            }
        }, {
            method: 'GET',
            path: '/scheduling/pendinginterviews',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let opts = { title: 'Pending Interviews' };
                    let layout = { layout: 'client' };
                    let pendingInterviews = request.auth.credentials.profile.id + 'InterviewsRequested';

                    getSetMembersInfo(pendingInterviews, (pendingInterviewsArr) => {
                        if (pendingInterviewsArr){
                            let filteredResponse = pendingInterviewsArr.filter((interview) => {
                                                   return interview.confirmed === 'false';
                            });
                            opts.data = filteredResponse
                            return reply.view('pendinginterviews', opts, layout);
                        } else {
                            opts.message = 'There are no pending interviews'
                            return reply.view('pendinginterviews', opts, layout);
                        }
                    });

                }
            }
        }, {
            method: 'POST',
            path: '/change/interview',
            config: {
                auth: false,
                handler: (request, reply) => {
                    // request.auth.credentials.type;
                    const newTimes = request.payload;
                    const interviewId = newTimes.interviewId;

                    if (interviewId) {

                        client.hgetall(interviewId, (err, res) => {

                            let interviewData = Object.assign(res, newTimes);

                            let emailContext = Object.assign({}, changeInterview);

                            emailContext.html = changeInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-interviewId-', interviewData.interviewId);

                            emailContext.to = interviewData.agencyEmail;
                            mailgun.messages().send(emailContext, (error, agencyReply) => {
                                if (error) {
                                    reply(false);
                                } else if (agencyReply) {
                                    emailContext.to = interviewData.clientEmail;
                                    mailgun.messages().send(emailContext, (error, clientReply) => {
                                        if (error) {
                                            reply(false);
                                        } else if (clientReply) {

                                            let cleanedPayload = cleanPayload(interviewData);

                                            client.hmset(interviewData.interviewId, cleanedPayload, (err, res) => {
                                                if (error) {
                                                    console.log('ERROR');
                                                    reply(false);
                                                } else if (res) {
                                                    console.log('true');
                                                    reply(cleanedPayload);
                                                }
                                            });

                                        }
                                    });
                                }

                            });
                        });
                    } else {
                        reply(false);
                    }
                }
            }
        }, {
            method: 'GET',
            path: '/interview/confirmed', ///////this should be connected to confirmation button.
            config: {
                auth: false,
                handler: (request, reply) => {
                    let confirmedIntTime = request.query.confirmedIntTime;
                    let confirmedIntDate = request.query.confirmedIntDate;
                    let interviewId = request.query.interviewId;

                    client.hgetall(interviewId, (err, res) => {
                        if (err) {
                            return reply(false);
                        }
                        if (res) {
                            let vid = res.vid;
                            let cvid = res.cvid;
                            let nextStage = res.stage;
                            let agencyEmail = res.agencyEmail;
                            let clientEmail = res.clientEmail;
                            let candidateName = res.candidateName;
                            let interviewAddress = res.interviewAddress;
                            let additionalComments = res.additionalComments;
                            let jobTitle = res.jobTitle;

                            if (typeof additionalComments === 'undefined') {
                                additionalComments = '';
                            }

                            let emailContext = Object.assign({}, interviewConfirmation);
                            emailContext.html = emailContext.html
                                .replace('-candidateName-', candidateName)
                                .replace('-interviewAddress-', interviewAddress)
                                .replace('-confirmedIntDate-', confirmedIntDate)
                                .replace('-confirmedIntTime-', confirmedIntTime)
                                .replace('-jobTitle-', jobTitle)
                                .replace('-additionalComments-', additionalComments);

                            emailContext.to = agencyEmail;
                            mailgun.messages().send(emailContext, (err, agencyEmailed) => {
                                if (err) {
                                    console.log(err);
                                    return reply(false);
                                }
                                if (agencyEmailed) {
                                    emailContext.to = clientEmail;
                                    mailgun.messages().send(emailContext, (err, clientEmailed) => {
                                        if (err) {
                                            console.log(err);
                                            return reply(false);
                                        }
                                        if (clientEmailed) {
                                            // need for harness talent interviews as they don't have an interview.
                                            if (nextStage === undefined) {
                                                return reply(true);
                                            }
                                            moveToNextInterviewStage(cvid, vid, nextStage, interviewId, (res) => {
                                                if (res) {
                                                    return reply(true);

                                                } else {

                                                    return reply(false); // this will reply false for harness talent as there are no stages.
                                                }
                                            });

                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    ]);
    return next();
};

exports.register.attributes = {
    name: 'interviews'
};
