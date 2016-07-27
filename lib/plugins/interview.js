'use strict';

const cleanPayload             = require('./utils/app.js').cleanPayload;
const interviewSchema          = require('./utils/joiSchema.js').interviewSchema;
const client                   = require('../db/client.js');
const getInterviewDetails      = require('../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../db/redis/moveToNextInterviewStage');
const uuid                     = require('uuid');

const fs                       = require('fs');
const changeInterview          = require('./utils/mailgun.js').changeInterview;
const interviewConfirmation    = require('./utils/mailgun.js').interviewConfirmation;
const proposedInterview        = require('./utils/mailgun.js').proposedInterview;

const mailgun                  = require('./utils/mailgun.js');

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
                    ///  must update stage in db;
                    const newTimes = request.payload;
                    console.log('new times', newTimes);
                    const interviewId = uuid.v1() + 'interviewId';
                    newTimes.interviewId = interviewId;
                    newTimes.confirmed = false;

                    getInterviewDetails(newTimes, (interviewData) => {

                        if (interviewData) {

                            let newProposedInterview  = Object.assign({}, proposedInterview);

                            newProposedInterview.html = newProposedInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle) //switch to client jobTitle.
                                .replace('-companyName-', interviewData.clientCompanyName)
                                .replace('-interviewId-', interviewData.interviewId);

                            newProposedInterview.to = interviewData.agencyEmail;

                            mailgun.messages().send(newProposedInterview, (error, body) => {
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
                                            return reply(interviewData.cvid);
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

                            let interviewData = Object.assign(res,newTimes);

                            let emailContext =Object.assign({}, changeInterview)

                            emailContext.html  = changeInterview.html
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
                                            if(nextStage === undefined){
                                                return reply(true);
                                            }
                                            moveToNextInterviewStage(cvid, vid, nextStage, interviewId, (res) => {
                                                if (res) {
                                                    return reply(true);

                                                } else {

                                                    return reply(false); // this will reply false for harness talent as there is no stages.

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
