const client = require('../client.js');

module.exports = (id, key, value, callback) => {
	console.log('iiiii', id, key, value);
  client.hsetAsync(id, key, value)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};
