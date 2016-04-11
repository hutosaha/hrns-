'use strict';

const app = module.exports = {};

const mailgun    = require('./mailgun.js');
const emailAdmin = require('./mailgun.js').emailAdmin;

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

app.emailAdmin = (payload, userType, callback) => {

  if (userType === 'candidate') {
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

  delete payload.file_name;
  delete payload.file_url;

  let html = '<h3>Candidate Info</h3>';

  for (var i in payload) {
    html += '<br>' + i + ': ' + payload[i];
  }

  html += '<br><h4>CV is located <a href="' + fileUrl + '">here</a></h4>';
  console.log('html', html);
  return html;
};
