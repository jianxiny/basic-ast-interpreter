# A interpreter based on AST build by node

## JUST SUPPORT BASIC TYPE NUMBER STRING AND BOOLEAN

## The core concept is Expression, which means return a value

### RUN TEST

```
node __tests__/run.js
```

### EXAMPLES:

#### variables

```
(begin (var x 10) x) // return 10
```

#### Math operation

```
(+ 1 2) // return 3
```

#### while loop

```
(
  begin
  (var counter 0)

    (var result 0)
    (
      while
      (< counter 10)
      (
        begin
        (set counter (+ counter 1))
        (set result (+ result 1))
      )
    )
    result
)
```

#### IF

```
(
  begin
  (var x 10)
  (var y 0)
  (if (> x 10) (set y 20) (set y 30))
)
```

#### Scope

```
(
  begin
  (var value 10)
  (begin (set value 100))
  value
) // return 100
```

```
(
  begin
  (var value 10)
  (var result (begin (var x (+ value 10)) x))
  result
) // return 20
```

```
(
  (var x 10)
  (var result (begin
    (var x 20)
    (var y 30)
    (+ x y)
  ))
  result
) // return 50
```

#### User function

```
(begin
  (def square (x)
      (* x x))
  (square 2)
) // return 4
```

#### Lambda

```
(begin
     (def onClick (callback)
       (begin
         (var x 10)
         (var y 20)
         (callback (+ x y))
       )
     )
     (onClick (lambda (data) (* data 10)))
   ) // return 300
```

##### IIF: inmediately invoke function

```
((lambda (x) (* x x)) 2) // return 4
```

##### Assign to variable

```
( begin
  (var fn (lambda (x) (* x x)))
  (fn 2)
) // return 4
```

#### Class

```
(
  (class Point null
    (begin
      (def constructor (this x y)
        (begin
          (set (prop this x) x)
          (set (prop this y) y)
        )
      )
      (def calc (this)
        (+ (prop this x) (prop this y))
      )
    )
  )
  (var p (new Point 10 20))
  ((prop p calc) p)
) // return 30
```

##### Inherit

```
(
  (class Point3D Point
    (begin
      (def constructor (this x y z)
        (begin
          ((prop (super Point3D) constructor) this x y)
          (set (prop this z) z)
        )
      )
      (def calc(this)
        (+ ((prop (super Point3D) calc) this) (prop this z))
      )
    )
  )
  (var p (new Point3D 10 20 30))
  ((prop p calc) p)
) // return 60
```

#### Module

```
(
  (module Math
    (begin
        (def abs (value)
            (if (< value 0)
                (- value)
                value
            )
        )
        (def square (x)
            (* x x)
        )
        (var MAX_VALUE 1000)
    )
  )
  ((prop Math abs) (- 10))
) // return 10
```

##### Import

```
(
  (import Math)
  ((prop Math abs) (- 10))
)
```
