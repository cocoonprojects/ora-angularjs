function AssignSharesController($scope, $mdDialog, $log, itemService, item) {
	$scope.item = item;
	$scope.shares = {};
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
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.skip = function() {
		itemService.skipShares(item, $mdDialog.hide, this.onError);
	};
	$scope.submit = function() {
		itemService.assignShares(item, $scope.shares, $mdDialog.hide, this.onError);
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