'use strict';
//const client =  require('../../db/client.js');
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
exports.register = (server, options, next) => {

  server.route({
    method: 'GET',
    path: '/agency/myjobs',
    config: {
      auth: {
        strategy: 'hrns-cookie',
        scope:'agency'
      },
      handler: (request, reply) => {
        let opts   = { title: 'My Jobs' };
        let layout = { layout: 'agency' };

        const agencyId = request.auth.credentials.profile.id;

        // get vacancies and the stage of each application for the agency.
       
       // get the list of vids with cvid submitted against
        // get the details of each the vacancy 
       // get every vid Stage set and check the numbers of each cvids with our agency naOfObjme (filter)
        
        getSetMembersInfo(agencyId+'agencyScheduling', (data) =>{
            opts.vacancies = data;

            data.forEach(function(vacancy){
                  let vid = vacancy.vid;
                  let stagelists  = [ vid+'stageOne', vid+'stageTwo', vid+'stageThree', vid+'stageFour'];

                  stagelists.forEach(function(list) {
                       getSetMembersInfo( list, (res) => {
                            let arrays = res.filter(function(cv){
                                 return agencyId === cv.agencyId;     
                            });
                            opts.stages = arrays.map(stage => stage.length);
                       });
                  });

            });

        });
    

        reply.view('agencymyjobs', opts, layout);

        }
      }
    });
  return next();
};

exports.register.attributes = {
  name: 'AgencyMyJobs'
};
