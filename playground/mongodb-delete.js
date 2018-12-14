// const mongoClient =  require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('unable to connect to MongoDB server')
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //deleteMany
    // db.collection('Users').deleteMany({name: 'Aloyzas'})
    //     .then((deleted) => console.log(deleted))
    //deleteOne
    // db.collection('Todos').deleteOne({text: 'eat lunch'})
    //     .then((deleted) => console.log(deleted))
    //findOneAndDelete
    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5c0e84dbe50635d87e2d7dc9')})
    //     .then((deleted) => console.log(deleted))

    // client.close();
});
