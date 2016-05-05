angular.module('app.flow', ['ui.router'])
	.config(['$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			$stateProvider.
				state('flow', {
					url: '/flow',
					templateUrl: 'app/flow/partials/flow.html',
					controller: 'FlowController as ctrl',
					resolve:{
						streams:['streamService','SelectedOrganizationId','$q',function(streamService,SelectedOrganizationId,$q){
							var deferred = $q.defer();
							streamService.query(SelectedOrganizationId.get(),function(data){
								deferred.resolve(_.values(data._embedded['ora:stream']));
							},function(){
								deferred.resolve([]);
							});
							return deferred.promise;
						}]
					}
				});
		}
	]);
