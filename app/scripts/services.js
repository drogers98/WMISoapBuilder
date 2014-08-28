'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql', 'debounce'])

/**
 * A simple example service that returns some data.
 */

 //a websql factory for nols-wmi database
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
              callback(null, results.rows.item(i));
           }
         })
       })
     },
     getResponder: function(callback) {
       var responder;
       self.db.selectAll("Responder").then(function(results) {
          var len = results.rows.length - 1;
          for(var i=len; i < results.rows.length; i++){
            responder = results.rows.item(i);
            callback(null, responder);
          }
       }, function(){
         callback(null,null);
       })
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
             soap = results.rows.item(i);
             callback(null, soap);
           }
         })
       })


     },
     /*soaps: function(callback) {
       var soaps = []
       self.db.selectAll("Soap").then(function(results) {
          for(var i=0; i < results.rows.length; i++){
            soaps.push(results.rows.item(i));
            callback(null, soaps);
          }
       })
     },*/
     soaps: function(object,callback){
       self.db.selectAll('Soap').then(function(results){
         callback(null,results.rows);
       })
     },
     soap: function(object, query, callback) {
      self.db.select(object,query).then(function(results){
        callback(null, results.rows);
      })
     },
     soapUpdate: function(newKey,newVal) {
       var objectForUpdate = function(newKey,newVal) {
         var  buildKeyValue = {};
         buildKeyValue[newKey] = newVal;
         return buildKeyValue;
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
     deleteSoap: function(soapId){
       self.db.del('Soap',{"id": soapId});
       self.db.del('Vital',{"soapId":soapId});
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
         var now     = new Date();
         var year    = now.getFullYear();
         var month   = now.getMonth()+1;
         var day     = now.getDate();
         var hour    = now.getHours();
         var minute  = now.getMinutes();
         var second  = now.getSeconds();
         if(month.toString().length == 1) {
           var month = '0'+month;
         }
         if(day.toString().length == 1) {
           var day = '0'+day;
         }
         if(hour.toString().length == 1) {
           var hour = '0'+hour;
         }
         if(minute.toString().length == 1) {
           var minute = '0'+minute;
         }
         if(second.toString().length == 1) {
           var second = '0'+second;
         }
         //year+'/'+month+'/'+day+' '+
         var dateTime = hour+':'+minute+':'+second;
         return dateTime;
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
     }

   };


 })

.factory('Responders', function(nolsDB) {
  var responder = [];

  return {
    createResponderTable: function(){
      nolsDB.createResponderTable();
    },
    saveResponder: function(responder, callback){
      return nolsDB.saveResponder(responder, callback);
    },
    get: function(callback) {
      return nolsDB.getResponder(callback);
    }
  }

})

.factory('Soaps', function(nolsDB) {

  return {
    createSoapTable: function() {
      nolsDB.createSoapTable();
    },
    saveNewSoap: function(soapAttr, responderAttr, callback) {
      return nolsDB.saveSoap(soapAttr, responderAttr, callback);
    },
    updateSoap: function(newKey,newVal) {
      return nolsDB.soapUpdate(newKey,newVal);
    },
    all: function(callback) {
    return nolsDB.soaps('Soap', function(err,data){
      var soaps = [];
      for(var i=0;i < data.length;i++){
        soaps.push(data.item(i));
        callback(null,soaps)
      }
    })
    },
    getLast: function(callback) {
      return nolsDB.soaps('Soap', function(err, data){
        var soap = {};
        var len = data.length - 1;
        for(var i=len;i < data.length;i++){
          soap = data.item(i);
          callback(null, soap.id);
        }
      })
    },
    get: function(soapId, callback) {
      return nolsDB.soap('Soap', {id: soapId}, function(err, data){
        for(var i=0;i < data.length;i++){
          callback(null,data.item(i));
        }
      })
    },
    deleteSoap: function(soapId){
      return nolsDB.deleteSoap(soapId);
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
    }
  }
})

.factory('Nols', function(nolsDB) {
  return {
    cutLifeLine: function(){
      nolsDB.dropSoap();
      nolsDB.dropRes();
      nolsDB.dropVit();
    }
  }
});
