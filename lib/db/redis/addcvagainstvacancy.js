'use strict';

const client = require('../client.js');

module.exports = (payload, vid, callback) => {

  let cvid = payload.file_url.split(process.env.BUCKET_URL)[1];

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
