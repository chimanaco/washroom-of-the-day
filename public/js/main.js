var app = angular.module('app', ['ngResource', 'ngRoute', 'angular.filter', 'uiGmapgoogle-maps', 'angular-datepicker']);
  // var app = angular.module('app', ['ngResource', 'ngRoute', 'uiGmapgoogle-maps', 'angular-datepicker', 'ngDropdowns']);

app.config(function($routeProvider) {
    $routeProvider.when('/users', {
        templateUrl: 'list.html', controller: 'ListCtrl'
    }).when('/users/:_id', {
        templateUrl: 'edit.html', controller: 'EditCtrl'
    }).when('/visualizer', {
        templateUrl: 'visualizer.html', controller: 'visualizerCtrl'
    }).when('/stats', {
        templateUrl: 'stats.html', controller: 'StatsCtrl'
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

app.controller('StatsCtrl', function($scope, $route, User) {
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
                .range([0, 420]);

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
                .range([0, 420]);

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

app.controller('visualizerCtrl', function($scope, $route, $interval, $log, User) {
    $scope.users = User.query();
    $scope.counter = 0;
    $scope.mode = "normal";

    $scope.place = "";
    $scope.country = "";
    $scope.date = "";
    $scope.story = "";
    $scope.user = "";
    $scope.durataion = 1000;

    var intervalPromise;    // interval

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
        console.log(JSON.stringify(obj) + "kita");
        $scope.map = { center: { latitude: obj.coords.latitude, longitude: obj.coords.longitude }, zoom: 15 };
        $scope.place = obj.place;
        $scope.country = obj.country;
        $scope.date = obj.date;
        $scope.story = obj.story;
        $scope.user = obj.user;
    };

    $scope.durationChange = function(duration) {
        console.log(duration);

        $scope.durataion = duration;

        if($scope.mode == "loop") {
            $interval.cancel(intervalPromise);
            $scope.selectMode($scope.mode);
        }
    };

    $scope.selectMode = function(mode) {
        if(mode == "loop") {
            intervalPromise = $interval(function() {
                // var num = Math.ceil(Math.random() * 20);
                // var num = scope.counter;
                
                var coords = $scope.users[$scope.counter].coords;
                // console.log($scope.counter + "/" + $scope.users.length);
                // console.log($scope.users[$scope.counter].place);

                $scope.selectChange($scope.users[$scope.counter]);
                
                // add
                $scope.counter++;
                
                // reset
                if($scope.counter > $scope.users.length - 1) {
                    $scope.counter = 0;
                }

                // for (var i in myArray) {
                //     // do domething
                // }
            }, $scope.durataion);
        } else {
            $interval.cancel(intervalPromise);
        }

        console.log(JSON.stringify(mode) + "mode");
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

app.directive('ngSparkline', function() {
  var url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=imperial&cnt=14&callback=JSON_CALLBACK&q=";
  return {
    restrict: 'A',
    require: '^ngCity',
    transclude: true,
    scope: {
      ngCity: '@'
    },
    template: '<div class="sparkline"><div ng-transclude></div><div class="graph"></div></div>',
    controller: ['$scope', '$http', function($scope, $http) {
      $scope.getTemp = function(city) {
        $http({
          method: 'JSONP',
          url: url + city
        }).success(function(data) {
          var weather = [];
          angular.forEach(data.list, function(value){
            weather.push(value);
          });
          $scope.weather = weather;
        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getTemp(iAttrs.ngCity);
      scope.$watch('weather', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {
          var highs = [];

          angular.forEach(scope.weather, function(value){
            highs.push(value.temp.max);
          });

          console.log(iElement + 'ELELE', highs + 'HIGH', iAttrs + 'ATTR');
          chartGraph(iElement, highs, iAttrs);
        }
      });
    }
  }
});

var chartGraph = function(element, data, opts) {
  var width = opts.width || 200,
      height = opts.height || 80,
      padding = opts.padding || 30;

  // chart
  var svg     = d3.select(element[0])
                  .append('svg:svg')
                  .attr('width', width)
                  .attr('height', height)
                  .attr('class', 'sparkline')
                  .append('g')
                    .attr('transform', 'translate('+padding+', '+padding+')');

  svg.selectAll('*').remove();

  var maxY    = d3.max(data),
      x       = d3.scale.linear()
                  .domain([0, data.length])
                  .range([0, width]),
      y       = d3.scale.linear()
                  .domain([0, maxY])
                  .range([height, 0]),
      yAxis = d3.svg.axis().scale(y)
                    .orient('left')
                    .ticks(5);

  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis);

  var line    = d3.svg.line()
                  .interpolate('linear')
                  .x(function(d,i){return x(i);})
                  .y(function(d,i){return y(d);}),
      path    = svg.append('svg:path')
                    .data([data])
                    .attr('d', line)
                    .attr('fill', 'none')
                    .attr('stroke-width', '1');
}

app.directive('ngCity', function() {
  return {
    controller: function($scope) {}
  }
});
