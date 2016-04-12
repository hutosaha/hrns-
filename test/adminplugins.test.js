'use strict';

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint       = require('./utils/utils.js').testEndPoint;
const testPayload        = require('./utils/utils.js').testPayload;
const testHeaderLocation = require('./utils/utils.js').testHeaderLocation;

const adminCookie    = require('./utils/utils.js').adminCookie;
const clientCookie   = require('./utils/utils.js').clientCookie;
const notAdminCookie = require('./utils/utils.js').notAdminCookie;

server.init(0, (err, server) => {

    client.select(3, () => {});

    testEndPoint(server, '/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);
    testEndPoint(server, '/admindashboard', 'GET', 200, 'nonAdmin responds with 200', notAdminCookie);
    testPayload(server, '/admindashboard', 'GET', 'it doesn\' look like you\'re an admin!', 'correct message displayed to non-Admin', notAdminCookie);
    testEndPoint(server, '/admindashboard', 'GET', 401, 'unauth user responds with response 401');

    testEndPoint(server, '/adminvacancies', 'GET', 200, 'admin viewing vacancies responds with 200', adminCookie);

    testEndPoint(server, '/admin/job/123', 'GET', 200, 'admin gets 200 response', adminCookie);
    testEndPoint(server, '/admin/job/123', 'GET', 403, 'nonAdmin gets 403 response', notAdminCookie);

    testEndPoint(server, '/approveuser/approve/id/me@me.com', 'GET', 401, 'unauthed GET responds with 401');
    testEndPoint(server, '/approveuser/approve/id/fake@definitelyfake.com', 'GET', 302, 'authed GET responds with 302', adminCookie);
    testHeaderLocation(server, '/approveuser/approve/id/fake@definitelyfake.com', 'GET', '/approveusers', 'authed GET redirects to approval page', adminCookie);
    testEndPoint(server, '/approveuser/reject/id/fake@definitelyfake.com', 'GET', 302, 'authed GET responds with 302', adminCookie);
    testHeaderLocation(server, '/approveuser/reject/id/fake@definitelyfake.com', 'GET', '/approveusers', 'authed GET redirects to approval page', adminCookie);

    testEndPoint(server, '/approveusers', 'GET', 200, 'authed GET responds with 200', adminCookie);

    // Try to fix this
    // client.hmset('test-vid-12345', { jobTitle: 'developer' }, () => {
    //     testPayload(server, '/admin/job/test-vid-12345', 'GET', 'developer', 'admin job page delivers vid job title', adminCookie);
    // });

    client.hset('id', 'type', 'agency', () => {
        client.sadd('approvedUsers', 'id', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
        testEndPoint(server, '/userinfo/agencies','GET', 200, 'endpoint responds with:', adminCookie );
        });
    });

    client.del('approvedUsers', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
    });

    // tests that depends on liveJobs being empty and send multiple emails to agencies.
    client.del('liveJobs', () => { // 2 callbacks required because a redis test was making 1 callback fail :(
        client.del('liveJobs', () => {
            testPayload(server, '/adminvacancies', 'GET', 'No live vacancies', 'correct message delivered for no vacancies', adminCookie);
          });
     });

    server.stop();

});
