'use strict';
angular.module('WMISoapBuilder.controllers', [])

.controller('WMICtrl', function($scope,$state) {
})

.controller('FirstResponderCtrl', function($scope, $state, Responders) {
  $scope.terms = function() {
    $state.go('temrs');
  }
})

.controller('SoapCtrl', function($scope, Soaps) {
})
