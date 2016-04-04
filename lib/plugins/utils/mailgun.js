'use strict';
const fs = require('fs');


const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

const approved = fs.readFileSync('./lib/emails/approved.html').toString();
const rejectedUser = fs.readFileSync('./lib/emails/rejected-user.html').toString();
const notifyAgenciesOfNewJob = fs.readFileSync('./lib/emails/notifyAgenciesOfNewJob.html').toString();

mailgun.approved = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'tormodsmith@gmail.com',
    subject: 'Hrns approved!',
    html: approved
};

mailgun.rejectedUser = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'tormodsmith@gmail.com',
    subject: 'Hrns Rejected!',
    html: rejectedUser
};

mailgun.accepted = {
	from: 'Excited User <me@samples.mailgun.org>',
  to: 'tormodsmith@gmail.com',
  subject: 'Hrns approved!',
  text: 'Congratulations you\'ve been approved!!'
};

mailgun.notifyAgenciesOfNewJob = {
  from: 'Excited User <me@samples.mailgun.org>',
  subject: 'New vacancy!',
  text: notifyAgenciesOfNewJob
};

module.exports = mailgun;
