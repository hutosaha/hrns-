var CronJob = require('cron').CronJob;

const emailAdminHarnessTalentCv   = require('./utils/mailgun.js').emailAdminHarnessTalentCv;

const mailgun                   = require('./utils/mailgun.js');



exports.register = (server, options, next) => {


new CronJob('00 30 08 * * 1-5', function() {

emailAdminHarnessTalentCv.to = 'tormodsmith@gmail.com';
mailgun.messages().send(emailAdminHarnessTalentCv);


console.log('yo sssssup');

}, null, true, 'Europe/London');

return next();
};


exports.register.attributes = {
  name: 'cron'
};

// add a warning date and expiry date to the data base on candidate submission. On warning date function runs to send and email to agency informing them to re upload the cv within a week
// must include name of candidate.

// on expiry date function is run to delete candidate from the database. IF candidate exists function is run to keep candidate and reset the expiration date for 7weeks.
// these functions will be in the harness-talent-submitcandidate route


// this function HERE will map through the entire list checking the warning date and expiration date
//triggers email function at warning date
// triggers delete function at expiration
