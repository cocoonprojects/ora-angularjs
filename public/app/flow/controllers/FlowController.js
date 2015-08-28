angular.module('oraApp.flow')
	.controller('FlowController', ['$scope', '$log',
		function ($scope, $log) {
			$scope.items = [
				'Ragazza stufa scappa di casa, i genitori hanno freddo',
				'Se hai un maglione di lana che non scalda per niente, probabilmente anche la pecora è morta di freddo'
			];
		}]);