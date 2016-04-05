const client = require('../client.js');

module.exports = (vid, callback) => {

  client.hgetallAsync(vid)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
