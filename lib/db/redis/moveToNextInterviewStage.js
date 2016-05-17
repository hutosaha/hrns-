'use strict';

const client = require('../client.js');

module.exports = (cvid, vid, nextStage, interviewId, callback) => {

  client.hgetAsync(cvid, 'stage')
    .then((previousStage) => {
      let previousStageSet = vid+previousStage;
      let nextStageSet     = vid+nextStage;
      client.smoveAsync(previousStageSet, nextStageSet, cvid);
    }) 
    .then(()=>{
      client.hsetAsync(cvid, 'stage',nextStage);
    })
    .then(()=> {
      client.hsetAsync(interviewId, 'confirmed', true);
    })
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};
