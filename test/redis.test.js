'use strict';

const test = require('tape');
//const moment = require('moment');

const server = require('../lib/index.js');
const redis = require('../lib/db/redis.js');
const client = require('../lib/db/client.js');

let hash, payload;


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
        surname: 'Bloggs',
        companyName: 'Test PLC',
        email: 'test@test.com',
        contactName: 'Teddy',
        logo_url: 'www.image.com'
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
        surname: 'Bloggs',
        agencyContactName: 'Joe Bloggs',
        agencyContactNumber: '0222222222',
        agencyCompanyName: 'TEST A PLC',
        agencyEmail: 'test@test.com'
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
});
test('getSetMembers correctly retrieves set members', (t) => {
    hash = 'test12';
    let hash2 = 'test13',
        hash3 = 'test14',
        testSet = 'testSet5';
    client.sadd(testSet, hash, hash2, hash3, (err, reply) => {
        redis.getSetMembers(testSet, (res) => {
            t.deepEqual(res.length, 3, 'correct set has been returned!');
            t.end();
        });
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

        });
    });
});

test('addJob will add a vancancy to live jobs and idjobs', (t) => {
    let id = 'test6'
    let vid = 'testvid';
    let payload = {
        jobTitle: 'Tester',
        jobDescription: 'Testing',
        teamCulture: 'start-up',
        typesOfProjects: 'tests',
        salary: '30000',
        package: '10%',
        vid: vid,
        clientId: id,
        dateSubmitted: 'Thu, Jun 9, 2016',
        searchDeadline: 'Thu, Jun 29, 2016',
        stage: 'stageOne'
    }
    redis.addJob(payload, id, vid, (res) => {
        client.exists(vid, (err, reply) => {
            t.equal(reply, 1, 'vid exists in database');
        });
        client.sismember(id + 'jobs', vid, (err, reply) => {
            t.equal(reply, 1, 'job added to testidjobs list');
        })
        client.sismember('liveJobs', vid, (err, reply) => {
            t.equal(reply, 1, 'vid is memeber of liveJobs');
            t.end();
        });
    });
});

test('getInterviewDetails adds new times to interview object', (t) => {
    let newTimes = {
        firstIntDate: 'Thu, Jun 9, 2016',
        firstIntTime: '12:12',
        interviewAddress: 'Buckingham Palace',
        interviewId: 'testinterviewId',
        jobTitle: 'Tester',
        candidateName: 'Joe Testy',
        vid: 'testvid',
        cvid: 'testcvid',
        clientId: ' test6',
        agencyId: 'test7',
        stage: 'stageOne',
        confirmed: 'true'
    }
    redis.getInterviewDetails(newTimes, (res) => {
        //console.log('XXXXXXXXXXXXXXXX',res); ///// posibble error with getInterviewData agency details are undefined. 
        let resLength = Object.keys(res).length;
        t.equals(resLength, 19, 'newtimes agency and client detaisl pulled together');
        t.end();
    });
});

test('addcvagainstvacancy, does what it says', (t) => {
    let vid = 'testvid';
    let cvid = 'testcvid';
    let payload = {
        file_url: 'https://harnesscvbucket.s3.amazonaws.com/' + cvid,
    };

    redis.addCVagainstVacancy(payload, cvid, vid, (res) => {
        client.exists(cvid, (err, reply) => {
            t.equal(reply, 1, 'cv exists in database');
        });
        client.sismember('testvidadminShortlist', 'testcvid', (err, reply) => {
            t.equal(reply, 1, 'cv is in vacancy set');
            t.end();
        });
    });
});

test('adminApproveCV adds rating to the cvid  and adds cvid to client shortlist and removed from admin shortlist', (t) => {
    let vid = 'testvid';
    let cvid = 'testcvid';
    let rating = 'gold';


    redis.adminApproveCV(cvid, vid, rating, (res) => {
        client.hexists(cvid, 'rating', (err, reply) => {
            t.equal(reply, 1, 'rating has been added to cvid exists');
        });
        client.sismember(vid + 'clientShortlist', cvid, (err, reply) => {
            t.equal(reply, 1, 'cvid added to client shortlist')
        });
        client.sismember(vid + 'adminShortlist', cvid, (err, reply) => {
            t.equal(reply, 0, 'cvid removes from admin shortlist');
            t.end();
        });

    });
});

test('moveToNextInterviewStage moves the cvid from previous stage to new stage list', (t) => {
    let cvid = 'testcvid';
    let vid = 'testvid';
    let nextStage = 'stageTwo';
    let interviewId = 'testinterviewId';

    client.saddAsync(vid + 'stageOne', cvid)
        .then(() => {
            client.hsetAsync(cvid, 'stage', 'stageOne')
        })
        .then(() => {

            redis.moveToNextInterviewStage(cvid, vid, nextStage, interviewId, (err, reply) => {
                client.hget(cvid, 'stage', (err, reply) => {
                    t.equal(reply, 'stageTwo', 'cvid hash stage key has been  updated to stageTwo')
                });
                client.hget(interviewId, 'confirmed', (err, reply) => {
                    t.equal(reply, 'true', 'cvid hash stage key has been  updated to stageTwo')

                });
                client.sismember(vid + 'stageTwo', cvid, (err, reply) => {
                    t.equal(reply, 1, 'cvid has been moved to nextStage set');

                });
                client.sismember(vid + 'stageOne', cvid, (err, reply) => {
                    t.equal(reply, 0, 'cvid has been removed from previousStage set');
                    t.end();
                });
            });
        })
});

test('cleanupset removes hashes in set that no longer exist in the db', (t) => {
    let set = 'testset';
    let hash = { keyName: 'value' }
    let hashKey = 'testhash';
    let dummyHash = 'dummyHash';

    client.hmsetAsync(hashKey, hash)
        .then(() => {
            client.saddAsync(set, hash, dummyHash)
        })
        .then(() => {
            redis.cleanUpSet(set, (err, reply) => {
                client.exists(dummyHash, (err, reply) => {
                    t.equal(reply, 0, 'check hash doesn\'t exists in db')
                })
                client.sismember(set, dummyHash, (err, reply) => {
                    t.equal(reply, 1, 'check that dummy hash isn\'t in set')
                    t.end();
                })
            });
        })
})

test('setHashKeyValue set the key value within in a hash and callsback true or false', (t) => {
    let hash = 'testset';
    let expected = { keyName: 'value' }
    let key = 'keyName';
    let value = 'value';

    redis.setHashKeyValue(hash, key, value, (err, reply) => {
        client.hgetall(hash, (err, reply) => {
            t.deepEqual(reply, expected, 'sets the expected hash')
            t.end();
        });
    });
});

test('removeCV removes cv from stage set', (t) => {
    let cvid = 'testcvid';
    let set = 'testvidstageTwo';

    redis.removeCV(cvid, set, (res) => {
        client.sismember('testvidStageTwo', cvid, (err, reply) => {
            t.equal(reply, 0, 'remove cvid from stageTwo set')
            t.end();
        });
    });
});

test('removeVacancy removes from livejobs and idjobs', (t) => {
    let id = 'testid';
    let vid = 'testvid';
    redis.removeVacancy(vid, id, (res) => {
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
test('trying to stop tests', (t) => {
    let result = 1;
    t.equal(result, 1, 'we have a passed')
    t.end()
    setTimeout(() => {
        client.quit();
    }, 3000);
})

