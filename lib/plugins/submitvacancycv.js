'use strict';

const submitCandidateSchema = require('./utils/joiSchema.js').submitCandidateSchema;

exports.register = (server, options, next) => {

    server.route({

        method: 'POST',
        path: '/submitvacancycv/{vid}/{cvid*}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            validate: {
              payload: submitCandidateSchema
            },
            handler: (request, reply) => {
                let payload = request.payload;
                const name = payload.candidateName;
                const cv = payload.cv;

                reply('Thank you for ' + name + '\'s CV - ' + cv);

            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'SubmitVacancyCv'
};
