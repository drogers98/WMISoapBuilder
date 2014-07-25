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

     },
     saveResponder: function() {

     },
     allResponders: function() {

     }
   };


 })

.factory('Responders', function() {
  var responders = [];

  return {
    createNewResponder: function(responderData){
      //todo => pass data to websql methods
    },
    all: function() {
      //todo => return all responders
    }
  }

})

.factory('Soaps', function() {

});
