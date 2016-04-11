'use strict';

const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const mailgun = require('../utils/mailgun');

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
                let opts      = {};
                const id      = request.params.id;
                const email   = request.params.email;
                const verdict = request.params.verdict;
                mailgun.approved.to = email;
                mailgun.rejected.to = email;

                if (verdict === 'approve') {
                    addRemoveFromSets('approvedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                             mailgun.messages().send(mailgun.approved, (error, body) => {console.log('mailgunBody', body);});
                             reply.redirect('/approveusers');
                        } else {
                            opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                            reply.view('message', opts);
                        }
                    });
                } else {
                    addRemoveFromSets('rejectedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                            mailgun.messages().send(mailgun.rejected, (error, body) => console.log(body));
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
