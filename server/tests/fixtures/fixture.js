const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
        _id: userOneId,
        email: 'first@email.com',
        password: 'firstUserPass',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'second@email.com',
        password: 'secondUserPass',
        tokens:[{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    }
]


const todos = [
    {
        _id: new ObjectID(),
        text: "first long string for testing",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: "second long string for testing",
        completed: true,
        completedAt: 33312,
        _creator: userTwoId
    }
]

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
}

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}
