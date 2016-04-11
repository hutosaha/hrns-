'use strict';

const addCVagainstVacancy   = require('../db/redis.js').addCVagainstVacancy;
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
                let opts = { title: 'Submitted CV!', message: 'Thank you for submitting a candidate!' };
                let layout = { layout: 'agency' };

                addCVagainstVacancy(request.payload, request.params.vid, (res) => {
                    if (res) {
                        reply.view('message', opts, layout);
                    } else {
                        opts.title = 'Sorry...';
                        opts.message = 'Sorry, something went wrong, please try again...';
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
