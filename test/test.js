'use strict';

const test = require('tape');
const Hapi = require('hapi');

const server = require('../lib/index.js');

const cleanPayload = require('../lib/plugins/utils/app.js').cleanPayload;

const candidateCookie = 'user=Fe26.2**860857e13a2898bc95038bc0490afb784896998c6bceee9006358e5e9c548153*G_v2Q-x60pykghruWVX9Hw*ORYtic-tQ_0jl_IiLMtDZ8fp9wMAYEyWRlXeFcLfsahDoic2k4NaM0EdTw7ZJfX_v7N-Mdfs2hzyvEuXCAuD0ntQ7Fr6pCUAAI3FwRolUAnit1eD1pdUD3DxO8ZYndtfSTZXHLDK0tXwd9UPSSAXnO62yvhckHDUCsTYdFO7nXWI_Sy7QiIzQ7Y2tqNFPlPskvbSLeMu15RXel5Zv2SWGvOBmJPWYztXeOH4LsZHbO0Xcc3uHVs_ZUkNtjyEdOk8_Cx3D_63p1rJN4pG4hDnO2WRJPRrVRa8Q-fTfl612LJEKqy--BrsQ60NZB5VHD77XEWAZfwM0LssFDdE6jzCc-_A70meTapvoExFPY7DapFNWEGsX23RsgyEE_Jh3ClV0x4fjKG9H-cLhBfk9OPGiBVwYCmBkzgy1aAxYxza1H-SLsIVMH2HRFkC3AeWHWgCEuPqC9Xw0E5vCSZ3DsQVnxwpaonijUW3kgqKuVX39MXnZZRZV_LE3YzAh2j8qJr9Bfs8QChBrCR2zT15cd795jvKIxe7BosturHCrA1pWcARvc3xGJT4FZt1GVjggxJP7JWfAgDGtWurgVlpTipCFLrPFVmJD_Q68gf7Q-8P83TwJu519bv_-ONl3NY48ZgBA977Q5sUIH6tfxV61Fldytuw199xtw484Bp1WpDLa16TcuCoh7vvs57gTHBDyUdTiDKbtIpLKN2cT3BFssLM4tgjiouwhAnfP5RCBGt5HAfE40qy4zTHzNuOiEdillI-VW-TbUd6KBe3pmU7mAaVXy83-AhZ90ejaSI_5Ifk_goaYXAY2OAXN2b52UT44dAYlD-5XiKyxVBP4auSdhu1jnCD-50pJ-gesGE5cYR4gnhL62JeUarp69Uf99MqeC2FRf836c4fu8sngts9Gs2KF5sEenLi-3pmFODSz9gaoraBYzYC7iLu7M1BN4xbRRs3_S55pMeHHWU8368txwzLoA**693f06d904e4d52e8d2b6fa5be632d1c1a3338e9a14090c557bb850dcfdfa027*tIXG71gnHMRwRCW9MwQdbhjywrMG0f8rrwTCiDVFM50';
const noScopeCookie   = 'user=Fe26.2**622733e4c21b742873bb056f797ce5609657139d8e2ad39469a882be274e9e3c*rKKeRkzDFpnQXVothS8ReA*r8JUw46OXLmFHlfIVWDwC2-P7fy0TJvAU9oGZbJ89-6hxA-OR1hMN7b0kLC8enT5-i1R39DPmm06vV309OjFrkuhqV7tW5zGTt7j5WyxeRv-iTXd0fEL5S-4G6DXA3DzD4opJetQF9qo42h6djabt-eG-7KCquJfWMf9w786OR8NnWRiR1lgxF2LHjYKBLTRUljpfReks2JYr6S1A0QrnH-4LXyCNZRrQ9jwwwIRozuopSz6lgQXHQ32mTbqD7BnfT_LQe9tbaJoaB6_MlxYJRVKVQESU052MDNqJRcQOXU71PXRiVoPJ2f89ZfEbF1v0hpI2OMR7BVvI18I7amRQyb7WqNeR7RVIGvgF7SuoiaCDGcCxVcLzZnperCco85Vam3D89cYeJATa__oBkBb1mvcAB38SYVLd_SeS7ssz9KK_YEYTeUg276SVK1USJNk77j8fwfVKNqKCdkTvosRYp4ZVPgHzaG-3Ri5YSuXTIBmZm8Kdf_09SLb1P1jkEdlym3XHf3RFxCGrnnvzDFkHPtjyQpUiLgBI-_hwOnoQBTB9ejxoVaCYBdum6Vh6VIG7LGLCNQccaifRxVy7VplxG0YYTbKrJBKVeND3FbzhrXTHgG542syXVD-6KW-Nw-poYnCr3zIPRoY9XXbWOV54LTFnFnvvtFCl3BWgnIEQ5xWSPGModOU8UwnjHMLWASlahdswgiYiNpUyv1Rulw47jKMvYzc0jO8DK3uvGUVwXVIt3carC6k2Gz2OcAPvMZdBuxsrNfHIEra4p8kgM3cvbjCNZask6pmBADPkeB83BFapxs9Fh08OJ8vDNd5zjA7cb297na-6D5tFn1VpAtdL2fBrT9wppneFLx4IQ0bpvVihjm3otBzaur_kChqTOU2VQIZI8a-kV4hf-HxCLfqup5opzFIlPez39sZ_XetmuI**f24ab47844e37d61a340d975cd8df1b5b08e4aacf90c2ed4c8414ffa8b2d6495*J6qm-Ms3HWmHwu2XNHoE3yBhHEoYt_m5vJAQdO_truo';
const clientCookie 	  = 'user=Fe26.2**2b6d0a38ebadc2ad33da3736dd9d0516bd57a1164e4bf5ac32f5f497584d5322*qVbbmJroXxn8noIRfh7Mpw*YrM9mMy7_7FltC8J8DZ4197-1HX3L90bGphzzSQDzYw4zCjDOFuz2m1Dkcn-iqIp2U0n7m008acfGoS1JmaPWoJ3rzzPkGVdERNeGL4eUQNpdubnhRVnCzzFRGxY_99NN0b60vpDv2QfE64ZuJEwoArngX6A9pQY5E5YuK7fQxos9xCizpnzSYwZrfi_elTkDyrlWmvumYoJpewMRqyZImc4VNqH5RSgCizp__kG1Q4bzdx2E5VU9GP6lhdiuJXdTYNXzDz7L4OKXM9qP8VHx83yepkIJsCuTI12donqAHftJSXCvOzoXsy-RXl-MhjmxJJOWdUjyM2Fan_q7M_odIbGUgE6fHiBtGL1QfsFEbSxjN2kgylP7v-kfqhFk9YjZ9ng5eoJnzjvncB5eOxLaU4L1pBbRnkWxVTMrIhHDt4BqO0xeDUQ3OduNT_F3jiskBjEHVHiyT3lSkzE2DtccIE47hUJQgBa_94RocNGdrjjb4o5Yc1RSoWU7sPkQGQOFkcRj9vBzm5LPmmfYS3Vrgh4Mzr7G_EF8Q8T6OiaHyLvoWqZqFnqdTzFKHQEDIpnSxqc2MJAMCz1XJcyubVLku0JJ0ciTpdyIRPUhpK6O3LlG-Le4ygZPXheLj_j9Ut4zqB5vMt03RV7zsH6Co-Bg2MpsYVgAPksrmyf85v_3j9677yRf4tUNg9c4x8VX2tqYpI4wcRujMgNwGqUf10Gcdtav_tqpyITTcgPzTlrceL0C4OqKnCM1SdZk4inzqeIezFsGui-jqEQ22-3GinNyxcE9wlH4dr4ecXIIkUTW_DbsuxUnO60BJ9gtT4zfiFRVbBu7DZSPgAxedOCmrqqjrNawt_PGsSbWaOXWlwn4xqA9nLGxAy1culeB0pMgJAHOLfbtWnq8ekN076fBO-_cxFEo-Fn9NAC0XWegHxgc78FjZcxgTCeQCW4pV3cg-es**9109ca17ef235bae6830d1c45e7187a2e0690a8be99f4d64415522c7bdfee0d6*0ib-C6ErVtKofE2S1nF-3kmyzgW6P9xD35jOBouQtZI';

let options;

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
				t.equal(actual, expected, message + ' ' + expectedString);
				t.end();
			});
		});
	};

	test('Server is running', (t) => {
			t.equal(server instanceof Hapi.Server, true, ' Server is an instance of the Hapi Server');
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

	testEndPoint('/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);
	testEndPoint('/admindashboard', 'GET', 401, 'unauth user responds with response 401');

	testEndPoint('/logout','GET', 200, 'auth user responds with response 200', clientCookie);

	testHeaderLocation('/','GET','/client','header location response', clientCookie);
	testHeaderLocation('/','GET','/candidate','header location response', candidateCookie);

	testPayload('/logout','GET','<h1>You\'ve logged out!</h1>', 'payload has heading logged out');
	testPayload('/','GET', '<h1>Home page!</h1>', 'unauth / payload has heading Home Page');

	test('clean payload deletes empty strings in an object', (t) => {
		let payload = { name: 'Joe Bloggs', age: 10, food: '', sport: '' };
		let expected = { name: 'Joe Bloggs', age: 10 };
		cleanPayload(payload);
		t.deepEqual(payload, expected, 'payload cleaned!');
		t.end();
	});

	server.stop(); // has to be here to prevent other tests from hanging
});
