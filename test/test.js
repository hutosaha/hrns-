'use strict';

const server = require('../lib/index.js');
const test = require('tape');
const Hapi = require('hapi');

const redisApp = require('../lib/db/redis.js');
const client = require('../lib/db/client.js');

const clientCookie = 'user=Fe26.2**2b6d0a38ebadc2ad33da3736dd9d0516bd57a1164e4bf5ac32f5f497584d5322*qVbbmJroXxn8noIRfh7Mpw*YrM9mMy7_7FltC8J8DZ4197-1HX3L90bGphzzSQDzYw4zCjDOFuz2m1Dkcn-iqIp2U0n7m008acfGoS1JmaPWoJ3rzzPkGVdERNeGL4eUQNpdubnhRVnCzzFRGxY_99NN0b60vpDv2QfE64ZuJEwoArngX6A9pQY5E5YuK7fQxos9xCizpnzSYwZrfi_elTkDyrlWmvumYoJpewMRqyZImc4VNqH5RSgCizp__kG1Q4bzdx2E5VU9GP6lhdiuJXdTYNXzDz7L4OKXM9qP8VHx83yepkIJsCuTI12donqAHftJSXCvOzoXsy-RXl-MhjmxJJOWdUjyM2Fan_q7M_odIbGUgE6fHiBtGL1QfsFEbSxjN2kgylP7v-kfqhFk9YjZ9ng5eoJnzjvncB5eOxLaU4L1pBbRnkWxVTMrIhHDt4BqO0xeDUQ3OduNT_F3jiskBjEHVHiyT3lSkzE2DtccIE47hUJQgBa_94RocNGdrjjb4o5Yc1RSoWU7sPkQGQOFkcRj9vBzm5LPmmfYS3Vrgh4Mzr7G_EF8Q8T6OiaHyLvoWqZqFnqdTzFKHQEDIpnSxqc2MJAMCz1XJcyubVLku0JJ0ciTpdyIRPUhpK6O3LlG-Le4ygZPXheLj_j9Ut4zqB5vMt03RV7zsH6Co-Bg2MpsYVgAPksrmyf85v_3j9677yRf4tUNg9c4x8VX2tqYpI4wcRujMgNwGqUf10Gcdtav_tqpyITTcgPzTlrceL0C4OqKnCM1SdZk4inzqeIezFsGui-jqEQ22-3GinNyxcE9wlH4dr4ecXIIkUTW_DbsuxUnO60BJ9gtT4zfiFRVbBu7DZSPgAxedOCmrqqjrNawt_PGsSbWaOXWlwn4xqA9nLGxAy1culeB0pMgJAHOLfbtWnq8ekN076fBO-_cxFEo-Fn9NAC0XWegHxgc78FjZcxgTCeQCW4pV3cg-es**9109ca17ef235bae6830d1c45e7187a2e0690a8be99f4d64415522c7bdfee0d6*0ib-C6ErVtKofE2S1nF-3kmyzgW6P9xD35jOBouQtZI';
const candidateCookie = 'user=Fe26.2**860857e13a2898bc95038bc0490afb784896998c6bceee9006358e5e9c548153*G_v2Q-x60pykghruWVX9Hw*ORYtic-tQ_0jl_IiLMtDZ8fp9wMAYEyWRlXeFcLfsahDoic2k4NaM0EdTw7ZJfX_v7N-Mdfs2hzyvEuXCAuD0ntQ7Fr6pCUAAI3FwRolUAnit1eD1pdUD3DxO8ZYndtfSTZXHLDK0tXwd9UPSSAXnO62yvhckHDUCsTYdFO7nXWI_Sy7QiIzQ7Y2tqNFPlPskvbSLeMu15RXel5Zv2SWGvOBmJPWYztXeOH4LsZHbO0Xcc3uHVs_ZUkNtjyEdOk8_Cx3D_63p1rJN4pG4hDnO2WRJPRrVRa8Q-fTfl612LJEKqy--BrsQ60NZB5VHD77XEWAZfwM0LssFDdE6jzCc-_A70meTapvoExFPY7DapFNWEGsX23RsgyEE_Jh3ClV0x4fjKG9H-cLhBfk9OPGiBVwYCmBkzgy1aAxYxza1H-SLsIVMH2HRFkC3AeWHWgCEuPqC9Xw0E5vCSZ3DsQVnxwpaonijUW3kgqKuVX39MXnZZRZV_LE3YzAh2j8qJr9Bfs8QChBrCR2zT15cd795jvKIxe7BosturHCrA1pWcARvc3xGJT4FZt1GVjggxJP7JWfAgDGtWurgVlpTipCFLrPFVmJD_Q68gf7Q-8P83TwJu519bv_-ONl3NY48ZgBA977Q5sUIH6tfxV61Fldytuw199xtw484Bp1WpDLa16TcuCoh7vvs57gTHBDyUdTiDKbtIpLKN2cT3BFssLM4tgjiouwhAnfP5RCBGt5HAfE40qy4zTHzNuOiEdillI-VW-TbUd6KBe3pmU7mAaVXy83-AhZ90ejaSI_5Ifk_goaYXAY2OAXN2b52UT44dAYlD-5XiKyxVBP4auSdhu1jnCD-50pJ-gesGE5cYR4gnhL62JeUarp69Uf99MqeC2FRf836c4fu8sngts9Gs2KF5sEenLi-3pmFODSz9gaoraBYzYC7iLu7M1BN4xbRRs3_S55pMeHHWU8368txwzLoA**693f06d904e4d52e8d2b6fa5be632d1c1a3338e9a14090c557bb850dcfdfa027*tIXG71gnHMRwRCW9MwQdbhjywrMG0f8rrwTCiDVFM50';
const noScopeCookie = 'user=Fe26.2**622733e4c21b742873bb056f797ce5609657139d8e2ad39469a882be274e9e3c*rKKeRkzDFpnQXVothS8ReA*r8JUw46OXLmFHlfIVWDwC2-P7fy0TJvAU9oGZbJ89-6hxA-OR1hMN7b0kLC8enT5-i1R39DPmm06vV309OjFrkuhqV7tW5zGTt7j5WyxeRv-iTXd0fEL5S-4G6DXA3DzD4opJetQF9qo42h6djabt-eG-7KCquJfWMf9w786OR8NnWRiR1lgxF2LHjYKBLTRUljpfReks2JYr6S1A0QrnH-4LXyCNZRrQ9jwwwIRozuopSz6lgQXHQ32mTbqD7BnfT_LQe9tbaJoaB6_MlxYJRVKVQESU052MDNqJRcQOXU71PXRiVoPJ2f89ZfEbF1v0hpI2OMR7BVvI18I7amRQyb7WqNeR7RVIGvgF7SuoiaCDGcCxVcLzZnperCco85Vam3D89cYeJATa__oBkBb1mvcAB38SYVLd_SeS7ssz9KK_YEYTeUg276SVK1USJNk77j8fwfVKNqKCdkTvosRYp4ZVPgHzaG-3Ri5YSuXTIBmZm8Kdf_09SLb1P1jkEdlym3XHf3RFxCGrnnvzDFkHPtjyQpUiLgBI-_hwOnoQBTB9ejxoVaCYBdum6Vh6VIG7LGLCNQccaifRxVy7VplxG0YYTbKrJBKVeND3FbzhrXTHgG542syXVD-6KW-Nw-poYnCr3zIPRoY9XXbWOV54LTFnFnvvtFCl3BWgnIEQ5xWSPGModOU8UwnjHMLWASlahdswgiYiNpUyv1Rulw47jKMvYzc0jO8DK3uvGUVwXVIt3carC6k2Gz2OcAPvMZdBuxsrNfHIEra4p8kgM3cvbjCNZask6pmBADPkeB83BFapxs9Fh08OJ8vDNd5zjA7cb297na-6D5tFn1VpAtdL2fBrT9wppneFLx4IQ0bpvVihjm3otBzaur_kChqTOU2VQIZI8a-kV4hf-HxCLfqup5opzFIlPez39sZ_XetmuI**f24ab47844e37d61a340d975cd8df1b5b08e4aacf90c2ed4c8414ffa8b2d6495*J6qm-Ms3HWmHwu2XNHoE3yBhHEoYt_m5vJAQdO_truo';
let hash, payload, options;

server.init(0, (err,server) => {

	const testEndPoint = (endpoint, method, statusCode, message, COOKIE) => {
		test(method + ' ' + endpoint + ' ' + 'returns status code ' + statusCode, (t) => {
			options = {
				method: method,
				url: endpoint,
				headers : { cookie : COOKIE }
			};

			server.inject(options, (res) => {
				t.equal(res.statusCode, statusCode, message);
				t.end();
			});
		});
	};

	const testHeaderLocation = (endpoint, method, expectedHeaders, message, COOKIE) => {
		test(method + ' ' + endpoint + ' ' + 'returns status code', (t) => {
			options = {
				method: method,
				url: endpoint,
				headers : { cookie : COOKIE }
			};

			server.inject(options, (res) => {

				t.equal(res.headers.location, expectedHeaders , message +' '+expectedHeaders);
				t.end();
			});
		});
	};

	const testPayload = (endpoint, method, expectedString , message, COOKIE) => {
		test( method + ' ' + endpoint+' '+ 'returns status code', (t) => {
			options = {
				method: method,
				url: endpoint,
				headers : { cookie : COOKIE }
			};

			server.inject(options, (res) => {
				let actual = res.payload.indexOf(expectedString) > -1;
				let expected = true;
				t.equal(actual, expected , message +' '+expectedString);
				t.end();
			});
		});
	};

	test('Server is running', (t) => {
			t.equal(server instanceof Hapi.Server, true ,' Server is an instance of the Hapi Server');
			t.end();
	});

	testEndPoint('/', 'GET', 200, 'responds with response 200');
	testEndPoint('/','GET', 302, 'approved client redirected 302', clientCookie);
	testEndPoint('/','GET', 302, 'approved candidate redirected 302', candidateCookie);
	testEndPoint('/','GET', 200, 'no scope user gets 200 home page', noScopeCookie);

	testEndPoint('/login/client', 'GET', 302, 'unauth user responds with redirect 302');
	testEndPoint('/login/candidate', 'GET', 302, 'unauth user responds with redirect 302');

	testEndPoint('/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
	testEndPoint('/clientsignup', 'GET', 401, 'unauth user responds with 401');

	testEndPoint('/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
	testEndPoint('/candidate','GET', 401, 'unauth user responds with 401');

	testEndPoint('/admindashboard', 'GET', 200, 'auth user responds with response 200',clientCookie);
	testEndPoint('/admindashboard', 'GET', 401, 'unauth user responds with response 401');

	testEndPoint('/logout','GET', 200, 'auth user responds with response 200', clientCookie);

	testHeaderLocation('/','GET','/client','header location response', clientCookie);
	testHeaderLocation('/','GET','/candidate','header location response', candidateCookie);

	//testHeaderLocation('/logout','GET','/logout','header location response', clientCookie);

	testPayload('/logout','GET','<h1>You\'ve logged out!</h1>', 'payload has heading logged out');
	testPayload('/','GET', '<h1>Home page!</h1>', 'unauth / payload has heading Home Page');

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
		redisApp.checkUserType(hash, (type) => {
			t.equal(type, 'client', 'types match');
			t.end();
		});
	});

	test('addRemoveFromSets adds to a set and removes from another', (t) => {
		hash = 'test2';

		client.sadd('awaitingApproval', hash);
		redisApp.addRemoveFromSets('approvedUsers','awaitingApproval', hash, () => {
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
		redisApp.isAMemberOfSet(hash, 'approvedUsers', (res) => {
			t.equal(res, 1, 'correctly identifies hash!');
			t.end();
		});
	});

	test('isExistingUser identifies user in DB', (t) => {
		hash = 'test5';

		client.del(hash);
		client.hset(hash, 'id', hash, (err, res) => {
			if (res) {
				redisApp.isExistingUser(hash, (res) => {
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
		redisApp.addClientSignUpDetails(payload, hash, () => {
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
		redisApp.addAgencySignUpDetails(payload, hash, () => {
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

		redisApp.getSetMembersInfo('testSet', (res) => {
			let actual = res;
			let expected = [ { company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' }, { company: 'facebook', email: 'google@gmail.com', id: 'user123', type: 'client' } ];

			t.deepEqual(actual, expected, 'The correct data was returned!');
			redisApp.getSetMembersInfo('testSet2', (res) => {
				t.equal(res, false, 'empty set should return false');
				t.end();
				client.quit(); // call in final test
			});
		});
	});
	server.stop();
});
// last test call redis.quit();
