const server = require('../lib/index.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;
const candidateCookie = require('./utils/utils.js').candidateCookie;
const candidatePayload = require('./utils/utils.js').candidatePayload;


server.init(0, (err, server) => {
    testEndPoint(server, '/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
    testEndPoint(server, '/candidate', 'POST', 200, 'unauth user redirected to login', candidateCookie, candidatePayload);
    testEndPoint(server, '/candidate', 'POST', 200, 'auth user returns', candidateCookie, candidatePayload);
    server.stop();
});
