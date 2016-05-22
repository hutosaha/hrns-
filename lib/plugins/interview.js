'use strict';


//const sendInterviewTimes = require('./utils/app.js').sendInterviewTimes;
const cleanPayload             = require('./utils/app.js').cleanPayload;
const interviewSchema          = require('./utils/joiSchema.js').interviewSchema;
const client                   = require('../db/client.js');
const getInterviewDetails      = require('../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../db/redis/moveToNextInterviewStage');
const uuid                     = require('uuid');

const fs                       = require('fs');
const proposedInterview        = fs.readFileSync('./lib/emails/proposedInterview.html').toString();
const changeInterview          = fs.readFileSync('./lib/emails/changeInterview.html').toString();
const interviewConfirmation    = fs.readFileSync('./lib/emails/interviewConfirmation.html').toString();

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
                   
                    const interviewId = uuid.v1() + 'interviewId';
                    newTimes.interviewId = interviewId;
                    newTimes.confirmed = false;                  
                
                    getInterviewDetails(newTimes, (interviewData) => {

                        if (interviewData) {
                            let newProposedInterview ={};
                            newProposedInterview.html =  proposedInterview
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-companyName-', interviewData.clientCompanyName)
                                .replace('-interviewId-', interviewData.interviewId);

                            
                            newProposedInterview.subject = 'Great news!let\'s arrange an interview';
                            newProposedInterview.to = interviewData.agencyEmail;
                            newProposedInterview.from = 'Harness <me@samples.mailgun.org>';
                            
                            mailgun.messages().send(newProposedInterview, (error, body) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(body);

                                    client.hmset(interviewId, interviewData, (err, res) => { ///HMSET contains an undefined vlaue. 
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
                            let interviewData = res;

                            // add new times to interview object  compare objects if key value match overwrite.  
                            interviewData.firstIntDate = newTimes.firstIntDate;
                            interviewData.firstIntTime = newTimes.firstIntTime;
                            interviewData.secondIntDate = newTimes.secondIntDate;
                            interviewData.secondIntTime = newTimes.secondIntTime;
                            interviewData.thirdIntDate = newTimes.thirdIntDate;
                            interviewData.thirdIntTime = newTimes.thirdIntTime;
                            interviewData.additionalComments = newTimes.additionalComments;
                            interviewData.interviewAddress = newTimes.interviewAddress;
                            
                            let clientDetails ={};

                            clientDetails.to = interviewData.clientEmail;
                            clientDetails.subject = 'Re-arrange interview';
                            clientDetails.from = 'Harness <me@samples.mailgun.org>';
                            clientDetails.html  = changeInterview
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-interviewId-', interviewData.interviewId);

                            let agencyDetails ={};

                            agencyDetails.to = interviewData.agencyEmail;
                            agencyDetails.subject = 'Re-arrange interview';
                            agencyDetails.from = 'Harness <me@samples.mailgun.org>';
                            agencyDetails.html = changeInterview
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-interviewId-', interviewData.interviewId);                          

                            mailgun.messages().send(agencyDetails, (error, agencyReply) => {
                                if (error) {
                                    reply(false);
                                } else if (agencyReply) {
                                    mailgun.messages().send(clientDetails, (error, clientReply) => {
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

                            let agencyDetails = {} ;
                            agencyDetails.html = interviewConfirmation
                                .replace('-candidateName-', candidateName)
                                .replace('-interviewAddress-', interviewAddress)
                                .replace('-confirmedIntDate-', confirmedIntDate)
                                .replace('-confirmedIntTime-', confirmedIntTime)
                                .replace('-jobTitle-', jobTitle)
                                .replace('-additionalComments-', additionalComments);

                            agencyDetails.subject = 'Congratulations! Interview Confirmed.';
                            agencyDetails.from = 'Harness <me@samples.mailgun.org>';
                            agencyDetails.to = agencyEmail;

                            let clientDetails = {};
                            clientDetails.html = interviewConfirmation
                                .replace('-candidateName-', candidateName)
                                .replace('-interviewAddress-', interviewAddress)
                                .replace('-confirmedIntDate-', confirmedIntDate)
                                .replace('-confirmedIntTime-', confirmedIntTime)
                                .replace('-jobTitle-', jobTitle)
                                .replace('-additionalComments-', additionalComments);

                            clientDetails.subject = 'Congratulations! Interview Confirmed.';
                            clientDetails.from = 'Harness <me@samples.mailgun.org>';                        
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
