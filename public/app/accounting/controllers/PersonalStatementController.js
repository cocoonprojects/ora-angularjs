angular.module('app.accounting')
	.controller('PersonalStatementController', ['$scope', '$stateParams', 'accountService',
		function ($scope, $stateParams, accountService) {
			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			console.log("personalController");
			$scope.filters = {
				limit: 10
			};
			$scope.statement = null;
			accountService.startPersonalPolling($stateParams.orgId, $scope.filters, function(data) { $scope.statement = data; }, this.onLoadingError, 10000);
			this.cancelAutoUpdate = function() {
				accountService.stopPersonalPolling();
			};
			$scope.$on('$destroy', this.cancelAutoUpdate);

			$scope.isLoadingMore = false;
			this.loadMore = function() {
				$scope.isLoadingMore = true;
				$scope.filters.limit = $scope.statement.count + 10;
				var that = this;
				accountService.personalStatement($stateParams.orgId, $scope.filters,
								function(data) {
									$scope.isLoadingMore = false;
									$scope.statement = data;
								},
								function(response) {
									$scope.isLoadingMore = false;
									that.onLoadingError(response);
								});
			};
			this.isAllowed = accountService.isAllowed.bind(accountService);
			this.isNewTransactionsAllowed = function () {
				return false;
			};
		}]);
