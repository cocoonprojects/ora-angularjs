angular.module('app.flow')
	.constant('FLOW_TYPES_LABEL', {
		'VoteIdea': 'Vote Idea',
		'VoteCompletedItem': 'Vote Completed Item',
		'VoteCompletedItemVotingClosed': 'Completed Item Voting Closed',
		'VoteCompletedItemReopened': 'Completed Item Reopened'
	})
	.filter('flowTypeLabel', ['FLOW_TYPES_LABEL', function(FLOW_TYPES_LABEL) {
		return function(type) {
			return FLOW_TYPES_LABEL[type] || type.replace(/([A-Z])/g, ' $1');
		};
	}]);
