var teamsProvider = require('server/providers/teams-provider');

exports.getTeamInfo = function (req, res) {
    teamsProvider.getTeamInfo(function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        data = data || {};
        res.status(200).send({
            teamName: data.name,
            teamUrl: data.url
        });
    });
};

exports.removeTeamInfo = function (req, res) {
    teamsProvider.removeTeamInfo(function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        data = data || {};
        res.status(200).send({
            teamName: data.name,
            teamUrl: data.url
        });
    });
};