'use strict';

const fs      = require('fs');
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const emailClientOnAdminVacancyRemoval      = fs.readFileSync('./lib/emails/emailclientonadminvacancyremoval.html').toString();
const candidateAcceptedForScheduling        = fs.readFileSync('./lib/emails/candidateacceptedforscheduling.html').toString();
const emailAgencyForAdminAcceptance         = fs.readFileSync('./lib/emails/emailagencyforadminacceptance.html').toString();
const emailClientAboutNewCandidates         = fs.readFileSync('./lib/emails/emailclientaboutnewcandidates.html').toString();
const emailAgencyForAdminRejection          = fs.readFileSync('./lib/emails/emailagencyforadminrejection.html').toString();
const notifyAgenciesOfNewJob                = fs.readFileSync('./lib/emails/notifyagenciesofnewjob.html').toString();
const emailAdminForVacancyCV                = fs.readFileSync('./lib/emails/emailadminforvacancycv.html').toString();
const approvedUser                          = fs.readFileSync('./lib/emails/approveduser.html').toString();
const rejectedUser                          = fs.readFileSync('./lib/emails/rejecteduser.html').toString();


mailgun.approvedUser = {
    from: 'Harness <hello@harnesstalent.com>',
    subject: 'You\'ve been approved!',
    html: approvedUser
};

mailgun.rejectedUser = {
    from: 'Harness <hello@harnesstalent.com>',
    subject: 'Apologies from Harness',
    html: rejectedUser
};

mailgun.notifyAgenciesOfNewJob = {
  from: 'Harness <hello@harnesstalent.com>',
  subject: 'New vacancy on Harness!',
  html: notifyAgenciesOfNewJob
};

mailgun.emailAgencyForAdminRejection = {
  from: 'Harness <hello@harnesstalent.com>',
  subject: "Sorry, your candidate wasn't quite right for the role...",
  html: emailAgencyForAdminRejection
};

mailgun.emailAdminForVacancyCV = {
  from: 'Harness <hello@harnesstalent.com>',
  to: 'hdrd92@hotmail.com', // TODO change to admin email address
  subject: 'New Candidate!',
  html: emailAdminForVacancyCV
};

mailgun.emailClientOnAdminVacancyRemoval = {
  from: 'Harness <hello@harnesstalent.com>',
  subject: 'Sorry, you vacancy was deleted',
  html: emailClientOnAdminVacancyRemoval
};

mailgun.emailClientAboutNewCandidates = {
  from: 'Harness <hello@harnesstalent.com>',
  subject: 'New Candidates on Harness!',
  html: emailClientAboutNewCandidates
};

mailgun.emailAgencyForAdminAcceptance = {
  from: 'Harness <hello@harnesstalent.com>',
  subject: 'Your candidate was accepted!',
  html: emailAgencyForAdminAcceptance
};


mailgun.emailAgencyOnClientShortlistAcceptance = {
  from:'Harness <hello@harnesstalent.com>',
  html: candidateAcceptedForScheduling
};


mailgun.emailAdmin = {
  from: 'Harness <hello@harnesstalent.com>',
  to: 'ben.brierley@sailixsearch.com' // TODO change to admin email address
};


module.exports = mailgun;
