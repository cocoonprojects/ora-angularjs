angular.module('app.collaboration')
.filter('logActivityFilter', [function() {
	return function(historyElement) {
        var date = moment(historyElement.on,"DD/MM/YYYY HH:mm:SS").format('DD/MM/YYYY');
        return date + " - " + historyElement.name;
	};
}]);
