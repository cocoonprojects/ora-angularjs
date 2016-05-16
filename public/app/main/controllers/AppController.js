angular.module('app')
	.controller('AppController', [
		'$scope',
		'$timeout',
		'$mdSidenav',
		'$mdUtil',
		'$log',
		'$stateParams',
		'SelectedOrganizationId',
		function(
			$scope,
			$timeout,
			$mdSidenav,
			$mdUtil,
			$log,
			$stateParams,
			SelectedOrganizationId) {

			$scope.$on('$stateChangeSuccess',function(){
				if($stateParams.orgId){
					SelectedOrganizationId.set($stateParams.orgId);
					$scope.organizationId = $stateParams.orgId;
				}
			});

			$scope.toggleLeft = buildToggler('left');
			$scope.toggleRight = buildToggler('right');
			/**
			 * Build handler to open/close a SideNav; when animation finishes
			 * report completion in console
			 */
			function buildToggler(navID) {
				var debounceFn =  $mdUtil.debounce(function(){
					$mdSidenav(navID)
						.toggle()
						.then(function () {
							$log.debug("toggle " + navID + " is done");
						});
				},200);
				return debounceFn;
			}
		}]);
