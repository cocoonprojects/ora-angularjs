function NewItemController(
	$scope,
	$log,
	$mdDialog,
	itemService,
	templateService,
	orgId,
	streams,
	decisionMode) {

	$scope.decisionMode = decisionMode;

	$scope.streams = streams;

	templateService.list().then(function(templates){
		$scope.templates = templates;
	});

	$scope.onCloseTemplate = function(){
		if($scope.template){
			$scope.task.description = $scope.templates[$scope.template].value;
		}
	};

	$scope.task = {
		decision:"" + decisionMode
	};

	this.cancel = function() {
		$mdDialog.cancel();
	};
	this.submit = function() {
		var onSuccess = function(newItem){
			$mdDialog.hide(newItem);
		};

		if(!$scope.task.streamID){
			$scope.task.streamID = _.values(streams._embedded['ora:stream'])[0].id;
		}

		if(!$scope.task.description){
			$scope.task.description = $scope.task.subject;
		}

		itemService.save(orgId, $scope.task, onSuccess, function(httpResponse) {
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
