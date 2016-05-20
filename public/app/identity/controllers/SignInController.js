angular.module('app.identity')
	.controller('SignInController', [
		'$scope',
		'$log',
		'$state',
		'SelectedOrganizationId',
		function(
			$scope,
			$log,
			$state,
			SelectedOrganizationId) {

			$scope.onSuccess = function(googleUser) {
				$scope.$apply(function() {
					$scope.identity.signInFromGoogle(googleUser);
					$scope.identity.loadMemberships().then(function(memberships){
						if(memberships && memberships.length){
							SelectedOrganizationId.set(memberships[0].organization.id);
							$state.go('org.flow',{ orgId: memberships[0].organization.id });
						}else{
							$state.go('organizations');
						}
					});
				});
			};

			$scope.renderSignInButton = function() {
				gapi.signin2.render('googleSignIn', {
					'scope': 'https://www.googleapis.com/auth/drive.readonly',
					'width': 230,
					'longtitle': true,
					'theme': 'dark',
					'onsuccess': $scope.onSuccess/*,
					'onfailure': angular.element($('#identityBox')).scope().onSignInFailure()*/
				});
			};

			$scope.start = function() {
				$scope.renderSignInButton();
			};

			$scope.start();
		}]);
