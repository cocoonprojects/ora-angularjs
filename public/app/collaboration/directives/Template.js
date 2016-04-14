(function() {
	"use strict";

	angular.module('app').directive('template',[
			function(){
			return {
				restrict: 'A',
                scope:{
                    templateValue:'='
                },
				link: function($scope, element, attrs) {
                    var el = $(element);
					$scope.$watch('templateValue',function(newValue){
                        el.html(newValue);
                    });
                }
			};
		}
	]);
}());
