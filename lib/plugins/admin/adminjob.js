'use strict';
const getSetMembersInfo  = require('../../db/redis.js').getSetMembersInfo;
const getVacancyDetails  = require('../../db/redis.js').getVacancyDetails;
const removeVacancy      = require('../../db/redis.js').removeVacancy;
const emailClient        = require('../utils/app.js').emailClient;

const layout = { layout: 'admin'};

exports.register = (server, options, next) => {

  server.route([{
    method: 'GET',
    path: '/admin/job/{vid}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'admin'
      },
      handler: (request, reply) => {
        let opts   = { title: 'Job page'};
        let vid    = request.params.vid;

        getVacancyDetails(vid, (res) => {
          if (res) {
            opts.data = res;
           // reply.view('adminjob', opts, layout);
          } else {
            opts.message = 'Sorry, something went wrong, please try again';
           // reply.view('adminjob', opts, layout);
          }
        });
        let shortlist = vid + 'adminShortlist';
        getSetMembersInfo(shortlist , (res)=>{
            if(res) {
              opts.cvs = res;
            } else {
              opts.message ='No CV\'s submitted against this job';
            }
            reply.view('adminjob', opts, layout);
        });
      }
    }
  }, {
    method: 'GET',
    path: '/admin/job/remove/{vid}',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope: 'admin'
      },
      handler: (request, reply) => {
          let opts = { title: 'Sorry...', message: 'Something went wrong, please go back and try <a href="/adminvacancies">again</a>'};
          let vid  = request.params.vid;

          getVacancyDetails(vid, (res) => {
            if (res) {
              let clientEmail = res.clientEmail;
              let clientId    = res.clientId;
              let jobTitle    = res.jobTitle;

              emailClient(clientEmail, jobTitle, (res) => {
                if (res) {
                  removeVacancy(vid, clientId, (res) => {
                      if (res) {
                          opts.title   = 'Removal successful!';
                          opts.message = 'You have successfully removed this vacancy... Return <a href="/adminvacancies">home</a>';
                          reply.view('message', opts, layout);
                      }
                  });
                } else {
                  reply.view('message', opts, layout);
                }
              });
            } else {
              reply.view('message', opts, layout);
            }
          });
      }
    }
  }]);
  return next();
};

exports.register.attributes = {
  name: 'AdminJob'
};
