'use strict';

const test = require('tape');
const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const qs = require('querystring');
//const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie = require('./utils/utils.js').clientCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;
const candidate1Payload = {
     candidateName: 'Joe Bloggs',
     jobCategory: 'UX',
     company: 'Ford',
     jobTitle: 'UX Designer',
     email:'test@test.com',
     contactNumber:'0230420492',
     contractType: 'permanent',
     location:'London',
     salary:'30000',
     linkedInProfile: '',
     file_url:'tesctcv.txt'
}

const candidate2Payload = {
     candidateName: 'Bob Hoskins',
     jobCategory: 'UX',
     company: 'Ford',
     jobTitle: 'UX Designer',
     email:'test@test.com',
     contactNumber:'0230420492',
     contractType: 'permanent',
     location:'Bristol',
     salary:'30000',
     linkedInProfile: '',
     file_url:'tesctcv.txt'
}
const candidate3Payload = {
     candidateName: 'Mario',
     jobCategory: 'UI',
     company: 'Ford',
     jobTitle: 'UX Designer',
     email:'test@test.com',
     contactNumber:'0230420492',
     contractType: 'permanent',
     location:'London',
     salary:'50000',
     linkedInProfile: '',
     file_url:'tesctcv.txt'
}




server.init(0, (err, server) => {
    
    client.select(2, () => {

        client.hmsetAsync( 'candidate1id', candidate1Payload)
            .then(() => {
                client.sadd('HarnessTalent', 'candidate1id');
            })
            .then(() => {
                client.hmsetAsync('candidate2id', candidate2Payload);
                client.hmsetAsync('candidate3id', candidate3Payload);            
            })
            .then(()=>{
                client.sadd('HarnessTalent', 'candidate2id');
                client.sadd('HarnessTalent', 'candidate3id');
            })
            .then(() => {
                var query = 'salaryMin=20000&location=London&jobTitle=All&jobCategory=All&company=All&salaryMax=50000';
                testEndPoint(server, '/harnesstalent/results?' + query, 'GET', 200, 'endpoint responds with', clientCookie);
                //testEndPoint(server, '/harnesstalent/interview/proposed' + query, 'GET', 200, 'endpoint responds with', clientCookie);

            })
            .catch();




    });
    server.stop();
});
