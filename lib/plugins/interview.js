'use strict';


//const sendInterviewTimes = require('./utils/app.js').sendInterviewTimes;
const cleanPayload             = require('./utils/app.js').cleanPayload;
const interviewSchema          = require('./utils/joiSchema.js').interviewSchema;
const client                   = require('../db/client.js');
const getInterviewDetails      = require('../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../db/redis/moveToNextInterviewStage');
const uuid                     = require('uuid');

const mailgun                  = require('./utils/mailgun.js');
const interviewConfirmation    = require('./utils/mailgun.js').interviewConfirmation;

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
                    let layout ={layout: 'client'};
                    
                    const newTimes = request.payload;
                    console.log('newtimes',newTimes);
                    const interviewId = uuid.v1() + 'interviewId';
                    newTimes.stage = newTimes.stage[1];
                    newTimes.interviewId = interviewId;
                    newTimes.confirmed = false;
                    

                    getInterviewDetails(newTimes, (interviewData) => {

                        if (interviewData) {
                            mailgun.proposedInterview.html = mailgun.proposedInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-companyName-', interviewData.clientCompanyName)
                                .replace('-interviewId-', interviewData.interviewId);

                            mailgun.proposedInterview.to = interviewData.agencyEmail;
                            mailgun.messages().send(mailgun.proposedInterview, (error, body) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(body);
                                    let opts ={};
                             
                                    client.hmset(interviewId, interviewData, (err, res) => { ///HMSET contains an undefined vlaue. 
                                        if (err) {
                                            console.log('err', err);
                                            opts.message = 'Sorry ther was a problem please try again';
                                            reply.view('message',opts, layout);
                                        }
                                        if (res) {
                                            console.log('res', res);
                                            opts.message = 'We\'ve sent the agency an email with your proposed appointments';
                                            reply.view('message',opts, layout);
                                            
                                        }
                                    });

                                }
                            });

                        } else {
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
                    const userType = 'agency'; // request.auth.credentials.type;
                    const newTimes = request.payload;
                    const interviewId = newTimes.interviewId;

                    if (interviewId) {
                        let email;


                        client.hgetall(interviewId, (err, res) => {
                            let interviewData = res;

                            if (userType === 'client') {
                                email = interviewData.clientEmail;
                            } else {
                                email = interviewData.agencyEmail;
                            }

                            // add new times to interview object  compare objects if key value match overwrite.  
                            interviewData.firstIntDate = newTimes.firstIntDate;
                            interviewData.firstIntTime = newTimes.firstIntTime;
                            interviewData.secondIntDate = newTimes.secondIntDate;
                            interviewData.secondIntTime = newTimes.secondIntTime;
                            interviewData.thirdIntDate = newTimes.thirdIntDate;
                            interviewData.thirdIntTime = newTimes.thirdIntTime;
                            interviewData.additionalComments = newTimes.additionalComments;
                            interviewData.interviewAddress = newTimes.interviewAddress;
                            console.log('interviewData', interviewData);

                            mailgun.changeInterview.to = email;

                            mailgun.changeInterview.html = mailgun.changeInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-interviewId-', interviewData.interviewId);

                            const clientEmail = mailgun.changeInterview;
                            clientEmail.to = interviewData.clientEmail;

                            const agencyEmail = mailgun.changeInterview;
                            agencyEmail.to = interviewData.agencyEmail;

                            mailgun.messages().send(agencyEmail, (error, agencyReply) => {
                                if (error) {
                                    reply(false);
                                } else if (agencyReply) {
                                    mailgun.messages().send(clientEmail, (error, clientReply) => {
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
                            console.log('Interview', res);
                            let vid = res.vid;
                            let cvid = res.cvid;
                            let nextStage = res.stage;
                            let agencyEmail = res.agencyEmail;
                            let clientEmail = res.clientEmail;
                            let candidateName = res.candidateName;
                            let interviewAddress = res.interviewAddress;
                            let additionalComments = res.additionalComments;
                            let jobTitle = res.jobTitle;

                            interviewConfirmation.html = interviewConfirmation.html
                                .replace('-candidateName-', candidateName)
                                .replace('-interviewAddress-', interviewAddress)
                                .replace('-confirmedIntDate', confirmedIntDate)
                                .replace('-confirmedIntTime-', confirmedIntTime)
                                .replace('-jobTitle-', jobTitle);

                            if (typeof additionalComments === 'undefined') {
                                additionalComments = '';
                                additionalComments = '<h3>' + additionalComments + '</h3>';
                                interviewConfirmation.html = interviewConfirmation.html.replace('-additionalComments-', additionalComments);
                            } else {
                                interviewConfirmation.html = interviewConfirmation.html.replace('-additionalComments-', additionalComments);
                            }

                            let agencyDetails = interviewConfirmation;
                            let clientDetails = interviewConfirmation;

                            agencyDetails.to = agencyEmail;
                            clientDetails.to = clientEmail;

                            mailgun.messages().send(agencyDetails, (err, agencyEmailed) => {
                                if (err) {
                                    console.log(err);
                                    return reply(false);
                                }
                                if (agencyEmailed) {
                                    mailgun.messages().send(clientDetails, (err, clientEmailed) => {
                                        if (err) {
                                            console.log(err);
                                            return reply(false);
                                        }
                                        if (clientEmailed) {
                                            moveToNextInterviewStage(cvid, vid, nextStage, interviewId, (res) => {
                                                if (res) {
                                                    return reply(true);

                                                } else {
                                                    return reply(false);
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
