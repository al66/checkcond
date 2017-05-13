/**
 * @license MIT, imicros.de (c) 2017 Andreas Leinen
 */
'use strict';

/**
 * @description
 *
 * check value against condition string
 *
 */

//--- required modules
const Compiler = require('./lib/cond').compileCondition;
const Check = require('./lib/cond').checkCondition;

module.exports.Compiler = Compiler;
module.exports.Check = Check;