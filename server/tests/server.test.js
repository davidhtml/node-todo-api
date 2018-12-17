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
        text: "second long string for testing"
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


    //
    it('should return 404 if todo is not found', (done) => {
        const randomId = new ObjectID();

        request(app)
            .get(`/todos/${randomId.toHexString()}`)
            .expect(404)
            .end(done)
    })
    //
    it('should return 404 if non object id', (done) => {
        // if (!ObjectID.isValid(todos[0]._id)) {
        //     return
        // }

        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done)
    })
});
