'use strict';

const test = require('tape');
const Hapi = require('hapi');

const server = require('../lib/index.js');
const client = require('../lib/db/client.js');
// const redis  = require('../lib/db/redis.js');

const cleanPayload = require('../lib/plugins/utils/app.js').cleanPayload;

const adminCookie			= 'user=Fe26.2**55d530dcf02516745c8f48d776ec265c893e558b28321b7bbecd37edae1486a2*IgCzPs0w_wsHkvYt7zTmJQ*A8BQ21XGPkO3MW2ICp5ASeVBNdxdr9Xagw3Ar4zsqor1EfmOzQz2lQAQ_m5DigY1g3sAvGn8ZseYaUpfc-MYTckfZz5s9EJGds32CZbL7ixQA00mKT5QYCe4yEjXN2tlvpipobJz25tPsv-5sb4mTGKygyN4kgpJr-In2y-vbmivN-t-dJD3uElx_U5myKf-HF1sCpUc55KdlV7p-gzbEr8vZ_k1pYaGAOrFYRncfZCEmHxQwP8yvDeb1FJaIsebhpzGIXZhEqTnxDHcObifWayDRXWHW10vARs5PXO-UvnbtgN5TeM5PR2tdFX9X_cPOdkIIKQvrvgYcEgG4Yw4Qsnndty4eUJIAsrbQIpze7cjujszlVJOgMdTnzYSpsfCq1e1ckBdonj1qbfdQqhO8POet_Xc44ayEhl5f96tXNUTJ_dlvKNzKVhmbxg11tXAYpxuFEt0nQOXsDzXFK8kiiE6VF71WA_NTSnUWnLgKF6o_e1HCaPvMQ4sCAJO4T4hCydzzNOQ9UNJSWX8GK1W59xp0dxuZTx9WLdLJoI2sKf6N3bt_7S3OCcN5SqosjxuD6mmHQ72hLJudkTf4sY-ZfQry5-c_22mpKugiI05bDqt13hAcIAZVlKzeF2xUKOj1D1r1FB0r9vpyHTa8a3GR29mhfi8PY18xdttogKCeKg8IuMpPCHHi5tfChkABXlPk4RPLOHuIFsUeCb8-O8l3R3TBrPfAkCXcltLXF9_KSBkn3FNlYKvB3FfaAVVUdbq4EJzpPpCpLqozTc6Hw4PxiAMMytN4xwj69lMN_aIdHoRX4_IeJJ1K07_-dJ0AvavTM6XrWWeDSjxy9aMhkenwTRZ16gizJ_d3l6BmVzSzBXzPtyGdLjkp3NF42afHCXx0c0SqiyHU31aotIxNiFERN9K6iklSvIFG4hgBhJCRjE**378ddd94455fb2f3290b8fecbf38770dd24fe23719252658ff1b4a8f9f071123*uT_aDsgw2Dm8ke4rPk8_TK-ZR8--O2jRZ_w9D9p_AGY';
const clientCookie 	  = 'user=Fe26.2**2b6d0a38ebadc2ad33da3736dd9d0516bd57a1164e4bf5ac32f5f497584d5322*qVbbmJroXxn8noIRfh7Mpw*YrM9mMy7_7FltC8J8DZ4197-1HX3L90bGphzzSQDzYw4zCjDOFuz2m1Dkcn-iqIp2U0n7m008acfGoS1JmaPWoJ3rzzPkGVdERNeGL4eUQNpdubnhRVnCzzFRGxY_99NN0b60vpDv2QfE64ZuJEwoArngX6A9pQY5E5YuK7fQxos9xCizpnzSYwZrfi_elTkDyrlWmvumYoJpewMRqyZImc4VNqH5RSgCizp__kG1Q4bzdx2E5VU9GP6lhdiuJXdTYNXzDz7L4OKXM9qP8VHx83yepkIJsCuTI12donqAHftJSXCvOzoXsy-RXl-MhjmxJJOWdUjyM2Fan_q7M_odIbGUgE6fHiBtGL1QfsFEbSxjN2kgylP7v-kfqhFk9YjZ9ng5eoJnzjvncB5eOxLaU4L1pBbRnkWxVTMrIhHDt4BqO0xeDUQ3OduNT_F3jiskBjEHVHiyT3lSkzE2DtccIE47hUJQgBa_94RocNGdrjjb4o5Yc1RSoWU7sPkQGQOFkcRj9vBzm5LPmmfYS3Vrgh4Mzr7G_EF8Q8T6OiaHyLvoWqZqFnqdTzFKHQEDIpnSxqc2MJAMCz1XJcyubVLku0JJ0ciTpdyIRPUhpK6O3LlG-Le4ygZPXheLj_j9Ut4zqB5vMt03RV7zsH6Co-Bg2MpsYVgAPksrmyf85v_3j9677yRf4tUNg9c4x8VX2tqYpI4wcRujMgNwGqUf10Gcdtav_tqpyITTcgPzTlrceL0C4OqKnCM1SdZk4inzqeIezFsGui-jqEQ22-3GinNyxcE9wlH4dr4ecXIIkUTW_DbsuxUnO60BJ9gtT4zfiFRVbBu7DZSPgAxedOCmrqqjrNawt_PGsSbWaOXWlwn4xqA9nLGxAy1culeB0pMgJAHOLfbtWnq8ekN076fBO-_cxFEo-Fn9NAC0XWegHxgc78FjZcxgTCeQCW4pV3cg-es**9109ca17ef235bae6830d1c45e7187a2e0690a8be99f4d64415522c7bdfee0d6*0ib-C6ErVtKofE2S1nF-3kmyzgW6P9xD35jOBouQtZI';
const candidateCookie = 'user=Fe26.2**860857e13a2898bc95038bc0490afb784896998c6bceee9006358e5e9c548153*G_v2Q-x60pykghruWVX9Hw*ORYtic-tQ_0jl_IiLMtDZ8fp9wMAYEyWRlXeFcLfsahDoic2k4NaM0EdTw7ZJfX_v7N-Mdfs2hzyvEuXCAuD0ntQ7Fr6pCUAAI3FwRolUAnit1eD1pdUD3DxO8ZYndtfSTZXHLDK0tXwd9UPSSAXnO62yvhckHDUCsTYdFO7nXWI_Sy7QiIzQ7Y2tqNFPlPskvbSLeMu15RXel5Zv2SWGvOBmJPWYztXeOH4LsZHbO0Xcc3uHVs_ZUkNtjyEdOk8_Cx3D_63p1rJN4pG4hDnO2WRJPRrVRa8Q-fTfl612LJEKqy--BrsQ60NZB5VHD77XEWAZfwM0LssFDdE6jzCc-_A70meTapvoExFPY7DapFNWEGsX23RsgyEE_Jh3ClV0x4fjKG9H-cLhBfk9OPGiBVwYCmBkzgy1aAxYxza1H-SLsIVMH2HRFkC3AeWHWgCEuPqC9Xw0E5vCSZ3DsQVnxwpaonijUW3kgqKuVX39MXnZZRZV_LE3YzAh2j8qJr9Bfs8QChBrCR2zT15cd795jvKIxe7BosturHCrA1pWcARvc3xGJT4FZt1GVjggxJP7JWfAgDGtWurgVlpTipCFLrPFVmJD_Q68gf7Q-8P83TwJu519bv_-ONl3NY48ZgBA977Q5sUIH6tfxV61Fldytuw199xtw484Bp1WpDLa16TcuCoh7vvs57gTHBDyUdTiDKbtIpLKN2cT3BFssLM4tgjiouwhAnfP5RCBGt5HAfE40qy4zTHzNuOiEdillI-VW-TbUd6KBe3pmU7mAaVXy83-AhZ90ejaSI_5Ifk_goaYXAY2OAXN2b52UT44dAYlD-5XiKyxVBP4auSdhu1jnCD-50pJ-gesGE5cYR4gnhL62JeUarp69Uf99MqeC2FRf836c4fu8sngts9Gs2KF5sEenLi-3pmFODSz9gaoraBYzYC7iLu7M1BN4xbRRs3_S55pMeHHWU8368txwzLoA**693f06d904e4d52e8d2b6fa5be632d1c1a3338e9a14090c557bb850dcfdfa027*tIXG71gnHMRwRCW9MwQdbhjywrMG0f8rrwTCiDVFM50';
const noScopeCookie   = 'user=Fe26.2**622733e4c21b742873bb056f797ce5609657139d8e2ad39469a882be274e9e3c*rKKeRkzDFpnQXVothS8ReA*r8JUw46OXLmFHlfIVWDwC2-P7fy0TJvAU9oGZbJ89-6hxA-OR1hMN7b0kLC8enT5-i1R39DPmm06vV309OjFrkuhqV7tW5zGTt7j5WyxeRv-iTXd0fEL5S-4G6DXA3DzD4opJetQF9qo42h6djabt-eG-7KCquJfWMf9w786OR8NnWRiR1lgxF2LHjYKBLTRUljpfReks2JYr6S1A0QrnH-4LXyCNZRrQ9jwwwIRozuopSz6lgQXHQ32mTbqD7BnfT_LQe9tbaJoaB6_MlxYJRVKVQESU052MDNqJRcQOXU71PXRiVoPJ2f89ZfEbF1v0hpI2OMR7BVvI18I7amRQyb7WqNeR7RVIGvgF7SuoiaCDGcCxVcLzZnperCco85Vam3D89cYeJATa__oBkBb1mvcAB38SYVLd_SeS7ssz9KK_YEYTeUg276SVK1USJNk77j8fwfVKNqKCdkTvosRYp4ZVPgHzaG-3Ri5YSuXTIBmZm8Kdf_09SLb1P1jkEdlym3XHf3RFxCGrnnvzDFkHPtjyQpUiLgBI-_hwOnoQBTB9ejxoVaCYBdum6Vh6VIG7LGLCNQccaifRxVy7VplxG0YYTbKrJBKVeND3FbzhrXTHgG542syXVD-6KW-Nw-poYnCr3zIPRoY9XXbWOV54LTFnFnvvtFCl3BWgnIEQ5xWSPGModOU8UwnjHMLWASlahdswgiYiNpUyv1Rulw47jKMvYzc0jO8DK3uvGUVwXVIt3carC6k2Gz2OcAPvMZdBuxsrNfHIEra4p8kgM3cvbjCNZask6pmBADPkeB83BFapxs9Fh08OJ8vDNd5zjA7cb297na-6D5tFn1VpAtdL2fBrT9wppneFLx4IQ0bpvVihjm3otBzaur_kChqTOU2VQIZI8a-kV4hf-HxCLfqup5opzFIlPez39sZ_XetmuI**f24ab47844e37d61a340d975cd8df1b5b08e4aacf90c2ed4c8414ffa8b2d6495*J6qm-Ms3HWmHwu2XNHoE3yBhHEoYt_m5vJAQdO_truo';
const notAdminCookie  = 'user=Fe26.2**4b2de8ebe8b88339f18074afecda5a092355d16f15d5aa85809acef2b0f9dffa*hq0Wz1_Khdi8VZNcbt3xkA*RWl0rd6Ho5eA6SVZjhXmLUf3nMAnEiK3EcJhb882PEyesF6oVpIpx30Fnkg3FnpDw9xPcPZEZ26JQ4sY1uU7pKC4G9YqzhNIgNllY7UNdIKp5yKh3-hanAyV2HtIaDjK9Dc8cInXVEdskpOSCySKyuxj23S3mkh8E640nAIpIcQa5_LRpv9i7It-CM_CNnrrBXj6hnCPYEJJaoNDGF_pYIe_mkjdbAXPsKA_q9oIUzhzIHlj0ngwFYX1Oj1MZ8pvsRKSXzVdu_JofoNXTjDFxIyI5omX90NqRG83NxCmVqT8RouGetQrFo7oyth63dGmXtp2NK3XUGkccvR1cilZOqQC0CoRgcdNfSP4VCDO-5cqtDI29Wx0Cyro6rvAbUWBVwgMPzuZ2qke4V6g3WDzSfimHGTk9jY_Er7IyMj-8PiOhGE_VJHaIMhpB8HTGhKafoqBYO2dXXaSOs3ICm_qF5dohvDwqYOHstZ5mHH5FTjSIY1-yTXftplncXleJ5KwqFWVoivA2am3snSSXFiLsOKnYUdrglt2f6PncgCrybzyPG9M8xtquNZ9wC_IR_beIbgzm01xSf64yNkNk2RWqoN6pWV5IHwAMSWiXIoIje2GhZ0iBhzBaEOdExStv6qc_lTJSQ_65ycO7yInh5euhjoRBv7U70fpeI3rOdMfd7gLNCRWfqP_RtAEGbRcwXBueBGDKsAQ-KN3viRwVqkm-bZWjj4dLuTwyO4n4LSkmF2_JFK3viPY52JPldRbofwd_ocj3V7i2HeQkE4EYJa1qpYz2w6kWlnA4SpuUoyGUDzPPinU65xpblJk7MonnsNEaLJi3rYrp94KnlTfhLf2yhAe4jvDti4kBnLuHZDr5tw_JFPjE44YzueOISDwfRYlna1QaZ2TFSCICOgl2lvxXhYPpcn1xiCdz-pRMr-xaLY**47cf87ef8dcf760748a4d41aae8b882548c0293dbe30c2a648e398b32dfc8a44*IYtWcygT8kCxCtoHGZhXTwKEyvK7BMpp1X-8X8AoYxk';
const agencyCookie		= 'user=Fe26.2**2f9bfa92d78c3aea2756bb7244cd0fa697f5fe80041c83ddb83e6ac0d5ceb807*qalsdmnPb1L3CcqkGsBy9w*q7ySwPNBUUj_ZfQ93ZQioe-Wd825_7Io9usc1qqjLcjIXmBReXgtHYsgJlcwzmtgEGJnPQ8UCf5uTB8kX0zScgLUn5vDc_ts6pJp9pirKgDfGMfvDMpfEBLREa1vcqsoqtUIxcrfpqWVaZg6O8sxD7JIVK_2oiW_jNASu1yp38QHP3IqEluRG6XSUZjVHTGRPjfBP3azBb6LKY6bvnr4bDIGyfuV_FYHicUqH0C8z9rOTex5aFf5ci2zGmu6S6B15Ei0Td86antu-8h0g1aUvapLXoTmEW6mFMR4k1Lv8yPcu9mK6T7dz66xFbVn15csX7QtQ37FxcXcg2pVsZN8lv36xSIw9fNUeQegqMyW7ayoUdiQ-NG9ai-q1zd-09vyzEcAnjcotZf58ZQoRQA4xPh1D-ygCG8IdE-6JcNaPHWmL2GUUSr7FeIsy2JcqmJu8m0HTSYV8iP1lMmoBac6_ulaMDaWpF0WHBm3WThLrh-ddfP98KRJKLsPXEcOFsMr1ZsD7VgJmV-L5ptq7dHGXNPbfCls6FkugPJb7hEen_EJkL6fB5KtzuYeqvDHG2OT3pw_ZyseQbDk21u1AeyELViYDkxh5lGTwk4Rth3lGj84ulpMFzP7xA-JSjuzUtylXPcujgPNpTeFlBM-rB1Z7U_8GY5X-twQZ9AExH7u8CbYpb0DDZNq-OKTpTJoj8do5eOcB4jtqWMxvOrOjwrdCOLV1AGmPnuwAcR4LcbgSzZEm4gPyD0GNc3VK4jItktyZAJAYamyqB25uOtDKczaIMgJkce_TuIPHzSLvR3Lh3xG3xQZqi2uqe3bLeQ6g3b-HpdKd0ulMMMWm8dzzbify7TXyWxq7PlKxEV0lyGKu6e5j8-sB3KyVc9QeV95ylHp7wKkBy6EUAxUExLnWgarz5AMnyA5ysIVD0aiiLDr4SB2JuDOTQdNxMQeS8itqfUB**c1f925a797b4a0fa3c64a9b9e513687b58cf40e888ea74694f788eaaeb264393*Fo3IsFp8deYH297vYIIyPprFlbTFuQ-suuj6hBru_xw';

let options;

server.init(0, (err,server) => {

	client.select(3, function(){
		console.log('connected to db3');
	});

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
				console.log('res.payload', res.payload);
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
	testHeaderLocation('/','GET','/client','header location response', clientCookie);
	testHeaderLocation('/','GET','/candidate','header location response', candidateCookie);
	testPayload('/','GET', '<h1>Home page!</h1>', 'unauth / payload has heading Home Page');

	testEndPoint('/admindashboard', 'GET', 200, 'auth user responds with response 200', clientCookie);
	testEndPoint('/admindashboard', 'GET', 200, 'nonAdmin responds with 200', notAdminCookie);
	testPayload('/admindashboard', 'GET', 'it doesn\' look like you\'re an admin!', 'correct message displayed to non-Admin', notAdminCookie);
	testEndPoint('/admindashboard', 'GET', 401, 'unauth user responds with response 401');

	testEndPoint('/adminvacancies', 'GET', 200, 'admin viewing vacancies responds with 200', adminCookie);

	testEndPoint('/admin/job/123', 'GET', 200, 'admin gets 200 response', adminCookie);
	testEndPoint('/admin/job/123', 'GET', 403, 'nonAdmin gets 403 response', notAdminCookie);

	// tests that require a vid
	client.hmset('test-vid-123', { jobTitle: 'developer'}, () => {
		testPayload('/admin/job/test-vid-123', 'GET', 'developer', 'admin job page delivers vid info', adminCookie);
		testEndPoint('/agency/job/test-vid-123', 'GET', 403, 'unauthorised user viewing agency job responds with 403', candidateCookie);
		testEndPoint('/agency/job/test-vid-123', 'GET', 200, 'agency viewing agency job responds with 200', agencyCookie);
	});

	testPayload('/agency/job/wrong-vid','GET','Sorry, something went wrong', 'error handles incorrect vid', agencyCookie);

	testEndPoint('/candidate', 'GET', 200, 'auth user responds with 200', candidateCookie);
	testEndPoint('/candidate','GET', 401, 'unauth user responds with 401');

	testEndPoint('/clientsignup', 'GET', 200, 'auth user responds with 200', clientCookie);
	testEndPoint('/clientsignup', 'GET', 401, 'unauth user responds with 401');

	testEndPoint('/login/client', 'GET', 302, 'unauth user responds with redirect 302');
	testEndPoint('/login/candidate', 'GET', 302, 'unauth user responds with redirect 302');

	testPayload('/logout','GET','<h1>You\'ve logged out!</h1>', 'payload has heading logged out');
	testEndPoint('/logout','GET', 200, 'auth user responds with response 200', clientCookie);

	// tests that depends on liveJobs being empty
	client.del('liveJobs', () => { // 2 callbacks required because a redis test was making 1 callback fail :(
		client.del('liveJobs', () => {
			testPayload('/adminvacancies', 'GET', 'No live vacancies', 'correct message delivered for no vacancies', adminCookie);
			testPayload('/agency', 'GET', 'There are no vacancies', 'agency homepage apologies with no vacancies', agencyCookie);
		});
	});

	test('clean payload deletes empty strings in an object', (t) => {
		let payload = { name: 'Joe Bloggs', age: 10, food: '', sport: '' };
		let expected = { name: 'Joe Bloggs', age: 10 };
		cleanPayload(payload);
		t.deepEqual(payload, expected, 'payload cleaned!');
		t.end();
	});
	server.stop(); // has to be here to prevent other tests from hanging
});
