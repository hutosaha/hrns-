'use strict';

const Handlebars = require('handlebars');

module.exports = (stage) => {
  let result = {
    stageOne: 'Accepted',
    stageTwo: '1',
    stageThree: '2',
    stageFour: 'Final'
  };

  return new Handlebars.SafeString(result[stage]);
};
