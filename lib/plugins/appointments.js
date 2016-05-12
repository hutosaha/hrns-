'use strict';


const addRemoveFromSets = require('../db/redis.js').addRemoveFromSets;
const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;
const getHashKeyValue = require('../db/redis.js').getHashKeyValue;
const setHashKeyValue = require('../db/redis.js').setHashKeyValue;
const formatReason = require('./utils/app.js').formatReason;
const cleanPayload = require('./utils/app.js').cleanPayload;
const sortInterviewPayload = require('./utils/app.js').sortInterviewPayload;
const removeCV = require('../db/redis.js').removeCV;
const getHash = require('../db/redis.js').getHash;
const client = require('../db/client.js');
const moment = require('moment').locale();


const mailgun = require('./utils/mailgun.js');
const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
        method: 'POST',
        path: '/change/appointment',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client', 'agent']
            },
            handler: (request, reply) => {
                const userType = request.auth.credentials.type;
                const newTimes = request.payload;
                const interviewId = newTimes.appointmentId;

                if (interviewId) {
                    let email;
                    if (userType === 'client') {
                        email = 'clientEmail';
                    } else {
                        email = 'agencyEmail';
                    }

                    client.hgetall(interviewId, (err, res) => {
                        let interviewData = res;

                        client.hget(interviewData.vid, email, (err, res) => {
                            interviewData.clientEmail = res;
                                // add new times to interview object  compare objects if key value match overwrite.  
                            interviewData.firstDate = newTimes.firstDate;
                            interviewData.firstTime = newTimes.firstTime;
                            interviewData.secondDate = newTimes.secondDate;
                            interviewData.secondTime = newTimes.secondTime;
                            interviewData.thirdDate = newTimes.thirdDate;
                            interviewData.thirdTime = newTimes.thirdTime;
                            interviewData.additionalComments = newTimes.additionalComments;
                            interviewData.interviewAddress = newTimes.interviewAddress;

                            mailgun.changeInterview.to = res;

                            mailgun.changeInterview.html = mailgun.changeInterview.html
                                .replace('-candidateName-', interviewData.candidateName)
                                .replace('-jobTitle-', interviewData.jobTitle)
                                .replace('-appointmentId-', interviewData.appointmentId);

                            mailgun.messages().send(mailgun.changeInterview, (error, body) => {
                                if (error) {
                                    reply(false);
                                } else {

                                    let cleanedPayload = cleanPayload(interviewData);

                                    client.hmset(interviewData.appointmentId, cleanedPayload, (err, res) => {
                                        if (error) {
                                            console.log('ERROR');
                                            reply(false);
                                        } else {
                                            console.log('true');
                                            reply(true);
                                        }
                                    });

                                }
                            });


                        });
                    });
                } else {
                    reply(false);

                }
            }
        }
    }, {
        method: 'POST',
        path: '/scheduling/appointment',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client', 'agent']
            },
            handler: (request, reply) => {
                ///  must update stage in db;
                const interview = request.payload;
                mailgun.proposedInterview.to = interview.agencyEmail;


                const vid = interview.vid;
                const cvid = interview.cvid;

                const appointmentId = vid + cvid
                interview.appointmentId = appointmentId;


                let sendInterviewTimes = (interview) => {

                    mailgun.proposedInterview.html = mailgun.proposedInterview.html
                        .replace('-candidateName-', interview.candidateName)
                        .replace('-jobTitle-', interview.jobTitle)
                        .replace('-companyName-', interview.companyName)
                        .replace('-appointmentId-', interview.appointmentId)

                    mailgun.messages().send(mailgun.proposedInterview, (error, body) => {
                        if (error) {
                            reply(false);
                        } else {
                            console.log(body);
                            client.sadd('appointments', interview.appointmentId);

                            let cleanedPayload = cleanPayload(interview);

                            client.hmset(interview.appointmentId, cleanedPayload, (err, res) => {
                                if (error) {
                         
                                    reply(false);
                                } else {
                                    console.log(res);
                                    reply(true);
                                }
                            });

                        }
                    });

                }
                sendInterviewTimes(interview);
            }
        }
    }, {
        method: 'GET',
        path: '/scheduling/appointment/confirmation/{appointmentId}', /// route for email response. 
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client', 'agency']
            },
            handler: (request, reply) => {
                let layout = { layout: 'default' };
                let opts = { title: 'Interview Page' }

                let appointmentId = request.params.appointmentId;
                client.hgetall(appointmentId, (err, res) => {
                    opts = res;
                    client.hmget(res.cvid, 'email', 'contactNumber', (err, res) => {

                        opts.email = res[0];
                        opts.contactNumber = res[1];
                        opts.appointmentId = appointmentId;
                        reply.view('interview', opts, layout);
                    });


                });

            }
        }
    }, 
    {
        method: 'GET',
        path: '/appointment/confirmed', ///////this should be connected to confirmation button. 
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client','agency']
            },
            handler: (request, reply) => {
                let confirmedTime = request.query.confirmedTime;
                let confirmedDate = request.query.confirmedDate;
                let appointmentId = request.query.appointmentId;        

                client.hgetall(appointmentId, (err, res) => {
                    if (err) {
                        reply(false);
                    }
                    let vid = res.vid;
                    let cvid = res.cvid;
                    let nextStage = res.stage;
                    let agencyEmail = res.agencyEmail;
                    let clientEmail = res.clientEmail;
                    let candidateName = res.candidateName;
                    let interviewAddress = res.interviewAddress;
                    let additionalComments = res.additionalComments;

                    let nextStageSet = vid + '' + nextStage;            

                    mailgun.interviewConfirmation = mailgun.interviewConfirmation.html
                        .replace('-candidateName-', candidateName)
                        .replace('-interviewAddress-',interviewAddress)
                        .replace('-confirmedDate', confirmedDate)
                        .replace('-additionalComments-',additionalComments)
                        .replace('-confirmedTime-',confirmedTime);

                    let agency = mailgun.interviewConfirmation;
                    let client = mailgun.interviewConfirmation;

                    agency.to = agencyEmail;
                    client.to = clientEmail;

                        mailgun.messages().send(agency, (err,reply) => {
                            if(reply){ 
                                mailgun.messages().send(client, (err,reply) =>{
                                    if(reply) {
                                        console.log('REPLY',reply);

                                    }
                                });
                            }
                        });
                });
            }
        }
    }        
]);
    return next();
};

exports.register.attributes = {
    name: 'Appointments'
};
