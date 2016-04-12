'use strict';

const app = module.exports = {};

const mailgun           = require('./mailgun.js');
const emailAdmin        = require('./mailgun.js').emailAdmin;
const basicEmail        = require('./mailgun.js').basicEmail;

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
