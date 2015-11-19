function NewOutgoingTransferController($scope, $log, $stateParams, $mdDialog, accountService, account) {
	$scope.transfer = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		accountService.transferOut(
			{
				orgId: $stateParams.orgId,
				accountId: account.id
			},
			$scope.transfer,
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