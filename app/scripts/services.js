'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql'])

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
         "id": {
           "type": "INTEGER",
           "null": "NOT NULL",
           "primary": true,
           "auto_increment": true
         },
         "created": {
           "type": "TIMESTAMP",
           "null": "NOT NULL",
           "default": "CURRENT_TIMESTAMP"
         },
         "firstName": {
           "type": "TEXT",
           "null": "NOT NULL"
         },
         "lastName": {
           "type": "TEXT",
           "null": "NOT NULL"
         },
         "trainingLevel": {
           "type": "TEXT",
           "null": "NOT NULL"
         }
       });
     },
     saveResponder: function(responderAttr) {
       self.db.insert('Responder', {
         "firstName": responderAttr.responder.firstName,
         "lastName": responderAttr.responder.lastName,
         "trainingLevel": responderAttr.responder.trainingLevel
       }).then(function(results){
         //todo => save last inserted id for current responder
         console.log(results.insertId);
       })

     },
     allResponders: function() {

     }
   };


 })

.factory('Responders', function(nolsDB) {
  var responders = [];

  return {
    createNewResponder: function(responderData){
      //Create responder table if not exist
      //Alter passed responder json
      //Call save responder passing altered json
      nolsDB.createResponderTable();
      var responderAttr = angular.fromJson(responderData);
      nolsDb.saveResponder(responderAttr);
    }
  }

})
.factory('Vitals', function() {
  var vitals = [
  {
    time: '7:00PM'
  }
  ]
  return {
    all: function() {
      return vitals;
    }
  }
})

.factory('Soaps', function() {
  //SEED DATA

  /*
  patientAge: wmi.patientAge,
        patientDob: wmi.patientDob,
        chiefComplaint: wmi.chiefComplaint,
        patientOnset: wmi.patientOnset,
        patientPPalliates: wmi.patientPPalliates,
        patientQuality: wmi.patientQuality,
        patientRadiates: wmi.patientRadiates,
        patientSeverity: wmi.patientSeverity,
        patientTime: wmi.patientTime,
        patientSpinal: wmi.patientSpinal,
        patientFound: wmi.patientFound,
        patientExamReveals: wmi.patientExamReveals,
        patientHistory: wmi.patientHistory,
        patientAllergies: wmi.patientAllergies,
        patientMedications: wmi.patientMedications,
        patientMedicalHistory: wmi.patientMedicalHistory,
        patientLastIntake: wmi.patientLastIntake,
        patientEventsForCause: wmi.patientEventsForCause,
        patientAssessment: wmi.patientAssessment,
        patientPlan: wmi.patientPlan,
        patientAnticipatedProblems: wmi.patientAnticipatedProblems
        */


  var soaps = [
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
  return {
    all: function() {
      return soaps;
    },
    get: function(soapId) {
      return soaps[soapId];
    }
  };
});




