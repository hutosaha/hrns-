'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const client = require('../../db/client.js');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/client',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let opts     = { title: 'My jobs' };
                let layout   = { layout: 'client' };
                let id       = request.state.user.profile.id;
                let jobsList = id + 'jobs';

                getSetMembersInfo(jobsList, (vacancies) => {

                    if (vacancies) {
                        let finish = vacancies.length * 4;
                        let count = 0;

                        vacancies.forEach((e, i) => {
                          let vid = e.vid;
                          let stages = [vid + 'stageOne', vid + 'stageTwo', vid + 'stageThree', vid + 'stageFour'];

                          stages.forEach((e, j) => {
                            j++;
                            client.scard(e, (err, dbreply) => {
                              if (err) {
                                opts.message = 'Sorry, something went wrong. Please try again.';
                                return reply.view('message', opts, layout);
                              }
                              vacancies[i]["stage" + j + "Count"] = dbreply;
                              count++;
                              if (count === finish) {
                                opts.data = vacancies;
                                return reply.view('client', opts, layout);
                              }
                            });
                          });
                        });
                    } else {
                        opts.message = 'You have no vacancies listed at current... Submit one <a href="/submitjob">here</a>';
                        return reply.view('client', opts, layout);
                    }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Client'
};
