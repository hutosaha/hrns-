'use strict';

const test = require('tape');
const server = require('../lib/index.js');
const client = require('../lib/db/client.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const qs = require('querystring');
//const testPayload  = require('./utils/utils.js').testPayload;

const clientCookie = require('./utils/utils.js').clientCookie;
//const nonExistingUserCookie = require('./utils/utils.js').nonExistingUserCookie;

const clientPayload = require('./utils/utils.js').clientPayload;
const interviewClientPayload = require('./utils/utils.js').interviewClientPayload;
const agencyPayload = require('./utils/utils.js').agencyPayload;

const jobPayload = require('./utils/utils.js').jobPayload;
const vidPayload = require('./utils/utils.js').vidPayload;

const interviewPayload = require('./utils/utils.js').interviewPayload;

const interviewPayloadHT = {
    cvid: 'testcvid',
    agencyId: 'testAgencyId',//7PP6QGWdXN',
    agencyEmail:process.env.TEST_EMAIL,
    clientEmail: process.env.TEST_EMAIL,
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
    agencyId:'testAgencyId',
    interviewId: 'testInterviewId'   
};

const confirmedTime ={ 
    confirmedIntTime: '12:12',
    confirmedIntDate: '12/12/2015',
    interviewAddress: '12 Abbey Road',
    interviewId:  'testInterviewIdUnConfirmed'
}

const confirmedTimeHT ={ 
    confirmedIntTime: '12:12',
    confirmedIntDate: '12/12/2015',
    interviewAddress: '12 Abbey Road',
    interviewId:  'testHTinterviewId'
}

server.init(0, (err, server) => {
    client.select(3, () => {
        client.hmsetAsync('test-vid', jobPayload)
            .then(() => {
              client.hmsetAsync('testAgencyId', agencyPayload)
              client.hmsetAsync('clientIdInt', interviewClientPayload)
              client.hmsetAsync('test-vid-Interview', vidPayload)
              client.hmsetAsync('testInterviewId', interviewPayload);
              let interviewPayloadUnconfirmed = Object.assign({},interviewPayload);
              interviewPayloadUnconfirmed.confirmed = 'false';
              interviewPayloadUnconfirmed.clientEmail = process.env.TEST_EMAIL;
              client.hmsetAsync('testHTinterviewId', interviewPayloadHT );
              client.hmsetAsync('testInterviewIdUnConfirmed' , interviewPayloadUnconfirmed)
              client.saddAsync('iIkUSpzijOInterviewsRequested','testInterviewid','testInterviewIdUnConfirmed')
            })
            .then(() => {
                //testEndPoint(server, '/interview/proposed', 'POST', 200, 'serves 200', clientCookie, interviewPayload);
                testEndPoint(server, '/interview/email/testInterviewIdUnConfirmed', 'GET', 200, 'authed GET responds with 200', clientCookie);
                testEndPoint(server, '/interview/email/dummyinterviewId', 'GET', 200, 'authed GET responds with 200', clientCookie);
            })
            .then(()=>{
                client.hmsetAsync('testInterviewId', 'interviewId', 'testInterviewId');          
            })
            .then(()=>{
                testEndPoint(server, '/change/interview', 'POST', 200, 'authed GET responds with 200', clientCookie, newTimes);
                let query = qs.stringify(confirmedTime);                
                testEndPoint(server, '/interview/confirmed?'+query, 'GET', 200, 'authed GET responds with 200', clientCookie);                           
                query = qs.stringify(confirmedTimeHT);
                testEndPoint(server, '/interview/confirmed?'+query, 'GET', 200, 'authed GET responds with 200 HarnessTalent', clientCookie);
                testEndPoint(server, '/scheduling/pendinginterviews','GET', 200, 'responds with 200', clientCookie )
            })
            .catch(() =>{
                console.log('Error with interview tests')
            });
    });
    server.stop();
});
