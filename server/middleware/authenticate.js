const { User } = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');
    console.log('authenticate inside server.js token =>>>', token)
    User.findByToken(token)
        .then(user => {
            console.log('did we find this user????', user)
            if(!user) {
                return Promise.reject()
            }
            req.user = user;
            req.token = token;
            // console.log('req.user=>>>', req.user);
            console.log('req.token=>>>', req.token);
            next();
        })
        .catch(e => {
            res.status(401).send();
        })
};

module.exports = {
    authenticate
}
