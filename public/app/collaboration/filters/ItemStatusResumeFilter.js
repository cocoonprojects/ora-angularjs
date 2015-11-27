angular.module('oraApp.collaboration')
	.filter('itemStatusResume', ['TASK_STATUS_LABEL', 'itemService', function(TASK_STATUS_LABEL, itemService) {
		return function(item) {
			if(!item) return null;
			var rv = TASK_STATUS_LABEL.hasOwnProperty(item.status) ? TASK_STATUS_LABEL[item.status] : item.status;
			switch (item.estimation) {
				case null:
					rv += ', Estimation In Progress';
					break;
				case -1:
					rv += ', Estimation Skipped';
					break;
				case undefined:
					break;
				default:
					rv += ', ' + item.estimation + ' Credits';
			}
			if(item.status == itemService.ITEM_STATUS.ONGOING) {
				var n = itemService.countEstimators(item);
				var tot = Object.keys(item.members).length;
				switch (n) {
					case tot:
						rv += " (All members have estimated)";
						break;
					case 0:
						rv += " (None has estimated yet)";
						break;
					default:
						rv += " (" + n + " of " + tot + " members have estimated)";
				}
			}
			return rv;
		};
	}]);