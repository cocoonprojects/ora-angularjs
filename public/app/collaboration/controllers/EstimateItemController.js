function EstimateItemController($scope, $mdDialog, $log, itemService, item, prevEstimation) {
	$scope.value = prevEstimation > 0 || prevEstimation === 0 ? prevEstimation : undefined;
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.skip = function() {
		itemService.skipItemEstimation(item, $mdDialog.hide, this.onErrors);
	};
	this.submit = function() {
		itemService.estimateItem(item, $scope.value, $mdDialog.hide, this.onErrors);
	};
	this.onErrors = function(httpResponse) {
		switch(httpResponse.status) {
			case 400:
				httpResponse.data.errors.forEach(function(error) {
					$scope.form[error.field].$error.remote = error.message;
				});
				break;
			default:
				$log.warn(httpResponse);
		}
	};
}