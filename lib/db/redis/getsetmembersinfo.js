'use strict';

const client = require('../client.js');

module.exports = (set, callback) => {

  let userData = [];

  client.smembersAsync(set)
    .each((user) => {
      return client.hgetallAsync(user)
        .then((userObj) => {
          userData.push(userObj);
        });
    })
    .then(() => {
      if (userData.length === 0) {
        callback(false);
      } else {
        callback(userData);
      }
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
