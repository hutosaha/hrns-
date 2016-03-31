'use strict';

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

app.addClientSignUpDetails = (payload, id, callback) => {

  client.hmsetAsync(id, payload)
    .then(() => {
      client.sadd('awaitingApproval', id);
    })
    .then(() => {
      client.hset(id, 'id', id);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.addAgencySignUpDetails = (payload, id, callback) => {

  client.hmsetAsync(id, payload, 'id', id, 'type', 'agency')
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.getAwaitingApprovalList = (callback) => {

  let userData = [];

  client.smembersAsync('awaitingApproval')
    .each((user) => {
      return client.hgetallAsync(user)
        .then((userObj) => {
          userData.push(userObj);
        });
    })
    .then(() => {
      if (userData.length === 0) {
        callback(false);
      } else {
        callback(userData);
      }
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
