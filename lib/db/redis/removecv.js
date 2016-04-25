'use strict';

const client = require('../client.js');

module.exports = (cvid, set, callback) => {

  client.delAsync(cvid)
    .then(() => {
      client.srem(set, cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch(() =>  {
      callback(false);
    });
};
