'use strict';

const addRemoveFromSets = require('../db/redis.js').addRemoveFromSets;
const mailgun = require('./utils/mailgun');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/approveuser/{yesNo}/{id}/{email}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                console.log('RES', request.params);
                const id = request.params.id;
                const email = request.params.email;
                const yesNo = request.params.yesNo;
                mailgun.approved.to = email;

                if (yesNo === 'approve') {
                    addRemoveFromSets('approvedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                           mailgun.messages().send(mailgun.approved, (error, body) => console.log(body));
                           reply.redirect('/approveusers');
                        } else {
                            reply('Sorry, didn\'t work'); // change that
                        }
                    });
                } else {
                    /// reject user
                    addRemoveFromSets('rejectedUsers', 'awaitingApproval', id, (res) => {
                        if (res) {
                            mailgun.messages().send(mailgun.rejectedUser, (error, body) => console.log(body));
                            reply.redirect('/approveusers');
                        } else {
                            reply('Sorry, didn\'t work');
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
