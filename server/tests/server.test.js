const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./fixtures/fixture');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
    it('it should create a new todo in db', (done) => {
        const text = 'long string for test purpose';

        request(app)
            .post('/todos')
            .send({ text: text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text: text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
            })
    })

    it('should not create a todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({text: ""})
            .expect(400)
            .end((err, resp) => {
                if (err) {
                    return done(err)
                }
                Todo.find()
                    .then(todos => {
                        expect(todos.length).toBe(2);
                        done()
                    })
                    .catch(e => done(e))
            })

    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /todos/betkoksId', () => {

    it('should return todo document', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });

    it('should return 404 if todo is not found', (done) => {
        const randomId = new ObjectID();

        request(app)
            .get(`/todos/${randomId.toHexString()}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if non object id', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done)
    })
});

describe('DELETE/todos/:id', () => {
    it('should remove a todo', (done) => {
        const id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text)
            })
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.findById(id)
                    .then(todo => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch(e => done(e))
            })
    })

    it('should return 404 if id is not found', (done) => {
        const randomId = new ObjectID();

        request(app)
            .delete(`/todos/${randomId.toHexString()}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done)
    })
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        const id = todos[0]._id.toHexString();
        const text = 'updating todo text'
        request(app)
            .patch(`/todos/${id}`)
            .send({text: text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
    })

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString();
        const text = 'again_ updating todo text';
        request(app)
            .patch(`/todos/${id}`)
            .send({text: text, completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)

    })
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    });

    it('should return 401 if nut authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'incorrect auth token')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user', (done) => {
        const email = 'anyemail@example.com';
        const password = '456fgh';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            })
    });

    it('should return validtion error status(400) if request is invalid', (done) => {
        //sending invalid email and password
        const email = 'anyemailexample.com';
        const password = '123a';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)

    });

    it('should not create user if email is in use', (done) => {
        const email = users[0].email;
        const password = '321dsa';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })
});
