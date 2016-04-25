const client = require('../client.js');

module.exports = (vid, callback) => {

  client.hgetallAsync(vid)
    .then((res) => {
      callback(res);
    })
    .catch(() => {
      callback(false);
    });
};
