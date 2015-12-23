angular.module('app.identity')
	.controller('SignInController', ['$scope', '$log', '$state',
		function($scope, $log, $state) {

			$scope.onSuccess = function(googleUser) {
				$scope.$apply(function() {
					$scope.identity.signInFromGoogle(googleUser);
					$log.info('User signed in');
					var s = 'flow'; // TODO: bring back to requested route
					$state.go(s);
					$log.debug("Redirecting to '" + s + "' state");
				});
			};

			$scope.renderSignInButton = function() {
				gapi.signin2.render('googleSignIn', {
					//'scope': 'https://www.googleapis.com/auth/plus.login',
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
