angular.module('app.accounting')
	.controller('OrganizationStatementController', ['$scope', '$stateParams', '$mdDialog', 'moment', 'accountService',
		function ($scope, $stateParams, $mdDialog, moment, accountService) {
			var that = this;
			var initStatement = function(data){
				$scope.statement = data;
				$scope.statement._embedded.transactions = transactionOrderedByDate($scope.statement._embedded.transactions);
			};
			var transactionOrderedByDate = function(transactions){
				var toReturn;
				var orderedTransaction = _.sortBy(transactions, function(transaction){
					return moment(transaction.date).unix();
				});
				if ($scope.orderDateRising){
					toReturn = orderedTransaction;
					$scope.availableOrganisationCredits = toReturn[toReturn.length - 1].balance;
				}
				else {
					toReturn = orderedTransaction.reverse();
					$scope.availableOrganisationCredits = toReturn[0].balance;
				}
				return toReturn;
			};
			this.isAllowed = accountService.isAllowed.bind(accountService);

			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			$scope.orderDateRising = false;
			$scope.filters = {
				limit: 10
			};
			$scope.statement = null;
			accountService.startOrganizationPolling($stateParams.orgId, $scope.filters, initStatement, this.onLoadingError, 10000);
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
			this.invertOrderData = function() {
				$scope.orderDateRising = !$scope.orderDateRising;
				$scope.statement._embedded.transactions = transactionOrderedByDate($scope.statement._embedded.transactions);
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
