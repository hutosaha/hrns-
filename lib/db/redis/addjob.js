'use strict';

const client = require('../client.js');

module.exports = (payload, id, vid, callback) => {
      let vacancy= payload;

  client.hmgetAsync(id, 'companyName', 'email','logo_url')
     .then((res) => {
      vacancy.companyName = res[0];
      vacancy.clientEmail = res[1];
      vacancy.logo_url= res[2];
      })
     .then(() => {
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
      })
    .catch(() => {
      callback(false);
    });
};
