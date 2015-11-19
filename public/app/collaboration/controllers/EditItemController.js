function EditItemController($scope, $mdDialog, $log, itemService, task) {
	$scope.subject = task.subject;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		itemService.edit(
			{
				orgId: task.organization.id,
				taskId: task.id
			},
			{
				subject: $scope.subject
			},
			$mdDialog.hide(value),
			this.onError);
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