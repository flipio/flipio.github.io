---
layout: post
title: Sorting array of objects by template
date: 2016-05-23 22:00:31 +0300
description: Sorting array of objects by template. # Add post description (optional)
img: sorting.png
tags: [javascript]
---



One day college of mine comes and asks me: "i was looking for something that will sort my an array by the given template, does lodash support that?".

I was not sure what he actually needs so he explained it to me.

Let’s say that you have array of objects representing some data set, and you need to sort them in a special way.

Example data:

```javascript
var data = [
  { data: {/* patient data */}, disease: 'Breast Cancer' },
  { data: {/* data */}, disease: 'Lung Cancer' },
  { data: { /* data */}, disease: 'Skin Cancer' },
  { data: {/* data */}, disease: 'Some Other disease' }
]
```

We can simply sort this array alphabetically, but that’s not our case. We won to sort this template by disease in special order so that 'Skin Cancer' be first then 'Breast Cancer' second, 'Lung Cancer' third, and 'Some other disease' last.

So we wont to call Array.sort and give it a template that looks something like this:

```javascript
['Skin Cancer', 'Breast Cancer', 'Lung Cancer', 'Some Other disease']
```

After first iteration i came up with this:

```javascript
Array.prototype.sortByTemplate = function (tpl, key) {

        key = key || 'name';

        var i, j, removed,
            length = tpl.length,
            len = this.length;

        for (i = 0; i&lt;length;i ++) {

            for (j = 0; j&lt;len; j++) {

                if (this[j][key] === tpl[i]) {

                    removed = this.splice(j, 1);

                    this.splice(i, 0, removed[0]);

                    break;
                }

                if (j === len-1) {
                    missing++;
                }

            }
        }

        return this;
    };
```



This worked great, until i figured that there can be parts in template that don't exist in data so we needed to sort them either way in that order. Here's what happens when one is missing. When one element in template doesn't exist in data set, we will get our index incremented so sort wont be accurate, it will have elements in front of each other not according to template. So small tweak: 

```javascript
Array.prototype.sortByTemplate = function (tpl, key) {

        key = key || 'name';

        var i, j, removed, missing = 0,
            length = tpl.length,
            len = this.length;

        for (i = 0; i&lt;length;i ++) {

            for (j = 0; j&lt;len; j++) {

                if (this[j][key] === tpl[i]) {

                    removed = this.splice(j, 1);

                    this.splice(i - missing, 0, removed[0]);

                    break;
                }

                if (j === len-1) {
                    missing++;
                }

            }
        }

        return this;
    };
```

### Example usage: 

```javascript
var template = ['Skin Cancer', 'Breast Cancer', 'Lung Cancer', 'Some Other disease'];
// call sort on our data set, and our key to sort by is 'disease'
data.sortByTemplate(template, 'disease');  
// and we get 
//[{'data':{},'disease':'Skin Cancer'},{'data':{},'disease':'Breast Cancer'},{'data':{},'disease':'Lung Cancer'},{'data':{},'disease':'Some Other disease'}]
```

Its basically insertion sort with linear search, when i get time to do some performance update i will update this  post.

*One note, when you have big data set and you just wont few of examples to be first, they will get to beginning of array and other elements won’t be touched (sorted).

Hope this was usefull,

Cheers

