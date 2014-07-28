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
    	patientSex: 'Male',
      patientDob: '01/02/1989',
   		patientAge: 24,
   		created: '02/24/2014',
   		patientComplaint: 'Neck Pain',
   		patientOnset: 'rapid',
        patientPPalliates: 'Moving around makes it hurt. Staying still seems fine',
        patientQuality: 'Sharp',
        patientRadiates: 'To the right shoulder',
        patientSeverity: '8',
        patientTime: '1 hour',
        patientSpinal: 'no',
        patientFound: 'Sitting upright, complaining of neck pain',
        patientExamReveals: 'Bruise to the forehead',
        patientHistory: 'Lots of broken bones in the past, also a concussion a few months ago.',
        patientAllergies: 'Bee stings',
        patientMedications: 'Has epinepherine',
        patientMedicalHistory: '',
        patientLastIntake: 'glass of water this morning, PB & J sandwich an hour ago.',
        patientEventsForCause: '',
        patientAssessment: 'Current patient assessment',
        patientPlan: 'Have group help remove PX from camp, get them to medical facility',
        patientAnticipatedProblems: 'exfil from the backcountry could prove problematic.' },
    {
    	id: 1,
    	patientSex: 'Female',
    	patientAge: 32,
    	created: '01/09/2014',
    	patientComplaint: 'Broken leg'}
  ]
  return {
    all: function() {
      return soaps;
      console.log(soaps);
    },
    get: function(soapId) {
      return soaps[soapId];
    }
  };
});
