'use strict';

const client = require('../client.js');

module.exports = ( set, callback) => {

  client.smembersAsync(set)
    .each((elem) => {
      client.exists(elem, (err, reply) => {
        if (!reply) {
          client.srem(set, elem);
        }
      })
    })
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};
