'use strict';


//const sendInterviewTimes = require('./utils/app.js').sendInterviewTimes;
const cleanPayload = require('./utils/app.js').cleanPayload;
const client = require('../db/client.js');
const getInterviewDetails = require('../db/redis/getInterviewDetails.js');
const moveToNextInterviewStage = require('../db/redis/moveToNextInterviewStage');
const uuid = require('uuid');

const mailgun = require('./utils/mailgun.js');
const interviewConfirmation = require('./utils/mailgun.js').interviewConfirmation;

exports.register = (server, options, next) => {

    server.route([

        {
            method: 'POST',
            path: '/interview/proposed',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: ['client', 'agent']
                },
                handler: (request, reply) => {
                    ///  must update stage in db;
                    const interview = request.payload;


                    const interviewId = uuid.v1() + 'interviewId';
                    interview.interviewId = interviewId;
                    interview.confirmed = false;
                    mailgun.proposedInterview.to = interview.agencyEmail;

                    getInterviewDetails(interview, (res) => {
                        if (res) {
                            mailgun.proposedInterview.html = mailgun.proposedInterview.html
                                .replace('-candidateName-', interview.candidateName)
                                .replace('-jobTitle-', interview.jobTitle)
                                .replace('-companyName-', interview.companyName)
                                .replace('-interviewId-', interview.interviewId);

                            mailgun.messages().send(mailgun.proposedInterview, (error, body) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(body);
                                    client.hmset(interviewId, interview, (err,res) => {
                                        if(err){
                                            console.log('err', err);
                                            return reply(false);
                                        }
                                        if(res){
                                            console.log('res',res);
                                            return reply(true);
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
            path: '/interview/confirmation/{interviewId}', /// route for email response. 
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: ['client', 'agency']
                },
                handler: (request, reply) => {
                    let layout = { layout: 'default' };
                    let opts = {};

                    let interviewId = request.params.interviewId;
                
                    client.hgetall(interviewId, (err, res) => {

                        if (res.confirmed === 'false') {
                            opts = res;
                          
                            opts.interviewId = interviewId;
                            opts.title = 'Interview Page';
                            let cleanedPayload = cleanPayload(opts);
                            return reply.view('interview', cleanedPayload, layout);

                        } else {
                       
                            opts.title = 'Interview Page';
                            opts.message = 'This link has expired';
                            return reply.view('message', opts, layout);
                        }


                    });

                }
            }
        }, {
            method: 'POST',
            path: '/change/interview',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: ['client', 'agent']
                },
                handler: (request, reply) => {
                    const userType = request.auth.credentials.type;
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

                            mailgun.changeInterview.to = email;

                            mailgun.changeInterview.html = mailgun.changeInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-interviewId-', interviewData.interviewId);

                            mailgun.messages().send(mailgun.changeInterview, (error, body) => {
                                if (error) {
                                    reply(false);
                                } else if (body) {

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
                auth: {
                    strategy: 'hrns-cookie',
                    scope: ['client', 'agency']
                },
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
                                .replace('-jobTitle-',jobTitle);

                            if(typeof additionalComments === 'undefined') {
                              additionalComments ='<h3>'+additionalComments+'</h3>';
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
                                            moveToNextInterviewStage(cvid, vid, nextStage, interviewId, (res)=>{
                                                if(res) {
                                                    return reply(true);

                                                }else {
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
