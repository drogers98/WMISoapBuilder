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
         "incidentDate": {"type": "DATE","null": "NOT NULL"},
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
         "responderFirstName": responderAttr.firstName,
         "responderLastName": responderAttr.lastName,
         "responderUid": responderAttr.id,
         "incidentDate": soapAttr.incidentDate,
         "incidentLocation": soapAttr.incidentLocation,
         "incidentLat": soapAttr.incidentLat,
         "incidentLon": soapAttr.incidentLon,
         "patientInitials": soapAttr.patientInitials,
         "patientGender": soapAttr.patientGender,
         "patientDob": soapAttr.patientDob,
         "patientAge": soapAttr.patientAge,
         "patientLOR": soapAttr.patientLOR,
         "patientComplaint": soapAttr.patientComplaint,
         "patientOnset": soapAttr.patientOnset,
         "patientPPalliates": soapAttr.patientPPalliates,
         "patientQuality": soapAttr.patientQuality,
         "patientRadiates": soapAttr.patientRadiates,
         "patientSeverity": soapAttr.patientSeverity,
         "patientTime": soapAttr.patientTime,
         "patientHPI": soapAttr.patientHPI,
         "patientSpinal": soapAttr.patientSpinal,
         "patientFound": soapAttr.patientFound,
         "patientExamReveals": soapAttr.patientExamReveals,
         "patientSymptoms": soapAttr.patientSymptoms,
         "patientAllergies": soapAttr.patientAllergies,
         "patientMedications": soapAttr.patientMedications,
         "patientMedicalHistory": soapAttr.MedicalHistory,
         "patientLastIntake": soapAttr.LastIntake,
         "patientEventsForCause": soapAttr.patientEventsForCause,
         "patientAssessment": soapAttr.patientAssessment,
         "patientPlan": soapAttr.patientPlan,
         "patientAnticipatedProblems": soapAttr.patientAnticipatedProblems
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
     soaps: function(callback) {
       var soaps = []
       self.db.selectAll("Soap").then(function(results) {
          for(var i=0; i < results.rows.length; i++){
            soaps.push(results.rows.item(i));
            callback(null, soaps);
          }
       })
     },
     soap: function(object, query, callback) {
      self.db.select(object,query).then(function(results){
        callback(null, results.rows);
      })
     },
     soapUpdate: function(newSoapParam) {
       var objectForUpdate = function(newSoapParam) {
         var  buildKeyValue = {};
         buildKeyValue[newSoapParam.key] = newSoapParam.val;
         return buildKeyValue;
       }

       var grabLastId = function(){
         self.db.selectAll('Soap').then(function(results){
           for(var i = results.rows.length - 1;i < results.rows.length;i++){
             var soapID = results.rows.item(i).id;
           }
           self.db.update('Soap', objectForUpdate(newSoapParam),{
             "id": soapID
           })
         })
       }
       grabLastId()

     },
     dropSoap: function() {
       self.db.dropTable("Soap");
     },
     dropRes: function(){
       self.db.dropTable("Responder");
     },
     createVitalTable: function() {
       self.db.createTable('Vital', {
         "id": {"type": "INTEGER", "null": "NOT NULL", "primary": true, "auto_increment": true},
         "created": {"type": "TIMESTAMP", "null": "NOT NULL", "default": "CURRENT_TIMESTAMP" },
         "lor": {"type": "TEXT", "null": "NOT NULL"}
       })
     },
     saveVital: function(vitalAttr) {
       self.db.insert('Vital', {
         "lor": vitalAttr.lor
       }).then(function(results) {
         console.log(results.insertId);
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
.factory('Vitals', function(nolsDB) {
  var vitals = [];

  return {
    createNewVital: function(vitalData) {
      nolsDB.createVitalTable();
      var vitalAttr = angular.fromJson(vitalData);
      nolsDB.saveVital(vitalAttr);
    },
    all: function() {
      return vitals;
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
    updateSoap: function(newSoapParam) {
      nolsDB.soapUpdate(newSoapParam);
    },
    all: function(callback) {
    return nolsDB.soaps(callback)
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
    drop: function(){
      nolsDB.dropSoap();
      nolsDB.dropRes();
    }

  }




  /*var soaps = [
    {
    	id: 0,
    	created: '02/24/2014',
    	responderFirstName: 'Dan',
    	responderLastName: 'Rogers',
    	responderLevelOfTraining: 'WEMT',
    	incidentDate: '02/24/2014',
    	incidentLocation: 'Mt Moran',
    	incidentLat: '12345678',
    	incidentLon: '12345678',
    	patientInitials: 'RC',
    	patientSex: 'Male',
		  patientDob: '01/02/1989',
   		patientAge: 24,
   		patientLOR: 'Awake & Oriented x 3',
   		patientComplaint: 'Neck Pain',
   		patientOnset: 'rapid',
        patientPPalliates: 'Moving around makes it hurt. Staying still seems fine',
        patientQuality: 'Sharp',
        patientRadiates: 'To the right shoulder',
        patientSeverity: '8',
        patientTime: '1 hour',
        patientHPI: 'Was scrambling down the CMC route on Mt. Moran, and slipped. Patient fell aprox 30 feet onto a ledge.',
        patientSpinal: 'Yes',
        patientFound: 'Sitting upright, complaining of neck pain',
        patientExamReveals: 'Bruise to the forehead',
        patientSymptoms: 'Dizzy, lightheaded, nautious.',
        patientAllergies: 'Bee stings',
        patientMedications: 'Has epinepherine',
        patientMedicalHistory: 'Previous concussion',
        patientLastIntake: 'glass of water this morning, PB & J sandwich an hour ago.',
        patientEventsForCause: 'Be was buzzing around, tried to swat it and fell.',
        patientAssessment: 'Patient likely incured spinal injury on fall. Check for bee stings negligible.',
        patientPlan: 'Have group help remove PX from camp, get them to medical facility.',
        patientAnticipatedProblems: 'Exfil from the backcountry could prove problematic.' }
  ]
  */


});
