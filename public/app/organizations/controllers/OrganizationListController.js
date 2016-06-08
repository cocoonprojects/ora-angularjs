angular.module('app')
	.controller('OrganizationListController', [
		'$scope',
		'$mdDialog',
		'memberService',
		function (
			$scope,
			$mdDialog,
			memberService) {

			var load = function(){
				$scope.identity.loadMemberships().then(function(memberships){
					$scope.organizations = _.map(memberships,function(m){
						return m.organization;
					});
				});
			};

			this.isAllowed = memberService.isAllowed.bind(memberService);
			$scope.organizations = [];

			this.unjoinOrganization = function(organization) {
				memberService.unjoinOrganization(organization, function(){
					$scope.identity.updateMemberships();
					$scope.organizations = _.without($scope.organizations,organization);
				});
			};

			this.openNewOrganization = function(ev) {
				$mdDialog.show({
					controller: NewOrganizationController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/organizations/partials/new-organization.html",
					targetEvent: ev,
					clickOutsideToClose: true
				}).then(this.addOrganization);
			};

			this.addOrganization = function(organization) {
				$scope.organizations.unshift(organization);
				$scope.identity.updateMemberships();
			};

			load();
		}]);
