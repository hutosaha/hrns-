'use strict';

const client = require('../client.js');

module.exports = (payload, cvid, vid, callback) => {

  client.hmsetAsync(cvid, payload)
    .then(() => {
      client.sadd(vid + 'adminShortlist', cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
