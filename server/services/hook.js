var bot = require('bot');

function getCurrentBot() {
    var activeBots = bot.getBots();
    var currentBot = activeBots[Object.keys(activeBots)[0]];

    return currentBot;
}

function getCurrentController() {
    var currentController = bot.getController();

    return currentController;
}

exports.postHook = function postHook(req, res) {
    try {
        require(req.params.skill);
    } catch (ex) {
        res.status(400).send("The '" + req.params.skill + "' skill is not installed.");
    }

    try {
        var targetHooksFunction = require(req.params.skill + "/hooks");
    } catch (ex) {
        res.status(400).send("The '" + req.params.skill + "' skill does not support hooks handling.");
    }

    try {
        targetHooksFunction(req.body, getCurrentController(), getCurrentBot(), function (message) {
            res.status(200).send(message || "OK");
        });
    } catch (ex) {
        res.status(400).send("An exception occurred during hook handling: '" + ex.message + "'");
    }
};