angular.module('app').filter('organizationInitials', function () {
	return function(organization) {
		if(!organization){
            return "";
        }

        var name = organization.name;
        var words = name.split(' ');
        var toReturn;
        if(words.length > 1){
            toReturn = words[0][0] + words[1][0];
        }else{
            toReturn = name.substring(0,2);
        }

        return toReturn.toUpperCase();
	};
});
