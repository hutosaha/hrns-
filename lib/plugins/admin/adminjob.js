'use strict';

const emailClientOnAdminVacancyRemoval = require('../utils/mailgun.js').emailClientOnAdminVacancyRemoval;
const emailAgencyForAdminAcceptance    = require('../utils/mailgun.js').emailAgencyForAdminAcceptance;
const emailClientAboutNewCandidates    = require('../utils/mailgun.js').emailClientAboutNewCandidates;
const emailAgencyForAdminRejection     = require('../utils/mailgun.js').emailAgencyForAdminRejection;
const getSetMembersInfo                = require('../../db/redis.js').getSetMembersInfo;
const getVacancyDetails                = require('../../db/redis.js').getVacancyDetails;
const removeVacancy                    = require('../../db/redis.js').removeVacancy;
const adminApproveCV                   = require('../../db/redis.js').adminApproveCV;
const removeCV                         = require('../../db/redis.js').removeCV;
const getHash                          = require('../../db/redis.js').getHash;

const client  = require('../../db/client.js');
const mailgun = require('../utils/mailgun.js');
const layout  = { layout: 'admin' };

exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/admin/job/{vid}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let vid  = request.params.vid;
                let opts = { title: 'Job page', vid: vid };

                getVacancyDetails(vid, (res) => {
                  if (res) {
                    let shortlist    = vid + 'adminShortlist';
                    opts.clientEmail = res.clientEmail;
                    opts.data        = res;

                    getSetMembersInfo(shortlist, (res) => {
                        if (res) {
                          opts.cvs = res;
                        } else {
                          opts.message ='There are no candidates for you to approve at the moment... come back when there are!';
                        }
                        reply.view('adminjob', opts, layout);
                    });
                  } else {
                    opts.message = 'Sorry, something went wrong, please try again';
                    return reply.view('message', opts, layout);
                  }
                });
            }
        }
    }, {
        method: 'GET',
        path: '/admin/job/remove/{vid}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts = { title: 'Sorry...', message: 'Something went wrong, please go back and try <a href="/adminvacancies">again</a>' };
                let vid = request.params.vid;

                getVacancyDetails(vid, (res) => {
                    if (res) {
                      let clientEmail  = res.clientEmail;
                      let clientId     = res.clientId;
                      let jobTitle     = res.jobTitle;
                      opts.clientEmail = clientEmail;

                      emailClientOnAdminVacancyRemoval.to   = clientEmail;
                      emailClientOnAdminVacancyRemoval.html = emailClientOnAdminVacancyRemoval.html.replace('-jobTitle-', jobTitle);
                      mailgun.messages().send(emailClientOnAdminVacancyRemoval);

                      removeVacancy(vid, clientId, (res) => {
                          if (res) {
                              opts.title = 'Removal successful!';
                              opts.message = 'You have successfully removed this vacancy... Return <a href="/adminvacancies">home</a>';
                              reply.view('message', opts, layout);
                          }
                      });
                    } else {
                        reply.view('message', opts, layout);
                    }
                });
            }
        }
    }, {
      method: 'GET',
      path: '/admin/job/reject',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
            let agencyEmail = request.query.agencyEmail;
            let cvid        = request.query.cvid;
            let vid         = request.query.vid;
            let set         = vid + 'adminShortlist';

            emailAgencyForAdminRejection.to = agencyEmail;

            client.hget(cvid, 'candidateName', (err, res) => {
              if (res) {
                let candidateName = res;
                client.hgetall(vid, (err, res) => {
                  if (res) {
                    let companyName = res.companyName;
                    let jobTitle    = res.jobTitle;

                    emailAgencyForAdminRejection.html = emailAgencyForAdminRejection.html.replace('-candidateName-', candidateName).replace('-jobTitle-', jobTitle).replace('-companyName-', companyName);
                    mailgun.messages().send(emailAgencyForAdminRejection);

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
              } else {
                reply(false);
              }
            });
          }
        }
    }, {
      method: 'GET',
      path: '/rating/',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
            let agencyEmail = request.query.agencyEmail;
            let rating      = request.query.rating;
            let cvid        = request.query.cvid;
            let vid         = request.query.vid;

            getHash(vid, (res) => {
              if (!res) { return; }
                let jobTitle    = res.jobTitle;
                let companyName = res.companyName;

                getHash(cvid, (res) => {
                  if (!res) { return; }

                  let candidateName = res.candidateName;

                  emailAgencyForAdminAcceptance.to = agencyEmail;
                  emailAgencyForAdminAcceptance.html = emailAgencyForAdminAcceptance.html.replace('-candidateName-', candidateName).replace('-jobTitle-', jobTitle).replace('-companyName-', companyName);
                  mailgun.messages().send(emailAgencyForAdminAcceptance);
                });
            });

            adminApproveCV(cvid, vid, rating, (res) => {
              if (res) {
                reply(cvid);
              } else {
                 let message = 'Something went wrong... please try <a href="/admin/job/' + vid + '">again</a>';
                 reply(message);
              }
            });
          }
        }
    },{
      method: 'GET',
      path: '/admin/job/{vid}/{clientEmail}',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
            let opts        = { title: 'Success!' };
            let vid         = request.params.vid;
            let clientEmail = request.params.clientEmail;

            client.hget(vid, 'jobTitle', (err, res) => {
              if (res) {

                let jobTitle = res;
                emailClientAboutNewCandidates.to = clientEmail;
                emailClientAboutNewCandidates.html = emailClientAboutNewCandidates.html.replace('-jobTitle-', jobTitle);

                mailgun.messages().send(emailClientAboutNewCandidates, (error) => {
                  if (error) {
                    opts.message = 'Looks like something went wrong.... <a href="/admin/job/' + vid + '">Try again</a>...';
                    reply.view('message', opts, layout);
                  } else {
                    opts.message = 'Great! We\'ve notified the client of new candidates for this vacancy! Click <a href="/admin/job/' + vid + '">here</a> to go back to the vacancy page';
                    reply.view('message', opts, layout);
                  }
                });
              } else {
                opts.message = 'Looks like something went wrong.... <a href="/admin/job/' + vid + '">Try again</a>...';
                reply.view('message', opts, layout);
              }
            });
          }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'AdminJob'
};
