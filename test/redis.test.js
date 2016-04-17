'use strict';

const test = require('tape');
// const moment = require('moment');

const server = require('../lib/index.js');
const redis = require('../lib/db/redis.js');
const client = require('../lib/db/client.js');
const moment = require('moment');

let hash, payload;

server.init(1, (err, server) => {

    client.select(2, function() { // select different one to other test files

        test('test can write list to db', (t) => {
            const array = ['1', '2', '3', '4', '5'];
            const listName = 'testList';
            client.RPUSH(listName, array);
            client.LRANGE(listName, 0, -1, (error, reply) => {
                t.ok(!error, 'assert error is empty');
                t.deepEqual(reply, array, 'assert arrays match!');
                t.end();
            });
            client.DEL(listName, (err, reply) => {
                console.log('cleaned DB', reply);
            });
        });

        test('getHashKeyValue gets a hash\'s key value', (t) => {
            hash = 'test1';

            client.hset(hash, 'type', 'client');
            redis.getHashKeyValue(hash, 'type', (type) => {
                t.equal(type, 'client', 'types match');
                t.end();
            });
        });

        test('addRemoveFromSets adds to a set and removes from another', (t) => {
            hash = 'test2';

            client.sadd('awaitingApproval', hash);
            redis.addRemoveFromSets('approvedUsers', 'awaitingApproval', hash, () => {
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
                        let actual = reply;
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
                let expected = [{ company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' }, { company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' }];

                t.deepEqual(actual, expected, 'The correct data was returned!');
                redis.getSetMembersInfo('testSet2', (res) => {
                    t.equal(res, false, 'empty set should return false');
                    t.end();
                });
            });


            test('getSetMembers correctly retrieves set members', (t) => {
                hash = 'test12';
                let hash2 = 'test13',
                    hash3 = 'test14',
                    set = 'testSet4';

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
                hash = 'test10';
                client.DEL(set);
                redis.addIdToSet(hash, set, (res) => {
                    t.equal(res, 1, 'should callback 1');
                    client.sismember(set, hash, (err, reply) => {
                        t.equal(reply, 1, 'hash is now in set!');
                        t.end();
                        client.flushdb();
                        // client.quit();
                    });
                });
            });

            test('addcvagainstvacancy, does what it says', (t) => {
                let vid = 'testvid';
                let cvid = 'testcvid';
                let payload = {
                    file_url: 'https://harnesscvbucket.s3.amazonaws.com/' + cvid

                };

                redis.addCVagainstVacancy(payload, vid, (res) => {
                    console.log('RES', res);
                    client.exists(cvid, (err, reply) => {
                        t.equal(reply, 1, 'cv exists in database');
                    });
                    client.sismember('testvidadminShortlist', 'testcvid', (err, reply) => {
                        t.equal(reply, 1, 'cv is in vacancy set');
                        t.end();

                    });
                });

            });

            const jobPayload = { jobTitle: 'Tester', jobDescription: 'testing everything', jobCategory: 'test', teamCulture: 'anal', typesOfProjects: 'tests', teamSize: 5, skillOne: 'test', skillTwo: 'test again', skillThree: 'test more', personality: 'persistant', salary: 100000, searchProgress: 'slow', searchDeadline: '12\/12\/2016' };
    
            test('addjob adds vacancy to db , livejobs & user id set also adds companyName and email', (t) => {
                   let id = 'testid';
                   let vid = 'testvid';
                redis.addJob(jobPayload, id, vid, (res) => {
                    console.log('RES', res);
                    client.exists(vid, (err, reply) => {
                        t.equal(reply, 1, 'cv exists in database');
                    });
                    client.hget(vid, 'dateSubmitted', (err, reply) => {
                        t.equal(reply, moment().format('MMMM Do YYYY'), 'dateSubmitted key is in database');
                    });
                    client.hget(vid, 'searchDeadline', (err, reply) => {
                        t.equal(reply, 'December 12th 2016', 'searchDeadl key is in database');
                    });
                    client.sismember(id + 'jobs', vid, (err, reply) => {
                        t.equal(reply, 1, 'cv is in vacancy set');

                    });
                    client.sismember('liveJobs', vid, (err, reply) => {
                        t.equal(reply, 1, 'cv is in livejobs set');
                        t.end();
                    });


                });
            });

            test('removeVacancy removes from livejobs and idjobs', (t) => {
                let id = 'testid';
                let vid = 'testvid';

                redis.removeVacancy(vid, id, (res) => {
                    console.log('RES', res);
                    client.exists(vid, (err, reply) => {
                        t.equal(reply, 0, 'cv exists in database');
                    });
                    client.sismember(id + 'jobs', vid, (err, reply) => {
                        t.equal(reply, 0, 'cv is not in vacancy set');

                    });
                    client.sismember('liveJobs', vid, (err, reply) => {
                        t.equal(reply, 0, 'cv is not in livejobs set');
                        t.end();
                    });
                });
          

            });

            test('test hset', (t) => {
                let id = 'testid';
                let key = 'fieldname';
                let value ='value';
                redis.setHashKeyValue(id, key, value, (res) => {
                    console.log('RES', res);
                    client.exists(id, key,(err,reply) => {
                        t.equal(reply,1, 'hash key exists in db');
                        t.end();
                    });
                    client.quit();

                });

           });


            server.stop();

        });
    });
});
// last test call client.quit();
