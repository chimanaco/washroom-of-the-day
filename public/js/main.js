var app = angular.module('app', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'angular-datepicker']);
  // var app = angular.module('app', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'angular-datepicker', 'ngDropdowns']);

app.config(function($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'list.html', controller: 'ListCtrl'
    }).when('/users/:_id', {
        templateUrl: 'edit.html', controller: 'EditCtrl'
    }).when('/visualizer', {
        templateUrl: 'visualizer.html', controller: 'visualizerCtrl'
    }).otherwise({
        redirectTo: '/users'
    });
});

    app.factory('User', function($resource) {
        return $resource('/api/users/:_id', {_id: '@_id'});
    });

    app.controller('ListCtrl', function($scope, $route, User) {
        $scope.users = User.query();
        $scope.delete = function(_id) {
            User.delete({_id: _id}, function() {
                $route.reload();
            });
        };
    });

    app.controller('EditCtrl', function($scope, $routeParams, $location, User) {
        if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
        $scope.edit = function() {
            User.save($scope.user, function() {
                $location.url('/');
            });
        };

        // somewhere in your controller
        $scope.options = {
            format: 'yyyy-mm-dd', // ISO formatted date
            onClose: function(e) {
                console.log("close");
                // do something when the picker closes   
            }
        }
  });

  app.controller('visualizerCtrl', function($scope, $route, $interval, $log, User) {
    $scope.users = User.query();
    $scope.counter = 0;

    /*
    $interval(function() {
        // var num = Math.ceil(Math.random() * 20);
        // var num = scope.counter;
        
        var coords = $scope.users[$scope.counter].coords;
        // console.log($scope.counter + "/" + $scope.users.length);
        // console.log($scope.users[$scope.counter].place);

        $scope.map = { center: { latitude: coords.latitude, longitude: coords.longitude }, zoom: 17 };
        
        // add
        $scope.counter++;
        
        // reset
        if($scope.counter > $scope.users.length - 1) {
            $scope.counter = 0;
        }

        // for (var i in myArray) {
        //     // do domething
        // }
    }, 1000);
    */

    // Tokyo
    // $scope.map = { center: { latitude: 35.689487, longitude: 139.691706 }, zoom: 9 };

    $scope.map = {
        center: {   // Vancouver
            latitude: 53.116470,
            longitude: 8.703370
        },
        zoom: 10,
        // zoom: 2,
        events: {
            tilesloaded: function (map) {
                $scope.$apply(function () {
                    // $log.info('this is the map instance', map);
                    $scope.layerInit(map);
                });
            }
        }
    };

    $scope.selectChange = function(obj) {
    // $scope.selectChange = function(selected) {
        console.log(JSON.stringify(obj));
        
        $scope.map = { center: { latitude: obj.latitude, longitude: obj.longitude }, zoom: 15 };
    };

    $scope.layerInit = function(mapInstance) {
        $log.info('this is the map instance', mapInstance);
        new ThreejsLayer({ map: mapInstance }, function(layer){

            var light = new THREE.DirectionalLight( 0xffffff );
            // light.position.set( 0, 1, 1 ).normalize();
            light.position.set( 0, 0, -30 );
            layer.scene.add(light);

            // layer.camera.position.z = 10000;
            // layer.camera.position.x = 2000;

            var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            var material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('img/tumblr_nhz0hlEe4T1sbyixzo1_1280.jpg') });
            var mesh = new THREE.Mesh( geometry, material );

            console.log("webGL");
            // var location = new google.maps.LatLng(49.282729, -123.120738);
            var location = new google.maps.LatLng(53.116470, 8.703370);
            var vertex = layer.fromLatLngToVertex(location);
            mesh.position.set(vertex.x, vertex.y, 0);

            mesh.scale.set(0.1,0.1,0.1); 
            layer.scene.add( mesh );

            // gui = new dat.GUI();

            draw();

          // function update(){
          //   if (layer.renderertype=='Canvas' || !Detector.webgl)  material.map = new THREE.Texture(generateSprite(material.size));
          //   layer.render();
          //   draw();
          // }

          /* ------------------------------------
                draw
            ------------------------------------*/

            function draw() {
                mesh.rotation.x += 0.01;
                
                // rendering & updating
                requestAnimationFrame( draw );
                layer.renderer.render( layer.scene, layer.camera );
                // stats.update();
            }

          // gui.add(material, 'size', 2, 100).onChange(update);
          // gui.add(material, 'opacity', 0.1, 1).onChange(update);

        });
    }
  });