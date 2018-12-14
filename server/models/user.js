const mongoose = require('mongoose');

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

// const newUser = new User({
//     email: 'test@te.com'
// })
//
// newUser.save()
//     .then(res => console.log('data that has been saved', res))
//
// module.exports = {
//     User
// }
