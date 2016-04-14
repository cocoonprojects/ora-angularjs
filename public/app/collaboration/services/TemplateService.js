angular.module('app.collaboration').service('templateService', ['$q',function($q){

    var TEMPLATES = [{
        name:"User story",
        value:"As a <role>, I want <goal/desire> so that <benefit>"
    }];

    return {
        list:function(){
            var deferred = $q.defer();
            deferred.resolve(TEMPLATES);
            return deferred.promise;
        }
    };
}]);
