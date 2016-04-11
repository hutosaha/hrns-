'use strict';

const getVacancyDetails = require('../db/redis.js').getVacancyDetails;
const  removeVacancy  =require('../db/redis.js').removeVacancy;

exports.register = (server, options, next) => {

    server.route( [ {
            method: 'GET',
            path: '/client/job/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let opts = { title: 'Job page' };
                    let layout = { layout: 'client' };
                    let vid = request.params.vid;

                    getVacancyDetails(vid, (res) => {
                        if (res) {
                            opts.data = res;
                            reply.view('clientjob', opts, layout);
                        } else {
                            opts.title = 'Sorry...';
                            opts.message = 'Sorry, something went wrong, please go back try <a href="/client">again</a>';
                            reply.view('message', opts, layout);
                        }
                    });
                }
            }
        }, {
            method: 'GET',
            path: '/client/job/remove/{vid}',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client'
                },
                handler: (request, reply) => {
                    let opts    = { title: 'Job page' };
                    let layout  = { layout: 'client' };
                    let vid     = request.params.vid;
                    let id      = request.state.user.profile.id;

                    // remove vacnacy from db and sets 
                    removeVacancy(vid, id, (res) => {
                        if(res) {
                            opts.message = 'You have successfully removed this vacancy';
                        } else {
                            opts.message = 'Something went wrong ';
                        }
                        reply.view('message', opts, layout);
                    });
                }
            }
        }


    ]);
    return next();
};

exports.register.attributes = {
    name: 'ClientJob'
};
