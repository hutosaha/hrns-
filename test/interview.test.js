const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
//const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie          = require('./utils/utils.js').clientCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const clientSignupPayload = { clientId: 'TESTCLIENTID', contactName: 'Huw Davies', email: 'me@me.com', contactNumber: '08372974723', companyName: 'Facebook Ltd.', companyDescription: 'Social media application', companySize: '500+', website: 'http://facebook.com', twitter: '@facebook' };
const agencySignupPayload = { agencyId: 'TESTAGENCYID', contactName: 'Joe Bloggs', companyName: 'google', contactNumber: '0823748237', email: 'fac@hotmail.com', companySize: '50-200', agencySpecialism: 'Creative' };

//const jobPayload       = { jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', vid: 'efcd47b0-1b6a-11e6-82e5-e1271374d0e5vid', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };
const interviewPayload = { cvid: '7805be70-1d8f-11e6-abf0-51e6e54c9703cvid', stage: 'stageOne', agencyId: '7PP6QGWdXN', candidateName: 'John Wayne', jobTitle: 'porn star', vid: 'efcd47b0-1b6a-11e6-82e5-e1271374d0e5vid', firstIntDate: '23/05/2016', firstIntTime: '12:12', secondIntDate: '23/05/2016', secondIntTime: '09:09', thirdIntDate: '23/05/2016', thirdIntTime: '10:10', additionalComments: 'Meet under the clock', interviewAddress: '12 Abbey Road' };
const newTimes         = { clientId:'TESTCLIENTID', companyName:'TEST ltd', confirmed:'false', candidateName: 'John Wayne', jobTitle: 'porn star', vid: 'efcd47b0-1b6a-11e6-82e5-e1271374d0e5vid', firstIntDate: '23/05/2016', firstIntTime: '12:12', secondIntDate: '23/05/2016', secondIntTime: '09:09', thirdIntDate: '23/05/2016', thirdIntTime: '10:10', additionalComments: 'Meet under the clock', interviewAddress: '12 Abbey Road' };

server.init(0, (err, server) => {

      
        client.hmsetAsync('TESTCLIENTID', clientSignupPayload)
            .then(() => {
                client.hmsetAsync('TESTAGENCYID',agencySignupPayload)
            .then(() => {
                client.hmsetAsync('122123interviewId', interviewPayload);
            })  
            .then((res) =>{
                if(res){
                   testEndPoint(server, '/interview/confirmed?confirmedIntTime=12:12&confirmedIntDate12/12/2015&interviewId=122123interviewId', 'GET', 200, 'authed GET responds with 200', clientCookie); 
                   testEndPoint(server, '/interview/proposed', 'POST', 400, 'serves 400', clientCookie, newTimes); //why don't know 

                }
            });
        });

        testEndPoint(server, '/interview/email/interviewId', 'GET', 200, 'authed GET responds with 200', clientCookie);
        testEndPoint(server, '/change/interview', 'POST', 200, 'authed GET responds with 200', clientCookie, interviewPayload);
        
    server.stop();
});

