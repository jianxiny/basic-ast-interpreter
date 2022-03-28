import assert from "assert";
export default (exec) => {
  // variables
  assert.strictEqual(exec.eval(["var", "x", 10]), 10);
  assert.strictEqual(exec.eval("x"), 10);
};
