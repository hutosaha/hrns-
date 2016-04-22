const client = require('../client.js');

module.exports = (id, callback) => {

  client.existsAsync(id)
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      callback(false);
    });
};
