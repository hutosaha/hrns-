const client = require('../client.js');

module.exports = (addset, removeSet, id, callback) => {

  client.saddAsync(addset, id)
    .then(() => {
      client.sremAsync(removeSet, id)
        .then(() => {
          callback(true);
        });
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
