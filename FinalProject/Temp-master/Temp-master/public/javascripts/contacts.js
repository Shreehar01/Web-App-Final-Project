var mymap, geocoder, marker = [], locations;
L.mapbox.accessToken = 'pk.eyJ1Ijoic2pvc2hpNCIsImEiOiJjbDIzaWI4cW8wZDl1M2lxZTJlMjdraWRxIn0.XbNTOeb7oQStDorVMlGzWQ';
mymap = L.mapbox.map('myMap').setView([ 41.08262, -74.17839 ], 6);
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${L.mapbox.accessToken}`, {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
maxZoom: 18,
id: 'mapbox/streets-v11',
tileSize: 512,
zoomOffset: -1,
accessToken: L.mapbox.accessToken
}).addTo(mymap)
geocoder = L.mapbox.geocoder('mapbox.places');
marker = {
    icon: L.mapbox.marker.icon({
        'marker-size':'large',
        'marker-color':'#fa0'
    })};
locations = {};

var information;
let elements = document.getElementsByTagName('tr');
var contactList = []
for (let i = 1; i < elements.length; i++){
    tempObject = {}
    tempObject["id"] = elements[i].dataset.id;
    childNodes = elements[i].children;
    for (let j = 0; j < 14; j ++){
        tempObject[childNodes[j].dataset.key] = childNodes[j].textContent;  
    }
    contactList[i-1] = tempObject;
}


var markerCollection = {}
// Adding a marker and tooltip.
for (var i = 0; i < contactList.length; i++){
    tempLat = parseFloat(contactList[i]["latitude"]);
    tempLong = parseFloat(contactList[i]["longitude"]);
    let marker = L.marker([tempLat, tempLong]).addTo(mymap);
    longDescription = ""
    longDescription += "<p> Name: " + contactList[i]["suffix"] + " " + contactList[i]["firstname"] + " " + contactList[i]["lastname"] + "</p>";
    longDescription += "<p> Street: " + contactList[i]["street"] + "</p>";
    longDescription += "<p> City and State: " + contactList[i]["city"] + ", " + contactList[i]["state"] + "</p>"
    longDescription += "<p> Zip: " + contactList[i]["zip"] + "</p>";
    longDescription += "<p> Phone: " + contactList[i]["phone"] + "</p>";
    marker.bindPopup(longDescription);
    marker.on('mouseover', function (e) {
        this.openPopup();
    });
    marker.on('mouseout', function (e) {
        this.closePopup();
    });
    let contactId = contactList[i]["id"];
    markerCollection[contactId] = marker;
}

    
const flyMap = (node) =>{
    let latitude = node.children[12].dataset.value;
    let longitude = node.children[13].dataset.value;
    let coordinates = [latitude, longitude];
    mymap.flyTo(coordinates, 8);
}


const showEditPage = (node) => {
    let rowNode = node.parentNode.parentNode.parentNode;
    let mainSection = document.getElementById("initialPage");
    mainSection.style.display = 'none';
    let editSection = document.getElementById("editPage");
    editSection.style.display = 'block';
    let childNodes = rowNode.children;
    for (let i = 1; i < 9; i++){
        if (i == 5){
            continue;
        }
        document.getElementById(rowNode.children[i].dataset.key).value = rowNode.children[i].textContent;		
    }
    document.getElementById(rowNode.children[5].dataset.key).value = rowNode.children[5].dataset.value;

    if (rowNode.children[0].dataset.value == "Mr.") document.getElementById('mr').checked = true;
    else if (rowNode.children[0].dataset.value == "Mrs.") document.getElementById('mrs').checked = true;
    else if (rowNode.children[0].dataset.value == "Ms.") document.getElementById('ms').checked = true;
    else document.getElementById('dr').checked = true;



    if (childNodes[9].dataset.value == "Yes" && childNodes[10].dataset.value == "Yes" && childNodes[11].dataset.value == "Yes"){
        document.getElementById("any").checked = true;	
    } 
    else{
        document.getElementById("any").checked = false;
        if (childNodes[9].dataset.value == "Yes"){
            document.getElementById("cPhone").checked = true
        }
        if (childNodes[10].dataset.value == "Yes"){
            document.getElementById("cMail").checked = true
        }
        if (childNodes[11].dataset.value == "Yes"){
            document.getElementById("cEmail").checked = true
        }
    }
    document.getElementById("contactIdhidden").value = rowNode.dataset.id;
}

const searchByName = () =>{
    let fName = document.getElementById('searchFirstName').value;
    let lName = document.getElementById('searchLastName').value;
    let elements = document.getElementsByTagName('tr');
    for (let i = 1; i < elements.length; i++){
        id = elements[i].dataset.id;
        childNodes = elements[i].children;
         if (childNodes[1].dataset.value.toUpperCase().indexOf(fName.toUpperCase()) != -1 && childNodes[2].dataset.value.toUpperCase().indexOf(lName.toUpperCase()) != - 1){
            elements[i].style.display = ""
         } else{
            elements[i].style.display = "none"
         }
    }
}




const hideEditPage = (node) => {
    let mainSection = document.getElementById("initialPage");
    mainSection.style.display = 'block';
    let editSection = document.getElementById("editPage");
    editSection.style.display = 'none';
}


const deleteContact = async (node) => {
    parent = node.parentNode.parentNode.parentNode;
    let response = await axios.post('/contacts/delete', {id: parent.dataset.id});
    if (response.data.message == "success"){
        mymap.removeLayer(markerCollection[parent.dataset.id]);
        parent.remove();
    }
}