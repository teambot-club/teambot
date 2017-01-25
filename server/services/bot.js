var bot = require('bot'),
    settingsProvider = require('server/providers/settings-provider');


exports.start = function(req, res) {

    try {

        if (req.body.clientId && req.body.clientSecret && req.body.redirectUri) {

            settingsProvider.addSettings('slack', { "clientId": req.body.clientId, "clientSecret": req.body.clientSecret, "redirectUri": req.body.redirectUri },
                function() {
                    bot.start(function() {
                        res.status(200).send('OK');
                    });
                });

        } else {
            settingsProvider.getByScope('slack', function(err, settings) {

                if (err) {
                    res.status(500).send(err);
                    return;
                }

                if (settings && settings.clientId && settings.clientSecret && settings.redirectUri) {

                    bot.start(function() {
                        res.status(200).send('OK');
                    });

                } else {
                    res.status(400).send('clientId, clientSecret and redirectUri are not provided');
                }
            });
        }

    } catch (err) {
        res.status(500).send('Ooops! We broke something! Try again in a minute!' + err);
    }
};

exports.restart = function(req, res) {

    try {

        bot.restart();
        res.status(200).send('OK');

    } catch (err) {
        res.status(500).send('Ooops! We broke something! Try again in a minute!');
    }
};