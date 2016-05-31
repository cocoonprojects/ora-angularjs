angular.module('app.people')
.controller('InvitationController', [
	'$scope',
	'$mdDialog',
	function (
		$scope,
		$mdDialog) {

			$scope.invitation = {};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.submit = function() {
				$mdDialog.hide($scope.invitation);
			};

	}
]);
