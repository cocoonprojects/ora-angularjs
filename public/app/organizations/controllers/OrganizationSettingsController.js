angular.module('app')
	.controller('OrganizationSettingsController', [
		'$scope',
		'$log',
		'$stateParams',
		'organizationService',
		'kanbanizeService',
		'$state',
		'streamService',
		'$mdDialog',
		function (
			$scope,
			$log,
			$stateParams,
			organizationService,
			kanbanizeService,
			$state,
			streamService,
			$mdDialog) {

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

			var loadStreams = function(){
				$scope.streams = [];
				streamService.query($stateParams.orgId, function(data) {
					$scope.streams = _.values(data._embedded['ora:stream']);
				});
			};

			loadStreams();

			$scope.newStream = function(ev){
				$mdDialog.show({
					controller: NewStreamController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/collaboration/partials/new-stream.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						orgId: $stateParams.orgId
					}
				}).then(loadStreams);
			};

		}]);
