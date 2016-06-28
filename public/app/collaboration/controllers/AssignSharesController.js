function AssignSharesController($scope, $log, $mdDialog, itemService, item) {
	$scope.item = item;
	$scope.shares = {};
	$scope.available = 100;
	this.updatePercentage = function() {
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
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.skip = function() {
		// var confirm = $mdDialog.confirm()
		// 		.title('You do not want to assign shares, do you?')
		// 		.textContent("You cannot change this later. If nobody assigns shares, credits won't be distributed")
		// 		.ok('Yes')
		// 		.cancel('No');

		// $mdDialog.show(confirm).then(function() {
			itemService.skipShares(item, $mdDialog.hide, this.onError);
		// }.bind(this));
	};
	this.submit = function() {
		// var confirm = $mdDialog.confirm()
		// 		.title('Are you sure about your assignments?')
		// 		.textContent("You cannot change this later.")
		// 		.ok('Yes')
		// 		.cancel('No');

		// $mdDialog.show(confirm).then(function() {
			itemService.assignShares(item, $scope.shares, $mdDialog.hide, this.onError);
		// }.bind(this));
	};
	this.onError = function(httpResponse) {
		switch(httpResponse.status) {
			case 400:
				httpResponse.data.errors.forEach(function(error) {
					$scope.form[error.field].$error.remote = error.message;
				});
				break;
			default:
				alert('Generic Error during server communication (error: ' + httpResponse.status + ' ' + httpResponse.statusText + ') ');
				$log.warn(httpResponse);
		}
	};
}
