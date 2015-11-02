angular.module('oraApp.people')
	.service('memberService', ['$resource', 'identity',
		function($resource, identity) {
			var that = this;
			var resource = $resource('api/:orgId/:module/:foo/:memberId/:controller', { orgId: '@orgId' }, {
				get: { method: 'GET', params: { foo: 'user-profiles' }, headers: { 'GOOGLE-JWT': identity.getToken() } },
				query:  { method: 'GET', params: { module: 'people', foo: 'members' }, isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } },
			});

			this.query = resource.query;
			this.get   = resource.get;
		}]);