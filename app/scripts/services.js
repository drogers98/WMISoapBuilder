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
    },
    all: function() {
      //todo => return all responders
    }
  }

})

.factory('Soaps', function() {

});
