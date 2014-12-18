'use strict'
angular.module('WMISoapBuilder', ['angular-websql','debounce','ngCordova'])
.controller('FirstResponderCtrl', function($scope, $state, $location,
  $stateParams,$timeout,
  Responders, Soaps, Nols,uiState) {
    //Nols.cutLifeLine();
    $scope.mySoaps = function() {$state.go('soaps');}
    $scope.termsPage = function() {$state.go('terms');}

    $scope.trainingLevels = ['WFA','WAFA','WFR','WEMT','OTHER'];

    $scope.$location = $location;

    //INTRO LOGIC
    Responders.createResponderTable();
    Responders.all(function(err,responders){
      if(!responders) {
        Responders.saveResponder({},function(err,responder){
          if(typeof analytics !== "undefined") {
            analytics.trackView('Responder Sign Up');
          }
          $scope.responder = responder;
          return $scope.responder;
        })
      }else{
        Responders.get(function(err,responder) {
          if(responder !== null){
            $scope.responder = responder;
            if($scope.$location.path() == '/' && responder.acceptedTerms === 'true') {
              $scope.mySoaps();
            }
          }else {
            return;
          }
        })
      }
    })

    $scope.acceptAndSave = function(responder) {

      if(typeof analytics !== "undefined") {
        analytics.trackEvent('Responder','Created');
      }

      Responders.updateResponder('acceptedTerms',responder.id,true);
      $scope.mySoaps();
    };

    $scope.monitorResponderChange = function(responder, responderVal, attrElem) {
      console.log(responderVal)
      var kindElem = attrElem,kindId = responder.id,kindVal = responderVal;
      Responders.updateResponder(kindElem,kindId,kindVal);
    }

  })
