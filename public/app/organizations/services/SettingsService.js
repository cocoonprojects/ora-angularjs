var service = function($http,identity) {
    return {
        get:function(orgId){
            return $http({
    			method:'GET',
    			url:'api/' + orgId + '/settings',
    			headers: { 'GOOGLE-JWT': identity.getToken() }
    		}).then(function(response){
                return response.data.settings;
            });
        },
        set:function(orgId,settings){
            return $http({
    			method:'PUT',
    			url:'api/' + orgId + '/settings',
    			headers: { 'GOOGLE-JWT': identity.getToken() },
    			data:settings
    		});
        }
    };
};

angular.module('app').service('settingsService', ['$http','identity', service]);
