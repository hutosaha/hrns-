'use strict';

const app = module.exports = {};

app.bell = {
  provider: 'linkedin',
  password: process.env.LINKEDIN_PASSWORD,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  isSecure: true,
  forceHttps: true
};

app.authCookie = {
  password: process.env.COOKIE_PASSWORD,
  cookie: 'user',
  isSecure: false,
  redirectTo:'/',
  appendNext: true,
  keepAlive: true,  // if not authenticated redirects to home.
  ttl: 1000 * 60 * 60 * 24 * 365 * 2 // 1 year
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
