const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const testPayload  = require('./utils/utils.js').testPayload;

const agencyCookie    = require('./utils/utils.js').agencyCookie;
const candidateCookie = require('./utils/utils.js').candidateCookie;

const agencyLoginEndPoint = process.env.AGENCY_LOGIN_ENDPOINT;

const incorrectAgencySignupPayload = { contactName: 2, companyName: 23, contactNumber: 'asdasd' };
const agencySignupPayload          = { contactName: 'Joe Bloggs', companyName: 'google', contactNumber: '0823748237', email: 'fac@hotmail.com', companySize: '50-200', agencySpecialism: 'Creative' };
const cvPayload                    = { candidateName: 'Johnny Rotten', jobTitle: 'muppet', email: 'test@test.com', contactNumber: '0823748237', salary: '30000', linkedInProfile: 'https://linkedin', file_name: 'testcv.doc', file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc'};

server.init(0, (err, server) => {

    client.select(3, function(){});

    testPayload(server, '/agency/job/wrong-vid', 'GET', 'Sorry, something went wrong', 'error handles incorrect vid', agencyCookie);

    // testEndPoint(server, '/agencysignup', 'GET', 200, 'authed agency GET responds with 200', agencyCookie); // might require different cookie
    testEndPoint(server, '/agencysignup', 'POST', 302, 'unauthed POST redirected to login');
    testEndPoint(server, '/agencysignup', 'POST', 400, 'POST without payload responds with 400 - bad request', agencyCookie);
    testEndPoint(server, '/agencysignup', 'POST', 400, 'POST with incorrect payload responds with 400', agencyCookie, incorrectAgencySignupPayload);
    testEndPoint(server, '/agencysignup', 'POST', 200, 'POST with correct payload responds with 200', agencyCookie, agencySignupPayload);

    testPayload(server, '/' + agencyLoginEndPoint, 'GET', 'Agency Login', 'correctly returns agency login view');

    //testEndPoint(server, '/submitvacancycv/vid','POST', 200, 'endpoint responds with:', agencyCookie, cvPayload);// FAILING TEST HMSET CONTAINS UNDEFINED ARUGMENT.
    client.hmset('test-vid-123', { jobTitle: 'developer' }, () => {
        testEndPoint(server, '/agency/job/test-vid-123', 'GET', 403, 'unauthorised user viewing agency job responds with 403', candidateCookie);
        testEndPoint(server, '/agency/job/test-vid-123', 'GET', 200, 'agency viewing agency job responds with 200', agencyCookie);
    });

    // tests that depends on liveJobs being empty and send multiple emails to agencies.
    client.del('liveJobs', () => { // 2 callbacks required because a redis test was making 1 callback fail :(
        client.del('liveJobs', () => {
            testPayload(server, '/agency', 'GET', 'There are no vacancies', 'agency homepage apologies with no vacancies', agencyCookie);
          });
     });

    testEndPoint(server, '/agency/myjobs', 'GET', 200, 'server responds with 200', agencyCookie); // need agency credentials 
    testEndPoint(server, '/agency/myjobs/remove?vid=12131312vid', 'GET', 200, 'server responds with 200', agencyCookie); // need agency credentials 
    
    testEndPoint(server, '/submitvacancycv/12133123vid', 'POST', 200, 'submitCV against vacancy', agencyCookie, cvPayload);



    server.stop();
});
