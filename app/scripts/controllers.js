'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql'])

.controller('WMICtrl', function($scope,$state) {

})

.controller('FirstResponderCtrl', function($scope, $state, $stateParams, Responders) {
  $scope.termsPage = function(){$state.go('terms');}
  $scope.responderSoapsPage = function(){$state.go('soaps');}
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT'];

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

.controller('SoapCtrl', function($scope, $state, $stateParams, Soaps) {
  $scope.aboutPage = function(){$state.go('about');}
  $scope.subjectivePage = function(){$state.go('tab.subjective');}
  $scope.objectivePage = function(){$state.go('tab.objective');}
  $scope.apPage = function(){$state.go('tab.ap');}
  //edit button to delete specific soap
  $scope.data = {
    showDelete: false
  };
  //$scope.edit = function(soap);
  $scope.genders = ['Male', 'Female', 'Other'];
  $scope.severities = [0,1,2,3,4,5,6,7,8,9,10];
  $scope.onsets = ['Sudden', 'Gradual'];
  $scope.quality = ['Aching', 'Burning', 'Cramping','Dull Pressure', 'Sharp', 'Squeezing','Stabbing', 'Tight', ]

  //SEED DATA, COMMENT OUT AFTER FRONT_END REVIEW
  $scope.soaps = Soaps.all();
  $scope.soap = Soaps.get($stateParams.soapId);
  //$scope.soap.vitals = Vitals.all($stateParams.soapId)
  //$scope.soap.vital = Vitals.get($stateParams.soapId);

})

.controller('VitalCtrl', function($scope, $timeout, $state, $stateParams, Vitals) {



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
