![TEAMBOT](portal/img/teambot-banner.png)

[![Waffle.io](https://img.shields.io/badge/project-board-green.svg)](http://waffle.io/teambot-club/teambot)
[![Code Climate](https://codeclimate.com/github/teambot-club/teambot/badges/gpa.svg)](https://codeclimate.com/github/teambot-club/teambot)

[![Slack Channel](https://img.shields.io/badge/slack-channel-blue.svg)](https://teambotclub.slack.com/messages/public)

Teambot is a Slack chatbot end-to-end solution that can be deployed to any infrastructure that can run Node.js. 
Teambot works with the [Express](http://expressjs.com/) web application framework and [BOTKIT](https://www.npmjs.com/package/botkit#advanced-topics).

# Motivation
We are a development team. We use Slack alot! All our internal and external communication is there. On one of our internal hackathons we decided to develop a plugable end-to-end solution for Slack bots that should be used by dev teams and help them to increase their productivity.

We know how cool it sounds Bot As A Service but let be honest - are you going to grand access to your internal resources to any public service? This is why we belive that your bot shuld be privately deployed on your side!

[Botkit](https://www.npmjs.com/package/botkit#advanced-topics) was the framework we decided to use because it is trending and because we loved it almost immediately. 

And this is it - **Teambot**!

# Getting Started

The fastest and easiest way to get started is to run MongoDB and Teambot locally.

## Running Teambot locally

### Prerequisites

- Node version - 6.9.4+
- bower (run `npm install -g bower`) 
- MongoDB

### Setup
 
```
$ git clone https://github.com/teambot-club/teambot.git
$ npm install
$ mongod #optional if your local MongoDB is not started
$ node teambot.js
```

When you start Teambot for the first time you have to configure it to become part of your Slack team. 
Teambot requres to have a [Slack app](https://api.slack.com/slack-apps) with configured bot user.
Each Slack App has Client ID and Client Secret. The following Client ID and Client Secret are for Slack app associated with @testteambot user in [Teambot team](https://teambotclub.slack.com/signup).

- Navigate to http://localhost:8888
- Enter Slack Client ID
- Enter Slack Client Secret
- You will receive a message from your bot 
- ENJOY!

### Supported Arguments

Command line arguments can be passed to Teambot:

`node teambot.js -[argument_name] [argument_value]`

Argument      | Description                                                                                                                                                     | Usage
--------------| -----------                                                                                                                                                     | ------------
skill         | Load skill in Teambot. Usefull for skills development. The value should be `[skill-name]@[file:local_skill_path]` or `[skill-name]@[github_url]`     | `node teambot.js -skill "skill-name@file:./path/to/your/skill"` or `node teambot.js -skill "skill-name@https://github.com/skill-repo-name"`


### Middleware

This is a `hear` middleware. This means that it defines a custom logic for processing of messages.
The middleware enables the behaviour definition providing keywords. What this means?
Let's get this example:

```
controller.hears(['How many fixed bugs with high severity we have?'], 'direct_message,direct_mention,mention', middleware.process, teamPulseSource.getHighFixedBugsCount);
```
When somebody say 'How many fixed bugs with high severity we have?' the teambot will reply with the result provided from invocation of teamPulseSource.getHighFixedBugsCount function. Are you kidding me - I have to write 'How many fixed bugs with high severity we have?'. I will make a mistake writing this down and the teambot reply will be - nothing!

This is where the Middleware take place. It provide a keyword definition of behaviours:
```
controller.hears(['fixed', 'bugs', 'high'], 'direct_message,direct_mention,mention', middleware.process, teamPulseSource.getHighFixedBugsCount);
```
The above example will handle the message 'Number of fixed high bugs', 'Could you please give me the number of fixed bugs with high severity'. The result will be the same - invocation of teamPulseSource.getHighFixedBugsCount.

The middleware also support definition of complex patterns. What the complex pattern means?
If 'hello' is a pattern, 'hello|hi' is a complex pattern. So the complex pattern represents several patterns separated by |. The complex pattern is treated as found if one of its patterns is found. 

### Configuration

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

#### restrictOnlyOneUser
This flag enables Teambot contributors to share same Slack Bot User to test Teambot locally. In this way the local Teambot respect only messages from the only user in local database (your Slack user) and skip the others.        

