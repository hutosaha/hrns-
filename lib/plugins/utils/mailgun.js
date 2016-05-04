'use strict';

const fs = require('fs');

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const approved = fs.readFileSync('./lib/emails/approved.html').toString();
const rejected = fs.readFileSync('./lib/emails/rejected.html').toString();
const candidateAcceptedForScheduling = fs.readFileSync('./lib/emails/candidateAcceptedForScheduling.html').toString();
const notifyAgenciesOfNewJob = fs.readFileSync('./lib/emails/notifyAgenciesOfNewJob.html').toString();

mailgun.approved = {
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'You\'ve been approved!',
    html: approved
};

mailgun.rejected = {
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'Apologies from Harness',
    html: rejected
};

mailgun.notifyAgenciesOfNewJob = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'New vacancy on Harness!',
  html: notifyAgenciesOfNewJob
};

mailgun.emailAdmin = {
  from: 'Harness <me@samples.mailgun.org>',
  to: 'hdrd92@hotmail.com' // TODO change to admin email address
};

mailgun.basicEmail = {
  from: 'Harness <me@samples.mailgun.org>'
};

mailgun.emailAgencyOnClientShortlistAcceptance = { 
  from:'Harness <me@samples.mailgun.org>',
  html: candidateAcceptedForScheduling
};

module.exports = mailgun;
