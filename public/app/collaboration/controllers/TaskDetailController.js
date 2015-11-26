angular.module('oraApp.collaboration')
	.controller('TaskDetailController', ['$scope', '$stateParams', 'streamService', 'itemService',
		function ($scope, $stateParams, streamService, itemService) {
			var that = this;
			this.stream = function() { return null; };
			streamService.query({ orgId: $stateParams.orgId }, function(data) {
				that.stream = function(task) {
					if(task.stream) {
						return data._embedded['ora:stream'][task.stream.id];
					}
					return null;
				};
			});
			$scope.task = itemService.get($stateParams.orgId, $stateParams.taskId);
			this.isAllowed = itemService.isAllowed.bind(itemService);
			this.parseDate = function(when) {
				return Date.parse(when);
			};
		}]);
