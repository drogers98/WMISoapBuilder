//All Class methods called are on services
//ToDo sep all controllers 

'use strict';
angular.module('WMISoapBuilder.controllers', ['angular-websql', 'debounce','ngCordova'])
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
})


//Responder sign up
.controller('FirstResponderCtrl', function($scope, $state, $location,$stateParams,$timeout,
  Responders, Soaps, Nols,uiState,$ionicPlatform, $cordovaDevice) {
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


//MAIN SOAP LOGIC
.controller('SoapCtrl', function($scope, $state, $stateParams,
                                 $ionicModal, $timeout, $location,
                                 Soaps, Responders, Nols,$ionicPopup,$cordovaSocialSharing, $cordovaDevice){
  "use strict";

  Soaps.createSoapTable();

  Responders.get(function(err,responder){
    $scope.responder = responder;
    if(responder){
      if($state.includes('soaps')){
      Soaps.getLast(function(err,lastSoap){
        if(lastSoap === null || lastSoap.starterFlag === 'true'){
          //To avoid duplication
          Soaps.saveNewSoap({},{},function(err,starterSoap){
            if(typeof analytics !== "undefined"){
              analytics.trackEvent('Soap', 'Created')
            }
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
       title: soap.incidentDate + ' | ' + soap.patientAge + ' , ' + soap.patientGender + ' | ' + soap.patientInitials,
       template: 'Are you sure you want to delete this SOAP note?',
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
          if(typeof analytics !== "undefined"){
            analytics.trackEvent('Soap', 'Deleted');
          }
	         $scope.soaps.splice($scope.soaps.indexOf(soap), 1);
             Soaps.deleteSoap(soap.id);

           }
         }
       ]
     });

  }

 $scope.remove=function(item){
      var index=$scope.bdays.indexOf(item)
      $scope.bdays.splice(index,1);
    }

  $scope.cancelSoap = function(soap){
    var confirmPopup = $ionicPopup.confirm({
       title: 'Cancel',
       template: 'Going back will delete this SOAP',
       buttons: [
         {
           text: 'Stay Here',
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
             $state.go('soaps');
           }
         }
       ]
     });

  }


  //Nols.cutLifeLine(); //will drop table

    $ionicModal.fromTemplateUrl()

     var wmiModal = function(index,callback){
       $ionicModal.fromTemplateUrl('modal-'+index+'.html',{
         id: index,
         scope: $scope,
         animation: 'slide-in-up'
       }).then(function(modal){
         $scope.oModal = modal;
         callback(null,$scope.oModal)
       })
     }

     $scope.openModal = function(index) {
       wmiModal(index,function(err,wmiMod){
         wmiMod.show();
       })
     };

     $scope.closeModal = function(index) {
       $scope.oModal.hide();
     };

     //This is annoying in the logs....?
     $scope.$on('modal.shown', function(event, modal) {
       console.log('Modal ' + modal.id + ' is shown!');
     });

     $scope.$on('modal.hidden', function(event, modal) {
       console.log('Modal ' + modal.id + ' is hidden!');
     });

     $scope.$on('$destroy', function() {
       console.log('Destroying modals...');
       $scope.oModal.remove();
     });


      //Email
     $scope.shareSOAP = function(soap,soapVitals,soapImages) {

      //Images
      var imgURIS = function(soapImages){
        var imageURIS = [];
        for(var i=0;i<soapImages.length;i++){
          var uri = soapImages[i].imageURI;
          imageURIS.push(uri);
        }
        return imageURIS;
      }

      var genderFull = function(){
        if(soap.patientGender == 'M' || soap.patientGender == 'Male'){
          soap.patientGender = 'Male';
        }else if(soap.patientGender == 'F' || soap.patientGender == 'Female'){
          soap.patientGender = 'Female';
        }else if(soap.patientGender == 'T') {
          soap.patientGender = 'Transgender';
        }else {
          soap.patientGender = '';
        }
        return soap.patientGender;
      }

      var runMessage = function(soapVitals) {

        var tdStyle = platform == 'iOS' ? "style='width:25%;border:1px solid #EFEFEF;padding:5px'" : ""
        var thStyle = platform == 'iOS' ? "style='width:25%;border:1px solid #EFEFEF;border-collapse:collapse;padding:5px;text-align:right;padding-right:10px;background-color:#EFEFEF;text-transform:uppercase'" : ""
        var tbStyle = platform == 'iOS' ? "style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;" : ""
        var tablePlatformOpen = platform == 'iOS' ? "<table style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;'>" : "<div>"
        var tablePlatformClose = platform == 'iOS' ? "</table>" : "</div>"
        var tBracket = platform == 'iOS' ? '>' : ''
        var tdOpen = platform == 'iOS' ? '<td ' : '' //was <p '
        var tdClose = platform == 'iOS' ? '</td>' : ' | ' //was </p>
        var trOpen = platform == 'iOS' ? '<tr>' : '<p>'
        var trClose = platform == 'iOS' ? '</tr>' : '</p>'
        var thOpen = platform == 'iOS' ? '<th ' : '<strong '
        var thClose = platform == 'iOS' ? '</th>' : '</strong><br>'
        var preOpen = platform == 'iOS' ? '<pre style="font-family: inherit;margin-top:0;">' : ''
        var preClose = platform == 'iOS' ? '</pre>' : ''

        var messagePartI = '<h2>Location</h2>'+
        '<strong>Date of Incident</strong>: ' + soap.incidentDate + '<br>' +
        '<strong>Location</strong>: ' + soap.incidentLocation.replace(/\n/g, '<br>') + '<br>' +
        '<strong>Coordinates</strong>: ' + soap.incidentLat + ', ' + soap.incidentLon + '<br>' +
        '<strong>Responder</strong>: ' + soap.responderFirstName + ' ' + soap.responderLastName + ', ' + soap.responderTrainingLevel + '<br>' +
        '<h2>Subjective</h2>'+
        '<strong>Initials</strong>: ' + soap.patientInitials + '<br>' +
        '<strong>DOB</strong>: ' + soap.patientDob + '<br>' +
        '<strong>Age</strong>: ' + soap.patientAge + '<br>' +
        '<strong>Sex</strong>: ' + genderFull() + '<br>' +
        '<strong>Chief Complaint</strong>: '+
        preOpen + soap.patientComplaint.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Onset</strong>: ' + soap.patientOnset + '<br>' +
        '<strong>Onset Date</strong>: ' + soap.patientOnsetDate + '<br>' +
        '<strong>Onset Time</strong>: ' + soap.patientOnsetTime + '<br>' +
        '<strong>Provokes/Palliates</strong>: '+ preOpen + soap.patientPPalliates.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Quality</strong>: ' + soap.patientQuality + '<br>' +
        '<strong>Radiation/Region/Referred</strong>: '+ preOpen + soap.patientRadiates.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Severity</strong>: ' + soap.patientSeverity + '<br>' +
        '<strong>MOI/HPI</strong>: '+ preOpen + soap.patientHPI.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Spinal MOI</strong>: ' + soap.patientSpinal + '<br>' +
        '<h2>Objective</h2>'+
        //'<h3>General</h3>'+
        '<strong>Patient Position When Found</strong>: '+ preOpen + soap.patientFound.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Patient Exam</strong>: '+ preOpen + soap.patientExamReveals.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<h2>Vital Signs</h2>';

        //var messagePartIIA = "<table style='width:100%;text-align:center;border:1px solid #EFEFEF;border-collapse:collapse;'>";
        var platform = $cordovaDevice.getPlatform()
        var messagePartIIB = function(soapVitals) {
          var vitalListTime = [], vitalListDate = [],vitalListLor = [],vitalListHR = [],vitalListRR = [],
              vitalListSkin = [],vitalListBP = [],vitalListPupils = [],vitalListTemp = [];
          var filteredVitalsBefore = soapVitals.filter(function(entry){return entry.starterFlag === 'true';});
          var filteredVitals = filteredVitalsBefore.sort(function(a,b){
            return new Date('1970/01/01 ' + a.timeTaken) - new Date('1970/01/01 ' + b.timeTaken);
          })

          //IOS
          for(var key in filteredVitals){

            var emailVitalObj = {};
            vitalListTime.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].timeTaken + tdClose);
            vitalListDate.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].dateTaken + tdClose);
            vitalListLor.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].lor + tdClose);
            vitalListHR.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].rate + ' ' + filteredVitals[key].heartRythm + ' ' + filteredVitals[key].heartQuality +tdClose);
            vitalListRR.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].respRate + ' ' + filteredVitals[key].respRhythm + ' ' + filteredVitals[key].respQuality +tdClose);
            vitalListSkin.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].sctmcolor + ' ' + filteredVitals[key].sctmtemp + ' ' + filteredVitals[key].sctmmoisture +tdClose);
            vitalListBP.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].brsystolic.replace('.0', '')+'/'+filteredVitals[key].diastolic.replace('.0', '') + tdClose);
            vitalListPupils.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].pupils + tdClose);
            vitalListTemp.push(tdOpen+tdStyle+tBracket+ filteredVitals[key].tempDegreesReading + ' ' + filteredVitals[key].tempDegrees+tdClose);
            emailVitalObj['timeTaken'] = vitalListTime.join("");
            emailVitalObj['dateTaken'] = vitalListDate.join("");
            emailVitalObj['lor'] = vitalListLor.join("");
            emailVitalObj['hr'] = vitalListHR.join("");
            emailVitalObj['rr'] = vitalListRR.join("");
            emailVitalObj['skin'] = vitalListSkin.join("");
            emailVitalObj['bp'] = vitalListBP.join("");
            emailVitalObj['pupils'] = vitalListPupils.join("");
            emailVitalObj['temp'] = vitalListTemp.join("");

            var message = tablePlatformOpen
                          +trOpen+thOpen+thStyle+'>Date'+thClose+emailVitalObj.dateTaken+trClose
                          +trOpen+thOpen+thStyle+'>Time'+thClose+emailVitalObj.timeTaken+trClose
                          +trOpen+thOpen+thStyle+'>LOR'+thClose+emailVitalObj.lor+trClose
                          +trOpen+thOpen+thStyle+'>HR'+thClose+emailVitalObj.hr+trClose
                          +trOpen+thOpen+thStyle+'>RR'+thClose+emailVitalObj.rr+trClose
                          +trOpen+thOpen+thStyle+'>Skin'+thClose+emailVitalObj.skin+trClose
                          +trOpen+thOpen+thStyle+'>BP'+thClose+emailVitalObj.bp+trClose
                          +trOpen+thOpen+thStyle+'>Pupils'+thClose+emailVitalObj.pupils+trClose
                          +trOpen+thOpen+thStyle+'>TEMP'+thClose+emailVitalObj.temp+trClose
                          +tablePlatformClose;
          }
          return message;

        }


        //'<tr>' + "<th style='width:25%;border:1px solid #EFEFEF;border-collapse:collapse;padding:5px;text-align:right;padding-right:10px;background-color:#EFEFEF;text-transform:uppercase'>"

        var messagePartIII = '<h3>Patient History</h3>'+
        '<strong>Symptoms</strong>: '+ preOpen  + soap.patientSymptoms.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Allergies</strong>: '+ preOpen + soap.patientAllergies.replace(/\n/g, '<br>') + preClose + '<br>'+
        '<strong>Medications</strong>:'+ preOpen + soap.patientMedications.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Pertinent Medical History</strong>: '+ preOpen + soap.patientMedicalHistory.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Last Intake/Output</strong>: '+ preOpen + soap.patientLastIntake.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Events Leading up to Injury/Illness</strong>: '+ preOpen + soap.patientEventsForCause.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<h2>Assessment</h2>'+
        preOpen + soap.patientAssessment.replace(/\n/g, '<br>') + preClose +
        '<h2>Plan</h2>'+
        preOpen + soap.patientPlan.replace(/\n/g, '<br>') + preClose + '<br>' +
        '<strong>Anticipated Problems</strong>:'+ preOpen  + soap.patientAnticipatedProblems.replace(/\n/g, '<br>') + preClose + '<br>';

        var messagePartIVA = '<h2>Photos</h2>';
        var messagePartIV = function(soapImages) {
	        var captions = [];
	        var imgNum = 1;
          for(var i=0;i<soapImages.length;i++) {

	          var imgNumPlus = imgNum++;
            var captionIntroA = 'Image ' + imgNumPlus + ': ';
            var captionIntro = soapImages[i].imgCaption ? captionIntroA : captionIntroA + "No Caption Provided"
            captions.push(captionIntro + soapImages[i].imgCaption + '<br>');
          }
          return captions.join("");
        }


        return messagePartI + messagePartIIB(soapVitals) + messagePartIII + messagePartIVA + messagePartIV(soapImages);
      }
      //console.log(runMessage(soapVitals))

     var soapSubject = 'SOAP Note ' + soap.incidentDate + ' | ' + soap.patientAge + ', ' + soap.patientGender + ' | ' + soap.patientInitials,
         goTo = [''],bccArr = [];


    Soaps.sendEmail(runMessage(soapVitals),soapSubject,goTo,bccArr,imgURIS(soapImages),function(soapEmailSuccess){
        if(typeof analytics !== "undefined"){analytics.trackEvent('Email','Sent');}

        //Handle email end;
        //todo if/when possible - distiniguish between cancel and sending email drafts
        var confirmPopup = $ionicPopup.confirm({
          title: 'Where would you like to go?',
          template: 'You can stay on the review page or go to My SOAPs',
          buttons: [
            {
              text: 'Review',
              type: 'button-calm',
              onTap: function() {
                return;
              }
            },
            {
              text: 'My SOAPS',
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
.controller('SoapOverviewCtrl', function($scope,$state,$stateParams,$location, $cordovaGeolocation,Soaps,Responders){
  if(typeof analytics !== "undefined") {analytics.trackView("SOAP OVERVIEW");}

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

    $scope.continueToSubjective = function(id){
      $state.go('tab.subjective',{soapId: id})
    }
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
  if(typeof analytics !== "undefined") {analytics.trackView("SOAP SUBJECTIVE");}
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
  $scope.severities = ['1 out of 10', '2 out of 10', '3 out of 10', '4 out of 10', '5 out of 10', '6 out of 10', '7 out of 10', '8 out of 10', '9 out of 10', '10 out of 10'];
  $scope.spinals = ['Yes', 'No'];

})

//SOAP OBJECTIVE TAB
.controller('SoapObjectiveCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals){
  if(typeof analytics !== "undefined") {analytics.trackView("SOAP OBJECTIVE");}
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
  if(typeof analytics !== "undefined") {analytics.trackView("SOAP A-P");}
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
      $scope.recentAllSoapReviewVitals = allreviewVitals;
      $scope.recentSoapReviewVitals = reviewTrueVitals;
    })
    Camera.allQuery(soapReview.id, function(err,soapImgs){
      $scope.soapImgs = soapImgs.filter(function(entry){return entry.starterFlag === 'true';});
      return $scope.soapImgs;
    })
  })
})

.controller('SoapImgDetailCtrl', function($scope,$stateParams,$state,$ionicPopup,Camera,Soaps){
  if(typeof analytics !== "undefined") {analytics.trackView("SOAP IMAGES");}
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
           text: 'Keep',
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

})

.controller('SoapDetailCtrl', function($scope,$state,$stateParams,Soaps,Responders,Vitals,Camera,Nols){

  Soaps.get($stateParams.soapId, function(err,soapDetail){
    $scope.soapDetail = soapDetail;
    if(soapDetail.editFlag === 'false') {
      Soaps.updateSoap('editFlag',soapDetail.id,true);
    }
    Vitals.currentVitals(soapDetail.id, function(err,alldetailVitals,detailTrueVitals){
      $scope.recentAllSoapDetailVitals = alldetailVitals;
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
       title: 'Delete Vitals',
       template: 'Are you sure you want to delete this Vitals entry?',
       buttons: [
         {
           text: 'Keep',
           type: 'button-calm',
           onTap: function() {
             return;
           },
         },
         {
           text: 'Delete',
           type: 'button-light',
           onTap: function() {
             Vitals.deleteVital(vitalId.id);
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

  $scope.systolicsData = Array.apply(null, {length: 301}).map(Number.call, Number);
  $scope.systolics = $scope.systolicsData.map(function(sys){
    return sys.toString();
  })
  $scope.diastolicsData = Array.apply(null, {length: 301}).map(Number.call, Number);
  $scope.diastolicsData.unshift("P")
  $scope.diastolics = $scope.diastolicsData.map(function(dias){
    return dias.toString();
  })


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
           text: 'Stay',
           type: 'button-calm',
           onTap: function() {
             return;
           }
         },
         {
           text: 'Continue',
           type: 'button-light',
           onTap: function() {
             //console.log(vital)
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
    if(typeof analytics !== "undefined") {analytics.trackEvent('Vital','Start','Timer');}
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

.controller('VitalEditCtrl', function($scope,$state,$stateParams,$timeout,$ionicPopup,Vitals){
  Vitals.get($stateParams.vitalId, function(err,vitalEdit){
    $scope.vitalEdit = vitalEdit;
  })

  $scope.monitorVitalChange = function(vital,vitalVal,attrElem){
    var kindElem = attrElem,kindId = vital.id,kindVal = vitalVal;
    Vitals.updateVital(kindElem,kindId,kindVal);
  }

  $scope.systolicsData = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.systolics = $scope.systolicsData.map(function(sys){
    return sys.toString();
  });
  $scope.diastolicsData = Array.apply(null, {length: 300}).map(Number.call, Number);
  $scope.diastolicsData.unshift("P")
  $scope.diastolics = $scope.diastolicsData.map(function(dias){
    return dias.toString();
  })

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

.controller('VitalNewCtrl', function($scope, $state, $stateParams, Vitals) {
  //LOOK AT SOAP OVERVIEW CONTROLLER FOR THIS FIX
  Vitals.get($stateParams.vitalId, function(err, vitalDetail) {
    $scope.vitalDetail = vitalDetail;
    $state.reload();
  })

})
