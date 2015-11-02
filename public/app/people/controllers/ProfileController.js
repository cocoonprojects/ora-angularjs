angular.module('oraApp.people')
	.controller('ProfileController', ['$scope', '$log', '$stateParams', 'memberService', 'taskService',
		function($scope, $log, $stateParams, memberService, taskService) {
			$scope.profile = memberService.get({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
			$scope.tasks   = null;
			$scope.stats   = null;
			$scope.filters = {
				orgId: $stateParams.orgId,
				memberId: $stateParams.memberId,
				limit: 10
			};
			$scope.initTasks = function() {
				$log.debug($scope.filters);
				$scope.tasks   = taskService.query($scope.filters);
				$scope.stats   = taskService.userStats($scope.filters);
			};
			$scope.loadMore = function() {
				$scope.filters.limit += 10;
				$scope.initTasks();
			};
			$scope.isOwner = function(task) {
				return taskService.isOwner(task, $stateParams.memberId);
			};
			$scope.getCredits  = function(task) {
				return task.members[$stateParams.memberId].credits;
			};
			$scope.getShare = function(task) {
				return task.members[$stateParams.memberId].share;
			};
			$scope.getDelta = function(task) {
				return task.members[$stateParams.memberId].delta;
			};
			$scope.isAllowed = taskService.isAllowed;

			$scope.initTasks();
		}]);