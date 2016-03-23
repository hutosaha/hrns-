const client = require('./client.js');

const app = module.exports = {};

app.addUserForApproval = (id, callback) => {

    client.saddAsync('unapprovedUsers', id)
      .then((res) => {
        callback(res);
      })
      .catch((err) => {
        console.log('err', err);
      });
}

app.checkUser = (id, callback) => {

  client.sismemberAsync('unapprovedUsers', id)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
