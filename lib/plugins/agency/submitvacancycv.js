'use strict';

const addCVagainstVacancy   = require('../../db/redis.js').addCVagainstVacancy;
const submitCandidateSchema = require('../utils/joiSchema.js').submitCandidateSchema;
const getHashKeyValue       = require('../../db/redis.js').getHashKeyValue;

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
                let opts = { title: 'Submitted CV!', message: 'Thank you for submitting a candidate!' };
                let layout = { layout: 'agency' };
                let agencyId = request.auth.credentials.profile.id;
                let payload = request.payload;
                getHashKeyValue(agencyId, 'companyName', (res) => {

                    payload.agencyName = res;
                    payload.agencyId   = agencyId;
                    payload.vid        = request.params.vid;
                    addCVagainstVacancy(payload, request.params.vid, (res) => {
                        if (res) {
                            reply.view('message', opts, layout);
                        } else {
                            opts.title = 'Sorry...';
                            opts.message = 'Sorry, something went wrong, please try again...';
                            reply.view('message', opts, layout);
                        }
                    });
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'SubmitVacancyCv'
};
