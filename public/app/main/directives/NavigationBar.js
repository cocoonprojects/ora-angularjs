(function() {
	"use strict";

	var STATES = ['org.collaboration','org.organizationStatement','flow','org.decisions','org.people'];

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

					$scope.selectedIndex = _.indexOf(STATES,$state.current.name);
                }
			};
		}
	]);
}());
