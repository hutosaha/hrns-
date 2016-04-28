'use strict';

const emailAgencyOnClientShortlistRejection = require('../utils/app.js').emailAgencyOnClientShortlistRejection;
const emailAgencyOnClientShortlistAcceptance = require('../utils/mailgun.js').emailAgencyOnClientShortlistAcceptance;
const mailgun = require('../utils/mailgun.js');
const getVacancyDetails = require('../../db/redis.js').getVacancyDetails;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const removeVacancy = require('../../db/redis.js').removeVacancy;
const removeCV = require('../../db/redis.js').removeCV;
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const client = require('../../db/client.js');
const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/client/job/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let vid = request.params.vid;
                    let opts = { title: 'Job page', vid: vid };

                    getVacancyDetails(vid, (res) => {
                        if (res) {
                            opts.data = res;
                            let shortlist = vid + 'clientShortlist';
                            getSetMembersInfo(shortlist, (res) => {
                                if (res) {
                                    opts.cvs = res;
                                } else {
                                    opts.message = 'There are no candidates submitted against this Vacancy';
                                }
                                reply.view('clientjob', opts, layout);
                            });

                        } else {
                            opts.message = 'Sorry, something went wrong, please try again';
                            reply.view('message', opts, layout);
                        }
                    });
                }
            }
        }, {
            method: 'GET',
            path: '/client/job/remove/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let opts = { title: 'Removal successful!' };
                    let vid = request.params.vid;
                    let id = request.state.user.profile.id;

                    removeVacancy(vid, id, (res) => {
                        if (res) {
                            opts.message = 'You have successfully removed this vacancy... Return <a href="/client">home</a>';
                        } else {
                            opts.title = 'Sorry...';
                            opts.message = 'Something went wrong, please go back and try <a href="/client">again</a>';
                        }
                        reply.view('message', opts, layout);
                    });
                }
            }
        }, {
            method: 'GET',
            path: '/client/job/reject',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let agencyEmail = request.query.email;
                    let reason = request.query.reason;
                    let vid = request.query.vid;
                    let cvid = request.query.cvid;
                    let set = vid + 'clientShortlist';

                    emailAgencyOnClientShortlistRejection(agencyEmail, vid, cvid, reason, (res) => {
                        if (res) {
                            removeCV(cvid, set, (res) => {

                                if (res) {
                                    reply(true);
                                } else {
                                    reply(false);
                                }
                            });
                        } else {

                            reply(false);
                        }
                    });
                }
            }
        }, {
            method: 'GET',
            path: '/client/job/accept',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let agencyEmail = request.query.email;
                    let agencyId = request.query.agencyId;
                    let vid = request.query.vid;
                    let cvid = request.query.cvid;
                    let candidateName = request.query.candidateName;
                    let jobTitle = request.query.jobTitle;
                    let emailContext = emailAgencyOnClientShortlistAcceptance;

                    emailContext.to = agencyEmail;
                    emailContext.subject = 'Great news!' + candidateName + ' has been accepted';

                    emailContext.html = emailContext.html.replace('-candidateName-', candidateName);
                    emailContext.html = emailContext.html.replace('-jobTitle-', jobTitle);
                    // add stage number to cvid hash.

                    //add cvid to agencySchdeulingCvs()  ?????? o or vid to agencyScheduling

                    client.sadd(agencyId + 'agencyScheduling', vid, (err, res) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('agencyScheduling', res);
                        }
                    });

                    // add cvid to scheduling vidstageOne. remove from vidclientShortlist

                    addRemoveFromSets(vid + 'stageOne', vid + 'clientShortlist', cvid, (res) => {
                        if (res) {
                            // email agency candidate has been accepted.
                            mailgun.messages().send(emailContext);
                            // add stage number to cvid hash.
                            client.hset(cvid, 'stage', 'stageOne', (err, res) => {
                                if (res) {
                                    reply(true);
                                } else {
                                    reply(false);
                                }
                            });




                        } else {
                            reply(false);
                        }
                    });

                }
            }
        }


    ]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
