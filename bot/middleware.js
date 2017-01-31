'use strict';

var botContext = require('bot/bot-context');

var Middleware = function() {

    function isLocalUser(userId) {
        var _isLocalUser = false;

        for (var idx = 0; idx < botContext.localUsers.length; idx++) {
            var user = botContext.localUsers[idx];
            if (userId == user.id) {
                _isLocalUser = true;
                break;
            }
        }

        return _isLocalUser;
    }

    var process = function(patterns, message) {

        if (botContext.production) {
            if (!isLocalUser(message.user)) {
                return;
            }
        }

        var match = null;

        for (var index = 0; index < patterns.length; index++) {
            var pattern = patterns[index];

            var regex = new RegExp('(.*)' + pattern + '(.*)', 'i');
            match = message.text.match(regex);

            if (match) {
                for (var idx = 0; idx < match.length; idx++) {
                    var element = match[idx];
                    if (!element ||
                        (pattern.indexOf(element) != -1 &&
                            pattern.indexOf('(.*)') > pattern.indexOf(element))) {
                        match.splice(idx, 1);
                    }
                }
                message.match = match;
                break;
            }
        }

        return match;
    }

    return {
        process: process
    };
}();

module.exports = Middleware;