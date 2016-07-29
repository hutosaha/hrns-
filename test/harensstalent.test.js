'use strict';

const test = require('tape');
const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const qs = require('querystring');
//const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie = require('./utils/utils.js').clientCookie;
const adminCookie = require('./utils/utils.js').adminCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;
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
    file_url: 'tesctcv.txt'
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

const agencyPayload = {
    contactName: 'Joe Bloggs',
    companyName: 'google',
    contactNumber: '0823748237',
    email: 'tormodsmith@gmail.com',
    companySize: '50-200',
    agencySpecialism: 'Creative',
    agencyId: 'agencyTestId'
};

const clientPayload = {
    contactName: 'Huw Davies',
    email: 'me@me.com',
    contactNumber: '08372974723',
    companyName: 'Facebook Ltd.',
    companyDescription: 'Social media application',
    companySize: '500+',
    website: 'http://facebook.com',
    twitter: '@facebook',
    clientId: 'iIkUSpzijO'
};

const cvPayload = {
    candidateName: 'Johnny Rotten',
    jobTitle: 'muppet',
    email: 'test@test.com',
    contactNumber: '0823748237',
    salary: '30000',
    linkedInProfile: 'https://linkedin',
    file_name: 'testcv.doc',
    file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc',
    cvid: 'testcvid',
    agencyId: 'agencyTestId'
};



server.init(0, (err, server) => {

            client.select(2, () => {

                    client.hmsetAsync('candidate1id', candidate1Payload)
                        .then(() => {
                            client.sadd('HarnessTalent', 'candidate1id');
                        })
                        .then(() => {
                            client.hmsetAsync('candidate2id', candidate2Payload);
                            client.hmsetAsync('candidate3id', candidate3Payload);
                            client.hmsetAsync('agencyTestId', agencyPayload);
                            client.hmsetAsync('iIkUSpzijO', clientPayload);
                            client.hmsetAsync('testcvid', cvPayload);
                        })
                        .then(() => {
                            client.sadd('HarnessTalent', 'candidate2id');
                            client.sadd('HarnessTalent', 'candidate3id');
                            client.sadd('HarnessTalentAdminShortList', 'candidate1id');
                            client.sadd('HarnessTalentAdminShortList', 'candidate2id');
                            client.sadd('HarnessTalentAdminShortList', 'candidate3id');
                            client.sadd('agencyTestIdHarnessTalentShortlist', 'testcvid');
                        })
                        .then(() => {
                                var query = 'salaryMin=20000&location=London&jobTitle=All&jobCategory=All&company=All&salaryMax=50000';
                                testEndPoint(server, '/harnesstalent/results?' + query, 'GET', 200, 'endpoint responds with', clientCookie);

                                var payload = {
                                    candidateName: 'Tormod Smith',
                                    cvid : 'testcvid',
                                    vid : 'testvid',
                                    agencyId : 'agencyTestId',
                                    firstIntDate: 'Friday 22 July 2016',
                                    firstIntTime: '2:22',
                                    jobTitle : 'Tester',
                                    jobLocation : 'Leeds',
                                    salary : '1000' ,
                                    contractType : 'Both',
                                    interviewAddress :'Glasgow' ,
                                    jobDescription_url :' https://Fharnesscvbucket.s3.amazonaws.com/F041d8e90-CV.docx',
                                    additionalComments : 'Bring your  A  game '

                                  };


                                testEndPoint(server, '/harnesstalent/interview/proposed', 'POST', 200, ' ht proposed interview endpoint responds with', clientCookie, payload);
                                testEndPoint(server, '/admin/newharnesstalent', 'GET', 200, ' gets into newharness talent endpoint', adminCookie);
                                // testEndPoint(server, '/harnesstalent/accpeted/testcvid', 'GET', 200, ' gets into naccepted test endpoint', adminCookie);
                                // testEndPoint(server, '/harnesstalent/reject?cvid=testcvid', 'GET', 200, ' gets into rejected test endpoint', adminCookie);

                        })
                        .catch();

                        });
                server.stop();
            });
