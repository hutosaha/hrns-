'use strict';



const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

mailgun.approved = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'tormodsmith@gmail.com',
    subject: 'Hrns approved!',
    text: 'Congratulations you\'ve been approved!!'
};


mailgun.accepted = {
	from: 'Excited User <me@samples.mailgun.org>',
    to: 'tormodsmith@gmail.com',
    subject: 'Hrns approved!',
    text: 'Congratulations you\'ve been approved!!'
};




module.exports = mailgun;
