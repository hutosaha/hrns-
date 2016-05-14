'use strict';



const cleanPayload = require('./utils/app.js').cleanPayload;

const client = require('../db/client.js');

const mailgun = require('./utils/mailgun.js');

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
                    mailgun.proposedInterview.to = interview.agencyEmail;

                    const vid = interview.vid;
                    const cvid = interview.cvid;
                    const agencyId = interview.agencyId;

                    const interviewId = vid + cvid;
                    interview.interviewId = interviewId;

                    console.log('Interview', interview);

                    let sendInterviewTimes = (interview) => {

                        mailgun.proposedInterview.html = mailgun.proposedInterview.html
                            .replace('-candidateName-', interview.candidateName)
                            .replace('-jobTitle-', interview.jobTitle)
                            .replace('-companyName-', interview.companyName)
                            .replace('-interviewId-', interview.interviewId);

                        mailgun.messages().send(mailgun.proposedInterview, (error, body) => {
                            if (error) {
                                reply(false);
                            } else {
                                console.log(body);
                                client.sadd('interviews', interview.interviewId);
                                console.log('Interview', interview);
                                let cleanedPayload = cleanPayload(interview);
                                console.log('cleaned payload',cleanedPayload);
                                client.hmset(interview.interviewId, cleanedPayload, (err, res) => {
                                    if (error) {
                                        return reply(false);
                                    } else {
                                        return reply(res);
                                    }
                                });

                            }
                        });

                    };

                    client.hget(agencyId, 'companyName', (err, dbreply) => {
                        if (dbreply) {
                            interview.agencyName = dbreply;
                            sendInterviewTimes(interview);
                        } else {
                            console.log('error', err);
                        }

                    });

                }
            }
        }
        , {
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
                                interviewData.firstIntDate = newTimes.firstIntDate;
                                interviewData.firstIntTime = newTimes.firstIntTime;
                                interviewData.secondIntDate = newTimes.secondIntDate;
                                interviewData.secondIntTime = newTimes.secondIntTime;
                                interviewData.thirdIntDate = newTimes.thirdIntDate;
                                interviewData.thirdIntTime = newTimes.thirdIntTime;
                                interviewData.additionalComments = newTimes.additionalComments;
                                interviewData.interviewAddress = newTimes.interviewAddress;

                                mailgun.changeInterview.to = res;

                                mailgun.changeInterview.html = mailgun.changeInterview.html
                                    .replace('-candidateName-', interviewData.candidateName)
                                    .replace('-jobTitle-', interviewData.jobTitle)
                                    .replace('-interviewId-', interviewData.interviewId);

                                mailgun.messages().send(mailgun.changeInterview, (error, body) => {
                                    if (error) {
                                        reply(false);
                                    } else if (body) {

                                        let cleanedPayload = cleanPayload(interviewData);
                                        console.log('cleaned payload', cleanedPayload);

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
                        });
                    } else {
                        reply(false);

                    }
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
                    let opts = { title: 'Interview Page' };

                    let interviewId = request.params.interviewId;

                    client.hgetall(interviewId, (err, res) => {
                        opts = res;
                        client.hmget(res.cvid, 'email', 'contactNumber', (err, res) => {

                            opts.email = res[0];
                            opts.contactNumber = res[1];
                            opts.interviewId = interviewId;
                                               
                            let cleanedPayload =cleanPayload(opts);
                            reply.view('interview', cleanedPayload, layout);
                        });


                    });

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
                    let confirmedTime = request.query.confirmedTime;
                    let confirmedDate = request.query.confirmedDate;
                    let interviewId = request.query.interviewId;



                    client.hgetall(interviewId, (err, res) => {
                        if (err) {
                            return reply(false);
                        }
                        let vid = res.vid;
                        let cvid = res.cvid;
                        let nextStage = res.stage;
                        let agencyEmail = res.agencyEmail;
                        let clientEmail = res.clientEmail;
                        let candidateName = res.candidateName;
                        let interviewAddress = res.interviewAddress;
                        let additionalComments = res.additionalComments;

                        mailgun.interviewConfirmation = mailgun.interviewConfirmation.html
                            .replace('-candidateName-', candidateName)
                            .replace('-interviewAddress-', interviewAddress)
                            .replace('-confirmedDate', confirmedDate)
                            .replace('-additionalComments-', additionalComments)
                            .replace('-confirmedTime-', confirmedTime);

                        let agency = mailgun.interviewConfirmation;
                        let client = mailgun.interviewConfirmation;

                        agency.to = agencyEmail;
                        client.to = clientEmail;

                        mailgun.messages().send(agency, (err, reply) => {
                            if (err) {
                                console.log(err);
                                return reply(false);
                            }
                            if (reply) {
                                mailgun.messages().send(client, (err, reply) => {
                                    if (err) {
                                        console.log(err);
                                        return reply(false);
                                    }
                                    if (reply) {
                                        client.hget(cvid, 'stage', (err, dbreply) => {
                                            console.log('REPLY', reply);
                                            let currentStage = dbreply;
                                            let currentStageSet = vid + currentStage;
                                            let nextStageSet = vid + nextStage;

                                            client.smove(currentStageSet, nextStageSet, cvid, (err, dbreply) => {
                                                if (err) {
                                                    console.log(err);
                                                    return reply(false);
                                                }
                                                console.log(dbreply);
                                                return reply(true);
                                            });



                                        });

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
    name: 'interviews'
};
