const server           = require('../lib/index.js');

const testEndPoint     = require('./utils/utils.js').testEndPoint;
const candidateCookie  = require('./utils/utils.js').candidateCookie;

const candidatePayload = { candidateName: 'Johnny Rotten', jobTitle: 'muppet', email: 'test@test.com', contactNumber: '0823748237', salary: '30000', linkedInProfile: 'https://linkedin', file_name: 'testcv.doc', file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc'};


server.init(0, (err, server) => {

    testEndPoint(server, '/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
    testEndPoint(server, '/candidate', 'GET', 302, 'unauth user redirected to login');

   // testEndPoint(server, '/candidate', 'POST', 200, 'unauth user redirected to login',candidateCookie, candidatePayload);

    server.stop();

});
