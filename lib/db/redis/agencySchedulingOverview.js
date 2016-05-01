'use strict';
/*
const client = require('../client.js');

module.exports = (agencyId, id, vid, callback) => {

  let data =[];
  let stageProgress =[];

  client.smembersAsync(agencyId+'agencyScheduling')
     .each((vacancy) => {
      return client.hgetallAsync(vacancy)
     .then((vacancies) => {
          let stageNoMatches = vacancies.filter((vacancy) => {
                   return agencyId === vacancy.agencyId;
          });          
      })
      .then((stageNoMatches) => {
        
      })
    .catch(() => {
      callback(false);
    });
};
*/