function NewWithdrawalController($scope, $log, $stateParams, $mdDialog, accountService, account) {
	$scope.withdrawal = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		accountService.withdraw(
			{ orgId: $stateParams.orgId, accountId: account.id }, $scope.withdrawal, $mdDialog.hide, function(httpResponse) {
				switch(httpResponse.status) {
					case 400:
						httpResponse.data.errors.forEach(function(error) {
							$scope.form[error.field].$error.remote = error.message;
						});
						break;
					default:
						alert('Generic Error during server communication (error: ' + httpResponse.status + ' ' + httpResponse.statusText + ') ');
						$log.warn(httpResponse);
				}
			});
	};
}