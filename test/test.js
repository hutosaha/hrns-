'use strict';

const test = require('tape');
const Hapi = require('hapi');

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const agencyLoginEndPoint = process.env.AGENCY_LOGIN_ENDPOINT;

const testHeaderLocation = require('./utils/utils.js').testHeaderLocation;
const testEndPoint = require('./utils/utils.js').testEndPoint;
const testPayload = require('./utils/utils.js').testPayload;

const cleanPayload = require('../lib/plugins/utils/app.js').cleanPayload;

const adminCookie = require('./utils/utils.js').adminCookie;
const clientCookie = require('./utils/utils.js').clientCookie;
const candidateCookie = require('./utils/utils.js').candidateCookie;
const notAdminCookie = require('./utils/utils.js').notAdminCookie;
const agencyCookie = require('./utils/utils.js').agencyCookie;
const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const agencySignupPayload = { contactName: 'Joe Bloggs', companyName: 'google', contactNumber: '0823748237', email: 'fac@hotmail.com', companySize: '50-200', agencySpecialism: 'Creative' };
const incorrectAgencySignupPayload = { contactName: 2, companyName: 23, contactNumber: 'asdasd' };
const clientSignupPayload = { contactName: 'Huw Davies', email: 'me@me.com', contactNumber: '08372974723', companyName: 'Facebook Ltd.', companyDescription: 'Social media application', companySize: '500+', website: 'http://facebook.com', twitter: '@facebook' };
const jobPayload = { jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };
const cvPayload = { candidateName: 'Johnny Rotten', jobTitle: 'muppet', email: 'test@test.com', contactNumber: '0823748237', salary: '30000', linkedInProfile: 'https://linkedin', file_name: 'testcv.doc', file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc'};

server.init(0, (err, server) => {

    client.select(3, () => {});

    test('Server is running', (t) => {
        t.equal(server instanceof Hapi.Server, true, ' Server is an instance of the Hapi Server');
        t.end();
    });

    testEndPoint(server, '/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);
    testEndPoint(server, '/admindashboard', 'GET', 200, 'nonAdmin responds with 200', notAdminCookie);
    testPayload(server, '/admindashboard', 'GET', 'it doesn\' look like you\'re an admin!', 'correct message displayed to non-Admin', notAdminCookie);
    testEndPoint(server, '/admindashboard', 'GET', 401, 'unauth user responds with response 401');

    testEndPoint(server, '/adminvacancies', 'GET', 200, 'admin viewing vacancies responds with 200', adminCookie);

    testEndPoint(server, '/admin/job/123', 'GET', 200, 'admin gets 200 response', adminCookie);
    testEndPoint(server, '/admin/job/123', 'GET', 403, 'nonAdmin gets 403 response', notAdminCookie);

    testPayload(server, '/agency/job/wrong-vid', 'GET', 'Sorry, something went wrong', 'error handles incorrect vid', agencyCookie);

    testEndPoint(server, '/agencysignup', 'GET', 200, 'authed agency GET responds with 200', agencyCookie); // might require different cookie
    testEndPoint(server, '/agencysignup', 'POST', 401, 'unauthed POST responds with 401');
    testEndPoint(server, '/agencysignup', 'POST', 400, 'POST without payload responds with 400 - bad request', agencyCookie);
    testEndPoint(server, '/agencysignup', 'POST', 400, 'POST with incorrect payload responds with 400', agencyCookie, incorrectAgencySignupPayload);
    testEndPoint(server, '/agencysignup', 'POST', 200, 'POST with correct payload responds with 200', agencyCookie, agencySignupPayload);

    testPayload(server, '/' + agencyLoginEndPoint, 'GET', 'Agency Login', 'correctly returns agency login view');

    testEndPoint(server, '/approveuser/approve/id/me@me.com', 'GET', 401, 'unauthed GET responds with 401');
    testEndPoint(server, '/approveuser/approve/id/fake@definitelyfake.com', 'GET', 302, 'authed GET responds with 302', adminCookie);
    testHeaderLocation(server, '/approveuser/approve/id/fake@definitelyfake.com', 'GET', '/approveusers', 'authed GET redirects to approval page', adminCookie);
    testEndPoint(server, '/approveuser/reject/id/fake@definitelyfake.com', 'GET', 302, 'authed GET responds with 302', adminCookie);
    testHeaderLocation(server, '/approveuser/reject/id/fake@definitelyfake.com', 'GET', '/approveusers', 'authed GET redirects to approval page', adminCookie);

    testEndPoint(server, '/approveusers', 'GET', 200, 'authed GET responds with 200', adminCookie);

    testEndPoint(server, '/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
    testEndPoint(server, '/candidate', 'GET', 401, 'unauth user responds with 401');

    testEndPoint(server, '/client', 'GET', 200, 'authed GET responds with 200', clientCookie);

    testEndPoint(server, '/client/job/vid', 'GET', 200, 'authed GET responds with 200', clientCookie);

    testPayload(server, '/client/job/randomvid', 'GET', 'Sorry, something went wrong', 'payload contains view with:', clientCookie);

    client.hset('vid', 'jobTitle', 'tester', () => {
        testPayload(server, '/client/job/vid', 'GET', 'Client\'s Job Page', 'payload contains view with:', clientCookie);
    });

    testEndPoint(server, '/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
    testPayload(server, '/clientsignup', 'GET', 'Client Sign Up Page', 'payload response is:', nonExistingUserCookie);

    testEndPoint(server, '/clientsignup', 'GET', 401, 'unauth user responds with 401');
    testEndPoint(server, '/clientsignup', 'POST', 400, 'POST without payload responds with 400 - bad request', clientCookie);
    testEndPoint(server, '/clientsignup', 'POST', 200, 'POST with correct payload responds with 200', clientCookie, clientSignupPayload);
    testPayload(server, '/clientsignup', 'POST', 'we will let you know by email', 'correct client signup responds with correct message', clientCookie, clientSignupPayload);

    // tests that require a vid
    client.hmset('test-vid-123', { jobTitle: 'developer' }, () => {
        testPayload(server, '/admin/job/test-vid-123', 'GET', 'developer', 'admin job page delivers vid info', adminCookie);
        testEndPoint(server, '/agency/job/test-vid-123', 'GET', 403, 'unauthorised user viewing agency job responds with 403', candidateCookie);
        testEndPoint(server, '/agency/job/test-vid-123', 'GET', 200, 'agency viewing agency job responds with 200', agencyCookie);
    });

    test('clean payload deletes empty strings in an object', (t) => {
        let payload = { name: 'Joe Bloggs', age: 10, food: '', sport: '' };
        let expected = { name: 'Joe Bloggs', age: 10 };
        cleanPayload(payload);
        t.deepEqual(payload, expected, 'payload cleaned!');
        t.end();
    });

    testEndPoint(server, '/sign_s3', 'GET', 200, 'endpoint responds with:', agencyCookie);
    testEndPoint(server, '/submitjob', 'GET', 200, 'endpoint responds with:', clientCookie);

    // tests that depends on liveJobs being empty and send multiple emails to agencies.
    client.del('liveJobs', () => { // 2 callbacks required because a redis test was making 1 callback fail :(
        client.del('liveJobs', () => {
            testPayload(server, '/adminvacancies', 'GET', 'No live vacancies', 'correct message delivered for no vacancies', adminCookie);
            testPayload(server, '/agency', 'GET', 'There are no vacancies', 'agency homepage apologies with no vacancies', agencyCookie);
            testEndPoint(server, '/submitjob', 'POST', 200, 'endpoint responds with:', clientCookie, jobPayload, 'testid');
          });
     });

    testEndPoint(server, '/submitvacancycv/vid','POST', 200, 'endpoint responds with:', agencyCookie, cvPayload );

    client.hset('id', 'type', 'agency', () => {
        client.sadd('approvedUsers', 'id', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
        testEndPoint(server, '/userinfo/agencies','GET', 200, 'endpoint responds with:', adminCookie );
        });
    });

    client.del('approvedUsers', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
    });

    server.stop();  // has to be here to prevent other tests from hanging
});
