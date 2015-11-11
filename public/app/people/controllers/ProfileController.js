angular.module('oraApp.people')
	.controller('ProfileController', ['$scope', '$log', '$stateParams', 'memberService', 'itemService', 'accountService',
		function($scope, $log, $stateParams, memberService, itemService, accountService) {
			$scope.profile = memberService.get({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
			$scope.credits = accountService.userStats({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
			$scope.tasks   = null;
			$scope.stats   = null;
			$scope.filters = {
				orgId: $stateParams.orgId,
				memberId: $stateParams.memberId,
				limit: 10
			};
			$scope.initTasks = function() {
				$scope.tasks   = itemService.query($scope.filters);
				$scope.stats   = itemService.userStats($scope.filters);
			};
			$scope.loadMore = function() {
				$scope.filters.limit += 10;
				$scope.initTasks();
			};
			$scope.isOwner = function(task) {
				return itemService.isOwner(task, $stateParams.memberId);
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
			$scope.isAllowed = itemService.isAllowed.bind(itemService);

			$scope.initTasks();
		}]);