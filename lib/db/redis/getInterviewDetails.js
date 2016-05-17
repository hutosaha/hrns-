'use strict';

const client = require('../client.js');
const cleanPayload = require('../../plugins/utils/app.js').cleanPayload;

module.exports = ( interview, callback) => {

  let interviewData = cleanPayload(interview);
  client.hgetallAsync(interviewData.vid)
    .then((vacancy) => {
     
       client.hgetallAsync( vacancy.clientId)
       .then((clientData) => {
     
          interviewData.clientContactName =clientData.contactName;
          interviewData.companyName = clientData.companyName;
          interviewData.clientEmail =clientData.email;
          client.hgetallAsync( interviewData.agencyId)
            .then((agencyDetails) => {
              interviewData.agencyContactNumber = agencyDetails.agencyContactNumber;
              interviewData.agencyContactName = agencyDetails.contactName;
              interviewData.agencycompanyName = agencyDetails.companyName;
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
