require('app-module-path').addPath(__dirname);
var server = require('server'),
    bot = require('bot'),
    config = require('config'),
    settingsProvider = require('server/providers/settings-provider');

//Trust all certificates
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

settingsProvider.addSettings('general', config, function (err, data) {
    if (err) {
        console.log("Error while storing config. " + err);
        return;
    }

    var devSkill = getDevSkill();

    server.start(config.server.port);
    bot.start(null, devSkill);
});

function getDevSkill() {
    var devSkill;
    process.argv.forEach(function (val, index, array) {
        if(val === "-devskill") {
            devSkill = array[index + 1];
        }
    });

    return devSkill;
}
