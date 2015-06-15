angular.module('oraApp.collaboration')
	.controller('TaskDetailController', ['$scope', '$modalInstance', '$log', 'task', 'taskService', 'identity', 'isAllowed',
		function ($scope, $modalInstance, $log, task, taskService, identity, isAllowed) {
			$scope.task = task;
			$scope.estimationEditing = task.members[identity.id] == undefined ? false : task.members[identity.id].estimation == null;
			$scope.subjectEditing = false;
			$scope.myEstimation = task.members[identity.id] == undefined ? undefined : task.members[identity.id].estimation == undefined || task.members[identity.id].estimation.value == -1 ? null : task.members[identity.id].estimation.value;
			$scope.mySubject = task.subject;
			$scope.identity = identity;
			$scope.isAllowed = isAllowed;
			$scope.daysAgo = function(when) {
				var now = new Date();
				var d = new Date(Date.parse(when));
				return Math.round(Math.abs((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
			};
			$scope.statusClass = function() {
				switch ($scope.task.status) {
					case 10:
						return 'text-info';
					case 20:
					case 30:
					case 40:
						return 'text-success';
					default :
						return 'text-muted';
				}
			};
			$scope.joinTask = function() {
				taskService.joinTask(task, $scope.identity);
			};
			$scope.unjoinTask = function() {
				if(task.members[$scope.identity.id].estimation != null && !confirm("Unjoining this item will remove your estimation. Do you want to proceed?")) {
					return;
				}
				taskService.unjoinTask(task, $scope.identity);
			};
			$scope.editEstimation = function (estimation) {
				$log.debug(estimation);
				$scope.estimationEditing = false;
				if($scope.task.members[identity.id].estimation == null) {
					$scope.task.members[identity.id].estimation = { value: estimation };
				} else {
					$scope.task.members[identity.id].estimation.value = estimation;
				}
			};
			$scope.skipEstimation = function () {
				$scope.estimationEditing = false;
				if($scope.task.members[identity.id].estimation == null) {
					$scope.task.members[identity.id].estimation = { value: -1 };
				} else {
					$scope.task.members[identity.id].estimation.value = -1;
				}
				$scope.myEstimation = undefined;
				$log.debug($scope.myEstimation);
			};
			$scope.enableEstimationEditing = function (task, member) {
				if($scope.isAllowed.estimateTask(task, member)) {
					$scope.estimationEditing = true;
				}
			}
			$scope.enableSubjectEditing = function(task) {
				if(isAllowed.editTask(task)) {
					$log.debug('Enable subject editing');
					$scope.subjectEditing = true;
				}
			}
			$scope.editSubject = function(subject) {
				$scope.subjectEditing = false;
				$scope.task.subject = subject;
			}
		}]);