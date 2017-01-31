var bot = require('bot'),
    githubUrlParser = require('parse-github-url'),
    githubUrl = 'https://github.com',
    skillsProvider = require('server/providers/skills-provider'),
    settingsProvider = require('server/providers/settings-provider');


exports.start = function (req, res) {

    try {

        if (req.body.clientId && req.body.clientSecret && req.body.redirectUri) {

            settingsProvider.addSettings('slack', { 'clientId': req.body.clientId, 'clientSecret': req.body.clientSecret, 'redirectUri': req.body.redirectUri },
                function () {
                    console.log(bot);
                    bot.restart(function () {
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

                    bot.restart(function () {
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
        var skill = getSkill(req.body.skillName);

        if (skill.name && skill.source) {
            bot.installSkill([skill.source], function (err) {
                if (err) {
                    res.status(400).send(err);
                }

                skillsProvider.addSkill(skill, function () {
                    res.status(200).send('OK');
                });
            });
        } else {
            res.status(400).send('Invalid skill provided');
        }

    } catch (err) {
        res.status(500).send('Ooops! We broke something! Try again in a minute!' + err);
    }
};

function getSkill(skillName) {
    var emptyString = '',
        skill = {
            name: skillName,
            source: skillName
        };

    if (skillName && isUrl(skillName) && skillName.startsWith(githubUrl)) {
        var urlParts = githubUrlParser(skillName);
        var githubRepoName = urlParts.name ? urlParts.name.replace('.', emptyString) : emptyString;
        var skillSource = githubRepoName ? githubRepoName + '@' + skillName : emptyString;

        skill.name = githubRepoName;
        skill.source = skillSource;
    }

    return skill;
}


function isUrl(value) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(value);
}