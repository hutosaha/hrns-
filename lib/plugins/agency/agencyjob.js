'use strict';

const getVacancyDetails = require('../../db/redis.js').getVacancyDetails;
const frontendInput = require('../utils/joiSchema.js').frontendInput;
const url = require('../utils/joiSchema.js').url;
const phoneNumber = require('../utils/joiSchema.js').phoneNumber;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/agency/job/{vid}',
        config: {
            auth: {
                scope: 'agency'
            },
            handler: (request, reply) => {
                let opts = { title: 'Job page' };
                let layout = { layout: 'agency' };
                let vid = request.params.vid;
                opts.vid = vid;
                opts.url = url;
                opts.phoneNumber = phoneNumber;
                opts.frontendInput = frontendInput;

                getVacancyDetails(vid, (res) => {
                    if (res) {
                        opts.data = res;
                        reply.view('agencyjob', opts, layout);
                    } else {
                        opts.message = 'This job no longer exists. </br></br><a class="ui basic teal  button" href="/agency">Current live jobs</a>';
                        reply.view('message', opts);
                    }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AgencyJob'
};
