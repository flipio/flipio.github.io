---
layout: post
title: Logging and log rotate with ExpressJS and NodeJS
date: 2016-05-23 22:00:31 +0300
description: Logging and log rotate with ExpressJS and NodeJS. # Add post description (optional)
img: log.png
tags: [javascript, expressjs, nodejs]
---

### Logging and log rotate

Logging is important part of any backend service, and logs them self are important when you want to track your application behaviour. As log files gets bigger and bigger they use more disk space. Over time a log file can grow to unwieldy size. Running out of disk space because of a large log file is a problem, but a large log file can also slow down the process of resizing or backing up your servers.

For our logs not to get to big, we are going to rotate them and we are going to do that daily.

### NodeJS logger

Going through nodejs loggers, i found winston(https://github.com/flatiron/winston) logger to be very good. You can find basic setup on their github page, which is pretty straight forward and you can transport your logs where ever you want, which is really great. 

Winston also supports daily rotate of files, which is defined through transport:

```javascript
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: debugLog,
            dirname: config.logging.path,
            timestamp: timeFormatFn
        }),
        new winston.transports.File({ filename: debugLog, json: false })
    ],
    exceptionHandlers: [
        new (winston.transports.DailyRotateFile)({
            filename: exceptionLog,
            dirname: config.logging.path,
            timestamp: timeFormatFn
        }),
        new winston.transports.File({ filename: exceptionLog, json: false })
    ],
    exitOnError: false
});
```

So this basically tells winston to transport logs to file and daily rotate them. 
Next what we need is to transport all console.log-s through winston so we dont have to go back and rewrite all console logs to winston.log.

First lets take a look at express logger. Express is using morgan logger, which is also ok, and if you dig a little bit into it you will find that it streams all application logs and that we just need to tell him to log also in winston and we are good to go. And yes, it can be done, morgan logger accepts object as its parameter where you can specify stream function and pass it in and log also in winston. 

Like everything in Express, logger is also injected as application middleware, so lets do it.

```javascript
    /**
     * Stream logs through winston logger
     */
    app.use(logger({
        format: 'dev',
        'stream': {
            write: function(str) {
                console.log(str); // print to console also, not needed, winstone can do it when configured 
                winston.info(str);
            }
        }
    }));
```

**Note: you can always add winston transport to console so you don’t need to double log

Great, we are streaming to winston now. Just a little overview, morgan excepts object as options, and stream.write is function it executes when it prepares log string for output, and we just overrided default, and “format” parameter is just morgan parameter for pretty printing and thats it.

As for error logging, you can define another express middleware for error logs.

```javascript
/**
 * All errors are intercepted here and formated
 */
 app.use(function (err, req, res, next) {
        console.error('Caught err: ',err);
        winston.error(err)
 });
```


Just remember to add this middleware as last one and that’s it.


Hope this was usefull,

Cheers 




