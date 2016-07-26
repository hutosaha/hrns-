const getSetMembersInfo = require('./lib/db/redis.js').getSetMembersInfo;
const moment = require('moment');
const removecv = require('./lib/db/redis.js').removecv;
const emailAdminHarnessTalentCv = require('./lib/plugins/utils/mailgun.js').emailAdminHarnessTalentCv;
const mailgun = require('./lib/plugins/utils/mailgun.js');

console.log('I am in the Cron!!!');

getSetMembersInfo('HarnessTalent', (array) => {

        console.log('initial larger than formatted', array);

        array.forEach(function(arrayItem) {
            const cvid = arrayItem.civd;
            const agentsEmail = arrayItem.agencyEmail;
            const dateSubmitted = arrayItem.dateSubmitted;
            const expirationDate = moment(dateSubmitted).add(35, 'days').calendar();
            const deletionDate = moment(dateSubmitted).add(42, 'days').calendar();
            const todaysDate = moment().calendar();

            console.log(dateSubmitted, expirationDate, todaysDate);

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

        // { file_url: 'https://harnesscvbucket.s3.amazonaws.com/75b72c50-4849-11e6-bd9d-c55dc106d922Eagle ',
        //    file_name: 'Eagle & Waterfall.jpg',
        //    salary: '£79,999,900,000',
        //    fee: '£11999985000',
        //    agencyId: '7PP6QGWdXN',
        //    agencyName: 'Hays',
        //    email: 'jack@jack.com',
        //    dateSubmitted: 'Tue, Jul 12, 2016',
        //    agencyEmail: 'tormodsmith@gmail.com',
        //    location: 'jack',
        //    linkedInProfile: '',
        //    stage: 'waiting-approval',
        //    jobTitle: 'jack',
        //    contactNumber: '0987654',
        //    interviewsRequested: '1',
        //    candidateName: 'jack',
        //    company: 'jack',
        //    cvid: '775fd340-4849-11e6-bd9d-c55dc106d922cvid',
        //    jobCategory: 'jak',
        //    contractType: 'permanent' } ]

        // exports.register = (server, options, next) => {
        //
        //         server.route({
        //                 method: 'GET',
        //                 path: '/crontimer',
        //                 config: {
        //                     auth: false,
        //                     handler: (request, reply ) => {


// exports.register.attributes = {
//             name: 'Cron'
//   };
        //On warning date function runs to send and email to agency informing them to re upload the cv within a week
        // must include name of candidate.
        // on expiry date function is run to delete candidate from the database.

        // IF candidate exists function is run to keep candidate and reset the expiration date for 7weeks.
        // these functions will be in the harness-talent-submitcandidate route




        // this function HERE will map through the entire list checking the warning date and expiration date
        //triggers email function at warning date
        // triggers delete function at expiration
