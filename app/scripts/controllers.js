'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql'])

.controller('WMICtrl', function($scope,$state) {

})

.controller('FirstResponderCtrl', function($scope, $state, $stateParams, Responders) {
  $scope.termsPage = function(){$state.go('terms');};
  $scope.responderSoapsPage = function(){$state.go('soaps');};
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
  };


})

// Controller for slide menu. could prolly be reworked a bit. DR
.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate) {
$scope.toggleSideMenu = function() {
            $ionicSideMenuDelegate.toggleRight();
        };
})


.controller('SoapCtrl', function($scope, $state, $stateParams, Soaps) {
"use strict";

  // Auto expand text boxes vertically
  $scope.expandText = function(obj){
	var valueID = obj.target.attributes.id.value;
	var element = document.getElementById(valueID);
	element.style.height =  element.scrollHeight + "px";}
	
  $scope.settingsPage = function() {$state.go('settings');}
  $scope.aboutPage = function(){$state.go('about');}
  $scope.mySoapsPage = function(){$state.go('soaps');}
  $scope.subjectivePage = function(){$state.go('tab.subjective');}
  $scope.objectivePage = function(){$state.go('tab.objective');}
  $scope.apPage = function(){$state.go('tab.ap');}
  $scope.imagePage = function(){$state.go('tab.image');}
  $scope.overviewPage = function(){$state.go('tab.overview');}
  $scope.reviewSoapPage = function(){$state.go('soap-review');}
  $scope.helpPage = function(){$state.go('help');}
  //edit button to delete specific soap
  $scope.data = {
    showDelete: false
  };
  //$scope.edit = function(soap);
  
  
   $scope.dt = new Date();
    
   
  
 
  
  $scope.genders = ['Male', 'Female', 'Transgender'];
  $scope.severities = [0,1,2,3,4,5,6,7,8,9,10];
  $scope.onsets = ['Sudden', 'Gradual'];
  $scope.qualities = ['Aching', 'Burning', 'Cramping', 'Crushing', 'Dull Pressure', 'Sharp', 'Squeezing', 'Stabbing', 'Tearing', 'Tight', 'Other'];
  $scope.spinals = ['Yes', 'No'];
  $scope.pupils = ['PERRL', 'Not PERRL'];
  $scope.BPtakens = ['Taken', 'Palpated'];
  $scope.BPpulses = ['Present', 'Weak', 'Absent'];
  $scope.SKINmoists = ['Dry', 'Moist', 'Wet'];
  $scope.SKINtemps = ['Warm', 'Cool', 'Hot'];
  $scope.SKINcolors = ['Pink', 'Pale', 'Red'];
  $scope.RESPrythms = ['Regular', 'Irregular'];
  $scope.RESPqualities = ['Easy', 'Shallow', 'Labored'];
  $scope.HEARTqualities = ['Strong', 'Weak', 'Bounding'];
  $scope.HEARTrythms = ['Regular', 'Irregular'];
  $scope.tempDegrees = ['°Fahrenheit', '°Celsius'];
  $scope.LORs = ['Awake & Oriented x 4', 'Awake & Oriented x 3', 'Awake & Oriented x 2', 'Awake & Oriented x 1', 'Awake & Oriented x 0', 'Verbal Stimulus', 'Painful Stimulus', 'Unresponsive'];

  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];

  //SEED DATA, COMMENT OUT AFTER FRONT_END REVIEW
  $scope.soaps = Soaps.all();
  $scope.soap = Soaps.get($stateParams.soapId);
  //$scope.soap.vitals = Vitals.all($stateParams.soapId)
  //$scope.soap.vital = Vitals.get($stateParams.soapId);
  
  
    // Email Share Function
$scope.shareSOAP = function() {
   window.plugin.email.open({
    to:      ['rogers@eyebytesolutions.com'],
    cc:      ['vehr@eyebytesolutions.com'],
    bcc:     [''],
    subject: 'SOAP Note: Test',
    body:    '<h1>Test</h1><p>Data Here</p>',
    isHtml:  true
});
};

// end soap cntrl
})


// coundown controls. 
.controller('VitalCtrl', ['$scope', '$timeout', function($scope, $timeout) {

  $scope.timeValue = 0;
  
  function countdown() {
    $scope.timeValue++;
    $scope.timeout = $timeout(countdown, 1000);
  };
  
  $scope.start = function() {
    countdown();
    $scope.play = true;
    $scope.pause = false;
  };
  
  $scope.stop = function() {
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  };
  
  $scope.reset = function() {
	$scope.timeValue = 0;
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
   
  };
}]);







