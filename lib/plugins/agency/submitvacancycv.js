'use strict';

const emailAdminForVacancyCV = require('../utils/mailgun.js').emailAdminForVacancyCV;
const submitCandidateSchema  = require('../utils/joiSchema.js').submitCandidateSchema;
const addCVagainstVacancy    = require('../../db/redis.js').addCVagainstVacancy;
const cleanPayload           = require('../utils/app.js').cleanPayload;
const getHash                = require('../../db/redis.js').getHash;
const mailgun                = require('../utils/mailgun.js');
const uuid                   = require('uuid');

exports.register = (server, options, next) => {

    server.route({
        method: 'POST',
        path: '/submitvacancycv/{vid}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            validate: {
              payload: submitCandidateSchema
            },
            handler: (request, reply) => {
                let vid      = request.params.vid;
                let opts     = { title: 'Submitted CV!', message: 'Good job! We will be in touch shortly to let you know if your candidate has been accepted. Feel free to add <a href="/agency/job/' + vid + '">another!</a>' };
                let layout   = { layout: 'agency' };
                let agencyId = request.auth.credentials.profile.id ;
                let payload  = request.payload;

                payload.agencyId = agencyId;
                payload.vid      = vid;

               getHash(agencyId, (res) => {
                 if (res) {
                   let agencyName = res.companyName;

                   payload.agencyEmail = res.email;
                   payload.agencyName  = agencyName;

                   getHash(vid, (res) => {

                     let jobTitle = res.jobTitle;
                     let companyName = res.companyName;

                     emailAdminForVacancyCV.html = emailAdminForVacancyCV.html.replace('-jobTitle-', jobTitle).replace('-companyName-', companyName).replace('-agencyName-', agencyName);
                     mailgun.messages().send(emailAdminForVacancyCV);

                   });

                   let cvid =  uuid.v1() + 'cvid';

                   payload.cvid = cvid;

                   let cleanedPayload = cleanPayload(payload);

                   addCVagainstVacancy(cleanedPayload, cvid, vid,(res) => {
                       if (res) {
                           reply.view('message', opts, layout);
                       } else {
                           opts.title = 'Sorry...';
                           opts.message = 'Sorry, something went wrong, please try <a href="/agency/job/' + vid + '">again...</a>';
                           reply.view('message', opts, layout);
                       }
                   });
                 } else {
                   opts.title = 'Sorry...';
                   opts.message = 'Sorry, something went wrong, please try <a href="/agency/job/' + vid + '">again...</a>';
                   reply.view('message', opts, layout);
                 }
              });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'SubmitVacancyCv'
};
