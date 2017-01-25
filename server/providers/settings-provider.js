var dataProvider = require('server/providers/data-provider');

var SettingsProvider = function() {

    function getByScope(scope, callback) {
        try {

            dataProvider.get({ "scope": scope }, 'settings', function(err, data) {
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

    function addSettings(scope, settings, callback) {
        try {

            dataProvider.update({ "scope": scope }, settings, 'settings', callback);

        } catch (err) {
            callback(err);
        }
    }

    function removeScope(scope, callback) {
        try {
            dataProvider.remove(scope, 'settings', callback);

        } catch (err) {
            callback(err);
        }
    }

    function addScope(scope, settings, callback) {
        try {
            settings.scope = scope;
            dataProvider.insert(settings, 'settings', callback);

        } catch (err) {
            callback(err);
        }
    }

    return {
        getByScope: getByScope,
        addSettings: addSettings,
        removeScope: removeScope,
        addScope: addScope
    };
}();

module.exports = SettingsProvider;