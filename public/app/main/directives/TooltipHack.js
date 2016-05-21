(function() {
	"use strict";
	angular.module('app').directive('tooltipHack',[
		function($q){
            return {
				restrict: 'A',
				link: function($scope, element, attrs) {
					setInterval(function(){
                        element.css({
                            left:"",
                            right:'85px'
                        });
                    },100);
				}
			};
		}]);
	}());
