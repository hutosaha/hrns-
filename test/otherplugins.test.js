'use strict';

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const agencyLoginEndPoint = process.env.AGENCY_LOGIN_ENDPOINT;

const testHeaderLocation = require('./utils/utils.js').testHeaderLocation;
const testEndPoint       = require('./utils/utils.js').testEndPoint;
const testPayload        = require('./utils/utils.js').testPayload;

const clientCookie = require('./utils/utils.js').clientCookie;
const candidateCookie = require('./utils/utils.js').candidateCookie;
const noScopeCookie = require('./utils/utils.js').noScopeCookie;
const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;
const adminCookie = require('./utils/utils.js').adminCookie;

server.init(0, (err, server) => {

    client.select(3, () => {});

    testEndPoint(server, '/', 'GET', 200, 'responds with response 200');
    testEndPoint(server, '/', 'GET', 302, 'approved client redirected 302', clientCookie);
    testEndPoint(server, '/', 'GET', 302, 'approved candidate redirected 302', candidateCookie);
    testEndPoint(server, '/', 'GET', 200, 'no scope user gets 200 home page', noScopeCookie);
    testHeaderLocation(server, '/', 'GET', '/client', 'header location response', clientCookie);
    testHeaderLocation(server, '/', 'GET', '/candidate', 'header location response', candidateCookie);
    testPayload(server, '/', 'GET', '<title>Harness</title>', 'unauth / payload has heading Home Page');

    testEndPoint(server, '/login/admin', 'GET', 302, 'auth admin user redirects:', adminCookie);
    testHeaderLocation(server, '/login/admin', 'GET', '/admindashboard', 'auth admin redirects to', adminCookie);

    testEndPoint(server, '/login/' + agencyLoginEndPoint, 'GET', 302, 'endpoint redirects with:'); // sends to linked in

    testEndPoint(server, '/login/candidate', 'GET', 302, 'unauth user responds with redirect 302');
    testEndPoint(server, '/login/candidate', 'GET', 302, 'auth user redirects : ', candidateCookie);

    testEndPoint(server, '/login/client', 'GET', 302, 'unauth user responds with redirect 302');
    testEndPoint(server, '/login/client', 'GET', 200, 'auth user  redirects : ', clientCookie);
    testEndPoint(server, '/login/client', 'GET', 302, 'auth non-existing client redirects to signup', nonExistingUserCookie);
    testHeaderLocation(server, '/login/client', 'GET', '/clientsignup', 'redirects to client signup form', nonExistingUserCookie);

    testPayload(server, '/logout', 'GET', 'You\'ve logged out!', 'payload has heading logged out');
    testEndPoint(server, '/logout', 'GET', 200, 'auth user responds with response 200', clientCookie);

    client.hset('testid', 'id', 'testid', () => {
        client.sadd('approvedUsers', 'testid', () => {
            testEndPoint(server, '/login/client', 'GET', 302, 'auth user redirects with:', clientCookie, null, 'testid');
            testHeaderLocation(server, '/login/client', 'GET', '/client', 'auth user redirects to', clientCookie, 'testid');
        });
    });

    server.stop();

});
