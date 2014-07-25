'use strict';
angular.module('WMISoapBuilder.services', ['angular-websql'])

/**
 * A simple example service that returns some data.
 */

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
