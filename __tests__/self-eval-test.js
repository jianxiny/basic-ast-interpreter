import assert from "assert";

export default (exec) => {
  assert.strictEqual(exec.eval(1), 1);
  assert.strictEqual(exec.eval('"hello"'), "hello");
};
