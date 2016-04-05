const client = require('../client.js');

module.exports = (set, callback) => {

  client.smembersAsync(set)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
