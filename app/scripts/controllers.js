'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql'])

.controller('WMICtrl', function($scope,$state) {

})

.controller('FirstResponderCtrl', function($scope, $state, Responders) {
  $scope.termsPage = function(){$state.go('terms');}
  $scope.responderSoapsPage = function(){$state.go('soaps');}
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT'];

})

.controller('SoapCtrl', function($scope, Soaps) {
})
