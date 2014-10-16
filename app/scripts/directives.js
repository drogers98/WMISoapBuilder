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
        //console.log('focused')
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
            elm.bind('focus', function() {
              elm.toggleClass("turnOn");
              //ngModelCtrl.$setViewValue(console.log(elm.css()));
            })
            elm.bind('blur', function() {
                elm.toggleClass("turnOn");
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
})
/*
.directive('ngConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }])*/
