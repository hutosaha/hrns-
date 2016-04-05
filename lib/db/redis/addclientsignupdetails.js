const client = require('../client.js');

module.exports = (payload, id, callback) => {

  payload.id = id;
  payload.type = 'client';
  client.hmsetAsync(id, payload)
    .then(() => {
      client.sadd('awaitingApproval', id);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
