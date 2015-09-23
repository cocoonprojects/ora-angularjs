function EstimateTaskController($scope, $mdDialog, taskService, identity, organization, task) {
	var that = this;
	var e = task.members[identity.getId()].estimation;
	$scope.value = e > 0 || e === 0 ? e : undefined;
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.skip = function() {
		taskService.estimateTask(
			{ orgId: organization.id, taskId: task.id },
			{ value: -1 },
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
	$scope.submit = function() {
		taskService.estimateTask(
			{ orgId: organization.id, taskId: task.id },
			{ value: $scope.value },
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