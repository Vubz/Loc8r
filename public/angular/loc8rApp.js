angular.module('loc8rApp',[]);

var locationListCtrl = function ($scope, loc8rData, geolocation) {
  $scope.message = "Checking your location";
  $scope.getData=function (position) {
    $scope.message = "Searching for nearby places";
    loc8rData.success(function (data) {
      $scope.message = data.length > 0 ? "" : "No locations found";
      $scope.data= { locations: data};
    }).error(function (e) {
      console.log(e);
      $scope.message = "Sorry, something's gone wrong";
    });
  };
  $scope.showError= function (error) {
    $scope.$apply(function () {
      $scope.message = error.message;
    });
  };

  $scope.noGeo = function () {
    $scope.$appy(function () {
      $scope.message = "Geolocation not supported by this browser.";
    });
  };
  geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

var loc8rData = function ($http) {
  return $http.get('/api/locations?lng=-0.99&lat=51.3&maxDistance=20');
};

var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
  return function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)){
      if (distance > 1) {
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
      } else {
        numDistance = parseInt(distance * 1000,10);
        unit = 'm';
      }
      return numDistance + unit;
    } else {
      return "?";
    }
  };
};

var ratingStarts = function () {
  return {
    scope:{
      thisRating: '=rating'
    },
    templateUrl: '/angular/rating-stars.html'
  };
};

var geolocation = function () {
  var getPosition = function (cbSuccess,cbError, cnNoGeo) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cnNoGeo();
    }
  };
  return {
    getPosition : getPosition
  };
};
angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStarts', ratingStarts)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);
  /*
  locations: [{
    name: 'Burger Queen',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 3,
    facilities: ['Hot Drinks', 'Food', 'Premium wifi'],
    distance: '0.296456',
    _id: '5370a35f2536f6785f8dfb6a'
  },{
    name: 'Costy',
    address: '125 High Street, Reading, RG6 1PS',
    rating: 5,
    facilities: ['Hot Drinks', 'Food', 'Alcoholic drinks'],
    distance: '0.7865456',
    _id: '5370a35f2536f6785f8dfb6a'
  }]
  */
