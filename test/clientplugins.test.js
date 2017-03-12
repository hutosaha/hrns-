const server = require('../lib/index.js');
const client = require('../lib/db/client.js');
//const query  = require('query');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie          = require('./utils/utils.js').clientCookie;
const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const clientSignupPayload = require('./utils/utils.js').clientSignupPayload;
const submitJobPayload    = require('./utils/utils.js').submitJobPayload;
const jobPayload          = require('./utils/utils.js').vidPayload;

const cvPayload     = require('./utils/utils.js').cvPayload;
const agencyPayload = require('./utils/utils.js').agencyPayload;
const clientPayload = require('./utils/utils.js').clientPayload;
const vidPayload    = require('./utils/utils.js').vidPayload;

const jobQuery = '?jobTitle=Tester&jobDescription=testing%20everything&jobCategory=test&teamCulture=anal&typesOfProjects=tests&teamSize=5&skillOne=test&skillTwo=test%20again&skillThree=test%20more&personality=persistant&salary=100000&searchProgress=slow&searchDeadline=12/12/2016&vid=12345&agencyId=testAgencyId&email=tsinseoul@gmail.com&candidateName=Joe%20Bloggs';
const query    = 'reason=Not%20enough%20experience&vid=test-vid&email=tsinseoul@gmail.com&cvid=test-cvid&list=testclientShortlist';


server.init(0, (err, server) => {

    client.select(3, () => {

        client.hmsetAsync('test-vid',jobPayload)
            .then(()=> {
                client.hmsetAsync('test-cvid', cvPayload);
                client.hmsetAsync('testAgencyId', agencyPayload);
                client.hmsetAsync('test-vid', vidPayload);
                client.hmsetAsync('test-vid', vidPayload);
                client.hmsetAsync('iIkUSpzijO', clientPayload);
                client.saddAsync('agencyEmails', process.env.TEST_EMAIL);
            })
            .then(() => {
                testEndPoint(server, '/client/job/accept'+jobQuery, 'GET', 200, 'endpoint responds with:', clientCookie, jobPayload); //split responds with null
                testEndPoint(server, '/client/scheduling/reject?'+query, 'GET', 200, 'endpoint responds with', clientCookie);
                testEndPoint(server, '/submitjob','POST', 200, 'endpoint responds with:', clientCookie, submitJobPayload, 'iIkUSpzijO');
                testEndPoint(server, '/client', 'GET', 200, 'authed GET responds with 200', clientCookie);
                testEndPoint(server, '/client/job/vid', 'GET', 200, 'authed GET responds with 200', clientCookie);
                testPayload(server, '/client/job/randomvid', 'GET', 'Sorry, something went wrong', 'payload contains view with:', clientCookie);
                testEndPoint(server, '/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
                testEndPoint(server, '/clientsignup', 'GET', 302, 'unauth user redirected to login');
                testEndPoint(server, '/clientsignup', 'POST', 400, 'POST without payload responds with 400 - bad request', clientCookie);
                testEndPoint(server, '/clientsignup', 'POST', 200, 'POST with correct payload responds with 200', clientCookie, clientSignupPayload);
                testPayload(server, '/clientsignup', 'GET', 'Sign Up', 'payload response is:', nonExistingUserCookie);
                //testPayload(server, '/clientsignup', 'POST', 'Thanks for signing-up! We will let you know by email when you can use the site!', 'correct client signup responds with correct message', clientCookie, clientSignupPayload);
                testEndPoint(server, '/submitjob', 'GET', 200, 'endpoint responds with:', clientCookie);
                testEndPoint(server, '/client/job/remove/1233112vid', 'GET', 200, 'endpoint responds with:', clientCookie);
                testEndPoint(server, '/client/file-exists?cvUrl=https://harnesscvbucket.s3.amazonaws.com/1212312332test.docx', 'GET', 200, 'endpoint responds with:', clientCookie);
                testEndPoint(server, '/client/scheduling/12345vid/testJob/testCompany', 'GET', 200, 'endpoint responds with:', clientCookie);
                testEndPoint(server, '/harnesstalent', 'GET', 200, 'endpoint responds with', clientCookie);
            })
            .catch(()=>{
                console.log('ERROR with client plugin tests');
            });
      });

    server.stop();
});
