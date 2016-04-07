(function() {
	"use strict";

	var STATES = ['org.collaboration','org.organizationStatement','flow','org.decisions','org.people'];

	angular.module('app').directive('navigationBar',['$state',function($state){
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'app/main/partials/navigationBar.html',
                link: function($scope, element, attrs) {
					$scope.selectedIndex = _.indexOf(STATES,$state.current.name);
                    console.log($scope.selectedIndex);
                }
			};
		}
	]);
}());
