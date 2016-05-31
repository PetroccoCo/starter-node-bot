var logger = require('morgan');
var PORT = process.env.PORT || 8080
var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN

function setupWebhooks(controller, lunchSpots) {
  controller.on('slash_command', function (bot, message) {
    // Validate Slack verify token
    if (message.token !== VERIFY_TOKEN) {
      return bot.res.send(401, 'Unauthorized')
    }

    switch (message.command) {
      case '/lunch':
        return bot.replyPrivate(message, 'boopbeep: '+lunchSpots.getLunchSpot())
      case '/lunch list':
        return bot.replyPrivate(message, 'Here are the current options:'+lunchSpots.getLunchSpots())
      case '/lunch add':
        return bot.replyPrivate(message, 'Here are the current options:'+lunchSpots.getLunchSpots())
      default:
        return bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
    }
    return bot.res.send(400, 'Invalid message type')
  })
}

exports.start = function (controller, lunchSpots) {
  controller.setupWebserver(PORT, function (err, webserver) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    webserver.get('/',function(req,res) {
      var html = '<h1>It works!</h1>';
      res.send(html);
    });

    webserver.use(logger('tiny'))
    // Setup our slash command webhook endpoints
    controller.createWebhookEndpoints(webserver)
    setupWebhooks(controller, lunchSpots);
  })
}
