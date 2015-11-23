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
			$scope.task = itemService.get($stateParams.orgId, $stateParams.taskId);
			$scope.isOwner = itemService.isOwner.bind(itemService);
			$scope.isAllowed = itemService.isAllowed.bind(itemService);
			$scope.parseDate = function(when) {
				return Date.parse(when);
			};
		}]);
