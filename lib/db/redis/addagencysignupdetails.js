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
        client.sadd('approvedUsers', id);
      })
      .then(() => {
        callback(true);
      });
    })
    .catch(() => {
      callback(false);
    });
};
