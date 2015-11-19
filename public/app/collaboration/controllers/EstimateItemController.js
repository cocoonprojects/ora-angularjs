function EstimateItemController($scope, $mdDialog, itemService, item, prevEstimation) {
	$scope.value = prevEstimation > 0 || prevEstimation === 0 ? prevEstimation : undefined;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.skip = function() {
		itemService.estimateItem (
			{
				orgId: item.organization.id,
				taskId: item.id
			},
			{ value: -1 },
			$mdDialog.hide,
			this.onErrors
		);
	};
	$scope.submit = function() {
		itemService.estimateItem(
			{
				orgId: item.organization.id,
				taskId: item.id
			},
			{ value: $scope.value },
			$mdDialog.hide,
			this.onErrors
		);
	};
	this.onErrors = function(httpResponse) {
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