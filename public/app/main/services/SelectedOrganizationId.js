var SelectedOrganizationId = function($window) {
    return {
        get:function(){
            var data = $window.localStorage.getItem('SELECTED_ORGANIZATION');
            return data ? JSON.parse(data) : null;
        },
        set:function(id){
            $window.localStorage.setItem('SELECTED_ORGANIZATION',JSON.stringify(id));
        },
        clear:function(){
            $window.localStorage.removeItem('SELECTED_ORGANIZATION');
        }
    };
};

angular.module('app').service('SelectedOrganizationId', ['$window', SelectedOrganizationId]);
