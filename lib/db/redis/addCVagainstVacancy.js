const client = require('../client.js');

module.exports = (payload, vid, callback) => {
        
  const cvid = payload.file_url.split('https://torhuw-hrns.s3.amazonaws.com/')[1];
  console.log('CVID', cvid);
  client.hmsetAsync(cvid, payload)
    .then(() => {
      client.sadd(vid + 'adminShortlist', cvid);
    })
    .then(() => {
      callback(true);
    })
    .catch((err) => {
      console.log('err', err);
      callback(false);
    });
};
