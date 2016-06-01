var _ = require('lodash')
var fs = require('../foursquare')

var lunchSpots = []

exports.addLunchSpot = function(name) {
  // TODO we will probably add more metadata here
  // id is going to be required
  lunchSpots.unshift({'name': name});
  console.log("Added ", name, "to the list", lunchSpots);
}

exports.removeLunchSpot = function(name) {
  lunchSpots = _.remove(lunchSpots, function(el) {
    return el.name === name;
  });
}

exports.getAllLunchSpotNames = function() {
  console.log("list", lunchSpots);
  if (lunchSpots.length == 0){
    return "No places to lunch found!";
  }
  var retString = "";
  for (var i = 1, len = lunchSpots.length; i < len; i++) {
    retString += ' ' + lunchSpots[(i-1)].name + ','
  }
  retString += ' ' + lunchSpots[lunchSpots.length - 1].name;
  return retString;
}

exports.getRandLunchSpot = function(ignoredIndexes) {
  ignoredIndexes = _.castArray(ignoredIndexes);
  var randIndex;
  do {
    randIndex = Math.floor(Math.random() * lunchSpots.length);
    console.log("Got index", randIndex, lunchSpots[randIndex]);
  } while ( _.includes(ignoredIndexes, lunchSpots[randIndex].id))
  return lunchSpots[randIndex];
}

function populateLunchSpots() {
  fs.list(function(error, results) {
    if (error) {
      lunchSpots.unshift(
        {name: "PotBelly", id: "53f3ec79498ed6c7c6838e6b"},
        {name: "Ink", id: "53722e75498e7c622a939060"},
        {name: "Noodles", id: "4a4a971cf964a520fbab1fe3"},
        {name: "Blue Sushi", id: "4ff5efa9e4b0b8fda9879327"},
        {name: "Masterpiece", id: "49f33f57f964a520776a1fe3"},
        {name: "Smashburger", id: "4c97eb59e34e6dcbe95f675a"},
        {name: "Chipotle", id: "4b991011f964a520e15e35e3"},
        {name: "Illegal Pete's", id: "42869100f964a52016231fe3"}
      );
    } else {
      console.log('Retrieved ' + results.length + ' restaurants from foursquare')
      lunchSpots = results
    }
  })
}
populateLunchSpots();
