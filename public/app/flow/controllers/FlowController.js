angular.module('app.flow')
	.controller('FlowController', ['$scope', '$log', '$interval', '$stateParams', 'flowService', '$state',
		function ($scope, $log, $interval, $stateParams, flowService, $state) {
			$scope.filters = {
					limit: 10,
					offset: 0
				};
			$scope.cards = [];
			$scope.isLoadingMore = false;
			var that = this;
			this.onLoadingError = function(error) {
				switch (error.status) {
					case 401:
						that.cancelAutoUpdate();
						break;
				}
			};
			flowService.startQueryPolling($scope.filters, function(data) { $scope.cards = data; }, this.onLoadingError, 10000);
			this.cancelAutoUpdate = function() {
				flowService.stopQueryPolling();
			};			
			$scope.$on("$destroy", function(){
				that.cancelAutoUpdate();
			});
			this.loadMore = function() {
				$scope.isLoadingMore = true;
				$scope.filters.limit = $scope.items.count + 10;
				var that = this;
				flowService.query($scope.filters,
						function(data) {
							$scope.isLoadingMore = false;
							$scope.cards = data;
						},
						function(response) {
							$scope.isLoadingMore = false;
							that.onLoadingError(response);
				});
			};
			this.route = function(card, hierarchy){
				switch (card.type){
					case "VoteIdea":
						if(hierarchy == 'primary'){
							$state.go('org.item', { orgId: card.content.actions[hierarchy].orgId, itemId: card.content.actions[hierarchy].itemId});	
						}
						break;
				}
			};
		}]);