function EditItemController($scope, $mdDialog, $log, itemService, task) {
	$scope.item = task;
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
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