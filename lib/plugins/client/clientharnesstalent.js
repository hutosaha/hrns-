'use strict';

const getSetMembersInfo = require('../../db/redis.js').getSetMembersInfo;
const filterHarnessTalent = require('../utils/app.js').filterHarnessTalent;


exports.register = (server, options, next) => {

    server.route(
        [{
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
                    console.log('QUERY >>>>>>>>>>>>>', query);
                    let set = 'HarnessTalent';
                    let response = {};
                    response.userType = request.auth.type;

                    if (response.userType !== 'client') {
                        response.userType = 'admin';
                    }
                    getSetMembersInfo(set, (harnessTalentList) => {

                        if (Object.keys(harnessTalentList).length === 0 || Object.keys(query).length === 0) {
                            console.log('Initial Render and no query Render', Object.keys(harnessTalentList), query );
                            response.array = harnessTalentList;
                            reply(response);


                        } else {

                            function findKeysWithoutValueAll(query) {
                                let filterKeys = Object.keys(query).filter((key) => {
                                    return query[key] !== 'All'
                                });

                                return filterKeys

                            }

                            let filterKeys = findKeysWithoutValueAll(query);
                            console.log('FK', filterKeys);

                            function removeSalaryMinMax(keys) {
                                let lessMinMax = keys.filter((ele) => {
                                    return ele !== 'salaryMin' && ele !== 'salaryMax';
                                })
                                return lessMinMax;
                            }

                            let filterKeyExcSalary = removeSalaryMinMax(filterKeys);

                            // if all queris are 'All';
                            if(filterKeys.length === 0 ){                             
                                response.array = harnessTalentList
                                return reply(response);
                            }

                            // salary Max
                            if (filterKeyExcSalary.length === 0 && query.salaryMax !== 'All' && query.salaryMin === 'All') {

                                let candidatesFilteredOnlyMax = filterBySalaryMax(harnessTalentList, query);
                                response.array = candidatesFilteredOnlyMax;
                                return reply(response);
                            }

                            if( filterKeyExcSalary.length > 0 && query.salaryMax !=='All' && query.salaryMin === 'All'){
                                let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);
                                let candidatesFilteredOnlyMax = filterBySalaryMax(candidatesFilteredExcSalary, query);
                                response.array = candidatesFilteredOnlyMax;
                                return reply (response);
                            }

                        
                            // salary Min 
                            if (filterKeyExcSalary.length === 0 && query.salaryMin !== 'All' && query.salaryMax === 'All') {

                                let candidatesFilteredOnlyMin = filterBySalaryMin(harnessTalentList, query);
                                response.array = candidatesFilteredOnlyMin;
                                return reply(response);
                            }

                            if( filterKeyExcSalary.length > 0 && query.salaryMax ==='All' && query.salaryMin !== 'All'){
                                let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);
                                let candidatesFilteredOnlyMin = filterBySalaryMin(candidatesFilteredExcSalary, query);
                                response.array = candidatesFilteredOnlyMin
                                return reply (response);
                            }

                            // salary Range 

                            if (filterKeyExcSalary.length === 0 && query.salaryMin !== 'All' && query.salaryMax !== 'All') {
                                let candidatesFilteredByRange = filterBySalaryRange(harnessTalentList, query);
                                response.array = candidatesFilteredByRange;
                                return reply(response);
                            }

                            if(filterKeys.length > 0 && query.salaryMin !=='All' && query.salaryMax !== 'All'){
                                let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);
                                let candiatesFilteredByRange = filterBySalaryRange(candidatesFilteredExcSalary,query);
                                response.array = candiatesFilteredByRange;
                                return reply(response);
                            }

                            if(filterKeyExcSalary.length > 0 ){
                                let candidatesFiltered = harnessTalentList.filter(checkCandidate);
                                response.array = candidatesFiltered;
                                return reply(response);                          

                            }



                            function checkCandidate(candidate) {
                                for (var i = 0; i < filterKeyExcSalary.length; i++) {
                                    return candidate[filterKeyExcSalary[i]] === query[filterKeyExcSalary[i]] &&
                                        candidate[filterKeyExcSalary[i + 1]] === query[filterKeyExcSalary[i + 1]] &&
                                        candidate[filterKeyExcSalary[i + 2]] === query[filterKeyExcSalary[i + 2]] &&
                                        candidate[filterKeyExcSalary[i + 3]] === query[filterKeyExcSalary[i + 3]] &&
                                        candidate[filterKeyExcSalary[i + 4]] === query[filterKeyExcSalary[i + 4]]
                                }
                            }
                            
                            let candidatesFilteredExcSalary = harnessTalentList.filter(checkCandidate);

                            function filterBySalaryMax(array, query) {
                                let candidatesFiltered = array.filter((candidate) => {
                                    let salary = candidate.salary.split('£')[1].replace(/\,/g, '');
                                    salary = parseInt(salary);
                                    return salary <= query.salaryMax
                                })

                                return candidatesFiltered;
                            }

                            let candidatesFilteredOnlyMax = filterBySalaryMax(candidatesFilteredExcSalary, query);



                            function filterBySalaryMin(array, query) {
                                let candidatesFiltered = array.filter((candidate) => {
                                    let salary = candidate.salary.split('£')[1].replace(/\,/g, '');
                                    salary = parseInt(salary);
                                    return salary >= query.salaryMin
                                })

                                return candidatesFiltered;
                            }

                            let candidatesFilteredOnlyMin = filterBySalaryMin(candidatesFilteredExcSalary, query);

                            function filterBySalaryRange(array, query) {

                                let candidatesFiltered = array.filter((candidate) => {
                                    let salary = candidate.salary.split('£')[1].replace(/\,/g, '');
                                    salary = parseInt(salary);
                                    return salary >= query.salaryMin && salary <= query.salaryMax;
                                })
                                return candidatesFiltered;
                            }



                        }



                    });
                }
            }

        }]);
    return next();
};

exports.register.attributes = {
    name: 'Clientharnesstalent'
};
