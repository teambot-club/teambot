var hasOauthServer = false,
    express = require('express'),
    botContext = require('bot/bot-context'),
    hookService = require('server/services/hook'),
    bodyParser = require('body-parser'),
    _devSkill;

var teambot = function() {
    var Botkit = require('botkit'),
        skillsLoader = require('bot/skills-loader'),
        settingsProvider = require('server/providers/settings-provider'),
        winston = require('winston');

    require('winston-mongodb').MongoDB;

    function log(message) {
        if (botContext.controller) {
            botContext.controller.log(message);
        }
    }

    function start(callback, devSkill) {
        _devSkill = devSkill;

        process.on('uncaughtException', function(err) {
            console.error(err, 'Uncaught Exception thrown');
            restart();
        });

        settingsProvider.getByScope('general', function(err, config) {
            var mongoUri = config.mongoUri,
                mongoStorage = require('botkit-storage-mongo')({ mongoUri: mongoUri });

            botContext.controller = Botkit.slackbot({
                logger: new winston.Logger({
                    levels: winston.config.syslog.levels,
                    transports: [
                        process.env.NODE_ENV == 'production' ?
                        new(winston.transports.MongoDB)({ 'db': mongoUri + '/admin' }) :
                        new(winston.transports.Console)()
                    ]
                }),
                interactive_replies: true,
                debug: false,
                storage: mongoStorage,
                log: config.log.enabled,
                logLevel: config.log.level

            });

            var middleware = require('bot/middleware');

            skillsLoader.installPredefinedSkills(botContext.controller, middleware, devSkill, function() {

                settingsProvider.getByScope('slack', function(err, config) {

                    if (!config || !config.clientId || !config.clientSecret || !config.redirectUri) {
                        console.log('Slack app is not configured!');
                        return;
                    }

                    // connect the bot to a stream of messages 
                    if (botContext.bot) {
                        return;
                    }

                    startSlackApp(config.clientId, config.clientSecret, config.redirectUri);

                    if (callback) {
                        callback();
                    }

                    console.log('Yor teambot is started successfully');
                });
            });

        });

    }

    function loadLocalUsers() {
        botContext.controller.storage.users.all(function(err, users) {
            if (err) {
                return;
            }
            botContext.localUsers = users;
        });
    }

    function startSlackApp(clientId, clientSecret, redirectUri) {

        loadLocalUsers();

        if (!hasOauthServer) {
            botContext.controller.configureSlackApp({
                clientId: clientId,
                clientSecret: clientSecret,
                redirectUri: redirectUri,
                scopes: ['bot']
            });

            botContext.controller.setupWebserver(3000, function() {
                botContext.controller.createOauthEndpoints(botContext.controller.webserver, function(err, req, res) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        settingsProvider.getByScope('general', function(err, config) {
                            loadLocalUsers();
                            res.redirect(req.protocol + '://' + req.hostname + ':' + config.server.port + '/#/done');
                        });
                    }
                });
            });

            hasOauthServer = true;

            var hooksServer = express();
            hooksServer.use(bodyParser.json());

            // slack hooks
            botContext.controller.createWebhookEndpoints(hooksServer);
            // external hooks
            hooksServer.post('/hooks/:skill', hookService.postHook);

            hooksServer.listen(8889, function() {
                console.log('Hooks Server started on port 8889.');
            });
        }

        function trackBot(bot) {
            botContext.bot = bot;
            botContext.controller.on('interactive_message_callback', function postInteractiveMessage(bot, message) {
                var callbackParts = message.callback_id.split(':');
                var skill = callbackParts[0];
                if (callbackParts.length > 1) {
                    var buttonsGroup = callbackParts[1];
                }

                try {
                    require(skill);
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. The '" + skill + "' skill is not installed.");
                }

                try {
                    var targetButtonsFunction = require(skill + '/buttons');
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. The '" + skill + "' skill does not support button clicks handling.");
                }

                try {
                    targetButtonsFunction(buttonsGroup, message, botContext.controller, bot);
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. An exception occurred during button click handling: '" + ex.message + "'");
                }
            });
        }

        botContext.controller.on('create_bot', function(bot, config) {

            if (botContext.bot) {
                // already online! do nothing.
            } else {
                bot.startRTM(function(err) {
                    if (!err) {
                        trackBot(bot);
                    }

                    bot.startPrivateConversation({ user: config.createdBy }, function(err, convo) {
                        if (err) {
                            log(err);
                        } else {
                            convo.say('I am a bot that has just joined your team');
                            convo.say('You must now /invite me to a channel so that I can be of use!');
                        }
                    });
                });
            }
        });

        botContext.controller.storage.teams.all(function(err, teams) {
            if (err) {
                throw new Error(err);
            }

            // connect all teams with bots up to slack!
            for (var t in teams) {
                if (teams[t].bot) {
                    botContext.controller.spawn(teams[t]).startRTM(function(err, bot) {
                        if (err) {
                            log('Error connecting bot to Slack:', err);
                        } else {
                            trackBot(bot);
                        }
                    });
                }
            }
        });
    }

    function restart(callback) {
        if (botContext.bot) {
            botContext.bot.closeRTM();
            botContext.bot = null;
            botContext.controller = null;
            botContext.localUsers = null;
        }

        start(callback, _devSkill);
    }

    return {
        start: start,
        restart: restart
    };

}();

module.exports = teambot;