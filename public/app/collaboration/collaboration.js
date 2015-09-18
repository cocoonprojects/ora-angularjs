angular.module('oraApp.collaboration', ['ngRoute'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/:orgId/tasks', {
					templateUrl: 'app/collaboration/partials/task-list.html',
					controller: 'MemberListController',
				}).
				when('/:orgId/tasks/:taskId', {
					templateUrl: 'app/collaboration/partials/task-detail.html',
					controller: 'TaskDetailController'
				});
		}
	])
	.constant('TASK_STATUS', {
		'OPEN'     : 10,
		'ONGOING'  : 20,
		'COMPLETED': 30,
		'ACCEPTED' : 40,
		'CLOSED'   : 50
	})
	.constant('TASK_ROLES', {
		'ROLE_MEMBER': 'member',
		'ROLE_OWNER' : 'owner'
	})
	.constant('TASK_STATUS_LABEL', {
		10: 'Open Work Item',
		20: 'Ongoing',
		30: 'Completed',
		40: 'Accepted',
		50: 'Closed'
	});