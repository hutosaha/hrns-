'use strict';

const tape = require('tape');
const redis = require('../lib/db/redis.js');
const client = require('../lib/db/client.js');

const server = require('../lib/index.js');


client.select(3, function () {
	'connected to db3';
});

server.init(0 ,(err, server) => {

	tape('test can write list to db', (t) => {
		const array = ['1', '2', '3', '4', '5'];
		const listName = 'testList';
		client.RPUSH(listName, array);
		client.LRANGE(listName, 0, -1, (error, reply) => {
			t.ok(!error, 'assert error is empty');
			t.deepEqual(reply, array, 'assert arrays match!');
			t.end();
		});
	});


	//redis.addUserForApproval();
	server.stop();
	
});


redis.quit();

