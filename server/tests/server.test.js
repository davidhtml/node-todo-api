const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    {
        text: "first long string for testing"
    },
    {
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
