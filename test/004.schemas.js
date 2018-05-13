'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');

const assert = chai.assert;
const port = process.env.PORT || 3000;

chai.use(chaiHttp);

// ---------------------------------------------------------------------------- //
// Testing.
describe(`dfdb-express: Checking collection's schema [004]`, function () {
    it('requesting the schema of a collection with one', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/schemas/with_schema/$schema')
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
                assert.strictEqual(Object.keys(body).length, 3);
                assert.property(body, 'type');
                assert.property(body, 'properties');
                assert.property(body, 'required');

                done();
            });
    });

    it('requesting the schema of a collection without one', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/schemas/without_schema/$schema')
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

                assert.isNull(body);

                done();
            });
    });
});
