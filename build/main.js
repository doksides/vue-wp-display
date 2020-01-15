(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],2:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],3:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],4:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":5}],5:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statsURL = exports.profileURL = exports.authURL = exports.baseURL = void 0;
var baseURL = '/wp-json/wp/v2/';
exports.baseURL = baseURL;
var authURL = '/wp-json/jwt-auth/v1/';
exports.authURL = authURL;
var profileURL = '/wp-json/tous/v1/players';
exports.profileURL = profileURL;
var statsURL = '/wp-json/tous/v1/stats/';
exports.statsURL = statsURL;

},{}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _store = _interopRequireDefault(require("./store.js"));

var _list = _interopRequireDefault(require("./pages/list.js"));

var _detail = _interopRequireDefault(require("./pages/detail.js"));

var _category = _interopRequireDefault(require("./pages/category.js"));

var _scoresheet = _interopRequireDefault(require("./pages/scoresheet.js"));

Vue.filter('abbrv', function (value) {
  if (!value) return '';
  value = value.toString();
  var first = value.charAt(0).toUpperCase();
  var n = value.trim().split(" ");
  var last = n[n.length - 1];
  return first + ". " + last;
});
Vue.filter('firstchar', function (value) {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase();
});
Vue.filter('lowercase', function (value) {
  if (!value) return '';
  value = value.toString();
  return value.toLowerCase();
});
Vue.filter('addplus', function (value) {
  if (!value) return '';
  value = value.toString();
  var n = Math.floor(Number(value));

  if (n !== Infinity && String(n) === value && n > 0) {
    return '+' + value;
  }

  return value;
});
Vue.filter('pretty', function (value) {
  return JSON.stringify(JSON.parse(value), null, 2);
});
var routes = [{
  path: '/tournaments',
  name: 'TourneysList',
  component: _list["default"],
  meta: {
    title: 'NSF Tournaments - Results and Statistics'
  }
}, {
  path: '/tournaments/:slug',
  name: 'TourneyDetail',
  component: _detail["default"],
  meta: {
    title: 'Tournament Details'
  }
}, {
  path: '/tournament/:event_slug',
  name: 'CateDetail',
  component: _category["default"],
  props: true,
  meta: {
    title: 'Results and Statistics'
  }
}, {
  path: '/tournament/:event_slug/:pno',
  name: 'Scoresheet',
  component: _scoresheet["default"],
  meta: {
    title: 'Player Scorecards'
  }
}];
var router = new VueRouter({
  mode: 'history',
  routes: routes // short for `routes: routes`

});
router.beforeEach(function (to, from, next) {
  document.title = to.meta.title;
  next();
});
new Vue({
  el: document.querySelector('#app'),
  router: router,
  store: _store["default"]
});

},{"./pages/category.js":9,"./pages/detail.js":10,"./pages/list.js":11,"./pages/scoresheet.js":16,"./store.js":19,"@babel/runtime/helpers/interopRequireDefault":3}],8:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginForm = exports.ErrorAlert = exports.LoadingAlert = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var LoadingAlert = Vue.component('loading', {
  template: "\n    <div class=\"d-flex flex-column justify-content-center align-items-center max-vw-75 mt-5\">\n\n        <svg class=\"lds-blocks mt-5\" width=\"200px\"  height=\"200px\"  xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\" style=\"background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;\"><rect x=\"19\" y=\"19\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"40\" y=\"19\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.15s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"61\" y=\"19\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.3s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"19\" y=\"40\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"1.05s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"61\" y=\"40\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.44999999999999996s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"19\" y=\"61\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.8999999999999999s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"40\" y=\"61\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.2s\" repeatCount=\"indefinite\" begin=\"0.75s\" calcMode=\"discrete\"></animate>\n      </rect><rect x=\"61\" y=\"61\" width=\"20\" height=\"20\" fill=\"#459448\">\n        <animate attributeName=\"fill\" values=\"#ffffff;#459448;#459448\" keyTimes=\"0;0.125;1\" dur=\"1.1s\" repeatCount=\"indefinite\" begin=\"0.2s\" calcMode=\"discrete\"></animate>\n       </rect></svg>\n       <h4 class=\"display-3 bebas text-center text-secondary\">Loading..\n        <!-- <i class=\"fas fa-spinner fa-pulse\"></i>\n        <span class=\"sr-only\">Loading..</span>\n        -->\n       </h4>\n    </div>"
});
exports.LoadingAlert = LoadingAlert;
var ErrorAlert = Vue.component('error', {
  template: "\n      <div class=\"alert alert-danger mt-5 mx-auto d-block max-vw-75\" role=\"alert\">\n          <h4 class=\"alert-heading text-center\">\n          <slot name=\"error\"></slot>\n          <span class=\"sr-only\">Error...</span>\n          </h4>\n          <div class=\"mx-auto text-center\">\n          <slot name=\"error_msg\"></slot>\n          </div>\n      </div>",
  data: function data() {
    return {};
  }
});
exports.ErrorAlert = ErrorAlert;
var mapGetters = Vuex.mapGetters;
var LoginForm = Vue.component('login', {
  template: "\n   <div class=\"row no-gutters\">\n      <div class=\"col-12 col-lg-10 offset-lg-1 justify-content-center align-items-center\">\n        <div v-if=\"login_success\" class=\"d-flex justify-content-center\">\n          <div class=\"mx-2 py-1\"><i class=\"fas fa-user-alt\"></i> <small>Welcome {{user_display}}</small></div>\n          <div class=\"mx-2 py-1\" @click=\"logOut\"><i style=\"color:tomato\" class=\"fas fa-sign-out-alt \"></i></div>\n        </div>\n        <div v-else>\n          <b-form @submit=\"onSubmit\" inline class=\"w-80 mx-auto\">\n          <b-form-invalid-feedback :state=\"validation\">\n            Your username or password must be more than 1 character in length.\n            </b-form-invalid-feedback>\n          <label class=\"sr-only\" for=\"inline-form-input-username\">Username</label>\n          <b-input\n          id=\"inline-form-input-username\" placeholder=\"Username\" :state=\"validation\"\n          class=\"mb-2 mr-sm-2 mb-sm-0 form-control-sm\"\n          v-model=\"form.user\" >\n          </b-input>\n        <label class=\"sr-only\" for=\"inline-form-input-password\">Password</label>\n          <b-input type=\"password\" id=\"inline-form-input-password\" :state=\"validation\" class=\"form-control-sm\" placeholder=\"Password\" v-model=\"form.pass\"></b-input>\n          </b-input-group>\n            <b-button variant=\"outline-dark\" size=\"sm\" type=\"submit\" class=\"ml-sm-2\">\n            <i  :class=\"{'fa-save' : login_loading == false, 'fa-spinner fa-pulse': login_loading == true}\" class=\"fas\"></i>\n            </b-button>\n          </b-form>\n        </div>\n      </div>\n    </div>\n    ",
  data: function data() {
    return {
      form: {
        pass: '',
        user: ''
      }
    };
  },
  mounted: function mounted() {
    if (this.access.length > 0) {
      this.$store.dispatch('AUTH_TOKEN', this.access);
    }

    console.log(this.user_display);
  },
  methods: {
    onSubmit: function onSubmit(evt) {
      evt.preventDefault();
      console.log(JSON.stringify(this.form));
      this.$store.dispatch('DO_LOGIN', this.form);
    },
    logOut: function logOut() {
      //  logout function
      console.log('Clicked logOut');
    }
  },
  computed: _objectSpread({}, mapGetters({
    login_loading: 'LOGIN_LOADING',
    login_success: 'LOGIN_SUCCESS',
    user_display: 'USER',
    access: 'ACCESS_TOKEN'
  }), {
    validation: function validation() {
      return this.form.user.length > 1 && this.form.pass.length > 1;
    }
  })
});
exports.LoginForm = LoginForm;

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],9:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _playerlist = require("./playerlist.js");

var _alerts = require("./alerts.js");

var _stats = require("./stats.js");

var _profile = _interopRequireDefault(require("./profile.js"));

var _scoreboard = _interopRequireDefault(require("./scoreboard.js"));

var _rating_stats = _interopRequireDefault(require("./rating_stats.js"));

var _top = _interopRequireDefault(require("./top.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CateDetail = Vue.component('cate', {
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div v-if=\"viewIndex !=8 && viewIndex !=5\" class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-center\" >\n                <div class=\"mr-lg-0\">\n                  <b-img fluid class=\"thumbnail logo\" :src=\"logo\" :alt=\"event_title\" />\n                </div>\n                <div class=\"mx-auto\">\n                  <h2 class=\"text-center bebas\">{{ event_title }}\n                  <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n                  </h2>\n                </div>\n              </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><b-icon icon=\"document-text\"></b-icon> Results</b-button>\n                <b-button title=\"Round-By-Round Standings\" @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><b-icon icon=\"list-ol\"></b-icon> Standings</b-button>\n                <b-button title=\"Category Statistics\" @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><b-icon icon=\"bar-chart-fill\"></b-icon> Statistics</b-button>\n                <router-link :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:1}}\">\n                <b-button variant=\"link\" class=\"text-decoration-none\"><b-icon icon=\"documents-alt\"></b-icon> Scorecards</b-button>\n                </router-link>\n                <b-button title=\"Round-By-Round Scoreboard\" @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><b-icon icon=\"display\"></b-icon>\n                Scoreboard</b-button>\n                <b-button title=\"Top 3 Performances\" @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><b-icon icon=\"award\"></b-icon>\n                Top Performers</b-button>\n                <b-button title=\"Post-tourney Rating Statistics\" v-if=\"rating_stats\" @click=\"viewIndex=7\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==7\" :pressed=\"viewIndex==7\">\n                <b-icon icon=\"graph-up\"></b-icon>\n                Rating Stats</b-button>\n                <b-button title=\"Player Profile and Statistics\"  @click=\"viewIndex=8\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==8\" :pressed=\"viewIndex==8\">\n                <b-icon icon=\"trophy\"></b-icon>\n                Profile Stats</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-10 offset-md-1 col-12 justify-content-center align-items-center\">\n            <div class=\"d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n          </div>\n        </div>\n        <template v-if=\"viewIndex==0\">\n          <allplayers :slug=\"slug\"></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-if=\"viewIndex==7\">\n          <ratings :caption=\"caption\" :computed_items=\"computed_rating_items\">\n          </ratings>\n        </template>\n        <template v-if=\"viewIndex==8\">\n           <profiles></profiles>\n        </template>\n        <template v-if=\"viewIndex==5\">\n        <scoreboard :currentRound=\"currentRound\"></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==1\"></pairings>\n                <results :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==2\"></results>\n                <standings :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==3\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert,
    allplayers: _playerlist.PlayerList,
    pairings: _playerlist.Pairings,
    results: _playerlist.Results,
    ratings: _rating_stats["default"],
    standings: _playerlist.Standings,
    hiwins: _stats.HiWins,
    hiloss: _stats.HiLoss,
    lowin: _stats.LoWins,
    comboscores: _stats.ComboScores,
    totalscores: _stats.TotalScores,
    oppscores: _stats.TotalOppScores,
    avescores: _stats.AveScores,
    aveoppscores: _stats.AveOppScores,
    hispread: _stats.HiSpread,
    lospread: _stats.LoSpread,
    // 'luckystiff-table': LuckyStiffTable,
    // 'tuffluck-table': TuffLuckTable
    scoreboard: _scoreboard["default"],
    performers: _top["default"],
    profiles: _profile["default"]
  },
  data: function data() {
    return {
      slug: this.$route.params.event_slug,
      path: this.$route.path,
      tourney_slug: '',
      isActive: false,
      gamedata: [],
      tabIndex: 0,
      viewIndex: 0,
      currentRound: 1,
      tab_heading: '',
      caption: '',
      showPagination: false,
      computed_rating_items: [],
      luckystiff: [],
      tuffluck: [],
      timer: ''
    };
  },
  created: function created() {
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    this.fetchData();
  },
  watch: {
    viewIndex: {
      immediate: true,
      handler: function handler(val) {
        if (val != 4) {
          this.getView(val);
        }
      }
    },
    rating_stats: {
      immediate: true,
      deep: true,
      handler: function handler(val) {
        if (val) {
          this.updateRatingData();
        }
      }
    }
  },
  beforeUpdate: function beforeUpdate() {
    document.title = this.event_title;

    if (this.viewIndex == 4) {
      this.getTabs(this.tabIndex);
    }
  },
  methods: {
    fetchData: function fetchData() {
      this.$store.dispatch('FETCH_DATA', this.slug);
    },
    updateRatingData: function updateRatingData() {
      var resultdata = this.resultdata;

      var data = _.chain(resultdata).last().sortBy('pno').value();

      var items = _.clone(this.rating_stats);

      this.computed_rating_items = _.map(items, function (x) {
        var n = x.pno;

        var p = _.filter(data, function (o) {
          return o.pno == n;
        });

        x.photo = p[0].photo;
        x.position = p[0].position;
        return x;
      });
    },
    getView: function getView(val) {
      console.log('Ran getView function val-> ' + val);

      switch (val) {
        case 0:
          this.showPagination = false;
          this.tab_heading = 'Players';
          this.caption = '';
          break;

        case 1:
          this.showPagination = true;
          this.tab_heading = 'Pairing Round - ';
          this.caption = '*Plays first';
          break;

        case 2:
          this.showPagination = true;
          this.tab_heading = 'Results Round - ';
          this.caption = 'Results';
          break;

        case 3:
          this.showPagination = true;
          this.tab_heading = 'Standings after Round - ';
          this.caption = 'Standings';
          break;

        case 5:
          this.showPagination = true;
          this.tab_heading = null;
          this.caption = null;
          break;

        case 7:
          this.showPagination = false;
          this.tab_heading = 'Post Tournament Rating Statistics';
          this.caption = 'Rating Statistics';
          break;

        default:
          this.showPagination = false;
          this.tab_heading = null;
          this.caption = null;
          break;
      } // return true

    },
    getTabs: function getTabs(val) {
      console.log('Ran getTabs function-> ' + val);

      switch (val) {
        case 0:
          this.showPagination = false;
          this.tab_heading = 'High Winning Scores';
          this.caption = 'High Winning Scores';
          break;

        case 1:
          this.showPagination = false;
          this.tab_heading = 'High Losing Scores';
          this.caption = 'High Losing Scores';
          break;

        case 2:
          this.showPagination = false;
          this.tab_heading = 'Low Winning Scores';
          this.caption = 'Low Winning Scores';
          break;

        case 3:
          this.showPagination = false;
          this.tab_heading = 'Highest Combined Scores';
          this.caption = 'Highest Combined Score per round';
          break;

        case 4:
          this.showPagination = false;
          this.tab_heading = 'Total Scores';
          this.caption = 'Total Player Scores Statistics';
          break;

        case 5:
          this.showPagination = false;
          this.tab_heading = 'Total Opponent Scores';
          this.caption = 'Total Opponent Scores Statistics';
          break;

        case 6:
          this.showPagination = false;
          this.tab_heading = 'Average Scores';
          this.caption = 'Ranking by Average Player Scores';
          break;

        case 7:
          this.showPagination = false;
          this.tab_heading = 'Average Opponent Scores';
          this.caption = 'Ranking by Average Opponent Scores';
          break;

        case 8:
          this.showPagination = false;
          this.tab_heading = 'High Spreads';
          this.caption = 'Highest Spread per round ';
          break;

        case 9:
          this.showPagination = false;
          this.tab_heading = 'Low Spreads';
          this.caption = 'Lowest Spreads per round';
          break;

        case 10:
          this.showPagination = false;
          this.tab_heading = 'Lucky Stiffs';
          this.caption = 'Lucky Stiffs (frequent low margin/spread winners)';
          break;

        case 11:
          this.showPagination = false;
          this.tab_heading = 'Tuff Luck';
          this.caption = 'Tuff Luck (frequent low margin/spread losers)';
          break;

        default:
          this.showPagination = false;
          this.tab_heading = 'Select a Tab';
          this.caption = '';
          break;
      } // return true

    },
    roundChange: function roundChange(page) {
      console.log(page); // console.log(this.currentRound);

      this.currentRound = page;
    },
    cancelAutoUpdate: function cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchStats: function fetchStats(key) {
      var lastRdData = this.resultdata[this.total_rounds - 1];
      return _.sortBy(lastRdData, key).reverse();
    },
    tufflucky: function tufflucky() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'win';
      // method runs both luckystiff and tuffluck tables
      var data = this.resultdata; //JSON.parse(this.event_data.results);

      var players = _.map(this.players, 'post_title');

      var lsdata = [];

      var highsix = _.chain(players).map(function (n) {
        var res = _.chain(data).map(function (list) {
          return _.chain(list).filter(function (d) {
            return d['player'] === n && d['result'] === result;
          }).value();
        }).flattenDeep().sortBy('diff').value();

        if (result === 'win') {
          return _.first(res, 6);
        }

        return _.takeRight(res, 6);
      }).filter(function (n) {
        return n.length > 5;
      }).value();

      _.map(highsix, function (h) {
        var lastdata = _.takeRight(data);

        var diff = _.chain(h).map('diff').map(function (n) {
          return Math.abs(n);
        }).value();

        var name = h[0]['player'];

        var sum = _.reduce(diff, function (memo, num) {
          return memo + num;
        }, 0);

        var player_data = _.find(lastdata, {
          player: name
        });

        var mar = player_data['margin'];
        var won = player_data['points'];
        var loss = player_data['round'] - won; // push values into lsdata array

        lsdata.push({
          player: name,
          spread: diff,
          sum_spread: sum,
          cummulative_spread: mar,
          won_loss: "".concat(won, " - ").concat(loss)
        });
      });

      return _.sortBy(lsdata, 'sum_spread');
    },
    toNextRd: function toNextRd() {
      var x = this.total_rounds;
      var n = this.currentRound + 1;

      if (n <= x) {
        this.currentRound = n;
      }
    },
    toPrevRd: function toPrevRd() {
      var n = this.currentRound - 1;

      if (n >= 1) {
        this.currentRound = n;
      }
    },
    toFirstRd: function toFirstRd() {
      if (this.currentRound != 1) {
        this.currentRound = 1;
      }
    },
    toLastRd: function toLastRd() {
      // console.log(' going to last round')
      if (this.currentRound != this.total_rounds) {
        this.currentRound = this.total_rounds;
      }
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    resultdata: 'RESULTDATA',
    rating_stats: 'RATING_STATS',
    event_data: 'EVENTSTATS',
    error: 'ERROR',
    loading: 'LOADING',
    category: 'CATEGORY',
    total_rounds: 'TOTAL_ROUNDS',
    parent_slug: 'PARENTSLUG',
    event_title: 'EVENT_TITLE',
    tourney_title: 'TOURNEY_TITLE',
    logo: 'LOGO_URL'
  }), {
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'NSF News',
        href: '/'
      }, {
        text: 'Tournaments',
        to: {
          name: 'TourneysList'
        }
      }, {
        text: this.tourney_title,
        to: {
          name: 'TourneyDetail',
          params: {
            slug: this.tourney_slug
          }
        }
      }, {
        // text: _.capitalize(this.category),
        text: "".concat(_.capitalize(this.category), " - Results and Stats"),
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.path, " ");
    }
  })
}); // export default CateDetail;

exports["default"] = CateDetail;

},{"./alerts.js":8,"./playerlist.js":12,"./profile.js":13,"./rating_stats.js":14,"./scoreboard.js":15,"./stats.js":17,"./top.js":18,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],10:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _alerts = require("./alerts.js");

var _config = _interopRequireDefault(require("../config.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// let LoadingAlert, ErrorAlert;
var tDetail = Vue.component('tdetail', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n          <loading></loading>\n        </div>\n        <div v-else class=\"col-12 justify-content-center align-self-center\">\n          <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <div class=\"p-5 text-center d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start\">\n            <b-img slot=\"aside\" vertical-align=\"center\" class=\"align-self-center mr-3 rounded img-fluid\"\n              :src=\"tourney.event_logo\" width=\"150\" height=\"150\" :alt=\"tourney.event_logo_title\" />\n            <h4 class=\"mx-1 display-4\">\n              {{tourney.title}}\n            </h4>\n          </div>\n          <div class=\"p-5 d-flex flex-column justify-content-center align-items-center\">\n            <ul class=\"list-inline text-center\" id=\"event-details\">\n              <li class=\"list-inline-item\" v-if=\"tourney.start_date\"><i class=\"fa fa-calendar\"></i>\n                {{tourney.start_date}}</li>\n              <li class=\"list-inline-item\" v-if=\"tourney.venue\"><i class=\"fa fa-map-marker\"></i> {{tourney.venue}}</li>\n              <li v-if=\"tourney.tournament_director\"><i class=\"fa fa-legal\"></i>\n                {{tourney.tournament_director}}</li>\n            </ul>\n            <h5>\n              Categories <i class=\"fa fa-list\" aria-hidden=\"true\"></i>\n            </h5>\n            <ul class=\"list-inline text-center cate-list\">\n              <li v-for=\"(cat, c) in tourney.tou_categories\" :key=\"c\" class=\"list-inline-item\">\n                <template v-if=\"cat.event_id\">\n                  <router-link :to=\"{ name: 'CateDetail', params: { slug: tourney.slug , event_slug:cat.event_slug}}\">\n                    <span>{{cat.cat_name}}</span>\n                  </router-link>\n                </template>\n                <template v-else>\n                  <span>{{cat.cat_name}}</span>\n                </template>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n       ",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert
  },
  data: function data() {
    return {
      slug: this.$route.params.slug,
      path: this.$route.path,
      pageurl: "".concat(_config["default"], "tournament") + this.$route.path
    };
  },
  beforeUpdate: function beforeUpdate() {
    document.title = "Tournament: ".concat(this.tourney.title);
  },
  created: function created() {
    this.fetchData();
  },
  methods: {
    fetchData: function fetchData() {
      var _this = this;

      if (this.tourney.slug != this.slug) {
        // reset title because of breadcrumbs
        this.tourney.title = '';
      }

      var e = this.toulist.find(function (event) {
        return event.slug === _this.slug;
      });

      if (e) {
        var now = moment();
        var a = moment(this.last_access_time);
        var time_elapsed = now.diff(a, 'seconds');

        if (time_elapsed < 300) {
          console.log('-------Match Found in Tourney List----------');
          console.log(e);
          console.log(time_elapsed);
          this.tourney = e;
        } else {
          this.$store.dispatch('FETCH_DETAIL', this.slug);
        }
      } else {
        this.$store.dispatch('FETCH_DETAIL', this.slug);
      }
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    // tourney: 'DETAIL',
    error: 'ERROR',
    loading: 'LOADING',
    last_access_time: 'TOUACCESSTIME',
    toulist: 'TOUAPI'
  }), {
    tourney: {
      get: function get() {
        return this.$store.getters.DETAIL;
      },
      set: function set(newVal) {
        this.$store.commit('SET_EVENTDETAIL', newVal);
      }
    },
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'NSF News',
        href: '/'
      }, {
        text: 'Tournaments',
        to: {
          name: 'TourneysList'
        }
      }, {
        text: this.tourney.title,
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues. Please refresh to try again ";
    }
  })
});
var _default = tDetail;
exports["default"] = _default;

},{"../config.js":6,"./alerts.js":8,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],11:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _alerts = require("./alerts.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mapGetters = Vuex.mapGetters; // let LoadingAlert, ErrorAlert;

var scrList = Vue.component('scrList', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n            <h2 class=\"bebas text-center\">\n                <i class=\"fa fa-trophy\"></i> Tournaments\n            </h2>\n        </div>\n      </div>\n      <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                        :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n              <p class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages; <span class=\"emphasize\">{{WPtotal}}</span> tournaments!</p>\n            </div>\n        </div>\n        <div class=\"row\">\n        <div  class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\" :key=\"item.id\">\n        <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft\" >\n          <div class=\"mr-lg-5\">\n            <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n              <b-img fluid class=\"thumbnail\"\n                  :src=\"item.event_logo\" width=\"100\"  height=\"100\" :alt=\"item.event_logo_title\" />\n            </router-link>\n          </div>\n          <div class=\"mr-lg-auto\">\n            <h4 class=\"mb-1 display-5\">\n            <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                {{item.title}}\n            </router-link>\n            </h4>\n            <div class=\"text-center\">\n            <div class=\"d-inline p-1\">\n                <small><i class=\"fa fa-calendar\"></i>\n                    {{item.start_date}}\n                </small>\n            </div>\n          <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-map-marker\"></i>\n                  {{item.venue}}\n              </small>\n          </div>\n          <div class=\"d-inline p-1\">\n              <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                  <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                  </small>\n              </router-link>\n          </div>\n          <ul class=\"list-unstyled list-inline text-center category-list\">\n              <li class=\"list-inline-item mx-auto\"\n              v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n          </ul>\n          </div>\n          </div>\n        </div>\n       </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 d-flex flex-column justify-content-lg-end\">\n          <p class=\"my-0 py-0\"><small class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages with <span class=\"emphasize\">{{WPtotal}}</span>\n          tournaments!</small></p>\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                  :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n        </div>\n      </div>\n   </template>\n</div>\n",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert
  },
  data: function data() {
    return {
      path: this.$route.path,
      currentPage: 1
    };
  },
  created: function created() {
    console.log('List.js loaded');
    document.title = 'Scrabble Tournaments - NSF';
    this.fetchList(this.currentPage);
  },
  methods: {
    fetchList: function fetchList(pageNum) {
      //this.$store.dispatch('FETCH_API', pageNum, {
      // timeout: 3600000 //1 hour cache
      // });
      this.currentRound = pageNum;
      this.$store.dispatch('FETCH_API', pageNum);
      console.log('done!');
    }
  },
  computed: _objectSpread({}, mapGetters({
    tourneys: 'TOUAPI',
    error: 'ERROR',
    loading: 'LOADING',
    WPtotal: 'WPTOTAL',
    WPpages: 'WPPAGES'
  }), {
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'NSF News',
        href: '/'
      }, {
        text: 'Tournaments',
        active: true,
        to: {
          name: 'TourneysList'
        }
      }];
    },
    error_msg: function error_msg() {
      return "Sorry we are currently having trouble finding the list of tournaments.";
    }
  })
});
var _default = scrList;
exports["default"] = _default;

},{"./alerts.js":8,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],12:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Results = exports.PlayerList = exports.Standings = exports.Pairings = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var player_mixed_series = [{
  name: '',
  data: []
}];
var player_rank_series = [{
  name: '',
  data: []
}];
var player_radial_chart_series = [];
var player_radial_chart_config = {
  plotOptions: {
    radialBar: {
      hollow: {
        size: '50%'
      }
    }
  },
  colors: [],
  labels: []
};
var player_rank_chart_config = {
  chart: {
    height: 400,
    zoom: {
      enabled: false
    },
    shadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 1
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true
  },
  stroke: {
    curve: 'smooth' // straight

  },
  title: {
    text: '',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'],
      // takes an array which will be repeated on columns
      opacity: 0.5
    }
  },
  xaxis: {
    categories: [],
    title: {
      text: 'Rounds'
    }
  },
  yaxis: {
    title: {
      text: ''
    },
    min: null,
    max: null
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
};
var PlayerStats = Vue.component('playerstats', {
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <div class=\"animated fadeInLeftBig\" id=\"pheader\">\n          <div class=\"d-flex align-items-center align-content-center justify-content-center mt-5\">\n            <div>\n              <h4 class=\"text-center bebas\">{{playerName}}\n                <span class=\"d-block mx-auto\" style=\"font-size:small\">\n                  <i class=\"mx-3 flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\"\n                    :title=\"player.country_full\"></i>\n                  <i class=\"mx-3 fa\" :class=\"{'fa-male': player.gender == 'm',\n                   'fa-female': player.gender == 'f','fa-users': player.is_team == 'yes' }\" aria-hidden=\"true\">\n                  </i>\n                </span>\n              </h4>\n            </div>\n            <div>\n              <img width=\"100px\" height=\"100px\" class=\"img-thumbnail img-fluid mx-3 d-block shadow-sm\"\n                :src=\"player.photo\" />\n            </div>\n            <div>\n              <h4 class=\"text-center yanone mx-3\">{{pstats.pPosition}} position</h4>\n            </div>\n          </div>\n        </div> <!-- #pheader-->\n\n        <div class=\"d-flex align-items-center align-content-center justify-content-center\">\n          <b-btn v-b-toggle.collapse1 class=\"m-1\">Quick Stats</b-btn>\n          <b-btn v-b-toggle.collapse2 class=\"m-1\">Round by Round </b-btn>\n          <b-btn v-b-toggle.collapse3 class=\"m-1\">Charts</b-btn>\n          <b-button title=\"Close\" size=\"sm\" @click=\"closeCard()\" class=\"m-1\" variant=\"outline-danger\" :disabled=\"!show\"\n            :pressed.sync=\"show\"><i class=\"fas fa-times\"></i></b-button>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <b-collapse id=\"collapse1\">\n          <b-card class=\"animated flipInX\">\n            <div class=\"card-header text-center\">Quick Stats</div>\n            <ul class=\"list-group list-group-flush stats\">\n              <li class=\"list-group-item\">Points:\n                <span>{{pstats.pPoints}} / {{total_rounds}}</span>\n              </li>\n              <li class=\"list-group-item\">Rank:\n                <span>{{pstats.pRank}} </span>\n              </li>\n              <li class=\"list-group-item\">Highest Score:\n                <span>{{pstats.pHiScore}}</span> (rd <em>{{pstats.pHiScoreRounds}}</em>)\n              </li>\n              <li class=\"list-group-item\">Lowest Score:\n                <span>{{pstats.pLoScore}}</span> (rd <em>{{pstats.pLoScoreRounds}}</em>)\n              </li>\n              <li class=\"list-group-item\">Ave Score:\n                <span>{{pstats.pAve}}</span>\n              </li>\n              <li class=\"list-group-item\">Ave Opp Score:\n                <span>{{pstats.pAveOpp}}</span>\n              </li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!---- Round By Round Results -->\n        <b-collapse id=\"collapse2\">\n          <b-card class=\"animated fadeInUp\">\n            <h4>Round By Round Summary </h4>\n            <ul class=\"list-group list-group-flush\" v-for=\"(report, i) in pstats.pRbyR\" :key=\"i\">\n              <li v-html=\"report.report\" v-if=\"report.result=='win'\" class=\"list-group-item list-group-item-success\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='draw'\"\n                class=\"list-group-item list-group-item-warning\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='loss'\"\n                class=\"list-group-item list-group-item-danger\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='awaiting'\" class=\"list-group-item list-group-item-info\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else class=\"list-group-item list-group-item-light\">{{report.report}}</li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!-- Charts -->\n        <b-collapse id=\"collapse3\">\n          <b-card class=\"animated fadeInDown\">\n            <div class=\"card-header text-center\">Stats Charts</div>\n            <div class=\"d-flex align-items-center justify-content-center\">\n              <div>\n                <b-button @click=\"updateChart('mixed')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='mixed'\" :pressed=\"chartModel=='mixed'\"><i class=\"fas fa-file-csv\"\n                    aria-hidden=\"true\"></i> Mixed Scores</b-button>\n                <b-button @click=\"updateChart('rank')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='rank'\" :pressed=\"chartModel=='rank'\"><i class=\"fas fa-chart-line\"\n                    aria-hidden=\"true\"></i> Rank per Rd</b-button>\n                <b-button @click=\"updateChart('wins')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='wins'\" :pressed=\"chartModel=='wins'\"><i class=\"fas fa-balance-scale fa-stack\"\n                    aria-hidden=\"true\"></i> Starts/Replies Wins(%)</b-button>\n              </div>\n            </div>\n            <div id=\"chart\">\n              <apexchart v-if=\"chartModel=='mixed'\" type=line height=400 :options=\"chartOptions\"\n                :series=\"seriesMixed\" />\n              <apexchart v-if=\"chartModel=='rank'\" type='line' height=400 :options=\"chartOptionsRank\"\n                :series=\"seriesRank\" />\n              <apexchart v-if=\"chartModel=='wins'\" type=radialBar height=400 :options=\"chartOptRadial\"\n                :series=\"seriesRadial\" />\n            </div>\n          </b-card>\n        </b-collapse>\n      </div>\n    </div>\n  </div>\n  ",
  props: ['pstats'],
  components: {
    apexchart: VueApexCharts
  },
  data: function data() {
    return {
      player: '',
      show: true,
      playerName: '',
      allScores: [],
      allOppScores: [],
      allRanks: [],
      total_players: null,
      chartModel: 'rank',
      seriesMixed: player_mixed_series,
      seriesRank: player_rank_series,
      seriesRadial: player_radial_chart_series,
      chartOptRadial: player_radial_chart_config,
      chartOptionsRank: player_rank_chart_config,
      chartOptions: {
        chart: {
          height: 400,
          zoom: {
            enabled: false
          },
          shadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.5
          }
        },
        colors: ['#8FBC8F', '#545454'],
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight' // smooth

        },
        title: {
          text: '',
          align: 'left'
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Rounds'
          }
        },
        yaxis: {
          title: {
            text: ''
          },
          min: null,
          max: null
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        }
      }
    };
  },
  mounted: function mounted() {
    this.doScroll();
    console.log(this.seriesRadial);
    this.show = this.showStats;
    this.allScores = _.flatten(this.pstats.allScores);
    this.allOppScores = _.flatten(this.pstats.allOppScores);
    this.allRanks = _.flatten(this.pstats.allRanks);
    this.updateChart(this.chartModel);
    this.total_players = this.players.length;
    this.player = this.pstats.player[0];
    this.playerName = this.player.post_title;
  },
  beforeDestroy: function beforeDestroy() {
    this.closeCard();
  },
  methods: {
    doScroll: function doScroll() {
      // When the user scrolls the page, execute myFunction
      window.onscroll = function () {
        myFunction();
      }; // Get the header


      var header = document.getElementById("pheader"); // Get the offset position of the navbar

      var sticky = header.offsetTop;
      var h = header.offsetHeight + 50; // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position

      function myFunction() {
        if (window.pageYOffset > sticky + h) {
          header.classList.add("sticky");
        } else {
          header.classList.remove("sticky");
        }
      }
    },
    setChartCategories: function setChartCategories() {
      var rounds = _.range(1, this.total_rounds + 1);

      var rds = _.map(rounds, function (num) {
        return 'Rd ' + num;
      });

      this.chartOptions.xaxis.categories = rds;
    },
    updateChart: function updateChart(type) {
      //console.log('-------------Updating..-----------------------');
      this.chartModel = type;
      this.chartOptions.title.align = 'left';

      var firstName = _.trim(_.split(this.playerName, ' ', 2)[0]);

      if ('rank' == type) {
        // this. = 'bar';
        this.chartOptionsRank.title.text = "Ranking: ".concat(this.playerName);
        this.chartOptionsRank.yaxis.min = 0;
        this.chartOptionsRank.yaxis.max = this.total_players;
        this.seriesRank = [{
          name: "".concat(firstName, " rank this rd"),
          data: this.allRanks
        }];
      }

      if ('mixed' == type) {
        this.setChartCategories();
        this.chartOptions.title.text = "Scores: ".concat(this.playerName);
        this.chartOptions.yaxis.min = 100;
        this.chartOptions.yaxis.max = 900;
        this.seriesMixed = [{
          name: "".concat(firstName),
          data: this.allScores
        }, {
          name: 'Opponent',
          data: this.allOppScores
        }];
      }

      if ('wins' == type) {
        this.chartOptRadial.labels = [];
        this.chartOptRadial.colors = [];
        this.chartOptRadial.labels.unshift('Starts: % Wins', 'Replies: % Wins');
        this.chartOptRadial.colors.unshift('#7CFC00', '#BDB76B');
        console.log(this.chartOptRadial);

        var s = _.round(100 * (this.pstats.startWins / this.pstats.starts), 1);

        var r = _.round(100 * (this.pstats.replyWins / this.pstats.replies), 1);

        this.seriesRadial = [];
        this.seriesRadial.unshift(s, r);
        console.log(this.seriesRadial);
      }
    },
    closeCard: function closeCard() {
      // console.log('----------Closing Card--------------------------');
      this.$store.dispatch('DO_STATS', false);
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    total_rounds: 'TOTAL_ROUNDS',
    players: 'PLAYERS',
    showStats: 'SHOWSTATS'
  }))
});
var PlayerList = Vue.component('allplayers', {
  template: "\n  <div class=\"row justify-content-center align-items-center\">\n    <template v-if=\"showStats\">\n        <playerstats :pstats=\"pStats\"></playerstats>\n    </template>\n    <template v-else>\n    <div id=\"p-list\" class=\"col-12\">\n    <transition-group tag=\"div\" name=\"players-list\">\n    <div class=\"playerCols mx-2 p-2 mb-4\" v-for=\"player in data\" :key=\"player.id\">\n        <div class=\"d-flex flex-column\">\n            <h5 class=\"oswald\"><small>#{{player.pno}}</small>\n            {{player.player}}<span class=\"ml-2\" @click=\"sortPos()\" style=\"cursor: pointer; font-size:0.8em\"><i v-if=\"asc\" class=\"fa fa-sort-numeric-down\" aria-hidden=\"true\" title=\"Click to sort DESC by current rank\"></i><i v-else class=\"fa fa-sort-numeric-up\" aria-hidden=\"true\" title=\"Click to sort ASC by current rank\"></i></span><span v-if=\"sorted\" class=\"ml-3\" @click=\"restoreSort()\" style=\"cursor: pointer; font-size:0.8em\"><i class=\"fa fa-undo\" aria-hidden=\"true\" title=\"Click to reset list\"></i></span>\n            <span class=\"d-block mx-auto my-1\"  style=\"font-size:small\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\" :title=\"player.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': player.gender == 'm',\n        'fa-female': player.gender == 'f',\n        'fa-users': player.is_team == 'yes' }\"\n                    aria-hidden=\"true\"></i>\n              <span style=\"color:tomato; font-size:1.4em\" class=\"ml-5\" v-if=\"sorted\">{{player.position}}</span>\n             </span>\n            </h5>\n            <div class=\"d-block text-center animated fadeIn pgallery\">\n              <b-img-lazy v-bind=\"imgProps\" :alt=\"player.player\" :src=\"player.photo\" :id=\"'popover-'+player.id\"></b-img-lazy>\n              <div class=\"d-block mt-2 mx-auto\">\n              <span @click=\"showPlayerStats(player.id)\" title=\"Show  stats\">\n              <i class=\"fas fa-chart-bar\" aria-hidden=\"true\"></i>\n              </span>\n              <span class=\"ml-4\" title=\"Show Scorecard\">\n                  <router-link exact :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:player.pno}}\">\n                  <i class=\"fas fa-clipboard\" aria-hidden=\"true\"></i>\n                  </router-link>\n              </span>\n              </div>\n              <!---popover -->\n              <b-popover @show=\"getLastGames(player.pno)\" placement=\"bottom\"  :target=\"'popover-'+player.id\" triggers=\"hover\" boundary-padding=\"5\">\n              <div class=\"d-flex flex-row justify-content-center\">\n                <div class=\"d-flex flex-column flex-wrap align-content-between align-items-start mr-2 justify-content-around\">\n                  <span class=\"flex-grow-1 align-self-center\" style=\"font-size:1.5em;\">{{mstat.position}}</span>\n                  <span class=\"flex-shrink-1 d-inline-block text-muted\"><small>{{mstat.wins}}-{{mstat.draws}}-{{mstat.losses}}</small></span>\n                </div>\n                <div class=\"d-flex flex-column flex-wrap align-content-center\">\n                <span class=\"text-primary d-inline-block\" style=\"font-size:0.8em; text-decoration:underline\">Last Game: Round {{mstat.round}}</span>\n                    <span class=\"d-inline-block p-1 text-white sdata-res text-center\"\n                      v-bind:class=\"{'bg-warning': mstat.result === 'draw',\n                          'bg-info': mstat.result === 'awaiting',\n                          'bg-danger': mstat.result === 'loss',\n                          'bg-success': mstat.result === 'win' }\">\n                          {{mstat.score}}-{{mstat.oppo_score}} ({{mstat.result|firstchar}})\n                    </span>\n                    <div>\n                    <img :src=\"mstat.opp_photo\" :alt=\"mstat.oppo\" class=\"rounded-circle m-auto d-inline-block\" width=\"25\" height=\"25\">\n                    <span class=\"text-info d-inline-block\" style=\"font-size:0.9em\"><small>#{{mstat.oppo_no}} {{mstat.oppo|abbrv}}</small></span>\n                    </div>\n                </div>\n              </div>\n              </b-popover>\n          </div>\n          </div>\n         </div>\n         </transition-group>\n        </div>\n      </template>\n    </div>\n    ",
  components: {
    playerstats: PlayerStats
  },
  props: ['slug'],
  data: function data() {
    return {
      pStats: {},
      imgProps: {
        center: true,
        block: true,
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '70px',
        height: '70px',
        style: 'cursor: pointer',
        "class": 'shadow-sm'
      },
      dataFlat: {},
      mstat: {},
      data: {},
      sorted: false,
      asc: true
    };
  },
  beforeMount: function beforeMount() {
    var resultdata = this.result_data;
    this.dataFlat = _.flattenDeep(_.clone(resultdata));
    this.data = _.chain(resultdata).last().sortBy('pno').value();
    console.log('-----------DATA-------------------------');
    console.log(this.data);
  },
  methods: {
    getLastGames: function getLastGames(tou_no) {
      console.log(tou_no);

      var c = _.clone(this.dataFlat);

      var res = _.chain(c).filter(function (v) {
        return v.pno === tou_no;
      }).takeRight().value();

      this.mstat = _.first(res); // console.log(this.mstat)
    },
    sortPos: function sortPos() {
      this.sorted = true;
      this.asc = !this.asc;
      console.log('Sorting..');
      var sortDir = 'asc';

      if (false == this.asc) {
        sortDir = 'desc';
      }

      var sorted = _.orderBy(this.data, 'rank', sortDir);

      console.log(sorted);
      this.data = sorted;
    },
    restoreSort: function restoreSort() {
      this.sorted = false;
      this.asc = true;
      this.data = _.orderBy(this.data, 'pno', 'asc');
    },
    showPlayerStats: function showPlayerStats(id) {
      this.$store.commit('COMPUTE_PLAYER_STATS', id);
      this.pStats.player = this.player;
      this.pStats.pAveOpp = this.lastdata.ave_opp_score;
      this.pStats.pAve = this.lastdata.ave_score;
      this.pStats.pRank = this.lastdata.rank;
      this.pStats.pPosition = this.lastdata.position;
      this.pStats.pPoints = this.lastdata.points;
      this.pStats.pHiScore = this.player_stats.pHiScore;
      this.pStats.pLoScore = this.player_stats.pLoScore;
      this.pStats.pHiOppScore = this.player_stats.pHiOppScore;
      this.pStats.pLoOppScore = this.player_stats.pLoOppScore;
      this.pStats.pHiScoreRounds = this.player_stats.pHiScoreRounds;
      this.pStats.pLoScoreRounds = this.player_stats.pLoScoreRounds;
      this.pStats.allRanks = this.player_stats.allRanks;
      this.pStats.allScores = this.player_stats.allScores;
      this.pStats.allOppScores = this.player_stats.allOppScores;
      this.pStats.pRbyR = this.player_stats.pRbyR;
      this.pStats.startWins = this.player_stats.startWins;
      this.pStats.starts = this.player_stats.starts;
      this.pStats.replyWins = this.player_stats.replyWins;
      this.pStats.replies = this.player_stats.replies;
      this.$store.dispatch('DO_STATS', true);
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    showStats: 'SHOWSTATS',
    lastdata: 'LASTRDDATA',
    playerdata: 'PLAYERDATA',
    player: 'PLAYER',
    player_stats: 'PLAYER_STATS'
  }))
});
exports.PlayerList = PlayerList;
var Results = Vue.component('results', {
  template: "\n    <b-table hover stacked=\"sm\" striped foot-clone :fields=\"results_fields\" :items=\"result(currentRound)\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      results_fields: []
    };
  },
  created: function created() {
    this.results_fields = [{
      key: 'rank',
      label: '#',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      sortable: true
    }, // { key: 'position',label: 'Position','class':'text-center'},
    {
      key: 'score',
      label: 'Score',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return 'AR';
        } else {
          return item.score;
        }
      }
    }, {
      key: 'oppo',
      label: 'Opponent'
    }, // { key: 'opp_position', label: 'Position','class': 'text-center'},
    {
      key: 'oppo_score',
      label: 'Score',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return 'AR';
        } else {
          return item.oppo_score;
        }
      }
    }, {
      key: 'diff',
      label: 'Spread',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value, key, item) {
        if (item.oppo_score == 0 && item.score == 0) {
          return '-';
        }

        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  },
  methods: {
    result: function result(r) {
      var round = r - 1;

      var data = _.clone(this.resultdata[round]);

      _.forEach(data, function (r) {
        var opp_no = r['oppo_no']; // Find where the opponent's current position and add to collection

        var row = _.find(data, {
          pno: opp_no
        });

        r['opp_position'] = row.position; // check result (win, loss, draw)

        var result = r.result;
        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'info';

        if (result === 'draw') {
          r['_cellVariants']['lastGame'] = 'warning';
        }

        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }

        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }
      });

      return _.chain(data).sortBy('margin').sortBy('points').value().reverse();
    }
  }
});
exports.Results = Results;
var Standings = Vue.component('standings', {
  template: "\n    <b-table responsive stacked=\"sm\" hover striped foot-clone :items=\"result(currentRound)\" :fields=\"standings_fields\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template>\n            <template slot=\"rank\" slot-scope=\"data\">\n            {{data.value.rank}}\n            </template>\n            <template slot=\"player\" slot-scope=\"data\">\n            {{data.value.player}}\n            </template>\n            <template slot=\"wonLost\"></template>\n            <template slot=\"margin\" slot-scope=\"data\">\n            {{data.value.margin}}\n            </template>\n            <template slot=\"lastGame\">\n            </template>\n        </template>\n    </b-table>\n   ",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      standings_fields: [],
      imgProps: {
        rounded: 'circle',
        center: true,
        block: true,
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        width: '25px',
        height: '25px',
        "class": 'shadow-sm'
      }
    };
  },
  mounted: function mounted() {
    this.standings_fields = [{
      key: 'rank',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Win-Draw-Loss',
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        return "".concat(item.wins, " - ").concat(item.draws, " - ").concat(item.losses);
      }
    }, {
      key: 'points',
      label: 'Points',
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        if (item.ar > 0) {
          return "".concat(item.points, "*");
        }

        return "".concat(item.points);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      sortable: true,
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }, {
      key: 'lastGame',
      label: 'Last Game',
      sortable: false,
      formatter: function formatter(value, key, item) {
        if (item.score == 0 && item.oppo_score == 0 && item.result == 'awaiting') {
          return "Awaiting result of game ".concat(item.round, " vs ").concat(item.oppo);
        } else {
          return "a ".concat(item.score, "-").concat(item.oppo_score, "\n            ").concat(item.result.toUpperCase(), " vs ").concat(item.oppo, " ");
        }
      }
    }];
  },
  methods: {
    result: function result(r) {
      var round = r - 1;

      var data = _.clone(this.resultdata[round]);

      _.forEach(data, function (r) {
        var opp_no = r['oppo_no']; // Find where the opponent's current position and add to collection

        var row = _.find(data, {
          pno: opp_no
        });

        r['opp_position'] = row['position']; // check result (win, loss, draw)

        var result = r['result'];
        r['_cellVariants'] = [];
        r['_cellVariants']['lastGame'] = 'warning';

        if (result === 'win') {
          r['_cellVariants']['lastGame'] = 'success';
        }

        if (result === 'loss') {
          r['_cellVariants']['lastGame'] = 'danger';
        }

        if (result === 'awaiting') {
          r['_cellVariants']['lastGame'] = 'info';
        }

        if (result === 'draw') {
          r['_cellVariants']['lastGame'] = 'warning';
        }
      });

      return _.chain(data).sortBy('margin').sortBy('points').value().reverse();
    }
  }
});
exports.Standings = Standings;
var Pairings = Vue.component('pairings', {
  template: "\n<table class=\"table table-hover table-responsive table-striped  animated fadeInUp\">\n    <caption>{{caption}}</caption>\n    <thead class=\"thead-dark\">\n        <tr>\n        <th scope=\"col\">#</th>\n        <th scope=\"col\">Player</th>\n        <th scope=\"col\">Opponent</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr v-for=\"(player,i) in pairing(currentRound)\" :key=\"i\">\n        <th scope=\"row\">{{i + 1}}</th>\n        <td :id=\"'popover-'+player.id\"><b-img-lazy v-bind=\"imgProps\" :alt=\"player.player\" :src=\"player.photo\"></b-img-lazy><sup v-if=\"player.start =='y'\">*</sup>{{player.player}}</td>\n        <td :id=\"'popover-'+player.opp_id\"><b-img-lazy v-bind=\"imgProps\" :alt=\"player.oppo\" :src=\"player.opp_photo\"></b-img-lazy><sup  v-if=\"player.start =='n'\">*</sup>{{player.oppo}}</td>\n        </tr>\n    </tbody>\n  </table>\n",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      imgProps: {
        rounded: 'circle',
        fluid: true,
        blank: true,
        blankColor: '#bbb',
        style: 'margin-right:.5em',
        width: '25px',
        height: '25px',
        "class": 'shadow-sm'
      }
    };
  },
  methods: {
    // get pairing
    pairing: function pairing(r) {
      var round = r - 1;
      var round_res = this.resultdata[round]; // Sort by player numbering if round 1 to obtain round 1 pairing

      if (r === 1) {
        round_res = _.sortBy(round_res, 'pno');
      }

      var paired_players = [];

      var rp = _.map(round_res, function (r) {
        var player = r['pno'];
        var opponent = r['oppo_no'];

        if (_.includes(paired_players, player)) {
          return false;
        }

        paired_players.push(player);
        paired_players.push(opponent);
        return r;
      });

      return _.compact(rp);
    }
  }
});
exports.Pairings = Pairings;

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],13:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StatsProfile = Vue.component('stats_profile', {
  template: "\n  <div class=\"row\">\n  <div class=\"col-10 offset-1 justify-content-center align-items-center\">\n    <div class=\"row\">\n      <div class=\"col-12 d-flex justify-content-center align-items-center\">\n        <b-button @click=\"view='profile'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view=='profile'\" :pressed=\"view=='profile'\" title=\"Player Profile\">\n        <b-icon icon=\"person\"></b-icon>Profile</b-button>\n        <b-button @click=\"view='head2head'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view=='head2head'\" :pressed=\"view=='head2head'\" title=\"Head To Head\"><b-icon icon=\"people-fill\"></b-icon>H2H</b-button>\n      </div>\n    </div>\n    <h3 v-show=\"view=='profile'\" class=\"bebas\"><b-icon icon=\"person\"></b-icon> Stats Profile</h3>\n    <h3 v-show=\"view=='head2head'\" class=\"bebas\"><b-icon icon=\"people-fill\"></b-icon> Head to Head</h3>\n    <template v-if=\"view=='profile'\">\n      <b-form-row class=\"my-1 mx-auto\">\n        <b-col sm=\"2\" class=\"ml-sm-auto\">\n          <label for=\"search\">Enter player names</label>\n        </b-col>\n        <b-col sm=\"4\" class=\"mr-sm-auto\">\n          <b-form-input list=\"players-list\" size=\"sm\" placeholder=\"Start typing player name\" id=\"search\" v-model=\"psearch\"  @update=\"getprofile\" type=\"search\">\n          </b-form-input>\n        </b-col>\n      </b-form-row>\n      <b-row v-show=\"loading\">\n        <b-col>\n          <div class=\"d-flex text-center my-2 justify-content-center align-items-center\">\n          <b-spinner type=\"grow\" variant=\"info\" label=\"Busy\"></b-spinner>\n          </div>\n        </b-col>\n      </b-row>\n      <b-row cols=\"2\" v-show=\"!loading\">\n        <b-col>\n        <div class=\"d-flex flex-column text-center align-items-center animated fadeIn\">\n        <h4 class=\"oswald\">{{pdata.player}}\n        <span class=\"d-block mx-auto my-1\" style=\"font-size:small\">\n        <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+pdata.country\" title=\"pdata.country_full\"</i>\n        <i class=\"ml-2 fa\" :class=\"{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }\" aria-hidden=\"true\"></i>\n        </span>\n        </h4>\n        <img :src='pdata.photo' :alt=\"pdata.player\" v-bind=\"imgProps\"></img>\n        </div>\n        </b-col>\n        <b-col>\n          <div>\n          <div v-if=\"loading\" class=\"d-flex text-center my-2 justify-content-center align-items-center\">\n          <b-spinner type=\"grow\" label=\"Loading\"></b-spinner>\n          </div>\n          <div v-else class=\"p-3 mb-2 bg-light text-dark\" v-for=\"c in pdata.competitions\" :key=\"c.id\">\n              <h6 class=\"oswald\">{{c.title}}  <span style=\"font-size: smaller;\" class=\"d-inline-block\">{{c.final_rd.round}} games</span></h6>\n              <p class=\"text-center text-light bg-dark\">Points: {{c.final_rd.points}} Wins: {{c.final_rd.wins}} Pos: {{c.final_rank}}</p>\n            </div>\n          </div>\n        </b-col>\n      </b-row>\n    </template>\n    <template v-if=\"view=='head2head'\">\n      <b-form-row class=\"my-1\">\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label for=\"search1\">Player 1</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input placeholder=\"Start typing player name\" size=\"sm\" id=\"search1\" v-model=\"search1\" type=\"search\"></b-form-input>\n        </b-col>\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label class=\"ml-2\" for=\"search2\">Player 2</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input size=\"sm\" placeholder=\"Start typing player name\" id=\"search2\" v-model=\"search2\" type=\"search\"></b-form-input>\n        </b-col>\n      </b-form-row>\n      <b-row cols=\"4\">\n        <b-col></b-col>\n        <b-col>{{search1}}</b-col>\n        <b-col></b-col>\n        <b-col>{{search2}}</b-col>\n      </b-row>\n    </template>\n    <template>\n    <b-form-datalist :options=\"playerlist\" id=\"players-list\"></b-form-datalist>\n    </template>\n  </div>\n  </div>\n  ",
  data: function data() {
    return {
      view: "profile",
      showTouStats: false,
      psearch: null,
      search1: null,
      search2: null,
      pdata: {},
      pslug: null,
      loading: true,
      imgProps: {
        block: true,
        thumbnail: true,
        fluid: true,
        blank: true,
        blankColor: '#666',
        width: 150,
        height: 150,
        "class": 'mb-3 shadow-sm'
      }
    };
  },
  beforeMount: function beforeMount() {
    this.getPlayers();
  },
  watch: {
    all_players_tou: {
      immediate: true,
      handler: function handler(val) {
        if (val.length > 0) {
          this.loading = true;
          this.getPData(val);
        }
      }
    }
  },
  methods: {
    getPlayers: function getPlayers() {
      this.$store.dispatch('GET_ALL_PLAYERS', null);
    },
    getPData: function getPData(v) {
      this.loading = false;
      console.log(this.pslug);

      var data = _.find(v, ['slug', this.pslug]);

      if (data) {
        this.pdata = data;
        this.loading = false;
      }
    },
    getprofile: function getprofile(i) {
      this.loading = true;
      console.log('..computed input..');
      console.log(i);

      var p = _.find(this.all_players, function (o) {
        return o.player == i;
      });

      if (p) {
        this.pslug = p.slug;
        this.$store.dispatch('GET_PLAYER_TOU_DATA', this.pslug);
      }
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    all_players: 'ALL_PLAYERS',
    all_players_tou: 'ALL_PLAYERS_TOU_DATA'
  }), {
    playerlist: {
      get: function get() {
        var n = this.all_players;

        var fp = _.map(n, function (p) {
          return p.player;
        });

        console.log('----fp-----');
        console.log(fp);
        return fp;
      },
      set: function set(newVal) {
        this.$store.commit('SET_ALL_PLAYERS', newVal);
      }
    }
  })
});
exports["default"] = StatsProfile;

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var RatingStats = Vue.component('rating_stats', {
  template: "<!-- Rating Stats -->\n  <div class=\"row\">\n    <div class=\"col-8 offset-2 justify-content-center align-items-center\">\n      <b-table responsive=\"sm\" hover striped foot-clone :items=\"computed_items\" :fields=\"fields\" head-variant=\"dark\">\n          <!-- A virtual column -->\n          <template v-slot:cell(rating_change)=\"data\">\n            <span v-bind:class=\"{\n           'text-info': data.item.rating_change == 0,\n           'text-danger': data.item.rating_change < 0,\n           'text-success': data.item.rating_change > 0 }\">\n            {{data.item.rating_change}}\n            <i v-bind:class=\"{\n             'fa fa-long-arrow-left':data.item.rating_change == 0,\n             'fa fa-long-arrow-down': data.item.rating_change < 0,\n             'fa fa-long-arrow-up': data.item.rating_change > 0 }\" aria-hidden=\"true\"></i>\n           </span>\n          </template>\n          <template v-slot:cell(name)=\"data\">\n            <b-img-lazy :title=\"data.item.name\" :alt=\"data.item.name\" :src=\"data.item.photo\" v-bind=\"picProps\"></b-img-lazy>\n          {{data.item.name}}\n          </template>\n          <template slot=\"table-caption\">\n            {{caption}}\n          </template>\n      </b-table>\n    </div>\n  </div>\n    ",
  props: ['caption', 'computed_items'],
  data: function data() {
    return {
      picProps: {
        block: false,
        rounded: 'circle',
        fluid: true,
        blank: true,
        width: '30px',
        height: '30px',
        "class": 'shadow-sm, mx-1'
      },
      fields: [{
        key: 'position',
        label: 'Rank'
      }, 'name', {
        key: 'rating_change',
        label: 'Change',
        sortable: true
      }, {
        key: 'expected_wins',
        label: 'E.wins'
      }, {
        key: 'actual_wins',
        label: 'A.wins'
      }, {
        key: 'old_rating',
        label: 'Old Rating',
        sortable: true
      }, {
        key: 'new_rating',
        label: 'New Rating',
        sortable: true
      }]
    };
  }
});
exports["default"] = RatingStats;

},{}],15:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _config = _interopRequireDefault(require("../config.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Scoreboard = Vue.component('scoreboard', {
  template: "\n  <div class=\"row d-flex align-items-center justify-content-center\">\n  <template v-if=\"loading||error\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-if=\"error\" class=\"col align-self-center\">\n            <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n            </error>\n        </div>\n  </template>\n  <template v-else>\n  <div class=\"col\" id=\"scoreboard\">\n    <div class=\"row no-gutters d-flex align-items-center justify-content-center\" v-for=\"i in rowCount\" :key=\"i\">\n      <div class=\"col-lg-3 col-sm-6 col-12 \" v-for=\"player in itemCountInRow(i)\" :key=\"player.rank\">\n        <b-media class=\"pb-0 mb-1 mr-1\" vertical-align=\"center\">\n          <div slot=\"aside\">\n            <b-row class=\"justify-content-center\">\n              <b-col>\n                <b-img rounded=\"circle\" :src=\"player.photo\" width=\"50\" height=\"50\" :alt=\"player.player\" class=\"animated flipInX\" />\n              </b-col>\n            </b-row>\n            <b-row class=\"justify-content-center\">\n              <b-col cols=\"12\" md=\"auto\">\n                <span class=\"flag-icon\" :title=\"player.country_full\"\n                  :class=\"'flag-icon-'+player.country | lowercase\"></span>\n              </b-col>\n              <b-col col lg=\"2\">\n                <i class=\"fa\" v-bind:class=\"{'fa-male': player.gender === 'm',\n                     'fa-female': player.gender === 'f' }\" aria-hidden=\"true\"></i>\n              </b-col>\n            </b-row>\n            <b-row class=\"text-center\" v-if=\"player.team\">\n              <b-col><span>{{player.team}}</span></b-col>\n            </b-row>\n            <b-row>\n              <b-col class=\"text-white\" v-bind:class=\"{'text-warning': player.result === 'draw',\n             'text-info': player.result === 'awaiting',\n             'text-danger': player.result === 'loss',\n             'text-success': player.result === 'win' }\">\n                <h4 class=\"text-center position  mt-1\">\n                  {{player.position}}\n                  <i class=\"fa\" v-bind:class=\"{'fa-long-arrow-up': player.rank < player.lastrank,'fa-long-arrow-down': player.rank > player.lastrank,\n                 'fa-arrows-h': player.rank == player.lastrank }\" aria-hidden=\"true\"></i>\n                </h4>\n              </b-col>\n            </b-row>\n          </div>\n          <h5 class=\"m-0  animated fadeInLeft\">{{player.player}}</h5>\n          <p class=\"card-text mt-0\">\n            <span class=\"sdata points p-1\">{{player.points}}-{{player.losses}}</span>\n            <span class=\"sdata mar\">{{player.margin | addplus}}</span>\n            <span v-if=\"player.lastposition\" class=\"sdata p1\">was {{player.lastposition}}</span>\n          </p>\n          <div class=\"row\">\n            <b-col>\n              <span v-if=\"player.result =='awaiting' \" class=\"bg-info d-inline p-1 ml-1 text-white result\">{{\n                                   player.result | firstchar }}</span>\n              <span v-else class=\"d-inline p-1 ml-1 text-white result\" v-bind:class=\"{'bg-warning': player.result === 'draw',\n                         'bg-danger': player.result === 'loss',\n                         'bg-info': player.result === 'awaiting',\n                         'bg-success': player.result === 'win' }\">\n                {{player.result | firstchar}}</span>\n              <span v-if=\"player.result =='awaiting' \" class=\"text-info d-inline p-1  sdata\">Awaiting\n                Result</span>\n              <span v-else class=\"d-inline p-1 sdata\" v-bind:class=\"{'text-warning': player.result === 'draw',\n                       'text-danger': player.result === 'loss',\n                       'text-success': player.result === 'win' }\">{{player.score}}\n                - {{player.oppo_score}}</span>\n              <span class=\"d-block p-0 ml-1 opp\">vs {{player.oppo}}</span>\n            </b-col>\n          </div>\n          <div v-if=\"player.prevresults\" class=\"row align-content-center\">\n            <b-col>\n              <span :title=\"res\" v-for=\"res in player.prevresults\" :key=\"res.key\"\n                class=\"d-inline-block p-1 text-white sdata-res text-center\" v-bind:class=\"{'bg-warning': res === 'draw',\n                     'bg-info': res === 'awaiting',\n                     'bg-danger': res === 'loss',\n                     'bg-success': res === 'win' }\">{{res|firstchar}}</span>\n            </b-col>\n          </div>\n        </b-media>\n      </div>\n    </div>\n  </div>\n  </template>\n</div>\n    ",
  props: ['currentRound'],
  data: function data() {
    return {
      itemsPerRow: 4,
      per_page: 40,
      parent_slug: this.$route.params.slug,
      pageurl: _config["default"] + this.$route.path,
      slug: this.$route.params.event_slug,
      reloading: false,
      currentPage: 1,
      period: 0.5,
      timer: null,
      scoreboard_data: [],
      response_data: [],
      // players: [],
      // total_rounds: 0,
      // currentRound: null,
      event_title: '',
      is_live_game: true
    };
  },
  mounted: function mounted() {
    // this.fetchScoreboardData();
    this.processDetails(this.currentPage);
    this.timer = setInterval(function () {
      this.reload();
    }.bind(this), this.period * 60000);
  },
  watch: {
    currentRound: {
      immediate: true,
      handler: function handler() {
        this.processDetails(this.currentPage);
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    // window.removeEventListener('resize', this.getWindowWidth);
    this.cancelAutoUpdate();
  },
  methods: {
    cancelAutoUpdate: function cancelAutoUpdate() {
      clearInterval(this.timer);
    },
    fetchScoreboardData: function fetchScoreboardData() {
      this.$store.dispatch('FETCH_DATA', this.slug);
      console.log(this.slug);
    },
    reload: function reload() {
      if (this.is_live_game == true) {
        this.processDetails(this.currentPage);
      }
    },
    itemCountInRow: function itemCountInRow(index) {
      return this.scoreboard_data.slice((index - 1) * this.itemsPerRow, index * this.itemsPerRow);
    },
    processDetails: function processDetails(currentPage) {
      var _this = this;

      // console.log(this.result_data)
      var resultdata = this.result_data; // let lastRdD = _.last(_.clone(resultdata));

      var cr = this.currentRound - 1;

      var thisRdData = _.nth(_.clone(resultdata), cr);

      console.log('----This Round Data-----');
      console.log(cr);
      console.log(thisRdData);
      var initialRdData = [];
      var previousRdData = [];

      if (this.currentRound > 1) {
        previousRdData = _.nth(_.clone(resultdata), cr - 1);
        console.log('----Previous Round Data-----');
        console.log(previousRdData);
        initialRdData = _.take(_.clone(resultdata), cr);
      }

      var currentRdData = _.map(thisRdData, function (player) {
        var x = player.pno - 1;
        player.photo = _this.players[x].photo;
        player.gender = _this.players[x].gender;
        player.country_full = _this.players[x].country_full;
        player.country = _this.players[x].country;

        if (previousRdData.length > 0) {
          var playerData = _.find(previousRdData, {
            player: player.player
          });

          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank']; // previous rounds results

          if (initialRdData.length > 0) {
            player.prevresults = _.chain(initialRdData).flattenDeep().filter(function (v) {
              return v.player === player.player;
            }).map('result').value();
          }
        }

        return player;
      }); // this.total_rounds = resultdata.length;
      // this.currentRound = lastRdData[0].round;


      var chunks = _.chunk(currentRdData, this.total_players); // this.reloading = false


      this.scoreboard_data = chunks[currentPage - 1];
      console.log('Scoreboard Data');
      console.log(this.scoreboard_data);
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    loading: 'LOADING',
    error: 'ERROR',
    category: 'CATEGORY'
  }), {
    rowCount: function rowCount() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.pageurl, " ");
    }
  })
});
var _default = Scoreboard;
exports["default"] = _default;

},{"../config.js":6,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],16:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _alerts = require("./alerts.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Scoresheet = Vue.component('scoreCard', {
  template: "\n  <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <template v-if=\"loading||error\">\n    <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    </template>\n    <template v-else>\n    <div class=\"row justify-content-center align-items-center\">\n      <div class=\"col-12 d-flex\">\n        <b-img class=\"thumbnail logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n        <h2 class=\"text-center bebas\">{{ event_title }}\n        <span class=\"text-center d-block\">Scorecards <i class=\"fas fa-clipboard\"></i></span>\n        </h2>\n      </div>\n    </div>\n    <div class=\"row justify-content-center\">\n      <div class=\"col-md-2 col-12\">\n      <!-- player list here -->\n        <ul class=\" p-2 mb-5 bg-white rounded\">\n          <li :key=\"player.pno\" v-for=\"player in pdata\" class=\"bebas\">\n          <span>{{player.pno}}</span> <b-img-lazy :alt=\"player.player\" :src=\"player.photo\" v-bind=\"picProps\"></b-img-lazy>\n            <b-button @click=\"getCard(player.pno)\" variant=\"link\">{{player.player}}</b-button>\n          </li>\n        </ul>\n      </div>\n      <div class=\"col-md-10 col-12\">\n      <template v-if=\"resultdata\">\n        <h4 class=\"green\">Scorecard: <b-img :alt=\"mPlayer.player\" class=\"mx-2\" :src=\"mPlayer.photo\" style=\"width:60px; height:60px\"></b-img> {{mPlayer.player}}</h4>\n        <b-table responsive=\"md\" small hover foot-clone head-variant=\"light\" bordered table-variant=\"light\" :fields=\"fields\" :items=\"scorecard\" id=\"scorecard\" class=\"bebas shadow p-4 mx-auto\" style=\"width:90%; text-align:center; vertical-align: middle\">\n        <!-- A custom formatted column -->\n        <template v-slot:cell(round)=\"data\">\n          {{data.item.round}} <sup v-if=\"data.item.start =='y'\">*</sup>\n        </template>\n        <template v-slot:cell(oppo)=\"data\">\n          <small>#{{data.item.oppo_no}}</small><b-img-lazy :title=\"data.item.oppo\" :alt=\"data.item.oppo\" :src=\"data.item.opp_photo\" v-bind=\"picProps\"></b-img-lazy>\n          <b-button @click=\"getCard(data.item.oppo_no)\" variant=\"link\">\n              {{data.item.oppo|abbrv}}\n          </b-button>\n        </template>\n        <template v-slot:table-caption>\n          Scorecard: #{{mPlayer.pno}} {{mPlayer.player}}\n        </template>\n        </b-table>\n      </template>\n      </div>\n     </div>\n    </template>\n  </div>\n  ",
  data: function data() {
    return {
      slug: this.$route.params.event_slug,
      player_no: this.$route.params.pno,
      path: this.$route.path,
      tourney_slug: '',
      picProps: {
        block: false,
        rounded: 'circle',
        fluid: true,
        blank: true,
        width: '30px',
        height: '30px',
        "class": 'shadow-sm, mx-1'
      },
      fields: [{
        key: 'round',
        label: 'Rd',
        sortable: true
      }, {
        key: 'oppo',
        label: 'Opp. Name'
      }, {
        key: 'oppo_score',
        label: 'Opp. Score',
        sortable: true
      }, {
        key: 'score',
        sortable: true
      }, {
        key: 'diff',
        sortable: true
      }, {
        key: 'result',
        sortable: true
      }, {
        key: 'wins',
        label: 'Won',
        sortable: true
      }, {
        key: 'losses',
        label: 'Lost',
        sortable: true
      }, {
        key: 'points',
        sortable: true
      }, {
        key: 'margin',
        sortable: true,
        label: 'Mar'
      }, {
        key: 'position',
        label: 'Rank',
        sortable: true
      }],
      pdata: {},
      scorecard: {},
      mPlayer: {}
    };
  },
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert
  },
  created: function created() {
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    console.log(this.tourney_slug);
    this.$store.dispatch('FETCH_RESDATA', this.slug);
    document.title = "Player Scorecards - ".concat(this.tourney_title);
  },
  watch: {
    resultdata: {
      immediate: true,
      deep: true,
      handler: function handler(newVal) {
        if (newVal) {
          this.pdata = _.chain(this.resultdata).last().sortBy('pno').value();
          this.getCard(this.player_no);
        }
      }
    }
  },
  methods: {
    getCard: function getCard(n) {
      var c = _.clone(this.resultdata);

      var s = _.chain(c).map(function (v) {
        return _.filter(v, function (o) {
          return o.pno == n;
        }).map(function (i) {
          i._cellVariants = [];
          i._cellVariants.result = 'info';

          if (i.result === 'win') {
            i._cellVariants.result = 'success';
          }

          if (i.result === 'loss') {
            i._cellVariants.result = 'danger';
          }

          if (i.result === 'draw') {
            i._cellVariants.result = 'warning';
          }

          return i;
        });
      }).flattenDeep().value();

      this.mPlayer = _.first(s);
      this.$router.replace({
        name: 'Scoresheet',
        params: {
          pno: n
        }
      });
      this.player_no = n;
      console.log(s);
      this.scorecard = s;
    }
  },
  computed: _objectSpread({}, Vuex.mapGetters({
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    event_data: 'EVENTSTATS',
    resultdata: 'RESULTDATA',
    error: 'ERROR',
    loading: 'LOADING',
    category: 'CATEGORY',
    total_rounds: 'TOTAL_ROUNDS',
    parent_slug: 'PARENTSLUG',
    event_title: 'EVENT_TITLE',
    tourney_title: 'TOURNEY_TITLE',
    logo: 'LOGO_URL'
  }), {
    breadcrumbs: function breadcrumbs() {
      return [{
        text: 'NSF News',
        href: '/'
      }, {
        text: 'Tournaments',
        to: {
          name: 'TourneysList'
        }
      }, {
        text: this.tourney_title,
        to: {
          name: 'TourneyDetail',
          params: {
            slug: this.tourney_slug
          }
        }
      }, {
        text: "".concat(_.capitalize(this.category), " - Results and Stats"),
        to: {
          name: 'CateDetail',
          params: {
            event_slug: this.slug
          }
        }
      }, {
        text: 'Scorecards',
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.path, " ");
    }
  })
});
exports["default"] = Scoresheet;

},{"./alerts.js":8,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoSpread = exports.HiSpread = exports.AveOppScores = exports.AveScores = exports.TotalOppScores = exports.TotalScores = exports.ComboScores = exports.HiLoss = exports.LoWins = exports.HiWins = void 0;
var LoWins = Vue.component('lowins', {
  template: "<!-- Low Winning Scores -->\n    <b-table responsive hover striped foot-clone :items=\"getLowScore('win')\" :fields=\"lowwins_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lowwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lowwins_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score'
    }, {
      key: 'oppo',
      label: 'Loser'
    }];
  },
  methods: {
    getLowScore: function getLowScore(result) {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).minBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value();
    }
  }
});
exports.LoWins = LoWins;
var HiWins = Vue.component('hiwins', {
  template: "<!-- High Winning Scores -->\n    <b-table  responsive hover striped foot-clone :items=\"getHiScore('win')\" :fields=\"highwins_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      highwins_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.highwins_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score'
    }, {
      key: 'oppo',
      label: 'Loser'
    }];
  },
  methods: {
    getHiScore: function getHiScore(result) {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).maxBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  }
});
exports.HiWins = HiWins;
var HiLoss = Vue.component('hiloss', {
  template: "\n    <!-- High Losing Scores -->\n   <b-table  responsive hover striped foot-clone :items=\"getHiScore('loss')\" :fields=\"hiloss_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hiloss_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hiloss_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Loser',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Winning Score'
    }, {
      key: 'oppo',
      label: 'Winner'
    }];
  },
  methods: {
    getHiScore: function getHiScore(result) {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === result;
        }).max(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    }
  }
});
exports.HiLoss = HiLoss;
var ComboScores = Vue.component('comboscores', {
  template: "\n  <b-table  responsive hover striped foot-clone :items=\"hicombo()\" :fields=\"hicombo_fields\" head-variant=\"dark\">\n    <template slot=\"table-caption\">\n        {{caption}}\n    </template>\n  </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hicombo_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hicombo_fields = [{
      key: 'round',
      sortable: true
    }, {
      key: 'combo_score',
      label: 'Combined Score',
      sortable: true,
      "class": 'text-center'
    }, {
      key: 'score',
      label: 'Winning Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      "class": 'text-center'
    }, {
      key: 'oppo',
      label: 'Loser',
      "class": 'text-center'
    }];
  },
  methods: {
    hicombo: function hicombo() {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).maxBy(function (w) {
          return w.combo_score;
        }).value();
      }).sortBy('combo_score').value().reverse();
    }
  }
});
exports.ComboScores = ComboScores;
var TotalScores = Vue.component('totalscores', {
  template: "\n    <b-table   responsive hover striped foot-clone :items=\"stats\" :fields=\"totalscore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totalscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totalscore_fields = [//  'index',
    {
      key: 'position',
      sortable: true
    }, {
      key: 'total_score',
      label: 'Total Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.TotalScores = TotalScores;
var TotalOppScores = Vue.component('oppscores', {
  template: "\n    <b-table   responsive hover striped foot-clone :items=\"stats\" :fields=\"totaloppscore_fields\" head-variant=\"dark\">\n            <template slot=\"table-caption\">\n                {{caption}}\n            </template>\n            <template slot=\"index\" slot-scope=\"data\">\n                {{data.index + 1}}\n            </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      totaloppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.totaloppscore_fields = [// 'index',
    {
      key: 'position',
      sortable: true
    }, {
      key: 'total_oppscore',
      label: 'Total Opponent Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.TotalOppScores = TotalOppScores;
var AveScores = Vue.component('avescores', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"stats\" :fields=\"avescore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      avescore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.avescore_fields = [//'index',
    {
      key: 'position',
      sortable: true
    }, {
      key: 'ave_score',
      label: 'Average Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.AveScores = AveScores;
var AveOppScores = Vue.component('aveoppscores', {
  template: "\n    <b-table  hover responsive striped foot-clone :items=\"stats\" :fields=\"aveoppscore_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template slot=\"index\" slot-scope=\"data\">\n            {{data.index + 1}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'stats'],
  data: function data() {
    return {
      aveoppscore_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.aveoppscore_fields = [// 'index',
    {
      key: 'position',
      sortable: true
    }, {
      key: 'ave_opp_score',
      label: 'Average Opponent Score',
      "class": 'text-center',
      sortable: true
    }, {
      key: 'player',
      label: 'Player',
      "class": 'text-center'
    }, {
      key: 'wonLost',
      label: 'Won-Lost',
      sortable: false,
      "class": 'text-center',
      formatter: function formatter(value, key, item) {
        var loss = item.round - item.points;
        return "".concat(item.points, " - ").concat(loss);
      }
    }, {
      key: 'margin',
      label: 'Spread',
      "class": 'text-center',
      formatter: function formatter(value) {
        if (value > 0) {
          return "+".concat(value);
        }

        return "".concat(value);
      }
    }];
  }
});
exports.AveOppScores = AveOppScores;
var LoSpread = Vue.component('lospread', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"loSpread()\" :fields=\"lospread_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      lospread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.lospread_fields = ['round', {
      key: 'diff',
      label: 'Spread',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo',
      label: 'Loser',
      sortable: true
    }];
  },
  methods: {
    loSpread: function loSpread() {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).minBy(function (w) {
          return w.diff;
        }).value();
      }).sortBy('diff').value();
    }
  }
});
exports.LoSpread = LoSpread;
var HiSpread = Vue.component('hispread', {
  template: "\n    <b-table  responsive hover striped foot-clone :items=\"hiSpread()\" :fields=\"hispread_fields\" head-variant=\"dark\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
  props: ['caption', 'resultdata'],
  data: function data() {
    return {
      hispread_fields: []
    };
  },
  beforeMount: function beforeMount() {
    this.hispread_fields = ['round', {
      key: 'diff',
      label: 'Spread',
      sortable: true
    }, {
      key: 'score',
      label: 'Winning Score',
      sortable: true
    }, {
      key: 'oppo_score',
      label: 'Losing Score',
      sortable: true
    }, {
      key: 'player',
      label: 'Winner',
      sortable: true
    }, {
      key: 'oppo',
      label: 'Loser',
      sortable: true
    }];
  },
  methods: {
    hiSpread: function hiSpread() {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).max(function (w) {
          return w.diff;
        }).value();
      }).sortBy('diff').value().reverse();
    }
  }
});
exports.HiSpread = HiSpread;

},{}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mapGetters = Vuex.mapGetters;
var topPerformers = Vue.component('top-stats', {
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n  <div class=\"row\">\n    <div class=\"col-12 justify-content-center align-content-center\">\n      <h3 class=\"bebas\">{{title}}\n        <span><i class=\"fas fa-medal\"></i></span>\n      </h3>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-lg-2 col-sm-4 col-12\">\n      <div class=\"mt-5 d-flex align-content-center align-items-center justify-content-center\">\n        <div id=\"top-btn-group\">\n          <b-button-group vertical>\n            <b-button variant=\"info\" title=\"Top 3\" class=\"m-2 btn-block\" @click=\"showPic('top3')\"\n              active-class=\"success\" :pressed=\"currentView=='top3'\">\n              <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>Top 3\n            </b-button>\n            <b-button variant=\"info\" title=\"Highest (Game) Scores\" class=\"m-2 btn-block\" active-class=\"success\"\n              @click=\"showPic('higames')\" :pressed=\"currentView=='higames'\">\n              <i class=\"fas fa-bullseye m-1\" aria-hidden=\"true\"></i>High Game\n            </b-button>\n            <b-button variant=\"info\" title=\"Highest Average Scores\" class=\"m-2 btn-block\" active-class=\"success\"\n              :pressed=\"currentView=='hiaves'\" @click=\"showPic('hiaves')\">\n              <i class=\"fas fa-thumbs-up m-1\" aria-hidden=\"true\"></i>High Ave Score</b-button>\n            <b-button variant=\"info\" title=\"Lowest Average Opponent Scores\" class=\"m-2 btn-block\"\n              @click=\"showPic('looppaves')\" active-class=\"success\" :pressed=\"currentView=='looppaves'\">\n              <i class=\"fas fa-beer mr-1\" aria-hidden=\"true\"></i>Low Opp Ave</b-button>\n            <b-button v-if=\"rating_stats\" variant=\"info\" title=\"High Rank Points\" class=\"m-2 btn-block\" @click=\"showPic('hirate')\"\n              active-class=\"success\" :pressed=\"currentView=='hirate'\">\n              <i class=\"fas fa-bolt mr-1\" aria-hidden=\"true\"></i>Hi Rank Points</b-button>\n          </b-button-group>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-lg-10 col-sm-8 col-12\">\n      <div class=\"row\">\n        <div :class=\"{'delay1':  item.position == '1st', 'delay2': item.position == '2nd', 'delay3': item.position == '3rd'}\" class=\"col-sm-4 col-12 animated flipInX\" v-for=\"(item, index) in stats\">\n          <h4 class=\"p-2 text-center bebas bg-dark text-white\">{{item.player}}</h4>\n          <div :class=\"{'gold': item.position == '1st','silver': item.position == '2nd','bronze': item.position == '3rd'}\" class=\"d-flex flex-column justify-content-center align-items-center \">\n            <img :src=\"players[item.pno-1].photo\" width='120' height='120' class=\"img-fluid rounded-circle\"\n              :alt=\"players[item.pno-1].post_title|lowercase\">\n            <span class=\"d-block ml-5\">\n              <i class=\"mx-1 flag-icon\" :class=\"'flag-icon-'+players[item.pno-1].country | lowercase\"\n                :title=\"players[item.pno-1].country_full\"></i>\n              <i class=\"mx-1 fa\"\n                :class=\"{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}\"\n                aria-hidden=\"true\">\n              </i>\n            </span>\n          </div>\n          <div class=\"d-flex flex-row justify-content-center align-content-center bg-dark text-white\">\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.points\">{{item.points}}</span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.rating_change\"><small v-if=\"item.rating_change >= 0\">Gained</small> {{item.rating_change}} points <small v-if=\"item.rating_change <= 0\">loss</small></span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.margin\">{{item.margin|addplus}}</span>\n              <span class=\"mx-1 text-center display-5 d-inline-block align-self-center\" v-if=\"item.score\">Round\n                {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class=\"d-flex justify-content-center align-items-center bg-success text-white\">\n              <div v-if=\"item.score\" class=\"display-4 yanone d-inline-flex\">{{item.score}}</div>\n              <div v-if=\"item.position\" class=\"display-4 yanone d-inline-flex\">{{item.position}}</div>\n              <div v-if=\"item.ave_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_score}}</div>\n              <div v-if=\"item.ave_opp_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_opp_score}}</div>\n              <div v-if=\"item.new_rating\" class=\"display-4 yanone d-inline-flex\">{{item.old_rating}} - {{item.new_rating}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n  ",
  data: function data() {
    return {
      title: '',
      profiles: [],
      stats: [],
      computed_rating_items: [],
      currentView: ''
    };
  },
  created: function created() {
    this.showPic('top3');
  },
  methods: {
    showPic: function showPic(t) {
      this.currentView = t;
      var arr,
          r,
          s = [];

      if (t == 'hiaves') {
        arr = this.getStats('ave_score');
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_score']);
        });
        this.title = 'Highest Average Scores';
      }

      if (t == 'looppaves') {
        arr = this.getStats('ave_opp_score');
        r = _.takeRight(arr, 3).reverse().map(function (p) {
          return _.pick(p, ['player', 'pno', 'ave_opp_score']);
        });
        this.title = 'Lowest Opponent Average Scores';
      }

      if (t == 'higames') {
        arr = this.computeStats();
        r = _.take(arr, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'score', 'round', 'oppo']);
        });
        this.title = 'High Game Scores';
      }

      if (t == 'top3') {
        arr = this.getStats('points');
        s = _.sortBy(arr, ['points', 'margin']).reverse();
        r = _.take(s, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'points', 'margin', 'position']);
        });
        this.title = 'Top 3';
      }

      if (t == 'hirate') {
        this.updateRatingData();
        arr = this.computed_rating_items;
        s = _.sortBy(arr, ['rating_change', 'new_rating']).reverse();
        r = _.take(s, 3).map(function (p) {
          return _.pick(p, ['player', 'pno', 'new_rating', 'rating_change', 'old_rating']);
        });
        console.log('----------------top rank--------------------');
        console.log(r);
        this.title = 'High Rating Point Gainers';
      }

      this.stats = r; // this.profiles = this.players[r.pno-1];
    },
    getStats: function getStats(key) {
      return _.sortBy(this.finalstats, key).reverse();
    },
    computeStats: function computeStats() {
      var data = _.clone(this.resultdata);

      return _.chain(data).map(function (r) {
        return _.chain(r).map(function (m) {
          return m;
        }).filter(function (n) {
          return n['result'] === 'win';
        }).maxBy(function (w) {
          return w.score;
        }).value();
      }).sortBy('score').value().reverse();
    },
    updateRatingData: function updateRatingData() {
      var resultdata = this.resultdata;

      var data = _.chain(resultdata).last().sortBy('pno').value();

      var items = _.clone(this.rating_stats);

      this.computed_rating_items = _.map(items, function (x) {
        var n = x.pno;

        var p = _.filter(data, function (o) {
          return o.pno == n;
        });

        x.photo = p[0].photo;
        x.position = p[0].position;
        x.player = x.name;
        x.rating_change = parseInt(x.rating_change);
        return x;
      });
    }
  },
  computed: _objectSpread({}, mapGetters({
    players: 'PLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    finalstats: 'FINAL_ROUND_STATS',
    resultdata: 'RESULTDATA',
    rating_stats: 'RATING_STATS',
    ongoing: 'ONGOING_TOURNEY'
  }))
});
var _default = topPerformers;
exports["default"] = _default;

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],19:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _config = require("./config.js");

var _this = void 0;

var store = new Vuex.Store({
  strict: true,
  state: {
    touapi: [],
    touaccesstime: '',
    detail: [],
    lastdetailaccess: '',
    event_stats: [],
    players: [],
    result_data: [],
    total_players: null,
    error: '',
    loading: true,
    login_loading: false,
    login_success: false,
    accessToken: localStorage.getItem('t_token') || '',
    user_data: localStorage.getItem('t_user') || '',
    ongoing: false,
    currentPage: null,
    WPtotal: null,
    WPpages: null,
    category: '',
    parentslug: '',
    event_title: '',
    tourney_title: '',
    logo_url: '',
    total_rounds: null,
    final_round_stats: [],
    rating_stats: [],
    showstats: false,
    player_last_rd_data: [],
    playerdata: [],
    player: null,
    all_players: [],
    all_players_tou_data: [],
    player_stats: []
  },
  getters: {
    PLAYER_STATS: function PLAYER_STATS(state) {
      return state.player_stats;
    },
    LASTRDDATA: function LASTRDDATA(state) {
      return state.player_last_rd_data;
    },
    PLAYERDATA: function PLAYERDATA(state) {
      return state.playerdata;
    },
    PLAYER: function PLAYER(state) {
      return state.player;
    },
    ALL_PLAYERS: function ALL_PLAYERS(state) {
      return state.all_players;
    },
    ALL_PLAYERS_TOU_DATA: function ALL_PLAYERS_TOU_DATA(state) {
      return state.all_players_tou_data;
    },
    SHOWSTATS: function SHOWSTATS(state) {
      return state.showstats;
    },
    TOUAPI: function TOUAPI(state) {
      return state.touapi;
    },
    TOUACCESSTIME: function TOUACCESSTIME(state) {
      return state.touaccesstime;
    },
    DETAIL: function DETAIL(state) {
      return state.detail;
    },
    LASTDETAILACCESS: function LASTDETAILACCESS(state) {
      return state.lastdetailaccess;
    },
    EVENTSTATS: function EVENTSTATS(state) {
      return state.event_stats;
    },
    PLAYERS: function PLAYERS(state) {
      return state.players;
    },
    TOTALPLAYERS: function TOTALPLAYERS(state) {
      return state.total_players;
    },
    RESULTDATA: function RESULTDATA(state) {
      return state.result_data;
    },
    RATING_STATS: function RATING_STATS(state) {
      return state.rating_stats;
    },
    ERROR: function ERROR(state) {
      return state.error;
    },
    LOADING: function LOADING(state) {
      return state.loading;
    },
    ACCESS_TOKEN: function ACCESS_TOKEN(state) {
      return state.accessToken;
    },
    USER: function USER(state) {
      return JSON.parse(state.user_data);
    },
    LOGIN_LOADING: function LOGIN_LOADING(state) {
      return state.login_loading;
    },
    LOGIN_SUCCESS: function LOGIN_SUCCESS(state) {
      return state.login_success;
    },
    CURRPAGE: function CURRPAGE(state) {
      return state.currentPage;
    },
    WPTOTAL: function WPTOTAL(state) {
      return state.WPtotal;
    },
    WPPAGES: function WPPAGES(state) {
      return state.WPpages;
    },
    CATEGORY: function CATEGORY(state) {
      return state.category;
    },
    TOTAL_ROUNDS: function TOTAL_ROUNDS(state) {
      return state.total_rounds;
    },
    FINAL_ROUND_STATS: function FINAL_ROUND_STATS(state) {
      return state.final_round_stats;
    },
    PARENTSLUG: function PARENTSLUG(state) {
      return state.parentslug;
    },
    EVENT_TITLE: function EVENT_TITLE(state) {
      return state.event_title;
    },
    TOURNEY_TITLE: function TOURNEY_TITLE(state) {
      return state.tourney_title;
    },
    ONGOING_TOURNEY: function ONGOING_TOURNEY(state) {
      return state.ongoing;
    },
    LOGO_URL: function LOGO_URL(state) {
      return state.logo_url;
    }
  },
  mutations: {
    SET_SHOWSTATS: function SET_SHOWSTATS(state, payload) {
      state.showstats = payload;
    },
    SET_FINAL_RD_STATS: function SET_FINAL_RD_STATS(state, resultstats) {
      var len = resultstats.length;

      if (len > 1) {
        state.final_round_stats = _.last(resultstats);
      }
    },
    SET_TOUDATA: function SET_TOUDATA(state, payload) {
      state.touapi = payload;
    },
    SET_EVENTDETAIL: function SET_EVENTDETAIL(state, payload) {
      state.detail = payload;
    },
    SET_LAST_ACCESS_TIME: function SET_LAST_ACCESS_TIME(state, payload) {
      state.touaccesstime = payload;
    },
    SET_DETAIL_LAST_ACCESS_TIME: function SET_DETAIL_LAST_ACCESS_TIME(state, payload) {
      state.lastdetailaccess = payload;
    },
    SET_WP_CONSTANTS: function SET_WP_CONSTANTS(state, payload) {
      state.WPpages = payload['x-wp-totalpages'];
      state.WPtotal = payload['x-wp-total'];
    },
    SET_PLAYERS: function SET_PLAYERS(state, payload) {
      var a = payload.map(function (val, index, key) {
        // console.log(key[index]['post_title']);
        key[index]['tou_no'] = index + 1;
        return val;
      });
      state.total_players = payload.length;
      state.players = a;
    },
    SET_ALL_PLAYERS: function SET_ALL_PLAYERS(state, payload) {
      state.all_players = payload;
    },
    SET_ALL_PLAYERS_TOU_DATA: function SET_ALL_PLAYERS_TOU_DATA(state, payload) {
      state.all_players_tou_data.push(payload);
    },
    SET_RATING_STATS: function SET_RATING_STATS(state, payload) {
      state.rating_stats = payload;
    },
    SET_RESULT: function SET_RESULT(state, payload) {
      var p = state.players;

      var r = _.map(payload, function (z) {
        return _.map(z, function (o) {
          var i = o.pno - 1;
          o.photo = p[i].photo;
          o.id = p[i].id;
          o.country = p[i].country;
          o.country = p[i].country;
          o.country_full = p[i].country_full;
          o.gender = p[i].gender;
          o.is_team = p[i].is_team;
          var x = o.oppo_no - 1;
          o.opp_photo = p[x].photo;
          o.opp_id = p[x].id;
          return o;
        });
      }); // console.log(r);


      state.result_data = r;
    },
    SET_ONGOING: function SET_ONGOING(state, payload) {
      state.ongoing = payload;
    },
    SET_EVENTSTATS: function SET_EVENTSTATS(state, payload) {
      state.event_stats = payload;
    },
    SET_CURRPAGE: function SET_CURRPAGE(state, payload) {
      state.currentPage = payload;
    },
    SET_ERROR: function SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_LOADING: function SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_USER_DATA: function SET_USER_DATA(state, payload) {
      state.user_data = payload;
    },
    SET_LOGIN_SUCCESS: function SET_LOGIN_SUCCESS(state, payload) {
      state.login_success = payload;
    },
    SET_LOGIN_LOADING: function SET_LOGIN_LOADING(state, payload) {
      state.login_loading = payload;
    },
    SET_TOTAL_ROUNDS: function SET_TOTAL_ROUNDS(state, payload) {
      state.total_rounds = payload;
    },
    SET_CATEGORY: function SET_CATEGORY(state, payload) {
      state.category = payload;
    },
    SET_TOURNEY_TITLE: function SET_TOURNEY_TITLE(state, payload) {
      state.tourney_title = payload;
    },
    SET_PARENTSLUG: function SET_PARENTSLUG(state, payload) {
      state.parentslug = payload;
    },
    SET_EVENT_TITLE: function SET_EVENT_TITLE(state, payload) {
      state.event_title = payload;
    },
    SET_LOGO_URL: function SET_LOGO_URL(state, payload) {
      state.logo_url = payload;
    },
    //
    COMPUTE_PLAYER_STATS: function COMPUTE_PLAYER_STATS(state, payload) {
      var len = state.result_data.length;
      var lastround = state.result_data[len - 1];

      var player = state.player = _.filter(state.players, {
        id: payload
      });

      var name = _.map(player, 'post_title') + ''; // convert to string

      var player_tno = parseInt(_.map(player, 'tou_no'));
      state.player_last_rd_data = _.find(lastround, {
        pno: player_tno
      });

      var pdata = state.playerdata = _.chain(state.result_data).map(function (m) {
        return _.filter(m, {
          pno: player_tno
        });
      }).value();

      var allScores = state.player_stats.allScores = _.chain(pdata).map(function (m) {
        var scores = _.flattenDeep(_.map(m, 'score'));

        return scores;
      }).value();

      var allOppScores = state.player_stats.allOppScores = _.chain(pdata).map(function (m) {
        var oppscores = _.flattenDeep(_.map(m, 'oppo_score'));

        return oppscores;
      }).value();

      state.player_stats.allRanks = _.chain(pdata).map(function (m) {
        var r = _.flattenDeep(_.map(m, 'position'));

        return r;
      }).value();
      var pHiScore = state.player_stats.pHiScore = _.maxBy(allScores) + '';
      var pLoScore = state.player_stats.pLoScore = _.minBy(allScores) + '';
      state.player_stats.pHiOppScore = _.maxBy(allOppScores) + '';
      state.player_stats.pLoOppScore = _.minBy(allOppScores) + '';

      var pHiScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pHiScore);
      }, _this), 'round');

      var pLoScoreRounds = _.map(_.filter(_.flattenDeep(pdata), function (d) {
        return d.score == parseInt(pLoScore);
      }, _this), 'round');

      state.player_stats.pHiScoreRounds = pHiScoreRounds.join();
      state.player_stats.pLoScoreRounds = pLoScoreRounds.join();

      var pRbyR = _.map(pdata, function (t) {
        return _.map(t, function (l) {
          var result = '';

          if (l.result === 'win') {
            result = 'won';
          } else if (l.result === 'awaiting') {
            result = 'AR';
          } else if (l.result === 'draw') {
            result = 'drew';
          } else {
            result = 'lost';
          }

          var starting = 'replying';

          if (l.start == 'y') {
            starting = 'starting';
          }

          if (result == 'AR') {
            l.report = 'In round ' + l.round + ' ' + name + '<em v-if="l.start">, (' + starting + ')</em> is playing <strong>' + l.oppo + '</strong>. Results are being awaited';
          } else {
            l.report = 'In round ' + l.round + ' ' + name + '<em v-if="l.start">, (' + starting + ')</em> played <strong>' + l.oppo + '</strong> and ' + result + ' <em>' + l.score + ' - ' + l.oppo_score + ',</em> a difference of ' + l.diff + '. <span class="summary"><em>' + name + '</em> is ranked <strong>' + l.position + '</strong> with <strong>' + l.points + '</strong> points and a cumulative spread of ' + l.margin + ' </span>';
          }

          return l;
        });
      });

      state.player_stats.pRbyR = _.flattenDeep(pRbyR);

      var allWins = _.map(_.filter(_.flattenDeep(pdata), function (p) {
        return 'win' == p.result;
      }));

      state.player_stats.startWins = _.filter(allWins, ['start', 'y']).length;
      state.player_stats.replyWins = _.filter(allWins, ['start', 'n']).length;

      var starts = _.map(_.filter(_.flattenDeep(pdata), function (p) {
        if (p.start == 'y') {
          return p;
        }
      }));

      state.player_stats.starts = starts.length;
      state.player_stats.replies = state.total_rounds - starts.length;
    }
  },
  actions: {
    DO_STATS: function DO_STATS(context, payload) {
      context.commit('SET_SHOWSTATS', payload);
    },
    AUTH_TOKEN: function AUTH_TOKEN(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var url, response, res;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = "".concat(_config.authURL, "token/validate"); //let url = postURL;

                payload = JSON.parse(payload);
                _context.prev = 2;
                _context.next = 5;
                return axios.post(url, {
                  title: 'Plius Alittle test API Posting',
                  content: 'Another minor Post from WP API',
                  status: 'publish'
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer  ".concat(payload)
                  }
                });

              case 5:
                response = _context.sent;
                res = response.data; // console.log(res);

                if (res.code == "jwt_auth_valid_token") {
                  context.commit('SET_LOGIN_SUCCESS', true);
                }

                _context.next = 14;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](2);
                context.commit('SET_LOGIN_SUCCESS', false);
                context.commit('SET_ERROR', _context.t0.toString());

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 10]]);
      }))();
    },
    DO_LOGIN: function DO_LOGIN(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var url, response, data;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                context.commit('SET_LOGIN_LOADING', true);
                url = "".concat(_config.authURL, "token");
                _context2.next = 4;
                return axios.post(url, {
                  username: payload.user,
                  password: payload.pass
                });

              case 4:
                response = _context2.sent;

                try {
                  data = response.data;

                  if (data.token) {
                    localStorage.setItem('t_token', JSON.stringify(data.token));
                    localStorage.setItem('t_user', JSON.stringify(data.user_display_name));
                    console.log(data);
                    context.commit('SET_LOGIN_LOADING', false);
                    context.commit('SET_LOGIN_SUCCESS', true);
                  } else {
                    context.commit('SET_LOGIN_LOADING', false);
                    context.commit('SET_LOGIN_SUCCESS', false);
                  }
                } catch (err) {
                  context.commit('SET_LOGIN_LOADING', false);
                  context.commit('SET_LOGIN_SUCCESS', false);
                  context.commit('SET_ERROR', err.message.toString());
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    GET_ALL_PLAYERS: function GET_ALL_PLAYERS(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        var url, response, r, data;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = "".concat(_config.profileURL);
                _context3.next = 3;
                return axios.get(url, {//params: { page: payload },
                  // headers: {'Authorization': `Bearer  ${token}`}
                });

              case 3:
                response = _context3.sent;

                try {
                  r = response.data;
                  data = _.map(r, function (d) {
                    d.country = d.country.toLowerCase();
                    d.gender = d.gender.toLowerCase();
                    return d;
                  });
                  context.commit('SET_ALL_PLAYERS', data);
                } catch (e) {
                  context.commit('SET_ERROR', e.toString());
                }

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    GET_PLAYER_TOU_DATA: function GET_PLAYER_TOU_DATA(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        var url, response, data;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = "".concat(_config.statsURL).concat(payload);
                _context4.next = 3;
                return axios.get(url, {//params: { page: payload },
                  // headers: {'Authorization': `Bearer  ${token}`}
                });

              case 3:
                response = _context4.sent;

                try {
                  data = response.data;
                  data.country = data.country.toLowerCase();
                  data.gender = data.gender.toLowerCase();
                  context.commit('SET_ALL_PLAYERS_TOU_DATA', data);
                } catch (e) {
                  context.commit('SET_ERROR', e.toString());
                }

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    FETCH_API: function FETCH_API(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        var url, response, headers, data;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config.baseURL, "tournament"); // let token = context.getters.ACCESS_TOKEN

                _context5.next = 4;
                return axios.get(url, {
                  params: {
                    page: payload
                  } // headers: {'Authorization': `Bearer  ${token}`}

                });

              case 4:
                response = _context5.sent;

                try {
                  headers = response.headers; //  console.log('Getting lists of tournaments');

                  data = response.data.map(function (data) {
                    // Format and assign Tournament start date into a letiable
                    var startDate = data.start_date;
                    data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                    return data;
                  }); //console.log(moment(headers.date));

                  console.log("%c" + moment(headers.date), "font-size:30px;color:green;");
                  context.commit('SET_LAST_ACCESS_TIME', headers.date);
                  context.commit('SET_WP_CONSTANTS', headers);
                  context.commit('SET_TOUDATA', data);
                  context.commit('SET_CURRPAGE', payload);
                  context.commit('SET_LOADING', false);
                } catch (error) {
                  context.commit('SET_LOADING', false);
                  context.commit('SET_ERROR', error.toString());
                }

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        var url, response, headers, data, startDate;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config.baseURL, "tournament");
                _context6.prev = 2;
                _context6.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context6.sent;
                headers = response.headers;
                data = response.data[0];
                startDate = data.start_date;
                data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_DETAIL_LAST_ACCESS_TIME', headers.date);
                context.commit('SET_EVENTDETAIL', data);
                context.commit('SET_LOADING', false);
                _context6.next = 20;
                break;

              case 16:
                _context6.prev = 16;
                _context6.t0 = _context6["catch"](2);
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', _context6.t0.toString());

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[2, 16]]);
      }))();
    },
    FETCH_DATA: function FETCH_DATA(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7() {
        var url, response, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds, rating_stats;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                context.commit('SET_LOADING', true); // console.log(context);

                url = "".concat(_config.baseURL, "t_data");
                _context7.prev = 2;
                _context7.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context7.sent;
                data = response.data[0];
                players = data.players;
                results = JSON.parse(data.results); // console.log('FETCH DATA $store')
                // console.log(data);

                category = data.event_category[0].name.toLowerCase();
                logo = data.tourney[0].event_logo.guid;
                tourney_title = data.tourney[0].post_title;
                parent_slug = data.tourney[0].post_name;
                event_title = tourney_title + ' (' + category + ')';
                total_rounds = results.length;
                context.commit('SET_EVENTSTATS', data.tourney);
                context.commit('SET_ONGOING', data.ongoing);
                context.commit('SET_PLAYERS', players);
                context.commit('SET_RESULT', results);
                rating_stats = null;

                if (data.stats_json) {
                  rating_stats = JSON.parse(data.stats_json);
                }

                context.commit('SET_RATING_STATS', rating_stats);
                context.commit('SET_FINAL_RD_STATS', results);
                context.commit('SET_CATEGORY', category);
                context.commit('SET_LOGO_URL', logo);
                context.commit('SET_TOURNEY_TITLE', tourney_title);
                context.commit('SET_EVENT_TITLE', event_title);
                context.commit('SET_TOTAL_ROUNDS', total_rounds);
                context.commit('SET_PARENTSLUG', parent_slug);
                context.commit('SET_LOADING', false);
                _context7.next = 36;
                break;

              case 32:
                _context7.prev = 32;
                _context7.t0 = _context7["catch"](2);
                context.commit('SET_ERROR', _context7.t0.toString());
                context.commit('SET_LOADING', false);

              case 36:
                ;

              case 37:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[2, 32]]);
      }))();
    },
    FETCH_RESDATA: function FETCH_RESDATA(context, payload) {
      context.commit('SET_LOADING', true);
      var url = "".concat(_config.baseURL, "t_data");
      axios.get(url, {
        params: {
          slug: payload
        }
      }).then(function (response) {
        var data = response.data[0];
        var players = data.players;
        var results = JSON.parse(data.results);
        var category = data.event_category[0].name.toLowerCase();
        var logo = data.tourney[0].event_logo.guid;
        var tourney_title = data.tourney[0].post_title;
        var parent_slug = data.tourney[0].post_name;
        var event_title = tourney_title + ' (' + category + ')';
        var total_rounds = results.length;
        context.commit('SET_EVENTSTATS', data.tourney);
        context.commit('SET_ONGOING', data.ongoing);
        context.commit('SET_PLAYERS', players);
        context.commit('SET_RESULT', results);
        context.commit('SET_FINAL_RD_STATS', results);
        context.commit('SET_CATEGORY', category);
        context.commit('SET_LOGO_URL', logo);
        context.commit('SET_TOURNEY_TITLE', tourney_title);
        context.commit('SET_EVENT_TITLE', event_title);
        context.commit('SET_TOTAL_ROUNDS', total_rounds);
        context.commit('SET_PARENTSLUG', parent_slug);
        context.commit('SET_LOADING', false);
      })["catch"](function (error) {
        context.commit('SET_ERROR', error.toString());
        console.log(error);
        context.commit('SET_LOADING', false);
      });
    }
  }
}); // export default store;

exports["default"] = store;

},{"./config.js":6,"@babel/runtime/helpers/asyncToGenerator":1,"@babel/runtime/helpers/interopRequireDefault":3,"@babel/runtime/regenerator":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Byb2ZpbGUuanMiLCJ2dWUvcGFnZXMvcmF0aW5nX3N0YXRzLmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc2NvcmVzaGVldC5qcyIsInZ1ZS9wYWdlcy9zdGF0cy5qcyIsInZ1ZS9wYWdlcy90b3AuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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OUI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsWUFBZixFQUE2QixPQUE3QjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvQkFBZixFQUFxQyxPQUFyQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLFFBQS9CO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsRUFBK0IsSUFBL0I7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsYUFBcEM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsaUJBQWYsRUFBa0MsV0FBbEM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsa0JBQWYsRUFBbUMsWUFBbkM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsV0FBakM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNDLE9BdEJELFdBc0JTLFVBQUEsS0FBSyxFQUFHO0FBQ2pCLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLEtBQUssQ0FBQyxRQUFOLEVBQTVCO0FBQ0EsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNELE9BMUJDO0FBMkJMO0FBMU5NO0FBdlRrQixDQUFmLENBQWQsQyxDQXFoQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJjb25zdCBiYXNlVVJMID0gJy93cC1qc29uL3dwL3YyLyc7XHJcbmNvbnN0IGF1dGhVUkwgPSAnL3dwLWpzb24vand0LWF1dGgvdjEvJztcclxuY29uc3QgcHJvZmlsZVVSTCA9ICcvd3AtanNvbi90b3VzL3YxL3BsYXllcnMnO1xyXG5jb25zdCBzdGF0c1VSTCA9ICcvd3AtanNvbi90b3VzL3YxL3N0YXRzLyc7XHJcbmV4cG9ydCB7IGJhc2VVUkwsIGF1dGhVUkwsIHByb2ZpbGVVUkwsIHN0YXRzVVJMICB9O1xyXG5cclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUuanMnO1xyXG5pbXBvcnQgc2NyTGlzdCBmcm9tICcuL3BhZ2VzL2xpc3QuanMnO1xyXG5pbXBvcnQgdERldGFpbCBmcm9tICcuL3BhZ2VzL2RldGFpbC5qcyc7XHJcbmltcG9ydCBDYXRlRGV0YWlsIGZyb20gJy4vcGFnZXMvY2F0ZWdvcnkuanMnO1xyXG5pbXBvcnQgc0NhcmQgZnJvbSAnLi9wYWdlcy9zY29yZXNoZWV0LmpzJztcclxuXHJcblZ1ZS5maWx0ZXIoJ2FiYnJ2JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICAnJztcclxuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgdmFyIGZpcnN0ID0gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XHJcbiAgdmFyIG4gPSB2YWx1ZS50cmltKCkuc3BsaXQoXCIgXCIpO1xyXG4gIHZhciBsYXN0ID0gbltuLmxlbmd0aCAtIDFdO1xyXG4gIHJldHVybiBmaXJzdCArIFwiLiBcIiArIGxhc3Q7XHJcbn0pO1xyXG5cclxuVnVlLmZpbHRlcignZmlyc3RjaGFyJywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSk7XHJcblxyXG5WdWUuZmlsdGVyKCdsb3dlcmNhc2UnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHJldHVybiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG59KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBuID0gTWF0aC5mbG9vcihOdW1iZXIodmFsdWUpKTtcclxuICBpZiAobiAhPT0gSW5maW5pdHkgJiYgU3RyaW5nKG4pID09PSB2YWx1ZSAmJiBuID4gMCkge1xyXG4gICAgcmV0dXJuICcrJyArIHZhbHVlO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn0pO1xyXG5cclxuVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodmFsdWUpLCBudWxsLCAyKTtcclxufSk7XHJcblxyXG4gIGNvbnN0IHJvdXRlcyA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICBjb21wb25lbnQ6IHNjckxpc3QsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdOU0YgVG91cm5hbWVudHMgLSBSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cy86c2x1ZycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgY29tcG9uZW50OiB0RGV0YWlsLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnVG91cm5hbWVudCBEZXRhaWxzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnJyxcclxuICAgICAgbmFtZTogJ0NhdGVEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IENhdGVEZXRhaWwsXHJcbiAgICAgIHByb3BzOiB0cnVlLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnUmVzdWx0cyBhbmQgU3RhdGlzdGljcycgfSxcclxuICAgICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnLzpwbm8nLFxyXG4gICAgICBuYW1lOiAnU2NvcmVzaGVldCcsXHJcbiAgICAgIGNvbXBvbmVudDogc0NhcmQsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdQbGF5ZXIgU2NvcmVjYXJkcycgfVxyXG4gICAgfVxyXG4gIF07XHJcblxyXG5jb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHtcclxuICBtb2RlOiAnaGlzdG9yeScsXHJcbiAgcm91dGVzOiByb3V0ZXMsIC8vIHNob3J0IGZvciBgcm91dGVzOiByb3V0ZXNgXHJcbn0pO1xyXG5yb3V0ZXIuYmVmb3JlRWFjaCgodG8sIGZyb20sIG5leHQpID0+IHtcclxuICBkb2N1bWVudC50aXRsZSA9IHRvLm1ldGEudGl0bGU7XHJcbiAgbmV4dCgpO1xyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gIGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyksXHJcbiAgcm91dGVyLFxyXG4gIHN0b3JlXHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBMb2FkaW5nQWxlcnQgPSBWdWUuY29tcG9uZW50KCdsb2FkaW5nJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgbWF4LXZ3LTc1IG10LTVcIj5cclxuXHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImxkcy1ibG9ja3MgbXQtNVwiIHdpZHRoPVwiMjAwcHhcIiAgaGVpZ2h0PVwiMjAwcHhcIiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwKSBub25lIHJlcGVhdCBzY3JvbGwgMCUgMCU7XCI+PHJlY3QgeD1cIjE5XCIgeT1cIjE5XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNDBcIiB5PVwiMTlcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuMTVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCIxOVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC4zc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiMTlcIiB5PVwiNDBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjEuMDVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCI0MFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC40NDk5OTk5OTk5OTk5OTk5NnNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjE5XCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjg5OTk5OTk5OTk5OTk5OTlzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI0MFwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC43NXNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjYxXCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjFzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjJzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgIDwvcmVjdD48L3N2Zz5cclxuICAgICAgIDxoNCBjbGFzcz1cImRpc3BsYXktMyBiZWJhcyB0ZXh0LWNlbnRlciB0ZXh0LXNlY29uZGFyeVwiPkxvYWRpbmcuLlxyXG4gICAgICAgIDwhLS0gPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nLi48L3NwYW4+XHJcbiAgICAgICAgLS0+XHJcbiAgICAgICA8L2g0PlxyXG4gICAgPC9kaXY+YFxyXG4gfSk7XHJcblxyXG52YXIgRXJyb3JBbGVydCA9VnVlLmNvbXBvbmVudCgnZXJyb3InLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbXQtNSBteC1hdXRvIGQtYmxvY2sgbWF4LXZ3LTc1XCIgcm9sZT1cImFsZXJ0XCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJhbGVydC1oZWFkaW5nIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8c2xvdCBuYW1lPVwiZXJyb3JcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5FcnJvci4uLjwvc3Bhbj5cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yX21zZ1wiPjwvc2xvdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gLFxyXG4gICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICByZXR1cm4ge307XHJcbiAgIH0sXHJcbiB9KTtcclxuIGxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG4gdmFyIExvZ2luRm9ybSA9VnVlLmNvbXBvbmVudCgnbG9naW4nLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvZ2luX3N1Y2Nlc3NcIiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtMiBweS0xXCI+PGkgY2xhc3M9XCJmYXMgZmEtdXNlci1hbHRcIj48L2k+IDxzbWFsbD5XZWxjb21lIHt7dXNlcl9kaXNwbGF5fX08L3NtYWxsPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LTIgcHktMVwiIEBjbGljaz1cImxvZ091dFwiPjxpIHN0eWxlPVwiY29sb3I6dG9tYXRvXCIgY2xhc3M9XCJmYXMgZmEtc2lnbi1vdXQtYWx0IFwiPjwvaT48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZT5cclxuICAgICAgICAgIDxiLWZvcm0gQHN1Ym1pdD1cIm9uU3VibWl0XCIgaW5saW5lIGNsYXNzPVwidy04MCBteC1hdXRvXCI+XHJcbiAgICAgICAgICA8Yi1mb3JtLWludmFsaWQtZmVlZGJhY2sgOnN0YXRlPVwidmFsaWRhdGlvblwiPlxyXG4gICAgICAgICAgICBZb3VyIHVzZXJuYW1lIG9yIHBhc3N3b3JkIG11c3QgYmUgbW9yZSB0aGFuIDEgY2hhcmFjdGVyIGluIGxlbmd0aC5cclxuICAgICAgICAgICAgPC9iLWZvcm0taW52YWxpZC1mZWVkYmFjaz5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNyLW9ubHlcIiBmb3I9XCJpbmxpbmUtZm9ybS1pbnB1dC11c2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDxiLWlucHV0XHJcbiAgICAgICAgICBpZD1cImlubGluZS1mb3JtLWlucHV0LXVzZXJuYW1lXCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiIDpzdGF0ZT1cInZhbGlkYXRpb25cIlxyXG4gICAgICAgICAgY2xhc3M9XCJtYi0yIG1yLXNtLTIgbWItc20tMCBmb3JtLWNvbnRyb2wtc21cIlxyXG4gICAgICAgICAgdi1tb2RlbD1cImZvcm0udXNlclwiID5cclxuICAgICAgICAgIDwvYi1pbnB1dD5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICA8Yi1pbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImlubGluZS1mb3JtLWlucHV0LXBhc3N3b3JkXCIgOnN0YXRlPVwidmFsaWRhdGlvblwiIGNsYXNzPVwiZm9ybS1jb250cm9sLXNtXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHYtbW9kZWw9XCJmb3JtLnBhc3NcIj48L2ItaW5wdXQ+XHJcbiAgICAgICAgICA8L2ItaW5wdXQtZ3JvdXA+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwib3V0bGluZS1kYXJrXCIgc2l6ZT1cInNtXCIgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWwtc20tMlwiPlxyXG4gICAgICAgICAgICA8aSAgOmNsYXNzPVwieydmYS1zYXZlJyA6IGxvZ2luX2xvYWRpbmcgPT0gZmFsc2UsICdmYS1zcGlubmVyIGZhLXB1bHNlJzogbG9naW5fbG9hZGluZyA9PSB0cnVlfVwiIGNsYXNzPVwiZmFzXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9iLWZvcm0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9ybToge1xyXG4gICAgICAgIHBhc3M6JycsXHJcbiAgICAgICAgdXNlcjogJydcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgIH0sXHJcbiAgIG1vdW50ZWQoKSB7XHJcbiAgICBpZih0aGlzLmFjY2Vzcy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnQVVUSF9UT0tFTicsIHRoaXMuYWNjZXNzKTtcclxuICAgICB9XHJcbiAgICAgY29uc29sZS5sb2codGhpcy51c2VyX2Rpc3BsYXkpXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBvblN1Ym1pdChldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5mb3JtKSk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19MT0dJTicsIHRoaXMuZm9ybSk7XHJcbiAgICB9LFxyXG4gICAgbG9nT3V0KCkge1xyXG4gICAgICAvLyAgbG9nb3V0IGZ1bmN0aW9uXHJcbiAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkIGxvZ091dCcpO1xyXG4gICAgfVxyXG4gICB9LFxyXG4gICBjb21wdXRlZDoge1xyXG4gICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICAgbG9naW5fbG9hZGluZzogJ0xPR0lOX0xPQURJTkcnLFxyXG4gICAgICAgbG9naW5fc3VjY2VzczogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gICAgICAgdXNlcl9kaXNwbGF5OiAnVVNFUicsXHJcbiAgICAgICBhY2Nlc3M6ICdBQ0NFU1NfVE9LRU4nXHJcbiAgICAgfSksXHJcblxyXG4gICAgIHZhbGlkYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZvcm0udXNlci5sZW5ndGggPiAxICYmIHRoaXMuZm9ybS5wYXNzLmxlbmd0aCA+IDFcclxuICAgIH0sXHJcbiAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQsIExvZ2luRm9ybSB9O1xyXG5cclxuIiwiaW1wb3J0IHsgUGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c30gZnJvbSAnLi9wbGF5ZXJsaXN0LmpzJztcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0IHsgSGlXaW5zLCBMb1dpbnMsIEhpTG9zcywgQ29tYm9TY29yZXMsIFRvdGFsU2NvcmVzLCBUb3RhbE9wcFNjb3JlcywgQXZlU2NvcmVzLCBBdmVPcHBTY29yZXMsIEhpU3ByZWFkLCBMb1NwcmVhZCB9IGZyb20gJy4vc3RhdHMuanMnO1xyXG5pbXBvcnQgU3RhdHNQcm9maWxlIGZyb20gJy4vcHJvZmlsZS5qcyc7XHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vc2NvcmVib2FyZC5qcyc7XHJcbmltcG9ydCBSYXRpbmdTdGF0cyBmcm9tICcuL3JhdGluZ19zdGF0cy5qcyc7XHJcbmltcG9ydCB0b3BQZXJmb3JtZXJzIGZyb20gJy4vdG9wLmpzJztcclxuZXhwb3J0IHsgQ2F0ZURldGFpbCBhcyBkZWZhdWx0IH07XHJcbmxldCBDYXRlRGV0YWlsID0gVnVlLmNvbXBvbmVudCgnY2F0ZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy10b3BcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cIiEoZXJyb3J8fGxvYWRpbmcpXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwidmlld0luZGV4ICE9OCAmJiB2aWV3SW5kZXggIT01XCIgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLTBcIj5cclxuICAgICAgICAgICAgICAgICAgPGItaW1nIGZsdWlkIGNsYXNzPVwidGh1bWJuYWlsIGxvZ29cIiA6c3JjPVwibG9nb1wiIDphbHQ9XCJldmVudF90aXRsZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwidG90YWxfcm91bmRzKyAnIHJvdW5kcywgJyArIHRvdGFsX3BsYXllcnMgKycgcGxheWVycydcIiB2LXNob3c9XCJ0b3RhbF9yb3VuZHNcIiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj57eyB0b3RhbF9yb3VuZHMgfX0gR2FtZXMge3sgdG90YWxfcGxheWVyc319IDxpIGNsYXNzPVwiZmFzIGZhLXVzZXJzXCI+PC9pPiA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTBcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTBcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MFwiPjxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFBsYXllcnM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0xXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0xXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTFcIj4gPGkgY2xhc3M9XCJmYSBmYS11c2VyLXBsdXNcIj48L2k+IFBhaXJpbmdzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MlwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0yXCI+PGItaWNvbiBpY29uPVwiZG9jdW1lbnQtdGV4dFwiPjwvYi1pY29uPiBSZXN1bHRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlJvdW5kLUJ5LVJvdW5kIFN0YW5kaW5nc1wiIEBjbGljaz1cInZpZXdJbmRleD0zXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0zXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTNcIj48Yi1pY29uIGljb249XCJsaXN0LW9sXCI+PC9iLWljb24+IFN0YW5kaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDYXRlZ29yeSBTdGF0aXN0aWNzXCIgQGNsaWNrPVwidmlld0luZGV4PTRcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTRcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NFwiPjxiLWljb24gaWNvbj1cImJhci1jaGFydC1maWxsXCI+PC9iLWljb24+IFN0YXRpc3RpY3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgIGV2ZW50X3NsdWc6c2x1ZywgcG5vOjF9fVwiPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiPjxiLWljb24gaWNvbj1cImRvY3VtZW50cy1hbHRcIj48L2ItaWNvbj4gU2NvcmVjYXJkczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUm91bmQtQnktUm91bmQgU2NvcmVib2FyZFwiIEBjbGljaz1cInZpZXdJbmRleD01XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTVcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NVwiPjxiLWljb24gaWNvbj1cImRpc3BsYXlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFNjb3JlYm9hcmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiVG9wIDMgUGVyZm9ybWFuY2VzXCIgQGNsaWNrPVwidmlld0luZGV4PTZcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT02XCI+PGItaWNvbiBpY29uPVwiYXdhcmRcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFRvcCBQZXJmb3JtZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlBvc3QtdG91cm5leSBSYXRpbmcgU3RhdGlzdGljc1wiIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9N1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT03XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTdcIj5cclxuICAgICAgICAgICAgICAgIDxiLWljb24gaWNvbj1cImdyYXBoLXVwXCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBSYXRpbmcgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUGxheWVyIFByb2ZpbGUgYW5kIFN0YXRpc3RpY3NcIiAgQGNsaWNrPVwidmlld0luZGV4PThcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09OFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT04XCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJ0cm9waHlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFByb2ZpbGUgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMSBjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzIHAtMCBtLTBcIj4ge3t0YWJfaGVhZGluZ319XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInZpZXdJbmRleCA+MCAmJiB2aWV3SW5kZXggPCA0XCI+XHJcbiAgICAgICAgICAgICAge3sgY3VycmVudFJvdW5kIH19XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJzaG93UGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCJ0b3RhbF9yb3VuZHNcIiB2LW1vZGVsPVwiY3VycmVudFJvdW5kXCIgOnBlci1wYWdlPVwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cInRydWVcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIGNoYW5nZT1cInJvdW5kQ2hhbmdlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvYi1wYWdpbmF0aW9uPlxyXG4gICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTBcIj5cclxuICAgICAgICAgIDxhbGxwbGF5ZXJzIDpzbHVnPVwic2x1Z1wiPjwvYWxscGxheWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT02XCI+XHJcbiAgICAgICAgICA8cGVyZm9ybWVycz48L3BlcmZvcm1lcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09N1wiPlxyXG4gICAgICAgICAgPHJhdGluZ3MgOmNhcHRpb249XCJjYXB0aW9uXCIgOmNvbXB1dGVkX2l0ZW1zPVwiY29tcHV0ZWRfcmF0aW5nX2l0ZW1zXCI+XHJcbiAgICAgICAgICA8L3JhdGluZ3M+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09OFwiPlxyXG4gICAgICAgICAgIDxwcm9maWxlcz48L3Byb2ZpbGVzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTVcIj5cclxuICAgICAgICA8c2NvcmVib2FyZCA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCI+PC9zY29yZWJvYXJkPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTRcIiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMCBjb2xcIj5cclxuICAgICAgICAgICAgICAgIDxiLXRhYnMgY29udGVudC1jbGFzcz1cIm10LTMgc3RhdHNUYWJzXCIgcGlsbHMgc21hbGwgbGF6eSBuby1mYWRlICB2LW1vZGVsPVwidGFiSW5kZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGl3aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaXdpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIExvc3Nlc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaWxvc3MgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGlsb3NzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG93aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sb3dpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJDb21iaW5lZCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbWJvc2NvcmVzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbWJvc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0b3RhbHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9zY29yZScpXCI+PC90b3RhbHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9vcHBzY29yZScpXCI+PC9vcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX3Njb3JlJylcIj48L2F2ZXNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX29wcHNjb3JlJylcIj48L2F2ZW9wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggU3ByZWFkcyBcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlzcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9oaXNwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBTcHJlYWRzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvbG9zcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgIDwvYi10YWJzPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggb2Zmc2V0LW1kLTIgY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8cGFpcmluZ3MgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTFcIj48L3BhaXJpbmdzPlxyXG4gICAgICAgICAgICAgICAgPHJlc3VsdHMgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTJcIj48L3Jlc3VsdHM+XHJcbiAgICAgICAgICAgICAgICA8c3RhbmRpbmdzIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIiB2LWlmPVwidmlld0luZGV4PT0zXCI+PC9zdGFuZGluZ3M+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgYWxscGxheWVyczogUGxheWVyTGlzdCxcclxuICAgIHBhaXJpbmdzOiBQYWlyaW5ncyxcclxuICAgIHJlc3VsdHM6IFJlc3VsdHMsXHJcbiAgICByYXRpbmdzOiBSYXRpbmdTdGF0cyxcclxuICAgIHN0YW5kaW5nczogU3RhbmRpbmdzLFxyXG4gICAgaGl3aW5zOiBIaVdpbnMsXHJcbiAgICBoaWxvc3M6IEhpTG9zcyxcclxuICAgIGxvd2luOiBMb1dpbnMsXHJcbiAgICBjb21ib3Njb3JlczogQ29tYm9TY29yZXMsXHJcbiAgICB0b3RhbHNjb3JlczogVG90YWxTY29yZXMsXHJcbiAgICBvcHBzY29yZXM6IFRvdGFsT3BwU2NvcmVzLFxyXG4gICAgYXZlc2NvcmVzOiBBdmVTY29yZXMsXHJcbiAgICBhdmVvcHBzY29yZXM6IEF2ZU9wcFNjb3JlcyxcclxuICAgIGhpc3ByZWFkOiBIaVNwcmVhZCxcclxuICAgIGxvc3ByZWFkOiBMb1NwcmVhZCxcclxuICAgIC8vICdsdWNreXN0aWZmLXRhYmxlJzogTHVja3lTdGlmZlRhYmxlLFxyXG4gICAgLy8gJ3R1ZmZsdWNrLXRhYmxlJzogVHVmZkx1Y2tUYWJsZVxyXG4gICAgc2NvcmVib2FyZDogU2NvcmVib2FyZCxcclxuICAgIHBlcmZvcm1lcnM6IHRvcFBlcmZvcm1lcnMsXHJcbiAgICBwcm9maWxlczogU3RhdHNQcm9maWxlXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGdhbWVkYXRhOiBbXSxcclxuICAgICAgdGFiSW5kZXg6IDAsXHJcbiAgICAgIHZpZXdJbmRleDogMCxcclxuICAgICAgY3VycmVudFJvdW5kOiAxLFxyXG4gICAgICB0YWJfaGVhZGluZzogJycsXHJcbiAgICAgIGNhcHRpb246ICcnLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgIGNvbXB1dGVkX3JhdGluZ19pdGVtczogW10sXHJcbiAgICAgIGx1Y2t5c3RpZmY6IFtdLFxyXG4gICAgICB0dWZmbHVjazogW10sXHJcbiAgICAgIHRpbWVyOiAnJyxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3SW5kZXg6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBpZiAodmFsICE9IDQpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Vmlldyh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJhdGluZ19zdGF0czoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRWaWV3OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRWaWV3IGZ1bmN0aW9uIHZhbC0+ICcgKyB2YWwpO1xyXG4gICAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGxheWVycyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQYWlyaW5nIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcqUGxheXMgZmlyc3QnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1Jlc3VsdHMgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1Jlc3VsdHMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1N0YW5kaW5ncyBhZnRlciBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnU3RhbmRpbmdzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSBudWxsO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQb3N0IFRvdXJuYW1lbnQgUmF0aW5nIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhdGluZyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gbnVsbDtcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vIHRleHQ6IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KSxcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0ICBiYXNlVVJMICBmcm9tICcuLi9jb25maWcuanMnO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5sZXQgdERldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ3RkZXRhaWwnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgdGV4dC1jZW50ZXIgZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtbGctY2VudGVyIGp1c3RpZnktY29udGVudC1zdGFydFwiPlxyXG4gICAgICAgICAgICA8Yi1pbWcgc2xvdD1cImFzaWRlXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIiBjbGFzcz1cImFsaWduLXNlbGYtY2VudGVyIG1yLTMgcm91bmRlZCBpbWctZmx1aWRcIlxyXG4gICAgICAgICAgICAgIDpzcmM9XCJ0b3VybmV5LmV2ZW50X2xvZ29cIiB3aWR0aD1cIjE1MFwiIGhlaWdodD1cIjE1MFwiIDphbHQ9XCJ0b3VybmV5LmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJteC0xIGRpc3BsYXktNFwiPlxyXG4gICAgICAgICAgICAgIHt7dG91cm5leS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyXCIgaWQ9XCJldmVudC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnN0YXJ0X2RhdGVcIj48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnN0YXJ0X2RhdGV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnZlbnVlXCI+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiB7e3RvdXJuZXkudmVudWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaWY9XCJ0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3JcIj48aSBjbGFzcz1cImZhIGZhLWxlZ2FsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3J9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxoNT5cclxuICAgICAgICAgICAgICBDYXRlZ29yaWVzIDxpIGNsYXNzPVwiZmEgZmEtbGlzdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtZm9yPVwiKGNhdCwgYykgaW4gdG91cm5leS50b3VfY2F0ZWdvcmllc1wiIDprZXk9XCJjXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImNhdC5ldmVudF9pZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnQ2F0ZURldGFpbCcsIHBhcmFtczogeyBzbHVnOiB0b3VybmV5LnNsdWcgLCBldmVudF9zbHVnOmNhdC5ldmVudF9zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7Y2F0LmNhdF9uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gICAgICAgYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHBhZ2V1cmw6IGAke2Jhc2VVUkx9dG91cm5hbWVudGAgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgVG91cm5hbWVudDogJHt0aGlzLnRvdXJuZXkudGl0bGV9YDtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICBpZiAodGhpcy50b3VybmV5LnNsdWcgIT0gdGhpcy5zbHVnKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgdGl0bGUgYmVjYXVzZSBvZiBicmVhZGNydW1ic1xyXG4gICAgICAgIHRoaXMudG91cm5leS50aXRsZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBlID0gdGhpcy50b3VsaXN0LmZpbmQoZXZlbnQgPT4gZXZlbnQuc2x1ZyA9PT0gdGhpcy5zbHVnKTtcclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICBsZXQgbm93ID0gbW9tZW50KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IG1vbWVudCh0aGlzLmxhc3RfYWNjZXNzX3RpbWUpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVfZWxhcHNlZCA9IG5vdy5kaWZmKGEsICdzZWNvbmRzJyk7XHJcbiAgICAgICAgaWYgKHRpbWVfZWxhcHNlZCA8IDMwMCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS1NYXRjaCBGb3VuZCBpbiBUb3VybmV5IExpc3QtLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRpbWVfZWxhcHNlZCk7XHJcbiAgICAgICAgICB0aGlzLnRvdXJuZXkgPSBlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIC8vIHRvdXJuZXk6ICdERVRBSUwnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBsYXN0X2FjY2Vzc190aW1lOiAnVE9VQUNDRVNTVElNRScsXHJcbiAgICAgIHRvdWxpc3Q6ICdUT1VBUEknXHJcbiAgICB9KSxcclxuICAgIHRvdXJuZXk6IHtcclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHN0b3JlLmdldHRlcnMuREVUQUlMO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5jb21taXQoJ1NFVF9FVkVOVERFVEFJTCcsIG5ld1ZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBicmVhZGNydW1iczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ05TRiBOZXdzJyxcclxuICAgICAgICAgIGhyZWY6ICcvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leS50aXRsZSxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMuIFBsZWFzZSByZWZyZXNoIHRvIHRyeSBhZ2FpbiBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHREZXRhaWw7XHJcbiIsImxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5pbXBvcnQge0xvYWRpbmdBbGVydCwgRXJyb3JBbGVydH0gZnJvbSAnLi9hbGVydHMuanMnO1xyXG5sZXQgc2NyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ3Njckxpc3QnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8aDIgY2xhc3M9XCJiZWJhcyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cm9waHlcIj48L2k+IFRvdXJuYW1lbnRzXHJcbiAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCI+XHJcbiAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwiK1dQdG90YWxcIiBAY2hhbmdlPVwiZmV0Y2hMaXN0XCIgdi1tb2RlbD1cImN1cnJlbnRQYWdlXCIgOnBlci1wYWdlPVwiMTBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiAvPlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1tdXRlZFwiPllvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXM7IDxzcGFuIGNsYXNzPVwiZW1waGFzaXplXCI+e3tXUHRvdGFsfX08L3NwYW4+IHRvdXJuYW1lbnRzITwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgIGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiIHYtZm9yPVwiaXRlbSBpbiB0b3VybmV5c1wiIDprZXk9XCJpdGVtLmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnQgdG91cm5leS1saXN0IGFuaW1hdGVkIGJvdW5jZUluTGVmdFwiID5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy01XCI+XHJcbiAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgPGItaW1nIGZsdWlkIGNsYXNzPVwidGh1bWJuYWlsXCJcclxuICAgICAgICAgICAgICAgICAgOnNyYz1cIml0ZW0uZXZlbnRfbG9nb1wiIHdpZHRoPVwiMTAwXCIgIGhlaWdodD1cIjEwMFwiIDphbHQ9XCJpdGVtLmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXItbGctYXV0b1wiPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJtYi0xIGRpc3BsYXktNVwiPlxyXG4gICAgICAgICAgICA8cm91dGVyLWxpbmsgdi1pZj1cIml0ZW0uc2x1Z1wiIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgIHt7aXRlbS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgICA8c21hbGw+PGkgY2xhc3M9XCJmYSBmYS1jYWxlbmRhclwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICB7e2l0ZW0uc3RhcnRfZGF0ZX19XHJcbiAgICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICA8c21hbGw+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICB7e2l0ZW0udmVudWV9fVxyXG4gICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgdi1pZj1cIml0ZW0uc2x1Z1wiIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPHNtYWxsIHRpdGxlPVwiQnJvd3NlIHRvdXJuZXlcIj48aSBjbGFzcz1cImZhIGZhLWxpbmtcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBsaXN0LWlubGluZSB0ZXh0LWNlbnRlciBjYXRlZ29yeS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBteC1hdXRvXCJcclxuICAgICAgICAgICAgICB2LWZvcj1cImNhdGVnb3J5IGluIGl0ZW0udG91X2NhdGVnb3JpZXNcIj57e2NhdGVnb3J5LmNhdF9uYW1lfX08L2xpPlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtbGctZW5kXCI+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cIm15LTAgcHktMFwiPjxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj5Zb3UgYXJlIG9uIHBhZ2Uge3tjdXJyZW50UGFnZX19IG9mIHt7V1BwYWdlc319IHBhZ2VzIHdpdGggPHNwYW4gY2xhc3M9XCJlbXBoYXNpemVcIj57e1dQdG90YWx9fTwvc3Bhbj5cclxuICAgICAgICAgIHRvdXJuYW1lbnRzITwvc21hbGw+PC9wPlxyXG4gICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgIH07XHJcbiAgICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUubG9nKCdMaXN0LmpzIGxvYWRlZCcpXHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdTY3JhYmJsZSBUb3VybmFtZW50cyAtIE5TRic7XHJcbiAgICB0aGlzLmZldGNoTGlzdCh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGZldGNoTGlzdDogZnVuY3Rpb24ocGFnZU51bSkge1xyXG4gICAgICAvL3RoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9BUEknLCBwYWdlTnVtLCB7XHJcbiAgICAgICAgLy8gdGltZW91dDogMzYwMDAwMCAvLzEgaG91ciBjYWNoZVxyXG4gICAgIC8vIH0pO1xyXG4gICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHBhZ2VOdW07XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9BUEknLCBwYWdlTnVtKTtcclxuICAgICAgY29uc29sZS5sb2coJ2RvbmUhJyk7XHJcbiAgICB9LFxyXG5cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgdG91cm5leXM6ICdUT1VBUEknLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBXUHRvdGFsOiAnV1BUT1RBTCcsXHJcbiAgICAgIFdQcGFnZXM6ICdXUFBBR0VTJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFNvcnJ5IHdlIGFyZSBjdXJyZW50bHkgaGF2aW5nIHRyb3VibGUgZmluZGluZyB0aGUgbGlzdCBvZiB0b3VybmFtZW50cy5gO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHNjckxpc3Q7IiwidmFyIHBsYXllcl9taXhlZF9zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3Jhbmtfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzID0gW10gIDtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnID0ge1xyXG4gIHBsb3RPcHRpb25zOiB7XHJcbiAgICByYWRpYWxCYXI6IHtcclxuICAgICAgaG9sbG93OiB7IHNpemU6ICc1MCUnLCB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG59O1xyXG5cclxudmFyIHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBjaGFydDoge1xyXG4gICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB6b29tOiB7XHJcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgc2hhZG93OiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHRvcDogMTgsXHJcbiAgICAgIGxlZnQ6IDcsXHJcbiAgICAgIGJsdXI6IDEwLFxyXG4gICAgICBvcGFjaXR5OiAxXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbJyM3N0I2RUEnLCAnIzU0NTQ1NCddLFxyXG4gIGRhdGFMYWJlbHM6IHtcclxuICAgIGVuYWJsZWQ6IHRydWVcclxuICB9LFxyXG4gIHN0cm9rZToge1xyXG4gICAgY3VydmU6ICdzbW9vdGgnIC8vIHN0cmFpZ2h0XHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgdGV4dDogJycsXHJcbiAgICBhbGlnbjogJ2xlZnQnXHJcbiAgfSxcclxuICBncmlkOiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgcm93OiB7XHJcbiAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICBvcGFjaXR5OiAwLjVcclxuICAgIH0sXHJcbiAgfSxcclxuICB4YXhpczoge1xyXG4gICAgY2F0ZWdvcmllczogW10sXHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgeWF4aXM6IHtcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgbWluOiBudWxsLFxyXG4gICAgbWF4OiBudWxsXHJcbiAgfSxcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgb2Zmc2V0WDogLTVcclxuICB9XHJcbn07XHJcblxyXG52YXIgUGxheWVyU3RhdHMgPSBWdWUuY29tcG9uZW50KCdwbGF5ZXJzdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluTGVmdEJpZ1wiIGlkPVwicGhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXNcIj57e3BsYXllck5hbWV9fVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBpbWctZmx1aWQgbXgtMyBkLWJsb2NrIHNoYWRvdy1zbVwiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwicGxheWVyLnBob3RvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgeWFub25lIG14LTNcIj57e3BzdGF0cy5wUG9zaXRpb259fSBwb3NpdGlvbjwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+IDwhLS0gI3BoZWFkZXItLT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UxIGNsYXNzPVwibS0xXCI+UXVpY2sgU3RhdHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UyIGNsYXNzPVwibS0xXCI+Um91bmQgYnkgUm91bmQgPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMyBjbGFzcz1cIm0tMVwiPkNoYXJ0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDbG9zZVwiIHNpemU9XCJzbVwiIEBjbGljaz1cImNsb3NlQ2FyZCgpXCIgY2xhc3M9XCJtLTFcIiB2YXJpYW50PVwib3V0bGluZS1kYW5nZXJcIiA6ZGlzYWJsZWQ9XCIhc2hvd1wiXHJcbiAgICAgICAgICAgIDpwcmVzc2VkLnN5bmM9XCJzaG93XCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTFcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlF1aWNrIFN0YXRzPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaCBzdGF0c1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlBvaW50czpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBQb2ludHN9fSAvIHt7dG90YWxfcm91bmRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5SYW5rOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFJhbmt9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5IaWdoZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEhpU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wSGlTY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBMb1Njb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBPcHAgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlT3BwfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tLS0gUm91bmQgQnkgUm91bmQgUmVzdWx0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMlwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgIDxoND5Sb3VuZCBCeSBSb3VuZCBTdW1tYXJ5IDwvaDQ+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaFwiIHYtZm9yPVwiKHJlcG9ydCwgaSkgaW4gcHN0YXRzLnBSYnlSXCIgOmtleT1cImlcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtaWY9XCJyZXBvcnQucmVzdWx0PT0nd2luJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2RyYXcnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS13YXJuaW5nXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdsb3NzJ1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tZGFuZ2VyXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdhd2FpdGluZydcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1saWdodFwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tIENoYXJ0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlM1wiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkRvd25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+U3RhdHMgQ2hhcnRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdtaXhlZCcpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCI+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZS1jc3ZcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gTWl4ZWQgU2NvcmVzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgncmFuaycpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0ncmFuaydcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LWxpbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUmFuayBwZXIgUmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCd3aW5zJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCI+PGkgY2xhc3M9XCJmYXMgZmEtYmFsYW5jZS1zY2FsZSBmYS1zdGFja1wiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBTdGFydHMvUmVwbGllcyBXaW5zKCUpPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjaGFydFwiPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIiB0eXBlPWxpbmUgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzTWl4ZWRcIiAvPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIHR5cGU9J2xpbmUnIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdGlvbnNSYW5rXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYW5rXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0nd2lucydcIiB0eXBlPXJhZGlhbEJhciBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRSYWRpYWxcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc1JhZGlhbFwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9iLWNhcmQ+XHJcbiAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgcHJvcHM6IFsncHN0YXRzJ10sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgYXBleGNoYXJ0OiBWdWVBcGV4Q2hhcnRzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGxheWVyOiAnJyxcclxuICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgcGxheWVyTmFtZTogJycsXHJcbiAgICAgIGFsbFNjb3JlczogW10sXHJcbiAgICAgIGFsbE9wcFNjb3JlczogW10sXHJcbiAgICAgIGFsbFJhbmtzOiBbXSxcclxuICAgICAgdG90YWxfcGxheWVyczogbnVsbCxcclxuICAgICAgY2hhcnRNb2RlbDogJ3JhbmsnLFxyXG4gICAgICBzZXJpZXNNaXhlZDogcGxheWVyX21peGVkX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFuazogcGxheWVyX3Jhbmtfc2VyaWVzLFxyXG4gICAgICBzZXJpZXNSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzLFxyXG4gICAgICBjaGFydE9wdFJhZGlhbDogcGxheWVyX3JhZGlhbF9jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uc1Jhbms6IHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyxcclxuICAgICAgY2hhcnRPcHRpb25zOiB7XHJcbiAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgIGhlaWdodDogNDAwLFxyXG4gICAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNoYWRvdzoge1xyXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAnLFxyXG4gICAgICAgICAgICB0b3A6IDE4LFxyXG4gICAgICAgICAgICBsZWZ0OiA3LFxyXG4gICAgICAgICAgICBibHVyOiAxMCxcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JzOiBbJyM4RkJDOEYnLCAnIzU0NTQ1NCddLFxyXG4gICAgICAgIGRhdGFMYWJlbHM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZToge1xyXG4gICAgICAgICAgY3VydmU6ICdzdHJhaWdodCcgLy8gc21vb3RoXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgdGV4dDogJycsXHJcbiAgICAgICAgICBhbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgICAgICAgcm93OiB7XHJcbiAgICAgICAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgY2F0ZWdvcmllczogW10sXHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHRleHQ6ICcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWluOiBudWxsLFxyXG4gICAgICAgICAgbWF4OiBudWxsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgICAgICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgICAgICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgICAgICAgb2Zmc2V0WDogLTVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZG9TY3JvbGwoKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc2VyaWVzUmFkaWFsKVxyXG4gICAgdGhpcy5zaG93ID0gdGhpcy5zaG93U3RhdHM7XHJcbiAgICB0aGlzLmFsbFNjb3JlcyA9IF8uZmxhdHRlbih0aGlzLnBzdGF0cy5hbGxTY29yZXMpO1xyXG4gICAgdGhpcy5hbGxPcHBTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsT3BwU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsUmFua3MgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsUmFua3MpO1xyXG4gICAgdGhpcy51cGRhdGVDaGFydCh0aGlzLmNoYXJ0TW9kZWwpO1xyXG4gICAgdGhpcy50b3RhbF9wbGF5ZXJzID0gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcclxuICAgIHRoaXMucGxheWVyID0gdGhpcy5wc3RhdHMucGxheWVyWzBdO1xyXG4gICAgdGhpcy5wbGF5ZXJOYW1lID0gdGhpcy5wbGF5ZXIucG9zdF90aXRsZTtcclxuICB9LFxyXG4gIGJlZm9yZURlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmNsb3NlQ2FyZCgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG5cclxuICAgIGRvU2Nyb2xsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXHJcbiAgICAgIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge215RnVuY3Rpb24oKX07XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIGhlYWRlclxyXG4gICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaGVhZGVyXCIpO1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gb2YgdGhlIG5hdmJhclxyXG4gICAgICB2YXIgc3RpY2t5ID0gaGVhZGVyLm9mZnNldFRvcDtcclxuICAgICAgdmFyIGggPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgNTA7XHJcblxyXG4gICAgICAvLyBBZGQgdGhlIHN0aWNreSBjbGFzcyB0byB0aGUgaGVhZGVyIHdoZW4geW91IHJlYWNoIGl0cyBzY3JvbGwgcG9zaXRpb24uIFJlbW92ZSBcInN0aWNreVwiIHdoZW4geW91IGxlYXZlIHRoZSBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgZnVuY3Rpb24gbXlGdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKHN0aWNreSArIGgpKSB7XHJcbiAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZChcInN0aWNreVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHNldENoYXJ0Q2F0ZWdvcmllczogZnVuY3Rpb24oKXtcclxuICAgICAgbGV0IHJvdW5kcyA9IF8ucmFuZ2UoMSwgdGhpcy50b3RhbF9yb3VuZHMgKyAxKTtcclxuICAgICAgbGV0IHJkcyA9IF8ubWFwKHJvdW5kcywgZnVuY3Rpb24obnVtKXsgcmV0dXJuICdSZCAnKyBudW07IH0pO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy54YXhpcy5jYXRlZ29yaWVzID0gcmRzO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZUNoYXJ0OiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tVXBkYXRpbmcuLi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuY2hhcnRNb2RlbCA9IHR5cGU7XHJcbiAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnRpdGxlLmFsaWduID0gJ2xlZnQnO1xyXG4gICAgICB2YXIgZmlyc3ROYW1lID0gXy50cmltKF8uc3BsaXQodGhpcy5wbGF5ZXJOYW1lLCAnICcsIDIpWzBdKTtcclxuICAgICAgaWYgKCdyYW5rJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgLy8gdGhpcy4gPSAnYmFyJztcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsudGl0bGUudGV4dCA9YFJhbmtpbmc6ICR7dGhpcy5wbGF5ZXJOYW1lfWA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnlheGlzLm1pbiA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnlheGlzLm1heCA9dGhpcy50b3RhbF9wbGF5ZXJzO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFuayA9IFt7XHJcbiAgICAgICAgICBuYW1lOiBgJHtmaXJzdE5hbWV9IHJhbmsgdGhpcyByZGAsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLmFsbFJhbmtzXHJcbiAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ21peGVkJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRDaGFydENhdGVnb3JpZXMoKVxyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnRpdGxlLnRleHQgPSBgU2NvcmVzOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnlheGlzLm1pbiA9IDEwMDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5tYXggPSA5MDA7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNNaXhlZCA9IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfWAsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuYWxsU2NvcmVzXHJcbiAgICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdPcHBvbmVudCcsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLmFsbE9wcFNjb3Jlc1xyXG4gICAgICAgICB9XVxyXG4gICAgICB9XHJcbiAgICAgIGlmICgnd2lucycgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzPSBbXTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmNvbG9ycyA9W107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5sYWJlbHMudW5zaGlmdCgnU3RhcnRzOiAlIFdpbnMnLCdSZXBsaWVzOiAlIFdpbnMnKTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmNvbG9ycy51bnNoaWZ0KCcjN0NGQzAwJywgJyNCREI3NkInKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYXJ0T3B0UmFkaWFsKTtcclxuICAgICAgICB2YXIgcyA9IF8ucm91bmQoMTAwICogKHRoaXMucHN0YXRzLnN0YXJ0V2lucyAvIHRoaXMucHN0YXRzLnN0YXJ0cyksMSk7XHJcbiAgICAgICAgdmFyIHIgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5yZXBseVdpbnMgLyB0aGlzLnBzdGF0cy5yZXBsaWVzKSwxKTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFkaWFsLnVuc2hpZnQocyxyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBjbG9zZUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tQ2xvc2luZyBDYXJkLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgc2hvd1N0YXRzOiAnU0hPV1NUQVRTJyxcclxuICAgIH0pLFxyXG4gIH0sXHJcblxyXG59KTtcclxuXHJcbnZhciBQbGF5ZXJMaXN0ID0gVnVlLmNvbXBvbmVudCgnYWxscGxheWVycycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1N0YXRzXCI+XHJcbiAgICAgICAgPHBsYXllcnN0YXRzIDpwc3RhdHM9XCJwU3RhdHNcIj48L3BsYXllcnN0YXRzPlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGlkPVwicC1saXN0XCIgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgIDx0cmFuc2l0aW9uLWdyb3VwIHRhZz1cImRpdlwiIG5hbWU9XCJwbGF5ZXJzLWxpc3RcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXJDb2xzIG14LTIgcC0yIG1iLTRcIiB2LWZvcj1cInBsYXllciBpbiBkYXRhXCIgOmtleT1cInBsYXllci5pZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW5cIj5cclxuICAgICAgICAgICAgPGg1IGNsYXNzPVwib3N3YWxkXCI+PHNtYWxsPiN7e3BsYXllci5wbm99fTwvc21hbGw+XHJcbiAgICAgICAgICAgIHt7cGxheWVyLnBsYXllcn19PHNwYW4gY2xhc3M9XCJtbC0yXCIgQGNsaWNrPVwic29ydFBvcygpXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtc2l6ZTowLjhlbVwiPjxpIHYtaWY9XCJhc2NcIiBjbGFzcz1cImZhIGZhLXNvcnQtbnVtZXJpYy1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byBzb3J0IERFU0MgYnkgY3VycmVudCByYW5rXCI+PC9pPjxpIHYtZWxzZSBjbGFzcz1cImZhIGZhLXNvcnQtbnVtZXJpYy11cFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBBU0MgYnkgY3VycmVudCByYW5rXCI+PC9pPjwvc3Bhbj48c3BhbiB2LWlmPVwic29ydGVkXCIgY2xhc3M9XCJtbC0zXCIgQGNsaWNrPVwicmVzdG9yZVNvcnQoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSBjbGFzcz1cImZhIGZhLXVuZG9cIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHJlc2V0IGxpc3RcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0byBteS0xXCIgIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtYXV0byBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIiA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm1sLTIgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAnZmEtZmVtYWxlJzogcGxheWVyLmdlbmRlciA9PSAnZicsXHJcbiAgICAgICAgJ2ZhLXVzZXJzJzogcGxheWVyLmlzX3RlYW0gPT0gJ3llcycgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiY29sb3I6dG9tYXRvOyBmb250LXNpemU6MS40ZW1cIiBjbGFzcz1cIm1sLTVcIiB2LWlmPVwic29ydGVkXCI+e3twbGF5ZXIucG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgdGV4dC1jZW50ZXIgYW5pbWF0ZWQgZmFkZUluIHBnYWxsZXJ5XCI+XHJcbiAgICAgICAgICAgICAgPGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiA6aWQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1ibG9jayBtdC0yIG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICA8c3BhbiBAY2xpY2s9XCJzaG93UGxheWVyU3RhdHMocGxheWVyLmlkKVwiIHRpdGxlPVwiU2hvdyAgc3RhdHNcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWwtNFwiIHRpdGxlPVwiU2hvdyBTY29yZWNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIGV4YWN0IDp0bz1cInsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgIGV2ZW50X3NsdWc6c2x1ZywgcG5vOnBsYXllci5wbm99fVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwhLS0tcG9wb3ZlciAtLT5cclxuICAgICAgICAgICAgICA8Yi1wb3BvdmVyIEBzaG93PVwiZ2V0TGFzdEdhbWVzKHBsYXllci5wbm8pXCIgcGxhY2VtZW50PVwiYm90dG9tXCIgIDp0YXJnZXQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiIHRyaWdnZXJzPVwiaG92ZXJcIiBib3VuZGFyeS1wYWRkaW5nPVwiNVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLXN0YXJ0IG1yLTIganVzdGlmeS1jb250ZW50LWFyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtZ3Jvdy0xIGFsaWduLXNlbGYtY2VudGVyXCIgc3R5bGU9XCJmb250LXNpemU6MS41ZW07XCI+e3ttc3RhdC5wb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtc2hyaW5rLTEgZC1pbmxpbmUtYmxvY2sgdGV4dC1tdXRlZFwiPjxzbWFsbD57e21zdGF0LndpbnN9fS17e21zdGF0LmRyYXdzfX0te3ttc3RhdC5sb3NzZXN9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtd3JhcCBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnkgZC1pbmxpbmUtYmxvY2tcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjhlbTsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZVwiPkxhc3QgR2FtZTogUm91bmQge3ttc3RhdC5yb3VuZH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0xIHRleHQtd2hpdGUgc2RhdGEtcmVzIHRleHQtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1pbmZvJzogbXN0YXQucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBtc3RhdC5yZXN1bHQgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IG1zdGF0LnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7bXN0YXQuc2NvcmV9fS17e21zdGF0Lm9wcG9fc2NvcmV9fSAoe3ttc3RhdC5yZXN1bHR8Zmlyc3RjaGFyfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVwibXN0YXQub3BwX3Bob3RvXCIgOmFsdD1cIm1zdGF0Lm9wcG9cIiBjbGFzcz1cInJvdW5kZWQtY2lyY2xlIG0tYXV0byBkLWlubGluZS1ibG9ja1wiIHdpZHRoPVwiMjVcIiBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1pbmZvIGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj48c21hbGw+I3t7bXN0YXQub3Bwb19ub319IHt7bXN0YXQub3Bwb3xhYmJydn19PC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2ItcG9wb3Zlcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L3RyYW5zaXRpb24tZ3JvdXA+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgcGxheWVyc3RhdHM6IFBsYXllclN0YXRzLFxyXG4gIH0sXHJcbiAgcHJvcHM6IFsnc2x1ZyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBTdGF0czoge30sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzcwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzcwcHgnLFxyXG4gICAgICAgIHN0eWxlOiAnY3Vyc29yOiBwb2ludGVyJyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGFGbGF0OiB7fSxcclxuICAgICAgbXN0YXQ6IHt9LFxyXG4gICAgICBkYXRhOiB7fSxcclxuICAgICAgc29ydGVkOiBmYWxzZSxcclxuICAgICAgYXNjOiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICB0aGlzLmRhdGFGbGF0ID0gXy5mbGF0dGVuRGVlcChfLmNsb25lKHJlc3VsdGRhdGEpKTtcclxuICAgIHRoaXMuZGF0YSA9IF8uY2hhaW4ocmVzdWx0ZGF0YSkubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLURBVEEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TGFzdEdhbWVzOiBmdW5jdGlvbiAodG91X25vKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRvdV9ubylcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMuZGF0YUZsYXQpO1xyXG4gICAgICBsZXQgcmVzID0gXy5jaGFpbihjKVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgIHJldHVybiB2LnBubyA9PT0gdG91X25vO1xyXG4gICAgICAgIH0pLnRha2VSaWdodCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubXN0YXQgPSBfLmZpcnN0KHJlcyk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubXN0YXQpXHJcbiAgICB9LFxyXG4gICAgc29ydFBvczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuYXNjID0gIXRoaXMuYXNjO1xyXG4gICAgICBjb25zb2xlLmxvZygnU29ydGluZy4uJyk7XHJcbiAgICAgIGxldCBzb3J0RGlyID0gJ2FzYyc7XHJcbiAgICAgIGlmIChmYWxzZSA9PSB0aGlzLmFzYykge1xyXG4gICAgICAgIHNvcnREaXIgPSAnZGVzYyc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRlZCA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdyYW5rJywgc29ydERpcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHNvcnRlZCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IHNvcnRlZDtcclxuICAgIH0sXHJcbiAgICByZXN0b3JlU29ydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmFzYyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdwbm8nLCAnYXNjJyk7XHJcbiAgICB9LFxyXG4gICAgc2hvd1BsYXllclN0YXRzOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdDT01QVVRFX1BMQVlFUl9TVEFUUycsIGlkKTtcclxuICAgICAgdGhpcy5wU3RhdHMucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmVPcHAgPSB0aGlzLmxhc3RkYXRhLmF2ZV9vcHBfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmUgPSB0aGlzLmxhc3RkYXRhLmF2ZV9zY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucFJhbmsgPSB0aGlzLmxhc3RkYXRhLnJhbms7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb3NpdGlvbiA9IHRoaXMubGFzdGRhdGEucG9zaXRpb247XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb2ludHMgPSB0aGlzLmxhc3RkYXRhLnBvaW50cztcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9PcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsUmFua3MgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxSYW5rcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5hbGxPcHBTY29yZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYnlSID0gdGhpcy5wbGF5ZXJfc3RhdHMucFJieVI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0V2lucyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0V2lucztcclxuICAgICAgdGhpcy5wU3RhdHMuc3RhcnRzID0gdGhpcy5wbGF5ZXJfc3RhdHMuc3RhcnRzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBseVdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBseVdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnJlcGxpZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBsaWVzO1xyXG5cclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJyx0cnVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgICBsYXN0ZGF0YTogJ0xBU1RSRERBVEEnLFxyXG4gICAgICBwbGF5ZXJkYXRhOiAnUExBWUVSREFUQScsXHJcbiAgICAgIHBsYXllcjogJ1BMQVlFUicsXHJcbiAgICAgIHBsYXllcl9zdGF0czogJ1BMQVlFUl9TVEFUUydcclxuICAgIH0pLFxyXG5cclxuICB9XHJcbn0pO1xyXG5cclxuIHZhciBSZXN1bHRzID0gVnVlLmNvbXBvbmVudCgncmVzdWx0cycsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIGhvdmVyIHN0YWNrZWQ9XCJzbVwiIHN0cmlwZWQgZm9vdC1jbG9uZSA6ZmllbGRzPVwicmVzdWx0c19maWVsZHNcIiA6aXRlbXM9XCJyZXN1bHQoY3VycmVudFJvdW5kKVwiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdWx0c19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5yZXN1bHRzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgbGFiZWw6ICcjJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICAvLyB7IGtleTogJ3Bvc2l0aW9uJyxsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOid0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5zY29yZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ09wcG9uZW50JyB9LFxyXG4gICAgICAvLyB7IGtleTogJ29wcF9wb3NpdGlvbicsIGxhYmVsOiAnUG9zaXRpb24nLCdjbGFzcyc6ICd0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnb3Bwb19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9wcG9fc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2RpZmYnLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnLSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0OiBmdW5jdGlvbihyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcblxyXG4gICAgICBfLmZvckVhY2goZGF0YSwgZnVuY3Rpb24ocikge1xyXG4gICAgICAgIGxldCBvcHBfbm8gPSByWydvcHBvX25vJ107XHJcbiAgICAgICAgLy8gRmluZCB3aGVyZSB0aGUgb3Bwb25lbnQncyBjdXJyZW50IHBvc2l0aW9uIGFuZCBhZGQgdG8gY29sbGVjdGlvblxyXG4gICAgICAgIGxldCByb3cgPSBfLmZpbmQoZGF0YSwgeyBwbm86IG9wcF9ubyB9KTtcclxuICAgICAgICByWydvcHBfcG9zaXRpb24nXSA9IHJvdy5wb3NpdGlvbjtcclxuICAgICAgICAvLyBjaGVjayByZXN1bHQgKHdpbiwgbG9zcywgZHJhdylcclxuICAgICAgICBsZXQgcmVzdWx0ID0gci5yZXN1bHQ7XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2luZm8nO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdkcmF3Jykge1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5zb3J0QnkoJ21hcmdpbicpXHJcbiAgICAgICAgLnNvcnRCeSgncG9pbnRzJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxudmFyIFN0YW5kaW5ncyA9IFZ1ZS5jb21wb25lbnQoJ3N0YW5kaW5ncycse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSByZXNwb25zaXZlIHN0YWNrZWQ9XCJzbVwiIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJyZXN1bHQoY3VycmVudFJvdW5kKVwiIDpmaWVsZHM9XCJzdGFuZGluZ3NfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJyYW5rXCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLnZhbHVlLnJhbmt9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInBsYXllclwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5wbGF5ZXJ9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cIndvbkxvc3RcIj48L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cIm1hcmdpblwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5tYXJnaW59fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImxhc3RHYW1lXCI+XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGFuZGluZ3NfZmllbGRzOiBbXSxcclxuICAgICAgaW1nUHJvcHM6IHtcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgYmxvY2s6IHRydWUsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHdpZHRoOiAnMjVweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMjVweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9LFxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zdGFuZGluZ3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JhbmsnLCBjbGFzczogJ3RleHQtY2VudGVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXaW4tRHJhdy1Mb3NzJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS53aW5zfSAtICR7aXRlbS5kcmF3c30gLSAke2l0ZW0ubG9zc2VzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3BvaW50cycsXHJcbiAgICAgICAgbGFiZWw6ICdQb2ludHMnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLmFyID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9KmA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdsYXN0R2FtZScsXHJcbiAgICAgICAgbGFiZWw6ICdMYXN0IEdhbWUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGl0ZW0uc2NvcmUgPT0gMCAmJlxyXG4gICAgICAgICAgICBpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJlxyXG4gICAgICAgICAgICBpdGVtLnJlc3VsdCA9PSAnYXdhaXRpbmcnXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBBd2FpdGluZyByZXN1bHQgb2YgZ2FtZSAke2l0ZW0ucm91bmR9IHZzICR7aXRlbS5vcHBvfWA7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGBhICR7aXRlbS5zY29yZX0tJHtpdGVtLm9wcG9fc2NvcmV9XHJcbiAgICAgICAgICAgICR7aXRlbS5yZXN1bHQudG9VcHBlckNhc2UoKX0gdnMgJHtpdGVtLm9wcG99IGA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICByZXN1bHQocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YVtyb3VuZF0pO1xyXG4gICAgICBfLmZvckVhY2goZGF0YSwgZnVuY3Rpb24ocikge1xyXG4gICAgICAgIGxldCBvcHBfbm8gPSByWydvcHBvX25vJ107XHJcbiAgICAgICAgLy8gRmluZCB3aGVyZSB0aGUgb3Bwb25lbnQncyBjdXJyZW50IHBvc2l0aW9uIGFuZCBhZGQgdG8gY29sbGVjdGlvblxyXG4gICAgICAgIGxldCByb3cgPSBfLmZpbmQoZGF0YSwgeyBwbm86IG9wcF9ubyB9KTtcclxuICAgICAgICByWydvcHBfcG9zaXRpb24nXSA9IHJvd1sncG9zaXRpb24nXTtcclxuICAgICAgICAvLyBjaGVjayByZXN1bHQgKHdpbiwgbG9zcywgZHJhdylcclxuICAgICAgICBsZXQgcmVzdWx0ID0gclsncmVzdWx0J107XHJcblxyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXSA9IFtdO1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnd2luJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnbG9zcycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdkYW5nZXInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnaW5mbyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdkcmF3Jykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLnNvcnRCeSgnbWFyZ2luJylcclxuICAgICAgICAuc29ydEJ5KCdwb2ludHMnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5jb25zdCBQYWlyaW5ncyA9VnVlLmNvbXBvbmVudCgncGFpcmluZ3MnLCAge1xyXG4gIHRlbXBsYXRlOiBgXHJcbjx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWhvdmVyIHRhYmxlLXJlc3BvbnNpdmUgdGFibGUtc3RyaXBlZCAgYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgIDxjYXB0aW9uPnt7Y2FwdGlvbn19PC9jYXB0aW9uPlxyXG4gICAgPHRoZWFkIGNsYXNzPVwidGhlYWQtZGFya1wiPlxyXG4gICAgICAgIDx0cj5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj4jPC90aD5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5QbGF5ZXI8L3RoPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk9wcG9uZW50PC90aD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90aGVhZD5cclxuICAgIDx0Ym9keT5cclxuICAgICAgICA8dHIgdi1mb3I9XCIocGxheWVyLGkpIGluIHBhaXJpbmcoY3VycmVudFJvdW5kKVwiIDprZXk9XCJpXCI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwicm93XCI+e3tpICsgMX19PC90aD5cclxuICAgICAgICA8dGQgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIj48Yi1pbWctbGF6eSB2LWJpbmQ9XCJpbWdQcm9wc1wiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiPjwvYi1pbWctbGF6eT48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0neSdcIj4qPC9zdXA+e3twbGF5ZXIucGxheWVyfX08L3RkPlxyXG4gICAgICAgIDx0ZCA6aWQ9XCIncG9wb3Zlci0nK3BsYXllci5vcHBfaWRcIj48Yi1pbWctbGF6eSB2LWJpbmQ9XCJpbWdQcm9wc1wiIDphbHQ9XCJwbGF5ZXIub3Bwb1wiIDpzcmM9XCJwbGF5ZXIub3BwX3Bob3RvXCI+PC9iLWltZy1sYXp5PjxzdXAgIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0nbidcIj4qPC9zdXA+e3twbGF5ZXIub3Bwb319PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuICA8L3RhYmxlPlxyXG5gLFxyXG5cclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHN0eWxlOidtYXJnaW4tcmlnaHQ6LjVlbScsXHJcbiAgICAgICAgd2lkdGg6ICcyNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcyNXB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICAvLyBnZXQgcGFpcmluZ1xyXG4gICAgcGFpcmluZyhyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgcm91bmRfcmVzID0gdGhpcy5yZXN1bHRkYXRhW3JvdW5kXTtcclxuICAgICAgLy8gU29ydCBieSBwbGF5ZXIgbnVtYmVyaW5nIGlmIHJvdW5kIDEgdG8gb2J0YWluIHJvdW5kIDEgcGFpcmluZ1xyXG4gICAgICBpZiAociA9PT0gMSkge1xyXG4gICAgICAgIHJvdW5kX3JlcyA9IF8uc29ydEJ5KHJvdW5kX3JlcywgJ3BubycpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBwYWlyZWRfcGxheWVycyA9IFtdO1xyXG4gICAgICBsZXQgcnAgPSBfLm1hcChyb3VuZF9yZXMsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gclsncG5vJ107XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKHBhaXJlZF9wbGF5ZXJzLCBwbGF5ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhaXJlZF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKG9wcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNvbXBhY3QocnApO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7UGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c31cclxuXHJcbiIsImV4cG9ydCB7IFN0YXRzUHJvZmlsZSBhcyBkZWZhdWx0IH07XHJcbmxldCBTdGF0c1Byb2ZpbGUgPSBWdWUuY29tcG9uZW50KCdzdGF0c19wcm9maWxlJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtMTAgb2Zmc2V0LTEganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlldz0ncHJvZmlsZSdcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXc9PSdwcm9maWxlJ1wiIDpwcmVzc2VkPVwidmlldz09J3Byb2ZpbGUnXCIgdGl0bGU9XCJQbGF5ZXIgUHJvZmlsZVwiPlxyXG4gICAgICAgIDxiLWljb24gaWNvbj1cInBlcnNvblwiPjwvYi1pY29uPlByb2ZpbGU8L2ItYnV0dG9uPlxyXG4gICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3PSdoZWFkMmhlYWQnXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3PT0naGVhZDJoZWFkJ1wiIDpwcmVzc2VkPVwidmlldz09J2hlYWQyaGVhZCdcIiB0aXRsZT1cIkhlYWQgVG8gSGVhZFwiPjxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+SDJIPC9iLWJ1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxoMyB2LXNob3c9XCJ2aWV3PT0ncHJvZmlsZSdcIiBjbGFzcz1cImJlYmFzXCI+PGItaWNvbiBpY29uPVwicGVyc29uXCI+PC9iLWljb24+IFN0YXRzIFByb2ZpbGU8L2gzPlxyXG4gICAgPGgzIHYtc2hvdz1cInZpZXc9PSdoZWFkMmhlYWQnXCIgY2xhc3M9XCJiZWJhc1wiPjxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+IEhlYWQgdG8gSGVhZDwvaDM+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXc9PSdwcm9maWxlJ1wiPlxyXG4gICAgICA8Yi1mb3JtLXJvdyBjbGFzcz1cIm15LTEgbXgtYXV0b1wiPlxyXG4gICAgICAgIDxiLWNvbCBzbT1cIjJcIiBjbGFzcz1cIm1sLXNtLWF1dG9cIj5cclxuICAgICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2hcIj5FbnRlciBwbGF5ZXIgbmFtZXM8L2xhYmVsPlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiNFwiIGNsYXNzPVwibXItc20tYXV0b1wiPlxyXG4gICAgICAgICAgPGItZm9ybS1pbnB1dCBsaXN0PVwicGxheWVycy1saXN0XCIgc2l6ZT1cInNtXCIgcGxhY2Vob2xkZXI9XCJTdGFydCB0eXBpbmcgcGxheWVyIG5hbWVcIiBpZD1cInNlYXJjaFwiIHYtbW9kZWw9XCJwc2VhcmNoXCIgIEB1cGRhdGU9XCJnZXRwcm9maWxlXCIgdHlwZT1cInNlYXJjaFwiPlxyXG4gICAgICAgICAgPC9iLWZvcm0taW5wdXQ+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgPC9iLWZvcm0tcm93PlxyXG4gICAgICA8Yi1yb3cgdi1zaG93PVwibG9hZGluZ1wiPlxyXG4gICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggdGV4dC1jZW50ZXIgbXktMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItc3Bpbm5lciB0eXBlPVwiZ3Jvd1wiIHZhcmlhbnQ9XCJpbmZvXCIgbGFiZWw9XCJCdXN5XCI+PC9iLXNwaW5uZXI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICA8L2Itcm93PlxyXG4gICAgICA8Yi1yb3cgY29scz1cIjJcIiB2LXNob3c9XCIhbG9hZGluZ1wiPlxyXG4gICAgICAgIDxiLWNvbD5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIHRleHQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBhbmltYXRlZCBmYWRlSW5cIj5cclxuICAgICAgICA8aDQgY2xhc3M9XCJvc3dhbGRcIj57e3BkYXRhLnBsYXllcn19XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG8gbXktMVwiIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsXCI+XHJcbiAgICAgICAgPGkgY2xhc3M9XCJteC1hdXRvIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwZGF0YS5jb3VudHJ5XCIgdGl0bGU9XCJwZGF0YS5jb3VudHJ5X2Z1bGxcIjwvaT5cclxuICAgICAgICA8aSBjbGFzcz1cIm1sLTIgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwZGF0YS5nZW5kZXIgPT0gJ20nLCdmYS1mZW1hbGUnOiBwZGF0YS5nZW5kZXIgPT0gJ2YnLCdmYS11c2Vycyc6IHBkYXRhLmlzX3RlYW0gPT0gJ3llcycgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgPC9oND5cclxuICAgICAgICA8aW1nIDpzcmM9J3BkYXRhLnBob3RvJyA6YWx0PVwicGRhdGEucGxheWVyXCIgdi1iaW5kPVwiaW1nUHJvcHNcIj48L2ltZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJkLWZsZXggdGV4dC1jZW50ZXIgbXktMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItc3Bpbm5lciB0eXBlPVwiZ3Jvd1wiIGxhYmVsPVwiTG9hZGluZ1wiPjwvYi1zcGlubmVyPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInAtMyBtYi0yIGJnLWxpZ2h0IHRleHQtZGFya1wiIHYtZm9yPVwiYyBpbiBwZGF0YS5jb21wZXRpdGlvbnNcIiA6a2V5PVwiYy5pZFwiPlxyXG4gICAgICAgICAgICAgIDxoNiBjbGFzcz1cIm9zd2FsZFwiPnt7Yy50aXRsZX19ICA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogc21hbGxlcjtcIiBjbGFzcz1cImQtaW5saW5lLWJsb2NrXCI+e3tjLmZpbmFsX3JkLnJvdW5kfX0gZ2FtZXM8L3NwYW4+PC9oNj5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQtY2VudGVyIHRleHQtbGlnaHQgYmctZGFya1wiPlBvaW50czoge3tjLmZpbmFsX3JkLnBvaW50c319IFdpbnM6IHt7Yy5maW5hbF9yZC53aW5zfX0gUG9zOiB7e2MuZmluYWxfcmFua319PC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgIDwvYi1yb3c+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3PT0naGVhZDJoZWFkJ1wiPlxyXG4gICAgICA8Yi1mb3JtLXJvdyBjbGFzcz1cIm15LTFcIj5cclxuICAgICAgICA8Yi1jb2wgc209XCIxXCIgY2xhc3M9XCJtbC1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cInNlYXJjaDFcIj5QbGF5ZXIgMTwvbGFiZWw+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2wgc209XCIzXCIgY2xhc3M9XCJtci1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGItZm9ybS1pbnB1dCBwbGFjZWhvbGRlcj1cIlN0YXJ0IHR5cGluZyBwbGF5ZXIgbmFtZVwiIHNpemU9XCJzbVwiIGlkPVwic2VhcmNoMVwiIHYtbW9kZWw9XCJzZWFyY2gxXCIgdHlwZT1cInNlYXJjaFwiPjwvYi1mb3JtLWlucHV0PlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiMVwiIGNsYXNzPVwibWwtc20tYXV0b1wiPlxyXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cIm1sLTJcIiBmb3I9XCJzZWFyY2gyXCI+UGxheWVyIDI8L2xhYmVsPlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiM1wiIGNsYXNzPVwibXItc20tYXV0b1wiPlxyXG4gICAgICAgIDxiLWZvcm0taW5wdXQgc2l6ZT1cInNtXCIgcGxhY2Vob2xkZXI9XCJTdGFydCB0eXBpbmcgcGxheWVyIG5hbWVcIiBpZD1cInNlYXJjaDJcIiB2LW1vZGVsPVwic2VhcmNoMlwiIHR5cGU9XCJzZWFyY2hcIj48L2ItZm9ybS1pbnB1dD5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICA8L2ItZm9ybS1yb3c+XHJcbiAgICAgIDxiLXJvdyBjb2xzPVwiNFwiPlxyXG4gICAgICAgIDxiLWNvbD48L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbD57e3NlYXJjaDF9fTwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sPjwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sPnt7c2VhcmNoMn19PC9iLWNvbD5cclxuICAgICAgPC9iLXJvdz5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGU+XHJcbiAgICA8Yi1mb3JtLWRhdGFsaXN0IDpvcHRpb25zPVwicGxheWVybGlzdFwiIGlkPVwicGxheWVycy1saXN0XCI+PC9iLWZvcm0tZGF0YWxpc3Q+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmlldzogXCJwcm9maWxlXCIsXHJcbiAgICAgIHNob3dUb3VTdGF0czogZmFsc2UsXHJcbiAgICAgIHBzZWFyY2g6IG51bGwsXHJcbiAgICAgIHNlYXJjaDE6IG51bGwsXHJcbiAgICAgIHNlYXJjaDI6IG51bGwsXHJcbiAgICAgIHBkYXRhOiB7fSxcclxuICAgICAgcHNsdWc6IG51bGwsXHJcbiAgICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgYmxvY2s6IHRydWUsXHJcbiAgICAgICAgdGh1bWJuYWlsOiB0cnVlLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjNjY2JyxcclxuICAgICAgICB3aWR0aDogMTUwLFxyXG4gICAgICAgIGhlaWdodDogMTUwLFxyXG4gICAgICAgIGNsYXNzOiAnbWItMyBzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZ2V0UGxheWVycygpO1xyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIGFsbF9wbGF5ZXJzX3RvdToge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICBpZih2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuZ2V0UERhdGEodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRQbGF5ZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdHRVRfQUxMX1BMQVlFUlMnLCBudWxsKTtcclxuICAgIH0sXHJcbiAgICBnZXRQRGF0YTogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucHNsdWcpO1xyXG4gICAgICB2YXIgZGF0YSA9IF8uZmluZCh2LCBbJ3NsdWcnLCB0aGlzLnBzbHVnXSk7XHJcbiAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5wZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRwcm9maWxlOiBmdW5jdGlvbiAoaSkge1xyXG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICBjb25zb2xlLmxvZygnLi5jb21wdXRlZCBpbnB1dC4uJylcclxuICAgICAgY29uc29sZS5sb2coaSk7XHJcbiAgICAgIGxldCBwID0gXy5maW5kKHRoaXMuYWxsX3BsYXllcnMsIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgcmV0dXJuIG8ucGxheWVyID09IGk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAocCkge1xyXG4gICAgICB0aGlzLnBzbHVnID0gcC5zbHVnXHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdHRVRfUExBWUVSX1RPVV9EQVRBJyx0aGlzLnBzbHVnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgYWxsX3BsYXllcnM6ICdBTExfUExBWUVSUycsXHJcbiAgICAgIGFsbF9wbGF5ZXJzX3RvdTogJ0FMTF9QTEFZRVJTX1RPVV9EQVRBJyxcclxuICAgIH0pLFxyXG4gICAgcGxheWVybGlzdDoge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMuYWxsX3BsYXllcnM7XHJcbiAgICAgICAgbGV0IGZwID0gXy5tYXAobiwgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBwLnBsYXllcjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLWZwLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmcCk7XHJcbiAgICAgICAgcmV0dXJuIGZwO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5jb21taXQoJ1NFVF9BTExfUExBWUVSUycsIG5ld1ZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gIH1cclxufSk7XHJcbiIsIlxyXG5leHBvcnQgeyBSYXRpbmdTdGF0cyBhcyBkZWZhdWx0IH07XHJcbmxldCBSYXRpbmdTdGF0cyA9IFZ1ZS5jb21wb25lbnQoJ3JhdGluZ19zdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gUmF0aW5nIFN0YXRzIC0tPlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtOCBvZmZzZXQtMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICA8Yi10YWJsZSByZXNwb25zaXZlPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiY29tcHV0ZWRfaXRlbXNcIiA6ZmllbGRzPVwiZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgICAgPCEtLSBBIHZpcnR1YWwgY29sdW1uIC0tPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKHJhdGluZ19jaGFuZ2UpPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICA8c3BhbiB2LWJpbmQ6Y2xhc3M9XCJ7XHJcbiAgICAgICAgICAgJ3RleHQtaW5mbyc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID09IDAsXHJcbiAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPCAwLFxyXG4gICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA+IDAgfVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaXRlbS5yYXRpbmdfY2hhbmdlfX1cclxuICAgICAgICAgICAgPGkgdi1iaW5kOmNsYXNzPVwie1xyXG4gICAgICAgICAgICAgJ2ZhIGZhLWxvbmctYXJyb3ctbGVmdCc6ZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPT0gMCxcclxuICAgICAgICAgICAgICdmYSBmYS1sb25nLWFycm93LWRvd24nOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA8IDAsXHJcbiAgICAgICAgICAgICAnZmEgZmEtbG9uZy1hcnJvdy11cCc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID4gMCB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwobmFtZSk9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIDxiLWltZy1sYXp5IDp0aXRsZT1cImRhdGEuaXRlbS5uYW1lXCIgOmFsdD1cImRhdGEuaXRlbS5uYW1lXCIgOnNyYz1cImRhdGEuaXRlbS5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAge3tkYXRhLml0ZW0ubmFtZX19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICA8L2ItdGFibGU+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjb21wdXRlZF9pdGVtcyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGljUHJvcHM6IHtcclxuICAgICAgICBibG9jazogZmFsc2UsXHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgd2lkdGg6ICczMHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICczMHB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSwgbXgtMScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGZpZWxkczogW1xyXG4gICAgICAgIHsga2V5OiAncG9zaXRpb24nLCBsYWJlbDogJ1JhbmsnIH0sXHJcbiAgICAgICAgJ25hbWUnLFxyXG4gICAgICAgIHsga2V5OiAncmF0aW5nX2NoYW5nZScsIGxhYmVsOiAnQ2hhbmdlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgICB7IGtleTogJ2V4cGVjdGVkX3dpbnMnLCBsYWJlbDogJ0Uud2lucycgfSxcclxuICAgICAgICB7IGtleTogJ2FjdHVhbF93aW5zJywgbGFiZWw6ICdBLndpbnMnIH0sXHJcbiAgICAgICAgeyBrZXk6ICdvbGRfcmF0aW5nJywgbGFiZWw6ICdPbGQgUmF0aW5nJyAsIHNvcnRhYmxlOiB0cnVlfSxcclxuICAgICAgICB7IGtleTogJ25ld19yYXRpbmcnLCBsYWJlbDogJ05ldyBSYXRpbmcnICwgc29ydGFibGU6IHRydWV9LFxyXG4gICAgICBdLFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxufSk7XHJcbiIsIlxyXG5pbXBvcnQgYmFzZVVSTCBmcm9tICcuLi9jb25maWcuanMnO1xyXG5sZXQgU2NvcmVib2FyZCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlYm9hcmQnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImVycm9yXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gIDwvdGVtcGxhdGU+XHJcbiAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICA8ZGl2IGNsYXNzPVwiY29sXCIgaWQ9XCJzY29yZWJvYXJkXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnMgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgdi1mb3I9XCJpIGluIHJvd0NvdW50XCIgOmtleT1cImlcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1zbS02IGNvbC0xMiBcIiB2LWZvcj1cInBsYXllciBpbiBpdGVtQ291bnRJblJvdyhpKVwiIDprZXk9XCJwbGF5ZXIucmFua1wiPlxyXG4gICAgICAgIDxiLW1lZGlhIGNsYXNzPVwicGItMCBtYi0xIG1yLTFcIiB2ZXJ0aWNhbC1hbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBzbG90PVwiYXNpZGVcIj5cclxuICAgICAgICAgICAgPGItcm93IGNsYXNzPVwianVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgICAgICAgIDxiLWltZyByb3VuZGVkPVwiY2lyY2xlXCIgOnNyYz1cInBsYXllci5waG90b1wiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCIgLz5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNvbHM9XCIxMlwiIG1kPVwiYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGFnLWljb25cIiA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCJcclxuICAgICAgICAgICAgICAgICAgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNvbCBsZz1cIjJcIj5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09PSAnbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09PSAnZicgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIHYtaWY9XCJwbGF5ZXIudGVhbVwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbD48c3Bhbj57e3BsYXllci50ZWFtfX08L3NwYW4+PC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgICAgPGItcm93PlxyXG4gICAgICAgICAgICAgIDxiLWNvbCBjbGFzcz1cInRleHQtd2hpdGVcIiB2LWJpbmQ6Y2xhc3M9XCJ7J3RleHQtd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICd0ZXh0LWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtY2VudGVyIHBvc2l0aW9uICBtdC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgIHt7cGxheWVyLnBvc2l0aW9ufX1cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbG9uZy1hcnJvdy11cCc6IHBsYXllci5yYW5rIDwgcGxheWVyLmxhc3RyYW5rLCdmYS1sb25nLWFycm93LWRvd24nOiBwbGF5ZXIucmFuayA+IHBsYXllci5sYXN0cmFuayxcclxuICAgICAgICAgICAgICAgICAnZmEtYXJyb3dzLWgnOiBwbGF5ZXIucmFuayA9PSBwbGF5ZXIubGFzdHJhbmsgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGg1IGNsYXNzPVwibS0wICBhbmltYXRlZCBmYWRlSW5MZWZ0XCI+e3twbGF5ZXIucGxheWVyfX08L2g1PlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJjYXJkLXRleHQgbXQtMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIHBvaW50cyBwLTFcIj57e3BsYXllci5wb2ludHN9fS17e3BsYXllci5sb3NzZXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBtYXJcIj57e3BsYXllci5tYXJnaW4gfCBhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIubGFzdHBvc2l0aW9uXCIgY2xhc3M9XCJzZGF0YSBwMVwiPndhcyB7e3BsYXllci5sYXN0cG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cImJnLWluZm8gZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yZXN1bHQgfCBmaXJzdGNoYXIgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICB7e3BsYXllci5yZXN1bHQgfCBmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwicGxheWVyLnJlc3VsdCA9PSdhd2FpdGluZycgXCIgY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUgcC0xICBzZGF0YVwiPkF3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICBSZXN1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIHNkYXRhXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+e3twbGF5ZXIuc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgLSB7e3BsYXllci5vcHBvX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHAtMCBtbC0xIG9wcFwiPnZzIHt7cGxheWVyLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWlmPVwicGxheWVyLnByZXZyZXN1bHRzXCIgY2xhc3M9XCJyb3cgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIDp0aXRsZT1cInJlc1wiIHYtZm9yPVwicmVzIGluIHBsYXllci5wcmV2cmVzdWx0c1wiIDprZXk9XCJyZXMua2V5XCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0xIHRleHQtd2hpdGUgc2RhdGEtcmVzIHRleHQtY2VudGVyXCIgdi1iaW5kOmNsYXNzPVwieydiZy13YXJuaW5nJzogcmVzID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1pbmZvJzogcmVzID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcmVzID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1zdWNjZXNzJzogcmVzID09PSAnd2luJyB9XCI+e3tyZXN8Zmlyc3RjaGFyfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2ItbWVkaWE+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPC90ZW1wbGF0ZT5cclxuPC9kaXY+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2N1cnJlbnRSb3VuZCddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXRlbXNQZXJSb3c6IDQsXHJcbiAgICAgIHBlcl9wYWdlOiA0MCxcclxuICAgICAgcGFyZW50X3NsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBwYWdldXJsOiBiYXNlVVJMICsgdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLmV2ZW50X3NsdWcsXHJcbiAgICAgIHJlbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICBwZXJpb2Q6IDAuNSxcclxuICAgICAgdGltZXI6IG51bGwsXHJcbiAgICAgIHNjb3JlYm9hcmRfZGF0YTogW10sXHJcbiAgICAgIHJlc3BvbnNlX2RhdGE6IFtdLFxyXG4gICAgICAvLyBwbGF5ZXJzOiBbXSxcclxuICAgICAgLy8gdG90YWxfcm91bmRzOiAwLFxyXG4gICAgICAvLyBjdXJyZW50Um91bmQ6IG51bGwsXHJcbiAgICAgIGV2ZW50X3RpdGxlOiAnJyxcclxuICAgICAgaXNfbGl2ZV9nYW1lOiB0cnVlLFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyB0aGlzLmZldGNoU2NvcmVib2FyZERhdGEoKTtcclxuICAgIHRoaXMucHJvY2Vzc0RldGFpbHModGhpcy5jdXJyZW50UGFnZSlcclxuICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChcclxuICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcclxuICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICB0aGlzLnBlcmlvZCAqIDYwMDAwXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIGN1cnJlbnRSb3VuZDoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5nZXRXaW5kb3dXaWR0aCk7XHJcbiAgICB0aGlzLmNhbmNlbEF1dG9VcGRhdGUoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFNjb3JlYm9hcmREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzX2xpdmVfZ2FtZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGl0ZW1Db3VudEluUm93OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zY29yZWJvYXJkX2RhdGEuc2xpY2UoXHJcbiAgICAgICAgKGluZGV4IC0gMSkgKiB0aGlzLml0ZW1zUGVyUm93LFxyXG4gICAgICAgIGluZGV4ICogdGhpcy5pdGVtc1BlclJvd1xyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NEZXRhaWxzOiBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnJlc3VsdF9kYXRhKVxyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAgIC8vIGxldCBsYXN0UmREID0gXy5sYXN0KF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgY3IgPSB0aGlzLmN1cnJlbnRSb3VuZCAtIDE7XHJcblxyXG4gICAgICBsZXQgdGhpc1JkRGF0YSA9IF8ubnRoKF8uY2xvbmUocmVzdWx0ZGF0YSksIGNyKTtcclxuICAgICAgY29uc29sZS5sb2coJy0tLS1UaGlzIFJvdW5kIERhdGEtLS0tLScpO1xyXG4gICAgICBjb25zb2xlLmxvZyhjcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXNSZERhdGEpO1xyXG5cclxuICAgICAgbGV0IGluaXRpYWxSZERhdGEgPSBbXTtcclxuICAgICAgbGV0IHByZXZpb3VzUmREYXRhID0gW107XHJcbiAgICAgIGlmKHRoaXMuY3VycmVudFJvdW5kID4gMSlcclxuICAgICAge1xyXG4gICAgICAgIHByZXZpb3VzUmREYXRhID0gXy5udGgoXy5jbG9uZShyZXN1bHRkYXRhKSxjciAtIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tUHJldmlvdXMgUm91bmQgRGF0YS0tLS0tJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocHJldmlvdXNSZERhdGEpO1xyXG4gICAgICAgIGluaXRpYWxSZERhdGEgPSBfLnRha2UoXy5jbG9uZShyZXN1bHRkYXRhKSwgY3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBjdXJyZW50UmREYXRhID0gXy5tYXAodGhpc1JkRGF0YSwgcGxheWVyID0+IHtcclxuICAgICAgICBsZXQgeCA9IHBsYXllci5wbm8gLSAxO1xyXG4gICAgICAgIHBsYXllci5waG90byA9IHRoaXMucGxheWVyc1t4XS5waG90bztcclxuICAgICAgICBwbGF5ZXIuZ2VuZGVyID0gdGhpcy5wbGF5ZXJzW3hdLmdlbmRlcjtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeV9mdWxsID0gdGhpcy5wbGF5ZXJzW3hdLmNvdW50cnlfZnVsbDtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeSA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5O1xyXG4gICAgICAgIGlmIChwcmV2aW91c1JkRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IF8uZmluZChwcmV2aW91c1JkRGF0YSwge1xyXG4gICAgICAgICAgICBwbGF5ZXI6IHBsYXllci5wbGF5ZXIsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHBsYXllci5sYXN0cG9zaXRpb24gPSBwbGF5ZXJEYXRhWydwb3NpdGlvbiddO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3RyYW5rID0gcGxheWVyRGF0YVsncmFuayddO1xyXG4gICAgICAgICAgLy8gcHJldmlvdXMgcm91bmRzIHJlc3VsdHNcclxuICAgICAgICAgIGlmKGluaXRpYWxSZERhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucHJldnJlc3VsdHMgPSBfLmNoYWluKGluaXRpYWxSZERhdGEpXHJcbiAgICAgICAgICAgIC5mbGF0dGVuRGVlcCgpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICAgIHJldHVybiB2LnBsYXllciA9PT0gcGxheWVyLnBsYXllcjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgncmVzdWx0JylcclxuICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyB0aGlzLnRvdGFsX3JvdW5kcyA9IHJlc3VsdGRhdGEubGVuZ3RoO1xyXG4gICAgICAvLyB0aGlzLmN1cnJlbnRSb3VuZCA9IGxhc3RSZERhdGFbMF0ucm91bmQ7XHJcbiAgICAgIGxldCBjaHVua3MgPSBfLmNodW5rKGN1cnJlbnRSZERhdGEsIHRoaXMudG90YWxfcGxheWVycyk7XHJcbiAgICAgIC8vIHRoaXMucmVsb2FkaW5nID0gZmFsc2VcclxuICAgICAgdGhpcy5zY29yZWJvYXJkX2RhdGEgPSBjaHVua3NbY3VycmVudFBhZ2UgLSAxXTtcclxuICAgICAgY29uc29sZS5sb2coJ1Njb3JlYm9hcmQgRGF0YScpXHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NvcmVib2FyZF9kYXRhKVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgIH0pLFxyXG4gICAgcm93Q291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2NvcmVib2FyZF9kYXRhLmxlbmd0aCAvIHRoaXMuaXRlbXNQZXJSb3cpO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYWdldXJsXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZWJvYXJkOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuZXhwb3J0IHsgU2NvcmVzaGVldCBhcyBkZWZhdWx0IH07XHJcblxyXG5sZXQgU2NvcmVzaGVldCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlQ2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDxkaXYgdi1pZj1cInJlc3VsdGRhdGFcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtdG9wXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4XCI+XHJcbiAgICAgICAgPGItaW1nIGNsYXNzPVwidGh1bWJuYWlsIGxvZ28gbWwtYXV0b1wiIDpzcmM9XCJsb2dvXCIgOmFsdD1cImV2ZW50X3RpdGxlXCIgLz5cclxuICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+U2NvcmVjYXJkcyA8aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yIGNvbC0xMlwiPlxyXG4gICAgICA8IS0tIHBsYXllciBsaXN0IGhlcmUgLS0+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiIHAtMiBtYi01IGJnLXdoaXRlIHJvdW5kZWRcIj5cclxuICAgICAgICAgIDxsaSA6a2V5PVwicGxheWVyLnBub1wiIHYtZm9yPVwicGxheWVyIGluIHBkYXRhXCIgY2xhc3M9XCJiZWJhc1wiPlxyXG4gICAgICAgICAgPHNwYW4+e3twbGF5ZXIucG5vfX08L3NwYW4+IDxiLWltZy1sYXp5IDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChwbGF5ZXIucG5vKVwiIHZhcmlhbnQ9XCJsaW5rXCI+e3twbGF5ZXIucGxheWVyfX08L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBjb2wtMTJcIj5cclxuICAgICAgPHRlbXBsYXRlIHYtaWY9XCJyZXN1bHRkYXRhXCI+XHJcbiAgICAgICAgPGg0IGNsYXNzPVwiZ3JlZW5cIj5TY29yZWNhcmQ6IDxiLWltZyA6YWx0PVwibVBsYXllci5wbGF5ZXJcIiBjbGFzcz1cIm14LTJcIiA6c3JjPVwibVBsYXllci5waG90b1wiIHN0eWxlPVwid2lkdGg6NjBweDsgaGVpZ2h0OjYwcHhcIj48L2ItaW1nPiB7e21QbGF5ZXIucGxheWVyfX08L2g0PlxyXG4gICAgICAgIDxiLXRhYmxlIHJlc3BvbnNpdmU9XCJtZFwiIHNtYWxsIGhvdmVyIGZvb3QtY2xvbmUgaGVhZC12YXJpYW50PVwibGlnaHRcIiBib3JkZXJlZCB0YWJsZS12YXJpYW50PVwibGlnaHRcIiA6ZmllbGRzPVwiZmllbGRzXCIgOml0ZW1zPVwic2NvcmVjYXJkXCIgaWQ9XCJzY29yZWNhcmRcIiBjbGFzcz1cImJlYmFzIHNoYWRvdyBwLTQgbXgtYXV0b1wiIHN0eWxlPVwid2lkdGg6OTAlOyB0ZXh0LWFsaWduOmNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZVwiPlxyXG4gICAgICAgIDwhLS0gQSBjdXN0b20gZm9ybWF0dGVkIGNvbHVtbiAtLT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwocm91bmQpPVwiZGF0YVwiPlxyXG4gICAgICAgICAge3tkYXRhLml0ZW0ucm91bmR9fSA8c3VwIHYtaWY9XCJkYXRhLml0ZW0uc3RhcnQgPT0neSdcIj4qPC9zdXA+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwob3Bwbyk9XCJkYXRhXCI+XHJcbiAgICAgICAgICA8c21hbGw+I3t7ZGF0YS5pdGVtLm9wcG9fbm99fTwvc21hbGw+PGItaW1nLWxhenkgOnRpdGxlPVwiZGF0YS5pdGVtLm9wcG9cIiA6YWx0PVwiZGF0YS5pdGVtLm9wcG9cIiA6c3JjPVwiZGF0YS5pdGVtLm9wcF9waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cImdldENhcmQoZGF0YS5pdGVtLm9wcG9fbm8pXCIgdmFyaWFudD1cImxpbmtcIj5cclxuICAgICAgICAgICAgICB7e2RhdGEuaXRlbS5vcHBvfGFiYnJ2fX1cclxuICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OnRhYmxlLWNhcHRpb24+XHJcbiAgICAgICAgICBTY29yZWNhcmQ6ICN7e21QbGF5ZXIucG5vfX0ge3ttUGxheWVyLnBsYXllcn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8L2ItdGFibGU+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGxheWVyX25vOiB0aGlzLiRyb3V0ZS5wYXJhbXMucG5vLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBwaWNQcm9wczoge1xyXG4gICAgICAgIGJsb2NrOiBmYWxzZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICB3aWR0aDogJzMwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzMwcHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtLCBteC0xJyxcclxuICAgICAgfSxcclxuICAgICAgZmllbGRzOiBbe2tleToncm91bmQnLGxhYmVsOidSZCcsc29ydGFibGU6dHJ1ZX0sIHtrZXk6ICdvcHBvJywgbGFiZWw6J09wcC4gTmFtZSd9LHtrZXk6J29wcG9fc2NvcmUnLGxhYmVsOidPcHAuIFNjb3JlJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidzY29yZScsc29ydGFibGU6dHJ1ZX0se2tleTonZGlmZicsc29ydGFibGU6dHJ1ZX0se2tleToncmVzdWx0Jyxzb3J0YWJsZTp0cnVlfSwge2tleTond2lucycsbGFiZWw6J1dvbicsc29ydGFibGU6dHJ1ZX0se2tleTonbG9zc2VzJyxsYWJlbDonTG9zdCcsc29ydGFibGU6dHJ1ZX0se2tleToncG9pbnRzJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidtYXJnaW4nLHNvcnRhYmxlOnRydWUsbGFiZWw6J01hcid9LHtrZXk6J3Bvc2l0aW9uJyxsYWJlbDonUmFuaycsc29ydGFibGU6dHJ1ZX1dLFxyXG4gICAgICBwZGF0YToge30sXHJcbiAgICAgIHNjb3JlY2FyZDoge30sXHJcbiAgICAgIG1QbGF5ZXI6IHt9LFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gIH0sXHJcbiAgY3JlYXRlZCgpIHtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy50b3VybmV5X3NsdWcpO1xyXG4gICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX1JFU0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgUGxheWVyIFNjb3JlY2FyZHMgLSAke3RoaXMudG91cm5leV90aXRsZX1gO1xyXG4gIH0sXHJcbiAgd2F0Y2g6e1xyXG4gICAgcmVzdWx0ZGF0YToge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICBpZiAobmV3VmFsKSB7XHJcbiAgICAgICAgICB0aGlzLnBkYXRhID0gXy5jaGFpbih0aGlzLnJlc3VsdGRhdGEpXHJcbiAgICAgICAgICAgIC5sYXN0KCkuc29ydEJ5KCdwbm8nKS52YWx1ZSgpO1xyXG4gICAgICAgICAgdGhpcy5nZXRDYXJkKHRoaXMucGxheWVyX25vKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRDYXJkOiBmdW5jdGlvbiAobikge1xyXG4gICAgICBsZXQgYyA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgbGV0IHMgPSBfLmNoYWluKGMpLm1hcChmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBfLmZpbHRlcih2LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSkubWFwKCBmdW5jdGlvbihpKXtcclxuICAgICAgICAgIGkuX2NlbGxWYXJpYW50cyA9IFtdO1xyXG4gICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdpbmZvJztcclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSd3aW4nKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdzdWNjZXNzJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSdsb3NzJyl7XHJcbiAgICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnZGFuZ2VyJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSdkcmF3Jyl7XHJcbiAgICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnd2FybmluZyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSkuZmxhdHRlbkRlZXAoKS52YWx1ZSgpO1xyXG4gICAgICB0aGlzLm1QbGF5ZXIgPSBfLmZpcnN0KHMpO1xyXG4gICAgICB0aGlzLiRyb3V0ZXIucmVwbGFjZSh7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7IHBubzogbiB9IH0pO1xyXG4gICAgICB0aGlzLnBsYXllcl9ubyA9IG47XHJcbiAgICAgIGNvbnNvbGUubG9nKHMpO1xyXG4gICAgICB0aGlzLnNjb3JlY2FyZCA9IHM7XHJcbiAgfSxcclxuXHJcbn0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIGV2ZW50X2RhdGE6ICdFVkVOVFNUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIGV2ZW50X3NsdWc6IHRoaXMuc2x1Z1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnU2NvcmVjYXJkcycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhdGhcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIiwiIGxldCBMb1dpbnMgPSBWdWUuY29tcG9uZW50KCdsb3dpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIExvdyBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldExvd1Njb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJsb3d3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvd3dpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxvd3dpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRMb3dTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWluQnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpV2lucyA9VnVlLmNvbXBvbmVudCgnaGl3aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBIaWdoIFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImhpZ2h3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWdod2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlnaHdpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpTG9zcyA9IFZ1ZS5jb21wb25lbnQoJ2hpbG9zcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPCEtLSBIaWdoIExvc2luZyBTY29yZXMgLS0+XHJcbiAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCdsb3NzJylcIiA6ZmllbGRzPVwiaGlsb3NzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlsb3NzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWxvc3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ1dpbm5lcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IENvbWJvU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnY29tYm9zY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGljb21ibygpXCIgOmZpZWxkcz1cImhpY29tYm9fZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAge3tjYXB0aW9ufX1cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGljb21ib19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGljb21ib19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnY29tYm9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQ29tYmluZWQgU2NvcmUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnV2lubmluZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0xvc2luZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaWNvbWJvKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmNvbWJvX3Njb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2NvbWJvX3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ3RvdGFsc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxzY29yZV9maWVsZHMgPSBbXHJcbiAgICAvLyAgJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IFRvdGFsT3BwU2NvcmVzID1WdWUuY29tcG9uZW50KCdvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbG9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbG9wcHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3RvdGFsX29wcHNjb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1RvdGFsIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgQXZlU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnYXZlc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwiYXZlc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXZlc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmF2ZXNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgLy8naW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBBdmVPcHBTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICBob3ZlciByZXNwb25zaXZlIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9vcHBfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQXZlcmFnZSBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgTG9TcHJlYWQgPSBWdWUuY29tcG9uZW50KCdsb3NwcmVhZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImxvU3ByZWFkKClcIiA6ZmllbGRzPVwibG9zcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3NwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG9zcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBsb1NwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpU3ByZWFkID0gICBWdWUuY29tcG9uZW50KCdoaXNwcmVhZCcse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGlTcHJlYWQoKVwiIDpmaWVsZHM9XCJoaXNwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaXNwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlzcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaVNwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmRpZmY7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gfSk7XHJcbmV4cG9ydCB7SGlXaW5zLCBMb1dpbnMsSGlMb3NzLENvbWJvU2NvcmVzLFRvdGFsU2NvcmVzLFRvdGFsT3BwU2NvcmVzLEF2ZVNjb3JlcyxBdmVPcHBTY29yZXMsSGlTcHJlYWQsIExvU3ByZWFkfSIsImxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG5sZXQgdG9wUGVyZm9ybWVycyA9IFZ1ZS5jb21wb25lbnQoJ3RvcC1zdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICA8aDMgY2xhc3M9XCJiZWJhc1wiPnt7dGl0bGV9fVxyXG4gICAgICAgIDxzcGFuPjxpIGNsYXNzPVwiZmFzIGZhLW1lZGFsXCI+PC9pPjwvc3Bhbj5cclxuICAgICAgPC9oMz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMiBjb2wtc20tNCBjb2wtMTJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIm10LTUgZC1mbGV4IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBpZD1cInRvcC1idG4tZ3JvdXBcIj5cclxuICAgICAgICAgIDxiLWJ1dHRvbi1ncm91cCB2ZXJ0aWNhbD5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJUb3AgM1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ3RvcDMnKVwiXHJcbiAgICAgICAgICAgICAgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSd0b3AzJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+VG9wIDNcclxuICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoZXN0IChHYW1lKSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICBAY2xpY2s9XCJzaG93UGljKCdoaWdhbWVzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlnYW1lcydcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1idWxsc2V5ZSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBHYW1lXHJcbiAgICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiSGlnaGVzdCBBdmVyYWdlIFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaWF2ZXMnXCIgQGNsaWNrPVwic2hvd1BpYygnaGlhdmVzJylcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10aHVtYnMtdXAgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggQXZlIFNjb3JlPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJMb3dlc3QgQXZlcmFnZSBPcHBvbmVudCBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIlxyXG4gICAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2xvb3BwYXZlcycpXCIgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdsb29wcGF2ZXMnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYmVlciBtci0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkxvdyBPcHAgQXZlPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiSGlnaCBSYW5rIFBvaW50c1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ2hpcmF0ZScpXCJcclxuICAgICAgICAgICAgICBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpcmF0ZSdcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1ib2x0IG1yLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGkgUmFuayBQb2ludHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9iLWJ1dHRvbi1ncm91cD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgY29sLXNtLTggY29sLTEyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IDpjbGFzcz1cInsnZGVsYXkxJzogIGl0ZW0ucG9zaXRpb24gPT0gJzFzdCcsICdkZWxheTInOiBpdGVtLnBvc2l0aW9uID09ICcybmQnLCAnZGVsYXkzJzogaXRlbS5wb3NpdGlvbiA9PSAnM3JkJ31cIiBjbGFzcz1cImNvbC1zbS00IGNvbC0xMiBhbmltYXRlZCBmbGlwSW5YXCIgdi1mb3I9XCIoaXRlbSwgaW5kZXgpIGluIHN0YXRzXCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJwLTIgdGV4dC1jZW50ZXIgYmViYXMgYmctZGFyayB0ZXh0LXdoaXRlXCI+e3tpdGVtLnBsYXllcn19PC9oND5cclxuICAgICAgICAgIDxkaXYgOmNsYXNzPVwieydnb2xkJzogaXRlbS5wb3NpdGlvbiA9PSAnMXN0Jywnc2lsdmVyJzogaXRlbS5wb3NpdGlvbiA9PSAnMm5kJywnYnJvbnplJzogaXRlbS5wb3NpdGlvbiA9PSAnM3JkJ31cIiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBcIj5cclxuICAgICAgICAgICAgPGltZyA6c3JjPVwicGxheWVyc1tpdGVtLnBuby0xXS5waG90b1wiIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyBjbGFzcz1cImltZy1mbHVpZCByb3VuZGVkLWNpcmNsZVwiXHJcbiAgICAgICAgICAgICAgOmFsdD1cInBsYXllcnNbaXRlbS5wbm8tMV0ucG9zdF90aXRsZXxsb3dlcmNhc2VcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG1sLTVcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTEgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllcnNbaXRlbS5wbm8tMV0uY291bnRyeSB8IGxvd2VyY2FzZVwiXHJcbiAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTEgZmFcIlxyXG4gICAgICAgICAgICAgICAgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyc1tpdGVtLnBuby0xXS5nZW5kZXIgPT0gJ20nLCAnZmEtZmVtYWxlJzogcGxheWVyc1tpdGVtLnBuby0xXS5nZW5kZXIgPT0gJ2YnfVwiXHJcbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGJnLWRhcmsgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ucG9pbnRzXCI+e3tpdGVtLnBvaW50c319PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ucmF0aW5nX2NoYW5nZVwiPjxzbWFsbCB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlID49IDBcIj5HYWluZWQ8L3NtYWxsPiB7e2l0ZW0ucmF0aW5nX2NoYW5nZX19IHBvaW50cyA8c21hbGwgdi1pZj1cIml0ZW0ucmF0aW5nX2NoYW5nZSA8PSAwXCI+bG9zczwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ubWFyZ2luXCI+e3tpdGVtLm1hcmdpbnxhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIHRleHQtY2VudGVyIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnNjb3JlXCI+Um91bmRcclxuICAgICAgICAgICAgICAgIHt7aXRlbS5yb3VuZH19IHZzIHt7aXRlbS5vcHBvfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGJnLXN1Y2Nlc3MgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5wb3NpdGlvblwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnBvc2l0aW9ufX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLmF2ZV9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5hdmVfb3BwX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX29wcF9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5uZXdfcmF0aW5nXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ub2xkX3JhdGluZ319IC0ge3tpdGVtLm5ld19yYXRpbmd9fTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgcHJvZmlsZXMgOiBbXSxcclxuICAgICAgc3RhdHM6IFtdLFxyXG4gICAgICBjb21wdXRlZF9yYXRpbmdfaXRlbXM6IFtdLFxyXG4gICAgICBjdXJyZW50VmlldzogJydcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93UGljKCd0b3AzJyk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBzaG93UGljOiBmdW5jdGlvbiAodCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdFxyXG4gICAgICBsZXQgYXJyLHIscyA9IFtdO1xyXG4gICAgICBpZiAodCA9PSAnaGlhdmVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ2F2ZV9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZSA9ICdIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdsb29wcGF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX29wcF9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2VSaWdodChhcnIsIDMpLnJldmVyc2UoKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9vcHBfc2NvcmUnXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0xvd2VzdCBPcHBvbmVudCBBdmVyYWdlIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnaGlnYW1lcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmNvbXB1dGVTdGF0cygpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3Njb3JlJywncm91bmQnLCdvcHBvJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdIaWdoIEdhbWUgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICd0b3AzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ3BvaW50cycpO1xyXG4gICAgICAgIHMgPSBfLnNvcnRCeShhcnIsWydwb2ludHMnLCdtYXJnaW4nXSkucmV2ZXJzZSgpXHJcbiAgICAgICAgciA9IF8udGFrZShzLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3BvaW50cycsJ21hcmdpbicsJ3Bvc2l0aW9uJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdUb3AgMydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnaGlyYXRlJykge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIGFyciA9IHRoaXMuY29tcHV0ZWRfcmF0aW5nX2l0ZW1zO1xyXG5cclxuICAgICAgICBzID0gXy5zb3J0QnkoYXJyLCBbJ3JhdGluZ19jaGFuZ2UnLCduZXdfcmF0aW5nJ10pLnJldmVyc2UoKTtcclxuXHJcbiAgICAgICAgciA9IF8udGFrZShzLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ25ld19yYXRpbmcnLCAncmF0aW5nX2NoYW5nZScsICdvbGRfcmF0aW5nJ10pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS10b3AgcmFuay0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocik7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGU9J0hpZ2ggUmF0aW5nIFBvaW50IEdhaW5lcnMnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RhdHMgPSByO1xyXG4gICAgICAvLyB0aGlzLnByb2ZpbGVzID0gdGhpcy5wbGF5ZXJzW3IucG5vLTFdO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRTdGF0czogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICByZXR1cm4gXy5zb3J0QnkodGhpcy5maW5hbHN0YXRzLCBrZXkpLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICBjb21wdXRlU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgeC5wbGF5ZXIgPSB4Lm5hbWU7XHJcbiAgICAgICAgeC5yYXRpbmdfY2hhbmdlID0gcGFyc2VJbnQoeC5yYXRpbmdfY2hhbmdlKTtcclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGZpbmFsc3RhdHM6ICdGSU5BTF9ST1VORF9TVEFUUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgb25nb2luZzogJ09OR09JTkdfVE9VUk5FWScsXHJcbiAgICB9KSxcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgdG9wUGVyZm9ybWVyczsiLCJleHBvcnQgeyBzdG9yZSBhcyBkZWZhdWx0IH07XHJcblxyXG5pbXBvcnQgeyBiYXNlVVJMLCBhdXRoVVJMLCBwcm9maWxlVVJMLCBzdGF0c1VSTCB9IGZyb20gJy4vY29uZmlnLmpzJ1xyXG5jb25zdCBzdG9yZSA9IG5ldyBWdWV4LlN0b3JlKHtcclxuICBzdHJpY3Q6IHRydWUsXHJcbiAgc3RhdGU6IHtcclxuICAgIHRvdWFwaTogW10sXHJcbiAgICB0b3VhY2Nlc3N0aW1lOiAnJyxcclxuICAgIGRldGFpbDogW10sXHJcbiAgICBsYXN0ZGV0YWlsYWNjZXNzOiAnJyxcclxuICAgIGV2ZW50X3N0YXRzOiBbXSxcclxuICAgIHBsYXllcnM6IFtdLFxyXG4gICAgcmVzdWx0X2RhdGE6IFtdLFxyXG4gICAgdG90YWxfcGxheWVyczogbnVsbCxcclxuICAgIGVycm9yOiAnJyxcclxuICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICBsb2dpbl9sb2FkaW5nOiBmYWxzZSxcclxuICAgIGxvZ2luX3N1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgYWNjZXNzVG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0X3Rva2VuJykgfHwgJycsXHJcbiAgICB1c2VyX2RhdGE6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0X3VzZXInKSB8fCAnJyxcclxuICAgIG9uZ29pbmc6IGZhbHNlLFxyXG4gICAgY3VycmVudFBhZ2U6IG51bGwsXHJcbiAgICBXUHRvdGFsOiBudWxsLFxyXG4gICAgV1BwYWdlczogbnVsbCxcclxuICAgIGNhdGVnb3J5OiAnJyxcclxuICAgIHBhcmVudHNsdWc6ICcnLFxyXG4gICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgdG91cm5leV90aXRsZTogJycsXHJcbiAgICBsb2dvX3VybDogJycsXHJcbiAgICB0b3RhbF9yb3VuZHM6IG51bGwsXHJcbiAgICBmaW5hbF9yb3VuZF9zdGF0czogW10sXHJcbiAgICByYXRpbmdfc3RhdHM6IFtdLFxyXG4gICAgc2hvd3N0YXRzOiBmYWxzZSxcclxuICAgIHBsYXllcl9sYXN0X3JkX2RhdGE6IFtdLFxyXG4gICAgcGxheWVyZGF0YTogW10sXHJcbiAgICBwbGF5ZXI6IG51bGwsXHJcbiAgICBhbGxfcGxheWVyczogW10sXHJcbiAgICBhbGxfcGxheWVyc190b3VfZGF0YTpbXSxcclxuICAgIHBsYXllcl9zdGF0czogW10sXHJcbiAgfSxcclxuICBnZXR0ZXJzOiB7XHJcbiAgICBQTEFZRVJfU1RBVFM6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9zdGF0cyxcclxuICAgIExBU1RSRERBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9sYXN0X3JkX2RhdGEsXHJcbiAgICBQTEFZRVJEQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJkYXRhLFxyXG4gICAgUExBWUVSOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXIsXHJcbiAgICBBTExfUExBWUVSUzogc3RhdGUgPT4gc3RhdGUuYWxsX3BsYXllcnMsXHJcbiAgICBBTExfUExBWUVSU19UT1VfREFUQTogc3RhdGUgPT4gc3RhdGUuYWxsX3BsYXllcnNfdG91X2RhdGEsXHJcbiAgICBTSE9XU1RBVFM6IHN0YXRlID0+IHN0YXRlLnNob3dzdGF0cyxcclxuICAgIFRPVUFQSTogc3RhdGUgPT4gc3RhdGUudG91YXBpLFxyXG4gICAgVE9VQUNDRVNTVElNRTogc3RhdGUgPT4gc3RhdGUudG91YWNjZXNzdGltZSxcclxuICAgIERFVEFJTDogc3RhdGUgPT4gc3RhdGUuZGV0YWlsLFxyXG4gICAgTEFTVERFVEFJTEFDQ0VTUzogc3RhdGUgPT4gc3RhdGUubGFzdGRldGFpbGFjY2VzcyxcclxuICAgIEVWRU5UU1RBVFM6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3N0YXRzLFxyXG4gICAgUExBWUVSUzogc3RhdGUgPT4gc3RhdGUucGxheWVycyxcclxuICAgIFRPVEFMUExBWUVSUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcGxheWVycyxcclxuICAgIFJFU1VMVERBVEE6IHN0YXRlID0+IHN0YXRlLnJlc3VsdF9kYXRhLFxyXG4gICAgUkFUSU5HX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5yYXRpbmdfc3RhdHMsXHJcbiAgICBFUlJPUjogc3RhdGUgPT4gc3RhdGUuZXJyb3IsXHJcbiAgICBMT0FESU5HOiBzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nLFxyXG4gICAgQUNDRVNTX1RPS0VOOiBzdGF0ZSA9PiBzdGF0ZS5hY2Nlc3NUb2tlbixcclxuICAgIFVTRVI6IHN0YXRlID0+IEpTT04ucGFyc2Uoc3RhdGUudXNlcl9kYXRhKSxcclxuICAgIExPR0lOX0xPQURJTkc6IHN0YXRlID0+IHN0YXRlLmxvZ2luX2xvYWRpbmcsXHJcbiAgICBMT0dJTl9TVUNDRVNTOiBzdGF0ZSA9PiBzdGF0ZS5sb2dpbl9zdWNjZXNzLFxyXG4gICAgQ1VSUlBBR0U6IHN0YXRlID0+IHN0YXRlLmN1cnJlbnRQYWdlLFxyXG4gICAgV1BUT1RBTDogc3RhdGUgPT4gc3RhdGUuV1B0b3RhbCxcclxuICAgIFdQUEFHRVM6IHN0YXRlID0+IHN0YXRlLldQcGFnZXMsXHJcbiAgICBDQVRFR09SWTogc3RhdGUgPT4gc3RhdGUuY2F0ZWdvcnksXHJcbiAgICBUT1RBTF9ST1VORFM6IHN0YXRlID0+IHN0YXRlLnRvdGFsX3JvdW5kcyxcclxuICAgIEZJTkFMX1JPVU5EX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyxcclxuICAgIFBBUkVOVFNMVUc6IHN0YXRlID0+IHN0YXRlLnBhcmVudHNsdWcsXHJcbiAgICBFVkVOVF9USVRMRTogc3RhdGUgPT4gc3RhdGUuZXZlbnRfdGl0bGUsXHJcbiAgICBUT1VSTkVZX1RJVExFOiBzdGF0ZSA9PiBzdGF0ZS50b3VybmV5X3RpdGxlLFxyXG4gICAgT05HT0lOR19UT1VSTkVZOiBzdGF0ZSA9PiBzdGF0ZS5vbmdvaW5nLFxyXG4gICAgTE9HT19VUkw6IHN0YXRlID0+IHN0YXRlLmxvZ29fdXJsLFxyXG4gIH0sXHJcbiAgbXV0YXRpb25zOiB7XHJcbiAgICBTRVRfU0hPV1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuc2hvd3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRklOQUxfUkRfU1RBVFM6IChzdGF0ZSwgcmVzdWx0c3RhdHMpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHJlc3VsdHN0YXRzLmxlbmd0aDtcclxuICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyA9IF8ubGFzdChyZXN1bHRzdGF0cyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBTRVRfVE9VREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFwaSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UREVUQUlMOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZGV0YWlsID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFjY2Vzc3RpbWUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9ERVRBSUxfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxhc3RkZXRhaWxhY2Nlc3MgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9XUF9DT05TVEFOVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5XUHBhZ2VzID0gcGF5bG9hZFsneC13cC10b3RhbHBhZ2VzJ107XHJcbiAgICAgIHN0YXRlLldQdG90YWwgPSBwYXlsb2FkWyd4LXdwLXRvdGFsJ107XHJcbiAgICB9LFxyXG4gICAgU0VUX1BMQVlFUlM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgYSA9IHBheWxvYWQubWFwKGZ1bmN0aW9uICh2YWwsIGluZGV4LCBrZXkpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXlbaW5kZXhdWydwb3N0X3RpdGxlJ10pO1xyXG4gICAgICAgIGtleVtpbmRleF1bJ3RvdV9ubyddID0gaW5kZXggKyAxO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS50b3RhbF9wbGF5ZXJzID0gcGF5bG9hZC5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcnMgPSBhO1xyXG4gICAgfSxcclxuICAgIFNFVF9BTExfUExBWUVSUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmFsbF9wbGF5ZXJzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQUxMX1BMQVlFUlNfVE9VX0RBVEE6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5hbGxfcGxheWVyc190b3VfZGF0YS5wdXNoKHBheWxvYWQpO1xyXG4gICAgfSxcclxuICAgIFNFVF9SQVRJTkdfU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5yYXRpbmdfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9SRVNVTFQ6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgcCA9IHN0YXRlLnBsYXllcnM7XHJcbiAgICAgIGxldCByID0gXy5tYXAocGF5bG9hZCwgZnVuY3Rpb24gKHopIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoeiwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgIGxldCBpID0gby5wbm8gLSAxO1xyXG4gICAgICAgICAgby5waG90byA9IHBbaV0ucGhvdG87XHJcbiAgICAgICAgICBvLmlkID0gcFtpXS5pZDtcclxuICAgICAgICAgIG8uY291bnRyeSA9IHBbaV0uY291bnRyeTtcclxuICAgICAgICAgIG8uY291bnRyeSA9IHBbaV0uY291bnRyeTtcclxuICAgICAgICAgIG8uY291bnRyeV9mdWxsID0gcFtpXS5jb3VudHJ5X2Z1bGw7XHJcbiAgICAgICAgICBvLmdlbmRlciA9IHBbaV0uZ2VuZGVyO1xyXG4gICAgICAgICAgby5pc190ZWFtID0gcFtpXS5pc190ZWFtO1xyXG4gICAgICAgICAgbGV0IHggPSBvLm9wcG9fbm8gLSAxO1xyXG4gICAgICAgICAgby5vcHBfcGhvdG8gPSBwW3hdLnBob3RvO1xyXG4gICAgICAgICAgby5vcHBfaWQgPSBwW3hdLmlkO1xyXG4gICAgICAgICAgcmV0dXJuIG87XHJcbiAgICAgICAgfSlcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHIpO1xyXG4gICAgICBzdGF0ZS5yZXN1bHRfZGF0YSA9IHI7XHJcbiAgICB9LFxyXG4gICAgU0VUX09OR09JTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5vbmdvaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRTVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ1VSUlBBR0U6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jdXJyZW50UGFnZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VSUk9SOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXJyb3IgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0FESU5HOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9hZGluZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1VTRVJfREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnVzZXJfZGF0YSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPR0lOX1NVQ0NFU1M6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dpbl9zdWNjZXNzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HSU5fTE9BRElORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvZ2luX2xvYWRpbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9UT1RBTF9ST1VORFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3RhbF9yb3VuZHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DQVRFR09SWTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmNhdGVnb3J5ID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9VUk5FWV9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdXJuZXlfdGl0bGUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9QQVJFTlRTTFVHOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUucGFyZW50c2x1ZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UX1RJVExFOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfdGl0bGUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0dPX1VSTDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvZ29fdXJsID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICAvL1xyXG4gICAgQ09NUFVURV9QTEFZRVJfU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgbGVuID0gc3RhdGUucmVzdWx0X2RhdGEubGVuZ3RoO1xyXG4gICAgICBsZXQgbGFzdHJvdW5kID0gc3RhdGUucmVzdWx0X2RhdGFbbGVuIC0gMV07XHJcbiAgICAgIGxldCBwbGF5ZXIgPSAoc3RhdGUucGxheWVyID0gXy5maWx0ZXIoc3RhdGUucGxheWVycywgeyBpZDogcGF5bG9hZCB9KSk7XHJcbiAgICAgIGxldCBuYW1lID0gXy5tYXAocGxheWVyLCAncG9zdF90aXRsZScpICsgJyc7IC8vIGNvbnZlcnQgdG8gc3RyaW5nXHJcbiAgICAgIGxldCBwbGF5ZXJfdG5vID0gcGFyc2VJbnQoXy5tYXAocGxheWVyLCAndG91X25vJykpO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfbGFzdF9yZF9kYXRhID0gXy5maW5kKGxhc3Ryb3VuZCwgeyBwbm86IHBsYXllcl90bm8gfSk7XHJcblxyXG4gICAgICBsZXQgcGRhdGEgPSAoc3RhdGUucGxheWVyZGF0YSA9IF8uY2hhaW4oc3RhdGUucmVzdWx0X2RhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbE9wcFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgb3Bwc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnb3Bwb19zY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBvcHBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsUmFua3MgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zY29yZSA9PSBwYXJzZUludChwSGlTY29yZSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGhpc1xyXG4gICAgICAgICksXHJcbiAgICAgICAgJ3JvdW5kJ1xyXG4gICAgICApO1xyXG4gICAgICBsZXQgcExvU2NvcmVSb3VuZHMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihcclxuICAgICAgICAgIF8uZmxhdHRlbkRlZXAocGRhdGEpLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2NvcmUgPT0gcGFyc2VJbnQocExvU2NvcmUpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApLFxyXG4gICAgICAgICdyb3VuZCdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcyA9IHBIaVNjb3JlUm91bmRzLmpvaW4oKTtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBMb1Njb3JlUm91bmRzID0gcExvU2NvcmVSb3VuZHMuam9pbigpO1xyXG5cclxuICAgICAgbGV0IHBSYnlSID0gXy5tYXAocGRhdGEsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgICBpZiAobC5yZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICd3b24nO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdkcmV3JztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdsb3N0JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBzdGFydGluZyA9ICdyZXBseWluZyc7XHJcbiAgICAgICAgICBpZiAobC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgc3RhcnRpbmcgPSAnc3RhcnRpbmcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PSAnQVInKSB7XHJcbiAgICAgICAgICAgIGwucmVwb3J0ID1cclxuICAgICAgICAgICAgICAnSW4gcm91bmQgJyArXHJcbiAgICAgICAgICAgICAgbC5yb3VuZCArXHJcbiAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPGVtIHYtaWY9XCJsLnN0YXJ0XCI+LCAoJyArXHJcbiAgICAgICAgICAgICAgc3RhcnRpbmcgK1xyXG4gICAgICAgICAgICAgICcpPC9lbT4gaXMgcGxheWluZyA8c3Ryb25nPicgK1xyXG4gICAgICAgICAgICAgIGwub3BwbyArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPi4gUmVzdWx0cyBhcmUgYmVpbmcgYXdhaXRlZCc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgKyBsLnJvdW5kICsgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICsgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgKyBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBwbGF5ZWQgPHN0cm9uZz4nICsgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IGFuZCAnICsgcmVzdWx0ICtcclxuICAgICAgICAgICAgICAnIDxlbT4nICsgbC5zY29yZSArICcgLSAnICtcclxuICAgICAgICAgICAgICBsLm9wcG9fc2NvcmUgKyAnLDwvZW0+IGEgZGlmZmVyZW5jZSBvZiAnICtcclxuICAgICAgICAgICAgICBsLmRpZmYgKyAnLiA8c3BhbiBjbGFzcz1cInN1bW1hcnlcIj48ZW0+JyArXHJcbiAgICAgICAgICAgICAgbmFtZSArICc8L2VtPiBpcyByYW5rZWQgPHN0cm9uZz4nICsgbC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiB3aXRoIDxzdHJvbmc+JyArIGwucG9pbnRzICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IHBvaW50cyBhbmQgYSBjdW11bGF0aXZlIHNwcmVhZCBvZiAnICtcclxuICAgICAgICAgICAgICBsLm1hcmdpbiArICcgPC9zcGFuPic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gbDtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wUmJ5UiA9IF8uZmxhdHRlbkRlZXAocFJieVIpO1xyXG5cclxuICAgICAgbGV0IGFsbFdpbnMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihfLmZsYXR0ZW5EZWVwKHBkYXRhKSwgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiAnd2luJyA9PSBwLnJlc3VsdDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0V2lucyA9IF8uZmlsdGVyKGFsbFdpbnMsIFsnc3RhcnQnLCAneSddKS5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ24nXSkubGVuZ3RoO1xyXG4gICAgICBsZXQgc3RhcnRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICBpZiAocC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydHMgPSBzdGFydHMubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbGllcyA9IHN0YXRlLnRvdGFsX3JvdW5kcyAtIHN0YXJ0cy5sZW5ndGg7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWN0aW9uczoge1xyXG4gICAgRE9fU1RBVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfU0hPV1NUQVRTJywgcGF5bG9hZCk7XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgQVVUSF9UT0tFTihjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHthdXRoVVJMfXRva2VuL3ZhbGlkYXRlYDtcclxuICAgICAgLy9sZXQgdXJsID0gcG9zdFVSTDtcclxuICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aXRsZTogJ1BsaXVzIEFsaXR0bGUgdGVzdCBBUEkgUG9zdGluZycsXHJcbiAgICAgICAgICBjb250ZW50OiAnQW5vdGhlciBtaW5vciBQb3N0IGZyb20gV1AgQVBJJyxcclxuICAgICAgICAgIHN0YXR1czogJ3B1Ymxpc2gnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgICR7cGF5bG9hZH1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIH0pXHJcbiAgICAgICAgbGV0IHJlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICBpZiAocmVzLmNvZGUgPT0gXCJqd3RfYXV0aF92YWxpZF90b2tlblwiKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRE9fTE9HSU4oY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2F1dGhVUkx9dG9rZW5gO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCwge1xyXG4gICAgICAgIHVzZXJuYW1lOiBwYXlsb2FkLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHBheWxvYWQucGFzc1xyXG4gICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS50b2tlbikge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RfdG9rZW4nLCBKU09OLnN0cmluZ2lmeShkYXRhLnRva2VuKSlcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0X3VzZXInLCBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXJfZGlzcGxheV9uYW1lKSlcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9TVUNDRVNTJywgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCBmYWxzZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVyci5tZXNzYWdlLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGFzeW5jIEdFVF9BTExfUExBWUVSUyhjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtwcm9maWxlVVJMfWA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCggdXJsLCB7XHJcbiAgICAgICAgICAvL3BhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0sXHJcbiAgICAgICAgICAvLyBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICAke3Rva2VufWB9XHJcbiAgICAgICAgfSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICBsZXQgZGF0YSA9IF8ubWFwKHIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICBkLmNvdW50cnkgPSBkLmNvdW50cnkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGQuZ2VuZGVyID0gZC5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgcmV0dXJuIGQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgR0VUX1BMQVlFUl9UT1VfREFUQShjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtzdGF0c1VSTH0ke3BheWxvYWR9YDtcclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KCB1cmwsIHtcclxuICAgICAgICAgIC8vcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIGRhdGEuY291bnRyeSA9IGRhdGEuY291bnRyeS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGRhdGEuZ2VuZGVyID0gZGF0YS5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTX1RPVV9EQVRBJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRkVUQ0hfQVBJIChjb250ZXh0LCBwYXlsb2FkKSAge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIC8vIGxldCB0b2tlbiA9IGNvbnRleHQuZ2V0dGVycy5BQ0NFU1NfVE9LRU5cclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KHVybCwge1xyXG4gICAgICAgICAgcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnR2V0dGluZyBsaXN0cyBvZiB0b3VybmFtZW50cycpO1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLm1hcChkYXRhID0+IHtcclxuICAgICAgICAgICAgLy8gRm9ybWF0IGFuZCBhc3NpZ24gVG91cm5hbWVudCBzdGFydCBkYXRlIGludG8gYSBsZXRpYWJsZVxyXG4gICAgICAgICAgICBsZXQgc3RhcnREYXRlID0gZGF0YS5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSBtb21lbnQobmV3IERhdGUoc3RhcnREYXRlKSkuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICdkZGRkLCBNTU1NIERvIFlZWVknXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKG1vbWVudChoZWFkZXJzLmRhdGUpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1vbWVudChoZWFkZXJzLmRhdGUpLCBcImZvbnQtc2l6ZTozMHB4O2NvbG9yOmdyZWVuO1wiKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTEFTVF9BQ0NFU1NfVElNRScsIGhlYWRlcnMuZGF0ZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VEQVRBJywgZGF0YSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NVUlJQQUdFJywgcGF5bG9hZCk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0RFVEFJTCAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pO1xyXG4gICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgZGF0YSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9EQVRBIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjb250ZXh0KTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9kYXRhYDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBkYXRhLnBsYXllcnM7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdGRVRDSCBEQVRBICRzdG9yZScpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IGxvZ28gPSBkYXRhLnRvdXJuZXlbMF0uZXZlbnRfbG9nby5ndWlkO1xyXG4gICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICBsZXQgcmF0aW5nX3N0YXRzID0gbnVsbDtcclxuICAgICAgICBpZiAoZGF0YS5zdGF0c19qc29uKSB7XHJcbiAgICAgICAgICByYXRpbmdfc3RhdHMgPSBKU09OLnBhcnNlKGRhdGEuc3RhdHNfanNvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkFUSU5HX1NUQVRTJywgcmF0aW5nX3N0YXRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCAoZXJyb3IpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIEZFVENIX1JFU0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10X2RhdGFgO1xyXG4gICAgICAgICAgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pLnRoZW4ocmVzcG9uc2U9PntcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBkYXRhLmV2ZW50X2NhdGVnb3J5WzBdLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgICBsZXQgcGFyZW50X3NsdWcgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF9uYW1lO1xyXG4gICAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRTVEFUUycsIGRhdGEudG91cm5leSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JFU1VMVCcsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HT19VUkwnLCBsb2dvKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9UQUxfUk9VTkRTJywgdG90YWxfcm91bmRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+e1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgc3RvcmU7XHJcbiJdfQ==
