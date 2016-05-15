'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const client = require('../../db/client.js');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/adminvacancies',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'admin'
            },
            handler: (request, reply) => {
                let opts   = { title: 'All vacancies' };
                let layout = { layout: 'admin' };
                let jobsList = 'liveJobs';

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
                                return reply.view('adminvcancies', opts, layout);
                              }

                              vacancies[i]["stage" + j + "Count"] = dbreply;
                            
                              let adminShortlist = vid+'adminShortlist';
                              client.scard(adminShortlist, (err,dbreply) => {
                                  if (err) {
                                    opts.message = 'Sorry, something went wrong. Please try again.';
                                    return reply.view('adminvcancies', opts, layout);
                                  }
                                  vacancies[i]['submitted'] = dbreply;
                                  count++;
                                  if (count === finish) {
                                    opts.data = vacancies;
                                    return reply.view('adminvacancies', opts, layout);
                                  }               
                                });                            
                            });
                          });
                        });
                    } else {
                        opts.message = 'There are no libe vacancies at the moment!';
                        return reply.view('adminvacancies', opts, layout);
                    }
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminVacancies'
};
