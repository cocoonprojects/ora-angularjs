(function() {
	"use strict";

	angular.module('app').directive('settingsMenu',[
			function(){
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'app/main/partials/settingsMenu.html',
                link: function($scope, element, attrs) {
					
                }
			};
		}
	]);
}());
