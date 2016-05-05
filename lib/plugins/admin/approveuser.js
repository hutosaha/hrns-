'use strict';

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
                let opts            = {};
                let id              = request.params.id;
                let verdict         = request.params.verdict;

                mailgun.approvedUser.to = request.params.email;
                mailgun.rejectedUser.to = request.params.email;

                // get firstName and put it in email html for approved & rejected

                if (verdict === 'approve') {
                    addRemoveFromSets('approvedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                             mailgun.messages().send(mailgun.approvedUser);
                             reply.redirect('/approveusers');
                        } else {
                            opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                            reply.view('message', opts);
                        }
                    });
                } else {
                    addRemoveFromSets('rejectedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                            mailgun.messages().send(mailgun.rejectedUser);
                            reply.redirect('/approveusers');
                        } else {
                            opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                            reply.view('message', opts);
                        }
                    });
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'ApproveUser'
};
