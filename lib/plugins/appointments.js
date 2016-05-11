'use strict';

const emailAgencyOnClientShortlistRejection = require('./utils/mailgun.js').emailAgencyOnClientShortlistRejection;
const addRemoveFromSets                     = require('../db/redis.js').addRemoveFromSets;
const getSetMembersInfo                     = require('../db/redis.js').getSetMembersInfo;
const getHashKeyValue                       = require('../db/redis.js').getHashKeyValue;
const setHashKeyValue                       = require('../db/redis.js').setHashKeyValue;
const formatReason                          = require('./utils/app.js').formatReason;
const cleanPayload                          = require('./utils/app.js').cleanPayload;
const sortInterviewPayload                  = require('./utils/app.js').sortInterviewPayload;
const removeCV                              = require('../db/redis.js').removeCV;
const getHash                               = require('../db/redis.js').getHash;
const client                                = require('../db/client.js');


const mailgun = require('./utils/mailgun.js');
const layout  = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
          method: 'POST',
          path: '/scheduling/appointment',
          config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request,reply) => {
                const interview = request.payload;
                mailgun.proposedInterview.to = interview.agencyEmail;
                
                const vid  = interview.vid
                const cvid = interview.cvid

                const appointmentId = vid + cvid
                interview.appointmentId = appointmentId;
                
                client.sadd('appointments',appointmentId);
                
                let sendInterviewTimes = (interview) => {

                    mailgun.proposedInterview.html = mailgun.proposedInterview.html
                        .replace('-candidateName-', interview.candidateName)
                        .replace('-jobTitle-', interview.jobTitle)
                        .replace('-companyName-', interview.companyName) 
                        .replace('-appointmentId-', interview.appointmentId)             

                    mailgun.messages().send(mailgun.proposedInterview , (error, body) => {
                        if (error) {
                          reply(false);
                        } else { 
                          reply(true);
                        }
                    });
                    
                }
                sendInterviewTimes(interview);
                
                cleanPayload(interview , (res) => {
                        client.hmset(appointmentId, res);
                });
        


            }
          }
        },
        {
          method: 'GET',
          path: '/scheduling/appointment/confirmation/{appointmentId}',
          config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client', 'agency']
            },
            handler: (request,reply) => {
                let layout = { layout: 'default'};
                let opts   = { title: 'Interview Page'}

                let appointmentId = request.params.appointmentId;
                client.hgetall(appointmentId, (err,res)=>{
                    opts = res;
                    client.hmget(res.cvid, 'email','contactNumber', (err ,res) => {
                        console.log('in confirmation appointment',res);
                        opts.email = res[0];
                        opts.contactNumber = res[1];
                        reply.view('interview', opts, layout);          
                    })
                            

                })

            }
          }
        }
    ]);
    return next();
};

exports.register.attributes = {
    name: 'Appointments'
};
