function NewWithdrawalController($scope, $log, $stateParams, $mdDialog, accountService, account) {
	$scope.withdrawal = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		accountService.withdraw(
			{
				orgId: $stateParams.orgId,
				accountId: account.id
			},
			$scope.withdrawal,
			$mdDialog.hide(value),
			this.onError
		);
	};
	this.onError = function(httpResponse) {
		if(httpResponse.status == 400) {
			var errors = httpResponse.data.errors;
			for(var i = 0; i < errors.length; i++) {
				var error = errors[i];
				$scope.form[error.field].$error.remote = error.message;
			}
		} else {
			$log.warn(httpResponse);
		}
	};
}