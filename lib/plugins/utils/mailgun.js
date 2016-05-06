'use strict';

const fs = require('fs');
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const emailClientOnAdminVacancyRemoval = fs.readFileSync('./lib/emails/emailclientonadminvacancyremoval.html').toString();
const candidateAcceptedForScheduling   = fs.readFileSync('./lib/emails/candidateacceptedforscheduling.html').toString();
const emailAgencyForAdminRejection     = fs.readFileSync('./lib/emails/emailagencyforadminrejection.html').toString();
const notifyAgenciesOfNewJob           = fs.readFileSync('./lib/emails/notifyagenciesofnewjob.html').toString();
const approvedUser                     = fs.readFileSync('./lib/emails/approveduser.html').toString();
const rejectedUser                     = fs.readFileSync('./lib/emails/rejecteduser.html').toString();

mailgun.approvedUser = {
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'You\'ve been approved!',
    html: approvedUser
};

mailgun.rejectedUser = {
    from: 'Harness <me@samples.mailgun.org>',
    subject: 'Apologies from Harness',
    html: rejectedUser
};

mailgun.notifyAgenciesOfNewJob = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'New vacancy on Harness!',
  html: notifyAgenciesOfNewJob
};

mailgun.emailClientOnAdminVacancyRemoval = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'Sorry, you vacancy was deleted',
  html: emailClientOnAdminVacancyRemoval
};

mailgun.emailAgencyForAdminRejection = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: "Sorry, your candidate wasn't quite right for the role...",
  html: emailAgencyForAdminRejection
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
