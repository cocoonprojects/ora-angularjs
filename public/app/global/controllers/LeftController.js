angular.module('oraApp')
	.controller('LeftController', function ($scope, $timeout, $mdSidenav, $log) {
	$scope.close = function () {
		$mdSidenav('left').close()
			.then(function () {
				$log.debug("close LEFT is done");
			});
	};
});