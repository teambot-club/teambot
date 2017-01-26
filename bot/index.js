var _bots = null,
    hasOauthServer = false;

var teambot = function () {
    var Botkit = require('botkit'),
        skillsLoader = require('bot/skills-loader'),
        settingsProvider = require('server/providers/settings-provider'),
        winston = require('winston'),
        _localUsers = [],
        controller = null;
    require('winston-mongodb').MongoDB;

    function start(callback, devSkill) {

        settingsProvider.getByScope('general', function (err, config) {
            var mongoUri = config.mongoUri,
                mongoStorage = require('botkit-storage-mongo')({ mongoUri: mongoUri });

            controller = Botkit.slackbot({
                logger: new winston.Logger({
                    levels: winston.config.syslog.levels,
                    transports: [
                        process.env.NODE_ENV == 'production' ?
                            new (winston.transports.MongoDB)({ "db": mongoUri + "/admin" }) :
                            new (winston.transports.Console)()
                    ]
                }),
                interactive_replies: true,
                debug: false,
                storage: mongoStorage,
                log: config.log.enabled,
                logLevel: config.log.level

            });

            var middleware = require('bot/middleware');

            skillsLoader.installPredefinedSkills(controller, middleware, devSkill, function () {

                settingsProvider.getByScope('slack', function (err, config) {

                    if (!config || !config.clientId || !config.clientSecret || !config.redirectUri) {
                        console.log("Slack app is not configured!");
                        return;
                    }

                    // connect the bot to a stream of messages 
                    if (_bots) {
                        return;
                    }
                    _bots = {};
                    startSlackApp(config.clientId, config.clientSecret, config.redirectUri);

                    if (callback) {
                        callback();
                    }

                    console.log('Yor teambot is started successfully');
                });
            });

        });

    }

    function getController() {
        return controller;
    }

    function log(message) {
        if (controller) {
            controller.log(message);
        }
    }

    function getBots() {
        return _bots;
    }

    function isLocalUser(userId) {
        var _isLocalUser = false;

        for (var idx = 0; idx < _localUsers.length; idx++) {
            var user = _localUsers[idx];
            if (userId == user.id) {
                _isLocalUser = true;
                break;
            }
        }

        return _isLocalUser;
    }

    function loadLocalUsers() {
        controller.storage.users.all(function (err, users) {
            if (err) {
                return;
            }
            _localUsers = users;
        });
    }

    function startSlackApp(clientId, clientSecret, redirectUri) {

        loadLocalUsers();

        if (!hasOauthServer) {
            controller.configureSlackApp({
                clientId: clientId,
                clientSecret: clientSecret,
                redirectUri: redirectUri,
                scopes: ['bot']
            });

            controller.setupWebserver(3000, function () {
                controller.createWebhookEndpoints(controller.webserver);
                controller.createOauthEndpoints(controller.webserver, function (err, req, res) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        settingsProvider.getByScope('general', function (err, config) {
                            loadLocalUsers();
                            res.redirect(req.protocol + '://' + req.hostname + ':' + config.server.port + '/#/done');
                        });
                    }
                });
            });

            hasOauthServer = true;
        }

        function trackBot(bot) {
            _bots[bot.config.token] = bot;
            controller.on('interactive_message_callback', function postInteractiveMessage(bot, message) {
                var callbackParts = message.callback_id.split(":");
                var skill = callbackParts[0];
                var buttonsGroup = callbackParts[1];

                try {
                    require(skill);
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. The '" + skill + "' skill is not installed.");
                }

                try {
                    var targetButtonsFunction = require(skill + "/buttons");
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. The '" + skill + "' skill does not support button clicks handling.");
                }

                try {
                    targetButtonsFunction(buttonsGroup, message, controller, bot);
                } catch (ex) {
                    return bot.reply(message, "Invalid callbackId '" + message.callback_id + "'. An exception occurred during button click handling: '" + ex.message + "'");
                }
            });
        }

        controller.on('create_bot', function (bot, config) {

            if (_bots && _bots[bot.config.token]) {
                // already online! do nothing.
            } else {
                bot.startRTM(function (err) {
                    if (!err) {
                        trackBot(bot);
                    }

                    bot.startPrivateConversation({ user: config.createdBy }, function (err, convo) {
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

        controller.storage.teams.all(function (err, teams) {
            if (err) {
                throw new Error(err);
            }

            // connect all teams with bots up to slack!
            for (var t in teams) {
                if (teams[t].bot) {
                    controller.spawn(teams[t]).startRTM(function (err, bot) {
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
        if (_bots) {
            for (var property in _bots) {
                if (_bots.hasOwnProperty(property)) {
                    _bots[property].closeRTM();
                }
            }
            _bots = null;
        }
        start(callback);
    }

    return {
        start: start,
        restart: restart,
        getController: getController,
        getBots: getBots,
        isLocalUser: isLocalUser,
        log: log
    };

} ();

module.exports = teambot;