import { test } from "./test-util.js";

export default (exec) => {
  test(
    exec,
    `(begin
     (def onClick (callback)
       (begin
         (var x 10)
         (var y 20)
         (callback (+ x y))
       )
     )
     (onClick (lambda (data) (* data 10)))
   )`,
    300
  );

  //iif: immediately invoke fuction
  test(exec, `((lambda (x) (* x x)) 2)`, 4);

  // asssign to variable
  test(
    exec,
    `( begin
      (var fn (lambda (x) (* x x)))
      (fn 2)
     )
  `,
    4
  );
};
