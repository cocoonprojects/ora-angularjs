angular.module('app')
	.controller('OrganizationSettingsController', ['$scope', '$log', '$stateParams', 'organizationService', 'kanbanizeService', '$state',
		function ($scope, $log, $stateParams, organizationService, kanbanizeService, $state) {
		
			$scope.settings = {};
			this.kanbanizeSectionAllowed = kanbanizeService.isAllowed.bind(kanbanizeService);
			this.updateKanbanizeSettings = function(){
				kanbanizeService.updateSettings($stateParams.orgId, $scope.settings,
					function(data) { 
						$scope.projects = data.projects; 
					},
					function(httpResponse) {
						switch(httpResponse.status) {
							case 400:
								httpResponse.data.errors.forEach(function(error) {
									$scope.form[error.field].$error.remote = error.message;
								});
								break;
							default:
								$log.warn(httpResponse);
						}
					}
				);
			};
			kanbanizeService.query($stateParams.orgId,
				function(data) {
					$scope.settings.subdomain = data.subdomain;
					$scope.projects = data.projects;
				},
				function(httpResponse) {
					switch(httpResponse.status) {
						case 400:
							httpResponse.data.errors.forEach(function(error) {
								$scope.form[error.field].$error.remote = error.message;
							});
							break;
						default:
							$log.warn(httpResponse);
					}
				}
			);
			this.loadBoardSettings = function(organizationId, boardId, boardName, projectName, projectId){
				kanbanizeService.setBoardName(boardName);
				kanbanizeService.setProjectName(projectName);
				kanbanizeService.setProjectId(projectId);
				$state.go("org.kanbanizeBoard", {'orgId': organizationId, 'boardId': boardId});
			};
		}]);