var express = require('express');
let geo = require('mapbox-geocoding');
var router = express.Router();
var database = require('../mongodb.js');
geo.setAccessToken('pk.eyJ1Ijoic2pvc2hpNCIsImEiOiJjbDIzaWI4cW8wZDl1M2lxZTJlMjdraWRxIn0.XbNTOeb7oQStDorVMlGzWQ');

router.get('/', function (req, res, next) {
	res.render('mailer');
});

router.post('/', function (req, res, next) {
    let body = req.body;
    let tempData = {};
    tempData["Name"] = [body["suffix"], body["firstname"], body["lastname"]].join(' ');
    tempData["Address"] = [body["street"], body["city"], body["state"]].join(', ') + " " + body["zip"];
    tempData["Contact By Phone"] = body["contactany"] || body["contactphone"] ? body["phone"] : "No";
    tempData["Contact By Mail"] = body["contactany"] || body["contactmail"] ? "Yes" : "No";
    tempData["Contact By Email"] = body["contactany"] || body["contactemail"] ? body["email"] : "No";
    
	let contactInfo = body;
    contactInfo["contactphone"] = body["contactany"] || body["contactphone"] ? "Yes" : "No";
    contactInfo["contactmail"] = body["contactany"] || body["contactmail"] ? "Yes" : "No";
    contactInfo["contactemail"] = body["contactany"] || body["contactemail"] ? "Yes" : "No";
    delete contactInfo.contactany;
    

	geo.geocode('mapbox.places', tempData["Address"],async function (err, geoData) {
		tempData["Latitude"] = geoData.features[0].center[1];	
		tempData["Longitude"] = geoData.features[0].center[0];
        contactInfo["latitude"] = tempData["Latitude"]
        contactInfo["longitude"] = tempData["Longitude"]
		await database.get().db('contacts').collection('contacts').insertOne(contactInfo);
        res.render('confirmation', {value: tempData});
	});


});

module.exports = router;



