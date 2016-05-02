'use strict';

const emailAgencyForAdminAcceptance = require('../utils/app.js').emailAgencyForAdminAcceptance;
const emailClientAboutNewCandidates = require('../utils/app.js').emailClientAboutNewCandidates;
const emailAgencyForAdminRejection  = require('../utils/app.js').emailAgencyForAdminRejection;
const getSetMembersInfo             = require('../../db/redis.js').getSetMembersInfo;
const getVacancyDetails             = require('../../db/redis.js').getVacancyDetails;
const removeVacancy                 = require('../../db/redis.js').removeVacancy;
const adminApproveCV                = require('../../db/redis.js').adminApproveCV;
const emailClient                   = require('../utils/app.js').emailClient;
const removeCV                      = require('../../db/redis.js').removeCV;

const layout = { layout: 'admin' };

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
                let vid = request.params.vid;
                let opts = { title: 'Job page', vid: vid };

                getVacancyDetails(vid, (res) => {
                  if (res) {
                    opts.clientEmail = res.clientEmail;
                    opts.data = res;
                    let shortlist = vid + 'adminShortlist';

                    getSetMembersInfo(shortlist, (res) => {
                        if (res) {
                          opts.cvs = res;
                        } else {
                          opts.message ='There are no candidates for you to approve at the moment... come back when there are!';
                        }
                        reply.view('adminjob', opts, layout);
                    });
                  } else { // test this else block
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

                        emailClient(clientEmail, jobTitle, (res) => {
                            if (res) {
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

            emailAgencyForAdminRejection(agencyEmail, vid, cvid, (res) => {
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
      path: '/rating/',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
              let vid         = request.query.vid;
              let rating      = request.query.rating;
              let agencyEmail = request.query.agencyEmail;
              let cvid        = request.query.cvid;
              let message = 'Something went wrong... please try <a href="/admin/job/' + vid + '">again</a>';

               adminApproveCV(cvid, vid, rating, (res) => {
                        if (res) {
                          reply(cvid);
                        } else {
                           reply(message);
                        }
               });

              emailAgencyForAdminAcceptance(agencyEmail, vid, cvid);
          }
        }
    }, 
    {
      method: 'GET',
      path: '/admin/job/{vid}/{clientEmail}',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
            let opts = { title: 'Success!' };
            let vid = request.params.vid;
            let clientEmail = request.params.clientEmail;
            emailClientAboutNewCandidates(clientEmail, vid, (res) => {
              if (res) {
                  opts.message = 'Great! We\'ve notified the client of new candidates for this vacancy! Click <a href="/admin/job/' + vid + '">here</a> to go back to the vacancy page';
                  reply.view('message', opts, layout);
              } else {
                  opts.title = 'Uh oh...';
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
