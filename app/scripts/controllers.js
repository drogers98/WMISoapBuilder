'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce'])

.controller('WMICtrl', function($scope,$state) {

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


.controller('SoapCtrl', function($scope, $state, $stateParams, Soaps, Responders, $ionicModal, $timeout) {
"use strict";
  /* leave drop commented out unless soap table is being altered */
  Soaps.drop();


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
    Soaps.saveNewSoap(soap,responder,function(err, callback){
      $scope.soap = soap;
      $state.go('tab.overview');
    });
  }

  var timeout = null;
  var debounceSaveUpdates = function(newVal, oldVal) {
    if(newVal != oldVal) {
      if(timeout) {
        $timeout.cancel(timeout)
      }

      var newSoapParamForUpdate = function() {
         $scope.soap.getSoapKeyByValue = function (value) {
          for(var prop in this) {
            if(this.hasOwnProperty(prop)) {
              if( this[ prop ] === value)
                return prop;
            }
          }
        }

        var soapValue = $scope.soap.getSoapKeyByValue(newVal);

        var buildSoapParamObject = function(soapVal,newVal) {
          var updateParams = {};
          updateParams["key"] = soapVal;
          updateParams["val"] = newVal;
          return updateParams;
        }
        return buildSoapParamObject(soapValue, newVal);
      }
      timeout = $timeout($scope.updateSoapParam(newSoapParamForUpdate()), 1000);
      $scope.updateSoapParam(newVal)
    }
  }

  //there has got to be a cleaner way of doing this but time is of the essence
  $scope.$watch('responder.firstName', debounceSaveUpdates);

  $scope.$watch('soap.incidentDate', debounceSaveUpdates);
  $scope.$watch('soap.incidentLocation', debounceSaveUpdates);
  $scope.$watch('soap.incidentLat', debounceSaveUpdates);
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





  $scope.updateSoapParam = function(newParam) {
    Soaps.updateSoap(newParam);
  }


// Geolocation Stuff
$scope.latLng = "Please click the button below, if GPS is available.";
	   $scope.showPosition = function (position) {
            $scope.latLng = position.coords.latitude + ", " + position.coords.longitude;
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
   window.plugin.email.open({
    to:      ['rogers@eyebytesolutions.com'],
    cc:      ['vehr@eyebytesolutions.com'],
    bcc:     [''],
    subject: 'SOAP Note: Test',
    body:    '<h1>Test</h1><p>Data Here</p>',
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



// ang picture test
$scope.myPictures = [];
$scope.$watch('myPicture', function(value) {
   if(value) {
      myPictures.push(value);
   }
}, true);




// Photo capture.

//begin test
var pictureSource; // picture source
var destinationType; // sets the format of returned value

// Wait for PhoneGap to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
pictureSource=navigator.camera.PictureSourceType;
destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
// Get image handle
//
var smallImage = document.getElementById('smallImage');

// Unhide image elements
//
smallImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
smallImage.src = "data:image/jpeg;base64," + imageData;
}
// Called when a photo is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
// Get image handle
console.log(JSON.stringify(imageData));
// Get image handle
//
var smallImage = document.getElementById('smallImage');

// Unhide image elements
//
smallImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
smallImage.src = imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
// Uncomment to view the image file URI
// console.log(imageURI);

// Get image handle
//
var largeImage = document.getElementById('largeImage');

// Unhide image elements
//
largeImage.style.display = 'block';

// Show the captured photo
// The inline CSS rules are used to resize the image
//
largeImage.src = imageURI;
}

function capturePhotoWithFile() {
navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}
// A button will call this function
//
function getPhoto(source) {
// Retrieve image file location from specified source
navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
destinationType: destinationType.FILE_URI,
sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
alert('Failed because: ' + message);
}



})

.controller('SoapDetailCtrl', function($scope, $stateParams, Soaps) {
  $scope.soap;
  Soaps.get($stateParams.soapId, function(err, soap) {
    $scope.soap = soap;
  })
})

// coundown controls.
.controller('VitalCtrl', function($scope, $state, $stateParams, Vitals) {
"use strict";
  //$scope.vitals = Vitals.all();
  $scope.lors = ["one", "two"];

  $scope.saveVital = function(vital) {
    //pass in current soapId

    var attributes = {
      vital: {
        lor: vital.lor,
        rate: vital.rate,
        quality: vital.quality,
        rrhythm: vital.rrhythm,
        rquality: vital.rquality,
        sctmcolor: vital.sctmcolor,
        sctmtemp: vital.sctmtemp,
        sctmmoisture: vital.sctmmoisture,
        brradialpulse: vital.brradialpulse,
        pulils: vital.pulils,
        tempDegrees: vital.tempDegrees
      }
    };
    var vitalData = angular.toJson(attributes);
    Vitals.createNewVital(vitalData);

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
});
