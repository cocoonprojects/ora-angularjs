angular.module('oraApp.collaboration', [
	'ui.router'
	])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.tasks', {
					url: '/tasks',
					templateUrl: 'app/collaboration/partials/task-list.html',
					data: {
						selectedTab: 0
					},
					controller: 'MemberListController'
				})
				.state('/:orgId/tasks/:taskId', {
					url: '/:orgId/tasks/:taskId',
					templateUrl: 'app/collaboration/partials/task-detail.html',
					controller: 'TaskDetailController'
				});
		}
	]);