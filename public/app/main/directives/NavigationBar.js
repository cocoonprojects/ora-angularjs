(function() {
    "use strict";

    angular.module('app').directive('navigationBar',
        function() {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/main/partials/navigationBar.html',
                link: function($scope, element, attrs) {

                }
            };
        }
    );
}());
