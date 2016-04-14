'use strict';

const client = require('../client.js');

module.exports = (payload, vid, callback) => {

  let cvid = payload.file_url.split(process.env.BUCKET_URL)[1];
  console.log('PAYLOAD URL', payload.file_url);
  console.log('ENV', process.env.BUCKET_URL);
  console.log('CVID', cvid);
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
