exports.start = function () {
  let config = {
    'secrets' : {
      'clientId' : 'HT3MFIAJOSWFXKFGXPHY5X4CKLKEMQB5QX033NNE0M4LWTO0',
      'clientSecret' : 'BYBWH053TYIAOPIVZZU2F3H0UBV1SEFTFCHT4MGVXCK3C21Y',
      'redirectUrl' : 'https://localhost:3000'
    },
    'foursquare' : {
      'version' : '20140806'
    }
  }

  const LOCATION = 'Denver,CO'
  let foursquare = require('node-foursquare')(config)

  function query(query, callback, limit = 5) {
    let params = {
      query: query,
      limit: limit
    }

    searchVenues(params, callback)
  }

  function searchVenues(params, callback) {
    foursquare.Venues.search(null, null, LOCATION, params, null, function(error, data) {
      if (error) {
        console.log('Unable to retrieve venues', error)
        callback(error)
      } else {
        let venues = data.venues
        let list = []

        for (let i = 0; i < venues.length; i++) {
          list.push(venues[i].name)
        }

        callback(null, list)
      }
    })
  }

  return {
    'query' : query
  }
}
