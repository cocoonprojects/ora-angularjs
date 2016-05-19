(function() {
	"use strict";

	var STATES = ['org.collaboration','org.organizationStatement','flow','org.decisions','org.people'];
	var MINORSTATES = {
		"org.item":"org.collaboration"
	};

	var checkSelectedStateIndex = function(currentState) {
		currentState = MINORSTATES[currentState] || currentState;
		return _.indexOf(STATES,currentState);
	};

	angular.module('app').directive('navigationBar',[
			'$state',
			'identity',
			'SelectedOrganizationId',
			function(
				$state,
				identity,
				SelectedOrganizationId){
			return {
				restrict: 'E',
				replace: true,
				templateUrl: 'app/main/partials/navigationBar.html',
                link: function($scope, element, attrs) {
					var selectedOrganizationId = SelectedOrganizationId.get();
					if(selectedOrganizationId){
						$scope.organizationId = selectedOrganizationId;
					}else{
						$scope.organizationId = null;
						identity.loadMemberships().then(function(memberships){
							if(memberships && memberships.length){
								$scope.organizationId = memberships[0].organization.id;
							}
						});
					}

					$scope.selectedIndex = checkSelectedStateIndex($state.current.name);

					$scope.$on('$stateChangeSuccess',
	                    function(event, toState) {
                        	$scope.selectedIndex = checkSelectedStateIndex(toState.name);
	                    }
	                );


                }
			};
		}
	]);
}());
