'use strict';

const test   = require('tape');
const moment = require('moment');

const server = require('../lib/index.js');
const redis  = require('../lib/db/redis.js');
const client = require('../lib/db/client.js');
let hash, payload;

server.init(1, (err,server) => {

  client.select(3, function(){
    console.log('connected to db3');
  });

  test('test can write list to db', (t) => {
    const array = ['1', '2', '3', '4', '5'];
    const listName = 'testList';
    client.RPUSH(listName, array);
    client.LRANGE(listName, 0, -1, (error, reply) => {
      t.ok(!error, 'assert error is empty');
      t.deepEqual(reply, array, 'assert arrays match!');
      t.end();
    });
    client.DEL(listName, (err,reply) => {
      console.log('cleaned DB', reply);
    });
  });

  test('checkUserType gets user type', (t) => {
    hash = 'test1';

    client.hset(hash, 'type', 'client');
    redis.checkUserType(hash, (type) => {
      t.equal(type, 'client', 'types match');
      t.end();
    });
  });

  test('addRemoveFromSets adds to a set and removes from another', (t) => {
    hash = 'test2';

    client.sadd('awaitingApproval', hash);
    redis.addRemoveFromSets('approvedUsers','awaitingApproval', hash, () => {
        client.sismember('approvedUsers', hash, (err, res) => {
          t.equal(res, 1, 'hash added to approvedUsers');
        });
        client.sismember('awaitingApproval', hash, (err, res) => {
          t.equal(res, 0, 'hash add to awaitingApproval');
          t.end();
        });
    });
  });

  test('isAMemberOfSet correctly checks for a set member', (t) => {
    hash = 'test4';

    client.sadd('approvedUsers', hash);
    redis.isAMemberOfSet(hash, 'approvedUsers', (res) => {
      t.equal(res, 1, 'correctly identifies hash!');
      t.end();
    });
  });

  test('isExistingUser identifies user in DB', (t) => {
    hash = 'test5';

    client.del(hash);
    client.hset(hash, 'id', hash, (err, res) => {
      if (res) {
        redis.isExistingUser(hash, (res) => {
          t.equal(res, 1, 'identifies hash exists!');
          t.end();
        });
      }
    });
  });

  test('addClientSignUpDetails adds payload to hash and adds to awaitingApproval', (t) => {
    hash = 'test6';
    payload = {
      firstName: 'Joe',
      surname: 'Bloggs'
    };
    redis.addClientSignUpDetails(payload, hash, () => {
      client.sismember('awaitingApproval', hash, (err, res) => {
        t.equal(res, 1, 'client is added to awaitingApproval');
        client.hgetall(hash, (err, reply) => {
          payload.id = hash;
          payload.type = 'client';
          let expected = payload;
          let actual   = reply;
          t.deepEqual(actual, expected, 'correctly adds client payload');
          t.end();
        });
      });
    });
  });

  test('addAgencySignUpDetails saves correct payload', (t) => {
    hash = 'test7';
    payload = {
      firstName: 'Joe',
      surname: 'Bloggs'
    };
    redis.addAgencySignUpDetails(payload, hash, () => {
      client.hgetall(hash, (err, reply) => {
        payload.id = hash;
        payload.type = 'agency';
        let expected = payload;
        let actual = reply;
        t.deepEqual(actual, expected, 'correctly saves agency payload');
        t.end();
      });
    });
  });

  test('getSetMembersInfo does exactly what it says on the tin', (t) => {
    let hash2 = 'test9';
    let hashObj = {
      id: 'user123',
      type: 'client',
      email: 'google@gmail.com',
      company: 'facebook'
    };
    hash = 'test8';
    client.hmset(hash, hashObj);
    client.sadd('testSet', hash);
    client.hmset(hash2, hashObj);
    client.sadd('testSet', hash2);

    redis.getSetMembersInfo('testSet', (res) => {
      let actual = res;
      let expected = [ { company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' }, { company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' } ];

      t.deepEqual(actual, expected, 'The correct data was returned!');
      redis.getSetMembersInfo('testSet2', (res) => {
        t.equal(res, false, 'empty set should return false');
        t.end();
      });
    });

  test('addJob saves a job with the company name, adds to liveJobs and adds appropriate dates', (t) => {
    let id  = 'test11';
    let vid = 'testVid1';
    payload = {
      jobTitle: 'developer',
      salary: '£30,000',
      searchDate: 'Tue Aug 25 2009'
    };
    let expected = {
      companyName: 'fac',
      dateSubmitted: moment().format('MMMM Do YYYY'),
      jobTitle: 'developer',
      salary: '£30,000',
      searchDate: 'August 25th 2009',
      vid: 'testVid1'
    };
    client.del(id + 'jobs');
    client.srem('liveJobs', vid);
    client.hset(id, 'companyName', 'fac');
    redis.addJob(payload, id, vid, () => {
      client.hgetall(vid, (err, reply) => {
        t.deepEqual(reply, expected, 'correctly formats job object!');
      });
      client.sismember(id + 'jobs', vid, (err, reply) => {
        t.equal(reply, 1, 'correctly added to idjobs set!');
      });
      client.sismember('liveJobs', vid, (err, reply) => {
        t.equal(reply, 1, 'correctly save to liveJobs set');
        t.end();
      });
    });
  });

  test('getSetMembers correctly retrieves set members', (t) => {
    hash = 'test12';
    let hash2 = 'test13', hash3 = 'test14', set = 'testSet4';

    client.sadd(set, hash, hash2, hash3);
    redis.getSetMembers(set, (res) => {
      t.deepEqual(res.length, 3, 'correct set has been returned!');
      t.end();
    });
  });

  test('getVacancydetails ', (t) => {
    let vid = 'testVid2';
    payload = {
      jobTitle: 'UX designer',
      salary: '£40,000'
    };
    client.hmset(vid, payload);
    redis.getVacancyDetails(vid, (res) => {
      t.deepEqual(res, payload, 'correct object is returned!');
      t.end();
    });
  });

  test('addIdToSet does what it says', (t) => {
    let set = 'testSet3';
    hash    = 'test10';
    client.DEL(set);
    redis.addIdToSet(hash, set, (res) => {
      t.equal(res, 1, 'should callback 1');
      client.sismember(set, hash, (err, reply) => {
        t.equal(reply, 1, 'hash is now in set!');
        t.end();
        client.quit();
      });
    });
  });
});
  server.stop();
});

// last test call client.quit();
