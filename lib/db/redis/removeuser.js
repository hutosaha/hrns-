'use strict';

const client = require('../client.js');

module.exports = (id, set, callback) => {

  client.delAsync(id)
  .then(() => {
      client.srem(set, id);
    })
    .then(() => {
      client.srem('approvedUsers', id);
    })
    .then(() => {
      callback(true);
    })
    .catch(() =>  {
      callback(false);
    });
};
