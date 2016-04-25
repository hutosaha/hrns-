'use strict';

const client = require('../client.js');

module.exports = (cvid, vid, rating, callback) => {
  let adminSet  = vid + 'adminShortlist';
  let clientSet = vid + 'clientShortlist';

  client.hsetAsync(cvid, 'rating', rating)
    .then(() => {
      client.sadd(clientSet, cvid);
    })
    .then(() => {
      client.srem(adminSet, cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};
