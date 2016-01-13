angular.module('app')
	.controller('BoardController', ['$scope', '$log', '$stateParams', 'kanbanizeService', 'itemService', '$mdToast', '$state',
		function ($scope, $log, $stateParams, kanbanizeService, itemService, $mdToast, $state) {
			$scope.boardSetting = {
				"projectId" : $stateParams.projectId
			};
			$scope.boardId = $stateParams.boardId;
			$scope.ITEM_STATUS = itemService.ITEM_STATUS;
			kanbanizeService.getBoardDetails($stateParams.orgId, $stateParams.boardId, 
				function(data) {
					angular.extend($scope.boardSetting, data);
				},
				function(httpResponse) {
					switch(httpResponse.status) {
						case 400:
						case 502:
							$mdToast.show(
								$mdToast.simple()
									.textContent(httpResponse.data.description)
									.position('bottom left')
									.hideDelay(6000)
							);
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