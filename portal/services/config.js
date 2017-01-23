app.factory('config', ['httpService', function(httpService) {

    return {
        get: function(scope) {
            var configJSON = "";

            jQuery.ajax({
                url: '/settings/' + scope,
                success: function(jsonString) {
                    configJSON = jsonString;
                },
                async: false
            });

            return configJSON;
        },

        getBotkitUri: function() {
            var configJson = this.get('general');

            // TODO: We should consider whether to support https as well
            return 'http://' + window.location.hostname + ':' + configJson.botkit.port;
        },

        getRedirectUri: function() {
            var botkitUri = this.getBotkitUri();

            return botkitUri + '/oauth';
        },

        isConfigured: function() {
            var configJson = this.get('slack');

            return configJson && configJson.clientId && configJson.clientSecret;
        },

        getSlackConfiguration: function () {
             return httpService.executeRequest("get", "/settings/slack");
        },

        getTeamInfo: function() {
            return httpService.executeRequest("get", "/team");
        }
    };
});