angular.module('oraApp.accounting')
	.controller('PersonalStatementController', ['$scope', '$stateParams', 'accountService',
		function ($scope, $stateParams, accountService) {
			var limit = 0;
			$scope.statement = null;
			$scope.initialBalance = 0;
			this.isAllowed = accountService.isAllowed.bind(accountService);

			this.loadMore = function () {
				limit += 10;
				accountService
						.personalStatement({orgId: $stateParams.orgId, limit: limit})
						.$promise.then(function (result) {
					$scope.statement = result;
					$scope.initialBalance = accountService.getInitialBalance(result._embedded.transactions);
				});
			};
			this.loadMore();
			this.isNewTransactionsAllowed = function () {
				return false;
			};
		}]);