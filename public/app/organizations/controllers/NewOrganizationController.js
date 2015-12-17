function NewOrganizationController($scope, $log, $mdDialog, organizationService) {
	$scope.organization = {};
	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		organizationService.save({}, $scope.organization, $mdDialog.hide, function(httpResponse) {
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