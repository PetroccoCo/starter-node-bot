var Botkit = require('botkit')
var lunchSpots = require('./lunchlist')
var groupLunch = require('./groupLunch')

var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }
    console.log('Connected to Slack RTM')
  })
  // Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('Starting in Beep Boop multi-team mode')
  require('beepboop-botkit').start(controller, { debug: true })
}

var webhooks = require('./webhooks').start(controller, lunchSpots);

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I'm here!")
})

controller.hears(['hello', 'hi'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Hello.')
  bot.reply(message, 'It\'s nice to talk to you directly.')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'I will respond to the following messages: \n' +
    '`bot hi` for a simple message.\n' +
    '`bot attachment` to see a Slack attachment message.\n' +
    '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
    '`bot help` to see this again.'
  bot.reply(message, help)
})

controller.hears('lunch', ['direct_message', 'direct_mention', 'ambient'], function (bot, message) {
  // TODO store an array of spots we have prompted the user for
  var triedSpots = []
  var currentSpot =  lunchSpots.getRandLunchSpot(triedSpots)

  var askSpot = function(response, convo){
    convo.ask("Let's eat at " + currentSpot.name + "!",[
    {
      pattern: bot.utterances.yes,
      callback: function(response,convo) {
        convo.say('Great! Open table integrations are coming later.');
        convo.next();
      }
    },
    {
      pattern: bot.utterances.no,
      callback: function(response,convo) {
        convo.say("Hmm ok");
        triedSpots.unshift(currentSpot.id)
        currentSpot = lunchSpots.getRandLunchSpot(triedSpots)
        askSpot(response, convo);
        convo.next();
      }
    },
    {
      pattern: /.*(where|address).*/,
      callback: function(response, convo) {
        convo.say("Here is the address for "+currentSpot.name+":");
        convo.say(currentSpot.location.address);
        convo.say("the cross street is: " + currentSpot.location.crossStreet);
        convo.repeat();
        convo.next();
      }
    },
    {
      default: true,
      callback: function(response,convo) {
        convo.say("I didn't understand that...");
        askSpot(response, convo);
        convo.next();
      }
    }
  ]);
  };
  bot.startConversation(message, askSpot);
});

// ToDo
controller.hears(['gltodo'], 'direct_message', function(bot,message) {
  groupLunch.todo(bot,message);
});

// Start Group Lunch
controller.hears(['glstart'], 'direct_message', function(bot,message) {
// start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {
    groupLunch.askPlace(message, convo, controller);
  })
});

// Check Available potentials
controller.hears(['gllist'], 'direct_message', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    groupLunch.listGroup(message, convo, false, controller);
  })
});

// Check Available potentials
controller.hears(['gljoin'], 'direct_message', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    groupLunch.listGroup(message, convo, true, controller);
  })
});

// Check Available potentials
controller.hears(['glcancel'], 'direct_message', function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    groupLunch.cancelGroup(message, convo);
  })
});

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})


