angular.module('app.identity')
	.controller('IdentityController', [
		'$scope',
		'$log',
		'$state',
		'identity',
		'SelectedOrganizationId',
		'$cookies',
		'$window',
		function(
			$scope,
			$log,
			$state,
			identity,
			SelectedOrganizationId,
			$cookies,
			$window) {

			$scope.identity = identity;

			var clearCookies = function(){
				_.each(_.keys($cookies.getAll()),function(key){
					$cookies.remove(key);
				});
			};

			$scope.signOut = function() {
				//Method inhetered from parent
				$scope.closeLeft();
				var auth2 = gapi.auth2.getAuthInstance();
				auth2.signOut().then(function () {
					$scope.$apply(function() {
						clearCookies();
						SelectedOrganizationId.clear();
						identity.reset();
						$log.info('User signed out.');
						$state.go('sign-in').then(function(){
							$window.location.reload();
						});
					});
				});
			};
		}]);
