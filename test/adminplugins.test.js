'use strict';

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint       = require('./utils/utils.js').testEndPoint;
const testPayload        = require('./utils/utils.js').testPayload;
// const testHeaderLocation = require('./utils/utils.js').testHeaderLocation;

const adminCookie    = require('./utils/utils.js').adminCookie;
const clientCookie   = require('./utils/utils.js').clientCookie;
const notAdminCookie = require('./utils/utils.js').notAdminCookie;

const ratingPayload  = { agencyEmail: 'test@test.com', rating:'gold', cvid: '112312143cvid', vid:'121312414vid'};
const jobPayload     = { vid:'121312414vid', jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };


server.init(0, (err, server) => {


    testEndPoint(server, '/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);

    testEndPoint(server, '/admindashboard', 'GET', 200, 'nonAdmin responds with 200', notAdminCookie);
    testPayload(server, '/admindashboard', 'GET', 'it doesn\' look like you\'re an admin!', 'correct message displayed to non-Admin', notAdminCookie);
    testEndPoint(server, '/admindashboard', 'GET', 302, 'unauth user responds redirected to login');

    testEndPoint(server, '/adminvacancies', 'GET', 200, 'admin viewing vacancies responds with 200', adminCookie);

    testEndPoint(server, '/admin/job/123', 'GET', 200, 'admin gets 200 response', adminCookie);
    testEndPoint(server, '/admin/job/123', 'GET', 403, 'nonAdmin gets 403 response', notAdminCookie);

    testEndPoint(server,'/admin/job/remove/123','GET', 200, 'server responds with new view', adminCookie);
    testEndPoint(server,'/admin/job/reject','GET', 200, 'server responds with true', adminCookie);
    
    // testEndPoint(server,'/rating/','GET', 200, 'server responds with true', adminCookie, ratingPayload);
    testEndPoint(server,'/admin/job/122131vid/test@test.com','GET', 200,'server responds with new view', adminCookie);
    testEndPoint(server,'/approveuser/approve/VKADAKSD/test@test.com','GET', 200,'server responds with new view', adminCookie);

   

    testEndPoint(server, '/approveuser/approve/id/me@me.com', 'GET', 302 ,'unauthed  redirected to login');

    testEndPoint(server, '/approveusers', 'GET', 200, 'authed GET responds with 200', adminCookie);
/*
 /*   client.hmset('test-adminjob', { jobTitle: 'developer' }, () => {
         testPayload(server, '/admin/job/test-adminjob', 'GET', 'developer', 'admin job page delivers vid job title', adminCookie);

    });*/

 /*

        client.hmset('test-vid-12345', { jobTitle: 'developer' }, () => {
            test.only('returns status code', (t) => {
                let options = {
                    method: 'GET',
                    url: '/admin/job/test-vid-12345',
                    headers: { cookie: adminCookie }

                };
                server.inject(options, (res) => {
                    console.log('PAYLOAD', res.payload);
                    let actual = res.payload.indexOf('developer') > -1;
                    let expected = true;
                    t.equal(actual, expected, 'TEST PAYLOAD:-');
                    // client.flushdb();
                    t.end();0
                });
            });
        });
*/

    client.hset('id', 'type', 'agency', () => {
        client.sadd('approvedUsers', 'id', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
        testEndPoint(server, '/userinfo/agencies','GET', 200, 'endpoint responds with:', adminCookie );
        });
    });

    client.del('approvedUsers', () => {
        testEndPoint(server, '/userinfo/client','GET', 200, 'endpoint responds with:', adminCookie );
    });

    server.stop();

});
