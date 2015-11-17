angular.module('oraApp.collaboration')
	.controller('TaskDetailController', ['$scope', '$stateParams', 'streamService', 'itemService',
		function ($scope, $stateParams, streamService, itemService) {
			$scope.stream = function() { return null; };
			streamService.query({ orgId: $stateParams.orgId }, function(data) {
				$scope.stream = function(task) {
					if(task.stream) {
						return data._embedded['ora:stream'][task.stream.id];
					}
					return null;
				};
			});
			$scope.task = itemService.get({ orgId: $stateParams.orgId, taskId: $stateParams.taskId });
			$scope.isOwner = itemService.isOwner.bind(itemService);
			$scope.isAllowed = itemService.isAllowed.bind(itemService);
			$scope.parseDate = function(when) {
				return Date.parse(when);
			};
			//$scope.estimationEditing = task.members[identity.id] == undefined ? false : task.members[identity.id].estimation == null;
			//$scope.subjectEditing = false;
			//$scope.myEstimation = task.members[identity.id] == undefined ? undefined : task.members[identity.id].estimation == undefined || task.members[identity.id].estimation.value == -1 ? null : task.members[identity.id].estimation.value;
			//$scope.statusClass = function() {
			//	switch ($scope.task.status) {
			//		case 10:
			//			return 'text-info';
			//		case 20:
			//		case 30:
			//		case 40:
			//			return 'text-success';
			//		default :
			//			return 'text-muted';
			//	}
			//};
			//$scope.joinItem = function(task) {
			//	itemService.joinItem(task, $scope.identity);
			//};
			//$scope.unjoinItem = function() {
			//	if(task.members[$scope.identity.id].estimation != null && !confirm("Unjoining this item will remove your estimation. Do you want to proceed?")) {
			//		return;
			//	}
			//	itemService.unjoinItem(task, $scope.identity);
			//};
			//$scope.editEstimation = function (estimation) {
			//	$log.debug(estimation);
			//	$scope.estimationEditing = false;
			//	if($scope.task.members[identity.id].estimation == null) {
			//		$scope.task.members[identity.id].estimation = { value: estimation };
			//	} else {
			//		$scope.task.members[identity.id].estimation.value = estimation;
			//	}
			//};
			//$scope.skipEstimation = function () {
			//	$scope.estimationEditing = false;
			//	if($scope.task.members[identity.id].estimation == null) {
			//		$scope.task.members[identity.id].estimation = { value: -1 };
			//	} else {
			//		$scope.task.members[identity.id].estimation.value = -1;
			//	}
			//	$scope.myEstimation = undefined;
			//	$log.debug($scope.myEstimation);
			//};
			//$scope.enableEstimationEditing = function (task, member) {
			//	if($scope.isAllowed.estimateItem(task, member)) {
			//		$scope.estimationEditing = true;
			//	}
			//};
			//$scope.enableSubjectEditing = function(task) {
			//	if(isAllowed.editItem(task)) {
			//		$log.debug('Enable subject editing');
			//		$scope.subjectEditing = true;
			//	}
			//};
			//$scope.editSubject = function(subject) {
			//	$scope.subjectEditing = false;
			//	$scope.task.subject = subject;
			//};
			//$scope.completeItem = function(task) {
			//	itemService.completeItem(task, identity);
			//};
			//$scope.acceptItem = function(task) {
			//	itemService.acceptItem(task, identity);
			//}
		}]);
