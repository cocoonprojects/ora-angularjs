function ApproveIdeaController($scope, $mdDialog, $log, itemService, item) {
	//$scope.value = prevEstimation > 0 || prevEstimation === 0 ? prevEstimation : undefined;
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.abstain = function() {
		itemService.abstainIdeaItem(item, $mdDialog.hide, this.onErrors);
	};
	this.accept = function() {
		itemService.approveIdeaItem(item,  $mdDialog.hide, this.onErrors);
	};
        this.reject = function() {
		itemService.rejectIdeaItem(item,  $mdDialog.hide, this.onErrors);
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