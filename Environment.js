class Environment {
  /**
   * @param {object} record
   */
  constructor(record = {}, parent = null) {
    this.record = record;
    this.parent = parent;
  }

  /*
   * Create a variable with the given name and value
   */
  define(name, value) {
    this.record[name] = value;
    return value;
  }

  assign(name, value) {
    this.resolve(name).record[name] = value;
    return value;
  }
  /*
   * lookup by name or just throws
   */
  lookup(name) {
    const value = this.resolve(name).record[name];
    return value;
  }

  resolve(name) {
    if (this.record.hasOwnProperty(name)) return this;
    if (this.parent == null) {
      throw new ReferenceError(`Variable "${name}" is not defined yet`);
    }

    return this.parent.resolve(name);
  }
}

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: "0.1",

  "+"(op1, op2) {
    return op1 + op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) return -op1;
    return op1 - op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },
  print(...args) {
    console.log(...args);
  },
});
export { Environment, GlobalEnvironment };
