# CONFIG

There are 2 supported configurations:
- default: configuration that is used if something else is not specified (Local development)
- production: configuration that is used if NODE_ENV=production

```
{
    "server": {
        "port": "8888"
    },
    "botkit": {
        "port": "3000" 
    },
    "mongoUri": "mongodb://127.0.0.1:27017",
    "restrictOnlyOneUser": true,
    "log": {
        "enabled": true,
        "level": 0 
    }
}
```

Property            | Description                                                                                                             
--------------      | -----------                                                                                                             
server.port         | Express server port [default: 8888]
botkit.port         | Botkit port [default: 3000]
mongoUri            | MongoDB connection string [default: local machine default port (27017)]
restrictOnlyOneUser | Flag that enable/disable local development [default: true]. _More info provided below_
log.enabled         | Enable/Disable logging [default: true]
log.level           | Integer from 0 to 7 to adjust logging verbosity

### restrictOnlyOneUser
This flag enables Teambot contributors to share same Slack Bot User to test Teambot locally. In this way the local Teambot respect only messages from the only user in local database (your Slack user) and skip the others.