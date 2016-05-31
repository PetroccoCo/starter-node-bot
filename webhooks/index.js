var logger = require('morgan');

exports.start = function (controller, PORT) {
	var webhooks = {};
	controller.setupWebserver(PORT, function (err, webserver) {
		if (err) {
			console.error(err)
			process.exit(1)
		}

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
				bot.replyPrivate(message, 'boopbeep')
			break
			default:
				bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
		}
	})
	return webhooks
}

