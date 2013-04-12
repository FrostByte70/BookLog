// JavaScript Document

// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    getLocation();
    navigator.splashscreen.hide();
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}


//=======================Database     =======================//

    var DBName = "BookLog";
    var DBVersion = "1.0";
    var DBDisplayName = "Book Log";
    var DBSize = 200000


    function getData() {
        onDeviceReady();
        
        
    }
    // Populate the database 
    //
    function populateDB(tx) {
        //  create the USERS table and populate with Default User
      //  tx.executeSql('DROP TABLE IF EXISTS USERS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id INTEGER PRIMARY KEY AUTOINCREMENT , username UNIQUE )');
        tx.executeSql('INSERT OR IGNORE INTO USERS ( username) VALUES ( "Default User")');
 

        // create the Book Catagories table and populate with default values.
        
        
        // create the Book Formats table and populate with default values.
        
        
        // create the Book Log table


    }

    // Query the database for the Users that are defined in the system
    //
    function queryUsers(tx) {
        tx.executeSql('SELECT * FROM USERS', [], queryUsersSuccess, errorCB);
    }

    // Query the success callback
    //
    function queryUsersSuccess(tx, results) {
        var len = results.rows.length;
        var msg; 
        msg = "USERS table: " + len + " rows found.<br>";
        for (var i=0; i<len; i++){
            msg = msg + "Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).username + "<br>";
        }
        
        var sqlResults = document.getElementById('sqlResults');
        sqlResults.innerHTML = msg;
        sqlResults.style.display = 'block';
    }

    // Transaction error callback
    //
    function errorCB(err) {
        console.log("Error processing SQL Code: "+err.code);
        console.log("Error processing SQL Message: "+err.message);
    }

    // Transaction success callback
    //
    function successCB() {
    //    var db = window.openDatabase("BookLog", "1.0", "Book Log", 200000);
        var db = window.openDatabase(DBName, DBVersion, DBDisplayName, DBSize);
        db.transaction(queryUsers, errorCB);
    }

    // Cordova is ready
    //
    function onDeviceReady() {
        var db = window.openDatabase(DBName, DBVersion, DBDisplayName, DBSize);
        db.transaction(populateDB, errorCB, successCB);
    }





//=======================Say Hello (Page 1) Operations=======================//
function sayHello() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');

    sayHelloTextElem.innerHTML = 'Hello, ' + inputText.value + '!';
    sayHelloTextElem.style.display = 'block';
    sayHelloInputElem.style.display = 'none';
}

function sayHelloReset() {
    var sayHelloInputElem = document.getElementById('helloWorldInput');
    var sayHelloTextElem = document.getElementById('helloWorldText');
    var inputText = document.getElementById('txtName');

    inputText.value = '';
    sayHelloTextElem.style.display = 'none';
    sayHelloInputElem.style.display = 'block';
}

//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) {
    // Use Google API to get the location data for the current coordinates
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({ "latLng": latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if ((results.length > 1) && results[1]) {
                $("#myLocation").html(results[1].formatted_address);
            }
        }
    });

    // Use Google API to get a map of the current location
    // http://maps.googleapis.com/maps/api/staticmap?size=280x300&maptype=hybrid&zoom=16&markers=size:mid%7Ccolor:red%7C42.375022,-71.273729&sensor=true
    var googleApis_map_Url = 'http://maps.googleapis.com/maps/api/staticmap?size=300x300&maptype=hybrid&zoom=16&sensor=true&markers=size:mid%7Ccolor:red%7C' + latlng;
    var mapImg = '<img src="' + googleApis_map_Url + '" />';
    $("#map_canvas").html(mapImg);
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
    $("#myLocation").html("<span class='err'>" + error.message + "</span>");
}