const client = require('../client.js');

module.exports = (addset, removeSet, id, callback) => {
  console.log('SADD1', addset);
  client.saddAsync(addset, id)
    .then(() => {
      client.sremAsync(removeSet, id)
        .then(() => {
          callback(true);
        });
    })
    .catch(() => {
      callback(false);
    });
};
