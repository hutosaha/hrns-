'use strict';
const addCVagainstVacancy = require('../db/redis.js').addCVagainstVacancy;


const submitCandidateSchema = require('./utils/joiSchema.js').submitCandidateSchema;

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
              

                addCVagainstVacancy(request.payload, request.params.vid, (res)=>{
                    console.log('RES adding CV',res);
                });

                reply.view('agencyjob', {
                         message: 'Thank you for Submitting, feel free to submit another'
                     });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'SubmitVacancyCv'
};
