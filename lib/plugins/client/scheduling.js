'use strict';

const getSchedulingInfo = require('../../db/redis.js').getSchedulingInfo;
const getHash           = require('../../db/redis.js').getHash;
const layout = { layout: 'client' };

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/client/job/{vid}/scheduling',
            config: {
                auth: {
                    strategy: 'hrns-cookie',
                    scope: 'client' // admin scope aswell? (HUW)
                },
                handler: (request, reply) => {
                  let vid  = request.params.vid;
                  let opts = { title: 'Scheduling', vid: vid };

                  getHash(vid, (res) => {
                    if (res) {
                      opts.jobTitle = res.jobTitle;
                      getSchedulingInfo(vid, (res) => {
                        console.log('res', res);
                        if (res) {
                          opts.cvs = res;
                          reply.view('scheduling', opts, layout);
                        } else {
                          opts.message = 'Sorry, something went wrong. Please try <a href="/client/job/ ' + vid + '/scheduling">again</a>';
                          reply.view('message', opts, layout);
                        }
                      });
                    } else {
                      opts.message = 'Sorry, something went wrong. Please try <a href="/client/job/ ' + vid + '/scheduling">again</a>';
                      reply.view('message', opts, layout);
                    }
                  });
               }
            }
        }, {
          method: 'GET', // or POST?
          path: '/client/job/{vid}/scheduling/update',
          config: {
            auth: {
              strategy: 'hrns-cookie',
              scope: 'client'
            },
            handler: (request, reply) => {
              // update values in DB
              reply('Hello world');
            }
          }
        }]);
    return next();
};

exports.register.attributes = {
    name: 'Scheduling'
};
