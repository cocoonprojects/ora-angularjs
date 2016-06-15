angular.module('app.accounting')
	.controller('StatementController', [
        '$scope',
        '$stateParams',
        'accountService',
        '$state',
		'$mdDialog',
		function (
            $scope,
            $stateParams,
            accountService,
            $state,
			$mdDialog) {

			$scope.menu = {
				open:false
			};

			$scope.selectedTab = $state.$current.data.currentTab;

			this.isAllowed = accountService.isAllowed.bind(accountService);

			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};

			$scope.filters = {
			};

			$scope.myWallet = accountService.userStats({ orgId: $stateParams.orgId, memberId: $scope.identity.getId() });


			$scope.statement = null;

			$scope.emptyOrganizationTransactions = false;
			$scope.loadingOrganizationTransactions = true;
			accountService.startOrganizationPolling($stateParams.orgId, $scope.filters, function(data) {
				$scope.loadingOrganizationTransactions = false;
				var transactions = data._embedded.transactions || [];
				if(transactions.length === 0){
					$scope.emptyOrganizationTransactions = true;
				}
				$scope.statement = data;
			}, function(error){
				this.onLoadingError(error);
				$scope.loadingOrganizationTransactions = false;
			}, 30000);

			var cancelAutoUpdate = function () {
				accountService.stopOrganizationPolling();
				accountService.stopPersonalPolling();
			};

			$scope.personalStatement = null;
			$scope.emptyPersonalTransactions = false;
			$scope.loadingPersonalTransactions = true;
			accountService.startPersonalPolling($stateParams.orgId,{}, function(data) {
				$scope.loadingPersonalTransactions = false;
				var transactions = data._embedded.transactions || [];
				if(transactions.length === 0){
					$scope.emptyPersonalTransactions = true;
				}
				$scope.personalStatement = data;
			}, function(error){
				this.onLoadingError(error);
				$scope.loadingPersonalTransactions = false;
			}, 30000);

			$scope.$on('$destroy', function(){
				cancelAutoUpdate();
			});

			$scope.isLoadingMore = false;
			this.loadMore = function() {
				$scope.isLoadingMore = true;

				var filters = {
					limit:$scope.statement.count + 10
				};

				var that = this;

				accountService.organizationStatement($stateParams.orgId, filters,
						function(data) {
							$scope.isLoadingMore = false;
							$scope.statement = data;
						},
						function(response) {
							$scope.isLoadingMore = false;
							that.onLoadingError(response);
						});
			};

			$scope.isLoadingMorePersonal = false;
			this.loadMorePersonal = function() {
				$scope.isLoadingMorePersonal = true;

				var filters = {
					limit:$scope.personalStatement.count + 10
				};

				var that = this;

				accountService.personalStatement($stateParams.orgId, filters,
					function(data) {
						$scope.isLoadingMorePersonal = false;
						$scope.personalStatement = data;
					},
					function(response) {
						$scope.isLoadingMorePersonal = false;
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
			this.isNewTransactionsAllowed = function() {
				if(!$scope.statement){
					return false;
				}

				return accountService.isAllowed('deposit', $scope.statement) ||
				accountService.isAllowed('withdrawal', $scope.statement) ||
				accountService.isAllowed('incomingTransfer', $scope.statement) ||
				accountService.isAllowed('outgoingTransfer', $scope.statement);
			};
		}]);
