'use strict';

const emailAdminForGenericCV    = require('../utils/app.js').emailAdminForGenericCV;
const submitCandidateSchema     = require('../utils/joiSchema.js').submitCandidateSchema;
const frontendInput             = require('../utils/joiSchema.js').frontendInput;
const cleanPayload              = require('../utils/app.js').cleanPayload;
const calculateFee              = require('../utils/app.js').calculateFee;
const phoneNumber               = require('../utils/joiSchema.js').phoneNumber;
const url                       = require('../utils/joiSchema.js').url;
const emailAdminHarnessTalentCv = require('../utils/mailgun.js').emailAdminHarnessTalentCv;
const mailgun                   = require('../utils/mailgun.js');
const moment                    = require('moment');
const uuid                      = require('uuid');

const addCvToHarnessTalent   = require('../../db/redis/addcvtoharnesstalent.js');
const getHashKeyValue        = require('../../db/redis/gethashkeyvalue.js');
const client                 = require('../../db/client.js')

const layout = { layout: 'agency' };


exports.register = (server, options, next) => {

    server.route([{
        method: 'GET',
        path: '/agency/submitcandidate',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let opts = {
                    title: 'Submit Candidate',
                    frontendInput: frontendInput,
                    phoneNumber: phoneNumber,
                    url: url
                };
                reply.view('submitcandidate', opts, layout);
            }
        }
    }, {
        method: 'POST',
        path: '/agency/submitcandidate',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            validate: {
                payload: submitCandidateSchema
            },
            handler: (request, reply) => { /// this doesn't add candidate to database. 
                let id = request.auth.credentials.profile.id;
                let opts = {};
                let payload = cleanPayload(request.payload);  
              

                let cvid =  uuid.v1()+'cvid'; //payload.file_url.split(process.env.BUCKET_URL)[1];
                payload.cvid = cvid;
                payload.stage = 'waiting-approval';
                payload.agencyId = id;
                payload.fee =  calculateFee(payload.salary); 
                payload.interviewsRequested = 0;            

                client.hgetallAsync(id)
                  .then((agency)=>{
                    payload.agencyName = agency.companyName;
                    payload.agencyEmail = agency.email; 
                    payload.dateSubmitted = moment().format('llll').slice(0,-8);
                     console.log('agencyID', payload);
                  })
                  .then(()=>{
                     mailgun.messages().send(emailAdminHarnessTalentCv);
                  })
                  .then((res) => {
                    addCvToHarnessTalent(cvid, payload )
                  })
                  .then(() => {
                    opts.title = 'Success!';
                    opts.message = 'Thanks for submitting your candidate, admin will now check over your candidate!';
                    reply.view('message', opts, layout);
                  })
                  .catch(()=>{
                      let failMessage = 'Sorry, something went wrong... please try <a href="/agency/submitcandidate">again</a>'               
                      opts.title = 'Submission failed...';
                      opts.message = failMessage;
                      reply.view('message', opts, layout);
                  });
              }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SubmitCandidate'
};
