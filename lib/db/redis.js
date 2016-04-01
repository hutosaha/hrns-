'use strict';

const client = require('./client.js');

const app = module.exports = {};

app.checkUserType = (id, callback) => {

  client.hgetAsync(id, 'type')
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.approveUser =  (id, callback) => {

     client.saddAsync('approvedUsers', id)
      .then(() => {
        client.srem('awaitingApproval', id);
      })
      .then(() => {
        callback(true);
      })
      .catch((err) => {
        console.log('err', err);
        callback(false);
      });
};

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

app.addAgencySignUpDetails = (payload, id, callback) => {

  payload.id = id;
  payload.type = 'client';

  client.hmsetAsync(id, payload)
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};

app.getSetMembersInfo = (set, callback) => {

  let userData = [];

  client.smembersAsync(set)
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
