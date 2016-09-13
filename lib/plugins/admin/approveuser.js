'use strict';

const client            = require('../../db/client.js');
const approvedUser      = require('../utils/mailgun').approvedUser;
const rejectedUser      = require('../utils/mailgun').rejectedUser;
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


                client.hget(id, 'contactName', (err, res) => {
                  if (res) {            

                    let firstName = res.split(' ')[0];

                    if (verdict === 'approve') {
                        addRemoveFromSets('approvedUsers', 'awaitingApproval', id, (res) => {
                            if (res) {
                                 let newApprovedUser =Object.assign({}, approvedUser);

                                 newApprovedUser.to = request.params.email;                                   
                                 newApprovedUser.html = newApprovedUser.html
                                    .replace('-firstName-', firstName);
                                 mailgun.messages().send(newApprovedUser );
                                 reply('Approval successful!'); // this isn't dependent on sending email. 
                            } else {
                                opts.message = 'Sorry, something went wrong, please go <a href="/admindashboard">home</a> and try again';
                                reply.view('message', opts);
                            }
                        });
                    } else {
                        addRemoveFromSets('rejectedUsers', 'awaitingApproval', id, (res) => {
                            if (res) {
                                let contextEmail  = Object.assign({}, rejectedUser);
                                
                                contextEmail.to   = request.params.email;
                                contextEmail.html = contextEmail.html.replace('-firstName-', firstName);
                                mailgun.messages().send(contextEmail); // this isn't dependent on sending email. 
                                reply('Rejection successful!');
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
