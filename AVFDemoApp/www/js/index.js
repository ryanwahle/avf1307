/*
Ryan Wahle
AVF1307
*/

$(function() {
	document.addEventListener('deviceready', app.onDeviceReady, false);
});

var app = {
    onDeviceReady: function() {
        if ( $('body').hasClass('pageMain') ) {
    		//console.log('pageMain loaded');
    	} else if ( $('body').hasClass('pageWeather') ) {
    		weather.initialize();
    	} else if ( $('body').hasClass('pageNotifications') ) {
    		notifications.initialize();
    	} else if ( $('body').hasClass('pageInstagram') ) {
    		instagram.initialize();
    	} else if ( $('body').hasClass('pageGPS') ) {
    		gps.initialize();
    	} else if ( $('body').hasClass('pageConnection') ) {
    		connection.initialize();
    	} else if ( $('body').hasClass('pageCompass') ) {
    		compass.initialize();
    	} else {
    		//console.log('WARNING: Who knows what page this is. Maybe it doesn\'t matter!');
    	}
    }
};

var weather = {
	initialize: function() {
		weather.loadJSON('85044');
	},
		
	loadJSON: function(locationString) {
	
		var url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + locationString + '&num_of_days=1&format=json&callback=?';
		//console.log(url);
		
		// data.current_condition[0].temp_F
		
		$.getJSON(url, function(data) {
			var weather_object_data = data['data'];
			var current_condition = weather_object_data['current_condition'];
			var current_temperature = current_condition[0]['temp_F'];
			
			$('#currentTemperature').text(current_temperature + 'F');
		});
		
	}
};

var instagram = {
	initialize: function() {
		this.loadJSON();
	},
	
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
		//console.log(currentLocationString);
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
		//console.log('alert');
		navigator.notification.alert('This is a sample alert box!', notifications.alertDismiss, 'AVF 1307', 'Dismiss');
		return false;
	},
	
	alertDismiss: function() {
		//console.log('alert dismissed');
	},
	
	beep: function() {
		navigator.notification.beep(3);
	}
};

var compass = {
	currentLatitude: '',
	currentLongitude: '',
	tempNorth: '',
	tempSouth: '',
	tempEast: '',
	tempWest: '',
	
	initialize: function() {
		navigator.geolocation.getCurrentPosition(compass.decodePosition);
		var tempID = navigator.compass.watchHeading(compass.displayCurrentHeading, compass.compassError, {frequency: 1000});
	},
	
	decodePosition: function(position) {
		compass.currentLatitude = position.coords.latitude;
		compass.currentLongitude = position.coords.longitude;
		
		var northString = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + (compass.currentLatitude + .5) + ',' + compass.currentLongitude + '&num_of_days=1&format=json&callback=?';
		var southString = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + (compass.currentLatitude - .5) + ',' + compass.currentLongitude + '&num_of_days=1&format=json&callback=?';
		var westString = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + compass.currentLatitude + ',' + (compass.currentLongitude + .5) + '&num_of_days=1&format=json&callback=?';
		var eastString = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=' + compass.currentLatitude + ',' + (compass.currentLongitude - .5) + '&num_of_days=1&format=json&callback=?';
		
		$.getJSON(northString, function(data) {
			compass.tempNorth = data['data']['current_condition'][0]['temp_F'];
			//console.log('Received North: ' + compass.tempNorth);
		});
		
		$.getJSON(southString, function(data) {
			compass.tempSouth = data['data']['current_condition'][0]['temp_F'];
			//console.log('Received South: ' + compass.tempSouth);
		});

		$.getJSON(eastString, function(data) {
			compass.tempEast = data['data']['current_condition'][0]['temp_F'];
			//console.log('Received East: ' + compass.tempEast);
		});

		$.getJSON(westString, function(data) {
			compass.tempWest = data['data']['current_condition'][0]['temp_F'];
			//console.log('Received West: ' + compass.tempWest);
		});
	},
	
	compassError: function(error) {
		$('#compassHeading').text('ERROR READING FROM COMPASS');
	},
	
	displayCurrentHeading: function(heading) {
		var compassHeading = heading.magneticHeading;
		var headingText = '';
		var tempHeading = '';
		
		if (compassHeading > 315.00) {
			headingText = 'North';
			tempHeading = compass.tempNorth;
		} else if (compassHeading < 45.00) {
			headingText = 'North';
			tempHeading = compass.tempNorth;
		} else if ( (compassHeading > 45.00) && (compassHeading < 135.00) ) {
			headingText = 'East';
			tempHeading = compass.tempEast;
		} else if ( (compassHeading > 135.00) && (compassHeading < 225.00) ) {
			headingText = 'South';
			tempHeading = compass.tempSouth
		} else if ( (compassHeading > 225.00) && (compassHeading < 315.00) ) {
			headingText = 'West';
			tempHeading = compass.tempWest
		}
		
		//console.log('compassText: ' + gpsLocation);
		$('#compassHeading').text(headingText);
		$('#tempHeading').text(tempHeading);
	}
};

var connection = {
	initialize: function() {
		var networkType = navigator.connection.type;
		$('#connectionType').text(networkType);
		
		$('#cordovaVersion').text(device.cordova);
		$('#deviceVersion').text(device.version);
	}
};