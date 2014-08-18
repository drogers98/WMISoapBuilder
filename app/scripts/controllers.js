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


.controller('SoapCtrl', function($scope, $state, $stateParams, Soaps, $ionicModal) {
"use strict";

  $scope.soaps = Soaps.all();
  $scope.soap = "";
  $scope.soapDetail = function(soapId) {
    $scope.soap = Soaps.get(soapId);

  }

  //WHATS IN HERE IS WHAT WILL BE SAVED...
  $scope.newSoap = function(soap) {
    var attributes = {
      soap: {
        incidentDate: soap.incidentDate,
        incidentLocation: soap.incidentLocation,
        incidentLat: soap.incidentLat,
        incidentLon: soap.incidentLon,
        patientInitials: soap.patientInitials,
        patientGender: soap.patientGender,
        patientFound: soap.patientFound,
        patientAnticipatedProblems: soap.patientAnticipatedProblems
      }
    };
    //below call service methods - todo => implement service methods
    var soapData = angular.toJson(attributes);
    Soaps.createNewSoap(soapData);
    //$scope.soaps.push(soapData);
    //after save link to soaps
  };

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

//end test



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
