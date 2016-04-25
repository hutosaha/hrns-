const client = require('../client.js');

module.exports = (id, set, callback) => {

    client.saddAsync(set, id)
      .then((res) => {
        callback(res);
      })
      .catch(() => {
        callback(false);
      });
};
