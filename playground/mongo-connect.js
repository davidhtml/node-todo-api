// const mongoClient =  require('mongodb').MongoClient;

const { mongoClient } = require('mongodb');


mongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('unable to connect to MongoDB server')
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })


    // db.collection('Users').insertOne({
    //     name: 'Aloyzas',
    //     age: 69,
    //     location: 'Zarasai'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('unaable to insert user', err)
    //     }
    //
    //     // console.log(JSON.stringify(result.ops, undefined, 2))
    //     console.log(result.ops[0]._id.getTimestamp(f))
    // })

    client.close();
});
