'use strict';

var expect = require('chai').expect;
var compiler = require('../index').Compiler;
var check = require('../index').Check;
var checkDirect = require('../index').CheckDirect;

var testDigits = [
    ["< 1.000",[ 
            [-5, true],
            [0.001, true],
            [8, false],
            [10000, false]
        ]
    ],
    [">= 5",[ 
            [4, false],
            [5, true],
            [5.001, true],
            [8, true]
        ]
    ],
    ["<= 5",[ 
            [4, true],
            ['5', true],
            [4.999, true],
            [5.001, false],
            [8, false]
        ]
    ],
    [">= 5.001",[ 
            [5, false],
            [5.001, true],
            [8, true]
        ]
    ],
    ["[5..10]",[ 
            [5, true],
            [10, true],
            [11, false]
        ]
    ],
    ["< 10, [5..100]",[
            [1, true],
            [5, true],
            [100, true],
            [101, false]
        ]
    ],
    ["< 1000, !([5..100])",[
            [-50, true],
            [4, true],
            [5, false],
            [100, false],
            [100.1, true]
        ]
    ],
    ["!([5..100]), < 1000",[
            [-50, true],
            [4, true],
            [5, false],
            [100, false],
            [100.1, true]
        ]
    ],
    ["!([5..100],[200..500])",[
            [-50, true],
            [4, true],
            [5, false],
            [100, false],
            [200, false],
            [600, true]
        ]
    ],
    ["[5.05..10.05],[70..100],-10.56",[
            [5.06, true],
            [85, true],
            [20, false],
            [-10.56, true],
            [-10, false],
            [100, true]
        ]
    ],
    ["[5.05..10.05],[70..100]",[
            [5.05, true],
            [10.05, true],
            [70, true],
            [100, true]
        ]
    ],
    ["]5.05..10.05],[70..100[",[
            [5.05, false],
            [10.05, true],
            [70, true],
            [100, false]
        ]
    ],
    ["[5.05..10.05[,]70..100]",[
            [5.05, true],
            [10.05, false],
            [70, false],
            [100, true]
        ]
    ],
    ["]5.05..10.05[,]70..100[",[
            [5.05, false],
            [10.02, true],
            [10.05, false],
            [70, false],
            [71, true],
            [100, false]
        ]
    ],
    ["not(5,[7..9],12)",[
            [5, false],
            [6, true],
            [7, false],
            [9.05, true],
            [12, false],
            [13, true]
        ]
    ],
    ["not()",[  // all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    [">",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    [">=",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    ["<",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    ["<=",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    ["[5..]",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ],
    ["[..5]",[      // missing parameter - all values are allowed
            [5, true],
            [13, true]
        ]
    ]
];

var testDates = [
    ['< 01.01.2017', [
            ['2015-12-12', true],
            ['2019-03-05', false]
        ]
    ],
    ['< 2017-01-01', [
            ['2015-12-12', true],
            ['2019-03-05', false]
        ]
    ],
    ['25.12.2017', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true]
        ]
    ],
    ['2017-12-25', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true]
        ]
    ],
    ['12/25/2017', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true]
        ]
    ],
    ['2017/12/25', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true]
        ]
    ],
    ['2017/12/25,2017/12/28', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true],
            ['2017-12-28', true],
            ['12/28/2017', true],
            ['2017/12/28', true],
            ['28.12.2017', true]
        ]
    ],
    ['[12/25/2017..12/31/2017]', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true],
            ['2017-12-24', false],
            ['12/24/2017', false],
            ['2017/12/24', false],
            ['24.12.2017', false],
            ['2017-12-31', true],
            ['12/31/2017', true],
            ['2017/12/31', true],
            ['31.12.2017', true]
        ]
    ],
    ['[2017-12-25..2017-12-31]', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true],
            ['2017-12-24', false],
            ['12/24/2017', false],
            ['2017/12/24', false],
            ['24.12.2017', false],
            ['2017-12-31', true],
            ['12/31/2017', true],
            ['2017/12/31', true],
            ['31.12.2017', true]
        ]
    ],
    ['[2017/12/25..2017/12/31]', [
            ['2017-12-25', true],
            ['12/25/2017', true],
            ['2017/12/25', true],
            ['25.12.2017', true],
            ['2017-12-24', false],
            ['12/24/2017', false],
            ['2017/12/24', false],
            ['24.12.2017', false],
            ['2017-12-31', true],
            ['12/31/2017', true],
            ['2017/12/31', true],
            ['31.12.2017', true]
        ]
    ],
    [']2017/12/25..2017/12/31],]2017/03/05..2017/03/07[,[2017/03/12..2017/03/14[', [
            ['2017-12-25', false],
            ['12/25/2017', false],
            ['2017/12/25', false],
            ['25.12.2017', false],
            ['2017-12-24', false],
            ['12/24/2017', false],
            ['2017/12/24', false],
            ['24.12.2017', false],
            ['2017-12-31', true],
            ['12/31/2017', true],
            ['2017/12/31', true],
            ['31.12.2017', true],
            ['05.03.2017', false],
            ['06.03.2017', true],
            ['07.03.2017', false],
            ['12.03.2017', true],
            ['13.03.2017', true],
            ['14.03.2017', false]
        ]
    ],
    ['[01.01.2017..01.01.2018],01.01.2019,[03.01.2019..01.03.2019]', [
            ['12.12.2015', false],
            ['2017-01-01', true],
            ['05.06.2017', true],
            ['2018-02-01', false],
            ['2019-01-01', true],
            ['2019-01-01', true]
        ]
    ],
    ['> 11/03/2017', [
            ['12/01/2017', true],
            ['10/04/2017', false]
        ]
    ],
    ['>=11/03/2017', [
            ['2017-11-03', true],
            ['2017-11-02', false]
        ]
    ],
    ['03.11.2017', [
            ['2017-01-12', false],
            ['2017-11-03', true],
            ['2017-11-03', true]
        ]
    ],
    ['[01.01.2017..01.01.2018]', [
            ['2015-12-12', false],
            ['2017-01-01', true],
            ['2017-06-05', true],
            ['2018-01-01', true],
            ['2019-01-01', false],
            ['2019-03-05', false]
        ]
    ],
    ['[01.01.2017..01.01.2018]', [
            ['2017-01-01', true],
            ['2018-01-01', true]
        ]
    ],
    [']01.01.2017..01.01.2018]', [
            ['2017-01-01', false],
            ['2018-01-01', true]
        ]
    ],
    [']01.01.2017..01.01.2018[', [
            ['2017-01-01', false],
            ['2017-01-02', true],
            ['2018-01-01', false]
        ]
    ],
    ['[01.01.2017..01.01.2018[', [
            ['2017-01-01', true],
            ['2017-12-31', true],
            ['2018-01-01', false]
        ]
    ],
    ['[01.01.2017..01.01.2018[', [
            ['2017-01-01', true],
            ['2017-12-31', true],
            ['2018-01-01', false]
        ]
    ],
    ['!([01.01.2017..01.01.2018])', [
            ['2015-12-12', true],
            ['2017-01-01', false],
            ['2017-06-05', false],
            ['2018-01-01', false],
            ['2019-01-01', true],
            ['2019-03-05', true]
        ]
    ]
];
var testStrings = [
    ["'AL','FGH','NO'",[
            ['AL', true],
            ['AF', false]
        ]
    ],
    ["AL,FGH,NO",[
            ['AL', true],
            ['AF', false]
        ]
    ],
    ["not('AL','FGH','NO')",[
            ['AL', false],
            ['AF', true]
        ]
    ],
    ["not(AL,FGH,NO)",[
            ['AL', false],
            ['AF', true]
        ]
    ],
    ["not ('AL','FGH','NO')",[
            ['AL', false],
            ['AF', true]
        ]
    ],
    ["!  ('AL','FGH','NO')",[
            ['AL', false],
            ['AF', true]
        ]
    ],
    ["!('AL','FGH','NO')",[
            ['AL', false],
            ['AF', true]
        ]
    ],
    ['',[                   //each value is allowed
            ['AL', true],   
            ['AF', true]
        ]
    ]
];

/* 
 * Test Digits
 */
describe('Check Digits', function() {
    for(let i = 0; i < testDigits.length; i++) {
        let t = testDigits[i];
        let condString = t[0];
        describe(condString, function() {
            let values = t[1];
            for (let n = 0; n < values.length; n++) {
                let v = values[n];
                let val = v[0];
                let expected = v[1];
                it('X='+val+' => '+expected, function(done){
                    let cond = compiler(condString);
                    expect(check(val, cond)).to.be.equals(expected);
                    done();
                });
            }
        });
    }
});
/* 
 * Test Dates
 */
describe('Check Dates', function() {
    for(let i = 0; i < testDates.length; i++) {
        let t = testDates[i];
        let condString = t[0];
        describe(condString, function() {
            let values = t[1];
            for (let n = 0; n < values.length; n++) {
                let v = values[n];
                let val = v[0];
                let expected = v[1];
                it('X='+val+' => '+expected, function(done){
                    let cond = compiler(condString);
                    expect(check(val, cond)).to.be.equals(expected);
                    done();
                });
            }
        });
    }
});
/* 
 * Test Strings
 */
describe('Check Strings', function() {
    for(let i = 0; i < testStrings.length; i++) {
        let t = testStrings[i];
        let condString = t[0];
        describe(condString, function() {
            let values = t[1];
            for (let n = 0; n < values.length; n++) {
                let v = values[n];
                let val = v[0];
                let expected = v[1];
                it('X='+val+' => '+expected, function(done){
                    let cond = compiler(condString);
                    expect(check(val, cond)).to.be.equals(expected);
                    done();
                });
            }
        });
    }
});
/* 
 * Test Direct processing
 */
describe('Check direct processing', function() {
    let condString = '<=  5';
    describe(condString, function() {
        let val = 3;
        let expected = true;
        let s = condString;
        it('X='+val+' => '+expected, function(done){
            expect(checkDirect(val, s)).to.be.equals(expected);
            done();
        });
    });
    condString = '>5';
    describe(condString, function() {
        let val = 9;
        let expected = true;
        let s = condString;
        it('X='+val+' => '+expected, function(done){
            expect(checkDirect(val, s)).to.be.equals(expected);
            done();
        });
    });
});



