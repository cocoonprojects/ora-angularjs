angular.module('app')
	.controller('ConfirmInvitationController', [
		'$scope',
		'$stateParams',
		'$state',
		'$mdDialog',
		'InvitationData',
		function (
			$scope,
			$stateParams,
			$state,
			$mdDialog,
			InvitationData) {
				console.log(InvitationData);
		}]);
