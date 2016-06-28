(function() {
	"use strict";
	angular.module('app').directive('tooltipHack',[
		function($q){
			return {
				restrict: 'A',
				link: function($scope, element, attrs) {
					var observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutationRecord) {
							element.css({
								left:"",
								right:'85px'
							});
						});
					});

					observer.observe(element[0], { attributes : true, attributeFilter : ['style'] });
				}
			};
		}]);
	}());
