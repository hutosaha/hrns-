'use strict';

const test = require('tape');

const formatReason = require('../lib/plugins/utils/app.js').formatReason;
const cleanPayload = require('../lib/plugins/utils/app.js').cleanPayload;
const rating       = require('../public/views/helpers/rating.js');
const sector       = require('../public/views/helpers/sector.js');

test('clean payload deletes empty strings in an object', (t) => {
    let payload = { name: 'Joe Bloggs', age: 10, food: '', sport: '' };
    let expected = { name: 'Joe Bloggs', age: 10 };
    cleanPayload(payload);
    t.deepEqual(payload, expected, 'payload cleaned!');
    t.end();
});

test('rating helper correctly formats key values', (t) => {
    let expected = { string: '<a class="ui yellow label">Gold</a>' };
    let actual = rating('gold');
    t.deepEqual(actual, expected);
    expected = { string: '<h5>No rating</h5>' };
    actual = rating('foo');
    t.deepEqual(actual, expected);
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

test('format reason correctly formats reaons', (t) => {
    let expected = 'The client said your candidate didn\'t have enough experience for the role';
    let actual = formatReason('not_enough');
    t.equal(actual, expected, 'works!');
    expected = '';
    actual = formatReason('foo');
    t.equal(actual, expected, 'works!');
    t.end();
});
