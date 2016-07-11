'use strict';
const fs = require('fs');
const emailAgencyOnClientShortlistRejection = require ('../utils/mailgun.js').emailAgencyOnClientShortlistRejection;
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const formatReason = require('../utils/app.js').formatReason;
const removeCV = require('../../db/redis.js').removeCV;
const getHash = require('../../db/redis.js').getHash;


const mailgun = require('../utils/mailgun.js');
const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/client/scheduling/{vid}/{jobTitle}/{companyName}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: ['client', 'admin']
            },
            handler: (request, reply) => {
                const vid = request.params.vid;
                const jobTitle = request.params.jobTitle;
                const companyName = request.params.companyName;
                let opts = { title: 'Scheduling', vid: vid, jobTitle: jobTitle, companyName: companyName };
                let stagesArray = [vid + 'stageOne', vid + 'stageTwo', vid + 'stageThree', vid + 'stageFour'];
                let data = [];
                let count = 0;

                stagesArray.forEach((stageSet) => {
                    getSetMembersInfo(stageSet, (res) => {
                        if (res) {
                            data.push(res);
                        }
                        count++;
                        if (count === 4) {
                            let progressData = data.reduce(function(a, b) {
                                return a.concat(b);
                            }, []);
                            opts.data = progressData;
                            reply.view('scheduling', opts, layout);
                        }
                    });
                });
            }
        }
    }, {
        method: 'GET',
        path: '/client/scheduling/reject',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let agencyEmail = request.query.email;
                //let stage       = request.query.stage;
                let reason = request.query.reason;
                let vid = request.query.vid;
                let cvid = request.query.cvid;
                let list = request.query.list;
                let set;
              
                getHash(vid, (res) => {
                    if (!res) {
                        return reply(false);
                    }

                    let jobTitle = res.jobTitle;
                    let companyName = res.companyName;
                    console.log('cvid',cvid);
                    getHash(cvid, (res) => {
                        if (!res) {
                            return reply(false);
                        }

                        let candidateName = res.candidateName;
                        let formattedReason = formatReason(reason);

                        let agencyDetails = Object.assign({}, emailAgencyOnClientShortlistRejection);
                        agencyDetails.to = agencyEmail;
                    
                        agencyDetails.html = agencyDetails.html
                            .replace('-candidateName-', candidateName)
                            .replace('-jobTitle-', jobTitle)
                            .replace('-companyName-', companyName)
                            .replace('-formattedReason-', formattedReason);

                        mailgun.messages().send(agencyDetails);
                            if (list === 'clientShortlist') {
                                set = vid + list;
                            } else {
                                set = vid + res.stage;
                            }
                        removeCV(cvid, set, (res) => { // has to be here otherwise cvid won't exist for the above email function
                            if (res) {
                                reply(cvid);
                            } else {
                                reply(false);
                            }
                        });
                    });
                });
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'Scheduling'
};
