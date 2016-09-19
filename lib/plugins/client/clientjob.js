'use strict';

const fs = require('fs');
const client = require('../../db/client.js');
const mailgun = require('../utils/mailgun.js');
const layout = { layout: 'client' };

const candidateAcceptedForScheduling = require('../utils/mailgun.js').candidateAcceptedForScheduling;
const addRemoveFromSets = require('../../db/redis.js').addRemoveFromSets;
const getVacancyDetails = require('../../db/redis.js').getVacancyDetails;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const removeVacancy = require('../../db/redis.js').removeVacancy;


exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/client/job/{vid}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let vid = request.params.vid;
                let opts = { title: 'Job page', vid: vid };

                getVacancyDetails(vid, (res) => {
                    if (res) {
                        opts.data = res;
                        let shortlist = vid + 'clientShortlist';
                        getSetMembersInfo(shortlist, (res) => {
                            if (res) {
                                opts.cvs = res;
                            } else {
                                opts.message = 'There are no candidates for you to approve at the moment... come back when there are!';
                            }
                            reply.view('clientjob', opts, layout);
                        });
                    } else {
                        opts.message = 'Sorry, something went wrong, please try again';
                        reply.view('message', opts, layout);
                    }
                });
            }
        }
    }, {
        method: 'GET',
        path: '/client/job/remove/{vid}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let opts = { title: 'Removal successful!' };
                let vid = request.params.vid;
                let id = request.state.user.profile.id;

                removeVacancy(vid, id, (res) => {
                    if (res) {
                        opts.message = 'You have successfully removed this vacancy... Return <a href="/client">home</a>';
                    } else {
                        opts.title = 'Sorry...';
                        opts.message = 'Something went wrong, please go back and try <a href="/client">again</a>';
                    }
                    reply.view('message', opts, layout);
                });
            }
        }
    }, {
        method: 'GET',
        path: '/client/job/accept',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let vid = request.query.vid;
                let cvid = request.query.cvid;
                let agencyId = request.query.agencyId;
                let jobTitle = request.query.jobTitle;
                let clientId = request.auth.credentials.profile.id;
                let agencyEmail = request.query.email;
                let candidateName = request.query.candidateName;
                
                client.sadd(agencyId + 'agencyScheduling', vid, (err) => {
                    if (err) {
                        reply(false);
                    } else {
                        addRemoveFromSets(vid + 'stageOne', vid + 'clientShortlist', cvid, (res) => {
                            if (res) {

                                client.hget(clientId, 'companyName', (err, res) => {
                                    let clientName = res;
                                    client.hget(agencyId, 'contactName', (err, res) => {
                                        if(res=== null){ 
                                         console.log('ERROR',res);
                                        } else {
                                            let firstName = res.split(' ')[0];
                                            
                                            let emailContext = Object.assign({},candidateAcceptedForScheduling);
                                            emailContext.to = agencyEmail;
                                            emailContext.subject = 'Great news! ' + candidateName + ' has been accepted';
                                            emailContext.html = emailContext.html
                                                .replace('-candidateName-', candidateName)
                                                .replace('-jobTitle-', jobTitle)
                                                .replace('-firstName-', firstName)
                                                .replace('-clientName-', clientName);
                                            mailgun.messages().send(emailContext);
                                        }
                                    });
                                });
                                // this should perhaps go inside email callback.  
                                client.hset(cvid, 'stage', 'stageOne', (err, res) => {
                                    if (res) {
                                        return reply(true);
                                    } else {
                                        return reply(false);
                                    }
                                });
                            } else {
                                return reply(false);
                            }
                        });
                    }
                });
            }
        }
    }, {
        method: 'GET',
        path: '/client/file-exists',
        config: {
            auth: {
                strategy: 'hrns-cookie',
            },
            handler: (request, reply) => {
                let cvUrl = request.query.cvUrl;
                
                let fileName = cvUrl.split(process.env.BUCKET_URL)[1];
                let filePath = './public/assets/downloads/';
                let existingFilesInDownload = fs.readdirSync(filePath);
                existingFilesInDownload.indexOf(fileName) > -1 ?
                    reply(fileName) : reply('notFound');
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
