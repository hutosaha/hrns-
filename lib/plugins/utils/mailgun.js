'use strict';
require('env2')('config.env');
const fs      = require('fs');

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const agencySubmittedCandidateHarnessTalent = fs.readFileSync('./lib/emails/agencySubmittedCandidateHarnessTalent.html').toString();
const adminApprovedForHarnessTalent         = fs.readFileSync('./lib/emails/adminApprovedHarnessTalent.html').toString();
const emailCandidateSelfSubmitted           = fs.readFileSync('./lib/emails/emailCandidateSelfSubmitted.html').toString();
const emailAdminSelfSubmitted               = fs.readFileSync('./lib/emails/emailAdminSelfSubmittedCv.html').toString();
const emailAgencyHarnessTalentExpiration    = fs.readFileSync('./lib/emails/emailAgencyHarnessTalentExpiration.html').toString();
const emailCandidateHarnessHire             = fs.readFileSync('./lib/emails/emailCandidateHarnessHire.html').toString();
const emailCandidateHarnessTalent           = fs.readFileSync('./lib/emails/emailCandidateHarnessTalent.html').toString();
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
  to:[admin ,process.env.TEST_EMAIL], //admin, // TODO change to admin email address
  subject: 'New Candidate!',
  html: emailAdminForVacancyCV
};

mailgun.emailClientOnAdminVacancyRemoval = {
  from: from,
  subject: 'Sorry, your vacancy was deleted',
  html: emailClientOnAdminVacancyRemoval
};

mailgun.emailClientAboutNewCandidates = {
  from: from,
  subject: 'New Candidates on Harness!',
  html: emailClientAboutNewCandidates
};

mailgun.emailAgencyForAdminAcceptance = {
  from: from,
  subject: 'Your candidate was accepted!',
  html: emailAgencyForAdminAcceptance
};

mailgun.candidateAcceptedForScheduling = {
  from:from,
  html: candidateAcceptedForScheduling
};

mailgun.proposedInterview = {
  from:from,
  subject:'Great news! Let\'s arrange an interview',
  html: proposedInterview
}

mailgun.changeInterview = {
  from:from,
  subject:'Re-arrange interview',
  html: changeInterview
}

mailgun.interviewConfirmation = {
  from: from,
  subject:'Interview Confirmed',
  html: interviewConfirmation
}

mailgun.emailAdminHarnessTalentCv = {
  from: admin,
  subject: 'New Harness Talent',
  html:agencySubmittedCandidateHarnessTalent,
  to: [admin ,process.env.TEST_EMAIL]
}

mailgun.emailAdminSelfSubmittedCv ={
  from:admin,
  subject: 'A candidate submitted their CV',
  html: emailAdminSelfSubmitted,
  to:[admin ,process.env.TEST_EMAIL]
}

mailgun.emailCandidateSelfSubmittedCv ={
  from:admin,
  subject: 'Thank you for submitting your CV',
  html: emailCandidateSelfSubmitted
}

mailgun.adminApprovedForHarnessTalent = {
  from: admin,
  subject:'Conrgatulations your candidate has been accepted for Harness Talent',
  html: adminApprovedForHarnessTalent
}

mailgun.adminRejectedForHarnessTalent = {
  from: admin,
  subject:'Sorry your candidate wasn\'t quite right',
  html:'Your candidate has been rejected for Harness Talent',
  to: admin
}

mailgun.emailCandidateHarnessHire = {
  from: admin,
  subject:'Congratulations -agencyName- has submitted you to Harness Hire',
  html: emailCandidateHarnessHire
}

mailgun.emailCandidateHarnessTalent = {
  from: admin,
  subject:'Congratulations -agencyName- has submitted you to Harness Talent',
  html: emailCandidateHarnessTalent
}

mailgun.emailAgencyHarnessTalentExpiration = {
  from: admin,
  subject:'-candidateName- has been removed from HarnessTalent',
  html: emailAgencyHarnessTalentExpiration
}

module.exports = mailgun;
