'use strict';

const app = module.exports = {};

const getHash    = require('../../db/redis.js').getHash;
const mailgun    = require('./mailgun.js');
const emailAdmin = mailgun.emailAdmin;

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
  for (var i in payload) {
    if (payload[i] === '') {
      delete payload[i];
    }
  }
  return payload;
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

app.emailAgencyOnClientShortlistRejection = (agencyEmail, vid, cvid, reason, callback) => {
  let emailObj = {
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'Your candidate hasn\'t been approved by the client...'
  };
  let mailingList = ['hdrdavies@gmail.com', 'harness@harness.com']; // TODO change to admin email address
  mailingList.push(agencyEmail);

  getHash(vid, (res) => {
    if (res) {
      let jobTitle    = res.jobTitle;
      let companyName = res.companyName;

      getHash(cvid, (res) => {
        if (res) {
          let candidateName = res.candidateName;

          let formattedReason = app.formatReason(reason);

          emailObj.html = '<h1>Sorry to tell you...</h1>' +
                          '<p>' + candidateName + ' wasn\'t was quite right for the ' + jobTitle + ' vacancy at ' + companyName + '...</p>' +
                          '<p> ' + formattedReason + ' </p>' +
                          '<p>Come talk to us at harness@harness.com if you\'ve got any questions. See you soon!</p>'; // TODO change to admin email address

          mailingList.forEach((email) => {
            emailObj.to = email;
            mailgun.messages().send(emailObj);
          });

          callback(true);

        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  });
};

app.formatReason = (reason) => {
  let result = {
    not_right: "The client said your candidate didn't have the right experience for the role",
    not_enough: "The client said your candidate didn't have enough experience for the role",
    defaultReason: ''
  };
  return result[reason] ? result[reason] : result["defaultReason"];
};
