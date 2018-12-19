const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (email) => validator.isEmail(email),
            message: `{email} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

UserSchema.methods = {
    generateAuthToken: function() {
        const access = 'auth';
        const token = jwt.sign({_id: this._id.toHexString(), access: access}, 'verySuperSecretValue').toString();

        this.tokens = this.tokens.concat([{
             access: access,
             token: token
        }]);
        // console.log('SECOND CONSOLE=>', this.tokens);

        return this.save().then(() => {
                return token;
            });
    },
    toJSON: function() {
        const userObject = this.toObject();

        return _.pick(userObject, ['_id', 'email']);
    }
}

UserSchema.statics = {
    findByToken: function(token) {
        // console.log('inside findByToken=>>>>', token)
        let decoded;

        try {
            decoded = jwt.verify(token, 'verySuperSecretValue')
        } catch (e) {
            // return new Promise((resolve, reject) => {
            //     reject();
            // })
            return Promise.reject();
        }

        return this.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })
    },
    findByCredentials: function(email, password) {
        const User = this;

        return User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                 bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        resolve(user);
                    } else if (!result) {
                        reject();
                    }
                })
                //use bcrypt.compare to check our pass with user's
            })
        })
        .catch(err => Promise.reject())
    }
}


UserSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}
