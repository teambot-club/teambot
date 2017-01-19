# BOT

## Middleware

This is a hear middleware. This means that it defines a custom logic for processing of messages.
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

## Skills Loader