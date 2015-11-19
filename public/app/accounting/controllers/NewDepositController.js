function NewDepositController($scope, $log, $stateParams, $mdDialog, accountService, account) {
	$scope.deposit = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		accountService.deposit(
			{
				orgId: $stateParams.orgId,
				accountId: account.id
			},
			$scope.deposit,
			$mdDialog.hide,
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