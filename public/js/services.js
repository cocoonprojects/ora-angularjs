var collaborationServices = angular.module('collaborationServices', ['ngResource']);

collaborationServices.factory('Task', ['$resource',
	function($resource){
		return $resource('data/task-management/tasks/:taskId.json', {}, {
			query: { method: 'GET' },
			delete: { method: 'DELETE' },
			edit: { method: 'UPDATE' }
		});
	}]);

var peopleServices = angular.module('peopleServices', ['ngResource']);

peopleServices.factory('People', ['$resource',
	function($resource) {

		return $resource('data/people/organizations/:orgId/members/:id.json', { }, {
				query: { method: 'GET',  params: { },  isArray: false }
			}
		);
}]);