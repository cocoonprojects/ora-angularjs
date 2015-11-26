angular.module('oraApp.collaboration', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider) {
			$stateProvider
				.state('org.collaboration', {
					url: '/tasks',
					templateUrl: 'app/collaboration/partials/task-list.html',
					data: {
						selectedTab: 0
					},
					controller: 'TaskListController as ctrl'
				})
				.state('org.item', {
					url: '/tasks/:taskId',
					templateUrl: 'app/collaboration/partials/task-detail.html',
					data: {
						selectedTab: 0
					},
					controller: 'TaskDetailController as ctrl'
				});
		}
	]);