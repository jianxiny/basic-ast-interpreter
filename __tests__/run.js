import math from "./math-test.js";
import selfEval from "./self-eval-test.js";
import variables from "./variables.js";
import iftest from "./if-test.js";
import blocks from "./block-test.js";
import buildIn from "./buid-in.js";

import userFunc from "./user-func.test.js";
import lambda from "./lambda.test.js";
import modules from "./modules.test.js";
import imports from "./imports.test.js";
import classes from "./classes.test.js";
import { Interpreter } from "../interpreter.js";

const tests = [
  math,
  selfEval,
  lambda,
  buildIn,
  variables,
  blocks,
  iftest,
  userFunc,
  classes,
  modules,
  imports,
];

//------------------------
// Tests

const exec = new Interpreter();

tests.forEach((t) => t(exec));
console.log("All assertions passed!");
