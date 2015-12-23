angular.module('app.accounting')
	.controller('OrganizationStatementController', ['$scope', '$stateParams', '$mdDialog', 'accountService',
		function ($scope, $stateParams, $mdDialog, accountService) {
			var that = this;
			this.isAllowed = accountService.isAllowed.bind(accountService);

			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			$scope.filters = {
				limit: 10
			};
			$scope.statement = null;
			accountService.startOrganizationPolling($stateParams.orgId, $scope.filters, function(data) { $scope.statement = data; }, this.onLoadingError, 10000);
			this.cancelAutoUpdate = function() {
				accountService.stopOrganizationPolling();
			};
			$scope.$on('$destroy', this.cancelAutoUpdate);

			$scope.isLoadingMore = false;
			this.loadMore = function() {
				$scope.isLoadingMore = true;
				$scope.filters.limit = $scope.statement.count + 10;
				var that = this;
				accountService.organizationStatement($stateParams.orgId, $scope.filters,
						function(data) {
							$scope.isLoadingMore = false;
							$scope.statement = data;
						},
						function(response) {
							$scope.isLoadingMore = false;
							that.onLoadingError(response);
						});
			};

			this.addTransaction = function(transaction) {
				$scope.statement._embedded.transactions.unshift(transaction);
			};

			this.openNewDeposit = function(ev) {
				$mdDialog.show({
					controller: NewDepositController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/accounting/partials/new-deposit.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					locals: {
						account: $scope.statement
					}
				}).then(this.addTransaction);
			};
			this.openNewWithdrawal = function(ev) {
				$mdDialog.show({
					controller: NewWithdrawalController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/accounting/partials/new-withdrawal.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					locals: {
						account: $scope.statement
					}
				}).then(this.addTransaction);
			};
			this.openNewIncomingTransfer = function(ev) {
				$mdDialog.show({
					controller: NewIncomingTransferController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/accounting/partials/new-incoming-transfer.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
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
			this.openNewOutgoingTransfer = function(ev) {
				$mdDialog.show({
					controller: NewOutgoingTransferController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/accounting/partials/new-outgoing-transfer.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
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
			this.isNewTransactionsAllowed = function(account) {
				return accountService.isAllowed('deposit', $scope.statement) ||
								accountService.isAllowed('withdrawal', $scope.statement) ||
								accountService.isAllowed('incomingTransfer', $scope.statement) ||
								accountService.isAllowed('outgoingTransfer', $scope.statement);
			};
		}]);