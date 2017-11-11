---
layout: post
title: Dive into Typescript decorators
date: 2016-05-23 22:00:31 +0300
description: Dive into Typescript decororators. # Add post description (optional)
img: decorators.png
tags: [javascript, typescript, decorators]
---


### Disclaimer

**Quick disclaimer: This post will tell you a bit about typescript decorators, but will mainly try to push you to try new things, experiment and see how fun it is and where our JS world is going :)

Working in Seven Bridges Genomics really inspired me in all sorts of ways, pushing me to try new things, find best solutions and solve problems on everyday basis. Trying new/great things and implementing them in our workflow is what made Seven Bridges product what it is now. 

### So what is Typescript?

Something new, pretty awesome (this is a little bit scary, right?). It’s really just ES6 on steroids. We have everything that comes with ES6/7 powered with Types.

I know what you think, types suck right? I’ve heard so many times: 

>If I wanted types I would still be writing Java and I fell in love with JavaScript for different reasons.

And that’s completely fine. One thing you are missing is that types actually help a lot sometimes, doing static checks and easy code refactoring.

You all know how big of a mess one huge javascript app can be, and we are struggling to make it better every day. I think that we are on a path of something good here.

So prepare, Typescript to the rescue!

Ok, enough of weird talk, let’s kick it.


### What are those mysterious Decorators?

Decorators are simply functions that modify a class, property, method, or method parameter. The syntax is an “@” character followed by the name of the decorator.

**Note: All the cool kids explaining decorator use log decorator as an example, so i will start with that :)

```javascript
class Dog {

    breed: string;

    constructor() {}

    @log
    setBreed(breed: string) {
        this.breed = breed;
    }

}
```

The @log decorator is a method decorator in this example. It will log arguments and result of method that decorates. I won't go deep into explaining how it works, there are some pretty good resources on reading how decorators work and how TypeScript compiler generates "the magic".
It would be nice for you to read more on decorators in Typescript handbook Decorators section here. 

```javascript
function log(target: any, key: string, descriptor: any) {

    // store original descriptor method
    var originalMethod = descriptor.value;

    //editing the descriptor/value parameter
    descriptor.value =  function (...args: any[]) {
        var arguments = args.map((arg) => JSON.stringify(arg)).join();

        // we have to call original method and proxy the results back
        var result = originalMethod.apply(this, args);

        var resultString = JSON.stringify(result);

        console.log(`Calling fn “${key}”  with args: (${arguments}) , result:  ${resultString}`);

        return result;
    }

    // return edited descriptor as opposed to overwriting
    // the descriptor by returning a new descriptor
    return descriptor;
}
```

Let me explain this a bit. Our decorator function accepts 3 arguments: Target, Key, Descriptor.

"target" => the method being decorated
"key" => the name of the method being decorated
"descriptor" => a property descriptor of the given property if it exists on the object, undefined otherwise. Descriptor contains "value" property which is actual method to be invoked

There is another way of doing this, instead of overriding descriptor value, you can always return new descriptor object like this:

```javascript
function log (target: any, key: string, descriptor: any) {

    return {
        value: function(...args: any[]) {
            // same as descriptor.value from example above
        }
    }

}
```

Let’s go further and extend our logging functionality.

I would like to disable logging on application level without much work but I want to be able to force logging even in Production environments. So it would be cool for example if I can pass in some arguments to the @log decorator. And yes we can do it!

Introducing decorator factory, you can wrap your decorator in a function that will return your decorator and accept additional arguments. In our case I would like to pass in a "force" log flag like this: @log(true)

For this we would need some fancy logging function and it would look something like this:

```javascript
// First our super fancy logging function
function fancyLog(toLog, force: boolean = false) {
    if (env !== 'PRODUCTION' || force) {
        console.log.apply(this, toLog);
    }
}

// Wrap it!
function log(force?: boolean) {

    return function log(target: any, key: string, descriptor: any) {

        var originalMethod = descriptor.value;

        descriptor.value =  function (...args: any[]) {
            var arguments = args.map((arg) => JSON.stringify(arg)).join();

            var result = originalMethod.apply(this, args);

            var resultString = JSON.stringify(result);

            fancyLog([`Calling fn “${key}”  with args: (${arguments}) , result:  ${resultString}`], force);

            return result;
        }

        return descriptor;
    }

}
```


### Project

Going creative now! 

I am glad that I have time to experiment with different technologies all the time and lately I've been writing Seven Bridges api client in NodeJS and I decided to try Typescript.

Halfway through writing, I realized that I can really leverage decorators! So if I can annotate handlers with url patterns it would be great.

What do I mean with url patterns: it’s just url endpoint like this "/foo/bar/bazz". 

So I started:

```javascript 
Class Tool extends BaseClient {
    constructor() {//...}

    @url('/tools')
    get(url, options) {
        return Request.get({url: url});
    }
}
```

And when you look at it, it really does nothing at all.
So lets get further:

```javascript
@url('/tools/{id}')
update(url, options) {
    return Request.post({url: url, body: options.body});
}
```

Now this would be fun!
But we can do even more. Lets try to make it accept optional url path params:

```javascript
@url('/tools/{toolId}/{revision?}')
update(url, options) {
    return Request.post({url: url, body: options.body});
}
```

Let’s give it a go:

Make a getParams() function that will parse string and return Array<string> with strings being keys in curly brackets. For "/tools/{id}" you will get ["id"] (we are going to skip that part).

```javascript
function getParams() {// all the magic}

// And the real thing

function url(urlTemplate?: string) {
    var keys: Array<string>;

    if (urlTemplate) {
        keys = getParams(urlTemplate);
    }

    return function (target: any, method: string, descriptor: any) {

        return {
            value: function (opts) {

                let options: any = opts || {};

                let url: string = urlTemplate;

                if (urlTemplate && keys) {

                    function replace(key: string, optional: boolean = false): void {

                        if (options[key] || optional) {

                            let temp: string = key;
                            let value = options[key];

                            if (optional) {
                                temp = temp + '?';
                            }

                            if (optional && !value) {
                                url = url.replace('/{' + temp + '}', '');
                            } else {
                                url = url.replace('{' + temp + '}', value);
                            }

                            delete options[key];
                        } else {
                            if (!optional) {
                                throw Error('Missing required PATH parameter: ' + key + ' in method: ' + method);
                            }
                        }
                    }

                    _.forEach(keys, function (key) {

                        if (_.endsWith(key, '?')) {
                            key = key.substring(0, key.length - 1);
                            replace(key, true);
                        } else {
                            replace(key);
                        }

                    });

                }

                return descriptor.value.apply(this, [url, options]);
            }

        };
    };
};
```

That’s it! Now user can pass in stuff like this:

```javascript
ApiClient.Tools.update({
    toolId: 'some-id',
    revision: 1,
    body: {
        // the tool
    }
});
```

And all you did is: 

```javascript
@url('/tool/{toolId}/{revision?}')
```

This brings endless possibilities and makes it so much easier to continue building stuff.

We can maybe chain multiple decorators and do something like this:

```javascript
@get
@url('/tools')
getTools(url, options) {
    // do some validations/preparing
}
```

One thing you must be aware of in this case is order of execution, it looks like this:
**Note: Taken from typescript docs

```javascript
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

This will result in:

```javascript
f(): evaluated
g(): evaluated
g(): called
f(): called
```

That’s it, I hope I got you to the point where you want to play around and create some awesome stuff. We are entering a great javascript era, and I am super excited about it :)

I encourage you all to give it your best, and just share the ideas and stuff you build.

Cheers




