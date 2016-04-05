'use strict';

const client = require('../client.js');

module.exports = (payload, id, callback) => {

  let email = payload.email;
  payload.id = id;
  payload.type = 'agency';

  client.hmsetAsync(id, payload)
    .then(() => {
      client.saddAsync('agencyEmails', email)
      .then(() => {
        callback(true);
      });
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
