'use strict';

const addCVagainstVacancy   = require('../../db/redis.js').addCVagainstVacancy;
const submitCandidateSchema = require('../utils/joiSchema.js').submitCandidateSchema;
const getHash               = require('../../db/redis.js').getHash;

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
                let opts     = { title: 'Submitted CV!', message: 'Thank you for submitting a candidate! Feel free to add <a href="/agency/job/' + vid + '">another!</a>' };
                let layout   = { layout: 'agency' };
                let agencyId = request.auth.credentials.profile.id;
                let payload  = request.payload;
                getHash(agencyId, (res) => {

                    payload.agencyEmail = res.email;
                    payload.agencyName  = res.companyName;
                    payload.agencyId    = agencyId;
                    payload.vid         = vid;
                    addCVagainstVacancy(payload, vid, (res) => {
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
