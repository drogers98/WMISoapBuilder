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

  $scope.initiateResponder = function(responder) {
    Responders.createResponderTable();
    Responders.saveResponder(responder, function (err, responder){
        $scope.responder = responder;
    });
    $state.go('soaps');
  };

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

})

// Controller for slide menu. could prolly be reworked a bit. DR
.controller('MenuCtrl', function($scope, $ionicSideMenuDelegate) {
$scope.toggleSideMenu = function() {
            $ionicSideMenuDelegate.toggleRight();
        };
})


.controller('SoapCtrl', function($scope, $state, $stateParams, $ionicPopup,
                                 $ionicModal, $timeout, $location,
                                 Soaps, Responders, Nols,Vitals ) {
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
      soapEdit = '/soaps/edit/',
      soapRoutes = [overview,subjective,objective,soapEdit];

  function soapRouteConverter(route) {
    var soapRoute = {};
    for(var i=0;i<route.length;i++){
      soapRoute[route[i]]='';
    }
    return soapRoute;
  }

  if(scopePath in soapRouteConverter([overview,subjective,objective,soapEdit])) {
    /*Soaps.getLast(function(err,soap){
      $scope.soap = soap;
      console.log(soap);
    })*/

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
  console.log("called");

  var retrieveVitals = function() {
    Vitals.all(soap.id,function(err,vitals,recentSoapVitals){
      for(var i=0;i<recentSoapVitals.length;i++){
        console.log(recentSoapVitals[i].created);
      }
    })
  }
  retrieveVitals();

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
/*
   window.plugin.email.open({
    to:      ['rogers@eyebytesolutions.com'],
    cc:      ['vehr@eyebytesolutions.com'],
    bcc:     [''],
    subject: 'SOAP Note: Test',
    body:    htmlbody,
    isHtml:  true
});*/
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

.controller('SoapDetailCtrl', function($scope, $state, $stateParams, Soaps, Vitals) {
  //$scope.soap;
  Soaps.get($stateParams.soapId, function(err, soapDetail) {
    $scope.soapDetail = soapDetail;
    Vitals.all(soapDetail.id,function(err,vitals,recentSoapVitals){
      $scope.vitals = vitals;
      $scope.recentSoapVitals = recentSoapVitals;
    })
  })

  $scope.saveSOAPEdits = function(soapEdits) {
    Soaps.updateSoap(soapEdits);
    $state.go('soaps');
  }
})

// coundown controls.
.controller('VitalCtrl', function($scope, $state, $stateParams,
                                  $timeout, $location,
                                  Vitals, Soaps) {
"use strict";

  $scope.vitals;
  $scope.vital;
  $scope.$location = $location;

  $scope.soap;
  Soaps.getLast(function(err,soap){
    var soapId = soap.id;
    Vitals.all(soapId,function(err,vitals,recentSoapVitals){
      $scope.vitals = vitals;
      $scope.recentSoapVitals = recentSoapVitals;
    })
  })


  Vitals.all($scope.soap,function(err,vitals,recentSoapVitals){
    $scope.vitals = vitals;
    $scope.recentSoapVitals = recentSoapVitals;
  })

  $scope.initiateVital = function(vital,soap) {
    var vital = {};
    Vitals.createVitalTable();
      Vitals.saveNewVital(vital,soap.id,function(err,vital){
        $scope.vital = vital;
        $state.go('tab.newvital');
      })
  }

  var timeout = null;
  var updateVitalWatch = function(newVal, oldVal) {
    if(newVal !== oldVal) {
      Vitals.updateVital($scope.vital);
    }
  }

  if($scope.$location.path() === '/tab/vitals/new'){
    $scope.$watch('vital.timeTaken', updateVitalWatch);
    $scope.$watch('vital.lor', updateVitalWatch);
    $scope.$watch('vital.rate', updateVitalWatch);
    $scope.$watch('vital.heartRythm', updateVitalWatch);
    $scope.$watch('vital.heartQuality', updateVitalWatch);
    $scope.$watch('vital.respRate', updateVitalWatch);
    $scope.$watch('vital.respRhythm', updateVitalWatch);
    $scope.$watch('vital.respQuality', updateVitalWatch);
    $scope.$watch('vital.sctmcolor', updateVitalWatch);
    $scope.$watch('vital.sctmtemp', updateVitalWatch);
    $scope.$watch('vital.sctmmoisture', updateVitalWatch);
    $scope.$watch('vital.brradialpulse', updateVitalWatch);
    $scope.$watch('vital.brsystolic', updateVitalWatch);
    $scope.$watch('vital.brradialtaken', updateVitalWatch);
    $scope.$watch('vital.brradialReading', updateVitalWatch);
    $scope.$watch('vital.pupils', updateVitalWatch);
    $scope.$watch('vital.tempDegreesReading', updateVitalWatch);
    $scope.$watch('vital.tempDegrees', updateVitalWatch);
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
