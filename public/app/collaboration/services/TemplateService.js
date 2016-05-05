angular.module('app.collaboration').service('templateService', ['$q',function($q){

    var TEMPLATES = [{
        name: "User story",
        value: "As a <role>, I want <goal/desire> so that <benefit>"
    },{
        name: "Ordinary Activity",
        value: "This activity should be done because:\n[insert reasons of this work item]\n\nThe expected outcome / deliverables will be:\n[insert list and descriptions of the results that are expected and that will be examined for acceptance]"
    },{
        name: "Improvement",
        value: "This work item will improve:\n[add description of what should be improved by this activity]\n\nIt is needed because:[add reasons why this will be a good improvement, and we need it]\n\nThe expected outcome / deliverables will be:\n[insert list and descriptions of the results that are expected and that will be examined for acceptance]"
    },{
        name: "Very Important",
        value: "This work item is very important because:\n[add reasons for its high importance]\n\nThe expected outcome / deliverables will be:\n[insert list and descriptions of the results that are expected and that will be examined for acceptance]"
    },{
        name: "Problem Solver",
        value: "This item will solve the following problem:\n[add the description of the problem to be solved by this item]\n\nThis problem has been detected by / on:\n[add the name(s) of who detected the problem and when]\n\nThe expected outcome / deliverables will be:\n[insert list and descriptions of the results that are expected and that will be examined for acceptance]"
    }];

    return {
        list:function(){
            var deferred = $q.defer();
            deferred.resolve(TEMPLATES);
            return deferred.promise;
        }
    };
}]);
