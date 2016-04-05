const client = require('../client.js');

module.exports = (id, callback) => {

  client.hgetAsync(id, 'type')
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
