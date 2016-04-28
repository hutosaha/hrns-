'use strict';

const client = require('../client.js');

module.exports = (agencyId, id, vid, callback) => {

  let data =[];

  client.smembersAsync(agencyId+'agencyScheduling')
     .each((vid) => {
      return client.hgetallAsync(vid)
        .then((vidObj) => {
          data.push(vidObj);
        });
      })
      .then(() => {
        callback(true);
      })
    .catch(() => {
      callback(false);
    });
};
