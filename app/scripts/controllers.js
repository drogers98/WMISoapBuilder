'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce','ngCordova'])

.controller('MenuCtrl', function($scope,$state,$stateParams,$location, $ionicSideMenuDelegate, Soaps) {
  Soaps.all('mySoaps', function(err,soaps){
    $scope.soaps = soaps;
  })

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
})

.controller('FirstResponderCtrl', function($scope, $state, $location,
                                           $stateParams,$timeout,
                                           Responders, Soaps, Nols,uiState) {
  //Nols.cutLifeLine();
  $scope.mySoaps = function() {$state.go('soaps');}
  $scope.termsPage = function() {$state.go('terms');}

  $scope.trainingLevels = ['WFA','WAFA','WFR','WEMT','OTHER']

  $scope.$location = $location;

  //INTRO LOGIC
  Responders.createResponderTable();
    Responders.all(function(err,responders){
    if(!responders) {
      Responders.saveResponder({},function(err,responder){
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
    Responders.updateResponder('acceptedTerms',responder.id,true);
    $scope.mySoaps();
  };

  $scope.monitorResponderChange = function(responder, responderVal, attrElem) {
    console.log(responderVal)
    var kindElem = attrElem,kindId = responder.id,kindVal = responderVal;
    Responders.updateResponder(kindElem,kindId,kindVal);
  }

})

.controller('SoapCtrl', function($scope, $state, $stateParams,
                                 $ionicModal, $timeout, $location,
                                 Soaps, Responders, Nols,$ionicPopup,$cordovaSocialSharing){
  "use strict";
  Soaps.createSoapTable();

  Responders.get(function(err,responder){
    $scope.responder = responder;
    if(responder){
      if($state.includes('soaps')){
      Soaps.getLast(function(err,lastSoap){
        if(lastSoap === null || lastSoap.starterFlag === 'true'){
          Soaps.saveNewSoap({},{},function(err,starterSoap){
            $scope.starterSoap = starterSoap.id;
          })
        }else {
          $scope.starterSoap = lastSoap.id;
        }
      })
      }
    }
  })

  Soaps.all('mySoaps',function(err,soaps){
    $scope.soaps = soaps.reverse();
    //display only soaps where starter flag === true; handled on factory
  })

  $scope.data = {
    showDelete: false
  };

  $scope.moveItem = function(soap,fromIndex,toIndex){
    $scope.soaps.splice(fromIndex, 1);
    $scope.soaps.splice(toIndex, 0, item);
  };

  $scope.onItemDelete = function(soap) {
    console.log($scope.$location.path());


    var confirmPopup = $ionicPopup.confirm({
       title: soap.incidentDate + ' | ' + soap.patientAge + ' , ' + soap.patientGender + ' , ' + soap.patientInitials,
       template: 'Are you sure you want to delete this SOAP NOTE?',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-calm',
           onTap: function() {
             return;
           }
         },
         {
           text: 'Delete',
           type: 'button-light',
           onTap: function() {
             Soaps.deleteSoap(soap.id);
             $scope.soaps.splice($scope.soaps.indexOf(soap.id), 1)
           }
         }
       ]
     });
    /* confirmPopup.then(function(res) {
       if(res) {
        Soaps.deleteSoap(soap.id);
        $scope.soaps.splice($scope.soaps.indexOf(soap.id), 1)
       } else {
         return;
       }
     });*/
  }

  $scope.cancelSoap = function(soap){
    console.log($scope.$location.path());
    console.log($scope.$location.absUrl());
    console.log(window.location.origin)
    /*
    var confirmPopup = $ionicPopup.confirm({
       title: 'Cancel',
       template: 'Going back will delete this SOAP',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-calm',
           onTap: function() {
             return;
           }
         },
         {
           text: 'Continue',
           type: 'button-light',
           onTap: function() {
             Soaps.deleteSoap(soap.id);
             $state.go('soaps');
           }
         }
       ]
     });*/

  }


  //Nols.cutLifeLine();

    $ionicModal.fromTemplateUrl()

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

     $ionicModal.fromTemplateUrl('modal-6.html', {
       id: '6', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal6 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-7.html', {
       id: '7', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal7 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-8.html', {
       id: '8', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal8 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-9.html', {
       id: '9', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal9 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-10.html', {
       id: '10', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal10 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-11.html', {
       id: '11', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal11 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-12.html', {
       id: '12', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal12 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-13.html', {
       id: '13', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal13 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-14.html', {
       id: '14', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal14 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-15.html', {
       id: '15', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal15 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-16.html', {
       id: '16', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal16 = modal;
     });

     $ionicModal.fromTemplateUrl('modal-17.html', {
       id: '17', // We need to use and ID to identify the modal that is firing the event!
       scope: $scope,
       animation: 'slide-in-up'
     }).then(function(modal) {
       $scope.oModal17 = modal;
     });

     $scope.openModal = function(index) {
       if(index == 1) $scope.oModal1.show();
       if(index == 2) $scope.oModal2.show();
       if(index == 3) $scope.oModal3.show();
       if(index == 4) $scope.oModal4.show();
       if(index == 5) $scope.oModal5.show();
       if(index == 6) $scope.oModal6.show();
       if(index == 7) $scope.oModal7.show();
       if(index == 8) $scope.oModal8.show();
       if(index == 9) $scope.oModal9.show();
       if(index == 10) $scope.oModal10.show();
       if(index == 11) $scope.oModal11.show();
       if(index == 12) $scope.oModal12.show();
       if(index == 13) $scope.oModal13.show();
       if(index == 14) $scope.oModal14.show();
       if(index == 15) $scope.oModal15.show();
       if(index == 16) $scope.oModal16.show();
       if(index == 17) $scope.oModal17.show();


     };

     $scope.closeModal = function(index) {
       if(index == 1) $scope.oModal1.hide();
       if(index == 2) $scope.oModal2.hide();
       if(index == 3) $scope.oModal3.hide();
       if(index == 4) $scope.oModal4.hide();
       if(index == 5) $scope.oModal5.hide();
       if(index == 6) $scope.oModal6.hide();
       if(index == 7) $scope.oModal7.hide();
       if(index == 8) $scope.oModal8.hide();
       if(index == 9) $scope.oModal9.hide();
       if(index == 10) $scope.oModal10.hide();
       if(index == 11) $scope.oModal11.hide();
       if(index == 12) $scope.oModal12.hide();
       if(index == 13) $scope.oModal13.hide();
       if(index == 14) $scope.oModal14.hide();
       if(index == 15) $scope.oModal15.hide();
       if(index == 16) $scope.oModal16.hide();
       if(index == 17) $scope.oModal17.hide();

     };

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
       $scope.oModal6.remove();
       $scope.oModal7.remove();
       $scope.oModal8.remove();
       $scope.oModal9.remove();
       $scope.oModal10.remove();
       $scope.oModal11.remove();
       $scope.oModal12.remove();
       $scope.oModal13.remove();
       $scope.oModal14.remove();
       $scope.oModal15.remove();
       $scope.oModal16.remove();
       $scope.oModal17.remove();
     });
 // end modals

     $scope.shareSOAP = function(soap,soapVitals,soapImages) {

      var imgURIS = function(soapImages){
        var imageURIS = [];
        for(var i=0;i<soapImages.length;i++){
          var uri = soapImages[i].imageURI;
          imageURIS.push(uri);
          //ToDo add captions => put img and caption in an array and cycle
        }
        return imageURIS;
      }

      var runMessage = function(soapVitals) {

        var messagePartI = '<h2>Location</h2>'+
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
        '<h3>Vital Signs</h3>';

        //var messagePartIIA = "<table style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;'>";
        var messagePartIIB = function(soapVitals) {
          var vitalListTime = [],vitalListLor = [],vitalListHR = [],vitalListRR = [],
              vitalListSkin = [],vitalListBP = [],vitalListPupils = [],vitalListTemp = [];
          var filteredVitalsBefore = soapVitals.filter(function(entry){return entry.starterFlag === 'true';});
          var filteredVitals = filteredVitalsBefore.sort(function(a,b){
            return new Date('1970/01/01 ' + a.timeTaken) - new Date('1970/01/01 ' + b.timeTaken);
          })
          for(var key in filteredVitals){
            var tdStyle = "style='width:25%;border:1px solid #EFEFEF;padding:5px'";
            var thStyle = "style='width:25%;border:1px solid #EFEFEF;border-collapse:collapse;padding:5px;text-align:right;padding-right:10px;background-color:#EFEFEF;text-transform:uppercase'";
            var tbStyle = "style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;";
            var emailVitalObj = {};
            vitalListTime.push('<td '+tdStyle+'>'+ filteredVitals[key].timeTaken + '</td>');
            vitalListLor.push('<td '+tdStyle+'>'+ filteredVitals[key].lor + '</td>');
            vitalListHR.push('<td '+tdStyle+'>'+ filteredVitals[key].rate + ' ' + filteredVitals[key].heartRythm + ' ' + filteredVitals[key].heartQuality +'</td>');
            vitalListRR.push('<td '+tdStyle+'>'+ filteredVitals[key].respRate + ' ' + filteredVitals[key].respRhythm + ' ' + filteredVitals[key].respQuality +'</td>');
            vitalListSkin.push('<td '+tdStyle+'>'+ filteredVitals[key].sctmcolor + ' ' + filteredVitals[key].sctmtemp + ' ' + filteredVitals[key].sctmmoisture +'</td>');
            vitalListBP.push('<td '+tdStyle+'>'+ filteredVitals[key].brradialpulse + ' ' + filteredVitals[key].brsystolic+'/'+filteredVitals[key].brradialReading + ' ' + filteredVitals[key].brradialtaken +'</td>');
            vitalListPupils.push('<td '+tdStyle+'>'+ filteredVitals[key].pupils + '</td>');
            vitalListTemp.push('<td '+tdStyle+'>'+ filteredVitals[key].tempDegreesReading + ' ' + filteredVitals[key].tempDegrees+'</td>');
            emailVitalObj['timeTaken'] = vitalListTime.join("");
            emailVitalObj['lor'] = vitalListLor.join("");
            emailVitalObj['hr'] = vitalListHR.join("");
            emailVitalObj['rr'] = vitalListRR.join("");
            emailVitalObj['skin'] = vitalListSkin.join("");
            emailVitalObj['bp'] = vitalListBP.join("");
            emailVitalObj['pupils'] = vitalListPupils.join("");
            emailVitalObj['temp'] = vitalListTemp.join("");

            var message = "<table style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;'>"
                          +'<tr>'+'<th '+thStyle+'>Time</th>'+emailVitalObj.timeTaken+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>Lor</th>'+emailVitalObj.lor+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>HR</th>'+emailVitalObj.hr+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>RR</th>'+emailVitalObj.rr+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>Skin</th>'+emailVitalObj.skin+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>BP</th>'+emailVitalObj.bp+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>Pupils</th>'+emailVitalObj.pupils+'</tr>'
                          +'<tr>'+'<th '+thStyle+'>TEMP</th>'+emailVitalObj.temp+'</tr>'
                          +'</table>';
          }
          return message;
        }


        //'<tr>' + "<th style='width:25%;border:1px solid #EFEFEF;border-collapse:collapse;padding:5px;text-align:right;padding-right:10px;background-color:#EFEFEF;text-transform:uppercase'>"

        var messagePartIII = '<h3>Patient History</h3>'+
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

        var messagePartIVA = '<h3>Image Captions</h3>';
        var messagePartIV = function(soapImages) {
          for(var i=0;i<soapImages.length;i++) {
            var captions = [];
            captions.push('<p>' + soapImages[i].imgCaption + '</p>');
          }
          return captions;
        }


        return messagePartI + messagePartIIB(soapVitals) + messagePartIII + messagePartIVA + messagePartIV(soapImages);
      }


     /*window.plugin.email.open({
        to:      ['rogers@eyebytesolutions.com'],
        cc:      ['vehr@eyebytesolutions.com'],
        bcc:     [''],
        subject: 'Soap Note: ' + soap.incidentDate + '|' + soap.patientAge + ',' + soap.patientGender + '|' + soap.patientInitials,
        attachments: imgURIS(soapImages),
        body:    runMessage(soapVitals),
        isHtml:  true
     });*/

     var soapSubject = 'Soap Note' + soap.incidentDate + ' | ' + soap.patientAge + ', ' + soap.patientGender + ' | ' + soap.patientInitials,
         goTo = ['rogers@eyebyteSolutions.com'],bccArr = [];


    Soaps.sendEmail(runMessage(soapVitals),soapSubject,goTo,bccArr,imgURIS(soapImages),function(soapEmailSuccess){
        var confirmPopup = $ionicPopup.confirm({
          template: "Where would you like to go?",
          buttons: [
            {
              text: 'Stay on Review',
              type: 'button-calm',
              onTap: function() {
                return;
              }
            },
            {
              text: 'MySOAPS',
              type: 'button-light',
              onTap: function(){
                $state.go('soaps');
              }
            }
          ]
        })
     })
 }



})

//SOAP OVERVIEW TAB
.controller('SoapOverviewCtrl', function($scope,$state,$stateParams,$location,$cordovaGeolocation,Soaps,Responders){

  Soaps.get($stateParams.soapId, function(err, soapOverview){
    Responders.get(function(err,responder) {
    $scope.$location = $location;
    $scope.soapOverview = soapOverview;
    console.log(soapOverview);
    if(soapOverview.starterFlag === 'false') {
      Soaps.updateSoap('starterFlag',soapOverview.id,true);
    }
    soapOverview.editFlag === 'false' ? $scope.edit = false : $scope.edit = true;
    if(!soapOverview.responderFirstName && !soapOverview.responderLastName){
        Soaps.updateSoap('responderFirstName',soapOverview.id,responder.firstName);
        Soaps.updateSoap('responderLastName', soapOverview.id,responder.lastName);
        Soaps.updateSoap('responderTrainingLevel',soapOverview.id,responder.trainingLevel);
        $scope.soapOverview.responderFirstName = responder.firstName;
        $scope.soapOverview.responderLastName = responder.lastName;
        $scope.soapOverview.responderTrainingLevel = responder.trainingLevel;
    }

    });
  })

  $scope.monitorSoapOverviewChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  $scope.trainingLevels = ['WFA','WAFA','WFR','WEMT','OTHER'];

  //AUTO EXPAND BOXES
  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}

  //GEOLOCATION
  $scope.getLocation = function(soap) {
    Soaps.getLocation(function(err,location){
      if(location){
        var locationElem = ['incidentLat','incidentLon'];
        $scope.soapOverview.incidentLat = location[0];
        $scope.soapOverview.incidentLon = location[1];
        Soaps.updateSoapQuery(locationElem,soap.id,location);
      }
    })
  }

  $scope.resetLocation = function(soap) {
    var locationElem = ['incidentLat','incidentLon'];
    var location = ['',''];
    $scope.soapOverview.incidentLat = location[0];
    $scope.soapOverview.incidentLon = location[1];
    Soaps.updateSoapQuery(locationElem,soap.id,location)
  }


})

//SOAP SUBJECTIVE TAB
.controller('SoapSubjectiveCtrl', function($scope,$state,$stateParams,Soaps,Responders,Nols){
  Soaps.get($stateParams.soapId, function(err,soapSubjective){
    $scope.soapSubjective = soapSubjective;
  })

  $scope.monitorSoapSubjectiveChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    if(kindElem === 'patientDob') {
      var birthDay = kindVal,
        DOB = new Date(birthDay),
        today = new Date(),
        age = today.getTime() - DOB.getTime();
        age = Math.floor(age / (1000 * 60 * 60 * 24 * 365.25));
        $scope.soapSubjective.patientAge = age;
        Soaps.updateSoap('patientAge',kindId,age);
    }
    console.log(kindVal)
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}

  var range = function(i){
    return i ? range(i-1).concat(i):[];
  }

  $scope.genders = [
    {name:'Male',value:'M'},
    {name:'Female',value:'F'},
    {name:'Transgender',value:'T'}
  ];
  $scope.onsets = ['Sudden', 'Gradual'];
  $scope.qualities = ['Aching', 'Burning',
                      'Cramping', 'Crushing',
                      'Dull Pressure', 'Sharp',
                      'Squeezing', 'Stabbing',
                      'Tearing', 'Tight', 'Other'];
  $scope.severities = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  $scope.spinals = ['Yes', 'No'];

})

//SOAP OBJECTIVE TAB
.controller('SoapObjectiveCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals){
  Vitals.createVitalTable();
  Soaps.get($stateParams.soapId, function(err,soapObjective){
    $scope.soapObjective = soapObjective;
    Vitals.currentVitals(soapObjective.id, function(err,allobjVitals,objTrueVitals){
      $scope.recentSoapVitals = objTrueVitals;

      $scope.recentSoapVitalFlag = allobjVitals.filter(function(entry){return entry.starterFlag === 'false';});
      if($scope.recentSoapVitalFlag.length > 0){
        $scope.starterVital = $scope.recentSoapVitalFlag[0]
      }else {
        Vitals.saveNewVital({},soapObjective.id, function(err,starterVital){
          return $scope.starterVital = starterVital;
        })
      }
      //WOW YOU COULD JUST CHECK AGAINST THE SOAPS VITALS AND NOT ALL VITALS MAYBE
      //PROPER LOGIC ON THIS IS GOING TO BE GO THROUGH ALL VITALS
      //LOOP THROUGH ARRAY
      /*BECAUSE WHAT HAPPENS WHEN YOU HAVE THIS SCENERIO
        id = 1 - flag = false
        id = 2 - flag = false
        id = 3 - flag = false
        id = 4 - flag = false
        if you're checking only against the last you could save same soaps with multiple false flag
      */
      /*Vitals.getLast(function(err,lastVital){
        if(lastVital === null || lastVital.starterFlag === 'true'){
          Vitals.saveNewVital({},soapObjective.id, function(err,starterVital){
            $scope.starterVital = starterVital;
            console.log('called if')
            console.log(starterVital)
          })
        }else if(lastVital.starterFlag === 'false' && lastVital.soapId !== soapObjective.id){
          $scope.findMatchVitalSet = $scope.recentSoapVitals.filter(function(entry){return entry.soapId === lastVital.soapId})
          if($scope.findMatchVitalSet) {
            console.log($scope.findMatchVitalSet);
            $scope.starterVital = $scope.findMatchVitalSet;
          }else {
            Vitals.saveNewVital({},soapObjective.id, function(err,starterVital){
              console.log('called else if')
              console.log(starterVital)
              $scope.starterVital = starterVital;
            })
          }
        }else {
          console.log('called else')
          console.log(lastVital)
          $scope.starterVital = lastVital;
        }
      })*/
    })
  })

  $scope.monitorSoapObjectiveChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}

})

//SOAP A-P TAB
.controller('SoapAPCtrl', function($scope,$state,$stateParams,Soaps,Responders, Nols){
  Soaps.get($stateParams.soapId, function(err,soapAP){
    $scope.soapAP = soapAP;
  })

  $scope.monitorSoapAPChange = function(soap,soapVal,attrElem){
    var kindElem = attrElem,kindId = soap.id,kindVal = soapVal;
    Soaps.updateSoap(kindElem,kindId,kindVal);
  }

  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}
})

//SOAP REVIEW TAB
.controller('SoapReviewCtrl', function($scope,$state,$stateParams,$location,Soaps,Responders,Vitals,Camera){
  $scope.reviewRoute = $scope.$location.path().substring(0,12);
  Soaps.get($stateParams.soapId, function(err,soapReview){
    $scope.soapReview = soapReview;
    if(soapReview.editFlag === 'false') {
      Soaps.updateSoap('editFlag',soapReview.id,true);
    }
    Vitals.currentVitals(soapReview.id, function(err,allreviewVitals,reviewTrueVitals){
      $scope.recentSoapReviewVitals = reviewTrueVitals;
    })
    Camera.allQuery(soapReview.id, function(err,soapImgs){
      $scope.soapImgs = soapImgs.filter(function(entry){return entry.starterFlag === 'true';});
      return $scope.soapImgs;
    })
  })
})

.controller('SoapImgDetailCtrl', function($scope,$stateParams,$state,$ionicPopup,Camera,Soaps){
  $scope.takeNewImg = function(imgDetail,type) {
    Camera.getNewImg(type,function(err,imgAttr){
      Camera.updateImg("imageURI", imgDetail.id,imgAttr)
      updateImgFlag(imgDetail.id)
    })
  }

  $scope.deleteImg = function(img) {
    var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Image',
       template: 'Are you sure you want to delete this image?',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-calm',
           onTap: function() {
             return;
           }
         },
         {
           text: 'Delete',
           type: 'button-light',
           onTap: function() {
             Camera.deleteImg(img.id);
             $scope.imgs.splice($scope.imgs.indexOf(img.id), 1)
             reloadImgRepeat()
           }
         }
       ]
     });
  }

  $scope.expandText = function(obj){
  var valueID = obj.target.attributes.id.value;
  var element = document.getElementById(valueID);
  element.style.height =  element.scrollHeight + "px";}


  $scope.addACaption = function(img,imgVal,attrElem) {
    var kindElem = attrElem,kindId = img.id,kindVal = imgVal;
    Camera.updateImg(kindElem,kindId,kindVal);
  }

  var updateImgFlag = function(imgId){
    Camera.updateImg("starterFlag",imgId,true);
    reloadImgRepeat();
  }

  var reloadImgRepeat = function(){
    $state.go($state.current, {},{reload: true});
  }
})

.controller('SoapImgCtrl', function($scope,$stateParams,$state,
  $ionicPopup,Camera,Soaps) {
  Camera.createImgTable();
  Soaps.get($stateParams.soapId, function(err,soapImg){
    $scope.soapImg = soapImg;
    Camera.all(soapImg.id, function(err,imgs){
      $scope.imgs = imgs.filter(function(entry){return entry.starterFlag === 'true'});
      $scope.imgsSoapFlag = $scope.imgs.filter(function(entry){return entry.starterFlag === 'false'});
      if($scope.imgsSoapFlag.length){
        $scope.starterImg = $scope.imgsSoapFlag[0];
      }else {
        Camera.saveNewImg({},soapImg.id,function(err,starterImg){
          return $scope.starterImg = starterImg;
        })
      }
    })

  })

/*  $scope.takeNewImg = function() {
    Soaps.get($stateParams.soapId, function(err,soapImg){
      Camera.getNewImg(function(err,imgAttr){
        Camera.saveNewImg(imgAttr, soapImg);
      })
    })
  }

  $scope.addACaption = function(img,imgVal,attrElem) {
    var kindElem = attrElem,kindId = img.id,kindVal = imgVal;
    Camera.updateImg(kindElem,kindId,kindVal);
  }


*/
})

.controller('SoapDetailCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals,Camera,Nols){

  Soaps.get($stateParams.soapId, function(err,soapDetail){
    $scope.soapDetail = soapDetail;
    if(soapDetail.editFlag === 'false') {
      Soaps.updateSoap('editFlag',soapDetail.id,true);
    }
    Vitals.currentVitals(soapDetail.id, function(err,alldetailVitals,detailTrueVitals){
      $scope.recentSoapDetailVitals = detailTrueVitals;
    })
    Camera.allQuery(soapDetail.id, function(err,soapImgs){
      $scope.soapImgs = soapImgs.filter(function(entry){return entry.starterFlag === 'true';});
      return $scope.soapImgs;
    })
  })
})

.controller('VitalAllCtrl', function($scope,$state,$stateParams,$ionicPopup,Vitals,Soaps,Nols){
  $scope.data = {
    showDelete: false
  };

  $scope.onItemDelete = function(vitalId) {
    var confirmPopup = $ionicPopup.confirm({
       title: 'VITALS',
       template: 'Are you sure you want to delete this VITAL ENTRY?',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-calm',
           onTap: function() {
             return;
           },
         },
         {
           text: 'Delete',
           type: 'button-light',
           onTap: function() {
             Vitals.deleteVital(vitalId);
             $scope.soapVitals.splice($scope.soapVitals.indexOf(vitalId), 1)
           }
         }
       ]
     });
  }

  Vitals.currentVitals($stateParams.soapId, function(err, allVitals,allTrueVitals){
    $scope.soapVitalsId = $stateParams.soapId;
    $scope.soapVitals = allVitals.filter(function(entry){return entry.starterFlag === 'true';});
    $scope.soapVitalsFlag = allVitals.filter(function(entry){return entry.starterFlag === 'false';});
    if($scope.soapVitalsFlag.length > 0){
      $scope.starterVital = $scope.soapVitalsFlag[0];
    }else {
      Vitals.saveNewVital({},$stateParams.soapId, function(err,starterVital){
        return $scope.starterVital = starterVital;
      })
    }
  })


})

.controller('VitalDetailCtrl', function($scope,$state,$stateParams,$timeout,$ionicPopup,Vitals){
  Vitals.get($stateParams.vitalId, function(err, vitalDetail){
    if(vitalDetail.starterFlag === 'false'){
      Vitals.updateVital("starterFlag",vitalDetail.id,true);
    }
    $scope.vitalDetail = vitalDetail;
  })

  var range = function(i){
    return i ? range(i-1).concat(i):[];
  }

  $scope.systolics = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.systolics.unshift("Radial Pulse")
  $scope.diastolics = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.diastolics.unshift("P")

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

  $scope.monitorVitalChange = function(vital,vitalVal,attrElem){
    console.log(vitalVal);
    var kindElem = attrElem,kindId = vital.id,kindVal = vitalVal;
    Vitals.updateVital(kindElem,kindId,kindVal);
  }

  $scope.cancelVital = function(vital){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Cancel',
       template: 'Going back will delete this Vital',
       buttons: [
         {
           text: 'Cancel',
           type: 'button-calm',
           onTap: function() {
             return;
           }
         },
         {
           text: 'Continue',
           type: 'button-light',
           onTap: function() {
             Vitals.deleteVital(vital.id);
             window.history.back();
           }
         }
       ]
     });

  }

  $scope.timeValue = 0;
  function countdown(){
    $scope.timeValue++;
    if($scope.timeValue < 60) {
      $scope.timeout = $timeout(countdown,1000);
    }else{
      $scope.stop();
    }
  };
  $scope.start = function(){
    if($scope.timeValue === 60){
      $scope.timeValue = 0;
    }
    countdown();
    $scope.play = true;
    $scope.pause = false;
  }
  $scope.stop = function(){
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }
  $scope.reset = function(){
    $scope.timeValue = 0;
    $timeout.cancel($scope.timeout);
    $scope.play = false;
    $scope.pause = true;
  }


})

/*

  //$scope.dt = new Date();

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

})*/

// coundown controls.

.controller('VitalEditCtrl', function($scope,$state,$stateParams,$timeout,$ionicPopup,Vitals){
  Vitals.get($stateParams.vitalId, function(err,vitalEdit){
    $scope.vitalEdit = vitalEdit;
  })

  $scope.monitorVitalChange = function(vital,vitalVal,attrElem){
    var kindElem = attrElem,kindId = vital.id,kindVal = vitalVal;
    Vitals.updateVital(kindElem,kindId,kindVal);
  }

  $scope.systolics = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.systolics.unshift("Radial Pulse")
  $scope.diastolics = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.diastolics.unshift("P")

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


})

.controller('VitalNewCtrl', function($scope, $state, $stateParams, Vitals) {
  //LOOK AT SOAP OVERVIEW CONTROLLER FOR THIS FIX
  Vitals.get($stateParams.vitalId, function(err, vitalDetail) {
    $scope.vitalDetail = vitalDetail;
    $state.reload();
  })
})
