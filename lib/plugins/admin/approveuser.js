'use strict';

const client            = require('../../db/client.js');
const mailgun           = require('../utils/mailgun');
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/approveuser/{verdict}/{id}/{email}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts    = {};
                let id      = request.params.id;
                let verdict = request.params.verdict;

                mailgun.approvedUser.to = request.params.email;
                mailgun.rejectedUser.to = request.params.email;

                client.hget(id, 'contactName', (err, res) => {
                  if (res) {

                    let firstName = res.split(' ')[0];

                    if (verdict === 'approve') {
                        addRemoveFromSets('approvedUsers', 'awaitingApproval', id, (res) => {
                            if (res) {
                                 mailgun.approvedUser.html = mailgun.approvedUser.html.replace('-firstName-', firstName);
                                 mailgun.messages().send(mailgun.approvedUser);
                                 opts.message = 'Acceptance successful';
                                 reply.view('/approveusers', opts);
                            } else {
                                opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                                reply.view('message', opts);
                            }
                        });
                    } else {
                        addRemoveFromSets('rejectedUsers', 'awaitingApproval', id, (res) => {
                            if (res) {
                                mailgun.rejectedUser.html = mailgun.rejectedUser.html.replace('-firstName', firstName);
                                mailgun.messages().send(mailgun.rejectedUser);
                                opts.message = 'Rejection successful';
                                reply.view('/approveusers', opts);
                            } else {
                                opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                                reply.view('message', opts);
                            }
                        });
                    }
                  } else {
                    opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                    reply.view('message', opts);
                  }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'ApproveUser'
};
