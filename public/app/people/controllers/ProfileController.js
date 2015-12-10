angular.module('oraApp.people')
	.controller('ProfileController', ['$scope', '$log', '$stateParams', 'memberService', 'itemService', 'accountService',
		function($scope, $log, $stateParams, memberService, itemService, accountService) {
			$scope.profile = memberService.get({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
			$scope.credits = accountService.userStats({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
			$scope.tasks   = null;
			$scope.stats   = null;
			$scope.filters = {
				memberId: $stateParams.memberId,
				limit: 10
			};
			$scope.initTasks = function() {
				itemService.query($stateParams.orgId, $scope.filters, function(data) { $scope.tasks = data; }, function(response) { $log.warn(response); });
				$scope.stats   = itemService.userStats($stateParams.orgId, $scope.filters);
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