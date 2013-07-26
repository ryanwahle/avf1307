/*
Ryan Wahle
AVF1307
 */

/* Cordova Code */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("deviceready", connection.initialize, true);
        document.addEventListener("deviceready", compass.initialize, true);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};

/* My Code */

var weather = {
	initialize: function() {
		weather.loadJSON('85044');
	},
	
	loadJSON: function(locationString) {
	
		var url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + locationString + '&num_of_days=1&format=json&callback=?';
		
		// data.current_condition[0].temp_F
		
		$.getJSON(url, function(data) {
			var weather_object_data = data['data'];
			var current_condition = weather_object_data['current_condition'];
			var current_temperature = current_condition[0]['temp_F'];
			
			console.log(current_temperature);
			
			$('#currentTemperature').text(current_temperature + 'F');
		});
		
	}
};

var instagram = {
	loadJSON: function() {
		var url = 'https://api.instagram.com/v1/tags/cdrom/media/recent?callback=?&client_id=1c9671beb4e94d21904176e30e9e9af4';
	
		$.getJSON(url, function(data) {
			$.each(data['data'], function(index, row) {
				var picture = row['images']['thumbnail']['url'];
				
				$('<img src="' + picture + '" />').appendTo('#pictures');
			
			});
		});
	}
};

var gps = {
	initialize: function() {
		navigator.geolocation.getCurrentPosition(gps.decodePosition);
	},
	
	decodePosition: function(position) {
		var currentLocationString = position.coords.latitude + ',' +  position.coords.longitude;
		console.log(currentLocationString);
		$('#currentLocation').text(currentLocationString);
		weather.loadJSON(currentLocationString);
	}
};

var notifications = {
	initialize: function() {
		$('#notificationsAlert').click(notifications.alert);
		$('#notificationsBeep').click(notifications.beep);
	},
	
	alert: function() {
		console.log('alert');
		navigator.notification.alert('This is a sample alert box!', notifications.alertDismiss, 'AVF 1307', 'Dismiss');
		return false;
	},
	
	alertDismiss: function() {
		console.log('alert dismissed');
	},
	
	beep: function() {
		navigator.notification.beep(3);
	}
};

var compass = {
	initialize: function() {
		console.log('entered compass');
		var tempID = navigator.compass.watchHeading(compass.displayCurrentHeading, compass.compassError, {frequency: 5000});
		console.log('exit compass');
	},
	
	compassError: function(error) {
		$('#compassHeading').text('ERROR READING FROM COMPASS');
	},
	
	displayCurrentHeading: function(heading) {
		$('#compassHeading').text(heading.magneticHeading);
	}
};

var connection = {
	initialize: function() {
		var networkType = navigator.connection.type;
		$('#connectionType').text(networkType);
	}
};