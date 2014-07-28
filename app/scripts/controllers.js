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
  //edit button to delete specific soap
  $scope.data = {
    showDelete: false
  };
  //$scope.edit = function(soap);
  $scope.genders = ['Male', 'Female', 'Other'];
  $scope.severities = [0,1,2,3,4,5,6,7,8,9,10];
  $scope.onsets = ['Sudden', 'Gradual'];

  //SEED DATA, COMMENT OUT AFTER FRONT_END REVIEW
  $scope.soaps = Soaps.all();
  $scope.soap = Soaps.get($stateParams.soapId);

})
