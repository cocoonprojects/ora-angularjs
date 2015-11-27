angular.module('oraApp')
	.controller('OrganizationListController', ['$scope', 'organizationService', 'memberService',
		function ($scope, organizationService, memberService) {
			$scope.organizations = organizationService.query();
			this.isAllowed = memberService.isAllowed.bind(memberService);
			this.joinOrganization = function(organization) {
				memberService.joinOrganization(organization, $scope.identity.updateMemberships);
			};
			this.unjoinOrganization = function(organization) {
				memberService.unjoinOrganization(organization, $scope.identity.updateMemberships);
			};
		}]);
