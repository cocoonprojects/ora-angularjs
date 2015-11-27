angular.module('oraApp.collaboration')
	.controller('ItemListController', ['$scope', '$log', '$interval','$mdDialog', '$stateParams', 'streamService', 'itemService',
		function ($scope, $log, $interval, $mdDialog, $stateParams, streamService, itemService) {
			this.onLoadingError = function(error) {
				$log.debug(error);
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			$scope.streams = null;
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
			this.isAllowed = function(command, resource) {
				if(command == 'createStream') {
					return streamService.isAllowed(command, resource);
				}
				return itemService.isAllowed(command, resource);
			};
			this.getOwner = function(item) {
				var member = itemService.getOwner(item);
				return $scope.user(member);
			};

			this.filterTasks = function() {
				itemService.query($scope.filters, function(data) { $scope.tasks = data; }, this.onLoadingError);
			};
			this.stream = function(task) {
				if($scope.streams && task.stream) {
					return $scope.streams._embedded['ora:stream'][task.stream.id];
				}
				return null;
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
			this.joinItem = function(item) {
				itemService.joinItem(item, this.updateItem, $log.warn);
			};
			this.unjoinItem = function(item) {
				itemService.unjoinItem(item, this.updateItem, $log.warn);
			};
			this.openEstimateItem = function(ev, item) {
				$mdDialog.show({
						controller: EstimateItemController,
						templateUrl: 'app/collaboration/partials/estimate-item.html',
						targetEvent: ev,
						clickOutsideToClose: true,
						locals: {
							item: item,
							prevEstimation: item.members[$scope.identity.getId()].estimation
						}
				}).then(this.updateItem);
			};
			this.openAssignShares = function(ev, item) {
				$mdDialog.show({
						controller: AssignSharesController,
						templateUrl: 'app/collaboration/partials/assign-shares.html',
						targetEvent: ev,
						clickOutsideToClose: true,
						scope: $scope.$new(),
						locals: {
							item: item
					}
				}).then(this.updateItem);
			};
			this.addStream = function(stream) {
				$scope.streams._embedded['ora:stream'][stream.id] = stream;
			};
			this.addTask = function(item) {
				$scope.tasks._embedded['ora:task'].unshift(item);
			};
			this.updateItem = function(item) {
				var items = $scope.tasks._embedded['ora:task'];
				for(var i = 0; i < items.length; i++) {
					if(items[i].id == item.id) {
						items[i] = item;
						break;
					}
				}
			};
			this.isNewEntitiesAllowed = function(organization) {
				return itemService.isAllowed('createItem', organization) ||
								streamService.isAllowed('createStream', organization);
			};
		}]);