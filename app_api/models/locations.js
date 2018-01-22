const mongoose = require('mongoose');

var openingTimesSchema = new mongoose.Schema({
    days:{type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true, 'default': 'anonymous'},
    rating: {type: Number, min:0, max: 5},
    reviewText: String,
    createdOn: {type: Date, 'default': Date.now}
});

var locationsSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, 'default': 0, min:0, max: 5},
  facilities: [String],
  coords: {type: [Number], index: '2dsphere'},
  openingTimes: [openingTimesSchema],
  reviews: [reviewSchema]
});

mongoose.model('Location',locationsSchema);

/*
db.locations.save({
name: 'Starcups',
address: '125 High Street, Reading, RG6 1PS',
rating: 3,
facilities: ['Hot drinks','Food','Premium wifi'],
coords: [-96.90884, 51.455041],
openingTimes: [{
days: 'Monday - Friday',
opening: '7:00am',
closing: '7:00pm',
closed: false
}, {
days: 'Saturday',
opening: '8:00am',
closing: '5:00pm',
closed: false
}, {
days: 'Sunday',
closed: true
}]
})

*/


/*
db.locations.update({
name: 'Starcups'
},
{$push: {
reviews: {
author: 'Rey',
id: ObjectId(),
rating: 5,
timestamp: new Date("Jul 18, 2013"),
reviewText: "It was amazing. Coffee was great, and the wifi was fast."
}
}
})
*/


/*
db.locations.find({name:"Starcups"}).forEach( function(item){
 for(i=0; i!= item.reviews.length; i++){
  print("here")
  item.reviews[i]._id = item.reviews[i].id;
  delete item.reviews[i].id;
 }
 db.locations.update({_id: item._id}, item);
});

*/
