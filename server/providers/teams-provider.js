var dataProvider = require('server/providers/data-provider');

var TeamsProvider = function() {
    function getTeamInfo(callback) {
        try {
            dataProvider.get({}, 'teams', function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                if (data && Object.prototype.toString.call(data) === '[object Array]') {
                    data = data[0];
                }
                callback(null, data);
            });

        } catch (err) {
            callback(err);
        }
    }

    return {
        getTeamInfo: getTeamInfo
    };
}();

module.exports = TeamsProvider;