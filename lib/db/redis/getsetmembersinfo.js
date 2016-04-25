'use strict';

const client = require('../client.js');

module.exports = (set, callback) => {

  let data = [];

  client.smembersAsync(set)
    .each((user) => {
      return client.hgetallAsync(user)
        .then((userObj) => {
          data.push(userObj);
        });
    })
    .then(() => {
      if (data.length === 0) {
        callback(false);
      } else {
        callback(data);
      }
    })
    .catch(() => {
      callback(false);
    });
};
