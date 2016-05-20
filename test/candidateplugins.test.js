const server = require('../lib/index.js');

const testEndPoint = require('./utils/utils.js').testEndPoint;

const candidateCookie = require('./utils/utils.js').candidateCookie;

server.init(0, (err, server) => {

    testEndPoint(server, '/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
    testEndPoint(server, '/candidate', 'GET', 302, 'unauth user redirected to login');

    server.stop();

});
