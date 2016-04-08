angular.module('app.collaboration')
	.controller('ItemDetailController', [
		'$scope',
		'$state',
		'$stateParams',
		'$mdDialog',
		'$log',
		'streamService',
		'itemService',
		function (
			$scope,
			$state,
			$stateParams,
			$mdDialog,
			$log,
			streamService,
			itemService) {

			var onLoadItem = function(data){
				$scope.owner = itemService.getOwner(data);
				$scope.item = data;
				$scope.members = _.filter(data.members,function(member){
					return member.id !== $scope.owner.id;
				});
			};

			$scope.streams = null;
			streamService.query($stateParams.orgId, function(data) { $scope.streams = data; });
			this.onLoadingError = function(error) {
				$log.debug(error);
				switch (error.status) {
					case 401:
						itemService.stopGetPolling();
						break;
				}
			};
			$scope.item = null;
			$scope.ITEM_STATUS = itemService.ITEM_STATUS;
			itemService.startGetPolling($stateParams.orgId, $stateParams.itemId, onLoadItem, this.onLoadingError, 10000);
			$scope.$on('$destroy', itemService.stopGetPolling);
			this.stream = function(item) {
				if($scope.streams && item && item.stream) {
					return $scope.streams._embedded['ora:stream'][item.stream.id];
				}
				return null;
			};
			this.isAllowed = itemService.isAllowed.bind(itemService);
			this.hasMore = function(item) {
				return this.isAllowed('editItem', item) ||
						this.isAllowed('deleteItem', item) ||
						this.isAllowed('unjoinItem', item) ||
						this.isAllowed('reExecuteItem', item);
			};
			this.parseDate = function(when) {
				return Date.parse(when);
			};
			this.openEditItem = function(ev, item) {
				$mdDialog.show({
					controller: EditItemController,
					controllerAs: 'dialogCtrl',
					templateUrl: 'app/collaboration/partials/edit-item.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					locals: {
						task: item
					}
				}).then(this.updateItem);
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
							$state.go('org.collaboration', { orgId: item.organization.id });
						},
						$log.warn
					);
				});
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
					controllerAs: 'dialogCtrl',
					templateUrl: 'app/collaboration/partials/estimate-item.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					locals: {
						item: item,
						prevEstimation: item.members[$scope.identity.getId()].estimation
					}
				}).then(this.updateItem);
			};
			this.executeItem = function(item) {
				itemService.executeItem(item, this.updateItem, $log.warn);
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
				itemService.completeItem(item, this.updateItem, $log.warn);
			};
			this.acceptItem = function(item) {
				itemService.acceptItem(item, this.updateItem, $log.warn);
			};
			this.openAssignShares = function(ev, item) {
				$mdDialog.show({
					controller: AssignSharesController,
					controllerAs: 'dialogCtrl',
					templateUrl: 'app/collaboration/partials/assign-shares.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					scope: $scope.$new(),
					locals: {
						item: item
					}
				}).then(this.updateItem);
			};
                        this.openApproveIdea = function(ev, item) {
				$mdDialog.show({
					controller: ApproveIdeaController,
					controllerAs: 'dialogCtrl',
					templateUrl: 'app/collaboration/partials/approve-item.html',
					targetEvent: ev,
					clickOutsideToClose: true,
					fullscreen: true,
					locals: {
						item: item
						//prevEstimation: item.members[$scope.identity.getId()].estimation
					}
				}).then(this.updateItem);
			};
			this.remindItemEstimate = function(item) {
				itemService.remindItemEstimate(item, $log.info, $log.warn);
			};
			this.updateItem = function(item) {
				$scope.item = item;
			};
			this.closeItem = function(item) {
				itemService.closeItem(item, this.updateItem, $log.warn);
			};
		}]);
