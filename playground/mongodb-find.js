// const mongoClient =  require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('unable to connect to MongoDB server')
    }

    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').find().count()
    //     .then((count) => {
    //         console.log(`Todos count: ${count}`)
    //
    //     })
    //     .catch(err => console.log(`unable to fetch todos`, err))

    db.collection('Users').find({name: 'Aloyzas'}).toArray()
        .then((docs) => {
            console.log(docs)

        })
        .catch(err => console.log(`unable to fetch todos`, err))

    // client.close();
});
