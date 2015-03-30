'use strict';

angular.module('app.edit', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/users/:_id', {
        templateUrl: 'edit.html',
        controller: 'EditCtrl'
    });
}])

.controller('EditCtrl', function($scope, $routeParams, $location, User, Country, Contributor) {
    if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
    $scope.edit = function() {
        User.save($scope.user, function() {
            $location.url('/');
        });
    };

    $scope.countries = Country.query();
    $scope.contributors = Contributor.query();
    
    // $scope.today = function() {
    //     $scope.user.date = new Date();
    //   };
    //   $scope.today();

    $scope.clear = function () {
        $scope.user.date = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        // $scope.minDate = $scope.minDate ? null : new Date();
        $scope.minDate = $scope.minDate ? null : 60;
        // $scope.minDate = 60;
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
          // $scope.user.date = $scope.user.date;

});