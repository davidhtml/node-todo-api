const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: "first long string for testing"
    },
    {
        _id: new ObjectID(),
        text: "second long string for testing",
        completed: true,
        completedAt: 33312
    }
]

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done());
})

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
        console.log(id);
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body)
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
        const text = 'again_ updating todo text'
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
})
