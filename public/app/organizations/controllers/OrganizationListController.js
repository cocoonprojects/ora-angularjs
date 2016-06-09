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

			this.unjoinOrganization = function(ev, organization) {
				var confirm = $mdDialog.confirm()
						.title("Are you sure you want to unjoin the organization '" + organization.name + "'?")
						.textContent("This operation cannot be undone.")
						.targetEvent(ev)
						.ok("Yes")
						.cancel("No");

				$mdDialog.show(confirm).then(function() {
					memberService.unjoinOrganization(organization, function(){
						$scope.identity.updateMemberships();
						$scope.organizations = _.without($scope.organizations,organization);
					});
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
