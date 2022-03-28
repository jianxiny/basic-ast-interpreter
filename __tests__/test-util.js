import assert from "assert";
import parser from "../parser/parser.js";

function test(exec, code, expected) {
  const exp = parser.parse(`(begin ${code})`);
  assert.strictEqual(exec.evalGlobal(exp), expected);
}

export { test };
