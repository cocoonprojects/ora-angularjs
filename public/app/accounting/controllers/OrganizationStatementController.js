angular.module('oraApp.accounting')
	.controller('OrganizationStatementController', ['$scope', '$stateParams', '$mdDialog', 'accountService',
		function ($scope, $stateParams, $mdDialog, accountService) {
			var that = this;
			var limit = 0;
			$scope.statement = null;
			$scope.initialBalance = 0;
			$scope.isAllowed = accountService.isAllowed.bind(accountService);

			this.loadMore = function() {
				limit += 10;
				accountService
					.organizationStatement({ orgId: $stateParams.orgId, limit: limit })
					.$promise.then(function(result) {
						$scope.statement = result;
						$scope.initialBalance = accountService.getInitialBalance(result._embedded.transactions);
					});
			};
			this.loadMore();

			this.addTransaction = function(transaction) {
				$scope.statement._embedded.transactions.unshift(transaction);
			};

			this.openNewDeposit = function(ev) {
				$mdDialog.show({
					controller: NewDepositController,
					templateUrl: "app/accounting/partials/new-deposit.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						account: $scope.statement
					}
				}).then(this.addTransaction);
			};
			this.openNewWithdrawal = function(ev) {
				$mdDialog.show({
					controller: NewWithdrawalController,
					templateUrl: "app/accounting/partials/new-withdrawal.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						account: $scope.statement
					}
				}).then(this.addTransaction);
			};
			this.openNewIncomingTransfer = function(ev) {
				$mdDialog.show({
					controller: NewIncomingTransferController,
					templateUrl: "app/accounting/partials/new-incoming-transfer.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						account: $scope.statement
					}
				}).then(function(data) {
					for(var i = 0; i < data._embedded['ora:transaction'].length; i++) {
						var transaction = data._embedded['ora:transaction'][i];
						if(transaction.account.id == $scope.statement.id) {
							that.addTransaction(transaction);
							return;
						}
					}
				});
			};
		}]);