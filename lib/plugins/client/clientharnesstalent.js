'use strict';

const getSetMembersInfo   = require('../../db/redis.js').getSetMembersInfo;
const filterHarnessTalent = require('../utils/app.js').filterHarnessTalent;


exports.register = (server, options, next) => {

    server.route(
        [
            {
                method: 'GET',
                path: '/harnesstalent',
                config: {
                    auth: {
                        strategy: 'hrns-cookie'
                    },
                    handler: (request, reply) => {
                        reply.file('./public/views/harnesstalent.html')
                    }
                }
            }, {
                method: 'GET',
                path: '/harnesstalent/results',
                config: {
                    auth: {
                        strategy: 'hrns-cookie'
                    },
                    handler: (request, reply) => {
                        let query = request.query
                        console.log('QUERY >>>>>>>>>>>>>', typeof query.salaryMin );
                        let set = 'HarnessTalent';
                        let response = {};
                        response.userType = request.auth.type;
                       
                        if(response.userType !== 'client'){
                            response.userType = 'admin';
                        }
                        getSetMembersInfo(set, (harnessTalentList) => {
                           
                            if(Object.keys(harnessTalentList).length === 0  || Object.keys(query).length === 0) {
                                console.log('Hello null' , harnessTalentList), query;
                                response.array = harnessTalentList;
                                reply(response);
                               

                            } else {

                                function findKeysWithoutValueAll(query){
                                    let filterKeys = Object.keys(query).filter((key) => {
                                        return query[key] !== 'All'
                                    });
                                   
                                    return filterKeys
                                   
                                 }

                                let filterKeys = findKeysWithoutValueAll(query) ;

                                function removeSalaryMinMax(keys){
                                     let lessMinMax = keys.filter((ele) => {
                                        return ele !== 'salaryMin' && ele !== 'salaryMax';
                                    })
                                    return lessMinMax;
                                }
                                 
                                let filterKeyExcSalary = removeSalaryMinMax(filterKeys);

                                if ( filterKeyExcSalary.length === 0 && query.salaryMax !== 'All'){
                            
                                    let candidatesFilteredOnlyMax = fitlerBySalaryMax(harnessTalentList, query);
                                    response.array = candidatesFilteredOnlyMax;
                                    reply(response);   
                                }


                                function checkCandidate(candidate ){
                                    for(var i =0; i< filterKeyExcSalary.length; i++){
                                        return  candidate[filterKeyExcSalary[i]] === query[filterKeyExcSalary[i]] && 
                                                candidate[filterKeyExcSalary[i+1]]===query[filterKeyExcSalary[i+1]] &&
                                                candidate[filterKeyExcSalary[i+2]]===query[filterKeyExcSalary[i+2]] &&
                                                candidate[filterKeyExcSalary[i+3]]===query[filterKeyExcSalary[i+3]] &&
                                                candidate[filterKeyExcSalary[i+4]]===query[filterKeyExcSalary[i+4]]  
                                    }
                                }
                                let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);

                                function fitlerBySalaryMax(candidatesFilteredExcSalary , query){
                                        let candidatesFiltered = candidatesFilteredExcSalary.filter((candidate)=>{
                                                    let salary = candidate.salary.split('£')[1].replace(/\,/g, '');
                                                    salary = parseInt(salary);
                                                    return  salary <= query.salaryMax
                                        })

                                        return candidatesFiltered; 
                                }

                                let candidatesFilteredOnlyMax = fitlerBySalaryMax(candidatesFilteredExcSalary, query);                                             

                            
                                
                                function fitlerBySalaryMin(){

                                }

                                function fitlerBySalaryRange (){

                                }


                                //response.array = candidatesFilteredOnlyMax;
                               // reply(response);                                    

                            }

                             /*   function filterHarnessTalent(){
                                    let filterKeys = Object.keys(query).filter((key) => {
                                         return query[key] !== 'All' 
                                    });
                                    let checkCandidate = (candidate, i) => {
                                    /// for each key in the array filter the data and return an array 
                                       if( filterKeys.length === 0 ){ return true}
                                       for(var i =0; i< filterKeys.length; i++){
                                         
                                            if ( filterKeys[i] === 'salaryMin' || filterKeys[i] === 'salaryMax'){
                                                delete filterKeys[i];
                                            console.log('Filter', filterKeys, filterKeys[i] ,candidate[filterKeys[i]]);
                                            }

                                            return candidate[filterKeys[i]] === query[filterKeys[i]] && 
                                                   candidate[filterKeys[i+1]]===query[filterKeys[i+1]] &&
                                                   candidate[filterKeys[i+2]]===query[filterKeys[i+2]] &&
                                                   candidate[filterKeys[i+3]]===query[filterKeys[i+3]] &&
                                                   candidate[filterKeys[i+4]]===query[filterKeys[i+4]] &&
                                                   candidate[filterKeys[i+5]]===query[filterKeys[i+5]] 
                                        }
                                    }
                                    let filteredResponse = harnessTalentList.filter(checkCandidate);
                                    console.log('filtered Response', filteredResponse );

                                    let filteredBySalary = filteredResponse.filter((candidate) => {
                                        var salary = candidate.salary.split('£')[1].replace(/\,/g, '');
                                        var salary = parseInt(salary);
                                        console.log('SALARY', query.salaryMin, salary, query.salaryMax);
                                        return salary >= query.salaryMin;
                                    })
                                    console.log('Salary Checker' , filteredBySalary);

                                    return filteredBySalary // filteredResponse;
                                }
                                response.array = filterHarnessTalent();*/

                                             
                        });
                    }
                }

            }
        ]);
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
