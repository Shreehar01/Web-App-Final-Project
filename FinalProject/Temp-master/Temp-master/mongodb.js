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



// let exportObj = {};

// exportObj.startConnection=function(){
// 	MongoClient.connect(url, function (err, client) {
// 		if (err) {
// 			console.log(err);
// 			throw(err);
// 		}
// 		exportObj.client=client;
// 		console.log("Connected correctly to server.");
// 	});
// };

// exportObj.getAllRecords = async function (callback) {
// 	let db = exportObj.client.db('test');
// 	let collection = db.collection('newCollection');
// 	let result = (await collection.find().toArray());
// 	return result;
// };

// exportObj.closeConnection = function () {
// 	exportObj.client.close();
// }

// exportObj.AddRecord = async function (record) {
// 	let db = exportObj.client.db('test');
// 	let collection = db.collection('newCollection');	
// 	return (await collection.insertOne(record));
// }

// exportObj.removeRecord=async function(id){
// 	let db = exportObj.client.db('test');
// 	let collection = db.collection('newCollection');
// 	return (await collection.deleteOne({_id:new mongodb.ObjectID(id)}));
// }

// exportObj.updateRecord=async function(id,obj){
// 	let db = exportObj.client.db('test');
// 	let collection = db.collection('newCollection');
// 	return (await collection.updateOne({_id:new mongodb.ObjectID(id)},{ $set:obj}));
// }

// module.exports = exportObj;