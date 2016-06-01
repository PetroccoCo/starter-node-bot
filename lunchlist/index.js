var _ = require('lodash')
var fs = require('../foursquare')

var lunchSpots = []

exports.addLunchSpot = function(name) {
  // TODO we will probably add more metadata here
  lunchSpots.unshift({'name': name});
  console.log("Added ", name, "to the list", lunchSpots);
}

exports.removeLunchSpot = function(name) {
  lunchSpots = _.remove(lunchSpots, function(el) {
    return el.name === name;
  });
}

exports.getLunchSpots = function() {
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

exports.getLunchSpot = function(ignoredIndexes) {
  ignoredIndexes = _.castArray(ignoredIndexes);
  var randIndex;
  do {
    randIndex = Math.floor(Math.random() * lunchSpots.length);
    console.log("Got index", randIndex, lunchSpots[randIndex]);
  } while ( _.includes(ignoredIndexes, randIndex))
  return lunchSpots[randIndex].name;
}

function populateLunchSpots() {
  //fs.list(function(error, results) {
  //  if (error) {
      lunchSpots.unshift(
        {name: "PotBelly"},
        {name: "Ink"},
        {name: "Noodles"},
        {name: "Blue Sushi"},
        {name: "Masterpiece"},
        {name: "Smashburger"},
        {name: "Chipotle"},
        {name: "Illegal Pete's"}
      );
  /*  } else {
      console.log('Retrieved ' + results.length + ' restaurants from foursquare')
      lunchSpots.unshift(results)
      }
  })*/
}
populateLunchSpots();
