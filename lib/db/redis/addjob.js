'use strict';

const client = require('../client.js');

module.exports = (payload, id, vid, callback) => {

  let set = id + 'jobs';
  client.hmsetAsync(vid, payload)
    .then(() => {
      client.sadd(set, vid);
    })
    .then(() => {
      client.sadd('liveJobs', vid);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
