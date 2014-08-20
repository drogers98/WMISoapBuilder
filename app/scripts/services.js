'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql', 'debounce'])

/**
 * A simple example service that returns some data.
 */

 //a websql factory for nols-wmi database
 .factory('nolsDB', function($webSql) {
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
     saveResponder: function(responderAttr) {
       self.db.insert('Responder', {
         "firstName": responderAttr.responder.firstName,
         "lastName": responderAttr.responder.lastName,
         "trainingLevel": responderAttr.responder.trainingLevel
       }).then(function(results){
         self.db.select("Responder", {
           "id": results.insertId
         }).then(function(results) {
           for(var i=0; i < results.rows.length;i++){
             console.log(results.rows.item(i));

           }
         })
       })
     },
     createSoapTable: function() {
       self.db.createTable('Soap', {
         "id": {"type": "INTEGER","null": "NOT NULL","primary": true,"auto_increment": true},
         "created": {"type": "TIMESTAMP","null": "NOT NULL","default": "CURRENT_TIMESTAMP"},
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
     saveSoap: function(soapAttr) {
       self.db.insert('Soap', {
         "incidentDate": soapAttr.soap.incidentDate,
         "incidentLocation": soapAttr.soap.incidentLocation,
         "incidentLat": soapAttr.soap.incidentLat,
         "incidentLon": soapAttr.soap.incidentLon,
         "patientInitials": soapAttr.soap.patientInitials,
         "patientGender": soapAttr.soap.patientGender,
         "patientDob": soapAttr.soap.patientDob,
         "patientAge": soapAttr.soap.patientAge,
         "patientLOR": soapAttr.soap.patientLOR,
         "patientComplaint": soapAttr.soap.patientComplaint,
         "patientOnset": soapAttr.soap.patientOnset,
         "patientPPalliates": soapAttr.soap.patientPPalliates,
         "patientQuality": soapAttr.soap.patientQuality,
         "patientRadiates": soapAttr.soap.patientRadiates,
         "patientSeverity": soapAttr.soap.patientSeverity,
         "patientTime": soapAttr.soap.patientTime,
         "patientHPI": soapAttr.soap.patientHPI,
         "patientSpinal": soapAttr.soap.patientSpinal,
         "patientFound": soapAttr.soap.patientFound,
         "patientExamReveals": soapAttr.soap.patientExamReveals,
         "patientSymptoms": soapAttr.soap.patientSymptoms,
         "patientAllergies": soapAttr.soap.patientAllergies,
         "patientMedications": soapAttr.soap.patientMedications,
         "patientMedicalHistory": soapAttr.soap.MedicalHistory,
         "patientLastIntake": soapAttr.soap.LastIntake,
         "patientEventsForCause": soapAttr.soap.patientEventsForCause,
         "patientAssessment": soapAttr.soap.patientAssessment,
         "patientPlan": soapAttr.soap.patientPlan,
         "patientAnticipatedProblems": soapAttr.soap.patientAnticipatedProblems
       }).then(function(results){
         console.log(results.insertId);
       })
     },
     soaps: function(soaps) {
       soaps = [];
       self.db.selectAll("Soap").then(function(results) {
          for(var i=0; i < results.rows.length; i++){
          soaps.push(results.rows.item(i));
          }
       })
       return soaps;
     },
     soap: function(soapId) {
       var soap = "";
       self.db.select("Soap", {
         "id": soapId
       }).then(function(results) {
         for(var i=0; i < results.rows.length;i++){
           console.log(results.rows.item(i));
         }
       })
     },
     soapUpdate: function(newSoapParam) {
       self.db.update('Soap', {newSoapParam.column: newSoapParam.val} {
         "id": newSoapParam.id
       })
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
    createNewResponder: function(responderData, responder){
      nolsDB.createResponderTable();
      var responderAttr = angular.fromJson(responderData);
      return nolsDB.saveResponder(responderAttr);
      console.log(responder);
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
  var soaps = [];

  return {
    createNewSoap: function(soapData) {
      nolsDB.createSoapTable();
      var soapAttr = angular.fromJson(soapData);
      nolsDB.saveSoap(soapAttr);
      soaps.push(soapAttr);
      console.log(soaps);
    },
    updateSoap: function(newSoapParam) {
      //make sure soap ID is being sent
      nolsDB.soapUpdate(newSoapParam);
    },
    all: function() {
    return nolsDB.soaps(soaps);
    },
    get: function(soapId) {
    return nolsDB.soap(soapId);
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
