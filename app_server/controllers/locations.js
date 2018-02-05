var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://gentle-tundra-23355.herokuapp.com";
  //https://gentle-tundra-23355.herokuapp.com
  //https://getting-mean-loc8r.herokuapp.com
}

/* Home Page*/
var renderHomepage = function (req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)){
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length){
      message = "No places found nearby";
    }
  }
  res.render('locations-list',{
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!',
      sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee.',
      locations: responseBody
    },
    message: message
  });
}

/* Get 'home' page */
module.exports.homelist=function (req,res) {
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url: apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng: -96.840637,
      lat: 51.462820,
      //lng: 0,
      //lat: 0,
      maxDistance: 25
    }
  };
  request(requestOptions,function (err, response, body) {
    var i, data;
    data = body;
    if (response.statusCode === 200 && data.length){
      for (i = 0; i < data.length; i++) {
        data[i].distance = _formatDistance(data[i].distance);
      }
    }
    renderHomepage(req,res,data);
  });
};

var _formatDistance = function (distance) {
  var numDistance, unit;
  if (!distance){
    message = "";
    return message;
  } else if (isNaN(distance)) {
    message = "";
    return message;
  }
  if (distance > 1) {
    numDistance = parseFloat(distance).toFixed(1);
    unit = 'km';
  } else {
    numDistance = parseInt(distance * 1000, 10);
    unit = 'm';
  }
  return numDistance + unit;
};

var renderDetailPage = function (req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: "some info "
    },
    location: locDetail
  });
};
/* Get 'Location Info' page */
module.exports.locationInfo=function (req,res) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  request(
    requestOptions,
    function (err, response, body) {
      var data = body;

      data.coords = {
        lng: body.coords[0],
        lat: body.coords[1]
      };
      renderDetailPage(req, res, data);
    }
  )
  //res.render('location-info',{title: 'Location Info' });
};

/* Get 'addReview' page */
module.exports.addReview=function (req,res) {
  res.render('location-review-form',{title: 'Add review' });
};


/*
res.render('locations-list',{
  title: 'Loc8r - find a place to work with wifi',
  pageHeader: {
    title: 'Loc8r',
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee.',
    strapline: 'Find places to work with wifi near you!',
    locations: [{
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks','Food','Premium wifi'],
        distance: '100m'
    },{
        name: 'Cafe Hero',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 4,
        facilities: ['Hot drinks','Food','Premium wifi'],
        distance: '150m'
    },{
        name: 'Burger Queen',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 2,
        facilities: ['Hot drinks','Food','Premium wifi'],
        distance: '200m'
    }]
  }
});

*/
