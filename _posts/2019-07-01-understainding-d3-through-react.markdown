---
layout: post
title: Understanding d3 through React
date: 2019-06-29 18:30:29 +0200
description: Understanding core concepts of d3js using react
img: react-d3.png
tags: [javascript, d3]
---

### Intro

Why again this theme? Reason is im writing this is because i had so much fun writing small components using d3 & React. 
You will find many many solutions/libraries that do just this. But what makes this approach good is that you actually need 
to take a look and understand what each of the d3 functions you are used to use are doing. This will just help you in getting 
that "d3 is not that hard" feeling.

From React standpoint we need to know basics, we will not use lifecycle functions and only leverage `getDerivedStateFromPrpos()` method on component.
So our simple char components will have this structure: 

```jsx
class Chart extends PureComponent {
    state = {
        // holds fragments of computed properties
    };
    
    static getDerivedStateFromProps(nextProps, prevState) {
        // all the chart logic goes here
        return {
            // return computed props to state 
        }
    }
    
    render() {
        const {} = this.state;
        return (
            <svg> 
                //chart stuff 
            </svg>
        )
    }
}
```

[Link to `getderivedstatefromprops()` documentation](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
and tl:dr version of docs: 

```
getDerivedStateFromProps is invoked right before calling the render method, both on the initial mount and on subsequent 
updates. It should return an object to update the state, or null to update nothing.
```

And that's all you need to know about it.

So TL;DR of this is, we are going to use `getderivedstatefromprops()` to compute all properties of elements we are going
to show in charts and keep them in state. Then we can easily loop over them and get them into the svg with appropriate elements. 

### Charts

We are going to create multiple charts ( Line charts * Bar charts with multiple variations ). We are going to create axis
as standalone components being reused across charts. We will cover some basic interaction with charts, like hovering data points
on line chart.  

Our render method should look something like this for every chart: 
```jsx
render() {
  const {width, height} = this.props;

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        {this.renderAxis()}
        {this.renderData()}
      </g>
    </svg>
  );
}
```

*** Note that `margins` is a constant we will create to offset chart from edges.

### Line Charts

What we need to build a line chart:
- from `d3-shape` we'll take `line` (commonly known as `d3.line()`)
- `d3-scale` will give us `linearScale` for our chart
- we will use `extent` also so we dont do this manually

That `lineGenerator` created from `d3.line()` is just a function that creates path string fort `<path>` svg element.
You feed it configuration (which we will cover), and it will create a "line" for us to show.  

Before writing `getDerivedStateFromProps` lets figure out what we will need to store in state. 
```javascript
  state = {
    line: '', // line path to fill svg <path> 
    
    // we need both scales to feed to the axes 
    xScale: scaleLinear(),
    yScale: scaleLinear(),
    
    // we dont need to store thjs but it just reduces boilerplate in getDerivedStateFromProps()
    lineGenerator: line(),
  };
```

We have a plan now so lets get with `getDerivedStateFromProps`.
*Note in advance - `margins` is just a plain object that we use to offset chart a bit from the svg edges.
```javascript
const margins = {
  left: 60,
  right: 60,
  top: 60,
  bottom: 60,
};
```

```javascript
  static getDerivedStateFromProps(nextProps, prevState) {
    const {data, width, height} = nextProps;
    const {xScale, yScale, lineGenerator} = prevState;
        
    // get our data min and max value for both scales
    const xExtent = extent(data, d => d.x);
    const yExtent = extent(data, d => d.y);
        
    /**
    * Note that both scales are already initialised in default state with scaleLinear()
    * This all can be done here in this function, we just want to save us some boilerplate  
    * since we are not going to use different scales here anyways.
    */
   
    // configure xScale 
    xScale
       // define space it will consume
      .range([0, width - margins.right - margins.left])
      // range of values that will be presented
      .domain(xExtent)
      // make it look nice :)
      .nice();

    // same goes for yScale
    yScale
      .range([height - margins.bottom - margins.top, 0])
      .domain(yExtent)
      .nice();
    
    // here is the initialized d3.line() which we already done in state default values.
    // Here we will just give it x and y  accessors so it knows how to read our data
    lineGenerator.x(d => {
      return xScale(d.x);
    });

    lineGenerator.y(d => {
      return yScale(d.y);
    });

    const line = lineGenerator(data);

    return {
      line,
      xScale,
      yScale,
    };
  }
```

##### Breakdown

### Bar Charts 

### Axis

I saved this to be the last chapter since i consider it to boilerplate with naive implementation of both axis which 
i am not going to go into that deep.   

```jsx
import React, { PureComponent, createRef } from 'react';
import { select } from 'd3-selection';
import { axisLeft, axisBottom, axisRight, axisTop } from 'd3-axis';

export const AxisOrientation = {
  TOP: 'TOP',
  LEFT: 'LEFT',
  BOTTOM: 'BOTTOM',
  RIGHT: 'RIGHT',
};

export class Axis extends PureComponent {
  state = {};

  axisRef = createRef();

  static getAxis(orientation = AxisOrientation.LEFT) {
    switch (orientation) {
      case AxisOrientation.TOP:
        return axisTop;
      case AxisOrientation.BOTTOM:
        return axisBottom;
      case AxisOrientation.LEFT:
        return axisLeft;
      case AxisOrientation.RIGHT:
        return axisRight;
      default:
        return axisLeft;
    }
  }

  static getDerivedStateFromProps(nextProps) {
    const { orientation, scale, tickFormat } = nextProps;
    const d3Axis = Axis.getAxis(orientation);

    const tFormat = tickFormat ? tickFormat : (d) => d;

    const axis = d3Axis()
      .scale(scale)
      .tickFormat(tFormat);

    return {
      axis,
    }
  }

  componentDidMount() {
    this.updateAxis();
  }

  componentDidUpdate() {
    this.updateAxis();
  }

  updateAxis() {
    const axis = select(this.axisRef.current)
      .call(this.state.axis);

    if (this.props.orientation === AxisOrientation.BOTTOM && this.props.rotateText) {
      axis.selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-1em')
        .attr('dy', '-.2em')
        .attr('transform', 'rotate(-65)');
    }
  }

  render() {
    const {x, y} = this.props;

    return (
      <g className={'axis'} ref={this.axisRef} transform={`translate(${x}, ${y})`}/>
    );
  }
}
```

Some core stuff here that we actually need to show axis. Note that this is the only time we are using actuall elements with d3,
because of the nature of how d3 axis actually works.  

`axisRef = createRef();` - element ref to actually "call" axis on
`static getDerivedStateFromProps(nextProps)` - same as before, configure axis and store it to state
`const axis = select(this.axisRef.current).call(this.state.axis);` - get that axis to the dom

That's it, everything else is decoration. 
`

``


