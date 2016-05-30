angular.module('app.collaboration')
	.constant('OWNER_LABEL', {
		0:  'author',
		10: '',
		20: 'owner',
		30: 'owner',
		40: 'owner',
		50: 'owner',
		'-20': 'owner'
	})
	.filter('ownerLabel', ['OWNER_LABEL', function(OWNER_LABEL) {
		return function(status) {
			return OWNER_LABEL.hasOwnProperty(status) ? OWNER_LABEL[status] : '';
		};
	}]);
