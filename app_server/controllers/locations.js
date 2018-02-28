var request = require('request');

var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production'){
  apiOptions.server = "https://gentle-tundra-23355.herokuapp.com";
  //https://gentle-tundra-23355.herokuapp.com
  //https://getting-mean-loc8r.herokuapp.com
}

var _showError = function (req,res,status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone a little bit wrong";
  }
  res.status(status);
  res.render('generic-text',{
    title: title,
    content: content
  });
}
/* Home Page*/
var renderHomepage = function (req, res) {
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you',
      sidebar: 'Looking for wifi and a sea? Loc8r helps you find places to work when out and about.'
    }
  });
}

/* Get 'home' page */
module.exports.homelist=function (req,res) {
  renderHomepage(req,res);
};



var renderDetailPage = function (req, res, locDetail) {
  googleApiUrl = 'http://maps.googleapis.com/maps/api/staticmap?center='+locDetail.coords.lat+','+locDetail.coords.lng+'&zoom=17&size=400x350&sensor=false&makers='+locDetail.coords.lat+','+locDetail.coords.lng+'&scale=2'

  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: "some info "
    },
    location: locDetail,
    googleApiImage: googleApiUrl
  });
};
/* Get 'Location Info' page */
module.exports.locationInfo=function (req,res) {
  getLocationInfo(req,res,function (req,res, responseData) {
    renderDetailPage(req,res,responseData);
  });
  //res.render('location-info',{title: 'Location Info' });
};

/* Get 'addReview' page */
var getLocationInfo = function (req,res,callback) {
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
      if (response.statusCode == 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }

    }
  );
};

var renderReviewForm = function (req, res, locDetail) {
  res.render('location-review-form',{
    title: 'Review '+locDetail.name +' on Loc8r',
    pageHeader: {title: 'Review '+locDetail.name},
    error: req.query.err,
    url: req.originalUrl
  });
};

module.exports.addReview=function (req,res) {
  getLocationInfo(req,res, function (req,res,responseData) {
    renderReviewForm(req,res,responseData)
  });
};

module.exports.doAddReview=function (req,res) {
  var path, postData, requestOptions, locationid;
  locationid = req.params.locationid;
  path = "/api/location/" + locationid + "/reviews";
  postData = {
    author : req.body.name,
    rating : parseInt(req.body.ratin, 10),
    reviewText : req.body.review
  };
  requestOptions = {
    url: apiOptions.server + path,
    method: "POST",
    json: postData
  };
  if (!postData.author || !postData.review || !postData.reviewText){
    console.log("here");
    res.redirect("/location/"+locationid+"/review/new?err=val");
  }else {
    request(requestOptions,function (err, respose,body) {
        if (respose.statusCode === 201){
          res.redirect('/location/' + locationid);
        } else if (respose.statusCode === 400 && body.name & body.name === "ValidationError") {
          res.redirect('/location/'+ locationid + "/review/new?err=val");
        } else {
          _showError(req, res, respose.statusCode);
        }
      }
    );
  }
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
