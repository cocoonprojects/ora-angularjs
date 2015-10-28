angular.module('oraApp.collaboration', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.pillars.collaboration', {
					abstract: true,
					template: '<ui-view/>',
					data: {
						selectedTab: 0
					},
					resolve: {
						streams: function($stateParams, streamService) {
							return streamService.query({ orgId: $stateParams.orgId });
						}
					},
					controller: function($scope, streams) {
						$scope.streams = streams;
						$scope.stream = function(task) {
							return $scope.streams._embedded['ora:stream'][task.stream.id];
						};
					}
				})
				.state('org.pillars.collaboration.tasks', {
					url: '/tasks',
					templateUrl: 'app/collaboration/partials/task-list.html',
					controller: 'TaskListController as ctrl'
				})
				.state('org.pillars.collaboration.task', {
					url: '/tasks/:taskId',
					templateUrl: 'app/collaboration/partials/task-detail.html',
					controller: 'TaskDetailController'
				});
		}
	]);