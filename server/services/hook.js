var bot = require('bot');

exports.postGithubWebHook = function(req, res) {
    if (req && req.body && req.body.review && req.body.review.state === "approved") {
        var prOwner = req.body.pull_request.user.login;
        var prOwnerSlackUsername = null;
        var controller = bot.getController();
        controller.storage.users.all(function(err, users) {
            for (var i in users) {
                if (users[i].githubUsername === prOwner) {
                    prOwnerSlackUsername = users[i].id;
                    break;
                }
            }

            if (prOwnerSlackUsername) {
                var activeBots = bot.getBots();
                activeBots[req.params.team].api.users.info({ "user": prOwnerSlackUsername }, function(err, result) {
                    activeBots[req.params.team].api.chat.postMessage({
                        "channel": '@' + result.user.name,
                        "as_user": true,
                        "attachments": [{
                            color: "warning",
                            title: "Your '" + req.body.pull_request.title + "' pull request was just Approved! ",
                            title_link: req.body.review.html_url,
                            callback_id: "github:" + req.body.review.html_url,
                            attachment_type: 'default',
                            actions: [{
                                    "name": "merge",
                                    "text": "Merge",
                                    "value": "merge",
                                    "type": "button"
                                },
                                {
                                    "name": "close",
                                    "text": "Close",
                                    "value": "close",
                                    "type": "button"
                                }
                            ]
                        }]
                    }, function() {
                        
                    });

                    res.status(200).send('OK');
                });
            } else {
                res.status(200).send('OK');
            }
        });
    }
};