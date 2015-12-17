var AccountService = function($resource, $interval, identity) {
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
		},
		deposit: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'accounts', memberId: 'deposits' }
		},
		withdraw: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'accounts', memberId: 'withdrawals' }
		},
		transferIn: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'accounts', memberId: 'incoming-transfers' }
		},
		transferOut: {
			method: 'POST',
			headers: { 'GOOGLE-JWT': identity.getToken() },
			params: { controller: 'accounts', memberId: 'outgoing-transfers' }
		}
	});

	this.get = resource.get.bind(resource);
	this.query = resource.query.bind(resource);
	var isPersonalPolling = false;
	this.personalStatement = function(organizationId, filters, success, error) {
		isPersonalPolling = true;
		resource.personalStatement(
				angular.extend({ orgId: organizationId }, filters),
				function (data) {
					isPersonalPolling = false;
					success(data);
				},
				function (response) {
					isPersonalPolling = false;
					error(response);
				});
	};
	var isOrganizationPolling = false;
	this.organizationStatement = function(organizationId, filters, success, error) {
		isOrganizationPolling = true;
		resource.organizationStatement(
				angular.extend({ orgId: organizationId }, filters),
				function (data) {
					isOrganizationPolling = false;
					success(data);
				},
				function (response) {
					isOrganizationPolling = false;
					error(response);
				});
	};
	this.userStats = resource.userStats.bind(resource);
	this.deposit = resource.deposit.bind(resource);
	this.withdraw = resource.withdraw.bind(resource);
	this.transferIn = resource.transferIn.bind(resource);
	this.transferOut = function(account, transfer, success, error) {
		return resource.transferOut(
				{
					orgId: account.organization.id,
					accountId: account.id
				},
				transfer,
				success,
				error
		);
	};

	var personalPolling = null;
	this.startPersonalPolling = function(organizationId, filters, success, error, millis) {
		this.personalStatement(organizationId, filters, success, error);
		var that = this;
		personalPolling = $interval(function() {
			if (isPersonalPolling) return;
			that.personalStatement(organizationId, filters, success, error);
		}, millis);
	};
	this.stopPersonalPolling = function() {
		if(personalPolling) {
			$interval.cancel(personalPolling);
			personalPolling = null;
		}
	};

	var organizationPolling = null;
	this.startOrganizationPolling = function(organizationId, filters, success, error, millis) {
		this.organizationStatement(organizationId, filters, success, error);
		var that = this;
		organizationPolling = $interval(function() {
			if (isOrganizationPolling) return;
			that.organizationStatement(organizationId, filters, success, error);
		}, millis);
	};
	this.stopOrganizationPolling = function() {
		if(organizationPolling) {
			$interval.cancel(organizationPolling);
			organizationPolling = null;
		}
	};
	this.getIdentity = function() {
		return identity;
	};
};
AccountService.prototype = {
	constructor: AccountService,

	getInitialBalance: function(transactions) {
		if(transactions && transactions.length > 0) {
			var last = transactions.slice(-1);
			return parseFloat(last[0].balance) - parseFloat(last[0].amount);
		}
		return 0;
	},

	isOrganizationAccount: function(account) {
		return account && account.type == 'shared';
	},

	isHolder: function(account, userId) {
		return account.holders &&
				account.holders.hasOwnProperty(userId);
	},

	visibilityCriteria: {
		'deposit': function(account) {
			return this.getIdentity().isAuthenticated() &&
				this.isOrganizationAccount(account) &&
					this.isHolder(account, this.getIdentity().getId());
		},
		'withdrawal': function(account) {
			return this.getIdentity().isAuthenticated() &&
					this.isOrganizationAccount(account) &&
					this.isHolder(account, this.getIdentity().getId());
		},
		'incomingTransfer': function(account) {
			return this.getIdentity().isAuthenticated() &&
					this.isOrganizationAccount(account) &&
					this.isHolder(account, this.getIdentity().getId());
		},
		'outgoingTransfer': function(account) {
			return this.getIdentity().isAuthenticated() &&
					this.isOrganizationAccount(account) &&
					this.isHolder(account, this.getIdentity().getId());
		}
	},

	isAllowed: function(command, resource) {
		var criteria = this.visibilityCriteria[command];
		if(criteria) {
			criteria = criteria.bind(this);
			return criteria(resource);
		}
		return true;
	}
};
angular.module('oraApp.accounting')
	.service('accountService', ['$resource', '$interval', 'identity', AccountService]);