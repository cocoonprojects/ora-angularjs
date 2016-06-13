function EditItemController($scope, $mdDialog, $log, itemService, kanbanizeLaneService, $stateParams, task) {
	$scope.item = task;

	this.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.lanes = [];
	kanbanizeLaneService.getLanes($stateParams.orgId).then(function(lanes){
		$scope.lanes = lanes;
	});

	this.submit = function() {
		console.log($scope.item);
		itemService.edit($scope.item, $mdDialog.hide, function(httpResponse) {
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
