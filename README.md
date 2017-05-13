# checkcond
check value against condition string

## Usage
```js
const compiler = require('checkcond').compiler;
const check = require('checkcond').check;

let condString = '[7..10]';
let x = 8;
let cond = compiler(condString);
let result = check(x, cond);    // => true
```

## Examples

### Check Digits.
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
`'[5..10]'`
```      
      x=5 => true
      x=10 => true
      x=11 => false
```      
`'< 10, [5..100]'`
```      
      x=1 => true
      x=5 => true
      x=100 => true
      x=101 => false
```      
`'< 1000, !([5..100])'`
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

### Check Strings
`"'AL','FGH','NO'"`
```      
      x='AL' => true
      x='AF' => false
```      
`"not('AL','FGH','NO')"`
```      
      x='AL' => false
      x='AF' => true
```      
`"!('AL','FGH','NO')"`
```      
      x='AL' => false
      x='AF' => true
```      
