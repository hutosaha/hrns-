const client = require('../client.js');

module.exports = (id, key, value, callback) => {

  client.hsetAsync(id, key, value)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};