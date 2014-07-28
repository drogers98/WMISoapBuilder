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

    .state('terms', {
      url: '/terms',
      templateUrl: 'templates/terms.html',
      controller: 'WMICtrl'
    })

    .state('about', {
      url: '/about',
      templateUrl: 'templates/about.html',
      controller: 'WMICtrl'
    })

    .state('help', {
      url: '/help',
      templateUrl: 'templates/help.html',
      controller: 'WMICtrl'
    })

    .state('soaps', {
      url: '/responder/soaps',
      templateUrl: 'templates/soaps.html',
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
