'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql', 'debounce', 'ngCordova'])

/* Named global db methods as kind */
//getKind (GET)
//updateKind (POST)
//Kind (GET)
//allKind (GET)
//deleteKind (DELETE)

 .factory('nolsDB', function($webSql, $rootScope) {
   var self = this;
   self.db = null;
   return {
     init: function() {
       self.db = $webSql.openDatabase('nolsDB', '1.0', 'nols-wmi-db', 10 * 1024 * 1024);
     },
     createResponderTable: function() {
       self.db.createTable('Responder', {
         "id": {"type": "INTEGER","null": "NOT NULL","primary": true,"auto_increment": true},
         "created": {"type": "TIMESTAMP","null": "NOT NULL","default": "CURRENT_TIMESTAMP"},
         "firstName": {"type": "TEXT","null": "NOT NULL"},
         "lastName": {"type": "TEXT","null": "NOT NULL"},
         "trainingLevel": {"type": "TEXT","null": "NOT NULL"},
         "acceptedTerms": {"type": "BOOLEAN", "null": "NOT NULL"}
       });
     },
     saveResponder: function(responder, callback) {
       self.db.insert('Responder', {
         "firstName": responder.firstName || '',
         "lastName": responder.lastName || '',
         "trainingLevel": responder.trainingLevel || '',
         "acceptedTerms": responder.acceptedTerms || false
       }).then(function(results){
         self.db.select("Responder", {
           "id": results.insertId
         }).then(function(results) {
           for(var i=0; i < results.rows.length;i++){
              var responder = angular.copy(results.rows.item(i))
              callback(null,responder);
           }
         })
       });
     },
     createSoapTable: function() {
       self.db.createTable('Soap', {
         "id": {"type": "INTEGER","null": "NOT NULL","primary": true,"auto_increment": true},
         "created": {"type": "TIMESTAMP","null": "NOT NULL","default": "CURRENT_TIMESTAMP"},
         "responderFirstName": {"type": "TEXT", "null": "NOT NULL"},
         "responderLastName": {"type": "TEXT", "null": "NOT NULL"},
         "responderUid": {"type": "TEXT", "null": "NOT NULL"},
         "responderTrainingLevel": {"type": "TEXT", "null": "NOT NULL"},
         "starterFlag": {"type": "TEXT", "null": "NOT NULL"},
         "editFlag": {"type": "TEXT", "null": "NOT NULL"},
         "incidentDate": {"type": "DATE", "null": "NOT NULL"},
         "incidentLocation": {"type": "TEXT","null": "NOT NULL"},
         "incidentLat": {"type": "TEXT","null": "NOT NULL"},
         "incidentLon": {"type": "TEXT","null": "NOT NULL"},
         "patientInitials": {"type": "TEXT","null": "NOT NULL"},
         "patientGender": {"type": "TEXT","null": "NOT NULL"},
         "patientDob": {"type": "DATE","null": "NOT NULL"},
         "patientAge": {"type": "INTEGER","null": "NOT NULL"},
         "patientLOR": {"type": "TEXT","null": "NOT NULL"},
         "patientComplaint": {"type": "TEXT","null": "NOT NULL"},
         "patientOnset": {"type": "TEXT","null": "NOT NULL"},
         "patientPPalliates": {"type": "TEXT","null": "NOT NULL" },
         "patientQuality": {"type": "TEXT","null": "NOT NULL"},
         "patientRadiates": {"type": "TEXT","null": "NOT NULL"},
         "patientSeverity": {"type": "TEXT","null": "NOT NULL"},
         "patientOnsetDate": {"type": "TEXT", "null": "NOT NULL"},
         "patientOnsetTime": {"type": "TEXT","null": "NOT NULL"},
         "patientHPI": {"type": "TEXT","null": "NOT NULL"},
         "patientSpinal": {"type": "TEXT","null": "NOT NULL"},
         "patientFound": {"type": "TEXT","null": "NOT NULL"},
         "patientExamReveals": {"type": "TEXT","null": "NOT NULL"},
         "patientSymptoms": {"type": "TEXT","null": "NOT NULL"},
         "patientAllergies": {"type": "TEXT","null": "NOT NULL"},
         "patientMedications": {"type": "TEXT","null": "NOT NULL"},
         "patientMedicalHistory": {"type": "TEXT","null": "NOT NULL"},
         "patientLastIntake": {"type": "TEXT","null": "NOT NULL"},
         "patientEventsForCause": {"type": "TEXT","null": "NOT NULL"},
         "patientAssessment": {"type": "TEXT","null": "NOT NULL"},
         "patientPlan": {"type": "TEXT","null": "NOT NULL"},
         "patientAnticipatedProblems": {"type": "TEXT","null": "NOT NULL"}
       })
     },
     saveSoap: function(soapAttr,responderAttr, callback) {
       self.db.insert('Soap', {
         "responderFirstName": responderAttr.firstName || '',
         "responderLastName": responderAttr.lastName || '',
         "responderUid": responderAttr.id || '',
         "responderTrainingLevel": responderAttr.trainingLevel || '',
         "starterFlag": soapAttr.starterFlag || false,
         "editFlag": soapAttr.editFlag || false,
         "incidentDate": soapAttr.incidentDate || '',
         "incidentLocation": soapAttr.incidentLocation || '',
         "incidentLat": soapAttr.incidentLat || '',
         "incidentLon": soapAttr.incidentLon || '',
         "patientInitials": soapAttr.patientInitials || '',
         "patientGender": soapAttr.patientGender || '',
         "patientDob": soapAttr.patientDob || '',
         "patientAge": soapAttr.patientAge || '',
         "patientLOR": soapAttr.patientLOR || '',
         "patientComplaint": soapAttr.patientComplaint || '',
         "patientOnset": soapAttr.patientOnset || '',
         "patientPPalliates": soapAttr.patientPPalliates || '',
         "patientQuality": soapAttr.patientQuality || '',
         "patientRadiates": soapAttr.patientRadiates || '',
         "patientSeverity": soapAttr.patientSeverity || '',
         "patientOnsetDate": soapAttr.patientOnsetDate || '',
         "patientOnsetTime": soapAttr.patientOnsetTime || '',
         "patientHPI": soapAttr.patientHPI || '',
         "patientSpinal": soapAttr.patientSpinal || '',
         "patientFound": soapAttr.patientFound || '',
         "patientExamReveals": soapAttr.patientExamReveals || '',
         "patientSymptoms": soapAttr.patientSymptoms || '',
         "patientAllergies": soapAttr.patientAllergies || '',
         "patientMedications": soapAttr.patientMedications || '',
         "patientMedicalHistory": soapAttr.MedicalHistory || '',
         "patientLastIntake": soapAttr.LastIntake || '',
         "patientEventsForCause": soapAttr.patientEventsForCause || '',
         "patientAssessment": soapAttr.patientAssessment || '',
         "patientPlan": soapAttr.patientPlan || '',
         "patientAnticipatedProblems": soapAttr.patientAnticipatedProblems || ''
       }).then(function(results) {
         self.db.select("Soap", {
           "id": results.insertId
         }).then(function(results) {
           for(var i = 0;i < results.rows.length;i++){
             var soap = angular.copy(results.rows.item(i))
             callback(null, soap);
           }
         })
       })
     },
     createVitalTable: function() {
       self.db.createTable('Vital', {
         "id": {"type": "INTEGER", "null": "NOT NULL", "primary": true, "auto_increment": true},
         "created": {"type": "TIMESTAMP", "null": "NOT NULL", "default": "CURRENT_TIMESTAMP" },
         "soapId": {"type": "INTEGER", "null": "NOT NULL"},
         "starterFlag": {"type": "TEXT", "null": "NOT NULL"},
         "editFlag": {"type": "TEXT", "null": "NOT NULL"},
         "timeTaken": {"type": "TEXT", "null": "NOT NULL"},
         "dateTaken": {"type": "DATE", "null": "NOT NULL"},
         "lor": {"type": "TEXT", "null": "NOT NULL"},
         "rate": {"type": "INTEGER", "null": "NOT NULL"},
         "heartRythm": {"type": "TEXT", "null": "NOT NULL"},
         "heartQuality": {"type": "TEXT", "null": "NOT NULL"},
         "respRate": {"type": "INTEGER", "null": "NOT NULL"},
         "respRhythm": {"type": "TEXT", "null": "NOT NULL"},
         "respQuality": {"type": "TEXT", "null": "NOT NULL"},
         "sctmcolor": {"type": "TEXT", "null": "NOT NULL"},
         "sctmtemp": {"type": "TEXT", "null": "NOT NULL"},
         "sctmmoisture": {"type": "TEXT", "null": "NOT NULL"},
         //"brradialpulse": {"type": "TEXT", "null": "NOT NULL"},
         "brsystolic": {"type": "TEXT", "null": "NOT NULL"},
         "diastolic": {"type": "TEXT", "null": "NOT NULL"},
         "brradialtaken": {"type": "TEXT", "null": "NOT NULL"},
         "brradialReading": {"type": "INTEGER", "null": "NOT NULL"},
         "pupils": {"type": "TEXT", "null": "NOT NULL"},
         "tempDegreesReading": {"type": "INTEGER", "null": "NOT NULL"},
         "tempDegrees": {"type": "TEXT", "null": "NOT NULL"}

       })
     },
     saveVital: function(vitalAttr, soapAttr, callback) {
       var vital = {};
       //come back to this as it was called from timeTaken
       function getDateTime() {
         var d = new Date();
         d.toLocaleString();       // -> "2/1/2013 7:37:08 AM"
         d.toLocaleDateString();   // -> "2/1/2013"
         return d.toLocaleTimeString();
       }

       self.db.insert('Vital', {
         "soapId": soapAttr,
         "starterFlag": vitalAttr.starterFlag || false,
         "editFlag": vitalAttr.editFlag || false,
         "lor": vitalAttr.lor || '',
         "timeTaken": vitalAttr.timeTaken || '',
         "dateTaken": vitalAttr.dateTaken || '',
         "rate": vitalAttr.rate || '',
         "heartRythm": vitalAttr.heartRythm || '',
         "heartQuality": vitalAttr.heartQuality || '',
         "respRate": vitalAttr.respRate || '',
         "respRhythm": vitalAttr.rrhythm || '',
         "respQuality": vitalAttr.rquality || '',
         "sctmcolor": vitalAttr.sctmcolor || '',
         "sctmtemp": vitalAttr.sctmtemp || '',
         "sctmmoisture": vitalAttr.sctmmoisture || '',
         //"brradialpulse": vitalAttr.brradialpulse || '',
         "brsystolic": vitalAttr.brsystolic || '',
         "diastolic": vitalAttr.diastolic || '',
         "brradialtaken": vitalAttr.brradialtaken || '',
         "brradialReading": vitalAttr.brradialReading || '',
         "pupils": vitalAttr.pupils || '',
         "tempDegreesReading": vitalAttr.tempDegreesReading || '',
         "tempDegrees": vitalAttr.tempDegrees || '°F'
       }).then(function(results) {
         self.db.select('Vital', {
           "id": results.insertId
         }).then(function(results){
           for(var i=0;i < results.rows.length;i++){
             vital = results.rows.item(i);
             callback(null, vital)
           }
         })
       })
     },
     createImgTable: function() {
       self.db.createTable('Camera', {
         "id": {"type": "INTEGER", "null": "NOT NULL", "primary": true, "auto_increment":true},
         "created": {"type": "TIMESTAMP", "null": "NOT NULL", "default": "CURRENT_TIMESTAMP"},
         "starterFlag": {"type": "TIMESTAMP", "null": "NOT NULL"},
         "imageURI": {"type": "TEXT", "null": "NOT NULL"},
         "soapId": {"type": "INTEGER", "null": "NOT NULL"},
         "imgCaption": {"type": "TEXT", "null": "NOT NULL"}
       })
     },
     saveImg: function(img,soap,callback) {
       var img = {};
       self.db.insert('Camera', {
         "imageURI": img.imageURI || '',
         "soapId": soap,
         "starterFlag": img.starterFlag || false,
         "imgCaption": img.imgCaption || ''
       }).then(function(results){
         self.db.select('Camera', {
           "id": results.insertId
         }).then(function(results){
           for(var i = 0;i < results.rows.length;i++){
             img = results.rows.item(i);
             callback(null,img);
          }
        })
      })
     },
     imgUpdate: function(kind,objId,obj){
       self.db.update(kind,obj,{
         'id': objId
       })
     },
     getKind: function(object,callback) {
       self.db.selectAll(object).then(function(results) {
        callback(null,results.rows);
      }, function(){
         callback(null,null);
       })
     },
    updateResp: function(kind,objId,obj){
       self.db.update(kind,obj,{
         'id': objId
       })
    },
     updateKind: function(object, kind) {
       var updateP = function(kId) {
          for(var k in object){
            if(object.hasOwnProperty(k)){
              var newKey = k,
                  newVal = object[k];
              }
            self.db.update(kind,kindForUpdate(newKey,newVal),{
              'id': kId
            })
          }
        }

        var kindForUpdate = function(kindKey,kindVal){
           var  buildKeyValue = {};
           buildKeyValue[kindKey] = kindVal;
           return buildKeyValue;
         }

        var updateKind = function() {
        self.db.selectAll(kind).then(function(results){
           for(var i = results.rows.length - 1;i<
             results.rows.length;i++){
             var kindId = results.rows.item(i).id;
           }
           updateP(kindId);
         })
       }
       updateKind();

     },
     allKind: function(object,callback){
       self.db.selectAll(object).then(function(results){
         callback(null,results.rows);
       })
     },
     allKindQuery: function(object,query,callback){
       self.db.select(object,query).then(function(results){
         callback(null,results.rows);
         console.log(results.rows)
       })
     },
     kind: function(object, query, callback) {
      self.db.select(object,query).then(function(results){
        callback(null, results.rows);
      })
     },
     soapUpdateQuery: function(kind,objId,obj){
       self.db.update(kind,
         {'incidentLon': obj.incidentLon},
         {'id': objId
       })
       self.db.update(kind,
         {'incidentLat': obj.incidentLat},
         {'id': objId
       })

     },
     soapUpdate: function(kind,objId,obj) {
       self.db.update(kind,obj,{
         'id': objId
       })
     },
     vitalUpdate: function(kind,objId,obj){
       self.db.update(kind,obj,{
         'id': objId
       })
     },
     deleteKind: function(kind,id){
       self.db.del(kind,{"id": id});
       if(kind == 'Soap') {
         self.db.del('Vital',{"soapId":id});
       }
     },
     vitals: function(object,soap,callback){
       self.db.select(object,{
         "soapId": soap
       }).then(function(results){
         callback(null,results.rows);
       })
     },
     vital: function(object, query, callback) {
       self.db.select(object,query).then(function(results){
        callback(null, results.rows);
       })

   },
     deleteVital: function(vitalId){
       self.db.del('Vital',{"id": vitalId});
     },
     imgs: function(object,soap,callback){
       self.db.select(object,{
         "soapId": soap
       }).then(function(results){
         callback(null,results.rows);
       })
     },
     deleteImg: function(img){
       self.db.del('Camera',{"id": img});
     },
     dropSoap: function() {
       self.db.dropTable("Soap");
     },
     dropRes: function(){
       self.db.dropTable("Responder");
     },
     dropVit: function(){
       self.db.dropTable("Vital");
     },
     dropCam: function(){
       self.db.dropTable("Camera");
     }

   };

 })


//MODEL////////////
///////FACTORIES///
/////BY////////////
///////EBS/////////
.factory('Responders', function(nolsDB, uiState, $rootScope) {
  var responder = {};
  var responderNewParams = [];
  var responderKind = 'Responder';

  return {
    createResponderTable: function(){
      nolsDB.createResponderTable();
    },
    saveResponder: function(responder, callback){
      return nolsDB.saveResponder(responder, callback);
    },
    updateResponder: function(responderEl,responderId,responderVal) {
      var responderAttr = {};
      responderAttr[responderEl] = responderVal;
      nolsDB.updateResp(responderKind,responderId,responderAttr);
    },
    all: function(callback){
      return nolsDB.allKind('Responder', function(err,data){
        console.log(data);
        console.log(data.length)
        if(data.length <= 0){
          callback(null,null)
        }else{
          for(var i=0;i<data.length;i++){
            var responders = [];
            responders.push(data.item(i));
            callback(null,responders);
          }
        }
      })
    },
    get: function(callback) {
      return nolsDB.getKind('Responder', function(err,data){
        var responder = {};
        if(data === null) {k
          console.log(callback(null,null))
        }else{
          var len = data.length - 1;
          for(var i=len;i < data.length;i++){
            responder = angular.copy(data.item(i));
            console.log(callback(null,responder));
          }
        }
      });
    },
    executeCallbacks: function() {
      _.forEach(responder, function(value,key,myMap){
        if(value){
          console.log(value(key));
        }
      })
      responder = {};
    }
  }

  $rootScope.$watch(function() {
    return uiState.active.current;
  }, function(newValuem, oldValue){
    if(oldValue != newValue) {
      Responders.executeCallbacks();
    }

  })
})

.factory('Soaps', function(nolsDB,$cordovaGeolocation,$cordovaSocialSharing) {
  var soap = {};
  var soapKind = 'Soap';

  return {
    createSoapTable: function() {
      nolsDB.createSoapTable();
    },
    saveNewSoap: function(soapAttr,responderAttr,callback) {
      return nolsDB.saveSoap(soapAttr,responderAttr, callback);
    },
    updateSoap: function(soapEl,soapId,soapVal) {
      var soapAttr = {};
      //JSON.stringify
      soapAttr[soapEl] = soapVal;
      return nolsDB.soapUpdate(soapKind,soapId,soapAttr);
    },
    updateSoapQuery: function(elems,id,vals){
      var soapQuery = {};
      soapQuery[elems[0]] = vals[0];
      soapQuery[elems[1]] = vals[1];
      return nolsDB.soapUpdateQuery(soapKind,id,soapQuery);
    },
    all: function(mySoaps,callback) {
      var soaps = [];
      if(!mySoaps) {
        return nolsDB.allKind('Soap', function(err,data){
          for(var i=0;i < data.length;i++){
            soaps.push(data.item(i));
            callback(null,soaps)
          }
        })
      }else {
        return nolsDB.allKindQuery('Soap', {'starterFlag': 'true'}, function(err,data){
          for(var i=0;i < data.length;i++){
            soaps.push(data.item(i));
            callback(null,soaps);
          }
        })
      }
    },
    getLast: function(callback) {
      return nolsDB.allKind('Soap', function(err, data){
        var soap = {};
        if(data.length > 0){
          var len = data.length - 1;
          for(var i=len;i < data.length;i++){
            soap = data.item(i);
            var neededParams = {};
            neededParams['id'] = soap.id;
            neededParams['starterFlag'] = soap.starterFlag;
            callback(null, neededParams);
          }
        }else {
          callback(null, null);
        }
      })
    },
    get: function(soapId, callback) {
      return nolsDB.kind('Soap', {id: soapId}, function(err, data){
        for(var i=0;i < data.length;i++){
          callback(null,angular.copy(data.item(i)));
        }
      })
    },
    getLocation: function(callback){
      $cordovaGeolocation.getCurrentPosition().then(function(position){
        var patientCoords = [position.coords.latitude,position.coords.longitude];
        callback(null,patientCoords);
      })
    },
    sendEmail: function(message,subject,toAttr,bccArr,file,callback){

    $cordovaSocialSharing.shareViaEmail(message,subject,toAttr,bccArr,[],file).then(function(result){
        callback(result);
      })
    },
    deleteSoap: function(soapId){
      return nolsDB.deleteKind(soapKind,soapId);
    }

  }

})

.factory('Vitals', function(nolsDB) {
  var vitals = [];
  var vitalKind = "Vital";

  return {
    createVitalTable: function() {
      nolsDB.createVitalTable();
    },
    saveNewVital: function(vitalAttr, soapAttr, callback) {
      return nolsDB.saveVital(vitalAttr,soapAttr,callback);
    },
    updateVital: function(vitalEl,vitalId,vitalVal) {
      var vitalAttr = {};
      //JSON.stringify
      vitalAttr[vitalEl] = vitalVal;
      return nolsDB.vitalUpdate(vitalKind,vitalId,vitalAttr);
    },
    currentVitals: function(soap,callback) {
      return nolsDB.vitals('Vital', soap, function(err, data){
        var currentAllVitals = [],filteredCurrentVitals = [];

        var sortTimeTaken = function(vitalArray) {
          vitalArray.sort(function(a,b){
            return new Date('1970/01/01 ' + a.timeTaken) - new Date('1970/01/01 ' + b.timeTaken);
          })
          return vitalArray;
        }

        for(var i=0;i<data.length;i++){
          currentAllVitals.push(data.item(i));
        }

        filteredCurrentVitals = currentAllVitals.filter(function(entry){return entry.starterFlag == 'true';});
        var recentFilteredCurrentVitals = filteredCurrentVitals.reverse().slice(0,3)//Most recent 3 vitals
        callback(null,sortTimeTaken(currentAllVitals),sortTimeTaken(recentFilteredCurrentVitals));
      })
    },
    get: function(vitalId, callback) {
      return nolsDB.vital('Vital', {'id': vitalId}, function(err, data){
        for(var i=0;i < data.length;i++){
          callback(null,angular.copy(data.item(i)));
        }
      })
    },
    getLast: function(callback){
      return nolsDB.allKind('Vital', function(err,data){
        var vital = {};
        if(data.length > 0){
          var len = data.length - 1;
          for(var i=len;i<data.length;i++){
            vital = data.item(i);
            var neededParams = {};
            neededParams['id'] = vital.id;
            neededParams['soapId'] = vital.soapId;
            neededParams['starterFlag'] = vital.starterFlag;
            callback(null,neededParams);
          }
        }else {
          callback(null,null);
        }
      })
    },
    deleteVital: function(vitalId){
      return nolsDB.deleteVital(vitalId);
    }
  }
})

.factory('Camera', function(nolsDB, $cordovaCamera) {
  var imgKind = "Camera";
  return {
    createImgTable: function(){
      return nolsDB.createImgTable();
    },
    addNewImg: function(source,callback){
      //do something
    },
    getNewImg: function(type,callback){
      var getType = type === 'lib' ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA
      var save = type === 'lib' ? false : true

      var options = {
        quality : 49, //setting below 50 to avoid memory errors
        //destinationType : Camera.DestinationType.DATA_URL,
        sourceType : getType,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        saveToPhotoAlbum: save
      };

      $cordovaCamera.getPicture(options).then(function(imgData){
        callback(null,imgData);
      });
    },
    saveNewImg: function(imgAttr,soapAttr,callback){
      return nolsDB.saveImg(imgAttr,soapAttr,callback);
    },
    /*
    saveNewImg: function(imgPath,soap){
      return nolsDB.saveImg(imgPath,soap);
    },*/
    updateImg: function(imgEl,imgId,imgVal){
      var imgAttr = {};
      imgAttr[imgEl] = imgVal;
      return nolsDB.imgUpdate(imgKind,imgId,imgAttr);
    },
    updateImgStarter: function(imgEl,imgId,imgVal,callback){
      var starterAttr = {};
      starterAttr[imgEl] = imgVal;
      return nolsDB.imgStarterUpdate(imgKind,imgId,starterAttr,callback);
    },
    deleteImg: function(img){
      return nolsDB.deleteImg(img)
    },
    all: function(soap,callback){
      var images = [];
      return nolsDB.imgs('Camera',soap, function(err,data){
        for(var i = 0;i < data.length;i++){
          var imgData = angular.copy(data.item(i));
          images.push(imgData);
        }
        callback(null,images);
      })
    },
    allQuery: function(soapId, callback) {
      return nolsDB.allKindQuery('Camera', {'soapId': soapId}, function(err,data){
        var soapImgs = [];
        for(var i = 0;i<data.length;i++){
          soapImgs.push(data.item(i))
        }
        console.log(soapImgs)
        callback(null,soapImgs);
      })
    },
    getLast: function(callback){
      return nolsDB.allKind('Camera', function(err,data){
        var img = {};
        if(data.length > 0){
          var len = data.length - 1;
          for(var i=len;i<data.length;i++){
            img = data.item(i);
            var neededImgParams = {};
            neededImgParams['id'] = img.id;
            neededImgParams['soapId'] = img.soapId;
            neededImgParams['starterFlag'] = img.starterFlag;
            callback(null,neededImgParams);
          }
        }else {
          callback(null,null);
        }
      })
    }
  }
})

.factory('Nols', function(nolsDB) {
  return {
    cutLifeLine: function(){
      nolsDB.dropSoap();
      nolsDB.dropRes();
      nolsDB.dropVit();
      nolsDB.dropCam();
    }
  }
})


.factory('uiState', function(nolsDB) {
  var activeElement = {
    current: null,
    previous: null,
    post_val: null
  };

  return {
    blur: function(element) {
      activeElement.current = '';
      activeElement.previous = angular.element(element).attr("id");
      activeElement.post_val = angular.element(element).val();

      var kind = activeElement.previous;
      var kindProp = kind.substr(kind.indexOf('.') + 1);
      var kindType = kind.substr(0, kind.indexOf('.'));
    },
    focus: function(element) {
      activeElement.current = angular.element(element).attr("id");
    },
    active: activeElement
  };
});
