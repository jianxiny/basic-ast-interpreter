import assert from "assert";
export default (exec) => {
  assert.strictEqual(exec.eval(["+", 1, 2]), 3);
  assert.strictEqual(exec.eval(["+", ["+", 1, 2], 2]), 5);
};
