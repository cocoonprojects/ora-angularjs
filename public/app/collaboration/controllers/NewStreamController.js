function NewStreamController($scope, $log, $mdDialog, streamService, orgId) {
	$scope.stream = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		streamService.save(orgId, $scope.stream, $mdDialog.hide, function(httpResponse) {
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
