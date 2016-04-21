'use strict';

const Handlebars = require('handlebars');

module.exports = (specialism) => {
  let result = {
    analytics: '<p>Analytics</p>',
    clientServices: '<p>Client Services</p>',
    Creative: '<p>Creative</p>',
    IT: '<p>IT</p>',
    ITSecurity: '<p>IT Security</p>',
    marketing: '<p>Marketing</p>',
    mobile: '<p>Mobile</p>',
    projectManagement: '<p>Project Management</p>',
    socialMedia: '<p>Social Media</p>',
    defaultSpecialism: '<p>None specified</p>'
  };

  return new Handlebars.SafeString(result[specialism] ? result[specialism] : result["defaultSpecialism"]);
};
