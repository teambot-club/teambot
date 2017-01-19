"use strict";

var Tokenizer = require('tokenize-text'),
    config = require('config'),
    restrictOnlyOneUser = config.get('restrictOnlyOneUser');

var Middleware = function () {

    var process = function (patterns, message) {

        var bot = require('bot');
        if (restrictOnlyOneUser) {
            if (!bot.isLocalUser(message.user)) {
                return;
            }
        }

        var tokenize = new Tokenizer();
        var tokenizedMessage = tokenize.words()(message.text),
            allKeywordsFound = false,
            match = null;

        for (var index = 0; index < patterns.length; index++) {
            var pattern = patterns[index];

            var regex = new RegExp("(.*)" + pattern + "(.*)", "i");
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