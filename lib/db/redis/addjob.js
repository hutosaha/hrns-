'use strict';

const client = require('../client.js');
const moment = require('moment');

module.exports = (payload, id, vid, callback) => {
  let job = payload;
  job.dateSubmitted = moment().format('MMMM Do YYYY');
  job.deadlineDate    = moment(job.deadlineDate).format('MMMM Do YYYY');
  job.clientId      = id;
  job.vid           = vid;

  client.hgetAsync(id, 'companyName')
    .then((res) => {
      job.companyName = res;
      client.hgetAsync(id, 'email')
      .then((res) => {
        job.clientEmail = res;
      })
      .then(()=> {
        client.hmset(vid, job);
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
