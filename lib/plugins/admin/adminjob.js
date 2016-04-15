'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const getVacancyDetails = require('../../db/redis.js').getVacancyDetails;
const removeVacancy = require('../../db/redis.js').removeVacancy;
const emailClient = require('../utils/app.js').emailClient;

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
                    opts.data = res;
                    let shortlist = vid + 'adminShortlist';

                    getSetMembersInfo(shortlist, (res) => {
                        if (res) {
                          console.log('res', res);
                          opts.cvs = res;
                        } else {
                          opts.message ='There are no candidates submitted against this job just yet... come back when there are!';
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
      path: '/admin/job/{vid}/reject/{agencyId}/{cvid}',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {

            // delete cvid in DB - redis + aws

            // remove from vid + adminShortlist set

            // email agency telling them who got rejected - needs agency email, candidate name


            // reply with message, with a link to return to the vacancy page
            reply('');

          }
        }
    }, {
      method: 'GET',
      path: '/admin/job/{vid}/accept/{rating}/{agencyId}/{cvid}',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
              let rating = request.params.rating;

              // email agency to tell them the candidate's been accepted

              // add the rating to the cvid, and add the cvid to the vid + 'clientShortlist' set
              reply('');
          }
        }
    }, {
      method: 'GET',
      path: '/admin/job/{vid}/{clientEmail}',
      config: {
          auth: {
              strategy: 'hrns-cookie',
              scope: 'admin'
          },
          handler: (request, reply) => {
            // notify client saying they've got new candidates for this vacancy

            // reply with message saying it's successful and with link back to vacancy page
            reply('');
          }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'AdminJob'
};
