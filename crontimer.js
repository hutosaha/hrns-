const getSetMembersInfo = require('./lib/db/redis.js').getSetMembersInfo;

const moment = require('moment');
const fs = require('fs');

const removecv = require('./lib/db/redis.js').removecv;
const emailAgencyHarnessTalentExpiration = require('./lib/plugins/utils/mailgun.js').emailAgencyHarnessTalentExpiration;
const mailgun = require('./lib/plugins/utils/mailgun.js');
const client = require('./lib/db/client.js');


console.log('I am in the Cron!!!');

getSetMembersInfo('HarnessTalent', (array) => {

    array.forEach(function(arrayItem) {
        console.log(arrayItem);
        const cvid = arrayItem.cvid;
        const agentsEmail = arrayItem.agencyEmail;
        const dateSubmitted = arrayItem.dateSubmitted;
        const expirationDate = moment(dateSubmitted).add(35, 'days').calendar();
        const deletionDate = moment(dateSubmitted).add(42, 'days').calendar();
        console.log(deletionDate);
        const todaysDate = moment().calendar();
        switch (true) {
            case (todaysDate === expirationDate):
                var context = Object.assign({}, emailAgencyHarnessTalentExpiration);
                context.html = context.html
                    .replace('-candidateName-', arrayItem.candidateName)
                    .replace('-agencyName-', arrayItem.agencyName);
                context.subject = context.subject
                    .replace('-candidateName-', arrayItem.candidateName);
                context.to = agentsEmail;
                //REPLACE WITH AGENTSEMAIL!
                return mailgun.messages().send(context, (err, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(body);
                    }
                });
            case (todaysDate === deletionDate):
                return client.srem('HarnessTalent', cvid, (err, reply) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Candidate removed from HarnessTalent', reply);
                    }
                }); // delete from harness talent list
        }
    });
});
// this deletes all downloads written to file for the document viewer on a daily basis. 
let filePath = './public/assets/downloads/';
let existingFilesInDownload = fs.readdirSync(filePath);
existingFilesInDownload.forEach((file, index) => {

    if (file !== existingFilesInDownload[0]) {
        fs.unlink(filePath + file, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('deleted public/assets/downlaods for doc viewer');
            }
        });
    }
});
