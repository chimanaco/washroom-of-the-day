'use strict';

angular.module('app.stats', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/stats', {
        templateUrl: 'stats.html',
        controller: 'StatsCtrl'
    });
}])

.controller('StatsCtrl', function($scope, $route, User) {
    $scope.users = User.query();  
    $scope.numberByCountry;
    $scope.numberByCountryObject;
    $scope.numberByCountryObjectOrderBy;

    $scope.userByCount;
    $scope.userByCountObject;
    $scope.userByCountObjectOrderBy;

    // watch countryBy data
    $scope.$watch('numberByCountry.Japan', function(newVal, oldVal) {
        // http://angularjsninja.com/blog/2013/12/13/angularjs-watch/
        // newVal: numberByCountry.Japan
        // check if undefined or not
        if (newVal) {
            var log = [];
            angular.forEach($scope.numberByCountry, function(value, key) {
            // console.log(JSON.stringify($scope.numberByCountry["Japan"]));
            // this.push( 'country:' + key + ', number:' + value);
                var object = { "country": key, "number": value};
                this.push( object );
            }, log);
            $scope.numberByCountryObject = log;    
        }
    });

    // watch orderBy data
    $scope.$watch('numberByCountryObjectOrderBy[0].number', function(newVal, oldVal) {
        // newVal: numberByCountry.Japan
         // check if undefined or not
       if (newVal) { 
            var data = $scope.numberByCountryObjectOrderBy;
            // var data = [4, 8, 15, 16, 23, 42];

            // d3
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.number; })])
                .range([0, 800]);

            d3.select(".chartBar")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function(d) { return x(d.number) + "px"; })
                .text(function(d) { return d.number; })

            var legend = d3.scale.linear()
                // .domain([0, d3.max(data)])
                .domain([0, d3.max(data, function(d) { return d.number; })])
                .range([0, 1420]);

            d3.select(".chartName")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function(d) { return 150 + "px"; })
                .text(function(d) { return d.country; })
        }
    });
    
        // watch countryBy data
    $scope.$watch('userByCount', function(newVal, oldVal) {
        // http://angularjsninja.com/blog/2013/12/13/angularjs-watch/
        // newVal: numberByCountry.Japan
        // check if undefined or not
        if (newVal) {
            var log = [];
            angular.forEach($scope.userByCount, function(value, key) {
            console.log(JSON.stringify($scope.userByCount));
                var object = { "user": key, "number": value};
                this.push( object );
            }, log);
           
            $scope.userByCountObject = log;
             console.log(JSON.stringify($scope.userByCountObject));
        }
    }, true);

    // watch orderBy data
    $scope.$watch('userByCountObjectOrderBy[0].number', function(newVal, oldVal) {
        // newVal: numberByCountry.Japan
         // check if undefined or not
       if (newVal) { 
            var data = $scope.userByCountObjectOrderBy;
            // var data = [4, 8, 15, 16, 23, 42];

            // d3
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.number; })])
                .range([0, 800]);

            d3.select(".chartBar2")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function(d) { return x(d.number) + "px"; })
                .text(function(d) { return d.number; })

            var legend = d3.scale.linear()
                // .domain([0, d3.max(data)])
                .domain([0, d3.max(data, function(d) { return d.number; })])
                .range([0, 1420]);

            d3.select(".chartName2")
                .selectAll("div")
                .data(data)
                .enter().append("div")
                .style("width", function(d) { return 150 + "px"; })
                .text(function(d) { return d.user; })
        }
    });

    var circle = d3.selectAll("circle");
    circle.style("fill", "steelblue");
    circle.attr("r", 30);
    circle.data([32, 57, 112]);
    circle.attr("r", function(d) { return Math.sqrt(d); });
});