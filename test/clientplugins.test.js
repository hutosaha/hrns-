const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie          = require('./utils/utils.js').clientCookie;
const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const clientSignupPayload = { contactName: 'Huw Davies', email: 'me@me.com', contactNumber: '08372974723', companyName: 'Facebook Ltd.', companyDescription: 'Social media application', companySize: '500+', website: 'http://facebook.com', twitter: '@facebook' };
const jobPayload          = { jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };

server.init(0, (err, server) => {

    client.select(3, function(){});

    testEndPoint(server, '/client', 'GET', 200, 'authed GET responds with 200', clientCookie);

    testEndPoint(server, '/client/job/vid', 'GET', 200, 'authed GET responds with 200', clientCookie);
    testPayload(server, '/client/job/randomvid', 'GET', 'Sorry, something went wrong', 'payload contains view with:', clientCookie);

    // fix this
    // client.hset('vid1-2-3', 'jobTitle', 'tester', () => {
    //     testPayload(server, '/client/job/vid1-2-3', 'GET', 'Client\'s Job Page', 'payload contains view with:', clientCookie);
    // });

    testEndPoint(server, '/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
    testEndPoint(server, '/clientsignup', 'GET', 401, 'unauth user responds with 401');
    testEndPoint(server, '/clientsignup', 'POST', 400, 'POST without payload responds with 400 - bad request', clientCookie);
    testEndPoint(server, '/clientsignup', 'POST', 200, 'POST with correct payload responds with 200', clientCookie, clientSignupPayload);
    testPayload(server, '/clientsignup', 'GET', 'Sign Up', 'payload response is:', nonExistingUserCookie);
    testPayload(server, '/clientsignup', 'POST', 'We will let you know by email', 'correct client signup responds with correct message', clientCookie, clientSignupPayload);

    testEndPoint(server, '/submitjob', 'GET', 200, 'endpoint responds with:', clientCookie);
    // testEndPoint(server, '/submitjob', 'POST', 200, 'endpoint responds with:', clientCookie, jobPayload, 'testid'); /FAIL ACTUAL 400

    server.stop();
});
