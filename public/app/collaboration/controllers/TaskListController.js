angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$interval','$mdDialog', '$stateParams', 'streamService', 'itemService',
		function ($scope, $log, $interval, $mdDialog, $stateParams, streamService, itemService) {
			this.onLoadingError = function(error) {
				$log.debug(error);
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			$scope.streams = {};
			$scope.filters = {
				orgId: $stateParams.orgId,
				limit: 10,
				offset: 0
			};
			$scope.tasks = [];
			streamService.startQueryPolling($scope.organization, function(data) { $scope.streams = data; }, this.onLoadingError, 605000);
			itemService.startQueryPolling($scope.filters, function(data) { $scope.tasks = data; }, this.onLoadingError, 10000);
			this.cancelAutoUpdate = function() {
				streamService.stopQueryPolling();
				itemService.stopQueryPolling();
			};
			$scope.$on('$destroy', this.cancelAutoUpdate);

			$scope.ITEM_STATUS = itemService.ITEM_STATUS;
			this.isAllowed = itemService.isAllowed.bind(itemService);
			this.isOwner   = itemService.isOwner.bind(itemService);

			this.filterTasks = function() {
				itemService.query($scope.filters, function(data) { $scope.tasks = data; }, this.onLoadingError);
			};
			this.stream = function(task) {
				if($scope.streams && task.stream) {
					return $scope.streams._embedded['ora:stream'][task.stream.id];
				}
				return null;
			};

			this.countEstimators = function(task) {
				if(task.status != itemService.ITEM_STATUS.ONGOING){
					return '';
				}
				var n = itemService.countEstimators(task);
				var tot = Object.keys(task.members).length;
				switch (n) {
					case tot:
						return "(All members have estimated)";
					case 0:
						return "(None has estimated yet)";
					default:
						return "(" + n + " of " + tot + " members have estimated)";
				}
			};

			this.openMoreMenu = function($mdOpenMenu, ev) {
				$mdOpenMenu(ev);
			};
			this.openNewStream = function(ev) {
				$mdDialog.show({
					controller: NewStreamController,
					templateUrl: "app/collaboration/partials/new-stream.html",
					targetEvent: ev,
					clickOutsideToClose: true
				}).then(this.addStream);
			};
			this.openNewItem = function(ev) {
				$mdDialog.show({
					controller: NewItemController,
					templateUrl: "app/collaboration/partials/new-item.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						streams: $scope.streams
					}
				}).then(this.addTask);
			};
			this.openEditItem = function(ev, task) {
				$mdDialog.show({
					controller: EditItemController,
					templateUrl: 'app/collaboration/partials/edit-item.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						task: task
					}
				}).then(this.updateTasks);
			};
			this.deleteItem = function(ev, item) {
				var confirm = $mdDialog.confirm()
						.title("Would you delete this item?")
						.textContent("It removes all its informations and cannot be undone.")
						.targetEvent(ev)
						.ok("Yes")
						.cancel("No");
				$mdDialog.show(confirm).then(function() {
					itemService.delete(item,
						function() {
							var items = $scope.tasks._embedded['ora:task'];
							for(var i = 0; i < items.length; i++) {
								if(items[i].id == item.id) {
									items.splice(i, 1);
									break;
								}
							}
						},
						$log.warn
					);
				});
			};
			this.joinItem = function(item) {
				itemService.joinItem(item, this.updateTasks, $log.warn);
			};
			this.unjoinItem = function(item) {
				itemService.unjoinItem(item, this.updateTasks, $log.warn);
			};
			this.openEstimateItem = function(ev, item) {
				$mdDialog.show({
					controller: EstimateItemController,
					templateUrl: 'app/collaboration/partials/estimate-item.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						item: item,
						prevEstimation: item.members[$scope.identity.getId()].estimation
					}
				}).then(this.updateTasks);
			};
			this.executeItem = function(item) {
				itemService.executeItem(item, this.updateTasks, $log.warn);
			};
			this.reExecuteItem = function(ev, item) {
				var that = this;
				var confirm = $mdDialog.confirm()
						.title("Would you revert this item to ongoing?")
						.textContent("Organization members can join, item members can unjoin or change their estimates.")
						.targetEvent(ev)
						.ok("Yes")
						.cancel("No");

				$mdDialog.show(confirm)
					.then(function() {
						that.executeItem(item);
					});
			};
			this.completeItem = function(ev, item) {
				var that = this;
				var confirm = $mdDialog.confirm()
						.title("Would you mark this item as completed?")
						.textContent("It freezes item members and their estimation.")
						.targetEvent(ev)
						.ok("Yes")
						.cancel("No");

				$mdDialog.show(confirm)
					.then(function() {
						that.reCompleteItem(item);
					});
			};
			this.reCompleteItem = function(item) {
				itemService.completeItem(item, this.updateTasks, $log.warn);
			};
			this.acceptItem = function(item) {
				itemService.acceptItem(item, this.updateTasks, $log.warn);
			};
			this.openAssignShares = function(ev, item) {
				$mdDialog.show({
					controller: AssignSharesController,
					templateUrl: 'app/collaboration/partials/assign-shares.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						task: item
					}
				}).then(this.updateTasks);
			};
			this.remindItemEstimate = function(item) {
				itemService.remindItemEstimate(item, $log.info, $log.warn);
			};
			this.addStream = function(stream) {
				$scope.streams._embedded['ora:stream'][stream.id] = stream;
			};
			this.addTask = function(item) {
				$scope.tasks._embedded['ora:task'].unshift(item);
			};
			this.updateTasks = function(item) {
				var items = $scope.tasks._embedded['ora:task'];
				for(var i = 0; i < items.length; i++) {
					if(items[i].id == item.id) {
						items[i] = item;
						break;
					}
				}
			};
			this.hasMore = function(item) {
				return this.isAllowed('editItem', item) ||
					this.isAllowed('deleteItem', item) ||
					this.isAllowed('unjoinItem', item) ||
					this.isAllowed('reExecuteItem', item);
			};
			this.isNewEntitiesAllowed = function(organization) {
				return itemService.isAllowed('createItem', organization) ||
								streamService.isAllowed('createStream', organization);
			};
		}]);