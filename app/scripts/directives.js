'use strict';
angular.module('WMISoapBuilder.directives', ['angular-websql', 'debounce'])

.directive('input', function(uiState) {
  return {
    restrict: 'E',
    scope: false,
    link: function(scope,element,attrs) {
      angular.element(element).bind('blur', function(e) {
        scope.$apply(uiState.blur(element));
      });
      angular.element(element).bind('focus', function(e) {
        scope.$apply(uiState.focus(element));
      });
    }
  }
})

.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 1,
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');

            /*
            elm.bind('focus', function() {
              if(elm.val() === 'First Name' || elm.val() === 'Last Name'){
                scope.$apply(function(){
                  ngModelCtrl.$setViewValue("");
                })
              }
            })*/

            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});
