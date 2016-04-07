(function() {
	"use strict";

	var STATES = ['org.collaboration','org.organizationStatement','flow','org.decisions','org.people'];

	angular.module('app').directive('navigationBar',[
			'$state',
			'$stateParams',
			'identity',
			function(
				$state,
				$stateParams,
				identity){
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'app/main/partials/navigationBar.html',
                link: function($scope, element, attrs) {
					if($stateParams.orgId){
						$scope.organizationId = $stateParams.orgId;
					}else{
						$scope.organizationId = null;
						 identity.loadMemberships().then(function(memberships){
							 $scope.organizationId = memberships[0].organization.id;
						 });
					}
					$scope.selectedIndex = _.indexOf(STATES,$state.current.name);
                }
			};
		}
	]);
}());
