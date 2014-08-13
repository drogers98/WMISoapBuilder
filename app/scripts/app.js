'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('WMISoapBuilder', ['ionic', 'WMISoapBuilder.controllers', 'WMISoapBuilder.services', 'angular-websql'])

.run(function($ionicPlatform, nolsDB) {
  nolsDB.init();
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('first-responder', {
      url: '/',
      templateUrl: 'templates/first-responder.html',
      controller: 'FirstResponderCtrl'
    })

    .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html',
        controller: 'SoapCtrl'
    })

    .state('terms', {
      url: '/terms',
      templateUrl: 'templates/terms.html',
      controller: 'WMICtrl'
    })

    .state('about', {
      url: '/about',
      templateUrl: 'templates/wmi/about.html',
      controller: 'WMICtrl'
    })

    .state('help', {
      url: '/help',
      templateUrl: 'templates/help.html',
      controller: 'SoapCtrl'
    })

    .state('soaps', {
      url: '/responder/soaps',
      templateUrl: 'templates/soaps.html',
      controller: 'SoapCtrl'
    })

    .state('soap-review', {
      url: '/soap/review',
      templateUrl: 'templates/soap-review.html',
      controller: 'SoapCtrl'
    })

    .state('soap-detail', {
      url: '/soap/:soapId',
      templateUrl: 'templates/soap-detail.html',
      controller: 'SoapCtrl'
    })
    
   

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.subjective', {
      url: '/subjective',
      views: {
        'tab-subjective': {
          templateUrl: 'templates/tab-subjective.html',
        }
      }
    })

    .state('tab.objective', {
      url: '/objective',
      views: {
        'tab-objective': {
          templateUrl: 'templates/tab-objective.html'
        }
      }
    })

    .state('tab.vitals', {
      url: '/vitals',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vitals.html',
          controller: 'VitalCtrl'
        }
      }
    })

    .state('tab.newvital', {
      url: '/vitals/new',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vitalnew.html',
          controller: 'VitalCtrl'
        }
      }
    })

    .state('tab.vital', {
      url: '/vitals/:vitalId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vital.html'
        }
      }
    })

    .state('tab.ap', {
      url: '/ap',
      views: {
        'tab-ap': {
          templateUrl: 'templates/tab-ap.html'
        }
      }
    })

    .state('tab.image', {
      url: '/images',
      views: {
        'tab-image': {
          templateUrl: 'templates/tab-images.html'
        }
      }
    })

    .state('tab.overview', {
      url: '/overview',
      views: {
        'tab-overview': {
          templateUrl: 'templates/tab-overview.html'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});




// Photo test.

function capturePhoto(){
    navigator.camera.getPicture(uploadPhoto,null,{sourceType:1,quality:60});
}

function uploadPhoto(data){
// this is where you would send the image file to server

	cameraPic.src = "data:image/jpeg;base64," + data;
	// Successful upload to the server
	navigator.notification.alert(
		'Your Photo has been uploaded',  // message
		okay,                           // callback
	    'Photo Uploaded',              // title
	    'OK'                          // buttonName
	);

	// upload has failed Fail

	

	if (failedToUpload){

	navigator.notification.alert(
		'Your Photo has failed to upload',
		failedDismissed,
	    'Photo Not Uploaded',
	    'OK'
		);

	} 
}

function okay(){
	// Do something
}




// Lat / Lon test stuff
function latLong(){
if (navigator.geolocation) {
// Show loading text
document.getElementById('GeoLocation').value = "Loading...";
  var timeoutVal = 10 * 1000 * 1000;
  navigator.geolocation.getCurrentPosition(
    displayPosition, 
    displayError,
    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
  );
}
else {
  alert("Geolocation is not supported at this time");
}

function displayPosition(position) {
document.getElementById('GeoLocation').value = position.coords.latitude + ", " + position.coords.longitude;
document.getElementById('GeoLocationBtnInner').innerHTML = "Reset Coordinates";
document.getElementById("coordsBtn").className = "";
document.getElementById("coordsBtn").className = "button button-block button-calm margin";
 
}

function displayError(error) {
document.getElementById('GeoLocation').value = "Lat/Long Unavailable";
  var errors = { 
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}
}

// Change select classes for greyed out appearance to live.
function changeClass(id) {
	document.getElementById(id).setAttribute('class','active');
	}
	
// enable/disable field based on BP taken or palpation. currently val is 1, change to actual val
function check_option(val)
{
if(val == 0)
{
document.getElementById("Diastolic").disabled = false;
document.getElementById("Diastolic").placeholder = "Reading";
}
else
{
document.getElementById("Diastolic").disabled = true;
document.getElementById("Diastolic").placeholder = "N/A";
}
};

// stopwatch on vitals page
window.onload=function(){
var h1 = document.getElementById('Stopwatch'),
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    clear = document.getElementById('clear'),
    seconds = 0, minutes = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }
    
    h1.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();
clearTimeout(t);

// Start button 
start.onclick = timer;
// Stop button 
stop.onclick = function() {
    clearTimeout(t);
}
// Clear button 
clear.onclick = function() {
    h1.textContent = "00:00";
    seconds = 0; minutes = 0;
    clearTimeout(t);
}
};
