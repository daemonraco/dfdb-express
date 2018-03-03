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
describe(`dfdb: Checking connection's information [005]`, function () {
    it('requesting the information of a exposed database', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/schemas/$info')
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
                assert.strictEqual(Object.keys(body).length, 2);
                assert.isObject(body.collections);
                assert.isObject(body.initializer);

                assert.isObject(body.collections.with_schema);
                assert.strictEqual(body.collections.with_schema.name, 'with_schema');
                assert.strictEqual(body.collections.with_schema.type, 'simple');
                assert.isObject(body.collections.without_schema);
                assert.strictEqual(body.collections.without_schema.name, 'without_schema');
                assert.strictEqual(body.collections.without_schema.type, 'simple');

                assert.isArray(body.initializer.collections);
                assert.strictEqual(body.initializer.collections.length, 2);

                assert.strictEqual(body.initializer.collections[0].name, 'with_schema');
                assert.isObject(body.initializer.collections[0].schema);
                assert.strictEqual(body.initializer.collections[0].type, 'simple');
                assert.isArray(body.initializer.collections[0].data);
                assert.strictEqual(body.initializer.collections[0].data.length, 0);
                assert.isArray(body.initializer.collections[0].indexes);
                assert.strictEqual(body.initializer.collections[0].indexes.length, 0);

                assert.strictEqual(body.initializer.collections[1].name, 'without_schema');
                assert.notProperty(body.initializer.collections[1], 'schema');
                assert.strictEqual(body.initializer.collections[1].type, 'simple');
                assert.isArray(body.initializer.collections[1].data);
                assert.strictEqual(body.initializer.collections[1].data.length, 0);
                assert.isArray(body.initializer.collections[1].indexes);
                assert.strictEqual(body.initializer.collections[1].indexes.length, 0);

                done();
            });
    });
});
