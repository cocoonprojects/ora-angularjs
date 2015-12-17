function NewItemController($scope, $log, $mdDialog, itemService, orgId, streams) {
	$scope.streams = streams;
	$scope.task = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		itemService.save(orgId, $scope.task, $mdDialog.hide, function(httpResponse) {
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