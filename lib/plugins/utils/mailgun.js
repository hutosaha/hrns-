'use strict';

const fs      = require('fs');
const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const emailAgencyOnClientShortlistRejection = fs.readFileSync('./lib/emails/emailagencyonclientshortlistrejection.html').toString();
const emailClientOnAdminVacancyRemoval      = fs.readFileSync('./lib/emails/emailclientonadminvacancyremoval.html').toString();
const candidateAcceptedForScheduling        = fs.readFileSync('./lib/emails/candidateacceptedforscheduling.html').toString();
const emailAgencyForAdminAcceptance         = fs.readFileSync('./lib/emails/emailagencyforadminacceptance.html').toString();
const emailClientAboutNewCandidates         = fs.readFileSync('./lib/emails/emailclientaboutnewcandidates.html').toString();
const emailAgencyForAdminRejection          = fs.readFileSync('./lib/emails/emailagencyforadminrejection.html').toString();
const notifyAgenciesOfNewJob                = fs.readFileSync('./lib/emails/notifyagenciesofnewjob.html').toString();
const emailAdminForVacancyCV                = fs.readFileSync('./lib/emails/emailadminforvacancycv.html').toString();
const approvedUser                          = fs.readFileSync('./lib/emails/approveduser.html').toString();
const rejectedUser                          = fs.readFileSync('./lib/emails/rejecteduser.html').toString();

const from = 'Harness <hello@harnesstalent.com>';

mailgun.approvedUser = {
    from: from,
    subject: 'You\'ve been approved!',
    html: approvedUser
};

mailgun.rejectedUser = {
    from: from,
    subject: 'Apologies from Harness',
    html: rejectedUser
};

mailgun.notifyAgenciesOfNewJob = {
  from: from,
  subject: 'New vacancy on Harness!',
  html: notifyAgenciesOfNewJob
};

mailgun.emailAgencyForAdminRejection = {
  from: from,
  subject: "Sorry, your candidate wasn't quite right for the role...",
  html: emailAgencyForAdminRejection
};


mailgun.emailAgencyOnClientShortlistRejection = {
  from:from,
  subject:"Your candidate hasn't been approved by the client...",
  html: emailAgencyOnClientShortlistRejection
}

mailgun.emailAdminForVacancyCV = {
  from: from,
  to: 'hdrd92@hotmail.com', // TODO change to admin email address
  subject: 'New Candidate!',
  html: emailAdminForVacancyCV
};

mailgun.emailClientOnAdminVacancyRemoval = {
  from: from,
  subject: 'Sorry, you vacancy was deleted',
  html: emailClientOnAdminVacancyRemoval
};

mailgun.emailClientAboutNewCandidates = {
  from: from,
  subject: 'New Candidates on Harness!',
  html: emailClientAboutNewCandidates
};

mailgun.email
mailgun.emailAgencyForAdminAcceptance = {
  from: from,
  subject: 'Your candidate was accepted!',
  html: emailAgencyForAdminAcceptance
};


mailgun.emailAgencyOnClientShortlistAcceptance = {
  from:from,
  html: candidateAcceptedForScheduling
};


mailgun.emailAdmin = {
  from: from,
  to: 'ben.brierley@sailixsearch.com' // TODO change to admin email address
};


module.exports = mailgun;
