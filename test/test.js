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
    ["[5.05..10.05],[70..100],-10.56",[
            [5.06, true],
            [85, true],
            [20, false],
            [-10.56, true],
            [-10, false],
            [100, true]
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
    ]
];
var testStrings = [
    ["'AL','FGH','NO'",[
            ['AL', true],
            ['AF', false]
        ]
    ],
    ["not('AL','FGH','NO')",[
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



