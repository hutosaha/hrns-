'use strict';

const test = require('tape');

const cleanPayload = require('../lib/plugins/utils/app.js').cleanPayload;

test('clean payload deletes empty strings in an object', (t) => {
    let payload = { name: 'Joe Bloggs', age: 10, food: '', sport: '' };
    let expected = { name: 'Joe Bloggs', age: 10 };
    cleanPayload(payload);
    t.deepEqual(payload, expected, 'payload cleaned!');
    t.end();
});
