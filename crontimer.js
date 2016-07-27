const getSetMembersInfo = require('./lib/db/redis.js').getSetMembersInfo;
const moment = require('moment');
const removecv = require('./lib/db/redis.js').removecv;
const emailAdminHarnessTalentCv = require('./lib/plugins/utils/mailgun.js').emailAdminHarnessTalentCv;
const mailgun = require('./lib/plugins/utils/mailgun.js');

console.log('I am in the Cron!!!');

getSetMembersInfo('HarnessTalent', (array) => {

        array.forEach(function(arrayItem) {
            const cvid = arrayItem.civd;
            const agentsEmail = arrayItem.agencyEmail;
            const dateSubmitted = arrayItem.dateSubmitted;
            const expirationDate = moment(dateSubmitted).add(35, 'days').calendar();
            const deletionDate = moment(dateSubmitted).add(42, 'days').calendar();
            const todaysDate = moment().calendar();
            switch (true) {
                case (todaysDate === todaysDate):
                console.log('email sent');
                    emailAdminHarnessTalentCv.to = 'tormodsmith@gmail.com'; //REPLACE WITH AGENTSEMAIL!
                    return mailgun.messages().send(emailAdminHarnessTalentCv);
                case (todaysDate === deletionDate):
                    console.log('Candidate removed from HarnessTalent');
                    return removecv(cvid, 'HarnessTalent'); // delete from harness talent list
            }
        });
    }
);

