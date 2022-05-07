var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/contacts';
var mongodb;

function connect(callback){
    mongoClient.connect(url, (err, db) => {
        mongodb = db;
        console.log("Database connected");
        callback();
    });
}

function get(){
    return mongodb;
}

module.exports = {connect, get};