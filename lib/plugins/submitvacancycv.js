'use strict';

exports.register = (server, options, next) => {

    server.route({

        method: 'POST',
        path: '/submitvacancycv/{cvid*}',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let payload = request.payload;
                const name = payload.candidateName;
                const cv = payload.cv;

                reply('Thank you for your CV' + '' + cv + '' + name);

            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'SubmitVacancyCv'
};
