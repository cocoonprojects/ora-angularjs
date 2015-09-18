angular.module('oraApp.collaboration')
	.factory('streamService', ['$resource', 'identity',
		function($resource, identity) {
			return $resource('api/:orgId/task-management/streams/:streamId/:controller', { orgId: '@orgId' }, {
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } },
				save:   { method: 'POST' },
				delete: { method: 'DELETE' }
			});
		}]);