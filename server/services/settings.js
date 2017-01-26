var settingsProvider = require('server/providers/settings-provider');

exports.getByScope = function(req, res) {

    settingsProvider.getByScope(req.params.scope, function(err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
    });
};

exports.addSettings = function(req, res) {

    settingsProvider.addSettings(req.params.scope, req.body, function(err, data) {
        if (err) {
            return;
        }
        res.status(200).send(data);
    });
};

exports.removeScope = function(req, res) {

    settingsProvider.removeScope(req.params.scope, function(err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
    });
};

exports.addScope = function(req, res) {

    settingsProvider.insert(req.params.scope, req.body, function(err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
    });
};