angular.module('oraApp.collaboration')
	.controller('TaskDetailController', ['$scope', '$log', 'task', 'taskService',
		function ($scope, $log, task, taskService) {
			$scope.task = task;
			$scope.isOwner = taskService.isOwner;
			$scope.isAllowed = taskService.isAllowed;
			$scope.statusLabel = taskService.statusLabel;
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
			//$scope.joinTask = function(task) {
			//	taskService.joinTask(task, $scope.identity);
			//};
			//$scope.unjoinTask = function() {
			//	if(task.members[$scope.identity.id].estimation != null && !confirm("Unjoining this item will remove your estimation. Do you want to proceed?")) {
			//		return;
			//	}
			//	taskService.unjoinTask(task, $scope.identity);
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
			//	if($scope.isAllowed.estimateTask(task, member)) {
			//		$scope.estimationEditing = true;
			//	}
			//};
			//$scope.enableSubjectEditing = function(task) {
			//	if(isAllowed.editTask(task)) {
			//		$log.debug('Enable subject editing');
			//		$scope.subjectEditing = true;
			//	}
			//};
			//$scope.editSubject = function(subject) {
			//	$scope.subjectEditing = false;
			//	$scope.task.subject = subject;
			//};
			//$scope.completeTask = function(task) {
			//	taskService.completeTask(task, identity);
			//};
			//$scope.acceptTask = function(task) {
			//	taskService.acceptTask(task, identity);
			//}
		}]);
