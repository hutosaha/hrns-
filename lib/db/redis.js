const client = require('./client.js');

const app = module.exports = {};

app.addUserForApproval = (id, callback) => {

    client.saddAsync('unapprovedUsers', id)
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        console.log('err', err);
        callback(false);
      });
};

app.isApprovedClient = (id, callback) => {

  client.sismemberAsync('approvedUsers', id)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.isExistingUser = (id, callback) => {

  client.existsAsync(id)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.addSignUpDetails = (payload, id, callback) => {

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
