import { test } from "./test-util.js";

export default (exec) => {
  test(
    exec,
    `
        (import Math)
        ((prop Math abs) (- 10))
    `,
    10
  );
};
