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
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

/* My Code */

var weather = {
	loadJSON: function() {
	
		var url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?key=eqwpuh87cn2a5exwnnf2cbgf&q=85044&num_of_days=1&format=json&callback=?';
		
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