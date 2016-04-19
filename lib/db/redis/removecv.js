'use strict';

const client = require('../client.js');

module.exports = (cvid, vid, set, callback) => {

  client.delAsync(cvid)
    .then(() => {
      client.srem(set, cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) =>  {
      console.log('err',err);
      callback(false);
    });
};
