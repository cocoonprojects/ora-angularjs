(function() {
  "use strict";

  angular.module('app')
    .constant('TASK_STATUS_COLORS', {
      0: '#ebeef0',
      10: '#bec9d0',
      20: '#9eaeb6',
      30: '#44515a',
      40: '#1e2c36',
      50: '#050e14',
      '-20': '#ebeef0'
    })
    .directive('itemCardColor', [
      "TASK_STATUS_COLORS",
      function(TASK_STATUS_COLORS) {
        return {
          restrict: 'A',
          scope: {
            card: '='
          },
          link: function($scope, element, attrs) {
            $scope.$watch('card', function(card) {
              element.parent('md-card').css('border-left-color',TASK_STATUS_COLORS[card.status]);
            });
          }


        };
      }
    ]);
}());
