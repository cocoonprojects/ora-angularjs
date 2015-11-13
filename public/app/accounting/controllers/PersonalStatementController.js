angular.module('oraApp.accounting')
	.controller('PersonalStatementController', ['$scope', '$stateParams', 'accountService',
		function ($scope, $stateParams, accountService) {
			var limit = 0;
			$scope.statement = null;
			this.getInitialBalance = function() {
				if($scope.statement && $scope.statement.transactions) {
					var last = $scope.statement.transactions.slice(-1);
					if(last) return parseFloat(last[0].balance) - parseFloat(last[0].amount);
				}
				return 0;
			};
			this.loadMore = function() {
				limit += 3;
				accountService
					.personalStatement({ orgId: $stateParams.orgId, limit: limit })
					.$promise.then(function(result) {
						$scope.statement = result;
					});
			};
			this.loadMore();
		}]);
