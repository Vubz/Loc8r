(function () {
  angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);

  loc8rData.$inject = ['$http']
  function loc8rData ($http) {
    var locationByCoords = function (lat,lng) {
      lng=-0.9690884;
      lat=51.455041;
      return $http.get('/api/locations?lng='+ lng +'&lat='+ lat +'&maxDistance=20');
    };

    var locationById = function (locationid) {
      return $http.get('/api/locations/' + locationid);
    };

    return{
      locationByCoords : locationByCoords,
      locationById: locationById
    };
  };
})();
