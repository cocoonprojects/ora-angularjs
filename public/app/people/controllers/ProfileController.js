angular.module('app.people')
	.controller('ProfileController', [
		'$scope',
		'$log',
		'$stateParams',
		'memberService',
		'itemService',
		'accountService',
		'identity',
		'$mdDialog',
		function(
			$scope,
			$log,
			$stateParams,
			memberService,
			itemService,
			accountService,
			identity,
			$mdDialog) {

			$scope.myProfile = identity.getId() === $stateParams.memberId;

			$scope.profile = memberService.get({ orgId: $stateParams.orgId, memberId: $stateParams.memberId },function(){
				console.log($scope.profile);
			});

			$scope.credits = accountService.userStats({ orgId: $stateParams.orgId, memberId: $stateParams.memberId },function(){
				if($scope.myProfile){
					memberService.canIRequestMembership($stateParams.orgId,$scope.credits.balance).then(function(show){
						$scope.shouldShowAskForMembership = show;
					});
				}else{
					memberService.canProposeMembership($stateParams.orgId,$scope.profile.role,$scope.credits.balance).then(function(show){
						$scope.shouldShowProposeMembership = show;
					});
				}
			});

			$scope.askChangeRole = function(ev) {
				var message = "Are you sure you want to change the role of this user to ";
				var newRole = $scope.profile.role === 'contributor' ? 'member' : 'contributor';
				message += newRole + "?";
			    var confirm = $mdDialog.confirm()
			          .title('Confirm')
			          .textContent(message)
			          .targetEvent(ev)
					  .ok('Ok')
          			  .cancel('Cancel');
			    $mdDialog.show(confirm).then(function(role) {
			     	memberService.changeMembership($stateParams.orgId, $scope.profile.id, newRole,function(data) {
						$scope.profile = memberService.get({ orgId: $stateParams.orgId, memberId: $stateParams.memberId });
					}, function(response) {
						$log.warn(response);
					});
			    });
			};

			$scope.tasks   = null;
			$scope.stats   = null;
			$scope.filters = {
				memberId: $stateParams.memberId,
				limit: 10
			};
			$scope.moreDetail = false;
			$scope.initTasks = function() {
				itemService.query($stateParams.orgId, $scope.filters, function(data) {
					$scope.tasks = data._embedded['ora:task'];
					console.log($scope.tasks);
				}, function(response) {
					$log.warn(response);
				});
				$scope.stats   = itemService.userStats($stateParams.orgId, $scope.filters);
			};

			$scope.isOwned = function(task){
				return !!_.find(_.values(task.members),function(membership){
					return membership.role === 'owner' && $stateParams.memberId === membership.id;
				});
			};

			$scope.loadMore = function() {
				$scope.filters.limit += 10;
				$scope.initTasks();
			};
			
			$scope.isOwner = function(task) {
				return itemService.isOwner(task, $stateParams.memberId);
			};

			$scope.getCredits  = function(task) {
				return task.members[$stateParams.memberId].credits;
			};

			$scope.getShare = function(task) {
				return task.members[$stateParams.memberId].share;
			};

			$scope.getDelta = function(task) {
				return task.members[$stateParams.memberId].delta;
			};

			$scope.isChangeUserAllowed = function(){
				var isAllowed = memberService.isAllowed.bind(memberService);
				return isAllowed('changeRole',{
					orgId:$stateParams.orgId,
					userId:$stateParams.memberId
				});
			};

			$scope.isAllowed = itemService.isAllowed.bind(itemService);

			$scope.initTasks();

			$scope.showMore = function() {
				$scope.moreDetail = !$scope.moreDetail;
			};
		}]);
