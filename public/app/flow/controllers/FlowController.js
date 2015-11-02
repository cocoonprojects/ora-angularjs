angular.module('oraApp.flow')
	.controller('FlowController', ['$scope', '$log',
		function ($scope, $log) {
			$scope.items = [
				{title: 'Welcome to O.R.A.', message: 'Here you will find suggentions on how to contribute to an organization activity and notifications about most relevant events'},
				{title: 'Select your organization', message: 'Select an organization from the side bar and start contributing!'}
			];
		}]);