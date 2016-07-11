'use strict';

const client = require('../client.js');

module.exports = (cvid, payload, callback) => {
    // sets hash, adds to harnessTalentAdminShortList, agencyIdHarnessTalentShortList with stage set to waiting
    let agencyId = payload.agencyId;

    client.hmsetAsync(cvid, payload)
        .then(()=> {
          client.sadd('HarnessTalentAdminShortList', cvid)
        })
        .then(() => {
          client.sadd(agencyId +'HarnessTalentShortList', cvid);
        })
        .catch();
};

