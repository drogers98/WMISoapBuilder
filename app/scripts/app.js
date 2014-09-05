'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('WMISoapBuilder', ['ionic', 'WMISoapBuilder.controllers', 'WMISoapBuilder.services', 'angular-websql', 'debounce'])


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
      templateUrl: 'templates/responder/first-responder.html',
      controller: 'FirstResponderCtrl'
    })

    .state('settings', {
        url: '/settings',
        templateUrl: 'templates/responder/settings.html',
        controller: 'SoapCtrl'
    })

    .state('terms', {
      url: '/terms',
      templateUrl: 'templates/wmi/terms.html',
      controller: 'SoapCtrl'

    })

    .state('about', {
      url: '/about',
      templateUrl: 'templates/wmi/about.html',
      controller: 'WMICtrl'
    })

    .state('soaps', {
      url: '/responder/soaps',
      templateUrl: 'templates/soap/soaps.html',
      controller: 'SoapCtrl'
    })

    .state('soap-detail', {
      url: '/soaps/:soapId',
      templateUrl: 'templates/soap/soap-detail.html',
      controller: 'SoapDetailCtrl'
    })



    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/soap/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.subjective', {
      url: '/subjective',
      views: {
        'tab-subjective': {
          templateUrl: 'templates/soap/tab-subjective.html',
        }
      }
    })

    .state('tab.objective', {
      url: '/objective',
      views: {
        'tab-objective': {
          templateUrl: 'templates/soap/tab-objective.html'
        }
      }
    })

    .state('tab.vitals', {
      url: '/vitals',
      views: {
        'tab-objective': {
          templateUrl: 'templates/soap/vitals.html',
          controller: 'VitalCtrl'
        }
      }
    })

    .state('tab.newvital', {
      url: '/vitals/new',
      views: {
        'tab-objective': {
          templateUrl: 'templates/soap/vitalnew.html',
          controller: 'VitalCtrl'
        }
      }
    })

    .state('tab.vital', {
      url: '/vitals/:vitalId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/soap/vital.html',
          controller: 'VitalDetailCtrl'
        }
      }
    })

    .state('tab.ap', {
      url: '/ap',
      views: {
        'tab-ap': {
          templateUrl: 'templates/soap/tab-ap.html'
        }
      }
    })

    .state('tab.review', {
      url: '/review',
      views: {
        'tab-ap': {
          templateUrl: 'templates/soap/tab-review.html'
        }
      }
    })

    .state('tab.image', {
      url: '/images',
      views: {
        'tab-image': {
          templateUrl: 'templates/soap/tab-images.html'
        }
      }
    })

    .state('tab.overview', {
      url: '/overview',
      views: {
        'tab-overview': {
          templateUrl: 'templates/soap/tab-overview.html'
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






// Change select classes for greyed out appearance to live.
function changeClass(id) {
	document.getElementById(id).setAttribute('class','active');
	}

// enable/disable field based on BP taken or palpation. currently val is 1, change to actual val
function check_option(val){
	if(val == 0){
	document.getElementById("Diastolic").disabled = false;
	document.getElementById("Diastolic").placeholder = "Reading";
	}
else {
	document.getElementById("Diastolic").disabled = true;
	document.getElementById("Diastolic").placeholder = "N/A";
	}
};



// Photo capture.

//begin test
var pictureSource; // picture source
var destinationType; // sets the format of returned value

// Wait for PhoneGap to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
pictureSource=navigator.camera.PictureSourceType;
destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
// Get image handle
//
var smallImage = document.getElementById('smallImage');

// Unhide image elements
//
smallImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
smallImage.src = "data:image/jpeg;base64," + imageData;
}
// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
// Get image handle
console.log(JSON.stringify(imageData));
// Get image handle
//
var smallImage = document.getElementById('smallImage');
var smallImageText = document.getElementById('smallImageText');

// Unhide image elements
//
smallImage.style.display = 'block';
smallImageText.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
smallImage.src = imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
// Uncomment to view the image file URI
// console.log(imageURI);

// Get image handle
//
var largeImage = document.getElementById('largeImage');
var largeImageText = document.getElementById('largeImageText');

// Unhide image elements
//
largeImage.style.display = 'block';
largeImageText.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
largeImage.src = imageURI;
}

function capturePhotoWithFile() {
navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}
// A button will call this function
//
function getPhoto(source) {
// Retrieve image file location from specified source
navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
destinationType: destinationType.FILE_URI,
sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
alert('Failed because: ' + message);
}
// end photo
