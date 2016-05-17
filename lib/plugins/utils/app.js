'use strict';

const app = module.exports = {};

const mailgun           = require('./mailgun.js');
const accounting        = require('accounting');
const emailAdmin        = mailgun.emailAdmin;

app.isAdmin = (id, arr) => {
  return arr.indexOf(id) !== -1;
};

app.getName = (credentials) => {
  let fullName  = '';
  let firstName = credentials.profile.name.first;
  let surname   = credentials.profile.name.last;

  if (firstName && surname) {
    fullName += firstName + ' ' + surname;
  }
  return fullName;
};

app.cleanPayload = (payload) => {
  if (payload.salary) {
     payload.salary= accounting.formatMoney(payload.salary, '£', 0);
  }
  if(payload.logo_url) {
    payload.logo_url = payload.logo_url.split('?')[0];
  }

  let finish = Object.keys(payload).length;
  let count =0;

  for (var i in payload) {
    count++;
    if ((payload[i] === '')|| (typeof(payload[i]) == 'undefined')  ) {
      delete payload[i];
    }
    if(count === finish){
      return payload; 
    }  
  } 
};

app.emailAdminForGenericCV = (payload, user, callback) => {

  user === 'candidate' ? emailAdmin.subject = 'A candidate submitted their CV' : emailAdmin.subject = 'An agency submitted a generic candidate';

  emailAdmin.html = app.formatEmailToAdminForGenericCV(payload);
  mailgun.messages().send(emailAdmin, (error) => {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

app.sendInterviewTimes = (interview) => {

  mailgun.proposedInterview.html = mailgun.proposedInterview.html
      .replace('-candidateName-', interview.candidateName)
      .replace('-jobTitle-', interview.jobTitle)
      .replace('-companyName-', interview.companyName)
      .replace('-interviewId-', interview.interviewId);

  mailgun.messages().send(mailgun.proposedInterview, (error, body) => {
      if (error) {
          console.log(error);
      } else {
          console.log(body);
      }
  });

};

app.formatEmailToAdminForGenericCV = (payload) => {
  let fileUrl = payload.file_url;
  let html    = '<h1>Candidate Info</h1>';
  delete payload.file_name;
  delete payload.file_url;

  for (var i in payload) {
    let formattedKey = app.formatCandidateKeys(i);
    html += '<br>' + formattedKey + ': ' + payload[i];
  }

  html += '<br><h4>The candidate\'s CV is downloadable <a href="' + fileUrl + '">here</a></h4>';
  return html;
};

app.formatCandidateKeys = (i) => {
  let keys = {
    candidateName: 'Name',
    jobTitle: 'Job Title',
    email: 'Email',
    contactNumber: 'Number',
    salary: 'Salary',
    linkedInProfile: 'LinkedIn'
  };
  return keys[i] ? keys[i] : i;
};

app.formatReason = (reason) => {
  let result = {
    not_right: "The client said your candidate didn't have the right experience for the role",
    not_enough: "The client said your candidate didn't have enough experience for the role",
    defaultReason: ''
  };
  return result[reason] ? result[reason] : result["defaultReason"];
};
