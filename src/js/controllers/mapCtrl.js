'use strict';

var centerZoom = 17;

angular.module('app.map', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/map', {
        templateUrl: 'map.html',
        controller: 'mapCtrl'
    });
}])

.controller('mapCtrl', function($scope, $route, $interval, $log, User) {
    $scope.users = User.query();
    $scope.counter = 0;
    $scope.mode = "normal";

    $scope.obj = "";
    $scope.image = "";
    $scope.url = "";
    $scope.place = "";
    $scope.country = "";
    $scope.date = "";
    $scope.story = "";
    $scope.user = "";
    $scope.durataion = 1000;
    $scope.zoom = centerZoom;

    var intervalPromise;    // interval

    // Tokyo
    // $scope.map = { center: { latitude: 35.689487, longitude: 139.691706 }, zoom: 9 };

    $scope.map = {
        center: {   // Bremen
            latitude: 53.116470,
            longitude: 8.703370
        },
        zoom: 10,
        events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    // $log.info('this is the map instance', map);
                    // $scope.layerInit(map);
                    $scope.changePlace($scope.users[0]);
                });
            }
        }
    };

    // click marker event
    $scope.onClickMarker = function(obj) {           
        if($scope.mode == "loop" || $scope.mode == "random") {
            $interval.cancel(intervalPromise);
            $scope.selectMode("pause");
        }

        $scope.zoom = centerZoom;
        $scope.changePlace(obj);
    };

    // select change
    $scope.changeSelection = function(obj) {
        if($scope.mode == "loop" || $scope.mode == "random") {
            $interval.cancel(intervalPromise);
            $scope.selectMode("pause");
        }

        $scope.changePlace(obj);
                
        // console.log(JSON.stringify(mode) + "mode");
    };

    // change a place
    $scope.changePlace = function(obj) {
        // if street view or not

        $scope.obj = obj;
        $scope.map = { center: { latitude: obj.coords.latitude, longitude: obj.coords.longitude }, zoom: $scope.zoom };
        $scope.image = obj.image;
        $scope.url = obj.url;
        $scope.place = obj.place;
        $scope.country = obj.country;
        $scope.date = obj.date;
        $scope.story = obj.story;
        $scope.user = obj.user;
    };

    // change loop duration
    $scope.changeDuration = function(duration) {
        $scope.durataion = duration;
        $scope.selectMode($scope.mode);
    };

    // change zoom
    $scope.changeZoom = function(zoom) {
        $scope.zoom = zoom;
        $scope.changePlace($scope.obj);
    };

    // select mode
    $scope.selectMode = function(mode) {
        $interval.cancel(intervalPromise);

        var len = $scope.users.length - 1;

        if(mode == "loop") {
            intervalPromise = $interval(function() {
                var coords = $scope.users[$scope.counter].coords;
                // console.log($scope.counter + "/" + $scope.users.length);
                // console.log($scope.users[$scope.counter].place);

                $scope.changePlace($scope.users[$scope.counter]);
                
                // add
                $scope.counter++;
                
                // reset
                if($scope.counter > len) {
                    $scope.counter = 0;
                }
            }, $scope.durataion);
        } else if(mode == "random") {
            intervalPromise = $interval(function() {
                var num = Math.ceil(Math.random() * len);                
                var coords = $scope.users[num].coords;

                $scope.changePlace($scope.users[$scope.counter]);
                
                // set counter
                $scope.counter = num;                
            }, $scope.durataion);
        }

        console.log(JSON.stringify(mode) + "mode");
    };
});