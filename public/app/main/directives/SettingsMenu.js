(function() {
	"use strict";
	angular.module('app').directive('settingsMenu',[
			'SelectedOrganizationId',
			'identity',
			function(
				SelectedOrganizationId,
				identity){
				return {
					restrict: 'E',
					replace: true,
					templateUrl: 'app/main/partials/settingsMenu.html',
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
	                }
				};
		}
	]);
}());
