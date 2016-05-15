'use strict';

const app = module.exports = {};

app.bell = {
  provider: 'linkedin',
  password: process.env.LINKEDIN_PASSWORD,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  isSecure: false,
 // forceHttps: true
};

app.authCookie = {
  password: process.env.COOKIE_PASSWORD,
  cookie: 'user',
  isSecure: false,
  ttl: 1000 * 60 * 60 * 24 * 365 // 1 year
};

app.views = {
  engines: {
    html: require('handlebars')
  },
  relativeTo: __dirname,
  layoutPath: '../public/views/layout',
  layout: 'default',
  path:'../public/views',
  helpersPath: '../public/views/helpers',
  partialsPath: '../public/views/partials'
};
