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
describe('dfdb: RESTful interaction', function () {
    it('Listing initial collections', (done) => {
        chai.request('http://localhost:3000')
            .get('/dfdb-rest')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(Object.keys(body).length, 0);

                done();
            });
    });

    it('Listing initial collections (as simple response)', (done) => {
        chai.request('http://localhost:3000')
            .get('/dfdb-rest?simple')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isArray(body);
                assert.strictEqual(body.length, 0);

                done();
            });
    });

    it(`Listing contents on 'users' collection`, (done) => {
        chai.request('http://localhost:3000')
            .get('/dfdb-rest/users')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.property(body, 'searchMechanism');
                assert.property(body, 'conditions');
                assert.property(body, 'docs');

                assert.isString(body.searchMechanism);
                assert.isObject(body.conditions);
                assert.isArray(body.docs);

                assert.strictEqual(body.searchMechanism, 'search');
                assert.strictEqual(Object.keys(body.conditions).length, 0);
                assert.strictEqual(body.docs.length, 0);

                done();
            });
    });

    it(`Listing contents on 'users' collection (as simple response)`, (done) => {
        chai.request('http://localhost:3000')
            .get('/dfdb-rest/users?simple')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isArray(body);
                assert.strictEqual(body.length, 0);

                done();
            });
    });

    it('Inserting a new user', (done) => {
        chai.request('http://localhost:3000')
            .post('/dfdb-rest/users')
            .send({
                isActive: false,
                age: 30,
                name: 'Boone Mendez',
                gender: 'male',
                company: 'ANOCHA',
                email: 'boonemendez@anocha.com',
                about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
                tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
            })
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.property(body, '_id');
                assert.property(body, '_created');
                assert.property(body, '_updated');

                assert.property(body, 'name');
                assert.property(body, 'email');

                assert.strictEqual(body._id, '1');
                assert.strictEqual(body.name, 'Boone Mendez');
                assert.strictEqual(body.email, 'boonemendez@anocha.com');

                done();
            });
    });
});
