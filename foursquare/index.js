const config = {
  'secrets' : {
    'clientId' : 'HT3MFIAJOSWFXKFGXPHY5X4CKLKEMQB5QX033NNE0M4LWTO0',
    'clientSecret' : 'BYBWH053TYIAOPIVZZU2F3H0UBV1SEFTFCHT4MGVXCK3C21Y',
    'redirectUrl' : 'https://localhost:3000'
  },
  'foursquare' : {
    'version' : '20140806'
  }
}

const LOCATION = {
  name: 'Denver,CO',
  lattitude: '39.753298',
  longitude: '-105.003394'
}

const RADIUS = 1000
//const FOOD_CATEGORY = '4d4b7105d754a06374d81259'
const RESTAURANT_CATEGORY = '4d4b7105d754a06374d81259'

const foursquare = require('node-foursquare')(config)

exports.query = function(query, callback, limit = 5) {
  let params = {
    query: query,
    limit: limit,
    radius: RADIUS
  }

  searchRestaurants(params, callback)
}

exports.list = function(callback) {
  let params = {
    limit: 50,
    radius: RADIUS
  }

  searchRestaurants(params, callback)
}

function searchRestaurants(params, callback) {
  params.categoryId = RESTAURANT_CATEGORY

  foursquare.Venues.search(LOCATION.lattitude, LOCATION.longitude, null, params, null, function(error, data) {
    if (error) {
      console.log('Unable to retrieve venues', error)
      callback(error)
    } else {
      let venues = data.venues
      let list = []

      for (let i = 0; i < venues.length; i++) {
        list.push({
          name: venues[i].name
        })
      }

      callback(null, list)
    }
  })
}
