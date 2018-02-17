'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');

const assert = chai.assert;

chai.use(chaiHttp);

// ---------------------------------------------------------------------------- //
// Testing.
describe('dfdb: Simple connection', function () {
    it('requesting the default endpoint', (done) => {
        chai.request('http://localhost:3000')
            .get('/dfdb-rest')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(Object.keys(body).length, 0);

                done();
            });
    });
});
