'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


angular.module('WMISoapBuilder', ['ionic', 'WMISoapBuilder.controllers', 'WMISoapBuilder.services','WMISoapBuilder.directives', 'angular-websql', 'debounce', 'ngCordova'])


.run(function($ionicPlatform, nolsDB) {
  nolsDB.init();
  $ionicPlatform.ready(function() {

    if(typeof analytics !== "undefined"){
      analytics.startTrackerWithId('UA-57279344-1');
    }else {
      console.log("GA unavailable")
    }

    //$cordovaGoogleAnalytics.trackView('All Mobile App Data');

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
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
        url: '/responder/settings',
        templateUrl: 'templates/responder/settings.html',
        controller: 'FirstResponderCtrl'
    })

    .state('terms', {
      url: '/terms',
      templateUrl: 'templates/responder/terms.html',
      controller: 'FirstResponderCtrl'
    })

    .state('about', {
      url: '/about',
      templateUrl: 'templates/wmi/about.html',
      //controller: 'WMICtrl'
    })

    .state('soaps', {
      url: '/soaps',
      templateUrl: 'templates/soap/index.html',
      controller: 'SoapCtrl'
    })

    .state('soap-detail', {
      url: '/soaps/:soapId',
      templateUrl: 'templates/soap/show.html',
      controller: 'SoapDetailCtrl'
    })

    .state('review', {
      url: '/review/:soapId',
      templateUrl: 'templates/soap/tab-review.html',
      controller: 'SoapReviewCtrl'
    })

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/soap/tabs.html'
    })

    .state('tab.overview', {
      url: '/overview/:soapId',
      views: {
        'tab-overview': {
         templateUrl: 'templates/soap/tab-overview.html',
         controller: 'SoapOverviewCtrl'
        }
      }
    })

    .state('tab.subjective', {
      url: '/subjective/:soapId',
      views: {
        'tab-subjective': {
          templateUrl: 'templates/soap/tab-subjective.html',
          controller: 'SoapSubjectiveCtrl'
        }
      }
    })

    .state('tab.objective', {
      url: '/objective/:soapId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/soap/tab-objective.html',
          controller: 'SoapObjectiveCtrl'
        }
      }
    })

    .state('tab.vitals', {
      url: '/vitals/all/:soapId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vital/index.html',
          controller: 'VitalAllCtrl'
        }
      }
    })

    .state('tab.newvital', {
      url: '/vitals/:vitalId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vital/new.html',
          controller: 'VitalDetailCtrl'
        }
      }
    })

    .state('tab.editvital', {
      url: '/vitals/edit/:vitalId',
      views: {
        'tab-objective': {
          templateUrl: 'templates/vital/edit.html',
          controller: 'VitalEditCtrl'
        }
      }
    })

    .state('tab.ap', {
      url: '/ap/:soapId',
      views: {
        'tab-ap': {
          templateUrl: 'templates/soap/tab-ap.html',
          controller: 'SoapAPCtrl'
        }
      }
    })

    .state('tab.image', {
      url: '/images/:soapId',
      views: {
        'tab-image': {
          templateUrl: 'templates/soap/tab-images.html',
          controller: 'SoapImgCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});



// Change select classes for greyed out appearance to live.
//function changeClass(id) {
//	document.getElementById(id).setAttribute('class','active');
//	}

// enable/disable field based on BP taken or palpation. currently val is 1, change to actual val

//ToDo move into controller or model
function check_option(val){
	if(val == 0){
	document.getElementById("Diastolic").disabled = false;
	document.getElementById("Diastolic").placeholder = "Measurement (mmHg)";
	}
else {
document.getElementById("Diastolic").value = "test";
	document.getElementById("Diastolic").disabled = true;
	document.getElementById("Diastolic").placeholder = "N/A";

	}
};

// for limiting to numbers only
function validateNumber(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode( key );
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}
