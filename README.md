# checkcond
[![Build Status](https://travis-ci.org/al66/checkcond.svg?branch=master)](https://travis-ci.org/al66/checkcond)
[![Coverage Status](https://coveralls.io/repos/github/al66/checkcond/badge.svg?branch=master)](https://coveralls.io/github/al66/checkcond?branch=master)

[![NPM](https://nodei.co/npm/checkcond.png)](https://nodei.co/npm/checkcond/)

Checks digit, date or string value against condition string.

For usage stand alone or e.g. in decision tables -> [DMN Notation](http://www.omg.org/spec/DMN/1.1/PDF/).

## Usage
```js
const compiler = require('checkcond').Compiler;
const check = require('checkcond').Check;

let condString = '[7..10]';
let x = 8;
let cond = compiler(condString);
let result = check(x, cond);    // => true
```
or via combined processing of compile + check:
```js
const checkDirect = require('checkcond').CheckDirect;

let condString = '[7..10]';
let x = 8;
let result = checkDirect(x, condString);    // => true
```

## Examples

### Check digits.
`'< 1.000'`.
```
      x=-5 => true
      x=0.001 => true
      x=8 => false
      x=10000 => false
```
`">= 5"`
```
      x=4 => false
      x=5 => true
      x=5.001 => true
      x=8 => true
```      
`">= 5.001"`
```      
      x=5 => false
      x=5.001 => true
      x=8 => true
```      
`'[5..10]'` between 5 and 10
```      
      x=5 => true
      x=10 => true
      x=11 => false
```      
`'< 10, [5..100]'` less then 10 or between 5 and 100
```      
      x=1 => true
      x=5 => true
      x=100 => true
      x=101 => false
```      
`'< 1000, !([5..100])'` less then 1000 and not between 5 and 100
```      
      x=-50 => true
      x=4 => true
      x=5 => false
      x=100 => false
      x=100.1 => true
```      
`'[5.05..10.05],[70..100],-10.56'`
```      
      x=5.06 => true
      x=85 => true
      x=20 => false
      x=-10.56 => true
      x=-10 => false
      x=100 => true
```      
`'not(5,[7..9],12)'`
```      
      x=5 => false
      x=6 => true
      x=7 => false
      x=9.05 => true
      x=12 => false
      x=13 => true
```      
### Check dates
Supported date formats for conditions and values are:
 - mm/dd/yyyy
 - yyyy/mm/dd
 - yyyy-mm-dd
 - dd.mm.yyyy

`'< 01/01/2017'`.
```
      x='10/12/2015' => true
      x='05/03/2017' => false
```      
`'> 03.11.2017'`.
```
      x='12/01/2017' => true
      x='10/04/2017' => false
```      
`'[01/01/2017..01/01/2018]'`.
```
      x='10/12/2015' => false
      x='01/01/2017' => true
      x='05/06/2017' => true
      x='01/01/2018' => true
      x='01/01/2019' => false
      x='05/03/2019' => false
```      
`'not([01/01/2017..01/01/2018])'`.
```
      x='10/12/2015' => true
      x='01/01/2017' => false
      x='05/06/2017' => false
      x='01/01/2018' => false
      x='01/01/2019' => true
      x='05/03/2019' => true
```      

### Check strings against arrays
`"'AL','FGH','NO'"`
```      
      x='AL' => true
      x='AF' => false
```      
`"AL,FGH,NO"`   works also
```      
      x='AL' => true
      x='AF' => false
```      
`"not('AL','FGH','NO')"`
```      
      x='AL' => false
      x='AF' => true
```      
`"not(AL,FGH,NO)"`
```      
      x='AL' => false
      x='AF' => true
```      
`"!('AL','FGH','NO')"`
```      
      x='AL' => false
      x='AF' => true
```      


### Other interesting implementation I found
[js-feel](https://www.npmjs.com/package/js-feel).


