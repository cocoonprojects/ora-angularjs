function NewOutgoingTransferController($scope, $log, $mdDialog, accountService, account) {
	$scope.transfer = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		accountService.transferOut(account, $scope.transfer, $mdDialog.hide, function(httpResponse) {
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