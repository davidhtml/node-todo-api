// const mongoClient =  require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

//findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate(
    //     {_id: new ObjectID('5c0e82ebbf3a4dd83addec43')},
    //     { $set: { completed: true } },
    //     { returnOriginal: false}
    // )
    // .then(res => console.log(res));


    db.collection('Users').findOneAndUpdate(
        {_id: '234ABC'},
        {
            $inc: { age: 1 },
            $set: { name: 'Deividas Urbonavicius' }

        },
        { returnOriginal: false}
    )
    .then(res => console.log(res));

    // client.close();
});
