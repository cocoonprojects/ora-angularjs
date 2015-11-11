angular.module('oraApp.collaboration')
	.service('streamService', ['$resource', 'identity',
		function($resource, identity) {
			var resource = $resource('api/:orgId/task-management/streams/:streamId/:controller', { orgId: '@orgId' }, {
				query:  { method: 'GET', isArray: false, headers: { 'GOOGLE-JWT': identity.getToken() } },
				save:   { method: 'POST' },
				delete: { method: 'DELETE' }
			});

			this.query = resource.query;
			this.save  = resource.save;
			this.delete = resource.delete;
			this.stream = function(task) {
				if($scope.streams) {
					return $scope.streams._embedded['ora:stream'][task.stream.id];
				}
				return null;
			};
		}]);