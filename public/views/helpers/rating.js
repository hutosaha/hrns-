'use strict';

const Handlebars = require('handlebars');

module.exports = (rating) => {
  let result = {
    gold: '<a class="ui yellow label">Gold</a>',
    silver: '<a class="ui grey label">Silver</a>',
    bronze: '<a class="ui brown label">Bronze</a>',
    defaultRating: '<h5>No rating</h5>'
  };

  return new Handlebars.SafeString(result[rating] ? result[rating] : result["defaultRating"]);
};
