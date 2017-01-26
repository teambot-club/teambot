var express = require('express'),
    botService = require('server/services/bot'),
    settingsService = require('server/services/settings'),
    teamsService = require('server/services/teams'),
    hookService = require('server/services/hook'),
    bodyParser = require('body-parser');

exports.start = function(port) {

    //App Server
    var server = express();

    server.use(express.static('portal'));

    server.use(bodyParser.json());

    server.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        // res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    server.post('/startbot', botService.start);

    server.get('/restartbot', botService.restart);

    server.post('/settings/:scope', settingsService.addScope);

    server.delete('/settings/:scope', settingsService.removeScope);

    server.get('/settings/:scope', settingsService.getByScope);

    server.put('/settings/:scope', settingsService.addSettings);

    server.get('/team', teamsService.getTeamInfo);

    server.delete('/team', teamsService.removeTeamInfo);

    server.post('/hooks/:skill', hookService.postHook);

    server.listen(port, function() {
        console.log('Teambot Server started on port: %s ', port);
    });
};