const bcrypt = require('bcryptjs');

const password = '123abc!';

//nbigger the number, longer bcrypt takes to generate salt, in this example 10 rounds
// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(passowrd, salt, (err, hash) => {
//         console.log('Our new hash=>>', hash)
//     })
// });


const hashedPass = '$2a$10$G8cKaM1mMy7g6eZtF.3O9ODz/Bgx61/dzzmVQkxglK5WFTDLWXs.W';

bcrypt.compare(password, hashedPass, (err, result) => {
    console.log(result)
});


// const jwt = require('jsonwebtoken');
// const data = {
//     id: 10
// };
//
// const token = jwt.sign(data, 'secretkey');
// console.log(token);
// const decoded = jwt.verify(token, 'secretkey');
// console.log('decoded token=>', decoded)


// const {SHA256} = require('crypto-js');
//
// const msg = 'Username';
//
// const hashedMsg = SHA256(msg).toString();
//
// console.log(`original message: ${msg}`);
// console.log(`hashed message: ${hashedMsg}`);
//
//
// const data = {
//     id: 123,
// }
//
// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secretkey').toString()
// }
//
// token.hash = SHA256(JSON.stringify(data)).toString()
//
// const resultHash = SHA256(JSON.stringify(data) + 'secretkey').toString();
//
// if (resultHash === token.hash) {
//     console.log('token is correct, please log in')
// } else {
//     console.log('incorrect token, error error')
// }
