var logger = require('morgan');
var PORT = process.env.PORT || 8080
var VERIFY_TOKEN = process.env.SLACK_VERIFY_TOKEN

exports.start = function (controller) {
	var webhooks = {};
	controller.setupWebserver(PORT, function (err, webserver) {
		if (err) {
			console.error(err)
			process.exit(1)
		}

    exports.webserver = webserver;

    webserver.get('/',function(req,res) {
      var html = '<h1>It works!</h1>';
      res.send(html);
    });


		webserver.use(logger('tiny'))
		// Setup our slash command webhook endpoints
		controller.createWebhookEndpoints(webserver)
	})

	controller.on('slash_command', function (bot, message) {
    console.log("slash-command found for bot:", bot, message);
		// Validate Slack verify token
		if (message.token !== VERIFY_TOKEN) {
			return bot.res.send(401, 'Unauthorized')
		}

		switch (message.command) {
			case '/lunch':
				return bot.replyPrivate(message, 'boopbeep')
			default:
				return bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
		}
    return bot.res.send(400, 'Invalid message type')
	});

  controller.on('create_incoming_webhook',function(bot,webhook_config) {
    console.log("Incoming webhook called");

    bot.sendWebhook({
        text: ':thumbsup: Incoming webhook successfully configured'
      });
  });

	return webhooks
}

