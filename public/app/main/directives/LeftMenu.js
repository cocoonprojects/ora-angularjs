(function() {
    "use strict";

    angular.module('app').directive('leftMenu',[
        function(){
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/main/partials/leftMenu.html',
                link: function($scope, element, attrs) {
                    
                }
            };
        }
    ]);
}());
