'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql'])

.controller('WMICtrl', function($scope,$state) {

})

.controller('FirstResponderCtrl', function($scope, $state, $stateParams, Responders) {
  $scope.termsPage = function(){$state.go('terms');}
  $scope.responderSoapsPage = function(){$state.go('soaps');}
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];

  $scope.newResponder = function(responder) {
    var attributes = {
      responder: {
        firstName: responder.firstName,
        lastName: responder.lastName,
        trainingLevel: responder.trainingLevel
      }
    };
    //below call service methods - todo => implement service methods
    var responderData = angular.toJson(attributes);
    Responders.createNewResponder(responderData);
    $scope.responders.push(responderData);
    //after save link to soaps
    $state.responderSoapsPage();
  }


})

.controller('SoapCtrl', function($scope, $state, $stateParams,$ionicNavBarDelegate, Soaps) {
  $scope.settingsPage = function() {$state.go('settings');}
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };
  $scope.aboutPage = function(){$state.go('about');}
  $scope.mySoapsPage = function(){$state.go('soaps')}
  $scope.subjectivePage = function(){$state.go('tab.subjective');}
  $scope.objectivePage = function(){$state.go('tab.objective');}
  $scope.apPage = function(){$state.go('tab.ap');}
  $scope.imagePage = function(){$state.go('tab.image');}
  $scope.overviewPage = function(){$state.go('tab.overview');}
  $scope.reviewSoapPage = function(){$state.go('soap-review');}
  //edit button to delete specific soap
  $scope.data = {
    showDelete: false
  };
  //$scope.edit = function(soap);
  $scope.genders = ['Male', 'Female', 'Other'];
  $scope.severities = [0,1,2,3,4,5,6,7,8,9,10];
  $scope.onsets = ['Sudden', 'Gradual'];
  $scope.qualities = ['Aching', 'Burning', 'Cramping','Dull Pressure', 'Sharp', 'Squeezing', 'Stabbing', 'Tight'];
  $scope.spinals = ['Yes', 'No'];
  $scope.pupils = ['Yes', 'No'];
  $scope.BPmeasureds = ['Systolic', 'Diastolic'];
  $scope.BPpulses = ['Radial Pulse Present', 'Radial Pulse Weak', 'Radial Pulse Absent'];
  $scope.SKINmoists = ['Dry', 'Moist', 'Wet'];
  $scope.SKINtemps = ['Warm', 'Cool', 'Hot'];
  $scope.SKINcolors = ['Pink', 'Pale', 'Red'];
  $scope.RESPrythms = ['Regular', 'Irregular'];
  $scope.RESPqualities = ['Easy', 'Shallow', 'Labored'];
  $scope.HEARTqualities = ['Strong', 'Weak', 'Bounding'];
  $scope.HEARTrythms = ['Regular', 'Irregular'];

  $scope.LORs = ['Awake & Oriented x 4', 'Awake & Oriented x 3', 'Awake & Oriented x 2', 'Awake & Oriented x 1', 'Awake & Oriented x 0', 'Verbal Stimulus', 'Pain Stimulus', 'Unresponsive'];
  
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];

  //SEED DATA, COMMENT OUT AFTER FRONT_END REVIEW
  $scope.soaps = Soaps.all();
  $scope.soap = Soaps.get($stateParams.soapId);
  //$scope.soap.vitals = Vitals.all($stateParams.soapId)
  //$scope.soap.vital = Vitals.get($stateParams.soapId);

})

.controller('VitalCtrl', function($scope, $timeout, $state, $stateParams, Vitals) {


  $scope.vitals = Vitals.all();
  $scope.counter = '1:00';
  $scope.startCounter = function() {
    $scope.counter = 60;
    $scope.countdown();
  }
  var stopped;
  $scope.countdown = function() {
    if($scope.counter == 0) {
      $scope.stop();
      $scope.counter = '1:00'
    }
    stopped = $timeout(function() {
     $scope.counter--;
     $scope.countdown();
    }, 1000);
  };


$scope.stop = function(){
   $timeout.cancel(stopped);

    }
})
