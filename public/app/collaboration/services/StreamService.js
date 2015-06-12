angular.module('oraApp.collaboration')
	.service('streamService', ['$resource', '$log',
		function($resource, $log) {
			var backend = $resource('data/task-management/streams/:streamId/:controller.json', { }, {
				query:  { method: 'GET', isArray: false },
				save:   { method: 'POST' },
				delete: { method: 'DELETE' }
			});
			this.updateStreams = function() {
				this.streams = backend.query({},
					function() {
						$log.debug('success');
					},
					function() {
						$log.debug('error');
					});
				return this.streams;
			};
			this.getStreams = function() {
				return this.streams;
			}
			this.streams = this.updateStreams();
		}]);