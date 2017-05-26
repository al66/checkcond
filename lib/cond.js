'use strict';

var evalCond = function( tokens, cond ) {
    let token = tokens.pop();
    let next = false;
    
    //if (token) {
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
        // interval with dates format dd.mm.yyyy, dd-mm-yyyy or mm/dd/yyyy 
        token.val.replace(/^,? *([\[,\]])(\d{2}[./-]\d{2}[./-]\d{4})..(\d{2}[./-]\d{2}[./-]\d{4})([\[,\]])(.*)/g, 
                          function( match, $left, $low, $high, $right, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            // convert date
            $low = convertDate($low);
            $high = convertDate($high);
            if ($left == '[' && $right == ']') cond.push({"sign":token.sign, "method":"BT", "low": $low, "high": $high, "date": true });
            if ($left == ']' && $right == ']') cond.push({"sign":token.sign, "method":"BTLE", "low": $low, "high": $high, "date": true });
            if ($left == '[' && $right == '[') cond.push({"sign":token.sign, "method":"BTRE", "low": $low, "high": $high, "date": true });
            if ($left == ']' && $right == '[') cond.push({"sign":token.sign, "method":"BTE", "low": $low, "high": $high, "date": true });
            next = true;
        });
        if (next) return;
        // interval with dates format yyyy/mm/dd or yyyy-mm-dd 
        token.val.replace(/^,? *([\[,\]])(\d{4}[/-]\d{1,2}[/-]\d{1,2})..(\d{4}[/-]\d{1,2}[/-]\d{1,2})([\[,\]])(.*)/g, 
                          function( match, $left, $low, $high, $right, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            // convert date
            $low = convertDate($low);
            $high = convertDate($high);
            if ($left == '[' && $right == ']') cond.push({"sign":token.sign, "method":"BT", "low": $low, "high": $high, "date": true });
            if ($left == ']' && $right == ']') cond.push({"sign":token.sign, "method":"BTLE", "low": $low, "high": $high, "date": true });
            if ($left == '[' && $right == '[') cond.push({"sign":token.sign, "method":"BTRE", "low": $low, "high": $high, "date": true });
            if ($left == ']' && $right == '[') cond.push({"sign":token.sign, "method":"BTE", "low": $low, "high": $high, "date": true });
            next = true;
        });
        if (next) return;
        // date format dd.mm.yyyy or mm/dd/yyyy at start
        token.val.replace(/^,? *(\d{1,2}[./]\d{1,2}[./]\d{4})(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if (!token.method) token.method = "EQ";
            // convert date
            $low = convertDate($low);
            cond.push({"sign":token.sign, "method":token.method, "low": $low , "date": true });
            next = true;
        });
        if (next) return;
        // date format yyyy/mm/dd or yyyy-mm-dd at start
        token.val.replace(/^,? *(\d{4}[/-]\d{1,2}[/-]\d{1,2})(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if (!token.method) token.method = "EQ";
            // convert date
            $low = convertDate($low);
            cond.push({"sign":token.sign, "method":token.method, "low": $low , "date": true });
            next = true;
        });
        if (next) return;
        // interval with digits
        token.val.replace(/^,? *([\[,\]])(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)..(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)([\[,\]])(.*)/g, 
                          function( match, $left, $low, $high, $right, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            //if ($low.length > 0 && $high.length > 0 ) {
            if ($left == '[' && $right == ']') cond.push({"sign":token.sign, "method":"BT", "low":$low, "high":$high});
            if ($left == ']' && $right == ']') cond.push({"sign":token.sign, "method":"BTLE", "low":$low, "high":$high});
            if ($left == '[' && $right == '[') cond.push({"sign":token.sign, "method":"BTRE", "low":$low, "high":$high});
            if ($left == ']' && $right == '[') cond.push({"sign":token.sign, "method":"BTE", "low":$low, "high":$high});
            //};
            next = true;
        });
        if (next) return;
        // digit at start
        token.val.replace(/^,?(-?\d+(?:,\d+)*(?:\.\d+(?:e\d+)?)?)(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            if (!token.method) token.method = "EQ";
            //if ($low.length > 0 ) {
                cond.push({"sign":token.sign, "method":token.method, "low":$low});
            //};
            next = true;
        });
        if (next) return;
        // string at start
        token.val.replace(/^,?\s*['"]?(\w+)['"]?(.*)/g, function( match, $low, $rest, offset, string ){
            if ($rest && $rest.length > 0) tokens.push({"sign":token.sign, "val":$rest});
            //if ($low.length > 0 ) {
                cond.push({"sign":token.sign, "method":"EQ", "low":$low});
            //};
            next = true;
        });
        //if (next) return;
    //};
};

var convertDate = function(dateString) {
    console.log('start parse:', dateString);
    let d = null;
    // convert european date format dd.mm.yyyy to yyyy/mm/dd 
    if (dateString.match(/^\d{1,2}\.\d{1,2}\.\d{4}$/)) {
        d = dateString.split('.');
        d = d.reverse().join('/');
    };
    // convert date format mm/dd/yyyy to yyyy/mm/dd 
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        d = dateString.split('/');
        d = d[2] + '/' + d[0]+ '/' + d[1];
    };
    // convert new format yyyy-mm-dd to yyyy/mm/dd
    if (dateString.match(/^\d{4}\-\d{1,2}\-\d{1,2}$/)) {
        d = dateString.split('-');
        d = d.concat().join('/');
    };
    if (!d) d = dateString;
    console.log('parse:', d);
    return Date.parse(d);    
};

var compiler = function( condStr) {
    let tokens = [];
    let cond = [];
    // first call - initialize
    if ( cond && cond.length==0 && tokens.length==0 && condStr.length>0 ) {
        tokens.push({"sign":"I", "val":condStr});
    }
    while (tokens && tokens.length>0) {
        evalCond(tokens, cond);
    };
    console.log('cond:', cond);
    return cond;
};

var check = function(data, cond) {
    let result = false;
    let any = false;
    
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
        let value = data;
        if (single.date) {
            value = convertDate(data);
        }
        console.log(value, single.low, single.high);
        switch (single.method) {
            case 'EQ':
                return value == single.low;
            case 'GT':
                return value > single.low;
            case 'GE':
                return value >= single.low;
            case 'LT':
                return value < single.low;
            case 'LE':
                return value <= single.low;
            case 'BT':
                return (value >= single.low && value <= single.high);
            case 'BTRE':
                return (value >= single.low && value < single.high);
            case 'BTLE':
                return (value > single.low && value <= single.high);
            case 'BTE':
                return (value > single.low && value < single.high);
            //default:          // code never reached
            //    return false;
        }
    };
    
    if (cond.some(checkInclude)) result = true;
    if (!any) result = true; // no include => all values valid;
    if (cond.some(checkExclude)) result = false;
    return result;
};

var process = function(data, condStr) {
    let cond = compiler(condStr);
    //console.log("process condStr: %s cond:",condStr, cond);
    return check(data, cond);
};
                 
module.exports.compileCondition = compiler;
module.exports.checkCondition = check;
module.exports.processCondition = process;