'use strict';

const Handlebars = require('handlebars');

module.exports = (rating) => {
  let result = {
    gold: '<p class="ui yellow label">Gold</p>',
    silver: '<p class="ui grey label">Silver</p>',
    bronze: '<p class="ui brown label">Bronze</p>',
    defaultRating: '<h5>No rating</h5>'
  };

  return new Handlebars.SafeString(result[rating] ? result[rating] : result["defaultRating"]);
};
