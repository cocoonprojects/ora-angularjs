var AccountService = function($resource, identity) {
	var resource = $resource('api/:orgId/accounting/:controller/:accountId/:memberId', { controller: 'accounts' }, {
		get: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		query: {
			method: 'GET',
			isArray: false,
			headers: { 'GOOGLE-JWT': identity.getToken() }
		},
		personalStatement: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'personal-statement' }
		},
		organizationStatement: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'organization-statement' }
		},
		userStats: {
			method: 'GET',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'members' }
		}
	});
	this.get = resource.get.bind(resource);
	this.query = resource.query.bind(resource);
	this.personalStatement = resource.personalStatement.bind(resource);
	this.organizationStatement = resource.organizationStatement.bind(resource);
	this.userStats = resource.userStats.bind(resource);

	this.getInitialBalance = function(transactions) {
		if(transactions && transactions.length > 0) {
			var last = transactions.slice(-1);
			return parseFloat(last[0].balance) - parseFloat(last[0].amount);
		}
		return 0;
	};
};
angular.module('oraApp.accounting')
	.service('accountService', ['$resource', 'identity', AccountService]);