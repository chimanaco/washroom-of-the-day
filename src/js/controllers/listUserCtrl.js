'use strict';

angular.module('app.listUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/users2', {
        templateUrl: 'listUser.html',
        controller: 'ListUserCtrl'
    });
}])

.controller('ListUserCtrl', function($scope, $route, User) {
    $scope.users = User.query(); 

    $scope.delete = function(_id) {
        User.delete({_id: _id}, function() {
            $route.reload();
        });
    };
});