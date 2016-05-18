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
          interviewData.clientCompanyName = clientData.companyName;
          interviewData.clientEmail =clientData.email;
          client.hgetallAsync( interviewData.agencyId)
            .then((agencyDetails) => {
              interviewData.agencyContactNumber = agencyDetails.contactNumber;
              interviewData.agencyContactName = agencyDetails.contactName;
              interviewData.agencyCompanyName = agencyDetails.companyName;
              interviewData.agencyEmail       = agencyDetails.email;
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
