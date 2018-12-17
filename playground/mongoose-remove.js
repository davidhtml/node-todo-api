const {ObjectID} = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

// todo.remove
// Todo.remove({}).then(res => {
//     console.log(res)
// })

//findOne and delete

Todo.findByIdAndRemove("5c1760718138264835cacfee").then((todo) => {
    console.log(todo)
})
