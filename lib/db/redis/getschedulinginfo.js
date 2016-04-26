'use strict';

const client = require('../client.js');

module.exports = (vid, callback) => {

  let data = [];

  client.smembersAsync(vid + 'stageOne')
    .each((cvid) => {
      return client.hgetallAsync(cvid)
        .then((obj) => {
          console.log('stageOne Hashes', obj);
          data.push(obj);
        });
    })
    .then(() => {
      client.smembersAsync(vid + 'stageTwo')
        .each((cvid) => {
          return client.hgetallAsync(cvid)
            .then((obj) => {
              console.log('stageTwo Hashes', obj);
              data.push(obj);
            });
        });
    })
    .then(() => {
      client.smembersAsync(vid + 'stageThree')
        .each((cvid) => {
          return client.hgetallAsync(cvid)
            .then((obj) => {
              console.log('stageThree Hashes', obj);
              data.push(obj);
            });
        });
    })
    .then(() => {
      client.smembersAsync(vid + 'stageFour')
        .each((cvid) => {
          return client.hgetallAsync(cvid)
            .then((obj) => {
              console.log('stageFour Hashes', obj);
              data.push(obj);
            });
        });
    })
    .then(() => {
      callback(data);
    })
    .catch(() => {
      callback(false);
    });
};
