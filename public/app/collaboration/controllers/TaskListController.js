angular.module('oraApp.collaboration')
	.controller('TaskListController', ['$scope', '$log', '$interval','$mdDialog', '$stateParams', 'streamService', 'itemService',
		function ($scope, $log, $interval, $mdDialog, $stateParams, streamService, itemService) {
			$scope.isOpen = false;
			$scope.tasks = itemService.query({ orgId: $stateParams.orgId });

			var isRefreshing = false;
			this.refreshTasks = function() {
				if(isRefreshing) return;
				isRefreshing = true;
				itemService.query({ orgId: $stateParams.orgId }, function(value) { $scope.tasks = value; isRefreshing = false;});
			};

			var tasksAutoUpdate = $interval(this.refreshTasks, 10000);
			$scope.$on('$destroy', function() {
				if(tasksAutoUpdate)
					$interval.cancel(tasksAutoUpdate);
			});
			$scope.isAllowed = itemService.isAllowed.bind(itemService);
			$scope.isOwner   = itemService.isOwner.bind(itemService);

			this.countEstimators = function(task) {
				if(task.status != itemService.ITEM_STATUS.ONGOING){
					return '';
				}
				var n = itemService.countEstimators(task);
				var tot = Object.keys(task.members).length;
				switch (n) {
					case tot:
						return " (All members have estimated)";
					case 0:
						return " (None has estimated yet)";
					default:
						return " (" + n + " of " + tot + " members have estimated)";
				}
			};

			this.openMoreMenu = function($mdOpenMenu, ev) {
				$mdOpenMenu(ev);
			};
			this.openNewTask = function(ev) {
				$mdDialog.show({
					controller: NewItemController,
					templateUrl: "app/collaboration/partials/new-item.html",
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						itemService: itemService
					}
				}).then(this.addTask);
			};
			this.openEditTask = function(ev, task) {
				$mdDialog.show({
					controller: EditItemController,
					templateUrl: 'app/collaboration/partials/edit-item.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						itemService: itemService,
						task: task
					}
				}).then(this.updateTasks);
			};
			this.deleteItem = function(task) {
				var confirm = $mdDialog.confirm()
					.content("Deleting this item removes all its informations\nand cannot be undone. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm).then(function() {
					itemService.delete(
						{
							orgId: task.organization.id,
							taskId: task.id },
						{ },
						function(value) {
							var tasks = $scope.tasks._embedded['ora:task'];
							for(var i = 0; i < tasks.length; i++) {
								if(tasks[i].id == task.id) {
									tasks.splice(i, 1);
									break;
								}
							}
						},
						$log.warn
					);
				});
			};
			this.joinItem = function(task) {
				itemService.joinItem(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{ },
					this.updateTasks,
					$log.warn
				);
			};
			this.unjoinItem = function(task) {
				itemService.unjoinItem(
					{
						orgId: task.organization.id,
						taskId: task.id },
					{ },
					this.updateTasks,
					$log.warn
				);
			};
			this.openEstimateTask = function(ev, item) {
				$mdDialog.show({
					controller: EstimateItemController,
					templateUrl: 'app/collaboration/partials/estimate-item.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						itemService: itemService,
						item: item
					}
				}).then(this.updateTasks);
			};
			this.executeItem = function(task) {
				itemService.executeItem(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{
						action: 'execute'
					},
					this.updateTasks,
					$log.warn
				);
			};
			this.reExecuteItem = function(task) {
				var that = this;
				var confirm = $mdDialog.confirm()
					.content("Reverting this item to ongoing allows users to join, members to unjoin and change their estimation. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm)
					.then(function() {
						that.executeItem(task);
					});
			};
			this.completeItem = function(task) {
				var that = this;
				var confirm = $mdDialog.confirm()
					.content("Completing this item freezes task members and their estimation. Do you want to proceed?")
					.ok("Yes")
					.cancel("No");
				$mdDialog.show(confirm)
					.then(function() {
						that.reCompleteItem(task);
					});
			};
			this.reCompleteItem = function(task) {
				itemService.completeItem(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{
						action: 'complete'
					},
					this.updateTasks,
					$log.warn
				);
			};
			this.acceptItem = function(task) {
				itemService.acceptItem(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{
						action: 'accept'
					},
					this.updateTasks,
					$log.warn
				);
			};
			this.openAssignShares = function(ev, task) {
				$mdDialog.show({
					controller: AssignSharesController,
					templateUrl: 'app/collaboration/partials/assign-shares.html',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose: true,
					scope: $scope.$new(),
					locals: {
						itemService: itemService,
						task: task
					}
				}).then(this.updateTasks);
			};
			this.remindItemEstimate = function(task) {
				itemService.remindItemEstimate(
					{
						orgId: task.organization.id,
						taskId: task.id
					},
					{
						action: 'accept'
					},
					$log.info,
					$log.warn
				);
			};
			this.addTask = function(task) {
				$scope.tasks._embedded['ora:task'].unshift(task);
			};
			this.updateTasks = function(task) {
				var tasks = $scope.tasks._embedded['ora:task'];
				for(var i = 0; i < tasks.length; i++) {
					if(tasks[i].id == task.id) {
						tasks[i] = task;
						break;
					}
				}
			};
			this.hasMore = function(task) {
				return $scope.isAllowed('editItem', task) ||
					$scope.isAllowed('deleteItem', task) ||
					$scope.isAllowed('unjoinItem', task) ||
					$scope.isAllowed('reExecuteItem', task);
			};
		}]);