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
		'$mdToast',
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
            itemService,
			$mdToast) {

			$scope.settings = {};
			$scope.boards = [];
            $scope.board = null;
            $scope.columns = [];
            $scope.projects = [];
            $scope.ITEM_STATUS = itemService.ITEM_STATUS;
			$scope.loadingKanbanize = true;

			var readBoards = function(projects){

				var boards = _.map(projects,function (p) {
					return p.boards;
				});

				boards = _.flatten(boards,true);

                $scope.board = findSelectedBoard(boards);

                return boards;
			};

            var findSelectedBoard = function(boards){
                var board = _.find(boards,function(b){
                   return !!b.streamId;
                });

                return board && board.id;
            };

			$scope.kanbanizeSectionAllowed = kanbanizeService.isAllowed.bind(kanbanizeService);

            $scope.orgSettings = {};
            settingsService.get($stateParams.orgId).then(function(settings){
                $scope.orgSettings = settings;
            });

            this.updateSettings = function(){
                settingsService.set($stateParams.orgId,$scope.orgSettings);
            };

			this.updateKanbanizeSettings = function(){
				$scope.projects = [];
				$scope.boards = [];
				$scope.updatingKanbanize = true;
				kanbanizeService.updateSettings($stateParams.orgId, $scope.settings,
					function(data) {
                        $scope.projects = data.projects;
                        $scope.boards = readBoards(data.projects);
						$scope.updatingKanbanize = false;
					},
					function(httpResponse) {
						$scope.updatingKanbanize = false;
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

			var printMappingError = function(data) {

				var mappingError = _.find(data.errors,function(error){
					return error.field === 'mapping';
				});

				if(mappingError){
					$mdToast.show(
						$mdToast.simple()
							.textContent(mappingError.message)
							.position('bottom left')
							.hideDelay(3000)
					);
				}
			};

			this.saveKanbanizeBoards = function(){
				$scope.updatingKanbanize = true;
				kanbanizeService.saveBoardSettings($stateParams.orgId, $scope.board, $scope.boardSetting,
					function(data) {
						$scope.updatingKanbanize = false;
						$mdToast.show(
							$mdToast.simple()
								.textContent('Board configuration saved')
								.position('bottom left')
								.hideDelay(3000)
						);
					},
					function(httpResponse) {
						$scope.updatingKanbanize = false;
						switch(httpResponse.status) {
							case 400:
								printMappingError(httpResponse.data);
								httpResponse.data.errors.forEach(function(error) {
									if($scope.boardList[error.field]){
										$scope.boardList[error.field].$error.remote = error.message;
									}
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
					$scope.loadingKanbanize = false;
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
					   var stream = $scope.streams[0];

					   $scope.boardSetting = _.extend(data,{
                           projectId : findProjectId($scope.projects,$scope.board),
						   streamId: stream.id,
						   streamName: stream.subject
                       });

                       console.log($scope.boardSetting);
                   });
               }
            });

            $scope.$on('$destroy',function(){
               unwatchBoard();
            });

			loadStreams();

		}]);
