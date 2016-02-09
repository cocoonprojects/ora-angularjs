angular.module('app.collaboration')
	.constant('TASK_STATUS_LABEL', {
		0:  'Work Item Idea',
		10: 'Open Work Item',
		20: 'Ongoing',
		30: 'Completed',
		40: 'Accepted',
		50: 'Closed',
                '-20': 'Rejected'
	})
	.filter('itemStatusLabel', ['TASK_STATUS_LABEL', function(TASK_STATUS_LABEL) {
		return function(status) {
			return TASK_STATUS_LABEL.hasOwnProperty(status) ? TASK_STATUS_LABEL[status] : status;
		};
	}]);