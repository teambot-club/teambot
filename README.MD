![TEAMBOT](portal/img/teambot-banner.png)

[![Waffle.io](https://img.shields.io/badge/project-board-green.svg)](http://waffle.io/teambot-club/teambot)
[![Code Climate](https://codeclimate.com/github/teambot-club/teambot/badges/gpa.svg)](https://codeclimate.com/github/teambot-club/teambot)
[![npm](https://img.shields.io/npm/v/teambot.svg)](https://www.npmjs.com/package/teambot)

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

`node teambot.js --[argument_name] [argument_value]`

Argument          | Description                                            | Type        | Default                                                                                                                                                    
--------------    | -----------                                            | --------    | --------                                                                                                                                     
--server, -p      | Web Configuration portal port                          | String      | 8888
--hooks, -h       | Slack hooks port                                       | String      | 8889
--botkit, -b      | Botkit port                                            | String      | 3000
--mongo, -m       | Mongo Uri                                              | String      | mongodb://127.0.0.1:27017
--logging, -l     | Enable logging                                         | Boolean     | true 
--verbose, -v     | Verbose level from 0 to 7                              | Number      | 0
--development, -d | true - development mode, false - production mode       | Boolean     | true
--skill, -s       | Load skill in Teambot. Usefull for skills development. |             | 

#### --skill (-s)

- node teambot.js --skill `[skill-name]@[npm_version]`
- node teambot.js --skill `[skill-name]@[github_url]`
- node teambot.js --skill `[skill-name]@[file:local_skill_path]`

#### --development (-d) mode
This flag enables Teambot contributors to share same Slack Bot User to test Teambot locally. In this way the local Teambot respect only messages from the only user in local database (your Slack user) and skip the others.        


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
