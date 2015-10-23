angular.module('oraApp.people')
	.factory('memberService', ['$resource', 'identity',
		function($resource, identity) {
			return $resource('api/:orgId/people/members/:taskId/:controller', { orgId: '@orgId' }, {
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } }
			});
		}]);