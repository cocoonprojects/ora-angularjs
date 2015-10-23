function AssignSharesController($scope, $mdDialog, $log, taskService, task) {
	var that = this;
	$scope.task = task;
	$scope.available = 100;
	$scope.updatePercentage = function() {
		var keys = Object.keys($scope.shares);
		var tot = 100;
		for(var i = 0; i < keys.length; i++) {
			var n = Number($scope.shares[keys[i]]);
			if(!isNaN(n)) {
				tot -= n;
			}
		}
		$scope.available = tot;
		//if($scope.available !== 0) {
		//	$scope.form.
		//}
	}
	$scope.shares = {};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.submit = function() {
		taskService.assignShares(
			{ orgId: task.organization.id, taskId: task.id },
			$scope.shares,
			function(value) {
				$mdDialog.hide(value);
			},
			function(httpResponse) {
				if(httpResponse.status == 422) {
					that.showErrors(httpResponse.data);
				} else {
					$log.warn(httpResponse);
				}
			});
	};
	this.showErrors = function(data) {
		$scope.form.$error.remote = data.description;
		var errors = data.errors;
		for(var i = 0; errors && i < errors.length; i++) {
			var error = errors[i];
			$scope.form[error.field].$error.remote = error.message;
		}
	};
}