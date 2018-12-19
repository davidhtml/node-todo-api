require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then(data => {
             res.send(data)
        })
        .catch(e => res.status(400).send(e))
});

app.get('/todos', (req, res) => {
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
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    Todo.findByIdAndRemove(id)
        .then(todo => {
            if (!todo) {
                return res.status(404).send()
            }
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

//POST /user
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user.save()
        .then(() => {
            // console.log('FIRST CONSOLE>')
            return user.generateAuthToken();
        })
        .then(token => {
            // console.log('THIRD CONSOLE=>', token)
            res.header('x-auth', token).send(user)
        })
        .catch(e => {
            // console.log('did we reach catch')
            res.status(400).send(e)
        })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user)
})

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
    .then(user => {
        return user.generateAuthToken()
            .then(token => {
                res.header('x-auth', token).send(user)
            })

    })
    .catch(err => {
        res.status(400).send('ups something went wrong, try again later');
    })
})

app.delete('/users/me/token', authenticate, (req, res) => {
    // console.log('user req.user request from user/me/token=>>>>>',req.user);
    // console.log('token req.token request from user/me/token=>>>>>',req.token);
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send()
        })
        .catch(err => {
            res.status(400).send()
        })
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

module.exports = {
    app
};
