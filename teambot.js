require('app-module-path').addPath(__dirname);
var server = require('server'),
    commandLineArgs = require('command-line-args'),
    dataProvider = require('server/providers/data-provider'),
    bot = require('bot'),
    botContext = require('bot/bot-context'),
    settingsProvider = require('server/providers/settings-provider');

//Trust all certificates
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var optionDefinitions = [{
        name: 'server',
        alias: 'p',
        type: String,
        defaultValue: '8888'
    },
    {
        name: 'hooks',
        alias: 'h',
        type: String,
        defaultValue: '8889'
    },
    {
        name: 'botkit',
        alias: 'b',
        type: String,
        defaultValue: '3000'
    },
    {
        name: 'mongo',
        alias: 'm',
        type: String,
        defaultValue: 'mongodb://127.0.0.1:27017'
    },
    {
        name: 'logging',
        alias: 'l',
        type: Boolean,
        defaultValue: true
    },
    {
        name: 'verbose',
        alias: 'v',
        type: Number,
        defaultValue: '0'
    },
    {
        name: 'skill',
        alias: 's',
        type: String
    },
    {
        name: 'production',
        alias: 'r',
        type: Boolean,
        defaultValue: false
    }

]

var options = commandLineArgs(optionDefinitions)
botContext.production = options.production;

dataProvider.init(options.mongo);

settingsProvider.addSettings('general', options, function(err) {
    if (err) {
        console.log('Error while storing config. ' + err);
        return;
    }

    var skill = options.skill;

    server.start(options.server);
    bot.start(null, skill);
});