angular.module('app')
	.controller('OrganizationBoardsController', ['$scope', '$log', '$stateParams', 'organizationService', 'kanbanizeService', 'itemService', '$mdToast',
		function ($scope, $log, $stateParams, organizationService, kanbanizeService, itemService, $mdToast) {
			$scope.boardSetting = {
				"projectId" : kanbanizeService.getProjectId()
			};
			$scope.ITEM_STATUS = itemService.ITEM_STATUS;
			kanbanizeService.getBoardDetails($stateParams.orgId, $stateParams.boardId, 
				function(data) {
					$scope.mapping = data.mapping;
					$scope.boardId = $stateParams.boardId;
					$scope.boardSetting.streamName = data.streamName || kanbanizeService.getStreamName();
					angular.forEach(data.mapping, function(value, key) {
						this[key] = value;
					}, $scope.boardSetting);
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
			this.saveSettings = function(){
				kanbanizeService.saveBoardSettings($stateParams.orgId, $stateParams.boardId, $scope.boardSetting, 
					function(data) {
						$mdToast.show(
							$mdToast.simple()
								.textContent('Board configuration saved')
								.position('bottom left')
								.hideDelay(3000)
						);
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
		}]);