angular.module('app')
	.controller('OrganizationListController', ['$scope', '$mdDialog', 'organizationService', 'memberService',
		function ($scope, $mdDialog, organizationService, memberService) {
			$scope.organizations = organizationService.query();
			this.isAllowed = memberService.isAllowed.bind(memberService);
			this.joinOrganization = function(organization) {
				memberService.joinOrganization(organization, $scope.identity.updateMemberships);
			};
			this.unjoinOrganization = function(organization) {
				memberService.unjoinOrganization(organization, $scope.identity.updateMemberships);
			};
			this.openNewOrganization = function(ev) {
				$mdDialog.show({
					controller: NewOrganizationController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/organizations/partials/new-organization.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true
				}).then(this.addOrganization);
			};
			this.addOrganization = function(organization) {
				$scope.organizations._embedded['ora:organization'].unshift(organization);
				$scope.identity.updateMemberships();
			};
		}]);
