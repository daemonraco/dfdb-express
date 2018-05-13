'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');

const assert = chai.assert;
const port = process.env.PORT || 3000;

chai.use(chaiHttp);

// ---------------------------------------------------------------------------- //
// Testing.
describe('dfdb-express: RESTful interaction for multiple changes [006]', function () {
    this.timeout(12000);

    it('listing initial collections', (done) => {
        chai.request(`http://localhost:${port}`)
            .get('/rest/multi')
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

    it('inserts example documents', done => {
        let docs = JSON.parse(fs.readFileSync(path.join(__dirname, 'dataset.001.json')));
        docs = docs.concat(JSON.parse(fs.readFileSync(path.join(__dirname, 'dataset.002.json'))));
        const run = () => {
            const doc = docs.shift();

            if (doc) {
                chai.request(`http://localhost:${port}`)
                    .post('/rest/multi/users')
                    .send(doc)
                    .end((err, res) => {
                        assert.isNull(err);
                        assert.strictEqual(res.status, 200);

                        run();
                    });
            } else {
                done();
            }
        };
        run();
    });

    it('searching for testing documents', (done) => {
        chai.request(`http://localhost:${port}`)
            .get(`/rest/multi/users?query=${encodeURI(JSON.stringify({ age: { $gt: 40 } }))}`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(body.searchMechanism, 'search');
                assert.isObject(body.conditions);
                assert.isArray(body.docs);
                assert.strictEqual(body.docs.length, 2);

                assert.strictEqual(body.docs[0]._id, '30');
                assert.strictEqual(body.docs[0].name, 'Sawyer Weiss');
                assert.strictEqual(body.docs[0].company, 'DELPHIDE');
                assert.strictEqual(body.docs[0].email, 'sawyerweiss@delphide.com');

                assert.strictEqual(body.docs[1]._id, '138');
                assert.strictEqual(body.docs[1].name, 'Carson Bell');
                assert.strictEqual(body.docs[1].company, 'QUARMONY');
                assert.strictEqual(body.docs[1].email, 'carsonbell@quarmony.com');

                done();
            });
    });

    it('deleting testing documents', (done) => {
        chai.request(`http://localhost:${port}`)
            .delete(`/rest/multi/users/$many?query=${encodeURI(JSON.stringify({ age: { $gt: 40 } }))}`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(body.count, 2);

                done();
            });
    });

    it('searching for testing documents after removal', (done) => {
        chai.request(`http://localhost:${port}`)
            .get(`/rest/multi/users?query=${encodeURI(JSON.stringify({ age: { $gt: 40 } }))}`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(body.searchMechanism, 'search');
                assert.isObject(body.conditions);
                assert.isArray(body.docs);
                assert.strictEqual(body.docs.length, 0);

                done();
            });
    });

    // it(`Listing contents on 'users' collection`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, 'searchMechanism');
    //             assert.property(body, 'conditions');
    //             assert.property(body, 'docs');

    //             assert.isString(body.searchMechanism);
    //             assert.isObject(body.conditions);
    //             assert.isArray(body.docs);

    //             assert.strictEqual(body.searchMechanism, 'search');
    //             assert.strictEqual(Object.keys(body.conditions).length, 0);
    //             assert.strictEqual(body.docs.length, 0);

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection (as simple response)`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users?simple')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isArray(body);
    //             assert.strictEqual(body.length, 0);

    //             done();
    //         });
    // });

    // it('Inserting a new user', (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .post('/rest/multi/users')
    //         .send({
    //             isActive: false,
    //             age: 30,
    //             name: 'Boone Mendez',
    //             gender: 'male',
    //             company: 'ANOCHA',
    //             email: 'boonemendez@anocha.com',
    //             about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
    //             tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
    //         })
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, '_id');
    //             assert.property(body, '_created');
    //             assert.property(body, '_updated');

    //             assert.property(body, 'age');
    //             assert.property(body, 'name');
    //             assert.property(body, 'email');

    //             assert.strictEqual(body._id, '1');
    //             assert.strictEqual(body.age, 30);
    //             assert.strictEqual(body.name, 'Boone Mendez');
    //             assert.strictEqual(body.email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it('Listing updated collections', (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.strictEqual(Object.keys(body).length, 1);
    //             assert.property(body, 'users');

    //             assert.isObject(body.users);
    //             assert.strictEqual(Object.keys(body.users).length, 2);
    //             assert.property(body.users, 'name');
    //             assert.property(body.users, 'type');

    //             assert.strictEqual(body.users.name, 'users');
    //             assert.strictEqual(body.users.type, 'simple');

    //             done();
    //         });
    // });

    // it('Listing updated collections (as simple response)', (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi?simple')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isArray(body);
    //             assert.strictEqual(body.length, 1);
    //             assert.strictEqual(body[0], 'users');

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, 'searchMechanism');
    //             assert.property(body, 'conditions');
    //             assert.property(body, 'docs');

    //             assert.isString(body.searchMechanism);
    //             assert.isObject(body.conditions);
    //             assert.isArray(body.docs);

    //             assert.strictEqual(body.searchMechanism, 'search');
    //             assert.strictEqual(Object.keys(body.conditions).length, 0);
    //             assert.strictEqual(body.docs.length, 1);

    //             assert.isObject(body.docs[0]);
    //             assert.property(body.docs[0], '_id');
    //             assert.property(body.docs[0], '_created');
    //             assert.property(body.docs[0], '_updated');

    //             assert.property(body.docs[0], 'age');
    //             assert.property(body.docs[0], 'name');
    //             assert.property(body.docs[0], 'email');

    //             assert.strictEqual(body.docs[0]._id, '1');
    //             assert.strictEqual(body.docs[0].age, 30);
    //             assert.strictEqual(body.docs[0].name, 'Boone Mendez');
    //             assert.strictEqual(body.docs[0].email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection (as simple response)`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users?simple')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isArray(body);
    //             assert.strictEqual(body.length, 1);

    //             assert.isObject(body[0]);
    //             assert.property(body[0], '_id');
    //             assert.property(body[0], '_created');
    //             assert.property(body[0], '_updated');

    //             assert.property(body[0], 'age');
    //             assert.property(body[0], 'name');
    //             assert.property(body[0], 'email');

    //             assert.strictEqual(body[0]._id, '1');
    //             assert.strictEqual(body[0].age, 30);
    //             assert.strictEqual(body[0].name, 'Boone Mendez');
    //             assert.strictEqual(body[0].email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it('Updaintg the inserted user', (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .put('/rest/multi/users/1')
    //         .send({
    //             isActive: false,
    //             age: 32,
    //             name: 'Boone Mendez',
    //             gender: 'male',
    //             company: 'ANOCHA',
    //             email: 'boonemendez@anocha.com',
    //             about: 'Magna dolore Lorem velit officia occaecat. Aliqua dolore ut dolor aliquip veniam dolor consectetur sunt fugiat. Tempor aliqua laboris mollit sunt Lorem. Irure sit fugiat proident proident cupidatat do adipisicing dolor ex do.\r\n',
    //             tags: ['exercitation', 'non', 'do', 'occaecat', 'qui', 'est', 'sit']
    //         })
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, '_id');
    //             assert.property(body, '_created');
    //             assert.property(body, '_updated');

    //             assert.property(body, 'age');
    //             assert.property(body, 'name');
    //             assert.property(body, 'email');

    //             assert.strictEqual(body._id, '1');
    //             assert.strictEqual(body.age, 32);
    //             assert.strictEqual(body.name, 'Boone Mendez');
    //             assert.strictEqual(body.email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, 'searchMechanism');
    //             assert.property(body, 'conditions');
    //             assert.property(body, 'docs');

    //             assert.isString(body.searchMechanism);
    //             assert.isObject(body.conditions);
    //             assert.isArray(body.docs);

    //             assert.strictEqual(body.searchMechanism, 'search');
    //             assert.strictEqual(Object.keys(body.conditions).length, 0);
    //             assert.strictEqual(body.docs.length, 1);

    //             assert.isObject(body.docs[0]);
    //             assert.property(body.docs[0], '_id');
    //             assert.property(body.docs[0], '_created');
    //             assert.property(body.docs[0], '_updated');

    //             assert.property(body.docs[0], 'age');
    //             assert.property(body.docs[0], 'name');
    //             assert.property(body.docs[0], 'email');

    //             assert.strictEqual(body.docs[0]._id, '1');
    //             assert.strictEqual(body.docs[0].age, 32);
    //             assert.strictEqual(body.docs[0].name, 'Boone Mendez');
    //             assert.strictEqual(body.docs[0].email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection (as simple response)`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users?simple')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isArray(body);
    //             assert.strictEqual(body.length, 1);

    //             assert.isObject(body[0]);
    //             assert.property(body[0], '_id');
    //             assert.property(body[0], '_created');
    //             assert.property(body[0], '_updated');

    //             assert.property(body[0], 'age');
    //             assert.property(body[0], 'name');
    //             assert.property(body[0], 'email');

    //             assert.strictEqual(body[0]._id, '1');
    //             assert.strictEqual(body[0].age, 32);
    //             assert.strictEqual(body[0].name, 'Boone Mendez');
    //             assert.strictEqual(body[0].email, 'boonemendez@anocha.com');

    //             done();
    //         });
    // });

    // it('Removing the inserted user', (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .delete('/rest/multi/users/1')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.strictEqual(Object.keys(body).length, 0);

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isObject(body);
    //             assert.property(body, 'searchMechanism');
    //             assert.property(body, 'conditions');
    //             assert.property(body, 'docs');

    //             assert.isString(body.searchMechanism);
    //             assert.isObject(body.conditions);
    //             assert.isArray(body.docs);

    //             assert.strictEqual(body.searchMechanism, 'search');
    //             assert.strictEqual(Object.keys(body.conditions).length, 0);
    //             assert.strictEqual(body.docs.length, 0);

    //             done();
    //         });
    // });

    // it(`Listing contents on 'users' collection (as simple response)`, (done) => {
    //     chai.request(`http://localhost:${port}`)
    //         .get('/rest/multi/users?simple')
    //         .end((err, res) => {
    //             assert.isNull(err);
    //             assert.strictEqual(res.status, 200);
    //             assert.isString(res.text);

    //             let body;
    //             try { body = JSON.parse(res.text); } catch (e) {
    //                 assert.isTrue(false, `response body cannot be parsed`);
    //             }

    //             assert.isArray(body);
    //             assert.strictEqual(body.length, 0);

    //             done();
    //         });
    // });
});
