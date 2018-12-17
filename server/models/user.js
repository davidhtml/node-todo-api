const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

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
        console.log('insinde findByToken=>>>>', token)
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
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}
