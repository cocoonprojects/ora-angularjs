angular.module('oraApp.people')
	.service('memberService', ['$resource', 'identity',
		function($resource, identity) {
			var resource = $resource('api/:orgId/people/members/:memberId', { orgId: '@orgId' }, {
				get: {
					method: 'GET',
					headers: { 'GOOGLE-JWT': identity.getToken() }
				},
				query: {
					method: 'GET',
					isArray: false,
					headers: { 'GOOGLE-JWT': identity.getToken() }
				},
			});

			this.query = resource.query;
			this.get   = resource.get;
		}]);