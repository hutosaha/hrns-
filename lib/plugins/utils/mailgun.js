'use strict';
require('env2')('config.env');
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

const from = process.env.FROM_EMAIL;
const admin =process.env.ADMIN_EMAIL;

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


mailgun.proposedInterview = {
  from:from,
  subject:'Great news!let\'s arrange an interview',
  html: proposedInterview
}

mailgun.changeInterview = {
  from:from,
  subject:'Re-arrange interview',
  html: changeInterview
}

mailgun.interviewConfirmation = {
  from: from,
  subject:'Re-arrange interview',
  html: interviewConfirmation
}


mailgun.emailAdmin = {
  from: from,
  to: admin // TODO change to admin email address
};


module.exports = mailgun;
