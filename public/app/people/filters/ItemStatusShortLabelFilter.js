angular.module('app.collaboration')
	.constant('TASK_STATUS_SHORT_LABEL', {
		0:  'Idea',
		10: 'Open',
		20: 'Ongoing',
		30: 'Completed',
		40: 'Accepted',
		50: 'Closed',
		'-20': 'Rejected'
	})
	.filter('itemStatusShortLabel', ['TASK_STATUS_SHORT_LABEL', function(TASK_STATUS_SHORT_LABEL) {
		return function(status) {
			return TASK_STATUS_SHORT_LABEL.hasOwnProperty(status) ? TASK_STATUS_SHORT_LABEL[status] : status;
		};
	}]);
