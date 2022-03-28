import { test } from "./test-util.js";

export default (exec) => {
  test(exec, `(+ 1 5)`, 6);
};
