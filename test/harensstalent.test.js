'use strict';

const test = require('tape');
const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const qs = require('querystring');
//const testPayload  = require('./utils/utils.js').testPayload;

const agencyCookie    = require('./utils/utils.js').agencyCookie;
const clientCookie = require('./utils/utils.js').clientCookie;
const adminCookie = require('./utils/utils.js').adminCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;
const agencyPayload = require('./utils/utils.js').agencyPayload;
const clientPayload = require('./utils/utils.js').clientPayload;
const cvPayload = require('./utils/utils.js').cvPayload;
const interviewPayload = require('./utils/utils.js').interviewPayload;

const candidate1Payload = {
    candidateName: 'Joe Bloggs',
    jobCategory: 'UX',
    company: 'Ford',
    jobTitle: 'UX Designer',
    email: 'test@test.com',
    contactNumber: '0230420492',
    contractType: 'permanent',
    location: 'London',
    salary: '30000',
    linkedInProfile: '',
    file_url: 'tesctcv.txt',        
}

const candidate2Payload = {
    candidateName: 'Bob Hoskins',
    jobCategory: 'UX',
    company: 'Ford',
    jobTitle: 'UX Designer',
    email: 'test@test.com',
    contactNumber: '0230420492',
    contractType: 'permanent',
    location: 'Bristol',
    salary: '30000',
    linkedInProfile: '',
    file_url: 'tesctcv.txt'
}
const candidate3Payload = {
    candidateName: 'Mario',
    jobCategory: 'UI',
    company: 'Ford',
    jobTitle: 'UX Designer',
    email: 'test@test.com',
    contactNumber: '0230420492',
    contractType: 'permanent',
    location: 'London',
    salary: '50000',
    linkedInProfile: '',
    file_url: 'tesctcv.txt'
}

const newCandidatePayload = {
    candidateName: 'Geoff Bloggs',
    jobCategory: 'UX',
    company: 'Ford',
    jobTitle: 'UX Designer',
    email: 'tormodsmith@gmail.com',
    contactNumber: '0230420492',
    contractType: 'permanent',
    location: 'London',
    salary: '30000',
    linkedInProfile: '',
    file_url: 'tesctcv.txt'
}

const existingDiffAgencyCandidatePayload = {
    candidateName: 'Joe Bloggs',
    jobCategory: 'UX',
    company: 'Ford',
    jobTitle: 'UX Designer',
    email: 'test@test.com',
    contactNumber: '0230420492',
    contractType: 'permanent',
    location: 'London',
    salary: '30000',
    linkedInProfile: '',
    file_url: 'tesctcv.txt',
     agencyId: 'agencyId2',
}

const query = 'salaryMin=20000&location=London&jobTitle=All&jobCategory=All&company=All&salaryMax=50000';

server.init(0, (err, server) => {

            client.select(2, () => {

                    client.hmsetAsync('candidate1id', candidate1Payload)
                        .then(() => {
                            client.sadd('HarnessTalent', 'candidate1id');
                        })
                        .then(() => {
                            client.hmsetAsync('candidate2id', candidate2Payload);
                            client.hmsetAsync('candidate3id', candidate3Payload);
                            client.hmsetAsync('testAgencyId', agencyPayload);
                            client.hmsetAsync('iIkUSpzijO', clientPayload);
                            client.hmsetAsync('testCvid', cvPayload);
                        })
                        .then(() => {
                            client.sadd('HarnessTalent', 'candidate2id');
                            client.sadd('HarnessTalent', 'candidate3id');
                            client.sadd('HarnessTalent', 'testcvid');
                            client.sadd('HarnessTalentAdminShortList', 'candidate1id');
                            client.sadd('HarnessTalentAdminShortList', 'candidate2id');
                            client.sadd('HarnessTalentAdminShortList', 'candidate3id');
                            client.sadd('agencyTestIdHarnessTalentShortlist', 'testcvid');

                        })
                        .then(() => {
                                testEndPoint(server, '/harnesstalent/results?' + query, 'GET', 200, 'endpoint responds with', clientCookie);                          
                                testEndPoint(server, '/harnesstalent/accepted/testcvid', 'GET', 200, 'accepted for harness talent returns',adminCookie);
                                testEndPoint(server, '/harnesstalent/interview/proposed', 'POST', 200, ' ht proposed interview endpoint responds with', clientCookie, interviewPayload);
                                testEndPoint(server, '/admin/newharnesstalent', 'GET', 200, ' gets into newharness talent endpoint', adminCookie);
                                
                                testEndPoint(server, '/agency/submitcandidate', 'POST', 200, 'Server responds with 200', agencyCookie, newCandidatePayload );
                                testEndPoint(server, '/agency/submitcandidate', 'POST', 200, 'Server responds with 200', agencyCookie, candidate1Payload );
                                testEndPoint(server, '/agency/resubmitcandidate/testcvid', 'GET', 200, 'Server responds with 200', agencyCookie);
                                
                                //testEndPoint(server, '/agency/submitcandidate', 'POST', 200, 'Server responds with 200', agencyCookie, existingDiffAgencyCandidatePayload );
                                testEndPoint(server, '/harnesstalent/accepted/testcvid', 'GET', 200, ' gets into accepted test endpoint', adminCookie);
                                testEndPoint(server, '/harnesstalent/reject?cvid=testcvid', 'GET', 200, ' gets into rejected test endpoint', adminCookie);

                        })
                        .catch();
                            console.log('Error with harnesstalent Tests');
                        });
                server.stop();
            });
