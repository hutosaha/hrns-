var Server = require('./lib/index.js');
var Hoek   = require('hoek');
require('env2')('config.env');

Server.init(process.env.PORT, (err, server) =>{
    Hoek.assert(!err, err);
    console.log('The server is running on: ', server.info.uri);
});
