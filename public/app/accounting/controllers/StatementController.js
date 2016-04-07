angular.module('app.accounting')
	.controller('StatementController', [
        '$scope',
        '$stateParams',
        'accountService',
        '$state',
		function (
            $scope,
            $stateParams,
            accountService,
            $state) {
			$scope.selectedTab = $state.$current.data.currentTab;
		}]);
