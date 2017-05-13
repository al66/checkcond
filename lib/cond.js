'use strict';

var evalCond = function( tokens, cond ) {
    var token = tokens.pop();
    var next = false;
    
    if (token) {
        // not
        token.val.replace(/^,?\s*(?:not|!)\s*\((.*)\)(.*)/g, function( match, $exclude, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if ($exclude.length > 0) tokens.push({"sign":"E", "val":$exclude});
            next = true;
        });
        if (next) return;
        // >=
        token.val.replace(/^,?\s*>=\s*(.*)/g, function( match, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "method":"GE", "val":$rest});
            next = true;
        });
        if (next) return;
        // <=
        token.val.replace(/^,?\s*<=\s*(.*)/g, function( match, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "method":"LE", "val":$rest});
            next = true;
        });
        // >
        token.val.replace(/^,?\s*>\s*(.*)/g, function( match, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "method":"GT", "val":$rest});
            next = true;
        });
        if (next) return;
        // <
        token.val.replace(/^,?\s*<\s*(.*)/g, function( match, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "method":"LT", "val":$rest});
            next = true;
        });
        if (next) return;
        // interval with digits
        token.val.replace(/^,? *\[(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)..(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)\](.*)/g, 
                          function( match, $low, $high, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if ($low.length > 0 && $high.length > 0 ) {
                cond.push({"sign":token.sign, "method":"BT", "low":$low, "high":$high});
            };
            next = true;
        });
        if (next) return;
        // digit at start
        token.val.replace(/^,?(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if (!token.method) token.method = "EQ";
            if ($low.length > 0 ) {
                cond.push({"sign":token.sign, "method":token.method, "low":$low});
            };
            next = true;
        });
        if (next) return;
        // string at start
        token.val.replace(/^,?\s*['"]?(\w+)['"]?(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if ($low.length > 0 ) {
                cond.push({"sign":token.sign, "method":"EQ", "low":$low});
            };
            next = true;
        });
        if (next) return;
    };
};

var compiler = function( condStr) {
    var tokens = [];
    var cond = [];
    // first call - initialize
    if ( cond && cond.length==0 && tokens.length==0 && condStr.length>0 ) {
        tokens.push({"sign":"I", "val":condStr});
    }
    while (tokens && tokens.length>0) {
        evalCond(tokens, cond);
    };
    //console.log('cond:', cond);
    return cond;
};

var check = function(data, cond) {
    var result = false;
    var any = false;
    
    var checkInclude = function(element, index, array) {
        if (element.sign != 'I') return false;
        if (compare(element)) return true;
    };
    var checkExclude = function(element, index, array) {
        if (element.sign != 'E') return false;    
        if (compare(element)) return true;
    };

    var compare = function(single) {
        any = true;
        switch (single.method) {
            case 'EQ':
                return data == single.low;
            case 'GT':
                return data > single.low;
            case 'GE':
                return data >= single.low;
            case 'LT':
                return data < single.low;
            case 'LE':
                return data <= single.low;
            case 'BT':
                return (data >= single.low && data <= single.high);
            default:
                return false;
        }
    };
    
    if (cond.some(checkInclude)) result = true;
    if (!any) result = true; // no include => all values valid;
    if (cond.some(checkExclude)) result = false;
    return result;
};

var process = function(data, condStr) {
    return check(data,compiler(condStr));
};
                 
module.exports.compileCondition = compiler;
module.exports.checkCondition = check;
module.exports.process = process;