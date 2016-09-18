'use strict';

const test = require('tape');
const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const qs = require('querystring');
//const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie = require('./utils/utils.js').clientCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const clientPayload = require('utils/utils.js').clientPayload;
const agencyPayload = require('utils/utils.js').agencyPayload;

const jobPayload = require('utils/utils.js').jobPayload;

const interviewPayload = {
    cvid: 'testcvid',
    stage: 'stageOne',
    agencyId: '7PP6QGWdXN',
    agencyEmail:'tormodsmith@gmail.com',
    clientEmail:'tormodsmith@gmail.com',
    candidateName: 'John Wayne',
    jobTitle: 'Movie Star',
    vid: 'test-vid',
    firstIntDate: '23/05/2016',
    firstIntTime: '12:12',
    secondIntDate: '23/05/2016',
    secondIntTime: '09:09',
    thirdIntDate: '23/05/2016',
    thirdIntTime: '10:10',
    additionalComments: 'Meet under the clock',
    interviewAddress: '12 Abbey Road',
    confirmed: 'false',
    interviewId: 'test2interviewId'
};
const interviewPayloadHT = {
    cvid: 'testcvid',
    agencyId: '7PP6QGWdXN',
    agencyEmail:'tormodsmith@gmail.com',
    clientEmail: 'tormodsmith@gmail.com',
    candidateName: 'John Wayne',
    jobTitle: 'Movie star',
    vid: 'test-vid',
    firstIntDate: '23/05/2016',
    firstIntTime: '12:12',
    secondIntDate: '23/05/2016',
    secondIntTime: '09:09',
    thirdIntDate: '23/05/2016',
    thirdIntTime: '10:10',
    additionalComments: 'Meet under the clock',
    interviewAddress: '12 Abbey Road',
    confirmed: 'false',
    interviewId: 'testHTinterviewId'
};

const newTimes = {
    firstIntDate: '23/05/2016',
    firstIntTime: '12:12',
    secondIntDate: '23/05/2016',
    secondIntTime: '09:09',
    thirdIntDate: '23/05/2016',
    thirdIntTime: '10:10',
    companyName: 'TEST ltd',
    candidateName: 'John Wayne',
    jobTitle: 'TESTER',
    vid: 'test-vid',
    additionalComments: 'Meet under the clock',
    interviewAddress: '12 Abbey Road',
    agencyId:'TESTAGENCYID',
   
};

const confirmedTime ={ 
    confirmedIntTime: '12:12',
    confirmedIntDate: '12/12/2015',
    interviewAddress: '12 Abbey Road',
    interviewId:  'test2interviewId'
}

const confirmedTimeHT ={ 
    confirmedIntTime: '12:12',
    confirmedIntDate: '12/12/2015',
    interviewAddress: '12 Abbey Road',
    interviewId:  'testHTinterviewId'
}

server.init(0, (err, server) => {
    client.select(2, () => {

        client.hmsetAsync('test-vid', jobPayload)
            .then(() => {
                client.hmsetAsync('testAgencyId', agencySignupPayload)
                client.hmsetAsync('iIkUSpzijO', clientSignupPayload)
                client.hmsetAsync('test2interviewId', interviewPayload)
                client.hmsetAsync('testHTinterviewId' , interviewPayloadHT) ;
            })
            .then(() => {
                testEndPoint(server, '/interview/proposed', 'POST', 200, 'serves 200', clientCookie, newTimes);
                testEndPoint(server, '/interview/email/test2interviewId', 'GET', 200, 'authed GET responds with 200', clientCookie);
                testEndPoint(server, '/interview/email/dummyinterviewId', 'GET', 200, 'authed GET responds with 200', clientCookie);
                testEndPoint(server, '/change/interview', 'POST', 200, 'authed GET responds with 200', clientCookie, interviewPayload);
                let query = qs.stringify(confirmedTime);                
                testEndPoint(server, '/interview/confirmed?'+query, 'GET', 200, 'authed GET responds with 200', clientCookie);           
                
                query = qs.stringify(confirmedTimeHT);
                testEndPoint(server, '/interview/confirmed?'+query, 'GET', 200, 'authed GET responds with 200 HarnessTalent', clientCookie);

            })
            .catch(() =>{
                console.log('Error with interview tests')
            });


    });
    server.stop();
});
