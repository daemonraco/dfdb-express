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

    it('updating testing documents', (done) => {
        chai.request(`http://localhost:${port}`)
            .put(`/rest/multi/users/$many?query=${encodeURI(JSON.stringify({ age: { $gt: 40 } }))}`)
            .send({ company: 'MYCOMPANY' })
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try { body = JSON.parse(res.text); } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isArray(body);
                assert.strictEqual(body.length, 2);

                assert.strictEqual(body[0]._id, '30');
                assert.strictEqual(body[0].name, 'Sawyer Weiss');
                assert.strictEqual(body[0].company, 'MYCOMPANY');
                assert.strictEqual(body[0].email, 'sawyerweiss@delphide.com');

                assert.strictEqual(body[1]._id, '138');
                assert.strictEqual(body[1].name, 'Carson Bell');
                assert.strictEqual(body[1].company, 'MYCOMPANY');
                assert.strictEqual(body[1].email, 'carsonbell@quarmony.com');

                done();
            });
    });

    it('searching for testing documents after updating', (done) => {
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
                assert.strictEqual(body.docs[0].company, 'MYCOMPANY');
                assert.strictEqual(body.docs[0].email, 'sawyerweiss@delphide.com');

                assert.strictEqual(body.docs[1]._id, '138');
                assert.strictEqual(body.docs[1].name, 'Carson Bell');
                assert.strictEqual(body.docs[1].company, 'MYCOMPANY');
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
});
