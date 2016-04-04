'use strict';

const app = module.exports = {};

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
