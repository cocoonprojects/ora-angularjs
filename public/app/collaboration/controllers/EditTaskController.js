function EditTaskController($scope, $mdDialog, taskService, organization, task) {
	var that = this;
	$scope.subject = task.subject;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		taskService.edit(
			{ orgId: organization.id, taskId: task.id },
			{ subject: $scope.subject },
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