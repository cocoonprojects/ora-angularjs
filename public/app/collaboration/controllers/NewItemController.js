function NewItemController($scope, $log, $stateParams, $mdDialog, itemService, streams) {
	$scope.streams = streams;
	$scope.task = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		itemService.save($stateParams.orgId, $scope.task, $mdDialog.hide, this.onError);
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