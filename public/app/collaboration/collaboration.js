angular.module('oraApp.collaboration', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/:orgId/tasks', {
					templateUrl: 'app/collaboration/partials/task-list.html',
					controller: 'TaskListController',
					controllerAs: 'ctrl'
				}).
				when('/:orgId/tasks/:taskId', {
					templateUrl: 'app/collaboration/partials/task-detail.html',
					controller: 'TaskDetailController'
				});
		}
	]);