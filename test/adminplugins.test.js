'use strict';

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const testPayload = require('./utils/utils.js').testPayload;
// const testHeaderLocation = require('./utils/utils.js').testHeaderLocation;

const adminCookie = require('./utils/utils.js').adminCookie;
const clientCookie = require('./utils/utils.js').clientCookie;
const notAdminCookie = require('./utils/utils.js').notAdminCookie;

const ratingPayload = { agencyEmail: 'test@test.com', rating: 'gold', cvid: '112312143cvid', vid: '121312414vid' };
const jobPayload = { vid: 'test3Vid', clientId: 'clientId', clientEmail: 'client@test.com', jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };
const cvPayload = { cvid: 'testCvid', candidateName: 'Johnny Rotten', jobTitle: 'muppet', email: 'test@test.com', contactNumber: '0823748237', salary: '30000', linkedInProfile: 'https://linkedin', file_name: 'testcv.doc', file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc' };

const vid = 'test3Vid';
const cvid = 'testCvid'

server.init(0, (err, server) => {
    client.select(3, () => {


        testEndPoint(server, '/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);
        testEndPoint(server, '/admindashboard', 'GET', 200, 'nonAdmin responds with 200', notAdminCookie);
        testPayload(server, '/admindashboard', 'GET', 'it doesn\' look like you\'re an admin!', 'correct message displayed to non-Admin', notAdminCookie);
        testEndPoint(server, '/admindashboard', 'GET', 302, 'unauth user responds redirected to login');
        testEndPoint(server, '/adminvacancies', 'GET', 200, 'admin viewing vacancies responds with 200', adminCookie);

        client.hmsetAsync(vid, jobPayload)
            .then(() => {
                client.sadd(vid + 'adminShortlist', vid)
                client.hmset(cvid, cvPayload);
            })
            .then(() => {
                testEndPoint(server, '/admin/job/test3Vid', 'GET', 200, 'admin gets 200 response', adminCookie);
                testEndPoint(server, '/admin/job/dummyVid', 'GET', 200, 'admin gets 200 response', adminCookie);
                testEndPoint(server, '/admin/job/' + vid + '/client@test.com', 'GET', 200, 'server responds with new view', adminCookie);
                testEndPoint(server, '/rating?agencyEmail=agency@test.com&rating=gold&cvid=' + cvid + '&vid=' + vid, 'GET', 200, 'server responds with redirect', adminCookie);
                testEndPoint(server, '/admin/job/reject?agencyEmail=test@test.com&cvid=' + cvid + '&vid=' + vid, 'GET', 200, 'server responds with true', adminCookie);
                testEndPoint(server, '/admin/job/remove/test3Vid', 'GET', 200, 'server responds with new view', adminCookie);
            })
            .catch();

        testEndPoint(server, '/admin/job/123', 'GET', 403, 'nonAdmin gets 403 response', notAdminCookie);
        testEndPoint(server, '/approveuser/approve/VKADAKSD/tormodsmith@gmail.com', 'GET', 200, 'server responds with new view', adminCookie);
        testEndPoint(server, '/approveuser/approve/id/me@me.com', 'GET', 302, 'unauthed  redirected to login');
        testEndPoint(server, '/approveusers', 'GET', 200, 'authed GET responds with 200', adminCookie);

        client.hset('id', 'type', 'agency', () => {
            client.sadd('approvedUsers', 'id', () => {
                testEndPoint(server, '/userinfo/client', 'GET', 200, 'endpoint responds with:', adminCookie);
                testEndPoint(server, '/userinfo/agencies', 'GET', 200, 'endpoint responds with:', adminCookie);
            });
        });

        client.del('approvedUsers', () => {
            testEndPoint(server, '/userinfo/client', 'GET', 200, 'endpoint responds with:', adminCookie);
        });
    });
    server.stop();

});
