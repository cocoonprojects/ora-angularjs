var Service = function(
	$http,
	$q,
	identity) {

	var lanes = {};

	var readBoards = function(projects){

		var boards = _.map(projects,function (p) {
			return p.boards;
		});

		boards = _.flatten(boards,true);

		return boards;
	};

	var findSelectedBoard = function(boards){
		var board = _.find(boards,function(b){
			return !!b.streamId;
		});

		return board;
	};

	return {
		getLanes: function (organizationId) {
			var deferred = $q.defer();

			if (lanes[organizationId]) {
				deferred.resolve(lanes[organizationId]);
			} else {
				return $http({
					url: "api/" + organizationId + "/kanbanize/settings",
					method: 'GET',
					headers: {'GOOGLE-JWT': identity.getToken()}
				}).then(function (response) {
					var data = response.data;
					var board = findSelectedBoard(readBoards(data.projects));
					lanes[organizationId] = (board && board.lanes) || [];
					return lanes[organizationId];
				});
			}

			return deferred.promise;
		}
	};
};

angular.module('app.organizations')
	.service('kanbanizeLaneService', [
		"$http",
		'$q',
		'identity',
		Service]);