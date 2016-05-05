function ApproveIdeaController(
	$scope,
	$mdDialog,
	$log,
	item,
	callbacks,
	title) {

	$scope.title = title;

	this.cancel = function() {
		$mdDialog.cancel();
	};

	this.abstain = function() {
		callbacks.abstain(item,$scope.description, $mdDialog.hide, this.onErrors);
	};

	this.accept = function() {
		callbacks.accept(item,$scope.description, $mdDialog.hide, this.onErrors);
	};

    this.reject = function() {
		callbacks.reject(item,$scope.description, $mdDialog.hide, this.onErrors);
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
