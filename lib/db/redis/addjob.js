'use strict';

const client = require('../client.js');

module.exports = (payload, id, vid, callback) => {
      let vacancy= payload;

  client.hgetAsync(id, 'companyName')
    .then((res) => {
      vacancy.companyName = res;
      client.hgetAsync(id, 'email')
      .then((res) => {
      vacancy.clientEmail = res;
      })
      .then(()=> {
        client.hmset(vid, vacancy);
      })
      .then(() => {
        client.sadd(id + 'jobs', vid);
      })
      .then(() => {
        client.sadd('liveJobs', vid);
      })
      .then(() => {
        callback(true);
      });
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
