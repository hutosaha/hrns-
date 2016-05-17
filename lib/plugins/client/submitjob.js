'use strict';

const uuid   = require('uuid');
const moment = require('moment');

const submitJobSchema = require('../utils/joiSchema.js').submitJobSchema;
const notifyAgencies  = require('../utils/mailgun.js').notifyAgenciesOfNewJob;
const getSetMembers   = require('../../db/redis.js').getSetMembers;
const frontendInput   = require('../utils/joiSchema.js').frontendInput;

const cleanPayload    = require('../utils/app.js').cleanPayload;
const mailgun         = require('../utils/mailgun.js');
const addJob          = require('../../db/redis.js').addJob;

exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/submitjob',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let layout = { layout: 'client' };
                let opts   = { 
                        title: 'Submit Job', 
                        frontendInput: frontendInput                        
                    };
                reply.view('submitjob', opts, layout);
            }
        }
    }, {
        method: 'POST',
        path: '/submitjob',
        config: {
            auth: {
                strategy: 'hrns-cookie'
            },
            validate: {
                payload: submitJobSchema
            },
            handler: (request, reply) => {
                let layout  = { layout: 'client' };
                let opts    = { title: 'Submit Job', frontendInput: frontendInput };
                let vid     = uuid.v1()+'vid';
                let id      = request.auth.credentials.profile.id;
                let payload = cleanPayload(request.payload);
                payload.vid = vid;
                payload.clientId = id;
                payload.dateSubmitted =  moment().format('llll').slice(0,-8);
                if (payload.searchDeadline === payload.dateSubmitted) { 
                    payload.searchDeadline = 'None specified'; 
                }

                addJob(payload, id, vid, (res) => {
                    if (res) {
                        getSetMembers('agencyEmails', (res) => {
                            if (res) {
                                res.forEach((elem) => {
                                  notifyAgencies.to = elem;
                                  mailgun.messages().send(notifyAgencies, (error, body) => { console.log('mailgun >>>', body); });
                                });
                                opts.message = 'Great job! Your vacancy will go live on Harness in 24 hours, and you can expect to start seeing CV’s in 48 hours. Now sit back and relax, let us do the hard work!';
                                reply.view('message', opts, layout);
                            } else {
                                opts.message = 'Sorry, something went wrong, please try <a href="/submitjob">again</a>';
                                reply.view('message', opts, layout);
                            }
                        });
                    } else {
                        opts.title   = 'Sorry...';
                        opts.message = 'Sorry, something went wrong, please try <a href="/submitjob">again</a>';
                        reply.view('submitjob', opts, layout);
                    }
                });
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SubmitJob'
};
