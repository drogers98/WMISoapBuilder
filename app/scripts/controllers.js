'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql'])

.controller('WMICtrl', function($scope,$state) {
  $scope.terms = function() {
    $state.go('terms');
  }
})

.controller('FirstResponderCtrl', function($scope, $state, Responders) {
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();
  //$scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT'];

})

.controller('SoapCtrl', function($scope, Soaps) {
})
