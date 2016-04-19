'use strict';

const app = module.exports = {};

const mailgun           = require('./mailgun.js');
const emailAdmin        = require('./mailgun.js').emailAdmin;
const basicEmail        = require('./mailgun.js').basicEmail;
const getHash           = require('../../db/redis.js').getHash;

app.isAdmin = (id, arr) => {
  return arr.indexOf(id) != -1;
};

app.getName = (credentials) => {

  let fullName = '';
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

app.emailAdmin = (payload, user, callback) => {
  if (user === 'candidate') {
      emailAdmin.subject = 'A candidate submitted their CV!';
  } else {
      emailAdmin.subject = 'An agency submitted a generic candidate!';
  }
  emailAdmin.html = app.formatEmailToAdmin(payload);
  mailgun.messages().send(emailAdmin, (error) => { // there's an optional 'body' argument but it doesn't seem needed here
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

app.formatEmailToAdmin = (payload) => {
  let fileUrl = payload.file_url;
  let html    = '<h3>Candidate Info</h3>';
  delete payload.file_name;
  delete payload.file_url;

  for (var i in payload) {
    html += '<br>' + i + ': ' + payload[i];
  }

  html += '<br><h4>The candidate\'s CV is downloadable <a href="' + fileUrl + '">here</a></h4>';
  return html;
};

app.emailClient = (clientEmail, jobTitle, callback) => {

    basicEmail.to      = clientEmail;
    basicEmail.subject = 'Your vacancy was deleted!';
    basicEmail.html    = '<h1>Sorry, your vacancy on Harness for a ' + jobTitle + ' has been deleted</h1>' +
                          '<br>' +
                          '<p>Either the information was inaccurate or the vacancy was idle, but we\'d love you to come back and submit another vacancy sometime!';
    mailgun.messages().send(basicEmail, (error) => {
      if (error) {
        callback(false);
      } else {
        callback(true);
      }
    });
};

app.emailAgencyForAdminRejection = (agencyEmail, vid, cvid, callback) => {
    let emailObj = {
      to: agencyEmail,
      from: 'Harness <me@samples.mailgun.org>',
      subject: 'Sorry, your candidate wasn\'t quite right for the role...'
    };

    getHash(vid, (res) => {
      if (res) {
        let jobTitle = res.jobTitle;
        let companyName = res.companyName;

        getHash(cvid, (res) => {
          if (res) {
            let candidateName = res.candidateName;

            emailObj.html = '<h1>Sorry...</h1>' +
                            '<p>We felt ' + candidateName + ' wasn\'t the right fit for the ' + jobTitle + ' vacancy at ' + companyName + '...</p>' +
                            '<p>Come talk to us at harness@harness.com if you\'ve got any questions. See you soon!</p>';

            mailgun.messages().send(emailObj, (error) => {
              if (error) {
                callback(false);
              } else {
                callback(true);
              }
            });
          } else {
            callback(false);
          }
        });
      } else {
        callback(false);
      }
    });
};

app.emailClientAboutNewCandidates = (clientEmail, vid, callback) => {
  let emailObj = {
    to: clientEmail,
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'New Candidates on Harness!'
  };

  getHash(vid, (res) => {
    if (res) {
      let jobTitle = res.jobTitle;

      emailObj.html = '<h1>You\'ve got new candidates to look at!</h1>' +
                      '<p>On your ' + jobTitle + ' vacancy we\'ve supplied you with a rated shortlist of potential candidates.</p>' +
                      '<p>Come have a <a href="localhost:8000/"> look!</a></p>'; // TODO change URL

      mailgun.messages().send(emailObj, (error) => {
        if (error) {
          callback(false);
        } else {
          callback(true);
        }
      });
    } else {
      callback(false);
    }
  });
};

app.emailAgencyForAdminAcceptance = (agencyEmail, vid, cvid, callback) => {
  let emailObj = {
    to: agencyEmail,
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'Your candidate was accepted!'
  };

  getHash(vid, (res) => {
    if (res) {
      let jobTitle    = res.jobTitle;
      let companyName = res.companyName;

      getHash(cvid, (res) => {
        if (res) {
          let candidateName = res.candidateName;

          emailObj.html = '<h1>Good news!...</h1>' +
                          '<p>' + candidateName + ' has been approved for the ' + jobTitle + ' vacancy at ' + companyName + '!</p>' +
                          '<p>The client will now be reviewing the candidate and tracking their progress. You\'ll now be able to see their progress in your \'My Jobs\'!' +
                          '<p>Come talk to us at harness@harness.com if you\'ve got any questions. See you soon!</p>';

          mailgun.messages().send(emailObj, (error) => {
            if (error) {
              callback(false);
            } else {
              callback(true);
            }
          });
        } else {
          callback(false);
        }
      });
    } else {
      callback(false);
    }
  });
};

app.emailClientShortlistRejection = (agencyEmail, vid, cvid, reason, callback) => {
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
                          '<p>Come talk to us at harness@harness.com if you\'ve got any questions. See you soon!</p>';

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
    not_right: 'The client said your candidate didn\'t have the right experience for the role',
    not_enough: 'The client said your candidate didn\'t have enough experience for the role',
    defaultReason: ''
  };
  return result[reason] ? result[reason] : result["defaultReason"];
};
