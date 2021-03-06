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
				console.log($scope.credits);
			});

			$scope.askChangeRole = function(ev,newRole) {
				var message = "Are you sure you want to change the role of this user to ";
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
						alert('Generic Error during server communication (error: ' + response.status + ' ' + response.statusText + ') ');
						$log.warn(response);
					});
			    });
			};

			$scope.tasks   = null;
			$scope.stats   = null;
			$scope.filters = {
				memberId: $stateParams.memberId
			};
			$scope.moreDetail = false;
			$scope.initTasks = function() {
				itemService.query($stateParams.orgId, $scope.filters, function(data) {
					$scope.tasks = data._embedded['ora:task'];
					console.log($scope.tasks);
				}, function(response) {
					alert('Generic Error during server communication (error: ' + response.status + ' ' + response.statusText + ') ');
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

			$scope.canChangeTo = function(newRole){
				switch($scope.profile.role) {
				    case 'contributor':
				        return 'member' === newRole;
				    case 'member':
				        return 'contributor' === newRole || 'admin' === newRole;
				    case 'admin':
						return 'member' === newRole;
				}
			};

			$scope.isAllowed = itemService.isAllowed.bind(itemService);

			$scope.initTasks();

			$scope.showMore = function() {
				$scope.moreDetail = !$scope.moreDetail;
			};
		}]);
