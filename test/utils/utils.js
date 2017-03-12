'use strict';

const test = require('tape');
const client = require('../../lib/db/client.js');

let app = module.exports = {};

let options;

app.nonExistingUserCookie = 'user=Fe26.2**e4145d6d76cc73ecb11c24227601aa2a0a0ce95391a315d935586962a256c683*v4b4bmmaO0zDkqoV5C3d-w*vockqifTNv0xt2Ie-Xba-2jcz3_0kOpffVaxZtUngfbUu0ij8dNA2A0RvHoEt-3qn2oZ-SSyLfpW4bL2_GgcPllzkBZaAxoMNDrTdp13-WbT8Rd7yhLm6FpdUpczmSss7EfxdS5KqDH1RP7cQIy7tHw9doDhfi5Rap3cQjt4hAuTAR1-kh2wDLul-uvno0tV5_RsgUzvHPMGzd0Yri4wvonsyosJDhvuV5JlOvSImG7DDTR-riHcQeZkURQlq9Vt75ylr7ue3ex8wYWZdrC2Z5jFm9md6BI0w_U5Orcbm4hZGngjdOBWP-1igGO7J_HcKpE16EprW_VzvDPpu978lJQFIuj1BWHFT49Klqlz-v1H5g9Ss1n5GEsJE81SbD3bp3hZakuzsj67nZg83uK9iqyCpycmWKxTemp_IcFYfiAMsZmy3t7loU60tSwurMIaFqu0PLeBZLrjmHxPiBt4bvbY2CVcBwm4UC7Nv8cx2TxgAMp10tYFAaLylXdZK54-wgg-wroVnXTA0VJbVeHaczDLYXUg4Z95SFi5YtMy8X5PvujI36fRwTmlQJkQsXE5GKfgzgpyISFBXET9HWqQFU-Q24VYvGQiZw9nuakJQdB1vA6Tjg6thjZ35wEZwqF0lt6hqvJAwy6QY5lemxvqLhf8qGTRb88i-3xAwN7-fcIE2n20DwsZMwVnk774K9QBgngvmKnAai6fqyvno0cNCLl88eozuIwOTinHJ4PpRjna2lpOBUUlH5asIfovSfcr6dFl1TIU96wqd0lJ8HYjOLgyQxVCLIFnNzLj3iGK6bjTAMWf4uQkcYdWAb0WeKTfcYKlA8eQJ388UGsKzVKAooizp8zRsdKD4ZdmN0G4xcX58bOJjzUNkI_4pjkq-i0b**0e0f3a0c5aef2fbced0fcbac5e33a65b895a6893b5174dd876e43edacef3377f*Mb1DlanKlAKYzA7ECEIsoUWTJRlwjbtaUXlaxjlK0p4';
app.candidateCookie       = 'user=Fe26.2**860857e13a2898bc95038bc0490afb784896998c6bceee9006358e5e9c548153*G_v2Q-x60pykghruWVX9Hw*ORYtic-tQ_0jl_IiLMtDZ8fp9wMAYEyWRlXeFcLfsahDoic2k4NaM0EdTw7ZJfX_v7N-Mdfs2hzyvEuXCAuD0ntQ7Fr6pCUAAI3FwRolUAnit1eD1pdUD3DxO8ZYndtfSTZXHLDK0tXwd9UPSSAXnO62yvhckHDUCsTYdFO7nXWI_Sy7QiIzQ7Y2tqNFPlPskvbSLeMu15RXel5Zv2SWGvOBmJPWYztXeOH4LsZHbO0Xcc3uHVs_ZUkNtjyEdOk8_Cx3D_63p1rJN4pG4hDnO2WRJPRrVRa8Q-fTfl612LJEKqy--BrsQ60NZB5VHD77XEWAZfwM0LssFDdE6jzCc-_A70meTapvoExFPY7DapFNWEGsX23RsgyEE_Jh3ClV0x4fjKG9H-cLhBfk9OPGiBVwYCmBkzgy1aAxYxza1H-SLsIVMH2HRFkC3AeWHWgCEuPqC9Xw0E5vCSZ3DsQVnxwpaonijUW3kgqKuVX39MXnZZRZV_LE3YzAh2j8qJr9Bfs8QChBrCR2zT15cd795jvKIxe7BosturHCrA1pWcARvc3xGJT4FZt1GVjggxJP7JWfAgDGtWurgVlpTipCFLrPFVmJD_Q68gf7Q-8P83TwJu519bv_-ONl3NY48ZgBA977Q5sUIH6tfxV61Fldytuw199xtw484Bp1WpDLa16TcuCoh7vvs57gTHBDyUdTiDKbtIpLKN2cT3BFssLM4tgjiouwhAnfP5RCBGt5HAfE40qy4zTHzNuOiEdillI-VW-TbUd6KBe3pmU7mAaVXy83-AhZ90ejaSI_5Ifk_goaYXAY2OAXN2b52UT44dAYlD-5XiKyxVBP4auSdhu1jnCD-50pJ-gesGE5cYR4gnhL62JeUarp69Uf99MqeC2FRf836c4fu8sngts9Gs2KF5sEenLi-3pmFODSz9gaoraBYzYC7iLu7M1BN4xbRRs3_S55pMeHHWU8368txwzLoA**693f06d904e4d52e8d2b6fa5be632d1c1a3338e9a14090c557bb850dcfdfa027*tIXG71gnHMRwRCW9MwQdbhjywrMG0f8rrwTCiDVFM50';
app.notAdminCookie        = 'user=Fe26.2**4b2de8ebe8b88339f18074afecda5a092355d16f15d5aa85809acef2b0f9dffa*hq0Wz1_Khdi8VZNcbt3xkA*RWl0rd6Ho5eA6SVZjhXmLUf3nMAnEiK3EcJhb882PEyesF6oVpIpx30Fnkg3FnpDw9xPcPZEZ26JQ4sY1uU7pKC4G9YqzhNIgNllY7UNdIKp5yKh3-hanAyV2HtIaDjK9Dc8cInXVEdskpOSCySKyuxj23S3mkh8E640nAIpIcQa5_LRpv9i7It-CM_CNnrrBXj6hnCPYEJJaoNDGF_pYIe_mkjdbAXPsKA_q9oIUzhzIHlj0ngwFYX1Oj1MZ8pvsRKSXzVdu_JofoNXTjDFxIyI5omX90NqRG83NxCmVqT8RouGetQrFo7oyth63dGmXtp2NK3XUGkccvR1cilZOqQC0CoRgcdNfSP4VCDO-5cqtDI29Wx0Cyro6rvAbUWBVwgMPzuZ2qke4V6g3WDzSfimHGTk9jY_Er7IyMj-8PiOhGE_VJHaIMhpB8HTGhKafoqBYO2dXXaSOs3ICm_qF5dohvDwqYOHstZ5mHH5FTjSIY1-yTXftplncXleJ5KwqFWVoivA2am3snSSXFiLsOKnYUdrglt2f6PncgCrybzyPG9M8xtquNZ9wC_IR_beIbgzm01xSf64yNkNk2RWqoN6pWV5IHwAMSWiXIoIje2GhZ0iBhzBaEOdExStv6qc_lTJSQ_65ycO7yInh5euhjoRBv7U70fpeI3rOdMfd7gLNCRWfqP_RtAEGbRcwXBueBGDKsAQ-KN3viRwVqkm-bZWjj4dLuTwyO4n4LSkmF2_JFK3viPY52JPldRbofwd_ocj3V7i2HeQkE4EYJa1qpYz2w6kWlnA4SpuUoyGUDzPPinU65xpblJk7MonnsNEaLJi3rYrp94KnlTfhLf2yhAe4jvDti4kBnLuHZDr5tw_JFPjE44YzueOISDwfRYlna1QaZ2TFSCICOgl2lvxXhYPpcn1xiCdz-pRMr-xaLY**47cf87ef8dcf760748a4d41aae8b882548c0293dbe30c2a648e398b32dfc8a44*IYtWcygT8kCxCtoHGZhXTwKEyvK7BMpp1X-8X8AoYxk';
app.noScopeCookie         = 'user=Fe26.2**622733e4c21b742873bb056f797ce5609657139d8e2ad39469a882be274e9e3c*rKKeRkzDFpnQXVothS8ReA*r8JUw46OXLmFHlfIVWDwC2-P7fy0TJvAU9oGZbJ89-6hxA-OR1hMN7b0kLC8enT5-i1R39DPmm06vV309OjFrkuhqV7tW5zGTt7j5WyxeRv-iTXd0fEL5S-4G6DXA3DzD4opJetQF9qo42h6djabt-eG-7KCquJfWMf9w786OR8NnWRiR1lgxF2LHjYKBLTRUljpfReks2JYr6S1A0QrnH-4LXyCNZRrQ9jwwwIRozuopSz6lgQXHQ32mTbqD7BnfT_LQe9tbaJoaB6_MlxYJRVKVQESU052MDNqJRcQOXU71PXRiVoPJ2f89ZfEbF1v0hpI2OMR7BVvI18I7amRQyb7WqNeR7RVIGvgF7SuoiaCDGcCxVcLzZnperCco85Vam3D89cYeJATa__oBkBb1mvcAB38SYVLd_SeS7ssz9KK_YEYTeUg276SVK1USJNk77j8fwfVKNqKCdkTvosRYp4ZVPgHzaG-3Ri5YSuXTIBmZm8Kdf_09SLb1P1jkEdlym3XHf3RFxCGrnnvzDFkHPtjyQpUiLgBI-_hwOnoQBTB9ejxoVaCYBdum6Vh6VIG7LGLCNQccaifRxVy7VplxG0YYTbKrJBKVeND3FbzhrXTHgG542syXVD-6KW-Nw-poYnCr3zIPRoY9XXbWOV54LTFnFnvvtFCl3BWgnIEQ5xWSPGModOU8UwnjHMLWASlahdswgiYiNpUyv1Rulw47jKMvYzc0jO8DK3uvGUVwXVIt3carC6k2Gz2OcAPvMZdBuxsrNfHIEra4p8kgM3cvbjCNZask6pmBADPkeB83BFapxs9Fh08OJ8vDNd5zjA7cb297na-6D5tFn1VpAtdL2fBrT9wppneFLx4IQ0bpvVihjm3otBzaur_kChqTOU2VQIZI8a-kV4hf-HxCLfqup5opzFIlPez39sZ_XetmuI**f24ab47844e37d61a340d975cd8df1b5b08e4aacf90c2ed4c8414ffa8b2d6495*J6qm-Ms3HWmHwu2XNHoE3yBhHEoYt_m5vJAQdO_truo';
app.clientCookie          = 'user=Fe26.2**44de94781b95bd8583522102507c62241d7f8f2f1ba9c4ccab49ffeddcb62a03*mAEGvY_oclatIzfV2hnHjw*lwYP9l4ikitgGiKv0tDQPs8bTopwc8-TeoeBvdglNVPc4COsJBSU09KMI6nM-jzeoP1pRZzl8yVq5URKa6bn7SzK73rZJrF5OzuI07oCb7-mBk3I9si9UzlUXxJ-PkDiZkXszHr7Ke4sBp2ZPyXDQrvkLGjfB42RY13dzl4tGfOSzPNOtukm8LfyyAlAW2nY-VmZ41oExFa7_foIFFFLdCyAudWI67vBK0E--AIgKwWGy1EtYZScaJTjD4moF4fyOwaN2B11Lds6jyZQEyEWvg-TskLNTnKPrJjqAc1VF3Qo3ZkCZlZCkcL-cBKYg1zh9pqerJF5vz7-d-ZdDwBfPlSarto3MMMmOz9_SjD0FlcaLGmU0ubppkKrIrxaGOyuqIhw4yTCBtyC6itOLhEJLFgaY5xfDPfWmZ8Cs843N5XmcG4Ua6TATFWcvTbA2uZGJk7A2BEyAghTa77dlLxVHwzFxuxYPY17BjkJvDxiq49cIRigtK1Oiz7wtIjNn8yzX4pgsAsKozKQDjS50rEqVBV0RqXS41kirIj2HosjldkPDyjgbd9WF1qg9DXDAapXcLBcCR4ZE0mnMK2SsoLHs3CqhVvBg4snMP3zEtuJBOR0bheOOdx29WKwe20ZeC2tkj2VFbwAMtOVEq_n9UL5zJkS9MZUkaUYYY9z51eZzT-eA1UMUa60HhLd7yHg7sVzVHIOpoqcYjEf_mHfrx2prNtC-yeOhd2PbGRxMPQoUvNH7Ytso2P7oUijlTd_N6UYaTZOthzzqK1HZRRjce0s5LM1pCRTdNL8yIBezIiyBc7geq5j77bmmPhzrrl7u7V6eAS_HeLOUBk-KjMWuLYUcvsVqMI-z8uToimJSUT4-COLeAXTkE2Vyv7zdtOIPfKxg2sj9BGhaxIKqBDmHAYdzg**b14b21d0cfecf4066c1c745da0a9ab37993825a46f3cc663dbf6db05bb2021dc*-E3WpPvhx2hRZJEAlo67kX2z1dcqyz-sMvJtWdttrhQ';
app.agencyCookie          = 'user=Fe26.2**2f9bfa92d78c3aea2756bb7244cd0fa697f5fe80041c83ddb83e6ac0d5ceb807*qalsdmnPb1L3CcqkGsBy9w*q7ySwPNBUUj_ZfQ93ZQioe-Wd825_7Io9usc1qqjLcjIXmBReXgtHYsgJlcwzmtgEGJnPQ8UCf5uTB8kX0zScgLUn5vDc_ts6pJp9pirKgDfGMfvDMpfEBLREa1vcqsoqtUIxcrfpqWVaZg6O8sxD7JIVK_2oiW_jNASu1yp38QHP3IqEluRG6XSUZjVHTGRPjfBP3azBb6LKY6bvnr4bDIGyfuV_FYHicUqH0C8z9rOTex5aFf5ci2zGmu6S6B15Ei0Td86antu-8h0g1aUvapLXoTmEW6mFMR4k1Lv8yPcu9mK6T7dz66xFbVn15csX7QtQ37FxcXcg2pVsZN8lv36xSIw9fNUeQegqMyW7ayoUdiQ-NG9ai-q1zd-09vyzEcAnjcotZf58ZQoRQA4xPh1D-ygCG8IdE-6JcNaPHWmL2GUUSr7FeIsy2JcqmJu8m0HTSYV8iP1lMmoBac6_ulaMDaWpF0WHBm3WThLrh-ddfP98KRJKLsPXEcOFsMr1ZsD7VgJmV-L5ptq7dHGXNPbfCls6FkugPJb7hEen_EJkL6fB5KtzuYeqvDHG2OT3pw_ZyseQbDk21u1AeyELViYDkxh5lGTwk4Rth3lGj84ulpMFzP7xA-JSjuzUtylXPcujgPNpTeFlBM-rB1Z7U_8GY5X-twQZ9AExH7u8CbYpb0DDZNq-OKTpTJoj8do5eOcB4jtqWMxvOrOjwrdCOLV1AGmPnuwAcR4LcbgSzZEm4gPyD0GNc3VK4jItktyZAJAYamyqB25uOtDKczaIMgJkce_TuIPHzSLvR3Lh3xG3xQZqi2uqe3bLeQ6g3b-HpdKd0ulMMMWm8dzzbify7TXyWxq7PlKxEV0lyGKu6e5j8-sB3KyVc9QeV95ylHp7wKkBy6EUAxUExLnWgarz5AMnyA5ysIVD0aiiLDr4SB2JuDOTQdNxMQeS8itqfUB**c1f925a797b4a0fa3c64a9b9e513687b58cf40e888ea74694f788eaaeb264393*Fo3IsFp8deYH297vYIIyPprFlbTFuQ-suuj6hBru_xw';
app.adminCookie           = 'user=Fe26.2**48c0b8860fa3d4b4abc6da4ecf116bf7644a43a96f1387ce041950b50cd9ca56*CUREuqOPYF1cGdwLhH7B1A*KRVCnCGYurNeOwqsDf1g5ySB6V4QdRu4OXpos7OuJbRFrNeVJ2gndhOn99yVmvZQtxhVRffBcfnfUtiqGDTx5PImzdomI6Ad9gTRpZUJttIlu35vc1tGKARmW4_OlbTK52owOt0qtQXHdmmr0_tTKX_iMR_Wcm8N50Dsjt-Qo82BHYBItMid8qoBet2jK6RxaQ5T8I7DZpA0vWpIhOjpC6D0BJPpC6SRa-mwZnkwRad0dqXj1i-ND36WDf9VptL8o888DN0feun3CWVdRCEPOrXusxMiLawbQCuEYcWfL4LYh3sr3q0AzdUrpQTNsiF_zY5HLkDrtxow-tEfeR-rvbwf92G6sVTi7WsrmV8taSKIpMYLrvYO5UatcvwkX_pr1D57E264V0nvHBEpZEI5lMhwCYCvXzlWXOsdmGPek1dBomqwBNyEh3SKid16_T1xv_8qoPnb9cQfYrghGCO8Z5xqDSN1hryytdQIA0TB9hhjRNO2xN9frlAz4cru5ZvQo2wy7HZys28eWcOSVMCLuh5YInIvBpG-VhZpYyMPHCsgZxfNZ_PG40cworZELuKcuN3G03PE8g3Lct87upYTEhyFvssDtk10rcwsyGS-Wsy0r6Yd523KMqspBeFj7TA5qMCejx4TnSiStXDecUY5UYVyJT9Pr49_XWaF_ZecHYHaRyjYm9QgRzKXn7a78xtkLGiTp0HfvVsjbQvjub0tASS7C7GY7wBcvTRXiPcxx7jNJwybpvofLT4CfMLNTWgTRJXZRxyI1mar-A4Mt9GZMqdMW2cnivDQXd_vWbs98NNfX2fbfxOe4Y2XvgNIocZez3VkWbRM3nn4QQUt3yuKRK0OCImoZciB6wHmoomPanib96MaEjIVv-hF4WP58HXM**733716142d08c9710ca49e396f75478d939752a29f24aff79e4929c0814d931c*s5ZENQyJVtUYMAWXD2OOSHicUxm7wIybPeFtb5R8lgU';

app.clientSignupPayload = {
        contactName: 'Huw Davies',
        email: 'me@me.com',
        contactNumber: '08372974723',
        companySector: 'Finance',
        companyName: 'Facebook Ltd.',
        companyDescription: 'Social media application',
        companySize: '500+',
        website: 'http://facebook.com',
        twitter: '@facebook',
        facebook: 'www.facebook.com',
        linkedin: 'wwww.linkedin.com',
        logo_url: 'http:www.big_cheese.com'
    };

app.agencySignupPayload = {
        contactName: 'Joe Bloggs',
        companyName: 'Sailix',
        contactNumber:'0823748237',
        email: process.env.TEST_EMAIL,
        companySize: '50-200',
        agencySpecialism: 'Creative'
    };

app.vidPayload = {
    jobTitle: 'Tester',
    jobDescription: 'testing everything',
    jobCategory: 'test',
    teamCulture: 'Fun',
    typesOfProjects: 'tests',
    teamSize: 5,
    skillOne: 'test',
    skillTwo: 'test again',
    skillThree: 'test more',
    personality: 'persistant',
    salary: 100000,
    searchProgress: 'slow',
    searchDeadline: '12\/12\/2016',
    clientId: 'clientIdInt',
    vid:'test-vid-int',
    companyName:' Google'
};

app.agencyPayload = {
        id:'testAgencyId',
        contactName: 'Joe Bloggs',
        companyName: 'Sailix',
        contactNumber: '0823748237',
        email: process.env.TEST_EMAIL,
        companySize: '50-200',
        agencySpecialism: 'Creative'
    };

app.clientPayload = {
    contactName: 'Huw Davies',
    email: process.env.TEST_EMAIL,
    contactNumber: '08372974723',
    companyName: 'Facebook Ltd.',
    companyDescription: 'Social media application',
    companySize: '500+',
    website: 'http://facebook.com',
    twitter: '@facebook',
    id: 'clientId' //iIkUSpzijO'
};

app.interviewClientPayload = {
    contactName: 'Bob Sapp',
    email: process.env.TEST_EMAIL,
    contactNumber: '08372974723',
    companyName: 'Facebook Ltd.',
    companyDescription: 'Social media application',
    companySize: '500+',
    website: 'http://facebook.com',
    twitter: '@facebook',
    id: 'clientIdInt' //iIkUSpzijO'
};

app.submitJobPayload = {
    jobTitle: 'Tester',
    jobDescription: 'testing everything',
    jobCategory: 'UX',
    teamCulture: 'Fun',
    typesOfProjects: 'tests',
    teamSize: 5,
    skillOne: 'test',
    skillTwo: 'test again',
    skillThree: 'test more',
    personality: 'persistant',
    salary: '43000',
    package:'health insurance',
    searchProgress: 'slow',
    searchDeadline: 'Wednesday, 7 September, 2016'
};

app.candidatePayload = {
    candidateName: 'Johnny Rotten',
    jobTitle: 'muppet',
    company:'Test LTD',
    jobCategory:'UX',
    email: process.env.TEST_EMAIL,
    contactNumber: '0823748237',
    salary:'£30000',
    contractType :'permanent' ,
    location:'Glasgow',
    linkedInProfile: 'https://linkedin',
    file_name: 'testcv.doc',
    file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc'
};

app.cvPayload = {
    cvid: 'testCvid',
    candidateName: 'Johnny Rotten',
    jobTitle: 'muppet',
    company:'Go Getters',
    jobCategory:'UX,UI, design',
    email: process.env.TEST_EMAIL,
    contactNumber: '0823748237',
    salary: '30000',
    contractType:'contract',
    location:'Memphis',
    linkedInProfile: 'https://linkedin',
    file_name: 'testcv.doc',
    file_url: 'https://torhuw-hrns.s3.amazonaws.com/testcv.doc',
    agencyName: 'Sailix',
    agencyId: 'agencyTestId'
};

app.jobPayload = {
    vid: 'test3Vid',
    clientId: 'clientId',
    clientEmail: process.env.TEST_EMAIL,
    jobTitle: 'Tester',
    jobDescription: 'testing everything',
    jobCategory: 'test',
    teamCulture: 'Startup',
    typesOfProjects: 'tests',
    teamSize: 5,
    skillOne: 'test',
    skillTwo: 'test again',
    skillThree: 'test more',
    personality: 'persistant',
    salary: 100000,
    searchProgress: 'slow',
    searchDeadline: '12\/12\/2016',
    companyName: 'Google',
    clientContactName: 'Tormod Smith',
    logo_url: '/public/assets/images/default-logo.png'
};

app.ratingPayload = {
     agencyEmail: 'test@test.com',
     rating: 'gold',
     cvid: '112312143cvid',
     vid: '121312414vid'
 };

app.interviewPayload = {
    firstIntDate: '23/05/2016',
    firstIntTime: '12:12',
    secondIntDate: '23/05/2016',
    secondIntTime: '09:09',
    thirdIntDate: '23/05/2016',
    thirdIntTime: '10:10',
    additionalComments: 'Meet under the clock',
    interviewAddress: '12 Abbey Road',
    agencyEmail:process.env.TEST_EMAIL,
    agencyId: 'testAgencyId',//'7PP6QGWdXN',
    stage: 'stageOne',
    candidateName: 'John Wayne',
    jobTitle: 'Movie Star',
    companyName: 'Google',
    cvid: 'test-cvid',
    vid: 'test-vid-Interview',
    jobDescription_url: 'http://www.jobDescription_url.com',
    salary: '30000',
    jobLocation: 'Glasgow',
    contractType: 'Permanent'
};

app.testEndPoint = (server, endpoint, method, statusCode, message, COOKIE, payload, credentialsid) => {

        test(method + ' ' + endpoint + ' ' + 'returns status code ' + statusCode, (t) => {
            options = {
                method: method,
                url: endpoint,
                headers: { cookie: COOKIE },
                payload: payload
            };
            if (credentialsid) {
                options.credentials = { profile: { id: credentialsid } };
            }
            server.inject(options, (res) => {
                t.equal(res.statusCode, statusCode, 'TEST ENDPOINT:- ' + message);
                t.end();
                //client.flushdb();
            });
        });

 };

app.testHeaderLocation = (server, endpoint, method, expectedHeaders, message, COOKIE, credentialsid) => {

        test(method + ' ' + endpoint + ' ' + 'returns status code', (t) => {
            options = {
                method: method,
                url: endpoint,
                headers: { cookie: COOKIE }
            };
            if (credentialsid) {
                options.credentials = { profile: { id: credentialsid } };
            }
            server.inject(options, (res) => {
                t.equal(res.headers.location, expectedHeaders, 'TEST HEADER LOCATION:- ' + message + ' ' + expectedHeaders);
                t.end();
            });
        });
};

app.testPayload = (server, endpoint, method, expectedString, message, COOKIE, payload) => {
        test(method + ' ' + endpoint + ' ' + 'returns status code', (t) => {
            options = {
                method: method,
                url: endpoint,
                headers: { cookie: COOKIE },
                payload: payload
            };
            server.inject(options, (res) => {
                let actual = res.payload.indexOf(expectedString) > -1;
                let expected = true;
                t.equal(actual, expected, 'TEST PAYLOAD:- ' + message + ' ' + expectedString);
                t.end();
                //client.flushdb();
            });
        });

};
