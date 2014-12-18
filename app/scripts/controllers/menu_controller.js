'use strict';
angular.module('WMISoapBuilder.controllers')
.controller('MenuCtrl', function($scope,$state,$stateParams,$location,$ionicSideMenuDelegate) {

  $scope.$location = $location;
  var path = $scope.$location.path();
  $scope.pathId = path.match(/\d+/g);

  $scope.callPath = function() {
    function goReview() {$state.go('tab.review', {soapId: $scope.pathId});$ionicSideMenuDelegate.toggleRight();}
    function hideReview() {alert('Sorry we could not find that SOAP')}
    $scope.pathId ? goReview() : hideReview();
  }

  $scope.toggleSideMenu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
});
