'use strict';

const client = require('../client.js');
const cleanPayload = require('../../plugins/utils/app.js').cleanPayload;

module.exports = ( newTimes, callback) => {
  let interviewData ={};
  interviewData = cleanPayload(newTimes);
  client.hgetallAsync(interviewData.vid)
    .then((vacancy) => {
   
        interviewData.jobTitle = vacancy.jobTitle; // reassign jobTitle to vacancy jobtitle.  
      client.hgetallAsync(vacancy.clientId)
       .then((clientData) => {
          interviewData = Object.assign(interviewData , clientData)
      
          
          client.hgetallAsync(interviewData.agencyId)
            .then((agencyDetails) => {
              interviewData = Object.assign(interviewData, agencyDetails)
          
            })
            .then(() => {
              callback(interviewData);   
            }) 
            .catch(() => {
              callback(false);
            });
        }) ;

    });     
   
};
