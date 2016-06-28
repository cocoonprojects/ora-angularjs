var Service = function() {

    var lanes = null;

    return {
        get:function(orgId){
            if(!lanes){
                lanes = JSON.parse(window.localStorage.getItem('LANES') || '{}');
            }
            return lanes[orgId];
        },
        set:function (orgId,orgLanes) {
            if(!lanes){
                lanes = JSON.parse(window.localStorage.getItem('LANES') || '{}');
            }

            lanes[orgId] = {
                lanes:orgLanes,
                lastUpdate: (new Date()).getTime()
            };

            window.localStorage.setItem('LANES',JSON.stringify(lanes));
        }
    };
};

angular.module('app.organizations').service('LanesCache', [Service]);