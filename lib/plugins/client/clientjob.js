'use strict';

const fs = require('fs');
const client = require('../../db/client.js');
const mailgun = require('../utils/mailgun.js');
const layout = { layout: 'client' };

const emailAgencyOnClientShortlistAcceptance = require('../utils/mailgun.js').emailAgencyOnClientShortlistAcceptance;
const emailAgencyOnClientShortlistRejection = require('../utils/mailgun.js').emailAgencyOnClientShortlistRejection;
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const getHashKeyValue = require('../../db/redis.js').getHashKeyValue;
const getVacancyDetails = require('../../db/redis.js').getVacancyDetails;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const removeVacancy = require('../../db/redis.js').removeVacancy;
const formatReason = require('../utils/app.js').formatReason;
const removeCV = require('../../db/redis.js').removeCV;
const getHash = require('../../db/redis.js').getHash;

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
                                opts.message = 'There are no candidates for you to approve at the moment... come back when there are!';
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
                let cvid = request.query.cvid;
                let vid = request.query.vid;
                let set = vid + 'clientShortlist';

                getHash(vid, (res) => {
                    if (!res) {
                        return reply(false); }

                    let jobTitle = res.jobTitle;
                    let companyName = res.companyName;

                    getHash(cvid, (res) => {
                        if (!res) {
                            return reply(false); }

                        let candidateName = res.candidateName;
                        let formattedReason = formatReason(reason);

                        emailAgencyOnClientShortlistRejection.to = agencyEmail;
                        emailAgencyOnClientShortlistRejection.html = emailAgencyOnClientShortlistRejection.html.replace('-candidateName-', candidateName).replace('-jobTitle-', jobTitle).replace('-companyName-', companyName).replace('-formattedReason-', formattedReason);
                        mailgun.messages().send(emailAgencyOnClientShortlistRejection);

                        removeCV(cvid, set, (res) => { // has to be here otherwise cvid won't exist for the above email function
                            if (res) {
                                reply(true);
                            } else {
                                reply(false);
                            }
                        });
                    });
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
                let clientId = request.auth.credentials.profile.id;
                let agencyEmail = request.query.email;
                let emailContext = emailAgencyOnClientShortlistAcceptance;
                let candidateName = request.query.candidateName;

                emailContext.to = agencyEmail;
                emailContext.subject = 'Great news! ' + candidateName + ' has been accepted';

                client.sadd(agencyId + 'agencyScheduling', vid, (err) => {
                    if (err) {
                        reply(false);
                    } else {
                        addRemoveFromSets(vid + 'stageOne', vid + 'clientShortlist', cvid, (res) => {
                            if (res) {

                                client.hget(clientId, 'companyName', (err, res) => {
                                    let clientName = res;
                                    client.hget(agencyId, 'contactName', (err, res) => {
                                        let firstName = res.split(' ')[0];
                                        emailContext.html = emailContext.html.replace('-candidateName-', candidateName).replace('-jobTitle-', jobTitle).replace('-firstName-', firstName).replace('-clientName-', clientName);
                                        mailgun.messages().send(emailContext);
                                    });
                                });

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
    }, {
      method: 'GET',
      path: '/client/get-filename',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'client'
          },
          handler: (request, reply) => {
              let cvid = request.query.cvid;
              getHashKeyValue(cvid, 'file_name', (result) => {
                  reply(result);
              });
          }
      }
    }, {
      method: 'GET',
      path: '/client/file-exists',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'client'
          },
          handler: (request, reply) => {
              let cvid = request.query.cvid;
              getHashKeyValue(cvid, 'file_name', (result) => {
                  console.log(">>>>>>>>>>>>>>>>>>", result);
              })
          }
      }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
