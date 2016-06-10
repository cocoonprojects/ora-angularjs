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
        'settingsService',
		function (
			$scope,
			$log,
			$stateParams,
			organizationService,
			kanbanizeService,
			$state,
            streamService,
			$mdDialog,
            settingsService) {

			$scope.settings = {};
			$scope.boards = [];

			var readBoards = function(projects){
				var boards = _.map(projects,function (p) {
					return p.boards;
				});

				boards = _.flatten(boards,true);

                _.each(boards,function(b){
                    kanbanizeService.getBoardDetails($stateParams.orgId,b.id,
                        function(data) {
                            angular.extend(b, data);
                        }
                    );
                });

                return boards;
			};

			this.kanbanizeSectionAllowed = kanbanizeService.isAllowed.bind(kanbanizeService);

            $scope.orgSettings = {};
            settingsService.get($stateParams.orgId).then(function(settings){
                $scope.orgSettings = settings;
            });

            this.updateSettings = function(){
                settingsService.set($stateParams.orgId,$scope.orgSettings);
            };

			this.updateKanbanizeSettings = function(){
				kanbanizeService.updateSettings($stateParams.orgId, $scope.settings,
					function(data) {
                        $scope.boards = readBoards(data.projects);
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
                    $scope.settings.apiKey = data.apikey;
                    $scope.boards = readBoards(data.projects);
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
