var collaborationServices = angular.module('collaborationServices', ['ngResource'])
	.factory('Task', ['$resource',
		function($resource){
			return $resource('data/task-management/tasks/:taskId.json', {}, {
				query: { method: 'GET' },
				delete: { method: 'DELETE' },
				edit: { method: 'UPDATE' }
			});
		}])
	.service('taskService', ['$resource', '$log',
		function($resource, $log) {
			var ROLE_MEMBER = 'member';
			var ROLE_OWNER  = 'owner';

			var backend = $resource('data/task-management/tasks/:taskId/:controller.json', { }, {
				query:  { method: 'GET', isArray: false },
				save:   { method: 'POST' },
				delete: { method: 'DELETE' }
			});

			this.collection = {
				_embedded: {
					"ora:task": []
				},
				count: 0,
				total: 0
			};

			this.updateCollection = function() {
				this.collection = backend.query({},
					function() {
						$log.debug('success');
					},
					function() {
						$log.debug('error');
					});
				return this.collection;
			};

			this.joinTask = function(task, user) {
				if(task.members === undefined) {
					task.members = {};
				}
				task.members[user.id] = {
					id: user.id,
					firstname: user.firstname,
					lastname: user.lastname,
					role: ROLE_MEMBER,
					picture: user.picture
				}
				backend.save({ taskId: task.id, controller: 'members' }, { },
					function() {
						$log.debug('success');
					},
					function() {
						$log.debug('error');
					});
			};
			this.unjoinTask = function(task, user) {
				delete task.members[user.id];
				backend.delete({ taskId: task.id, controller: 'members' }, { },
					function() {
						$log.debug('success');
					},
					function() {
						$log.debug('error');
					});
			}
		}
	]);

var peopleServices = angular.module('peopleServices', ['ngResource']);

peopleServices.factory('People', ['$resource',
	function($resource) {

		return $resource('data/people/organizations/:orgId/members/:id.json', { }, {
				query: { method: 'GET',  params: { },  isArray: false }
			}
		);
}]);

angular.module('acl', [])
.service('AclService', ['$log',
		function($log) {
			this.isAllowed = function(user, resource, privilege) {
				switch(privilege) {
					case 'joinTask':
						return resource.status < 20 && resource.members[user.id] === undefined; // Manca il controlle sull'essere membro dell'organizzazione
					case 'unjoinTask':
						return resource.status < 20 && resource.members[user.id] !== undefined;
				}
			}
	}]);