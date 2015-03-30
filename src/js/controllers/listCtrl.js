'use strict';

angular.module('app.list', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'list.html',
        controller: 'ListCtrl'
    });
}])

.controller('ListCtrl', function($scope, $route, User) {
    $scope.users = User.query(); 

    $scope.delete = function(_id) {
        User.delete({_id: _id}, function() {
            $route.reload();
        });
    };

    // watch countryBy data
    // $scope.$watch('countries', function(newVal, oldVal) {
    //     // http://angularjsninja.com/blog/2013/12/13/angularjs-watch/
    //     // newVal: numberByCountry.Japan
    //     // check if undefined or not
    //     if (newVal) {
    //         console.log(JSON.stringify($scope.countries) + "COUNTRYCOUNTRYCOUNTRYCOUNTRYCOUNTRY");  
    //     }
    // }, true);
});