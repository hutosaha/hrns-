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

                    res.forEach((vacancy) => {

                        function numberOfCvsAtStage(stage) {

                            client.exists(vacancy.vid + stage, (err, res) => {
                                if (res) {
                                    getSetMembersInfo(vacancy.vid + stage, (res) => {
                                        let filteredArr = res.filter((cv) => {
                                            return agencyId === cv.agencyId;
                                        });
                                        vacancy[stage] = filteredArr.length;
                                    });
                                } else {
                                    vacancy[stage] = 0;

                                }
                            });
                        }

                        numberOfCvsAtStage('stageOne');
                        numberOfCvsAtStage('stageTwo');
                        numberOfCvsAtStage('stageThree');
                        numberOfCvsAtStage('stageFour');
                    });
                });
                reply.view('agencymyjobs',opts,layout);
            }
        }

    });
    return next();
};

exports.register.attributes = {
    name: 'AgencyMyJobs'
};



/*
                        client.exists(vacancy.vid+'stageTwo', (err,res)=>{
                          if (res){
                            getSetMembersInfo(vacancy.vid+'stageTwo', (res) =>{
                                    let filteredArr = res.filter( (cv) => {
                                        return agencyId ===  cv.agencyId ;
                                    });
                                    vacancy.stageTwo = filteredArr.length;
                            });
                          } else {
                            vacancy.stageTwo = 0;

                          }              
                     

                        });
                        client.exists(vacancy.vid+'stageThree', (err, res)=>{
                          if (res){
                            getSetMembersInfo(vacancy.vid+'stageThree', (res) =>{
                                    let filteredArr = res.filter( (cv) => {
                                        return agencyId ===  cv.agencyId ;
                                    });
                                    vacancy.stageThree = filteredArr.length;
                            });
                          } else {
                            vacancy.stageThree = 0;

                          }              
                     

                        });
                        client.exists(vacancy.vid+'stageFour', (err, res)=>{
                          if (res){
                            getSetMembersInfo(vacancy.vid+'stageFour', (res) =>{
                                    let filteredArr = res.filter( (cv) => {
                                        return agencyId ===  cv.agencyId ;
                                    });
                                    vacancy.stageFour = filteredArr.length;
                            });
                          } else {
                            vacancy.stageFour = 0;

                          }              
                     

                        });
                   
                       });
                      */

//  reply.view('agencymyjobs', opts, layout);


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
