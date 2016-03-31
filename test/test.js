'use strict';

const server = require('../lib/index.js');
const test = require('tape');
const Hapi = require('hapi');

const redisApp = require('../lib/db/redis.js');
const client= require('../lib/db/client.js');

const clientCookie = 'user=Fe26.2**2b6d0a38ebadc2ad33da3736dd9d0516bd57a1164e4bf5ac32f5f497584d5322*qVbbmJroXxn8noIRfh7Mpw*YrM9mMy7_7FltC8J8DZ4197-1HX3L90bGphzzSQDzYw4zCjDOFuz2m1Dkcn-iqIp2U0n7m008acfGoS1JmaPWoJ3rzzPkGVdERNeGL4eUQNpdubnhRVnCzzFRGxY_99NN0b60vpDv2QfE64ZuJEwoArngX6A9pQY5E5YuK7fQxos9xCizpnzSYwZrfi_elTkDyrlWmvumYoJpewMRqyZImc4VNqH5RSgCizp__kG1Q4bzdx2E5VU9GP6lhdiuJXdTYNXzDz7L4OKXM9qP8VHx83yepkIJsCuTI12donqAHftJSXCvOzoXsy-RXl-MhjmxJJOWdUjyM2Fan_q7M_odIbGUgE6fHiBtGL1QfsFEbSxjN2kgylP7v-kfqhFk9YjZ9ng5eoJnzjvncB5eOxLaU4L1pBbRnkWxVTMrIhHDt4BqO0xeDUQ3OduNT_F3jiskBjEHVHiyT3lSkzE2DtccIE47hUJQgBa_94RocNGdrjjb4o5Yc1RSoWU7sPkQGQOFkcRj9vBzm5LPmmfYS3Vrgh4Mzr7G_EF8Q8T6OiaHyLvoWqZqFnqdTzFKHQEDIpnSxqc2MJAMCz1XJcyubVLku0JJ0ciTpdyIRPUhpK6O3LlG-Le4ygZPXheLj_j9Ut4zqB5vMt03RV7zsH6Co-Bg2MpsYVgAPksrmyf85v_3j9677yRf4tUNg9c4x8VX2tqYpI4wcRujMgNwGqUf10Gcdtav_tqpyITTcgPzTlrceL0C4OqKnCM1SdZk4inzqeIezFsGui-jqEQ22-3GinNyxcE9wlH4dr4ecXIIkUTW_DbsuxUnO60BJ9gtT4zfiFRVbBu7DZSPgAxedOCmrqqjrNawt_PGsSbWaOXWlwn4xqA9nLGxAy1culeB0pMgJAHOLfbtWnq8ekN076fBO-_cxFEo-Fn9NAC0XWegHxgc78FjZcxgTCeQCW4pV3cg-es**9109ca17ef235bae6830d1c45e7187a2e0690a8be99f4d64415522c7bdfee0d6*0ib-C6ErVtKofE2S1nF-3kmyzgW6P9xD35jOBouQtZI';
const candidateCookie = 'user=Fe26.2**860857e13a2898bc95038bc0490afb784896998c6bceee9006358e5e9c548153*G_v2Q-x60pykghruWVX9Hw*ORYtic-tQ_0jl_IiLMtDZ8fp9wMAYEyWRlXeFcLfsahDoic2k4NaM0EdTw7ZJfX_v7N-Mdfs2hzyvEuXCAuD0ntQ7Fr6pCUAAI3FwRolUAnit1eD1pdUD3DxO8ZYndtfSTZXHLDK0tXwd9UPSSAXnO62yvhckHDUCsTYdFO7nXWI_Sy7QiIzQ7Y2tqNFPlPskvbSLeMu15RXel5Zv2SWGvOBmJPWYztXeOH4LsZHbO0Xcc3uHVs_ZUkNtjyEdOk8_Cx3D_63p1rJN4pG4hDnO2WRJPRrVRa8Q-fTfl612LJEKqy--BrsQ60NZB5VHD77XEWAZfwM0LssFDdE6jzCc-_A70meTapvoExFPY7DapFNWEGsX23RsgyEE_Jh3ClV0x4fjKG9H-cLhBfk9OPGiBVwYCmBkzgy1aAxYxza1H-SLsIVMH2HRFkC3AeWHWgCEuPqC9Xw0E5vCSZ3DsQVnxwpaonijUW3kgqKuVX39MXnZZRZV_LE3YzAh2j8qJr9Bfs8QChBrCR2zT15cd795jvKIxe7BosturHCrA1pWcARvc3xGJT4FZt1GVjggxJP7JWfAgDGtWurgVlpTipCFLrPFVmJD_Q68gf7Q-8P83TwJu519bv_-ONl3NY48ZgBA977Q5sUIH6tfxV61Fldytuw199xtw484Bp1WpDLa16TcuCoh7vvs57gTHBDyUdTiDKbtIpLKN2cT3BFssLM4tgjiouwhAnfP5RCBGt5HAfE40qy4zTHzNuOiEdillI-VW-TbUd6KBe3pmU7mAaVXy83-AhZ90ejaSI_5Ifk_goaYXAY2OAXN2b52UT44dAYlD-5XiKyxVBP4auSdhu1jnCD-50pJ-gesGE5cYR4gnhL62JeUarp69Uf99MqeC2FRf836c4fu8sngts9Gs2KF5sEenLi-3pmFODSz9gaoraBYzYC7iLu7M1BN4xbRRs3_S55pMeHHWU8368txwzLoA**693f06d904e4d52e8d2b6fa5be632d1c1a3338e9a14090c557bb850dcfdfa027*tIXG71gnHMRwRCW9MwQdbhjywrMG0f8rrwTCiDVFM50';
const noScopeCookie = 'user=Fe26.2**edfd638eb3516578fd93d7003e1e6ea22d06d6b624c830d2f1695de69fc8a615*v7XNwMBMREnrqKM-h5Tixg*9HlmFnhIRs7YhQDgWv26STp4w0p7kBOmPTynI-ImTNXN7hJA8ElHW945FuxYVQBkSav-lVJvO26D7EGMu1sOdKZ6xoXMxqY3ux9aLkwjkrMkiR9ikMAPEOaX9J5oDLUU1-Yh3bjTI-7UtSeg-HGh6cC-uZ6O0y7fymsftw9xyqsNl56LNvPPdiggHMiY3EAYxjju4kNRdFmlXkAUn82dOGTtoLl0VnYHQCJTUZTGGat0zsbSqJDKay7GphrtWi8-XPPq2iQyBK_a8akiqdKeNAE55CKYZLPlBCmdGfCT2YrGx7MElrvwpVSIdia5_vNLKkAxbG9T_AOgVUm02HahrmS1HBt3kU_NFoXKayDzeaWPKWT6eUkRSyMWSWpfmCi4TYb9nLhUELuwsjWCaDovswfh9Y09BJ-cSyj2l68fR5nVl7WQxBcRBOMv3vZqjEhrNpPdZ7cEB7VLxJkxeJldwhSkx5mXUhhgLYPfrV4NbOYTwC0fsLR19LO6R-kuKxHP_VHa7yfx2uDkctUXs00j31E4cfTpsD61VASY6Yo8oLD6Ny7s4m-udT_Rx0ima8GWPbiNLPGR1zHrLGiDY9-ap1CM79sSwucY0Ucm5SY7ZFeiNpxqIqHh29Ef-YRT-1TGIqSPZdChoRaDEapq5Q7_zydivJPTk-oTn4XR5EDj6JZ_UtGEZlYTBi3in_YhDMNnBrs7huWlDPlsV_NfUcXETSxAN14-hYZ2wI6GX3NBPmt_3SbJTwDdrFmxm5-VXKVvvbFTTklsMsu-ZePc5SCpSJwIRHSXpcNq2JiFZZkHvVkQo_SWsCfrp5R8DyW8Sg3VcfW8A_HjiD1BiCdav3Z2iLol6e6RU5Lj8xYkYg_dI8GTEgqOsHUDwB1RhNKb6QVxAmmbBMMdwK6gflfXnN5afTpwoflha20x9_p0C4NdOkA**336837fbc8866841ab39d107927e2aa647457a210679e3b38fd53ed48a8df3d8*GcKjJXysdgQZ-8TrKfFmR1r7lhv9VNYQd3rXhXz4IWg';

server.init(0, (err,server) => {

	test('Server is running', (t) => {
			t.equal(server instanceof Hapi.Server, true ,' Server is an instance of the Hapi Server');
			t.end();
	});

	const testEndPoint = (endpoint, method, statusCode, message, COOKIE) => {
		test( method + ' '+ endpoint+' '+ 'return status code '+statusCode, (t)=>{
			var options = {
				method: method,
				url: endpoint,
				headers : { cookie : COOKIE }
			};

			server.inject(options, (res) => {
				t.equal(res.statusCode, statusCode, message );
				t.end();
			});
		});
	};

	testEndPoint('/', 'GET', 200, 'responds with response 200');

	testEndPoint('/','GET', 302, 'approved client redirected 302', clientCookie);
	testEndPoint('/','GET', 302, 'approved candidate redirected 302', candidateCookie);

	testEndPoint('/','GET', 302, 'auth  unapproved no scope user', noScopeCookie );

	testEndPoint('/login/client', 'GET', 302, 'unauth user responds with redirect 302');
	testEndPoint('/login/candidate', 'GET', 302, 'unauth user responds with redirect 302');

	testEndPoint('/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
	testEndPoint('/clientsignup', 'GET', 401, 'unauth user responds with 401');

	testEndPoint('/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
	testEndPoint('/candidate','GET', 401, 'unauth user responds with 401');

	testEndPoint('/admindashboard', 'GET', 200, 'auth user responds with response 200',clientCookie);
	testEndPoint('/admindashboard', 'GET', 401, 'unauth user responds with response 401');


	testEndPoint('/logout','GET', 200, 'auth user responds with response 200', clientCookie);


	const testHeaderLocation = (endpoint, method, expectedHeaders, message, COOKIE) => {
		test( method + ' '+ endpoint+' '+ 'return status code', (t) => {
			var options = {
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

	testHeaderLocation('/','GET','/login/client','header location response', noScopeCookie);
	testHeaderLocation('/','GET','/client','header location response', clientCookie);
	testHeaderLocation('/','GET','/candidate','header location response', candidateCookie);

	//testHeaderLocation('/logout','GET','/logout','header location response', clientCookie);

	const testPayload = (endpoint, method, expectedString , message, COOKIE) => {
		test( method + ' '+ endpoint+' '+ 'return status code', (t) => {
			var options = {
				method: method,
				url: endpoint,
				headers : { cookie : COOKIE }
			};


			server.inject(options, (res) => {
				let actual = res.payload.indexOf(expectedString) > -1;
				let expected =true;
				t.equal(actual, expected , message +' '+expectedString);
				t.end();
			});
		});
	};

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
		client.DEL(listName ,(err,reply) => {
			console.log('DEL',reply);

			client.quit(); // last test call redis.quit();
		});
	});
/*
	test('test addUserForApproval creates a list unapprovedUsers ', (t) => {
		let testId
		redisApp.addUserForApproval()

		client.quit(); // last test call redis.quit();
	});

	*/




	server.stop();


});
// last test call redis.quit();
