var config = {
  'secrets' : {
    'clientId' : 'HT3MFIAJOSWFXKFGXPHY5X4CKLKEMQB5QX033NNE0M4LWTO0',
    'clientSecret' : 'BYBWH053TYIAOPIVZZU2F3H0UBV1SEFTFCHT4MGVXCK3C21Y',
    'redirectUrl' : 'https://localhost:3000'
  },
  'foursquare' : {
    'version' : '20140806'
  }
}

var LOCATION = {
  name: 'Denver,CO',
  lattitude: '39.753298',
  longitude: '-105.003394'
}

var RADIUS = 1000
//var FOOD_CATEGORY = '4d4b7105d754a06374d81259'
var RESTAURANT_CATEGORY = '4d4b7105d754a06374d81259'

var foursquare = require('node-foursquare')(config)

function searchRestaurants(params, callback) {
  console.log("searchRestaurants(params, callback) {");
  params.categoryId = RESTAURANT_CATEGORY

  foursquare.Venues.search(LOCATION.lattitude, LOCATION.longitude, null, params, null, function(error, data) {
    console.log("(error, data) {");
    if (error) {
      console.log('Unable to retrieve venues', error)
      callback(error)
    } else {
      var venues = data.venues
      var list = []

      for (var i = 0; i < venues.length; i++) {
        list.push({
          name: venues[i].name
        })
      }

      callback(null, list)
    }
  })
}

exports.query = function(query, callback, limit = 5) {
  console.log("(query, callback, limit = 5) {");
  var params = {
    query: query,
    limit: limit,
    radius: RADIUS
  }

  searchRestaurants(params, callback)
}

exports.list = function(callback) {
  console.log("(callback) {");
  var params = {
    limit: 50,
    radius: RADIUS
  }

  searchRestaurants(params, callback)
}

