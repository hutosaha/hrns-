const client = require('../client.js');

module.exports = (id, key, callback) => {

  client.hgetAsync(id, key)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
