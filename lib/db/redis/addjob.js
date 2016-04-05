'use strict';

const client = require('../client.js');

module.exports = (payload, id, vid, callback) => {
  let job = payload;
  let set = id + 'jobs';
  
  client.hgetAsync(id, 'companyName')
    .then((res) => {
      job.companyName = res;
    })
    .then(()=> {
      client.hmset(vid, job);
    }) 
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