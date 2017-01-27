var botContext = require('bot/bot-context');

exports.postHook = function postHook(req, res) {
    try {
        require(req.params.skill);
    } catch (ex) {
        return res.status(400).send("The '" + req.params.skill + "' skill is not installed.");
    }

    try {
        var targetHooksFunction = require(req.params.skill + '/hooks');
    } catch (ex) {
        return res.status(400).send("The '" + req.params.skill + "' skill does not support hooks handling.");
    }

    try {
        targetHooksFunction(req.body, botContext.controller, botContext.bot, function(message) {
            return res.status(200).send(message || 'OK');
        });
    } catch (ex) {
        return res.status(400).send("An exception occurred during hook handling: '" + ex.message + "'");
    }
};