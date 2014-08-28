'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce'])

.controller('WMICtrl', function($scope,$state, Nols) {

})



.controller('FirstResponderCtrl', function($scope, $state, $stateParams, Responders, Soaps) {
  $scope.termsPage = function(){$state.go('terms');};
  $scope.responderSoapsPage = function(){$state.go('soaps');};
  //get ready for JS transfer from beta
  //$scope.responder = Responders.all();
  $scope.trainingLevels = ['WFA','WAFA','WFR', 'WEMT', 'Other'];
  $scope.responder;

  Responders.get(function(err,responders) {
    if(responders !== null){
      $scope.responders = responders;
      $state.go('soaps');
    }else {
      return;
    }
  })

  $scope.newResponder = function(responder) {
    Responders.createResponderTable();
    Responders.saveResponder(responder, function (err, responder){
      if(err) throw err;
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


.controller('SoapCtrl', function($scope, $state, $stateParams, Soaps, Responders, $ionicModal, $timeout,Nols) {
"use strict";
/* leave cutLifeLine commented out unless soap table is being altered
  un comment and run will drop responder,soap and vital table
 */
 //Nols.cutLifeLine();


  Responders.get(function(err,responder) {
    $scope.responder = responder;
  })

  $scope.soaps;
  $scope.soap;

  Soaps.all(function(err, soaps) {
    $scope.soaps = soaps;
  });

  $scope.initiateSoap = function(soap, responder) {
    var soap = {};
    Soaps.createSoapTable();
    Soaps.saveNewSoap(soap,responder,function(err, soap){
      $scope.soap = soap;
      $state.go('tab.overview');
    });
  }

  var timeout = null;

    $scope.updateSoapParam = function() {
      var updateObject = $scope.soap;
      for(var k in updateObject){
        if(updateObject.hasOwnProperty(k)){
          Soaps.updateSoap(k,updateObject[k])
        }
      }
    }


  var debounceSaveUpdates = function(newVal, oldVal) {
    if(newVal != oldVal) {
      if(timeout) {
        $timeout.cancel(timeout)
      }
    timeout = $timeout($scope.updateSoapParam(), 1000);
    }
  };

  //there has got to be a cleaner way of doing this but time is of the essence


  $scope.$watch('soap.incidentDate', debounceSaveUpdates);
  $scope.$watch('soap.incidentLocation', debounceSaveUpdates);
  $scope.$watch('soap.incidentLat', debounceSaveUpdates);
  $scope.$watch('soap.incidentLon', debounceSaveUpdates);
  $scope.$watch('soap.incidentLon', debounceSaveUpdates);
  $scope.$watch('soap.patientInitials', debounceSaveUpdates);
  $scope.$watch('soap.patientGender', debounceSaveUpdates);
  $scope.$watch('soap.patientDob', debounceSaveUpdates);
  $scope.$watch('soap.patientAge', debounceSaveUpdates);
  $scope.$watch('soap.patientLOR', debounceSaveUpdates);
  $scope.$watch('soap.patientComplaint', debounceSaveUpdates);
  $scope.$watch('soap.patientOnset', debounceSaveUpdates);
  $scope.$watch('soap.patientPPalliates', debounceSaveUpdates);
  $scope.$watch('soap.patientQuality', debounceSaveUpdates);
  $scope.$watch('soap.patientRadiates', debounceSaveUpdates);
  $scope.$watch('soap.patientSeverity', debounceSaveUpdates);
  $scope.$watch('soap.patientTime', debounceSaveUpdates);
  $scope.$watch('soap.patientHPI', debounceSaveUpdates);
  $scope.$watch('soap.patientSpinal', debounceSaveUpdates);
  $scope.$watch('soap.patientFound', debounceSaveUpdates);
  $scope.$watch('soap.patientExamReveals', debounceSaveUpdates);
  $scope.$watch('soap.patientSymptoms', debounceSaveUpdates);
  $scope.$watch('soap.patientAllergies', debounceSaveUpdates);
  $scope.$watch('soap.patientMedications', debounceSaveUpdates);
  $scope.$watch('soap.patientMedicalHistory', debounceSaveUpdates);
  $scope.$watch('soap.patientLastIntake', debounceSaveUpdates);
  $scope.$watch('soap.patientEventsForCause', debounceSaveUpdates);
  $scope.$watch('soap.patientAssessment', debounceSaveUpdates);
  $scope.$watch('soap.patientPlan', debounceSaveUpdates);
  $scope.$watch('soap.patientAnticipatedProblems', debounceSaveUpdates);



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
  $scope.reviewSoapPage = function(){$state.go('soap-review');}


  //edit button to delete specific soap
  $scope.data = {
    showDelete: false
  };
  //$scope.edit = function(soap);


  //$scope.dt = new Date();
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
  //$scope.soaps = Soaps.all();
  //$scope.soap = Soaps.get($stateParams.soapId);
  //$scope.soap.vitals = Vitals.all($stateParams.soapId)
  //$scope.soap.vital = Vitals.get($stateParams.soapId);


// Email Share Function
$scope.shareSOAP = function() {

// add hooks for soap id in order for vitals?

var htmlbody = '<h2>Location</h2>'+
'<strong>Date of Incident</strong>: ' + $scope.soap.incidentDate + '<br/>' +
'<strong>Location</strong>: ' + $scope.soap.incidentLocation + '<br/>' +
'<strong>Coordinates</strong>: ' + $scope.soap.incidentLat + ', ' + $scope.soap.incidentLon + '<br/>' +
'<strong>Responder</strong>: ' + $scope.soap.responderFirstName + ' ' + $scope.soap.responderLastName + ', ' + $scope.soap.responderTrainingLevel + '<br/>' +
'<h2>Subjective</h2>'+
'<strong>Initials</strong>: ' + $scope.soap.patientInitials + '<br/>' +
'<strong>DOB</strong>: ' + $scope.soap.patientDob + '<br/>' +
'<strong>Age</strong>: ' + $scope.soap.patientAge + '<br/>' +
'<strong>Sex</strong>: ' + $scope.soap.patientGender + '<br/>' +
'<h3>Chief Complaint</h3>'+
'<p>' + $scope.soap.patientComplaint + '</p>' +
'<strong>Onset</strong>: ' + $scope.soap.patientOnset + '<br/>' +
'<strong>Provokes/Palliates</strong>: ' + $scope.soap.patientPPalliates + '<br/>' +
'<strong>Quality</strong>: ' + $scope.soap.patientQuality + '<br/>' +
'<strong>Radiation/Region/Referred</strong>: ' + $scope.soap.patientRadiates + '<br/>' +
'<strong>Severity</strong>: ' + $scope.soap.patientSeverity + ' out of 10<br/>' +
'<strong>Time of Onset</strong>: ' + $scope.soap.patientTime + '<br/>' +
'<h3>MOI/HPI</h3>'+
'<p>' + $scope.soap.patientHPI + '</p>' +
'<strong>Suspected Spinal MOI</strong>: ' + $scope.soap.patientSpinal + '<br/>' +
'<h2>Objective</h2>'+
'<h3>General</h3>'+
'<strong>Patient Position When Found</strong>: ' + $scope.soap.patientFound + '<br/>' +
'<strong>Patient Exam</strong>: ' + $scope.soap.patientExamReveals + '<br/>' +
'<h3>Vital Signs</h3>'+
'<p>Vital Signs table to go here</p>'+
'<h3>Patient History</h3>'+
'<strong>Symptoms</strong>: ' + $scope.soap.patientSymptoms + '<br/>' +
'<strong>Allergies</strong>: ' + $scope.soap.patientAllergies + '<br/>' +
'<strong>Medications</strong>: ' + $scope.soap.patientMedications + '<br/>' +
'<strong>Pertinent Medical History</strong>: ' + $scope.soap.patientMedicalHistory + '<br/>' +
'<strong>Last Intake/Output</strong>: ' + $scope.soap.patientLastIntake + '<br/>' +
'<strong>Events Leading up to Injury/Illness</strong>: ' + $scope.soap.patientEventsForCause + '<br/>' +
'<h2>Assessment</h2>'+
'<p>' + $scope.soap.patientAssessment + '</p>' +
'<h2>Plan</h2>'+
'<p>' + $scope.soap.patientPlan + '</p>' +
'<strong>Anticipated Problems</strong>: ' + $scope.soap.patientAnticipatedProblems + '<br/>';

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

    $scope.openModal = function(index) {
      if(index == 1) $scope.oModal1.show();
      if(index == 2) $scope.oModal2.show();
      if(index == 3) $scope.oModal3.show();
      if(index == 4) $scope.oModal4.show();

    };

    $scope.closeModal = function(index) {
      if(index == 1) $scope.oModal1.hide();
      if(index == 2) $scope.oModal2.hide();
      if(index == 3) $scope.oModal3.hide();
      if(index == 4) $scope.oModal4.hide();

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
    });
// end modals






})

.controller('SoapDetailCtrl', function($scope, $stateParams, Soaps) {
  //$scope.soap;
  Soaps.get($stateParams.soapId, function(err, soapDetail) {
    $scope.soapDetail = soapDetail;
    console.log(soapDetail);
  })
})

// coundown controls.
.controller('VitalCtrl', function($scope, $state, $stateParams, $timeout, Vitals, Soaps) {
"use strict";

  $scope.vitals;
  $scope.vital;

  Vitals.all(function(err,vitals,recentSoapVitals){
    $scope.vitals = vitals;
    $scope.recentSoapVitals = recentSoapVitals;
    console.log(recentSoapVitals);
  })

  $scope.soap;
  Soaps.getLast(function(err,soap){
    $scope.soap = soap;
  })

  $scope.initiateVital = function(vital,soap) {
    var vital = {};
    Vitals.createVitalTable();
      Vitals.saveNewVital(vital,soap,function(err,vital){
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
  $scope.$watch('vital.lor', debounceSaveUpdates);
  $scope.$watch('vital.rate', debounceSaveUpdates);
  $scope.$watch('vital.heartRythm', debounceSaveUpdates);
  $scope.$watch('vital.heartQuality', debounceSaveUpdates);
  $scope.$watch('vital.respRate', debounceSaveUpdates);
  $scope.$watch('vital.restRhythm', debounceSaveUpdates);
  $scope.$watch('vital.restQuality', debounceSaveUpdates);
  $scope.$watch('vital.sctmcolor', debounceSaveUpdates);
  $scope.$watch('vital.sctmtemp', debounceSaveUpdates);
  $scope.$watch('vital.sctmmoisture', debounceSaveUpdates);
  $scope.$watch('vital.brradialpulse', debounceSaveUpdates);
  $scope.$watch('vital.brradialtaken', debounceSaveUpdates);
  $scope.$watch('vital.pupils', debounceSaveUpdates);
  $scope.$watch('vital.tempDegrees', debounceSaveUpdates);

  $scope.updateVitalParam = function(newParam) {
    Vitals.updateVital(newParam);
  }

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

.controller('VitalDetailCtrl', function($scope, $stateParams, Vitals) {
  $scope.vital;
  Vitals.get($stateParams.vitalId, function(err, vital) {
    $scope.vital = vital;
  })
});
