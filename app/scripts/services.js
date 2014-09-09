'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql', 'debounce'])

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
         "trainingLevel": {"type": "TEXT","null": "NOT NULL"}
       });
     },
     saveResponder: function(responder, callback) {
       self.db.insert('Responder', {
         "firstName": responder.firstName,
         "lastName": responder.lastName,
         "trainingLevel": responder.trainingLevel
       }).then(function(results){
         self.db.select("Responder", {
           "id": results.insertId
         }).then(function(results) {
           for(var i=0; i < results.rows.length;i++){
              callback(null, angular.copy(results.rows.item(i)));
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
         "patientTime": {"type": "TEXT","null": "NOT NULL"},
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
     saveSoap: function(soapAttr, responderAttr, callback) {
       var soap = {};
       self.db.insert('Soap', {
         "responderFirstName": responderAttr.firstName || '',
         "responderLastName": responderAttr.lastName || '',
         "responderUid": responderAttr.id || '',
         "responderTrainingLevel": responderAttr.trainingLevel || '',
         "incidentDate": soapAttr.incidentDate || '',
         "incidentLocation": soapAttr.incidentLocation || '',
         "incidentLat": soapAttr.incidentLat || '',
         "incidentLon": soapAttr.incidentLon || '',
         "patientInitials": soapAttr.patientInitials || 'NO INITIALS',
         "patientGender": soapAttr.patientGender || 'NO SEX',
         "patientDob": soapAttr.patientDob || '',
         "patientAge": soapAttr.patientAge || 'NO AGE',
         "patientLOR": soapAttr.patientLOR || '',
         "patientComplaint": soapAttr.patientComplaint || '',
         "patientOnset": soapAttr.patientOnset || '',
         "patientPPalliates": soapAttr.patientPPalliates || '',
         "patientQuality": soapAttr.patientQuality || '',
         "patientRadiates": soapAttr.patientRadiates || '',
         "patientSeverity": soapAttr.patientSeverity || '',
         "patientTime": soapAttr.patientTime || '',
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
             callback(null, angular.copy(results.rows.item(i)));
           }
         })
       })
     },
     createVitalTable: function() {
       self.db.createTable('Vital', {
         "id": {"type": "INTEGER", "null": "NOT NULL", "primary": true, "auto_increment": true},
         "created": {"type": "TIMESTAMP", "null": "NOT NULL", "default": "CURRENT_TIMESTAMP" },
         "soapId": {"type": "INTEGER", "null": "NOT NULL"},
         "timeTaken": {"type": "TEXT", "null": "NOT NULL"},
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
         "brradialpulse": {"type": "TEXT", "null": "NOT NULL"},
         "brsystolic": {"type": "INTEGER", "null": "NOT NULL"},
         "brradialtaken": {"type": "TEXT", "null": "NOT NULL"},
         "brradialReading": {"type": "INTEGER", "null": "NOT NULL"},
         "pupils": {"type": "TEXT", "null": "NOT NULL"},
         "tempDegreesReading": {"type": "INTEGER", "null": "NOT NULL"},
         "tempDegrees": {"type": "TEXT", "null": "NOT NULL"}

       })
     },
     saveVital: function(vitalAttr, soapAttr, callback) {
       var vital = {};
       function getDateTime() {
         var d = new Date();
         d.toLocaleString();       // -> "2/1/2013 7:37:08 AM"
         d.toLocaleDateString();   // -> "2/1/2013"
         return d.toLocaleTimeString();
       }

       self.db.insert('Vital', {
         "soapId": soapAttr,
         "lor": vitalAttr.lor || '',
         "timeTaken": vitalAttr.timeTaken || getDateTime(),
         "rate": vitalAttr.rate || '',
         "heartRythm": vitalAttr.heartRythm || '',
         "heartQuality": vitalAttr.heartQuality || '',
         "respRate": vitalAttr.respRate || '',
         "respRhythm": vitalAttr.rrhythm || '',
         "respQuality": vitalAttr.rquality || '',
         "sctmcolor": vitalAttr.sctmcolor || '',
         "sctmtemp": vitalAttr.sctmtemp || '',
         "sctmmoisture": vitalAttr.sctmmoisture || '',
         "brradialpulse": vitalAttr.brradialpulse || '',
         "brsystolic": vitalAttr.brsystolic|| '',
         "brradialtaken": vitalAttr.brradialtaken || '',
         "brradialReading": vitalAttr.brradialReading || '',
         "pupils": vitalAttr.pupils || '',
         "tempDegreesReading": vitalAttr.tempDegreesReading || '',
         "tempDegrees": vitalAttr.tempDegrees || ''
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
     createImageTable: function() {
       self.db.createTable('Camera', {
         "id": {"type": "INTEGER", "null": "NOT NULL", "primary": true, "auto_increment":true},
         "created": {"type": "TIMESTAMP", "null": "NOT NULL", "default": "CURRENT_TIMESTAMP"},
         "imageURI": {"type": "STRING", "null": "NOT NULL"}
       })
     },
     saveNewImage: function(cameraAttr,callback) {
       var img = {};
       self.db.insert('Camera', {
         "imageURI": cameraAttr.image
       }).then(function(results){
         self.db.select('Camera', {
           "id": results.insertId
         }).then(function(results){
           for(var i=0;i < results.rows.length;i++){
             img = results.rows.item(i);
             callback(null,img)
           }
         })
       })
     },
     getKind: function(object,callback) {
       self.db.selectAll(object).then(function(results) {
        callback(null,results.rows);
      }, function(){
         callback(null,null);
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
       self.db.selectAll('Soap').then(function(results){
         callback(null,results.rows);
       })
     },
     kind: function(object, query, callback) {
      self.db.select(object,query).then(function(results){
        callback(null, results.rows);
      })
     },
     soapUpdate: function(newKey,newVal) {
       var objectForUpdate = function(newKey,newVal) {
         var  buildKeyValue = {};
         buildKeyValue[newKey] = newVal;
         console.log(buildKeyValue);
       }
       var grabLastId = function(){
         self.db.selectAll('Soap').then(function(results){
           for(var i = results.rows.length - 1;i < results.rows.length;i++){
             var soapID = results.rows.item(i).id;
           }
           self.db.update('Soap', objectForUpdate(newKey,newVal),{
             "id": soapID
           })
         })
       }
       grabLastId();
     },
     deleteKind: function(kind,id){
       self.db.del(kind,{"id": id});
       if(kind == 'Soap') {
         self.db.del('Vital',{"soapId":id});
       }
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

     vitalUpdate: function(newVitalParam){
       var objectForUpdate = function(newVitalParam){
         var buildKeyValue = {};
         buildKeyValue[newVitalParam.key] = newVitalParam.val;
         return buildKeyValue;
       }
       var grabLastId = function(){
         self.db.selectAll('Vital').then(function(results){
           for(var i = results.rows.length - 1;i < results.rows.length;i++){
             var vitalID = results.rows.item(i).id;
           }
           self.db.update('Vital', objectForUpdate(newVitalParam), {
             "id": vitalID
           })
         })
       }
       grabLastId();
     },
     vitals: function(object, query, callback){
       self.db.select(object,query).then(function(results){
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

     imgs: function(object,callback){
       self.db.selectAll('Camera').then(function(results){
         callback(null,results.rows);
       })
     }

   };

 })

.factory('Responders', function(nolsDB, uiState, $rootScope) {
  var responder = {};
  var responderNewParams = [];
  var responderKind = 'Responder';

  return {
    updateResponder: function(responder) {
      nolsDB.updateKind(responder, responderKind);
    },
    createResponderTable: function(){
      nolsDB.createResponderTable();
    },
    saveResponder: function(responder, callback){
      return nolsDB.saveResponder(responder, callback);
    },
    get: function(callback) {
      return nolsDB.getKind('Responder', function(err,data){
        var responder = {};
        if(data === null) {
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

.factory('Soaps', function(nolsDB) {
  var soap = {};
  var soapKind = 'Soap';

  return {
    createSoapTable: function() {
      nolsDB.createSoapTable();
    },
    saveNewSoap: function(soapAttr, responderAttr, callback) {
      return nolsDB.saveSoap(soapAttr, responderAttr, callback);
    },
    updateSoap: function(soap) {
      return nolsDB.updateKind(soap,soapKind);
    },
    all: function(callback) {
    return nolsDB.allKind('Soap', function(err,data){
      var soaps = [];
      for(var i=0;i < data.length;i++){
        soaps.push(data.item(i));
        callback(null,soaps)
      }
    })
    },
    getLast: function(callback) {
      return nolsDB.allKind('Soap', function(err, data){
        var soap = {};
        var len = data.length - 1;
        for(var i=len;i < data.length;i++){
          soap = data.item(i);
          callback(null, soap.id);
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
    deleteSoap: function(soapId){
      return nolsDB.deleteKind(soapKind,soapId);
    }

  }

})

.factory('Vitals', function(nolsDB) {
  var vitals = [];

  return {
    createVitalTable: function() {
      nolsDB.createVitalTable();
    },
    saveNewVital: function(vitalAttr, soapAttr, callback) {
      return nolsDB.saveVital(vitalAttr,soapAttr,callback);
    },
    updateVital: function(newVitalParam) {
      nolsDB.vitalUpdate(newVitalParam);
    },
    all: function(soap,callback) {
      return nolsDB.vitals('Vital', {'soapId': soap}, function(err,data){
        var vitals = [];
        var recentSoapVitals = [];
        for(var i=0;i < data.length;i++){
          vitals.push(data.item(i));
        }
        var len = function() {
          if(data.length <= 0) {return;}
          else if (data.length <= 1){return 0;}
          else if (data.length <= 2){return data.length - 2;}
          else {return data.length - 3;}
        }
        for(var i = len();i < data.length;i++){
          recentSoapVitals.push(data.item(i));
        }
        callback(null,vitals,recentSoapVitals);
      })
    },
    get: function(vitalId, callback) {
      return nolsDB.vital('Vital', {'id': vitalId}, function(err, data){
        for(var i=0;i < data.length;i++){
          console.log(data.item(i));
          callback(null,data.item(i));
        }
      })
    },
    deleteVital: function(vitalId){
      return nolsDB.deleteVital(vitalId);
    }
  }
})

.factory('Camera', function(nolsDB) {

  var imgs = [];
  return {
    createImgTable: function(){
      return nolsDB.createImgTable();
    },
    getNewImg: function(callback){
      return navigator.camera.getPicture(function(result){
        callback(null,result);
      });
    },
    saveNewImg: function(callback){
    return nolsDB.saveImg(callback);
    },
    all: function(callback){
      //{'soapId': soap}, put this back when ready
      return nolsDB.imgs('Camera', function(err,data){
        for(var i=0;i<data.length;i++){
          imgs.push(data.item(i));
        }
        callback(null,imgs);
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
      nolsDB.dropImg();
    }
  }
})


.factory('uiState', function() {
  var activeElement = {
    current: null,
    previous: null
  };

  return {
    blur: function(element) {
      activeElement.current = '';
      activeElement.previous = angular.element(element).attr("id");
    },
    focus: function(element) {
      activeElement.current = angular.element(element).attr("id");
    },
    active: activeElement
  };
});
