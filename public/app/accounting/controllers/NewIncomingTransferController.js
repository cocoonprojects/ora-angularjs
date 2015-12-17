function NewIncomingTransferController($scope, $log, $stateParams, $mdDialog, accountService, account) {
	$scope.transfer = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		accountService.transferIn({ orgId: $stateParams.orgId, accountId: account.id }, $scope.transfer, $mdDialog.hide, function(httpResponse) {
				switch(httpResponse.status) {
					case 400:
						httpResponse.data.errors.forEach(function(error) {
							$scope.form[error.field].$error.remote = error.message;
						});
						break;
					default:
						$log.warn(httpResponse);
				}
			});
	};
}