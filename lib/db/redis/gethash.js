const client = require('../client.js');

module.exports = (hash, callback) => {

  client.hgetallAsync(hash)
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      callback(false);
    });
};
