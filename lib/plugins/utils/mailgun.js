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
const proposedInterview                     = fs.readFileSync('./lib/emails/proposedInterview.html').toString();
const changeInterview                       = fs.readFileSync('./lib/emails/changeInterview.html').toString();
const interviewConfirmation                 = fs.readFileSync('./lib/emails/interviewConfirmation.html').toString();

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

mailgun.proposedInterview = {
  from: 'Harness <me@samples.mailgun.org>',
  subject:'Great news! lets arrange an interview',
  html: proposedInterview
};
mailgun.changeInterview = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'Re-arrange interview',
  html: changeInterview
};
mailgun.interviewConfirmation = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'Interview Confirmed',
  html: interviewConfirmation
}
;
mailgun.emailAgencyForAdminRejection = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: "Sorry, your candidate wasn't quite right for the role...",
  html: emailAgencyForAdminRejection
};

mailgun.emailAdminForVacancyCV = {
  from: 'Harness <me@samples.mailgun.org>',
  to: 'hdrd92@hotmail.com', // TODO change to admin email address
  subject: 'New Candidate!',
  html: emailAdminForVacancyCV
};

mailgun.emailClientOnAdminVacancyRemoval = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'Sorry, you vacancy was deleted',
  html: emailClientOnAdminVacancyRemoval
};

mailgun.emailClientAboutNewCandidates = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'New Candidates on Harness!',
  html: emailClientAboutNewCandidates
};

mailgun.emailAgencyForAdminAcceptance = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: 'Your candidate was accepted!',
  html: emailAgencyForAdminAcceptance
};

mailgun.emailAgencyOnClientShortlistRejection = {
  from: 'Harness <me@samples.mailgun.org>',
  subject: "Your candidate hasn't been approved by the client...",
  html: emailAgencyOnClientShortlistRejection
};

mailgun.emailAgencyOnClientShortlistAcceptance = {
  from:'Harness <me@samples.mailgun.org>',
  html: candidateAcceptedForScheduling
};


mailgun.emailAdmin = {
  from: 'Harness <me@samples.mailgun.org>',
  to: 'ben.brierley@sailixsearch.com' // TODO change to admin email address
};

module.exports = mailgun;
