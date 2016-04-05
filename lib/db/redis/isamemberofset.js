const client = require('../client.js');

module.exports = (id, set, callback) => {

  client.sismemberAsync(set, id)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
