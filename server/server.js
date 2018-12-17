const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3003;

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

//GET /todos/123
app.get('/todos/:betkoksId', (req, res) => {
    const id = req.params.betkoksId;
    // console.log(id);
    // res.send(id);
    // valid ID "5c150c02ea22972b292760cf"
    if (!ObjectID.isValid(id)) return res.status(404).send()
    Todo.findById(id)
        .then(todo => {
            if (!todo) return res.status(404).send();
            res.status(200).send({todo: todo});
        })
        .catch((e) => res.status(400).send())

});

//DELETE // TODO:

app.delete('/todos/:id', (req, res) => {
    console.log(req.params.id)
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    Todo.findByIdAndRemove(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send()
            }
            console.log('deleting todo item');
            res.status(200).send({todo})
        })
        .catch(e => res.status(400).send())
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:  body}, {new: true})
        .then(todo => {
            if (!todo) return res.status(404).send();

            res.send({todo});
        })
        .catch(e => res.status(400).send())
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports = {
    app
};
