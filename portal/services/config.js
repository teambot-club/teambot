app.factory('config', ['httpService', function (httpService) {

    return {
        getConfig: function () {
            var configuration = {};
            return httpService.executeRequest("get", "/settings/slack")
                .then(function (result) {
                    configuration.slack = result.data || {};
                    return httpService.executeRequest("get", "/team") 
                })
                .then(function (result) {
                    configuration.team = result.data;
                    return httpService.executeRequest("get", "/settings/general");
                })
                .then(function (result) {
                    var generalConfig = result.data;
                    configuration.botKitUrl = 'http://' + window.location.hostname + ':' + generalConfig.botkit.port;
                    configuration.redirectUri = configuration.botKitUrl + '/oauth';
                    configuration.isConfigured = configuration && configuration.slack && configuration.slack.clientId && configuration.slack.clientSecret;
                    return configuration;
                });
        }
    };
});