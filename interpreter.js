import fs from "fs";
import parser from "./parser/parser.js";
import { Environment, GlobalEnvironment } from "./Environment.js";
import path from "path";
import url from "url";

export class Interpreter {
  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  evalGlobal(expressions) {
    return this._evalBody(expressions, this.global);
  }
  eval(exp, env = this.global) {
    if (Number.isSafeInteger(exp)) return exp;
    if (isString(exp)) return exp.slice(1, -1);

    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }

    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    if (exp[0] === "while") {
      const [_tag, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }
    if (exp[0] === "set") {
      const [_, ref, value] = exp;

      if (ref[0] === "prop") {
        const [_tag, instance, propName] = ref;
        const instanceEnv = this.eval(instance, env);

        return instanceEnv.define(propName, this.eval(value, env));
      }
      return env.assign(ref, this.eval(value, env));
    }

    // module
    if (exp[0] === "module") {
      const [_tag, name, body] = exp;

      const moduleEnv = new Environment({}, env);
      this._evalBody(body, moduleEnv);
      return env.define(name, moduleEnv);
    }

    // module import
    if (exp[0] === "import") {
      const [_tag, name] = exp;
      const moduleSrc = fs.readFileSync(
        `${path.dirname(
          url.fileURLToPath(import.meta.url)
        )}/modules/${name}.eva`,
        "utf-8"
      );
      const body = parser.parse(`(begin ${moduleSrc})`);
      const moduleExp = ["module", name, body];
      return this.eval(moduleExp, this.global);
    }

    if (exp[0] === "super") {
      const [_tag, className] = exp;

      return this.eval(className, env).parent;
    }
    // class
    if (exp[0] === "class") {
      const [_tag, name, parent, body] = exp;
      const parentEnv = this.eval(parent, env) || env;
      const classEnv = new Environment({}, parentEnv);

      // Important Body is evaluated in the class environment
      this._evalBody(body, classEnv);

      // Class is accessible by name
      return env.define(name, classEnv);
    }

    if (exp[0] === "prop") {
      const [_tag, instance, name] = exp;

      const instanceEnv = this.eval(instance, env);

      return instanceEnv.lookup(name);
    }

    // new operator
    if (exp[0] === "new") {
      // An instance of a class is an environment!
      // The 'parent' component of the instance environment
      // is set to its class.
      const classEnv = this.eval(exp[1], env);
      const instanceEnv = new Environment({}, classEnv);

      // get fn and args
      const args = exp.slice(2).map((arg) => this.eval(arg, env));

      const fn = classEnv.lookup("constructor");

      this._callUserDefinedFunc(fn, [instanceEnv, ...args]);
      return instanceEnv;
    }

    // Function declaration (def square (x) (* x x ))
    if (exp[0] === "def") {
      const [_tag, name, params, body] = exp;
      const varExp = ["var", name, ["lambda", params, body]];
      return this.eval(varExp, env);
    }

    //Lambda
    if (exp[0] === "lambda") {
      const [_tag, params, body] = exp;
      const fn = {
        params,
        body,
        env, //Closure
      };
      return fn;
    }

    // function call
    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);
      const args = exp.slice(1).map((arg) => {
        return this.eval(arg, env);
      });

      // native function calls
      if (typeof fn === "function") {
        return fn(...args);
      }

      // user defined function

      return this._callUserDefinedFunc(fn, args);
    }
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }
    throw `Unimplementd, ${JSON.stringify(exp)}`;
  }

  _callUserDefinedFunc(fn, args) {
    const activationRecord = {};
    fn.params.forEach((param, index) => {
      activationRecord[param] = args[index];
    });

    // function env
    const activationEnv = new Environment(activationRecord, fn.env);
    return this._evalBody(fn.body, activationEnv);
  }
  _evalBody(body, env) {
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
  }
  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });
    return result;
  }
}

// validators
function isString(exp) {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
  return (
    typeof exp === "string" &&
    /^<=|^>=|^[+\-*/<>=a-zA-Z][a-zA-Z0-9]*$/.test(exp)
  );
}
