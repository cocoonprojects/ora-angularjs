angular.module('app.collaboration')
	.controller('ItemListController', [
		'$scope',
		'$log',
		'$interval',
		'$stateParams',
		'$mdDialog',
		'$mdToast',
		'streamService',
		'itemService',
		'$state',
		'voteExtractor',
		function (
			$scope,
			$log,
			$interval,
			$stateParams,
			$mdDialog,
			$mdToast,
			streamService,
			itemService,
			$state,
			voteExtractor) {

			$scope.menu = {
				open:false
			};

			$scope.currentUserId = $scope.identity.getId();

			$scope.decisions = $state.$current.data.decisions;

			$scope.changeUpdateTime = false;

			$scope.changeStatusTime = false;

			$scope.streams = null;

			$scope.filters = {
				offset: 0,
				status: "All",
				cardType: ($scope.decisions ? "decisions" : "all"),
				memberId: null,
				orderBy: 'mostRecentEditAt', //exeption for handle sort without break signature method
				orderType: ($scope.changeUpdateTime ? "asc" : "desc") //exeption for handle sort without break signature method
			};

			this.cancelAutoUpdate = function() {
				streamService.stopQueryPolling();
				itemService.stopQueryPolling();
			};

			$scope.$watchGroup(['filters.status','filters.memberId','filters.orderType'],function(){
				streamService.stopQueryPolling();
				itemService.stopQueryPolling();
				$scope.items = [];
				streamService.startQueryPolling($stateParams.orgId, function(data) { $scope.streams = data; }, this.onLoadingError, 605000);
				itemService.startQueryPolling($stateParams.orgId, $scope.filters, function(data) { $scope.items = data; }, this.onLoadingError, 10000);
			});

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

			this.checkImIn = function(item){
				return itemService.isIn(item,$scope.identity.getId());
			};

			this.loadItems = function() {
				$scope.filters.limit = 10;
				itemService.query($stateParams.orgId, $scope.filters, function(data) { $scope.items = data; }, this.onLoadingError);
			};

			$scope.printVote = function(item){
				return voteExtractor($scope.currentUserId,item);
			};

			$scope.isLoadingMore = false;
			this.loadMore = function() {
				$scope.isLoadingMore = true;
				$scope.filters.limit = $scope.items.count + 10;
				var that = this;
				itemService.query($stateParams.orgId, $scope.filters,
						function(data) {
							$scope.isLoadingMore = false;
							$scope.items = data;
						},
						function(response) {
							$scope.isLoadingMore = false;
							that.onLoadingError(response);
				});
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
					controllerAs: 'dialogCtrl',
					templateUrl: "app/collaboration/partials/new-stream.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						orgId: $stateParams.orgId
					}
				}).then(this.addStream);
			};

			this.openNewItem = function(ev, decision) {
				$mdDialog.show({
					controller: NewItemController,
					controllerAs: 'dialogCtrl',
					templateUrl: "app/collaboration/partials/new-item.html",
					targetEvent: ev,
					clickOutsideToClose: true,
					locals: {
						orgId: $stateParams.orgId,
						streams: $scope.streams,
						decisionMode: decision
					}
				}).then(this.onItemAdded);
			};

			this.onItemAdded = function(newItem){
				$mdDialog.show({
					controller: "OnItemAddedDialogController",
					templateUrl: "app/collaboration/partials/on-item-added-dialog.html",
					clickOutsideToClose: true,
					locals: {
						item: newItem
					}
				}).then(function(){
					$state.go('org.item',{
						orgId: newItem.organization.id,
						itemId: newItem.id
					});
				});
			};

			this.openEstimateItem = function(ev, item) {
				$mdDialog.show({
					controller: EstimateItemController,
					controllerAs: 'dialogCtrl',
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
					controllerAs: 'dialogCtrl',
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
				$mdToast.show(
					$mdToast.simple()
						.textContent('New stream "' + stream.subject + '" added')
						.position('bottom left')
						.hideDelay(3000)
				);
			};

			this.addItem = function(item) {
				$scope.items._embedded['ora:task'].unshift(item);
			};

			this.updateItem = function(item) {
				var items = $scope.items._embedded['ora:task'];
				for(var i = 0; i < items.length; i++) {
					if(items[i].id == item.id) {
						items[i] = item;
						break;
					}
				}
			};
			this.joinItem = function(item) {
				itemService.joinItem(item, this.updateItem, $log.warn);
			};
			this.unjoinItem = function(item) {
				itemService.unjoinItem(item, this.updateItem, $log.warn);
			};
			this.isNewEntitiesAllowed = function(organization) {
				return itemService.isAllowed('createItem', organization) ||
								streamService.isAllowed('createStream', organization);
			};
			this.hasActions = function(item) {
				return this.isAllowed('joinItem', item) ||
						this.isAllowed('estimateItem', item) ||
						this.isAllowed('assignShares', item)|| this.isAllowed('approveIdea', item);
			};

			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						this.cancelAutoUpdate();
						break;
				}
			};
			this.invertUpdateTime = function() {
				$scope.changeUpdateTime = !$scope.changeUpdateTime;
				$scope.filters.orderType = ($scope.changeUpdateTime ? "asc" : "desc");
			};
			this.invertStatusTime = function() {
				$scope.changeStatusTime = !$scope.changeStatusTime;
			};

		}]);
