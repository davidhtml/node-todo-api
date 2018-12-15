const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log('checking request body=>>>', req.body);
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then(data => {
            console.log('isaugomi duomenys =>>', data)
             res.send(data)
        })
        .catch(e => res.status(400).send(e))
});

app.get('/todos', (req, res) => {
    console.log('get request =>>', req.body);

    Todo.find()
        .then((todos) => {
            res.send({
                todos: todos
            })
        })
        .catch(e => {
            res.status(400).send(e);
        });
});

app.listen(3003, () => {
    console.log('Server started on port 3003');
});

module.exports = {
    app
};


// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');
