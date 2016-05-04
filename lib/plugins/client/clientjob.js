'use strict';

const client  = require('../../db/client.js');
const mailgun = require('../utils/mailgun.js');
const layout  = { layout: 'client' };

const emailAgencyOnClientShortlistAcceptance = require('../utils/mailgun.js').emailAgencyOnClientShortlistAcceptance;
const emailAgencyOnClientShortlistRejection  = require('../utils/app.js').emailAgencyOnClientShortlistRejection;
const addRemoveFromSets                      = require('../../db/redis.js').addRemoveFromSets;
const getVacancyDetails                      = require('../../db/redis.js').getVacancyDetails;
const getSetMembersInfo                      = require('../../db/redis.js').getSetMembersInfo;
const removeVacancy                          = require('../../db/redis.js').removeVacancy;
const removeCV                               = require('../../db/redis.js').removeCV;

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
                    let vid = request.query.vid;
                    let set = vid + 'clientShortlist';
                    let cvid = request.query.cvid;
                    let agencyEmail = request.query.email;
                    let reason = request.query.reason;

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
                    let vid = request.query.vid;
                    let cvid = request.query.cvid;
                    let agencyId = request.query.agencyId;
                    let jobTitle = request.query.jobTitle;
                    let agencyEmail = request.query.email;
                    let emailContext = emailAgencyOnClientShortlistAcceptance;
                    let candidateName = request.query.candidateName;

                    emailContext.to = agencyEmail;
                    emailContext.subject = 'Great news!' + candidateName + ' has been accepted';
                    emailContext.html = emailContext.html.replace('-candidateName-', candidateName).replace('-jobTitle-', jobTitle);

                    client.sadd(agencyId + 'agencyScheduling', vid, (err) => {
                        if (err) {
                            reply(false);
                        } else {
                          addRemoveFromSets(vid + 'stageOne', vid + 'clientShortlist', cvid, (res) => {
                              if (res) {
                                  mailgun.messages().send(emailContext);

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
                    });
                }
            }
        }]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
