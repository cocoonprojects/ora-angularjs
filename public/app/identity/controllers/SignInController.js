angular.module('oraApp.identity')
	.controller('SignInController', ['$scope', '$log', '$location', 'identity',
		function($scope, $log, $location) {

			$scope.onSuccess = function(googleUser) {
				$scope.$apply(function() {
					$scope.identity.signInFromGoogle(googleUser)
					$log.info('User signed in');
					var route = '/flow'; // TODO: bring back to requested route
					$location.path(route);
					$log.debug('Redirecting to ' + route);
				});
			}

			$scope.renderSignInButton = function() {
				gapi.signin2.render('googleSignIn', {
					'scope': 'https://www.googleapis.com/auth/plus.login',
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
