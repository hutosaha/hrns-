const client = require('../client.js');

module.exports = (id, key, value, callback) => {

  client.hsetAsync(id, key, value)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};
