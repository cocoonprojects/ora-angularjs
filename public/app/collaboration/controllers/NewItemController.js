function NewItemController($scope, $log, $stateParams, $mdDialog, itemService) {
	var that = this;
	$scope.task = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		itemService.save(
				{ orgId: $stateParams.orgId },
				$scope.task,
				function(value) {
					$mdDialog.hide(value);
				},
				function(httpResponse) {
					if(httpResponse.status == 400) {
						that.showErrors(httpResponse.data.errors);
					} else {
						$log.warn(httpResponse);
					}
				});
	};
	this.showErrors = function(errors) {
		for(var i = 0; i < errors.length; i++) {
			var error = errors[i];
			$scope.form[error.field].$error.remote = error.message;
		}
	};
}