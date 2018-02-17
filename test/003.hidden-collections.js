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
describe('dfdb: RESTful interaction with hidden collections', function () {
    it('Listing updated collections', (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(Object.keys(body).length, 1);
                assert.property(body, 'users');

                assert.isObject(body.users);
                assert.strictEqual(Object.keys(body.users).length, 2);
                assert.property(body.users, 'name');
                assert.property(body.users, 'type');

                assert.strictEqual(body.users.name, 'users');
                assert.strictEqual(body.users.type, 'simple');

                done();
            });
    });

    it('Listing updated collections (as simple response)', (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens?simple')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isArray(body);
                assert.strictEqual(body.length, 1);
                assert.strictEqual(body[0], 'users');

                done();
            });
    });

    it(`Listing contents on 'users' collection`, (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens/users')
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
                assert.strictEqual(body.docs.length, 1);

                assert.isObject(body.docs[0]);
                assert.property(body.docs[0], '_id');
                assert.property(body.docs[0], '_created');
                assert.property(body.docs[0], '_updated');

                assert.property(body.docs[0], 'age');
                assert.property(body.docs[0], 'name');
                assert.property(body.docs[0], 'email');

                assert.strictEqual(body.docs[0]._id, '1');
                assert.strictEqual(body.docs[0].age, 30);
                assert.strictEqual(body.docs[0].name, 'Boone Mendez');
                assert.strictEqual(body.docs[0].email, 'boonemendez@anocha.com');

                done();
            });
    });

    it(`Listing contents on 'users' collection (as simple response)`, (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens/users?simple')
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isArray(body);
                assert.strictEqual(body.length, 1);

                assert.isObject(body[0]);
                assert.property(body[0], '_id');
                assert.property(body[0], '_created');
                assert.property(body[0], '_updated');

                assert.property(body[0], 'age');
                assert.property(body[0], 'name');
                assert.property(body[0], 'email');

                assert.strictEqual(body[0]._id, '1');
                assert.strictEqual(body[0].age, 30);
                assert.strictEqual(body[0].name, 'Boone Mendez');
                assert.strictEqual(body[0].email, 'boonemendez@anocha.com');

                done();
            });
    });

    it(`Listing contents on 'profiles' collection`, (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens/profiles')
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

    it(`Listing contents on 'profiles' collection (as simple response)`, (done) => {
        chai.request('http://localhost:3000')
            .get('/rest/hiddens/profiles?simple')
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

    it('Inserting a profile', (done) => {
        chai.request('http://localhost:3000')
            .post('/rest/hiddens/profiles')
            .send({
                user: 'Some other user',
                active: false
            })
            .end((err, res) => {
                assert.isNotNull(err);
                assert.strictEqual(err.status, 403);

                const check = data => {
                    assert.strictEqual(data.status, 403);
                    assert.isString(data.text);

                    let body;
                    try { body = JSON.parse(data.text); } catch (e) {
                        assert.isTrue(false, `response body cannot be parsed`);
                    }

                    assert.strictEqual(Object.keys(body).length, 1);
                    assert.property(body, 'message');
                    assert.isString(body.message);

                    assert.match(body.message, /forbidden access to collection 'profiles'/i);
                }

                check(err.response);
                check(res);

                done();
            });
    });

    it('Updating a profile', (done) => {
        chai.request('http://localhost:3000')
            .put('/rest/hiddens/profiles/1')
            .send({
                user: 'Some other user',
                active: false
            })
            .end((err, res) => {
                assert.isNotNull(err);
                assert.strictEqual(err.status, 403);

                const check = data => {
                    assert.strictEqual(data.status, 403);
                    assert.isString(data.text);

                    let body;
                    try { body = JSON.parse(data.text); } catch (e) {
                        assert.isTrue(false, `response body cannot be parsed`);
                    }

                    assert.strictEqual(Object.keys(body).length, 1);
                    assert.property(body, 'message');
                    assert.isString(body.message);

                    assert.match(body.message, /forbidden access to collection 'profiles'/i);
                }

                check(err.response);
                check(res);

                done();
            });
    });

    it('Deleting a profile', (done) => {
        chai.request('http://localhost:3000')
            .delete('/rest/hiddens/profiles/1')
            .end((err, res) => {
                assert.isNotNull(err);
                assert.strictEqual(err.status, 403);

                const check = data => {
                    assert.strictEqual(data.status, 403);
                    assert.isString(data.text);

                    let body;
                    try { body = JSON.parse(data.text); } catch (e) {
                        assert.isTrue(false, `response body cannot be parsed`);
                    }

                    assert.strictEqual(Object.keys(body).length, 1);
                    assert.property(body, 'message');
                    assert.isString(body.message);

                    assert.match(body.message, /forbidden access to collection 'profiles'/i);
                }

                check(err.response);
                check(res);

                done();
            });
    });
});
