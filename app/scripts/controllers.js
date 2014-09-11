'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce'])

.controller('WMICtrl', function($scope,$state, Nols) {

})

.controller('FirstResponderCtrl', function($scope, $state, $location,
                                           $stateParams, $timeout,
                                           Responders, Soaps, Nols) {
  //Nols.cutLifeLine();
  $scope.termsPage = function(){$state.go('terms');};
  $scope.responderSoapsPage = function(){$state.go('soaps');};
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();


  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];
  $scope.responders;
  $scope.responder;
  $scope.$location = $location;

  Responders.get(function(err,responder) {
    if(responder !== null){
      $scope.responder = responder;
      if($location.path() === '/') {
        $state.go('soaps');
      }
    }else {
      return;
    }
  })

  var timeout = null;
  var updateResponderWatch = function(newVal, oldVal) {
    if(newVal !== oldVal) {
      //console.log(JSON.stringify($scope.responder));
      //Todo figure out best option below
      //update entire object or individ field - which sounds good but could have performance issues..
      Responders.updateResponder($scope.responder);
    }
  }

  if($location.path() === '/settings') {
    $scope.$watch('responder.firstName', updateResponderWatch);
    $scope.$watch('responder.lastName', updateResponderWatch);
    $scope.$watch('responder.trainingLevel', updateResponderWatch);
  }

  $scope.initiateResponder = function(responder) {
    Responders.createResponderTable();
    Responders.saveResponder(responder, function (err, responder){
        $scope.responder = responder;
    });
    $state.go('soaps');
  };

})

// Controller for slide menu. could prolly be reworked a bit. DR
.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate) {
$scope.toggleSideMenu = function() {
            $ionicSideMenuDelegate.toggleRight();
        };
})


.controller('SoapCtrl', function($scope, $state, $stateParams, $ionicPopup,
                                 $ionicModal, $timeout, $location,
                                 Soaps, Responders, Nols ) {
"use strict";
/* leave cutLifeLine commented out unless soap table is being altered
  un comment and run will drop responder,soap and vital table
 */
 //Nols.cutLifeLine();
 $scope.$location = $location;
 $scope.soap;
 $scope.soaps;

  Responders.get(function(err,responder) {
    $scope.responder = responder;
  })

  Soaps.all(function(err, soaps) {
    $scope.soaps = soaps;
  });

$scope.initiateSoap = function(soap, responder) {
    var soap = {};
    Soaps.createSoapTable();
    Soaps.saveNewSoap(soap,responder,function(err, soap){
      $scope.soap = soap;
    });
    $state.go('tab.overview');
  }


  var updateSoapWatch = function(newVal, oldVal) {
    if(newVal !== oldVal) {
      Soaps.updateSoap($scope.soap);
    }
  }

  var scopePath = $scope.$location.path(),
      overview = '/tab/overview',
      subjective = '/tab/subjective',
      objective = '/tab/objective',
      soapRoutes = [overview,subjective,objective];

  function soapRouteConverter(route) {
    var soapRoute = {};
    for(var i=0;i<route.length;i++){
      soapRoute[route[i]]='';
    }
    return soapRoute;
  }

  if(scopePath in soapRouteConverter([overview,subjective,objective])) {
    Soaps.getLast(function(err,soap){
      $scope.soap = soap;
    })

    $scope.$watch('soap.responderFirstName', updateSoapWatch);
    $scope.$watch('soap.responderLastName', updateSoapWatch);
    $scope.$watch('soap.incidentDate', updateSoapWatch);
    $scope.$watch('soap.incidentLocation', updateSoapWatch);
    $scope.$watch('soap.incidentLat', updateSoapWatch);
    $scope.$watch('soap.incidentLon', updateSoapWatch);
    $scope.$watch('soap.incidentLon', updateSoapWatch);
    $scope.$watch('soap.patientInitials', updateSoapWatch);
    $scope.$watch('soap.patientGender', updateSoapWatch);
    $scope.$watch('soap.patientDob', updateSoapWatch);
    $scope.$watch('soap.patientAge', updateSoapWatch);
    $scope.$watch('soap.patientLOR', updateSoapWatch);
    $scope.$watch('soap.patientComplaint', updateSoapWatch);
    $scope.$watch('soap.patientOnset', updateSoapWatch);
    $scope.$watch('soap.patientPPalliates', updateSoapWatch);
    $scope.$watch('soap.patientQuality', updateSoapWatch);
    $scope.$watch('soap.patientRadiates', updateSoapWatch);
    $scope.$watch('soap.patientSeverity', updateSoapWatch);
    $scope.$watch('soap.patientTime', updateSoapWatch);
    $scope.$watch('soap.patientHPI', updateSoapWatch);
    $scope.$watch('soap.patientSpinal', updateSoapWatch);
    $scope.$watch('soap.patientFound', updateSoapWatch);
    $scope.$watch('soap.patientExamReveals', updateSoapWatch);
    $scope.$watch('soap.patientSymptoms', updateSoapWatch);
    $scope.$watch('soap.patientAllergies', updateSoapWatch);
    $scope.$watch('soap.patientMedications', updateSoapWatch);
    $scope.$watch('soap.patientMedicalHistory', updateSoapWatch);
    $scope.$watch('soap.patientLastIntake', updateSoapWatch);
    $scope.$watch('soap.patientEventsForCause', updateSoapWatch);
    $scope.$watch('soap.patientAssessment', updateSoapWatch);
    $scope.$watch('soap.patientPlan', updateSoapWatch);
    $scope.$watch('soap.patientAnticipatedProblems', updateSoapWatch);
  }
// Age calculation based on DOB
        $scope.findAge = function (date) {
        var birthDay = $scope.soap.patientDob,
            DOB = new Date(birthDay),
            today = new Date(),
            age = today.getTime() - DOB.getTime();
        age = Math.floor(age / (1000 * 60 * 60 * 24 * 365.25));
        $scope.soap.patientAge = age;
        }


        $scope.moveItem = function(soap,fromIndex,toIndex){
          $scope.soaps.splice(fromIndex, 1);
          $scope.soaps.splice(toIndex, 0, item);
        };

        $scope.onItemDelete = function(soapId) {
          Soaps.deleteSoap(soapId);
          $scope.soaps.splice($scope.soaps.indexOf(soapId), 1)
        }

        $scope.data = {
          showDelete: false
        };


// Geolocation Stuff

	   $scope.showPosition = function (position) {
            $scope.soap.incidentLat = position.coords.latitude;
            $scope.soap.incidentLon = position.coords.longitude;
            $scope.$apply();
        }

        // Change btn text if geo unavailable to device
         if (navigator.geolocation) {

           }
            else {
               document.getElementById('GeoLocationBtnInner').innerHTML = "GPS Unavailable";
			   document.getElementById("coordsBtn").className = "";
			   document.getElementById("coordsBtn").className = "button button-block button-calm margin";
            }



        $scope.getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.showPosition);
                document.getElementById('GeoLocationBtnInner').innerHTML = "Reset Coordinates";
				document.getElementById("coordsBtn").className = "";
				document.getElementById("coordsBtn").className = "button button-block button-calm margin";
            }
            else {
               alert('Sorry, this feature currently unavailable')
            }
        }
 // end geo stuff



  // Auto expand text boxes vertically
  $scope.expandText = function(obj){
	var valueID = obj.target.attributes.id.value;
	var element = document.getElementById(valueID);
	element.style.height =  element.scrollHeight + "px";}
  // end auto expand

  $scope.settingsPage = function() {$state.go('settings');}
  $scope.aboutPage = function(){$state.go('about');}
  $scope.mySoapsPage = function(){$state.go('soaps');}
  $scope.subjectivePage = function(){$state.go('tab.subjective');}
  $scope.objectivePage = function(){$state.go('tab.objective');}
  $scope.apPage = function(){$state.go('tab.ap');}
  $scope.imagePage = function(){$state.go('tab.image');}
  $scope.overviewPage = function(){
  $state.go('tab.overview');}
  $scope.goReview= function(){$state.go('tab.review');}



  //$scope.dt = new Date();
  $scope.genders = [
  			{name:'Male', value:'M'},
  			{name:'Female', value:'F'},
  			{name:'Transgender', value:'T'}
  		];
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
  $scope.tempDegrees = [
  			{name:'°Fahrenheit', value:'°F'},
  			{name:'°Celsius', value:'°C'}
  		];
  $scope.LORs = [
  			{name:'Awake & Oriented x 4', value:'AOx4'},
  			{name:'Awake & Oriented x 3', value:'AOx3'},
  			{name:'Awake & Oriented x 2', value:'AOx2'},
  			{name:'Awake & Oriented x 1', value:'AOx1'},
  			{name:'Awake & Oriented x 0', value:'AOxO'},
  			{name:'Verbal Stimulus', value:'V'},
  			{name:'Painful Stimulus', value:'P'},
  			{name:'Unresponsive', value:'U'}
  		];

  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];

  //SEED DATA, COMMENT OUT AFTER FRONT_END REVIEW
  //$scope.soaps = Soaps.all();
  //$scope.soap = Soaps.get($stateParams.soapId);
  //$scope.soap.vitals = Vitals.all($stateParams.soapId)
  //$scope.soap.vital = Vitals.get($stateParams.soapId);


// Email Share Function
$scope.shareSOAP = function(soap) {

// add hooks for soap id in order for vitals?
  /* come back and address
  console.log(typeof recentSoapVitals);
  var vitalLoop = function() {
    for(var i=0;i < soapVitals.length;i++){
      var vitals = [];
      vitals.push(soapVitals[i].created)
    }
    return vitals;
  }*/

var htmlbody = '<h2>Location</h2>'+
'<strong>Date of Incident</strong>: ' + soap.incidentDate + '<br/>' +
'<strong>Location</strong>: ' + soap.incidentLocation + '<br/>' +
'<strong>Coordinates</strong>: ' + soap.incidentLat + ', ' + soap.incidentLon + '<br/>' +
'<strong>Responder</strong>: ' + soap.responderFirstName + ' ' + soap.responderLastName + ', ' + soap.responderTrainingLevel + '<br/>' +
'<h2>Subjective</h2>'+
'<strong>Initials</strong>: ' + soap.patientInitials + '<br/>' +
'<strong>DOB</strong>: ' + soap.patientDob + '<br/>' +
'<strong>Age</strong>: ' + soap.patientAge + '<br/>' +
'<strong>Sex</strong>: ' + soap.patientGender + '<br/>' +
'<h3>Chief Complaint</h3>'+
'<p>' + soap.patientComplaint + '</p>' +
'<strong>Onset</strong>: ' + soap.patientOnset + '<br/>' +
'<strong>Provokes/Palliates</strong>: ' + soap.patientPPalliates + '<br/>' +
'<strong>Quality</strong>: ' + soap.patientQuality + '<br/>' +
'<strong>Radiation/Region/Referred</strong>: ' + soap.patientRadiates + '<br/>' +
'<strong>Severity</strong>: ' + soap.patientSeverity + ' out of 10<br/>' +
'<strong>Time of Onset</strong>: ' + soap.patientTime + '<br/>' +
'<h3>MOI/HPI</h3>'+
'<p>' + soap.patientHPI + '</p>' +
'<strong>Suspected Spinal MOI</strong>: ' + soap.patientSpinal + '<br/>' +
'<h2>Objective</h2>'+
'<h3>General</h3>'+
'<strong>Patient Position When Found</strong>: ' + soap.patientFound + '<br/>' +
'<strong>Patient Exam</strong>: ' + soap.patientExamReveals + '<br/>' +
'<h3>Vital Signs</h3>'+
'<p>Vital Signs coming soon</p>'+
'<h3>Patient History</h3>'+
'<strong>Symptoms</strong>: ' + soap.patientSymptoms + '<br/>' +
'<strong>Allergies</strong>: ' + soap.patientAllergies + '<br/>' +
'<strong>Medications</strong>: ' + soap.patientMedications + '<br/>' +
'<strong>Pertinent Medical History</strong>: ' + soap.patientMedicalHistory + '<br/>' +
'<strong>Last Intake/Output</strong>: ' + soap.patientLastIntake + '<br/>' +
'<strong>Events Leading up to Injury/Illness</strong>: ' + soap.patientEventsForCause + '<br/>' +
'<h2>Assessment</h2>'+
'<p>' + soap.patientAssessment + '</p>' +
'<h2>Plan</h2>'+
'<p>' + soap.patientPlan + '</p>' +
'<strong>Anticipated Problems</strong>: ' + soap.patientAnticipatedProblems + '<br/>';

   window.plugin.email.open({
    to:      ['rogers@eyebytesolutions.com'],
    cc:      ['vehr@eyebytesolutions.com'],
    bcc:     [''],
    subject: 'SOAP Note: Test',
    body:    htmlbody,
    isHtml:  true
});
};
// end email



//modals. DRY up, and seperate templates later.
 // Modal 1
    $ionicModal.fromTemplateUrl('modal-1.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal1 = modal;
    });

    // Modal 2
    $ionicModal.fromTemplateUrl('modal-2.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
    });

        // Modal 3
    $ionicModal.fromTemplateUrl('modal-3.html', {
      id: '3', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal3 = modal;
    });

            // Modal 4
    $ionicModal.fromTemplateUrl('modal-4.html', {
      id: '4', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal4 = modal;
    });

                // Modal 5
    $ionicModal.fromTemplateUrl('modal-5.html', {
      id: '5', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal5 = modal;
    });

    $scope.openModal = function(index) {
      if(index == 1) $scope.oModal1.show();
      if(index == 2) $scope.oModal2.show();
      if(index == 3) $scope.oModal3.show();
      if(index == 4) $scope.oModal4.show();
      if(index == 5) $scope.oModal5.show();

    };

    $scope.closeModal = function(index) {
      if(index == 1) $scope.oModal1.hide();
      if(index == 2) $scope.oModal2.hide();
      if(index == 3) $scope.oModal3.hide();
      if(index == 4) $scope.oModal4.hide();
      if(index == 5) $scope.oModal5.hide();

    };
    /* Listen for broadcasted messages */

    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' is shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' is hidden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope
    // and removing the scope from its parent.
    $scope.$on('$destroy', function() {
      console.log('Destroying modals...');
      $scope.oModal1.remove();
      $scope.oModal2.remove();
      $scope.oModal3.remove();
      $scope.oModal4.remove();
      $scope.oModal5.remove();
    });
// end modals

})

.controller('SoapDetailCtrl', function($scope,$state, $stateParams,$location, Soaps) {
  //$scope.soap;
  Soaps.get($stateParams.soapId, function(err, soapDetail) {
    $scope.soapDetail = soapDetail;
  })
  $scope.$location = $location;
  $scope.$state = $state;
  var editWatch = function(newVal, oldVal) {
    if(newVal !== oldVal) {
      //console.log(JSON.stringify($scope.responder));
      //Todo figure out best option below
      //update entire object or individ field - which sounds good but could have performance issues..
      Soaps.updateEditSoap($scope.soapDetail);
    }
  }

  if($state.includes('soap-edit')){
    $scope.$watch('soapDetail.responderFirstName', editWatch);
    $scope.$watch('soapDetail.responderLastName', editWatch);
    $scope.$watch('soapDetail.incidentDate', editWatch);
    $scope.$watch('soapDetail.incidentLocation', editWatch);
    $scope.$watch('soapDetail.incidentLat', editWatch);
    $scope.$watch('soapDetail.incidentLon', editWatch);
    $scope.$watch('soapDetail.incidentLon', editWatch);
    }
    if($state.includes('soap-edit-sub')){
    $scope.$watch('soapDetail.patientInitials', editWatch);
    $scope.$watch('soapDetail.patientGender', editWatch);
    $scope.$watch('soapDetail.patientDob', editWatch);
    $scope.$watch('soapDetail.patientAge', editWatch);
    $scope.$watch('soapDetail.patientLOR', editWatch);
    $scope.$watch('soapDetail.patientComplaint', editWatch);
    $scope.$watch('soapDetail.patientOnset', editWatch);
    $scope.$watch('soapDetail.patientPPalliates', editWatch);
    $scope.$watch('soapDetail.patientQuality', editWatch);
    $scope.$watch('soapDetail.patientRadiates', editWatch);
    $scope.$watch('soapDetail.patientSeverity', editWatch);
    $scope.$watch('soapDetail.patientTime', editWatch);
    $scope.$watch('soapDetail.patientHPI', editWatch);
    $scope.$watch('soapDetail.patientSpinal', editWatch);
    }
    if($state.includes('soap-edit-obj')){
    $scope.$watch('soapDetail.patientFound', editWatch);
    $scope.$watch('soapDetail.patientExamReveals', editWatch);
    $scope.$watch('soapDetail.patientSymptoms', editWatch);
    $scope.$watch('soapDetail.patientAllergies', editWatch);
    $scope.$watch('soapDetail.patientMedications', editWatch);
    $scope.$watch('soapDetail.patientMedicalHistory', editWatch);
    $scope.$watch('soapDetail.patientLastIntake', editWatch);
    $scope.$watch('soapDetail.patientEventsForCause', editWatch);
    }
    if($state.includes('soap-edit-ap')){
    $scope.$watch('soapDetail.patientAssessment', editWatch);
    $scope.$watch('soapDetail.patientPlan', editWatch);
    $scope.$watch('soapDetail.patientAnticipatedProblems', editWatch);
    }
  $scope.genders = [
        {name:'Male', value:'M'},
        {name:'Female', value:'F'},
        {name:'Transgender', value:'T'}
      ];
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
  $scope.tempDegrees = [
        {name:'°Fahrenheit', value:'°F'},
        {name:'°Celsius', value:'°C'}
      ];
  $scope.LORs = [
        {name:'Awake & Oriented x 4', value:'AOx4'},
        {name:'Awake & Oriented x 3', value:'AOx3'},
        {name:'Awake & Oriented x 2', value:'AOx2'},
        {name:'Awake & Oriented x 1', value:'AOx1'},
        {name:'Awake & Oriented x 0', value:'AOxO'},
        {name:'Verbal Stimulus', value:'V'},
        {name:'Painful Stimulus', value:'P'},
        {name:'Unresponsive', value:'U'}
      ];

  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];
})

// coundown controls.
.controller('VitalCtrl', function($scope, $state, $stateParams, $timeout, Vitals, Soaps) {
"use strict";

  $scope.vitals;
  $scope.vital;

  $scope.soap;
  Soaps.getLast(function(err,soap){
    $scope.soap = soap;
    Vitals.all(soap.id,function(err,vitals,recentSoapVitals){
      $scope.vitals = vitals;
      $scope.recentSoapVitals = recentSoapVitals;
    })
  })

/*
  Vitals.all($scope.soap,function(err,vitals,recentSoapVitals){
    $scope.vitals = vitals;
    $scope.recentSoapVitals = recentSoapVitals;
    console.log(recentSoapVitals);
  })
*/
  $scope.initiateVital = function(vital,soap) {
    var vital = {};
    Vitals.createVitalTable();
      Vitals.saveNewVital(vital,soap.id,function(err,vital){
        $scope.vital = vital;
        $state.go('tab.newvital');
      })
  }

  var timeout = null;
  var debounceSaveUpdates = function(newVal, oldVal) {
    if(newVal != oldVal) {
      if(timeout) {
        $timeout.cancel(timeout)
      }

      var newVitalParamForUpdate = function() {
         $scope.vital.getVitalKeyByValue = function (value) {
          for(var prop in this) {
            if(this.hasOwnProperty(prop)) {
              if( this[ prop ] === value)
                return prop;
            }
          }
        }

        var vitalValue = $scope.vital.getVitalKeyByValue(newVal);

        var buildVitalParamObject = function(vitalVal,newVal) {
          var updateParams = {};
          updateParams["key"] = vitalVal;
          updateParams["val"] = newVal;
          return updateParams;
        }
        return buildVitalParamObject(vitalValue, newVal);
      }
      timeout = $timeout($scope.updateVitalParam(newVitalParamForUpdate()), 1000);
      $scope.updateVitalParam(newVal)
    }
  }

  $scope.$watch('vital.timeTaken', debounceSaveUpdates);
  $scope.$watch('vital.lor', debounceSaveUpdates);
  $scope.$watch('vital.rate', debounceSaveUpdates);
  $scope.$watch('vital.heartRythm', debounceSaveUpdates);
  $scope.$watch('vital.heartQuality', debounceSaveUpdates);
  $scope.$watch('vital.respRate', debounceSaveUpdates);
  $scope.$watch('vital.respRhythm', debounceSaveUpdates);
  $scope.$watch('vital.respQuality', debounceSaveUpdates);
  $scope.$watch('vital.sctmcolor', debounceSaveUpdates);
  $scope.$watch('vital.sctmtemp', debounceSaveUpdates);
  $scope.$watch('vital.sctmmoisture', debounceSaveUpdates);
  $scope.$watch('vital.brradialpulse', debounceSaveUpdates);
  $scope.$watch('vital.brsystolic', debounceSaveUpdates);
  $scope.$watch('vital.brradialtaken', debounceSaveUpdates);
  $scope.$watch('vital.brradialReading', debounceSaveUpdates);
  $scope.$watch('vital.pupils', debounceSaveUpdates);
  $scope.$watch('vital.tempDegreesReading', debounceSaveUpdates);
  $scope.$watch('vital.tempDegrees', debounceSaveUpdates);


  $scope.updateVitalParam = function(newParam) {
    Vitals.updateVital(newParam);
  }
  $scope.moveItem = function(vital,fromIndex,toIndex){
    $scope.vitals.splice(fromIndex, 1);
    $scope.vitals.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(vitalId) {
    Vitals.deleteVital(vitalId);
    $scope.vitals.splice($scope.vitals.indexOf(vitalId), 1)
  }

  $scope.data = {
    showDelete: false
  };

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
})

.controller('VitalDetailCtrl', function($scope, $state, $stateParams, Vitals) {
  $scope.vitalDetail;
  Vitals.get($stateParams.vitalId, function(err, vitalDetail) {
    $scope.vitalDetail = vitalDetail;
    $state.reload();
  })
})


.controller('CameraCtrl', function($scope, $state, Camera) {
  $scope.imgs;
  $scope.img;
  $scope.pictureSource;
  $scope.destinationType;

  Camera.all(function(err,imgs){
    $scope.imgs = imgs;
  })

  $scope.takeNewImg = function() {
    /*navigator.camera.getPicture(function(result){
      console.log(result);
    });*/
    Camera.getNewImg(function(err,imgAttr){
    //console.log(imgAttr);
      if(imgAttr !== null){
        $scope.saveImg(imgAttr);
      }
    })
  }

  $scope.saveImg = function(imgAttr) {
    Camera.saveNewImg(imgAttr,function(err,imgURI){
      $scope.img = imgURI;
    })
  }
    /*navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
    destinationType: destinationType.FILE_URI,
    sourceType: source });*/
  //if('device fig this out'){
  //  $scope.pictureSource = navigator.camera.PictureSourceType;
  //  $scope.destinationType = navigator.camera.DestinationType;
  //}

  function onPhotoDataSuccess(imageData){
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = "data:image/jpeg;base64," + imageData;
  }

  function onPhotoFileSuccess(imageData) {
    console.log(JSON.stringify(imageData));
    var smallImage = document.getElementById('smallImage');
    var smallImageText = document.getElementById('smallImageText');
    smallImage.style.display = 'block';
    smallImageText.style.display = 'block';
    //smallImage.src = imageData;
    $scope.image = imageURI;
  }

  function onPhotoURISuccess(imageURI){
    var largeImage = document.getElementById('largeImage');
    var largeImageText = document.getElementById('largeImageText');
    largeImage.style.display = 'block';
    largeImageText.style.display = 'block';
    //largeImage.src = imageURI;
    $scope.img = imageURI;
  }

  $scope.capturePhotoWithFile = function() {
    /*navigator.camera.getPicture(
      onPhotoFileSuccess,
      onFail,
      { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI }
      );*/
  }


  function onFail(message){
    alert('Failed because' + message)
  }

  //pictureSource.PHOTOLIBRARY

})
