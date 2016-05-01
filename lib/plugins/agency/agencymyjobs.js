'use strict';

const client = require('../../db/client.js');
const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;


exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/agency/myjobs',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'agency'
            },
            handler: (request, reply) => {
                let opts = { title: 'My Jobs' };
                let layout = { layout: 'agency' };
                const agencyId = request.auth.credentials.profile.id;

                let vacancies = agencyId + 'agencyScheduling';

                getSetMembersInfo(vacancies, (res) => {
                      opts.data = res;
                      reply.view('agencyjob', opts, layout);
                });

            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AgencyMyJobs'
};


// get vacancies and the stage of each application for the agency.
// get the list of vids with cvid submitted against
// get the details of each the vacancy 
// get every vid Stage set and check the numbers of each cvids with our agency naOfObjme (filter      

/*        getSetMembersInfo(agencyId+'agencyScheduling', (vacancies) =>{
            if(!vacancies){ 
                reply.view('agencymyjobs', null, layout);
              }

                  let count = 0;
            vacancies.forEach(function(vacancy, i){
                  let vid = vacancy.vid;
                  let stageSets  = [ vid+'stageOne', vid+'stageTwo', vid+'stageThree', vid+'stageFour'];
               
                  let finish = vacancies.length * 4;

                  let myCvsProgress = [];
                  let arrayCount =0;

                  stageSets.forEach(function(set) {
                        arrayCount ++;
                        count ++;                    
                       getSetMembersInfo( set, (cvs) => {
                            if(cvs){ 
                                let myCvs = cvs.filter(function(cv){
                                  return agencyId === cv.agencyId;     
                                });
                                myCvsProgress.push(myCvs.length);

                            } else {
                                myCvsProgress.push(0);                             
                            }
                     
                            if(arrayCount === 4) { 
                              vacancies[i].myCvsProgress = myCvsProgress;
                              myCvsProgress =[];
                              arrayCount =0;
                            }

                            
                            if( count === finish ){ 
                                opts.vacancies = vacancies;
                                reply.view('agencymyjobs', opts, layout);                                                 
                            }
                                        
                       });
                   
                  });   
            });
        });*/
