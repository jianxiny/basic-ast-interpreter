import assert from "assert";
import { test } from "./test-util.js";

export default (exec) => {
  //var isUser = true
  assert.strictEqual(exec.eval(["var", "isUser", "true"]), true);
  assert.strictEqual(
    exec.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 30],
    ]),
    230
  );

  // scope
  assert.strictEqual(
    exec.eval(["begin", ["var", "x", 10], ["begin", ["var", "x", 20]], "x"]),
    10
  );
  assert.strictEqual(
    exec.eval([
      "begin",
      ["var", "value", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 10]], "x"]],
      "result",
    ]),
    20
  );
  assert.strictEqual(
    exec.eval([
      "begin",
      ["var", "value", 10],
      ["begin", ["set", "value", 100]],
      "value",
    ]),
    100
  );

  test(
    exec,
    `
      (begin
        (var x 10)
        (var y 20)
        (+ (* x 10) y)
      )
    `,
    120
  );
};
