---
layout: post
title: Comparing arrays in javascript
date: 2014-01-30 22:47:31 +0300
description: Comparing arrays in javascript. # Add post description (optional)
img: compare.png
noHeaderImg: true
tags: [javascript]
---

Lets kick it.

So, let's say that, for some reason, you need to compare two arrays. You wonder what the easiest way is, and something like this crosses your mind:

```javascript
var arr1 = [1,2,3];
var arr2 = [2,3,4];
var arr3 = [1,2,3];

function compareArrays(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

compareArrays(arr1, arr2);
//false
compareArrays(arr1, arr3);
//true
```

So, you do a little googling and realize that JSON.stringify isn't performing, and you decide to test if .toString() works quicker.

```javascript
var arr1 = [1,2,3];
var arr2 = [2,3,4];
var arr3 = [1,2,3];

function compareArrays(arr1, arr2) {
  return arr1.toString() === arr2.toString();
}

compareArrays(arr1, arr2);
//false
compareArrays(arr1, arr3);
//true
```

Doesn't feel right, does it? How about we try something different.

```javascript
function compareArrays(arr1, arr2) {
  //lets check for a quick difference to save time
  if(arr1.length !== arr2.length)
    return false;

  for(var i = 0; i < arr1.length; i++){
    if(arr1[i] !== arr2[i]){
      return false;
    }
  }

  return true;
}
```

Not bad at all - we are comparing the lengths of the arrays to save time, and then loop through one array and compare it to the other. But can we do even better?

```javascript
function compareArrays(arr1, arr2) {
  //check if some of the arguments has 'falsy' value
  if( !arr1 || !arr2)
    return false;
  //lets check for a quick difference to save time
  if(arr1.length !== arr2.length)
    return false;

  for(var i = 0; i < arr1.length; i++){
    if(arr1[i] instanceof Array && arr2[i] instanceof Array){
      //recurse into nested arrays for comparison
      if (!arr1[i].compareArrays(arr2[i]))
        return false;
    }else if(arr1[i] !== arr2[i]){
      return false;
    }
  }

  return true;
}
```

Now this feels right, we are checking for not falsy arguments, comparing lengths to save time, and recursively check for nested arrays. Lets just explain a little bit that 'falsy' value. In this example if one of the arguments has undefined or null value it will be 'falsy' and will return false.

So lets make equals method on Array's prototype to call it on any array we want

```javascript
// add equals method to Array's prototype to call it on any array we want
Array.prototype.equals = function (array) {
    //check if argument has 'falsy' value and since we are comparing arrays it is good to check if argument is one
    if (!array || !array instanceof Array)
        return false;

    //lets check for a quick difference to save time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        //recurse into nested arrays for comparison
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
}
```

Hope this helped, 
Cheers

