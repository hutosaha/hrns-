'use strict';

const client                        = require('../../db/client.js');
const getSetMembersInfo             = require('../../db/redis.js').getSetMembersInfo;
const mailgun                       = require('../utils/mailgun.js');
const adminApprovedForHarnessTalent = require('../utils/mailgun.js').adminApprovedForHarnessTalent;
const adminRejectedForHarnessTalent = require('../utils/mailgun.js').adminRejectedForHarnessTalent;

exports.register = (server, options, next) => {

    server.route([
        {        method: 'GET',
                path: '/admin/harnesstalent',
                config: {
                    auth: {
                      strategy:'hrns-cookie'
                    },
                    handler: (request, reply) => {
                      let layout = { layout: 'admin' };

                          let set = 'HarnessTalent';
                          getSetMembersInfo(set, (res)=> {
                            let opts ={};
                            if(res){
                              opts.data = res;
                              reply.view('harnesstalent', opts, layout);
                            }else{
                               opts.message = 'There is no talent get recruiting';
                               reply.view('harnesstalent', opts, layout);
                            }
                          });
                    }
                }
              },
  {            method: 'GET',
            path: '/adminharnesstalent',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'admin'
                },
                handler: (request, reply) => {
                    let opts = { title: 'Harness Talent' };
                    let layout = { layout: 'admin' };

                    getSetMembersInfo('HarnessTalentAdminShortList', (res) => {
                        if (res) {
                            opts.data = res;
                        } else {
                            opts.message = 'There are no new Harness Talent- please come back later.';
                        }
                        reply.view('adminharnesstalent', opts, layout);
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/harnesstalent/accpeted/{cvid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'admin'
                },
                handler: (request, reply) => {
                    let cvid = request.params.cvid;

            // add cvid to harnesstalent remove from Harness talent Admin Shortlist // agency shortlist remove
                     client.hgetAsync(cvid, 'agencyId')
                        .then((agencyId) => {
                            client.srem(agencyId+'HarnessTalentShortList', cvid);
                        })
                        .then(() => {
                            client.smoveAsync('HarnessTalentAdminShortList','HarnessTalent', cvid );
                        })
                        .then(()=>{
                            mailgun.messages().send(adminApprovedForHarnessTalent);
            // email agency candidate has been accepted to harness talent.
                        })
                        .then(()=>{
                            return reply('You have approved this candidate for Harness Talent');
                        })
                        .catch(()=>{
                            return reply('There was an error accepting this candidate try again');
                        });
                }
            }
        },
        {
            method: 'GET',
            path: '/harnesstalent/reject',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'admin'
                },
                handler: (request, reply) => {
                    let cvid     = request.query.cvid;
                    // let reason   = request.query.reason
                    console.log('QUERY', request.query);
            // remove from Harness talent Admin Shortlist // agency shortlist remove
                     client.hgetAsync(cvid, 'agencyId')
                        .then((agencyId) => {
                            client.srem(agencyId+'HarnessTalentShortList', cvid);
                        })
                        .then(() => {
                            client.srem('HarnessTalentAdminShortList', cvid );
                        })
                        .then(()=>{
                            mailgun.messages().send(adminRejectedForHarnessTalent);
            // email agency candidate has been rejected to harness talent.
                        })
                        .then(()=>{
                            return reply('You have rejected this candidate for Harness Talent');
                        })
                        .catch(()=>{
                            return reply('There was an error rejecting this candidate try again');
                        });
                }
            }
        }
    ]);
    return next();
};

exports.register.attributes = {
    name: 'adminharnesstalent'
};
