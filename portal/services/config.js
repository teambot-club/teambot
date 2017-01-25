app.factory('config', function() {

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

        getConfiguration: function () {
             return this.get('slack');
        },

        getTeamInfo: function() {
            var teamInfoJSON = "";

            jQuery.ajax({
                url: '/team',
                success: function(jsonString) {
                    teamInfoJSON = jsonString;
                },
                async: false
            });

            return teamInfoJSON;
        }
    };
});