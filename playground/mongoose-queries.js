const {ObjectID} = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');


// const id = '5c150c02ea22972b292760cf11';
//
// if (!ObjectID.isValid(id)) {
//     console.log('hey hey hey your provided id is not valid')
// }
// Todo.find({
//     _id: id
// })
// .then((todos) => {
//     console.log('Todos=>>', todos)
// });
//
// Todo.findOne({
//     _id: id
// })
// .then((todo) => {
//     console.log('Single Todo=>>', todo)
// });

// Todo.findById(id)
// .then((todo) => {
//     if (!todo) return console.log('id not found')
//     console.log('findByID Todo=>>', todo)
// })
// .catch((e) => {
//     console.log('ERRORAS=>>', e )
// })

const userId = "5c13a29b781ff31052a3e7b0";
User.findById(userId)
    .then((user) => {
        if (!user) return console.log('userId not foud');
        console.log('findById user=>>', user);
        // console.log('findById user=>>', JSON.stringify(user, undefined, 2));
    })
    .catch(e => console.log('error while searching for a user=>>', e))

//user.findById()
//1. when query works but there is no User
//2. when user is found
//3 whem user is not found
