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
        'itemService',
		function (
			$scope,
			$log,
			$stateParams,
			organizationService,
			kanbanizeService,
			$state,
            streamService,
			$mdDialog,
            settingsService,
            itemService) {

			$scope.settings = {};
			$scope.boards = [];
            $scope.board = null;
            $scope.columns = [];
            $scope.projects = [];
            $scope.ITEM_STATUS = itemService.ITEM_STATUS;

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

                $scope.board = findSelectedBoard(boards);

                return boards;
			};

            var findSelectedBoard = function(boards){
                var board = _.find(boards,function(b){
                   return !!b.streamId;
                });

                return board && board.id;
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
                        $scope.projects = data.projects;
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
                    $scope.projects = data.projects;
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

            var findProjectId = function(projects,boardId){
                var project = _.find(projects,function(project){
                    return _.find(project.boards,function(board){
                       return board.id === boardId;
                    });
                });

                return project && project.id;
            };

            var unwatchBoard = $scope.$watch('board',function(){
               if($scope.board){
                   kanbanizeService.getBoardDetails($stateParams.orgId, $scope.board,function(data){
                       $scope.boardSetting = _.extend({
                           "projectId" : findProjectId($scope.projects,$scope.board)
                       },data);
                       console.log($scope.boardSetting);
                   });
               }
            });

            $scope.$on('$destroy',function(){
               unwatchBoard();
            });

		}]);
