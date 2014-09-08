'use strict';
angular.module('WMISoapBuilder.directives', ['angular-websql', 'debounce'])

.directive('input', function(uiState) {
  return {
    restrict 'E',
    scope: false,
    link: function(scope,element,attrs){
      $(element).bind('blur', function(e) {
        scope.$apply(uiState.blur(element));
      });
      $(element).bind('focus', function(e) {
        scope.$apply(uiState.focus(element));
      });
    }
  }
})
