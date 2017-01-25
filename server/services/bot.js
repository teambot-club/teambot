var bot = require('bot'),
    githubUrlParser = require('parse-github-url'),
    githubUrl = "https://github.com",
    settingsProvider = require('server/providers/settings-provider');


exports.start = function (req, res) {

    try {

        if (req.body.clientId && req.body.clientSecret && req.body.redirectUri) {

            settingsProvider.addSettings('slack', { 'clientId': req.body.clientId, 'clientSecret': req.body.clientSecret, 'redirectUri': req.body.redirectUri },
                function() {
                    console.log(bot);
                    bot.restart(function() {
                        res.status(200).send('OK');
                    });
                });

        } else {
            settingsProvider.getByScope('slack', function (err, settings) {

                if (err) {
                    res.status(500).send(err);
                    return;
                }

                if (settings && settings.clientId && settings.clientSecret && settings.redirectUri) {

                    bot.restart(function() {
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
;
exports.restart = function (req, res) {

    try {

        bot.restart();
        res.status(200).send('OK');

    } catch (err) {
        res.status(500).send('Ooops! We broke something! Try again in a minute!');
    }
};

exports.installSkill = function (req, res) {
    try {
        var skillName = formatSkillName(req.body.skillName);
        if (skillName) {
            bot.installSkill([skillName], function (err) {
                if (err) {
                    res.status(400).send(err);
                }
                res.status(200).send('OK');
            });
        } else {
            res.status(400).send('Invalid skill provided');
        }

    } catch (err) {
        res.status(500).send('Ooops! We broke something! Try again in a minute!' + err);
    }
};

function formatSkillName(skillName) {
    var formatedSkillName,
        emptyString = '';
        
    if (skillName && isUrl(skillName) && skillName.startsWith(githubUrl)) {
        var urlParts = githubUrlParser(skillName);
        var githubRepoName = urlParts.name ? urlParts.name.replace('.', emptyString) : emptyString;
        formatedSkillName = githubRepoName ? githubRepoName + '@' + skillName : emptyString;
    }
    
    return formatedSkillName || skillName;
}


function isUrl(value) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(value);
}