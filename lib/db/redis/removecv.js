'use strict';

const client = require('../client.js');

module.exports = (cvid, set, callback) => {

client.srem(set, cvid)
    .then(() => {
      client.delAsync(cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch(() =>  {
      callback(false);
    });
};
