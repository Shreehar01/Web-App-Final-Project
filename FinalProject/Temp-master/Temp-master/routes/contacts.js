var express = require('express');
var router = express.Router();
var database = require('../mongodb.js');
var mongodb=require('mongodb');

let geo = require('mapbox-geocoding');
geo.setAccessToken('pk.eyJ1Ijoic2pvc2hpNCIsImEiOiJjbDIzaWI4cW8wZDl1M2lxZTJlMjdraWRxIn0.XbNTOeb7oQStDorVMlGzWQ');

var ensureLoggedIn = function(req, res, next) {
	if ( req.user ) {
		next();
	}
	else {
		res.redirect("/login");
	}
}


router.get('/', ensureLoggedIn, async function (req, res, next) {
	try{
		let results = await database.get().db('contacts').collection('contacts').find().toArray();
		res.render('contacts', { values: results });
	} catch(error){
		console.log(error.message);
	}
});

router.post('/update', ensureLoggedIn, function (req, res, next) {
	let body = req.body;
    let contactInfo = body;
	let contactId = body['contactId']
	let address = [body["street"], body["city"], body["state"]].join(', ') + " " + body["zip"];
    
	contactInfo["contactphone"] = body["contactany"] || body["contactphone"] ? "Yes" : "No";
    contactInfo["contactmail"] = body["contactany"] || body["contactmail"] ? "Yes" : "No";
    contactInfo["contactemail"] = body["contactany"] || body["contactemail"] ? "Yes" : "No";
    delete contactInfo.contactany;
    delete contactInfo.contactId;
	geo.geocode('mapbox.places', address, async function (err, geoData) {
		contactInfo["latitude"] = geoData.features[0].center[1];	
		contactInfo["longitude"] = geoData.features[0].center[0];
		await database.get().db('contacts').collection('contacts').updateOne({_id:new mongodb.ObjectID(contactId)},{ $set:contactInfo});
        res.redirect('/contacts/');
	});

});

router.post('/delete', ensureLoggedIn, async function (req, res, next) {
	let contactId = req.body.id;
	await database.get().db('contacts').collection('contacts').deleteOne({_id:new mongodb.ObjectID(contactId)});
	res.end(JSON.stringify({message: 'success'}));
});


module.exports = router;
