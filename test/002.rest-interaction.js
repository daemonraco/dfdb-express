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
describe('dfdb: RESTful interaction [002]', function () {
    it('Listing initial collections', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics?simple')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users?simple')
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
        chai.request(`http://localhost:${port}`)
            .post('/rest/basics/users')
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

                assert.property(body, 'age');
                assert.property(body, 'name');
                assert.property(body, 'email');

                assert.strictEqual(body._id, '1');
                assert.strictEqual(body.age, 30);
                assert.strictEqual(body.name, 'Boone Mendez');
                assert.strictEqual(body.email, 'boonemendez@anocha.com');

                done();
            });
    });

    it('Listing updated collections', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics?simple')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users?simple')
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

    it('Updaintg the inserted user', (done) => {
        chai.request(`http://localhost:${port}`)
            .put('/rest/basics/users/1')
            .send({
                isActive: false,
                age: 32,
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

                assert.property(body, 'age');
                assert.property(body, 'name');
                assert.property(body, 'email');

                assert.strictEqual(body._id, '1');
                assert.strictEqual(body.age, 32);
                assert.strictEqual(body.name, 'Boone Mendez');
                assert.strictEqual(body.email, 'boonemendez@anocha.com');

                done();
            });
    });

    it(`Listing contents on 'users' collection`, (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users')
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
                assert.strictEqual(body.docs[0].age, 32);
                assert.strictEqual(body.docs[0].name, 'Boone Mendez');
                assert.strictEqual(body.docs[0].email, 'boonemendez@anocha.com');

                done();
            });
    });

    it(`Listing contents on 'users' collection (as simple response)`, (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users?simple')
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
                assert.strictEqual(body[0].age, 32);
                assert.strictEqual(body[0].name, 'Boone Mendez');
                assert.strictEqual(body[0].email, 'boonemendez@anocha.com');

                done();
            });
    });

    it('Removing the inserted user', (done) => {
        chai.request(`http://localhost:${port}`)
            .delete('/rest/basics/users/1')
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

    it(`Listing contents on 'users' collection`, (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users')
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
        chai.request(`http://localhost:${port}`)
            .get('/rest/basics/users?simple')
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
});
