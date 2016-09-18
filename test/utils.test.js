'use strict';

const test = require('tape');

const utils = require('../lib/plugins/utils/app.js');

const rating                         = require('../public/views/helpers/rating.js');
const sector                         = require('../public/views/helpers/sector.js');
const stage                          = require('../public/views/helpers/stageconversion.js');
const formatEmailToAdminForGenericCV = utils.formatEmailToAdminForGenericCV;
const emailAdminForGenericCV         = utils.emailAdminForGenericCV;
const formatCandidateKeys            = utils.formatCandidateKeys;
const formatReason                   = utils.formatReason;
const cleanPayload                   = utils.cleanPayload;

test('formatCandidateKeys returns same key if not found in object', (t) => {
  let expected = 'foo';
  let actual = formatCandidateKeys('foo');
  t.equal(actual, expected, 'returns same key!');
  t.end();
});

test('formatEmailToAdminForGenericCV correctly renders HTML', (t) => {
    let expected = '<h1>Candidate Info</h1><br>Name: Joe<br>Job Title: Dev<br><h4>The candidate\'s CV is downloadable <a href="http://google.com">here</a></h4>';
    let actual = formatEmailToAdminForGenericCV({ file_url: 'http://google.com', file_name: 'foo', candidateName: 'Joe', jobTitle: 'Dev' });
    t.equal(actual, expected, 'formats correctly!');
    t.end();
});

test('emailAdminForGenericCV callbacks as expected', (t) => {

  emailAdminForGenericCV(undefined, '', (res) => {
    let expected = false;
    let actual = res;
    t.equal(actual, expected, 'handles failure');
    t.end();
  });

  //  fix this, see #93 (HUW)

  // emailAdminForGenericCV({ file_url: 'http://google.com', candidateName: 'foo' }, 'candidate', (res) => {
  //   let expected = true;
  //   let actual = res;
  //   t.equal(actual, expected, 'emailAdmin with Generic CV works!');
  // });
});

test('clean payload deletes undefined strings or values in an object', (t) => {
    let payload = { name: 'Joe Bloggs', age: 10, food: 'undefined', sport: 'undefined' };
    let expected = { name: 'Joe Bloggs', age: 10 };
    cleanPayload(payload);
    t.deepEqual(payload, expected, 'payload cleaned!');
    t.end();
});

test('rating helper correctly formats key values', (t) => {
    let expected = { string: '<p class="ui yellow label">Gold</p>' };
    let actual = rating('gold');
    t.deepEqual(actual, expected);
    expected = { string: '<h5>No rating</h5>' };
    actual = rating('foo');
    t.deepEqual(actual, expected);
    t.end();
});

test('format reason correctly formats reasons', (t) => {
    let expected = 'The client said your candidate didn\'t have enough experience for the role';
    let actual = formatReason('not_enough');
    t.equal(actual, expected, 'works!');
    expected = '';
    actual = formatReason('foo');
    t.equal(actual, expected, 'works!');
    t.end();
});
//
test('stage helper correctly formats key values', (t) => {
    let expected = { string: 'Accepted' };
    let actual = stage('stageOne');
    t.deepEqual(actual, expected, 'works!');
    t.end();

});
test('stage helper correctly formats key values', (t) => {
    let expected = { string: '1' };
    let actual = stage('stageTwo');
    t.deepEqual(actual, expected, 'works!');
    t.end();

});
test('stage helper correctly formats key values', (t) => {
    let expected = { string: '2' };
    let actual = stage('stageThree');
    t.deepEqual(actual, expected, 'works!');
    t.end();

});
test('stage helper correctly formats key values', (t) => {
    let expected = { string: 'Final' };
    let actual = stage('stageFour');
    t.deepEqual(actual, expected, 'works!');
    t.end();

});
test('sector helper correctly formats key values', (t) => {
    let expected = { string: '<p>Project Management</p>' };
    let actual = sector('projectManagement');
    t.deepEqual(actual, expected, 'works!');
    expected = { string: '<p>None specified</p>' };
    actual = sector('foo');
    t.deepEqual(actual, expected, 'works!');
    t.end();
});
test('sector helper correctly formats key values', (t) => {
    let expected = { string: '<p>Project Management</p>' };
    let actual = sector('projectManagement');
    t.deepEqual(actual, expected, 'works!');
    expected = { string: '<p>None specified</p>' };
    actual = sector('foo');
    t.deepEqual(actual, expected, 'works!');
    t.end();
});
