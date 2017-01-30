var dataProvider = require('server/providers/data-provider');

function checkDatabaseConnectivity(callback) {
    dataProvider.get({ scope: 'general' }, 'settings', callback);
}

exports.getStatus = function(req, res) {
    var status = {};
    try {
        checkDatabaseConnectivity(function(err, data) {
            if (err) {
                status.data = err;
                res.status(500).send(status);
            } else {
                status.data = 'OK';
                res.status(200).send(status);
            }
        });

    } catch (ex) {
        res.status(500).send(ex);
    }
};