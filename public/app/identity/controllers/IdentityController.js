angular.module('app.identity')
	.controller('IdentityController', [
		'$scope',
		'$log',
		'$state',
		'identity',
		'SelectedOrganizationId',
		function(
			$scope,
			$log,
			$state,
			identity,
			SelectedOrganizationId) {
			$scope.identity = identity;

			$scope.signOut = function() {
				//Method inhetered from parent
				$scope.closeLeft();
				var auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(function () {
					$scope.$apply(function() {
						SelectedOrganizationId.clear();
						identity.reset();
						$log.info('User signed out.');
						$state.go('sign-in');
					});
				});
			};
		}]);
