const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        reguired: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false

    },
    completedAt: {
        type: Number,
        default: null

    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

// const newTodo = new Todo({
//     text: '  as some text   '
// })
//
// newTodo.save()
//     .then(resp => console.log('data has been saved', resp))
//     .catch(err => console.log('error ocuured SOR', err));


module.exports = {
    Todo
}
