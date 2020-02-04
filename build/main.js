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
  mixins: [Vue2Filters.mixin],
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
        //text: _.capitalize(this.category),
        // let category = _.capitalize(this.category);
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
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n          <loading></loading>\n        </div>\n        <div v-else class=\"col-12 justify-content-center align-self-center\">\n          <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <div class=\"p-5 text-center d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start\">\n            <b-img slot=\"aside\" vertical-align=\"center\" class=\"align-self-center mr-3 rounded img-fluid\"\n              :src=\"tourney.event_logo\" width=\"150\" height=\"150\" :alt=\"tourney.event_logo_title\" />\n            <h4 class=\"mx-1 display-4\">\n              {{tourney.title}}\n            </h4>\n          </div>\n          <div class=\"p-5 d-flex flex-column justify-content-center align-items-center\">\n            <ul class=\"list-inline text-center\" id=\"event-details\">\n              <li class=\"list-inline-item\" v-if=\"tourney.start_date\"><i class=\"fa fa-calendar\"></i>\n                {{tourney.start_date}}</li>\n              <li class=\"list-inline-item\" v-if=\"tourney.venue\"><i class=\"fa fa-map-marker\"></i> {{tourney.venue}}</li>\n              <li v-if=\"tourney.tournament_director\"><i class=\"fa fa-legal\"></i>\n                {{tourney.tournament_director}}</li>\n            </ul>\n            <h5>\n              Categories <i class=\"fa fa-list\" aria-hidden=\"true\"></i>\n            </h5>\n            <ul class=\"list-inline text-center cate-list\">\n              <li v-for=\"(cat, c) in tourney.tou_categories\" :key=\"c\" class=\"list-inline-item\">\n                <template v-if=\"cat.event_id\">\n                  <router-link :to=\"{ name: 'CateDetail', params: {  event_slug:cat.event_slug }}\">\n                    <span>{{cat.cat_name}}</span>\n                  </router-link>\n                </template>\n                <template v-else>\n                  <span>{{cat.cat_name}}</span>\n                </template>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n       ",
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
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n            <h2 class=\"bebas text-center\">\n                <i class=\"fa fa-trophy\"></i> Tournaments\n            </h2>\n        </div>\n      </div>\n      <div class=\"row justify-content-start align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                        :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n              <p class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages; <span class=\"emphasize\">{{WPtotal}}</span> tournaments!</p>\n            </div>\n        </div>\n        <div class=\"row\">\n        <div  class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\" :key=\"item.id\">\n        <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft\" >\n          <div class=\"mr-lg-5\">\n            <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n              <b-img fluid class=\"thumbnail\"\n                  :src=\"item.event_logo\" width=\"100\"  height=\"100\" :alt=\"item.event_logo_title\" />\n            </router-link>\n          </div>\n          <div class=\"mr-lg-auto\">\n            <h4 class=\"mb-1 display-5\">\n            <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                {{item.title}}\n            </router-link>\n            </h4>\n            <div class=\"text-center\">\n            <div class=\"d-inline p-1\">\n                <small><i class=\"fa fa-calendar\"></i>\n                    {{item.start_date}}\n                </small>\n            </div>\n          <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-map-marker\"></i>\n                  {{item.venue}}\n              </small>\n          </div>\n          <div class=\"d-inline p-1\">\n              <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                  <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                  </small>\n              </router-link>\n          </div>\n          <ul class=\"list-unstyled list-inline text-center category-list\">\n              <li class=\"list-inline-item mx-auto\"\n              v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n          </ul>\n          </div>\n          </div>\n        </div>\n       </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 d-flex flex-column justify-content-lg-end\">\n          <p class=\"my-0 py-0\"><small class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages with <span class=\"emphasize\">{{WPtotal}}</span>\n          tournaments!</small></p>\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                  :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n        </div>\n      </div>\n   </template>\n</div>\n",
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
      this.currentPage = pageNum;
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
  template: "\n  <div class=\"row\">\n  <div class=\"col-10 offset-1 justify-content-center align-items-center\">\n    <div class=\"row\">\n      <div class=\"col-12 d-flex justify-content-center align-items-center\">\n        <b-button @click=\"view='profile'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='profile'\" :pressed=\"view ==='profile'\" title=\"Player Profile\">\n        <b-icon icon=\"person\"></b-icon>Profile</b-button>\n        <b-button @click=\"view='head2head'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='head2head'\" :pressed=\"view ==='head2head'\" title=\"Head To Head\">\n        <b-icon icon=\"people-fill\"></b-icon>H2H</b-button>\n      </div>\n    </div>\n\n    <h3 v-if=\"view ==='profile'\" class=\"bebas mb-2\">\n    <b-icon icon=\"person\"></b-icon> Stats Profile</h3>\n    <h3 class=\"mb-2 bebas\" v-if=\"view ==='head2head'\">\n    <b-icon icon=\"people-fill\"></b-icon> Head to Head</h3>\n\n    <template v-if=\"view ==='profile'\">\n      <div v-if=\"view ==='profile' && (all_players.length <=0)\" class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n          <b-spinner variant=\"primary\" style=\"width: 7rem; height: 7rem;\" label=\"Loading players\"></b-spinner>\n      </div>\n      <div v-else class=\"my-5 mx-auto w-50 d-md-flex flex-md-row align-items-center justify-content-center\">\n        <div class=\"mr-md-2 mb-sm-2\">\n          <label for=\"search\">Player name:</label>\n        </div>\n        <div class=\"ml-md-2 flex-grow-1\">\n          <vue-simple-suggest\n          v-model=\"psearch\"\n          display-attribute=\"player\"\n          value-attribute=\"slug\"\n          @select=\"getprofile\"\n          :styles=\"autoCompleteStyle\"\n          :destyled=true\n          :filter-by-query=true\n          :list=\"all_players\"\n          placeholder=\"Player name here\"\n          id=\"search\"\n          type=\"search\">\n          </vue-simple-suggest>\n        </div>\n      </div>\n      <div v-show=\"loading\">\n        <div class=\"d-flex flex-md-row-reverse my-2 justify-content-center align-items-center\">\n        <span class=\"text-success\" v-show=\"psearch && !notfound\">Searching <em>{{psearch}}</em>...</span>\n        <span class=\"text-danger\" v-show=\"psearch && notfound\"><em>{{psearch}}</em> not found!</span>\n        <b-spinner v-show=\"!notfound\" style=\"width: 7rem; height: 7rem;\" type=\"grow\" variant=\"success\" label=\"Busy\"></b-spinner>\n        </div>\n      </div>\n      <div v-if=\"pdata.player\" class=\"p-2 mx-auto d-md-flex flex-md-row align-items-start justify-content-around\">\n          <div v-show=\"psearch ===pdata.player && !notfound\" class=\"d-flex flex-column text-center align-items-center animated fadeIn\">\n          <h4>Profile Summary</h4>\n            <h5 class=\"oswald\">{{pdata.player}}\n            <span class=\"d-inline-block mx-auto p-2\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+pdata.country |lowercase\" title=\"pdata.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }\" aria-hidden=\"true\"></i>\n            </span>\n            </h5>\n            <img :src='pdata.photo' :alt=\"pdata.player\" v-bind=\"imgProps\"></img>\n            <div class=\"text-uppercase text-left\" style=\"font-size:0.9em;\">\n              <div class=\"lead text-center\">{{pdata.total_tourneys | pluralize('tourney',{ includeNumber: true })}}\n              </div>\n              <div class=\"d-block text-primary font-weight-light\">\n               Tourney <span class=\"text-capitalize\">(All Time)</span> Honors:\n                <ul class=\"list-inline\">\n                  <li title=\"First Prize\" class=\"list-inline-item goldcol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(1)}}</span>\n                  </li>\n                  <li title=\"Second Prize\" class=\"list-inline-item silvercol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(2)}}</span>\n                  </li>\n                  <li title=\"Third Prize\" class=\"list-inline-item bronzecol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(3)}}</span>\n                  </li>\n                </ul>\n              </div>\n              <span class=\"d-block text-info font-weight-light text-capitalize\">{{pdata.total_games | pluralize('game',{ includeNumber: true })}}</span>\n              <span class=\"d-block text-success font-weight-light text-capitalize\">{{pdata.total_wins | pluralize('win',{ includeNumber: true })}} <em>({{pdata.percent_wins}}%)</em></span>\n              <span class=\"d-block text-warning font-weight-light text-capitalize\"> {{pdata.total_draws | pluralize('draw',{ includeNumber: true })}}</span>\n              <span class=\"d-block text-danger font-weight-light text-capitalize\"> {{pdata.total_losses | pluralize(['loss','losses'],{ includeNumber: true })}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Score: {{pdata.ave_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Opponents Score: {{pdata.ave_opp_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Cum. Mar: {{pdata.ave_margin}}</span>\n            </div>\n          </div>\n        <div>\n          <div v-show=\"!loading\">\n          <h4 title=\"Performance summary per tourney\">Competitions</h4>\n            <div class=\"p-1 mb-1 bg-light\" v-for=\"(c, tindex) in pdata.competitions\" :key=\"c.id\">\n              <h5 class=\"oswald text-left\">{{c.title}}\n              <b-badge title=\"Final Rank\">{{c.final_rd.rank}}</b-badge></h5>\n                  <button class=\"btn btn-link text-decoration-none\" type=\"button\" title=\"Click to view player scoresheet for this event\">\n                  <router-link :to=\"{ name:'Scoresheet', params:{  event_slug:c.slug, pno:c.final_rd.pno}}\">\n                  <b-icon icon=\"documents-alt\"></b-icon> Scorecard\n                  </router-link>\n                  </button>\n                  <b-button class=\"text-decoration-none\" variant=\"link\" v-b-toggle=\"collapse+tindex+1\" title=\"Click to toggle player stats for this event\">\n                  <b-icon icon=\"bar-chart-fill\" variant=\"success\" flip-h></b-icon>Statistics\n                  </b-button>\n                  <b-collapse :id=\"collapse+tindex+1\">\n                    <div class=\"card card-body\">\n                    <h6 class=\"oswald\">{{c.final_rd.player}} Event Stats Summary</h6>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Points: {{c.final_rd.points}}/{{c.final_rd.round}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Final Pos: {{c.final_rd.position}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item text-success font-weight-light text-capitalize\">\n                        Won: {{c.final_rd.wins}}\n                      </li>\n                      <li class=\"list-inline-item text-warning font-weight-light text-capitalize\">\n                        Drew: {{c.final_rd.draws}}\n                      </li>\n                      <li class=\"list-inline-item text-danger font-weight-light text-capitalize\">\n                        Lost: {{c.final_rd.losses}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Score: {{c.final_rd.ave_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Opp. Score: {{c.final_rd.ave_opp_score}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Score: {{c.final_rd.total_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Opp. Score: {{c.final_rd.total_oppscore}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Margin: {{c.final_rd.margin}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li :class=\"{'text-success': c.final_rd.result == 'win','text-warning': c.final_rd.result == 'draw',\n                      'text-danger': c.final_rd.result == 'loss'}\"\n                      class=\"list-inline-item font-weight-light\">\n                      Final game was a {{c.final_rd.score}} - {{c.final_rd.oppo_score}} {{c.final_rd.result}} (a difference of {{c.final_rd.diff|addplus}}) against {{c.final_rd.oppo}}\n                      </li>\n                    </ul>\n                  </div>\n                </b-collapse>\n            </div>\n          </div>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n      <p>Coming Soon!</p>\n      </div>\n     <!-- <b-form-row class=\"my-1\">\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label for=\"search1\">Player 1</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input placeholder=\"Start typing player name\" size=\"sm\" id=\"search1\" v-model=\"search1\" type=\"search\"></b-form-input>\n        </b-col>\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label class=\"ml-2\" for=\"search2\">Player 2</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input size=\"sm\" placeholder=\"Start typing player name\" id=\"search2\" v-model=\"search2\" type=\"search\"></b-form-input>\n        </b-col>\n      </b-form-row>\n      <b-row cols=\"4\">\n        <b-col></b-col>\n        <b-col>{{search1}}</b-col>\n        <b-col></b-col>\n        <b-col>{{search2}}</b-col>\n      </b-row>\n      -->\n    </template>\n  </div>\n</div>\n  ",
  data: function data() {
    return {
      view: 'profile',
      // showTouStats: false,
      psearch: null,
      search1: null,
      search2: null,
      pdata: {},
      pslug: null,
      collapse: 'collapse',
      loading: null,
      notfound: null,
      autoCompleteStyle: {
        vueSimpleSuggest: "position-relative",
        inputWrapper: "",
        defaultInput: "form-control",
        suggestions: "position-absolute list-group z-1000",
        suggestItem: "list-group-item"
      },
      imgProps: {
        block: true,
        thumbnail: true,
        fluid: true,
        blank: true,
        blankColor: '#666',
        width: 120,
        height: 120,
        "class": 'mb-3 shadow-sm'
      }
    };
  },
  created: function created() {
    this.getPlayers();
  },
  watch: {
    view: {
      handler: function handler(n) {
        console.log(n);
      }
    },
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
      this.notfound = true;
      console.log(i);
      var s = i.slug;

      if (s) {
        console.log(s);
        this.pslug = s;
        this.$store.dispatch('GET_PLAYER_TOU_DATA', this.pslug);
        this.notfound = false;
      } else {
        this.notfound = true;
      }
    },
    tourney_podiums: function tourney_podiums(rank) {
      var c = this.pdata.competitions;

      var wins = _.filter(c, ['final_rank', rank]);

      return wins.length;
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
  template: "<!-- Rating Stats -->\n  <div class=\"row\">\n    <div class=\"col-8 offset-2 justify-content-center align-items-center\">\n      <b-table responsive=\"sm\" hover striped foot-clone :items=\"computed_items\" :fields=\"fields\" head-variant=\"dark\">\n          <!-- A virtual column -->\n          <template v-slot:cell(rating_change)=\"data\">\n            <span v-bind:class=\"{\n           'text-info': data.item.rating_change == 0,\n           'text-danger': data.item.rating_change < 0,\n           'text-success': data.item.rating_change > 0 }\">\n            {{data.item.rating_change}}\n            <i v-bind:class=\"{\n             'fas fa-long-arrow-left':data.item.rating_change == 0,\n             'fas fa-long-arrow-down': data.item.rating_change < 0,\n             'fas fa-long-arrow-up': data.item.rating_change > 0 }\" aria-hidden=\"true\"></i>\n           </span>\n          </template>\n          <template v-slot:cell(name)=\"data\">\n            <b-img-lazy :title=\"data.item.name\" :alt=\"data.item.name\" :src=\"data.item.photo\" v-bind=\"picProps\"></b-img-lazy>\n          {{data.item.name}}\n          </template>\n          <template slot=\"table-caption\">\n            {{caption}}\n          </template>\n      </b-table>\n    </div>\n  </div>\n    ",
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
      // var category =  payload.toLowerCase().split(' ').map((s)  =>s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Byb2ZpbGUuanMiLCJ2dWUvcGFnZXMvcmF0aW5nX3N0YXRzLmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc2NvcmVzaGVldC5qcyIsInZ1ZS9wYWdlcy9zdGF0cy5qcyIsInZ1ZS9wYWdlcy90b3AuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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WSxLQUFaO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsS0FBOUI7QUFDRCxPQTFCQztBQTJCTDtBQTFOTTtBQXhUa0IsQ0FBZixDQUFkLEMsQ0FzaEJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2RlZmluZVByb3BlcnR5OyIsImZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgXCJkZWZhdWx0XCI6IG9ialxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQ7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiY29uc3QgYmFzZVVSTCA9ICcvd3AtanNvbi93cC92Mi8nO1xyXG5jb25zdCBhdXRoVVJMID0gJy93cC1qc29uL2p3dC1hdXRoL3YxLyc7XHJcbmNvbnN0IHByb2ZpbGVVUkwgPSAnL3dwLWpzb24vdG91cy92MS9wbGF5ZXJzJztcclxuY29uc3Qgc3RhdHNVUkwgPSAnL3dwLWpzb24vdG91cy92MS9zdGF0cy8nO1xyXG5leHBvcnQgeyBiYXNlVVJMLCBhdXRoVVJMLCBwcm9maWxlVVJMLCBzdGF0c1VSTCAgfTtcclxuXHJcbiIsImltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlLmpzJztcclxuaW1wb3J0IHNjckxpc3QgZnJvbSAnLi9wYWdlcy9saXN0LmpzJztcclxuaW1wb3J0IHREZXRhaWwgZnJvbSAnLi9wYWdlcy9kZXRhaWwuanMnO1xyXG5pbXBvcnQgQ2F0ZURldGFpbCBmcm9tICcuL3BhZ2VzL2NhdGVnb3J5LmpzJztcclxuaW1wb3J0IHNDYXJkIGZyb20gJy4vcGFnZXMvc2NvcmVzaGVldC5qcyc7XHJcblxyXG5WdWUuZmlsdGVyKCdhYmJydicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiAgJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBmaXJzdCA9IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIHZhciBuID0gdmFsdWUudHJpbSgpLnNwbGl0KFwiIFwiKTtcclxuICB2YXIgbGFzdCA9IG5bbi5sZW5ndGggLSAxXTtcclxuICByZXR1cm4gZmlyc3QgKyBcIi4gXCIgKyBsYXN0O1xyXG59KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2ZpcnN0Y2hhcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pO1xyXG5cclxuVnVlLmZpbHRlcignYWRkcGx1cycsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiAnJztcclxuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgdmFyIG4gPSBNYXRoLmZsb29yKE51bWJlcih2YWx1ZSkpO1xyXG4gIGlmIChuICE9PSBJbmZpbml0eSAmJiBTdHJpbmcobikgPT09IHZhbHVlICYmIG4gPiAwKSB7XHJcbiAgICByZXR1cm4gJysnICsgdmFsdWU7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufSk7XHJcblxyXG5WdWUuZmlsdGVyKCdwcmV0dHknLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh2YWx1ZSksIG51bGwsIDIpO1xyXG59KTtcclxuXHJcbiAgY29uc3Qgcm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgIGNvbXBvbmVudDogc2NyTGlzdCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ05TRiBUb3VybmFtZW50cyAtIFJlc3VsdHMgYW5kIFN0YXRpc3RpY3MnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzLzpzbHVnJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IHREZXRhaWwsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdUb3VybmFtZW50IERldGFpbHMnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcnLFxyXG4gICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgIGNvbXBvbmVudDogQ2F0ZURldGFpbCxcclxuICAgICAgcHJvcHM6IHRydWUsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcvOnBubycsXHJcbiAgICAgIG5hbWU6ICdTY29yZXNoZWV0JyxcclxuICAgICAgY29tcG9uZW50OiBzQ2FyZCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ1BsYXllciBTY29yZWNhcmRzJyB9XHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbmNvbnN0IHJvdXRlciA9IG5ldyBWdWVSb3V0ZXIoe1xyXG4gIG1vZGU6ICdoaXN0b3J5JyxcclxuICByb3V0ZXM6IHJvdXRlcywgLy8gc2hvcnQgZm9yIGByb3V0ZXM6IHJvdXRlc2BcclxufSk7XHJcbnJvdXRlci5iZWZvcmVFYWNoKCh0bywgZnJvbSwgbmV4dCkgPT4ge1xyXG4gIGRvY3VtZW50LnRpdGxlID0gdG8ubWV0YS50aXRsZTtcclxuICBuZXh0KCk7XHJcbn0pO1xyXG5cclxubmV3IFZ1ZSh7XHJcbiAgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSxcclxuICByb3V0ZXIsXHJcbiAgbWl4aW5zOiBbVnVlMkZpbHRlcnMubWl4aW5dLFxyXG4gIHN0b3JlXHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBMb2FkaW5nQWxlcnQgPSBWdWUuY29tcG9uZW50KCdsb2FkaW5nJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgbWF4LXZ3LTc1IG10LTVcIj5cclxuXHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImxkcy1ibG9ja3MgbXQtNVwiIHdpZHRoPVwiMjAwcHhcIiAgaGVpZ2h0PVwiMjAwcHhcIiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwKSBub25lIHJlcGVhdCBzY3JvbGwgMCUgMCU7XCI+PHJlY3QgeD1cIjE5XCIgeT1cIjE5XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNDBcIiB5PVwiMTlcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuMTVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCIxOVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC4zc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiMTlcIiB5PVwiNDBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjEuMDVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCI0MFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC40NDk5OTk5OTk5OTk5OTk5NnNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjE5XCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjg5OTk5OTk5OTk5OTk5OTlzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI0MFwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC43NXNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjYxXCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjFzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjJzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgIDwvcmVjdD48L3N2Zz5cclxuICAgICAgIDxoNCBjbGFzcz1cImRpc3BsYXktMyBiZWJhcyB0ZXh0LWNlbnRlciB0ZXh0LXNlY29uZGFyeVwiPkxvYWRpbmcuLlxyXG4gICAgICAgIDwhLS0gPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nLi48L3NwYW4+XHJcbiAgICAgICAgLS0+XHJcbiAgICAgICA8L2g0PlxyXG4gICAgPC9kaXY+YFxyXG4gfSk7XHJcblxyXG52YXIgRXJyb3JBbGVydCA9VnVlLmNvbXBvbmVudCgnZXJyb3InLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbXQtNSBteC1hdXRvIGQtYmxvY2sgbWF4LXZ3LTc1XCIgcm9sZT1cImFsZXJ0XCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJhbGVydC1oZWFkaW5nIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8c2xvdCBuYW1lPVwiZXJyb3JcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5FcnJvci4uLjwvc3Bhbj5cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yX21zZ1wiPjwvc2xvdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gLFxyXG4gICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICByZXR1cm4ge307XHJcbiAgIH0sXHJcbiB9KTtcclxuIGxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG4gdmFyIExvZ2luRm9ybSA9VnVlLmNvbXBvbmVudCgnbG9naW4nLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvZ2luX3N1Y2Nlc3NcIiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtMiBweS0xXCI+PGkgY2xhc3M9XCJmYXMgZmEtdXNlci1hbHRcIj48L2k+IDxzbWFsbD5XZWxjb21lIHt7dXNlcl9kaXNwbGF5fX08L3NtYWxsPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LTIgcHktMVwiIEBjbGljaz1cImxvZ091dFwiPjxpIHN0eWxlPVwiY29sb3I6dG9tYXRvXCIgY2xhc3M9XCJmYXMgZmEtc2lnbi1vdXQtYWx0IFwiPjwvaT48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZT5cclxuICAgICAgICAgIDxiLWZvcm0gQHN1Ym1pdD1cIm9uU3VibWl0XCIgaW5saW5lIGNsYXNzPVwidy04MCBteC1hdXRvXCI+XHJcbiAgICAgICAgICA8Yi1mb3JtLWludmFsaWQtZmVlZGJhY2sgOnN0YXRlPVwidmFsaWRhdGlvblwiPlxyXG4gICAgICAgICAgICBZb3VyIHVzZXJuYW1lIG9yIHBhc3N3b3JkIG11c3QgYmUgbW9yZSB0aGFuIDEgY2hhcmFjdGVyIGluIGxlbmd0aC5cclxuICAgICAgICAgICAgPC9iLWZvcm0taW52YWxpZC1mZWVkYmFjaz5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNyLW9ubHlcIiBmb3I9XCJpbmxpbmUtZm9ybS1pbnB1dC11c2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDxiLWlucHV0XHJcbiAgICAgICAgICBpZD1cImlubGluZS1mb3JtLWlucHV0LXVzZXJuYW1lXCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiIDpzdGF0ZT1cInZhbGlkYXRpb25cIlxyXG4gICAgICAgICAgY2xhc3M9XCJtYi0yIG1yLXNtLTIgbWItc20tMCBmb3JtLWNvbnRyb2wtc21cIlxyXG4gICAgICAgICAgdi1tb2RlbD1cImZvcm0udXNlclwiID5cclxuICAgICAgICAgIDwvYi1pbnB1dD5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICA8Yi1pbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImlubGluZS1mb3JtLWlucHV0LXBhc3N3b3JkXCIgOnN0YXRlPVwidmFsaWRhdGlvblwiIGNsYXNzPVwiZm9ybS1jb250cm9sLXNtXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHYtbW9kZWw9XCJmb3JtLnBhc3NcIj48L2ItaW5wdXQ+XHJcbiAgICAgICAgICA8L2ItaW5wdXQtZ3JvdXA+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwib3V0bGluZS1kYXJrXCIgc2l6ZT1cInNtXCIgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWwtc20tMlwiPlxyXG4gICAgICAgICAgICA8aSAgOmNsYXNzPVwieydmYS1zYXZlJyA6IGxvZ2luX2xvYWRpbmcgPT0gZmFsc2UsICdmYS1zcGlubmVyIGZhLXB1bHNlJzogbG9naW5fbG9hZGluZyA9PSB0cnVlfVwiIGNsYXNzPVwiZmFzXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9iLWZvcm0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9ybToge1xyXG4gICAgICAgIHBhc3M6JycsXHJcbiAgICAgICAgdXNlcjogJydcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgIH0sXHJcbiAgIG1vdW50ZWQoKSB7XHJcbiAgICBpZih0aGlzLmFjY2Vzcy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnQVVUSF9UT0tFTicsIHRoaXMuYWNjZXNzKTtcclxuICAgICB9XHJcbiAgICAgY29uc29sZS5sb2codGhpcy51c2VyX2Rpc3BsYXkpXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBvblN1Ym1pdChldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5mb3JtKSk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19MT0dJTicsIHRoaXMuZm9ybSk7XHJcbiAgICB9LFxyXG4gICAgbG9nT3V0KCkge1xyXG4gICAgICAvLyAgbG9nb3V0IGZ1bmN0aW9uXHJcbiAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkIGxvZ091dCcpO1xyXG4gICAgfVxyXG4gICB9LFxyXG4gICBjb21wdXRlZDoge1xyXG4gICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICAgbG9naW5fbG9hZGluZzogJ0xPR0lOX0xPQURJTkcnLFxyXG4gICAgICAgbG9naW5fc3VjY2VzczogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gICAgICAgdXNlcl9kaXNwbGF5OiAnVVNFUicsXHJcbiAgICAgICBhY2Nlc3M6ICdBQ0NFU1NfVE9LRU4nXHJcbiAgICAgfSksXHJcblxyXG4gICAgIHZhbGlkYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZvcm0udXNlci5sZW5ndGggPiAxICYmIHRoaXMuZm9ybS5wYXNzLmxlbmd0aCA+IDFcclxuICAgIH0sXHJcbiAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQsIExvZ2luRm9ybSB9O1xyXG5cclxuIiwiaW1wb3J0IHsgUGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c30gZnJvbSAnLi9wbGF5ZXJsaXN0LmpzJztcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0IHsgSGlXaW5zLCBMb1dpbnMsIEhpTG9zcywgQ29tYm9TY29yZXMsIFRvdGFsU2NvcmVzLCBUb3RhbE9wcFNjb3JlcywgQXZlU2NvcmVzLCBBdmVPcHBTY29yZXMsIEhpU3ByZWFkLCBMb1NwcmVhZCB9IGZyb20gJy4vc3RhdHMuanMnO1xyXG5pbXBvcnQgU3RhdHNQcm9maWxlIGZyb20gJy4vcHJvZmlsZS5qcyc7XHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vc2NvcmVib2FyZC5qcyc7XHJcbmltcG9ydCBSYXRpbmdTdGF0cyBmcm9tICcuL3JhdGluZ19zdGF0cy5qcyc7XHJcbmltcG9ydCB0b3BQZXJmb3JtZXJzIGZyb20gJy4vdG9wLmpzJztcclxuZXhwb3J0IHsgQ2F0ZURldGFpbCBhcyBkZWZhdWx0IH07XHJcbmxldCBDYXRlRGV0YWlsID0gVnVlLmNvbXBvbmVudCgnY2F0ZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy10b3BcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cIiEoZXJyb3J8fGxvYWRpbmcpXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwidmlld0luZGV4ICE9OCAmJiB2aWV3SW5kZXggIT01XCIgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLTBcIj5cclxuICAgICAgICAgICAgICAgICAgPGItaW1nIGZsdWlkIGNsYXNzPVwidGh1bWJuYWlsIGxvZ29cIiA6c3JjPVwibG9nb1wiIDphbHQ9XCJldmVudF90aXRsZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwidG90YWxfcm91bmRzKyAnIHJvdW5kcywgJyArIHRvdGFsX3BsYXllcnMgKycgcGxheWVycydcIiB2LXNob3c9XCJ0b3RhbF9yb3VuZHNcIiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj57eyB0b3RhbF9yb3VuZHMgfX0gR2FtZXMge3sgdG90YWxfcGxheWVyc319IDxpIGNsYXNzPVwiZmFzIGZhLXVzZXJzXCI+PC9pPiA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTBcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTBcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MFwiPjxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFBsYXllcnM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0xXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0xXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTFcIj4gPGkgY2xhc3M9XCJmYSBmYS11c2VyLXBsdXNcIj48L2k+IFBhaXJpbmdzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MlwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0yXCI+PGItaWNvbiBpY29uPVwiZG9jdW1lbnQtdGV4dFwiPjwvYi1pY29uPiBSZXN1bHRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlJvdW5kLUJ5LVJvdW5kIFN0YW5kaW5nc1wiIEBjbGljaz1cInZpZXdJbmRleD0zXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0zXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTNcIj48Yi1pY29uIGljb249XCJsaXN0LW9sXCI+PC9iLWljb24+IFN0YW5kaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDYXRlZ29yeSBTdGF0aXN0aWNzXCIgQGNsaWNrPVwidmlld0luZGV4PTRcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTRcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NFwiPjxiLWljb24gaWNvbj1cImJhci1jaGFydC1maWxsXCI+PC9iLWljb24+IFN0YXRpc3RpY3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgIGV2ZW50X3NsdWc6c2x1ZywgcG5vOjF9fVwiPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiPjxiLWljb24gaWNvbj1cImRvY3VtZW50cy1hbHRcIj48L2ItaWNvbj4gU2NvcmVjYXJkczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUm91bmQtQnktUm91bmQgU2NvcmVib2FyZFwiIEBjbGljaz1cInZpZXdJbmRleD01XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTVcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NVwiPjxiLWljb24gaWNvbj1cImRpc3BsYXlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFNjb3JlYm9hcmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiVG9wIDMgUGVyZm9ybWFuY2VzXCIgQGNsaWNrPVwidmlld0luZGV4PTZcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT02XCI+PGItaWNvbiBpY29uPVwiYXdhcmRcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFRvcCBQZXJmb3JtZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlBvc3QtdG91cm5leSBSYXRpbmcgU3RhdGlzdGljc1wiIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9N1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT03XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTdcIj5cclxuICAgICAgICAgICAgICAgIDxiLWljb24gaWNvbj1cImdyYXBoLXVwXCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBSYXRpbmcgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUGxheWVyIFByb2ZpbGUgYW5kIFN0YXRpc3RpY3NcIiAgQGNsaWNrPVwidmlld0luZGV4PThcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09OFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT04XCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJ0cm9waHlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFByb2ZpbGUgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMSBjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzIHAtMCBtLTBcIj4ge3t0YWJfaGVhZGluZ319XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInZpZXdJbmRleCA+MCAmJiB2aWV3SW5kZXggPCA0XCI+XHJcbiAgICAgICAgICAgICAge3sgY3VycmVudFJvdW5kIH19XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJzaG93UGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCJ0b3RhbF9yb3VuZHNcIiB2LW1vZGVsPVwiY3VycmVudFJvdW5kXCIgOnBlci1wYWdlPVwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cInRydWVcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIGNoYW5nZT1cInJvdW5kQ2hhbmdlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvYi1wYWdpbmF0aW9uPlxyXG4gICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTBcIj5cclxuICAgICAgICAgIDxhbGxwbGF5ZXJzIDpzbHVnPVwic2x1Z1wiPjwvYWxscGxheWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT02XCI+XHJcbiAgICAgICAgICA8cGVyZm9ybWVycz48L3BlcmZvcm1lcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09N1wiPlxyXG4gICAgICAgICAgPHJhdGluZ3MgOmNhcHRpb249XCJjYXB0aW9uXCIgOmNvbXB1dGVkX2l0ZW1zPVwiY29tcHV0ZWRfcmF0aW5nX2l0ZW1zXCI+XHJcbiAgICAgICAgICA8L3JhdGluZ3M+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09OFwiPlxyXG4gICAgICAgICAgIDxwcm9maWxlcz48L3Byb2ZpbGVzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTVcIj5cclxuICAgICAgICA8c2NvcmVib2FyZCA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCI+PC9zY29yZWJvYXJkPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTRcIiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMCBjb2xcIj5cclxuICAgICAgICAgICAgICAgIDxiLXRhYnMgY29udGVudC1jbGFzcz1cIm10LTMgc3RhdHNUYWJzXCIgcGlsbHMgc21hbGwgbGF6eSBuby1mYWRlICB2LW1vZGVsPVwidGFiSW5kZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGl3aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaXdpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIExvc3Nlc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaWxvc3MgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGlsb3NzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG93aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sb3dpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJDb21iaW5lZCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbWJvc2NvcmVzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbWJvc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0b3RhbHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9zY29yZScpXCI+PC90b3RhbHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9vcHBzY29yZScpXCI+PC9vcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX3Njb3JlJylcIj48L2F2ZXNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX29wcHNjb3JlJylcIj48L2F2ZW9wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggU3ByZWFkcyBcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlzcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9oaXNwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBTcHJlYWRzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvbG9zcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgIDwvYi10YWJzPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggb2Zmc2V0LW1kLTIgY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8cGFpcmluZ3MgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTFcIj48L3BhaXJpbmdzPlxyXG4gICAgICAgICAgICAgICAgPHJlc3VsdHMgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTJcIj48L3Jlc3VsdHM+XHJcbiAgICAgICAgICAgICAgICA8c3RhbmRpbmdzIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIiB2LWlmPVwidmlld0luZGV4PT0zXCI+PC9zdGFuZGluZ3M+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgYWxscGxheWVyczogUGxheWVyTGlzdCxcclxuICAgIHBhaXJpbmdzOiBQYWlyaW5ncyxcclxuICAgIHJlc3VsdHM6IFJlc3VsdHMsXHJcbiAgICByYXRpbmdzOiBSYXRpbmdTdGF0cyxcclxuICAgIHN0YW5kaW5nczogU3RhbmRpbmdzLFxyXG4gICAgaGl3aW5zOiBIaVdpbnMsXHJcbiAgICBoaWxvc3M6IEhpTG9zcyxcclxuICAgIGxvd2luOiBMb1dpbnMsXHJcbiAgICBjb21ib3Njb3JlczogQ29tYm9TY29yZXMsXHJcbiAgICB0b3RhbHNjb3JlczogVG90YWxTY29yZXMsXHJcbiAgICBvcHBzY29yZXM6IFRvdGFsT3BwU2NvcmVzLFxyXG4gICAgYXZlc2NvcmVzOiBBdmVTY29yZXMsXHJcbiAgICBhdmVvcHBzY29yZXM6IEF2ZU9wcFNjb3JlcyxcclxuICAgIGhpc3ByZWFkOiBIaVNwcmVhZCxcclxuICAgIGxvc3ByZWFkOiBMb1NwcmVhZCxcclxuICAgIC8vICdsdWNreXN0aWZmLXRhYmxlJzogTHVja3lTdGlmZlRhYmxlLFxyXG4gICAgLy8gJ3R1ZmZsdWNrLXRhYmxlJzogVHVmZkx1Y2tUYWJsZVxyXG4gICAgc2NvcmVib2FyZDogU2NvcmVib2FyZCxcclxuICAgIHBlcmZvcm1lcnM6IHRvcFBlcmZvcm1lcnMsXHJcbiAgICBwcm9maWxlczogU3RhdHNQcm9maWxlXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGdhbWVkYXRhOiBbXSxcclxuICAgICAgdGFiSW5kZXg6IDAsXHJcbiAgICAgIHZpZXdJbmRleDogMCxcclxuICAgICAgY3VycmVudFJvdW5kOiAxLFxyXG4gICAgICB0YWJfaGVhZGluZzogJycsXHJcbiAgICAgIGNhcHRpb246ICcnLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgIGNvbXB1dGVkX3JhdGluZ19pdGVtczogW10sXHJcbiAgICAgIGx1Y2t5c3RpZmY6IFtdLFxyXG4gICAgICB0dWZmbHVjazogW10sXHJcbiAgICAgIHRpbWVyOiAnJyxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3SW5kZXg6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBpZiAodmFsICE9IDQpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Vmlldyh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJhdGluZ19zdGF0czoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRWaWV3OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRWaWV3IGZ1bmN0aW9uIHZhbC0+ICcgKyB2YWwpO1xyXG4gICAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGxheWVycyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQYWlyaW5nIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcqUGxheXMgZmlyc3QnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1Jlc3VsdHMgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1Jlc3VsdHMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1N0YW5kaW5ncyBhZnRlciBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnU3RhbmRpbmdzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSBudWxsO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQb3N0IFRvdXJuYW1lbnQgUmF0aW5nIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhdGluZyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gbnVsbDtcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5X3RpdGxlLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICBzbHVnOiB0aGlzLnRvdXJuZXlfc2x1ZyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvL3RleHQ6IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KSxcclxuICAgICAgICAgIC8vIGxldCBjYXRlZ29yeSA9IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KTtcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0ICBiYXNlVVJMICBmcm9tICcuLi9jb25maWcuanMnO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5sZXQgdERldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ3RkZXRhaWwnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgdGV4dC1jZW50ZXIgZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtbGctY2VudGVyIGp1c3RpZnktY29udGVudC1zdGFydFwiPlxyXG4gICAgICAgICAgICA8Yi1pbWcgc2xvdD1cImFzaWRlXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIiBjbGFzcz1cImFsaWduLXNlbGYtY2VudGVyIG1yLTMgcm91bmRlZCBpbWctZmx1aWRcIlxyXG4gICAgICAgICAgICAgIDpzcmM9XCJ0b3VybmV5LmV2ZW50X2xvZ29cIiB3aWR0aD1cIjE1MFwiIGhlaWdodD1cIjE1MFwiIDphbHQ9XCJ0b3VybmV5LmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJteC0xIGRpc3BsYXktNFwiPlxyXG4gICAgICAgICAgICAgIHt7dG91cm5leS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyXCIgaWQ9XCJldmVudC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnN0YXJ0X2RhdGVcIj48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnN0YXJ0X2RhdGV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnZlbnVlXCI+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiB7e3RvdXJuZXkudmVudWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaWY9XCJ0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3JcIj48aSBjbGFzcz1cImZhIGZhLWxlZ2FsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3J9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxoNT5cclxuICAgICAgICAgICAgICBDYXRlZ29yaWVzIDxpIGNsYXNzPVwiZmEgZmEtbGlzdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtZm9yPVwiKGNhdCwgYykgaW4gdG91cm5leS50b3VfY2F0ZWdvcmllc1wiIDprZXk9XCJjXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImNhdC5ldmVudF9pZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnQ2F0ZURldGFpbCcsIHBhcmFtczogeyAgZXZlbnRfc2x1ZzpjYXQuZXZlbnRfc2x1ZyB9fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7Y2F0LmNhdF9uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3tjYXQuY2F0X25hbWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9kaXY+XHJcbiAgICAgICBgLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgcGFnZXVybDogYCR7YmFzZVVSTH10b3VybmFtZW50YCArIHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IGBUb3VybmFtZW50OiAke3RoaXMudG91cm5leS50aXRsZX1gO1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgIGlmICh0aGlzLnRvdXJuZXkuc2x1ZyAhPSB0aGlzLnNsdWcpIHtcclxuICAgICAgICAvLyByZXNldCB0aXRsZSBiZWNhdXNlIG9mIGJyZWFkY3J1bWJzXHJcbiAgICAgICAgdGhpcy50b3VybmV5LnRpdGxlID0gJyc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGUgPSB0aGlzLnRvdWxpc3QuZmluZChldmVudCA9PiBldmVudC5zbHVnID09PSB0aGlzLnNsdWcpO1xyXG4gICAgICBpZiAoZSkge1xyXG4gICAgICAgIGxldCBub3cgPSBtb21lbnQoKTtcclxuICAgICAgICBjb25zdCBhID0gbW9tZW50KHRoaXMubGFzdF9hY2Nlc3NfdGltZSk7XHJcbiAgICAgICAgY29uc3QgdGltZV9lbGFwc2VkID0gbm93LmRpZmYoYSwgJ3NlY29uZHMnKTtcclxuICAgICAgICBpZiAodGltZV9lbGFwc2VkIDwgMzAwKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLU1hdGNoIEZvdW5kIGluIFRvdXJuZXkgTGlzdC0tLS0tLS0tLS0nKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGltZV9lbGFwc2VkKTtcclxuICAgICAgICAgIHRoaXMudG91cm5leSA9IGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREVUQUlMJywgdGhpcy5zbHVnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgLy8gdG91cm5leTogJ0RFVEFJTCcsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGxhc3RfYWNjZXNzX3RpbWU6ICdUT1VBQ0NFU1NUSU1FJyxcclxuICAgICAgdG91bGlzdDogJ1RPVUFQSSdcclxuICAgIH0pLFxyXG4gICAgdG91cm5leToge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3RvcmUuZ2V0dGVycy5ERVRBSUw7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgbmV3VmFsKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5LnRpdGxlLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3Vlcy4gUGxlYXNlIHJlZnJlc2ggdG8gdHJ5IGFnYWluIGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdERldGFpbDtcclxuIiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbi8vIGxldCBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQ7XHJcbmltcG9ydCB7TG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0fSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmxldCBzY3JMaXN0ID0gVnVlLmNvbXBvbmVudCgnc2NyTGlzdCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnJlYWRjcnVtYiA6aXRlbXM9XCJicmVhZGNydW1ic1wiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzcz1cImJlYmFzIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT4gVG91cm5hbWVudHNcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LXN0YXJ0IGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiPlxyXG4gICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQtbXV0ZWRcIj5Zb3UgYXJlIG9uIHBhZ2Uge3tjdXJyZW50UGFnZX19IG9mIHt7V1BwYWdlc319IHBhZ2VzOyA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPiB0b3VybmFtZW50cyE8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2ICBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIiB2LWZvcj1cIml0ZW0gaW4gdG91cm5leXNcIiA6a2V5PVwiaXRlbS5pZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC1sZy1yb3cgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1sZy1jZW50ZXIganVzdGlmeS1jb250ZW50LXN0YXJ0IHRvdXJuZXktbGlzdCBhbmltYXRlZCBib3VuY2VJbkxlZnRcIiA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXItbGctNVwiPlxyXG4gICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZyBmbHVpZCBjbGFzcz1cInRodW1ibmFpbFwiXHJcbiAgICAgICAgICAgICAgICAgIDpzcmM9XCJpdGVtLmV2ZW50X2xvZ29cIiB3aWR0aD1cIjEwMFwiICBoZWlnaHQ9XCIxMDBcIiA6YWx0PVwiaXRlbS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLWF1dG9cIj5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwibWItMSBkaXNwbGF5LTVcIj5cclxuICAgICAgICAgICAgPHJvdXRlci1saW5rIHYtaWY9XCJpdGVtLnNsdWdcIiA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICB7e2l0ZW0udGl0bGV9fVxyXG4gICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgICAgPHNtYWxsPjxpIGNsYXNzPVwiZmEgZmEtY2FsZW5kYXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAge3tpdGVtLnN0YXJ0X2RhdGV9fVxyXG4gICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgPHNtYWxsPjxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAge3tpdGVtLnZlbnVlfX1cclxuICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgPHJvdXRlci1saW5rIHYtaWY9XCJpdGVtLnNsdWdcIiA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzbWFsbCB0aXRsZT1cIkJyb3dzZSB0b3VybmV5XCI+PGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZWdvcnktbGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gbXgtYXV0b1wiXHJcbiAgICAgICAgICAgICAgdi1mb3I9XCJjYXRlZ29yeSBpbiBpdGVtLnRvdV9jYXRlZ29yaWVzXCI+e3tjYXRlZ29yeS5jYXRfbmFtZX19PC9saT5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWxnLWVuZFwiPlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJteS0wIHB5LTBcIj48c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+WW91IGFyZSBvbiBwYWdlIHt7Y3VycmVudFBhZ2V9fSBvZiB7e1dQcGFnZXN9fSBwYWdlcyB3aXRoIDxzcGFuIGNsYXNzPVwiZW1waGFzaXplXCI+e3tXUHRvdGFsfX08L3NwYW4+XHJcbiAgICAgICAgICB0b3VybmFtZW50cyE8L3NtYWxsPjwvcD5cclxuICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCIrV1B0b3RhbFwiIEBjaGFuZ2U9XCJmZXRjaExpc3RcIiB2LW1vZGVsPVwiY3VycmVudFBhZ2VcIiA6cGVyLXBhZ2U9XCIxMFwiXHJcbiAgICAgICAgICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICB9O1xyXG4gICAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdC5qcyBsb2FkZWQnKVxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnU2NyYWJibGUgVG91cm5hbWVudHMgLSBOU0YnO1xyXG4gICAgdGhpcy5mZXRjaExpc3QodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaExpc3Q6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuICAgICAgLy90aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFnZU51bSwge1xyXG4gICAgICAgIC8vIHRpbWVvdXQ6IDM2MDAwMDAgLy8xIGhvdXIgY2FjaGVcclxuICAgICAvLyB9KTtcclxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2VOdW07XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9BUEknLCBwYWdlTnVtKTtcclxuICAgICAgY29uc29sZS5sb2coJ2RvbmUhJyk7XHJcbiAgICB9LFxyXG5cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgdG91cm5leXM6ICdUT1VBUEknLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBXUHRvdGFsOiAnV1BUT1RBTCcsXHJcbiAgICAgIFdQcGFnZXM6ICdXUFBBR0VTJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFNvcnJ5IHdlIGFyZSBjdXJyZW50bHkgaGF2aW5nIHRyb3VibGUgZmluZGluZyB0aGUgbGlzdCBvZiB0b3VybmFtZW50cy5gO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHNjckxpc3Q7IiwidmFyIHBsYXllcl9taXhlZF9zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3Jhbmtfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzID0gW10gIDtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnID0ge1xyXG4gIHBsb3RPcHRpb25zOiB7XHJcbiAgICByYWRpYWxCYXI6IHtcclxuICAgICAgaG9sbG93OiB7IHNpemU6ICc1MCUnLCB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG59O1xyXG5cclxudmFyIHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBjaGFydDoge1xyXG4gICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB6b29tOiB7XHJcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgc2hhZG93OiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHRvcDogMTgsXHJcbiAgICAgIGxlZnQ6IDcsXHJcbiAgICAgIGJsdXI6IDEwLFxyXG4gICAgICBvcGFjaXR5OiAxXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbJyM3N0I2RUEnLCAnIzU0NTQ1NCddLFxyXG4gIGRhdGFMYWJlbHM6IHtcclxuICAgIGVuYWJsZWQ6IHRydWVcclxuICB9LFxyXG4gIHN0cm9rZToge1xyXG4gICAgY3VydmU6ICdzbW9vdGgnIC8vIHN0cmFpZ2h0XHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgdGV4dDogJycsXHJcbiAgICBhbGlnbjogJ2xlZnQnXHJcbiAgfSxcclxuICBncmlkOiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgcm93OiB7XHJcbiAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICBvcGFjaXR5OiAwLjVcclxuICAgIH0sXHJcbiAgfSxcclxuICB4YXhpczoge1xyXG4gICAgY2F0ZWdvcmllczogW10sXHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgeWF4aXM6IHtcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgbWluOiBudWxsLFxyXG4gICAgbWF4OiBudWxsXHJcbiAgfSxcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgb2Zmc2V0WDogLTVcclxuICB9XHJcbn07XHJcblxyXG52YXIgUGxheWVyU3RhdHMgPSBWdWUuY29tcG9uZW50KCdwbGF5ZXJzdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluTGVmdEJpZ1wiIGlkPVwicGhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXNcIj57e3BsYXllck5hbWV9fVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBpbWctZmx1aWQgbXgtMyBkLWJsb2NrIHNoYWRvdy1zbVwiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwicGxheWVyLnBob3RvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgeWFub25lIG14LTNcIj57e3BzdGF0cy5wUG9zaXRpb259fSBwb3NpdGlvbjwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+IDwhLS0gI3BoZWFkZXItLT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UxIGNsYXNzPVwibS0xXCI+UXVpY2sgU3RhdHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UyIGNsYXNzPVwibS0xXCI+Um91bmQgYnkgUm91bmQgPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMyBjbGFzcz1cIm0tMVwiPkNoYXJ0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDbG9zZVwiIHNpemU9XCJzbVwiIEBjbGljaz1cImNsb3NlQ2FyZCgpXCIgY2xhc3M9XCJtLTFcIiB2YXJpYW50PVwib3V0bGluZS1kYW5nZXJcIiA6ZGlzYWJsZWQ9XCIhc2hvd1wiXHJcbiAgICAgICAgICAgIDpwcmVzc2VkLnN5bmM9XCJzaG93XCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTFcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlF1aWNrIFN0YXRzPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaCBzdGF0c1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlBvaW50czpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBQb2ludHN9fSAvIHt7dG90YWxfcm91bmRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5SYW5rOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFJhbmt9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5IaWdoZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEhpU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wSGlTY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBMb1Njb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBPcHAgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlT3BwfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tLS0gUm91bmQgQnkgUm91bmQgUmVzdWx0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMlwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgIDxoND5Sb3VuZCBCeSBSb3VuZCBTdW1tYXJ5IDwvaDQ+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaFwiIHYtZm9yPVwiKHJlcG9ydCwgaSkgaW4gcHN0YXRzLnBSYnlSXCIgOmtleT1cImlcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtaWY9XCJyZXBvcnQucmVzdWx0PT0nd2luJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2RyYXcnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS13YXJuaW5nXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdsb3NzJ1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tZGFuZ2VyXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdhd2FpdGluZydcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1saWdodFwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tIENoYXJ0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlM1wiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkRvd25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+U3RhdHMgQ2hhcnRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdtaXhlZCcpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCI+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZS1jc3ZcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gTWl4ZWQgU2NvcmVzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgncmFuaycpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0ncmFuaydcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LWxpbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUmFuayBwZXIgUmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCd3aW5zJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCI+PGkgY2xhc3M9XCJmYXMgZmEtYmFsYW5jZS1zY2FsZSBmYS1zdGFja1wiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBTdGFydHMvUmVwbGllcyBXaW5zKCUpPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjaGFydFwiPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIiB0eXBlPWxpbmUgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzTWl4ZWRcIiAvPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIHR5cGU9J2xpbmUnIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdGlvbnNSYW5rXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYW5rXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0nd2lucydcIiB0eXBlPXJhZGlhbEJhciBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRSYWRpYWxcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc1JhZGlhbFwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9iLWNhcmQ+XHJcbiAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgcHJvcHM6IFsncHN0YXRzJ10sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgYXBleGNoYXJ0OiBWdWVBcGV4Q2hhcnRzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGxheWVyOiAnJyxcclxuICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgcGxheWVyTmFtZTogJycsXHJcbiAgICAgIGFsbFNjb3JlczogW10sXHJcbiAgICAgIGFsbE9wcFNjb3JlczogW10sXHJcbiAgICAgIGFsbFJhbmtzOiBbXSxcclxuICAgICAgdG90YWxfcGxheWVyczogbnVsbCxcclxuICAgICAgY2hhcnRNb2RlbDogJ3JhbmsnLFxyXG4gICAgICBzZXJpZXNNaXhlZDogcGxheWVyX21peGVkX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFuazogcGxheWVyX3Jhbmtfc2VyaWVzLFxyXG4gICAgICBzZXJpZXNSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzLFxyXG4gICAgICBjaGFydE9wdFJhZGlhbDogcGxheWVyX3JhZGlhbF9jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uc1Jhbms6IHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyxcclxuICAgICAgY2hhcnRPcHRpb25zOiB7XHJcbiAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgIGhlaWdodDogNDAwLFxyXG4gICAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNoYWRvdzoge1xyXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAnLFxyXG4gICAgICAgICAgICB0b3A6IDE4LFxyXG4gICAgICAgICAgICBsZWZ0OiA3LFxyXG4gICAgICAgICAgICBibHVyOiAxMCxcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JzOiBbJyM4RkJDOEYnLCAnIzU0NTQ1NCddLFxyXG4gICAgICAgIGRhdGFMYWJlbHM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZToge1xyXG4gICAgICAgICAgY3VydmU6ICdzdHJhaWdodCcgLy8gc21vb3RoXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgdGV4dDogJycsXHJcbiAgICAgICAgICBhbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgICAgICAgcm93OiB7XHJcbiAgICAgICAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgY2F0ZWdvcmllczogW10sXHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHRleHQ6ICcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWluOiBudWxsLFxyXG4gICAgICAgICAgbWF4OiBudWxsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgICAgICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgICAgICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgICAgICAgb2Zmc2V0WDogLTVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZG9TY3JvbGwoKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc2VyaWVzUmFkaWFsKVxyXG4gICAgdGhpcy5zaG93ID0gdGhpcy5zaG93U3RhdHM7XHJcbiAgICB0aGlzLmFsbFNjb3JlcyA9IF8uZmxhdHRlbih0aGlzLnBzdGF0cy5hbGxTY29yZXMpO1xyXG4gICAgdGhpcy5hbGxPcHBTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsT3BwU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsUmFua3MgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsUmFua3MpO1xyXG4gICAgdGhpcy51cGRhdGVDaGFydCh0aGlzLmNoYXJ0TW9kZWwpO1xyXG4gICAgdGhpcy50b3RhbF9wbGF5ZXJzID0gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcclxuICAgIHRoaXMucGxheWVyID0gdGhpcy5wc3RhdHMucGxheWVyWzBdO1xyXG4gICAgdGhpcy5wbGF5ZXJOYW1lID0gdGhpcy5wbGF5ZXIucG9zdF90aXRsZTtcclxuICB9LFxyXG4gIGJlZm9yZURlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmNsb3NlQ2FyZCgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG5cclxuICAgIGRvU2Nyb2xsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0aGUgcGFnZSwgZXhlY3V0ZSBteUZ1bmN0aW9uXHJcbiAgICAgIHdpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uKCkge215RnVuY3Rpb24oKX07XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIGhlYWRlclxyXG4gICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaGVhZGVyXCIpO1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBvZmZzZXQgcG9zaXRpb24gb2YgdGhlIG5hdmJhclxyXG4gICAgICB2YXIgc3RpY2t5ID0gaGVhZGVyLm9mZnNldFRvcDtcclxuICAgICAgdmFyIGggPSBoZWFkZXIub2Zmc2V0SGVpZ2h0ICsgNTA7XHJcblxyXG4gICAgICAvLyBBZGQgdGhlIHN0aWNreSBjbGFzcyB0byB0aGUgaGVhZGVyIHdoZW4geW91IHJlYWNoIGl0cyBzY3JvbGwgcG9zaXRpb24uIFJlbW92ZSBcInN0aWNreVwiIHdoZW4geW91IGxlYXZlIHRoZSBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgZnVuY3Rpb24gbXlGdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKHN0aWNreSArIGgpKSB7XHJcbiAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZChcInN0aWNreVwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHNldENoYXJ0Q2F0ZWdvcmllczogZnVuY3Rpb24oKXtcclxuICAgICAgbGV0IHJvdW5kcyA9IF8ucmFuZ2UoMSwgdGhpcy50b3RhbF9yb3VuZHMgKyAxKTtcclxuICAgICAgbGV0IHJkcyA9IF8ubWFwKHJvdW5kcywgZnVuY3Rpb24obnVtKXsgcmV0dXJuICdSZCAnKyBudW07IH0pO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy54YXhpcy5jYXRlZ29yaWVzID0gcmRzO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZUNoYXJ0OiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tVXBkYXRpbmcuLi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuY2hhcnRNb2RlbCA9IHR5cGU7XHJcbiAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnRpdGxlLmFsaWduID0gJ2xlZnQnO1xyXG4gICAgICB2YXIgZmlyc3ROYW1lID0gXy50cmltKF8uc3BsaXQodGhpcy5wbGF5ZXJOYW1lLCAnICcsIDIpWzBdKTtcclxuICAgICAgaWYgKCdyYW5rJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgLy8gdGhpcy4gPSAnYmFyJztcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsudGl0bGUudGV4dCA9YFJhbmtpbmc6ICR7dGhpcy5wbGF5ZXJOYW1lfWA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnlheGlzLm1pbiA9IDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnlheGlzLm1heCA9dGhpcy50b3RhbF9wbGF5ZXJzO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFuayA9IFt7XHJcbiAgICAgICAgICBuYW1lOiBgJHtmaXJzdE5hbWV9IHJhbmsgdGhpcyByZGAsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLmFsbFJhbmtzXHJcbiAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ21peGVkJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5zZXRDaGFydENhdGVnb3JpZXMoKVxyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnRpdGxlLnRleHQgPSBgU2NvcmVzOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnlheGlzLm1pbiA9IDEwMDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5tYXggPSA5MDA7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNNaXhlZCA9IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfWAsXHJcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuYWxsU2NvcmVzXHJcbiAgICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6ICdPcHBvbmVudCcsXHJcbiAgICAgICAgICBkYXRhOiB0aGlzLmFsbE9wcFNjb3Jlc1xyXG4gICAgICAgICB9XVxyXG4gICAgICB9XHJcbiAgICAgIGlmICgnd2lucycgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzPSBbXTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmNvbG9ycyA9W107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5sYWJlbHMudW5zaGlmdCgnU3RhcnRzOiAlIFdpbnMnLCdSZXBsaWVzOiAlIFdpbnMnKTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmNvbG9ycy51bnNoaWZ0KCcjN0NGQzAwJywgJyNCREI3NkInKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYXJ0T3B0UmFkaWFsKTtcclxuICAgICAgICB2YXIgcyA9IF8ucm91bmQoMTAwICogKHRoaXMucHN0YXRzLnN0YXJ0V2lucyAvIHRoaXMucHN0YXRzLnN0YXJ0cyksMSk7XHJcbiAgICAgICAgdmFyIHIgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5yZXBseVdpbnMgLyB0aGlzLnBzdGF0cy5yZXBsaWVzKSwxKTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbCA9IFtdO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFkaWFsLnVuc2hpZnQocyxyKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBjbG9zZUNhcmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tQ2xvc2luZyBDYXJkLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJywgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgc2hvd1N0YXRzOiAnU0hPV1NUQVRTJyxcclxuICAgIH0pLFxyXG4gIH0sXHJcblxyXG59KTtcclxuXHJcbnZhciBQbGF5ZXJMaXN0ID0gVnVlLmNvbXBvbmVudCgnYWxscGxheWVycycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1N0YXRzXCI+XHJcbiAgICAgICAgPHBsYXllcnN0YXRzIDpwc3RhdHM9XCJwU3RhdHNcIj48L3BsYXllcnN0YXRzPlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGlkPVwicC1saXN0XCIgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgIDx0cmFuc2l0aW9uLWdyb3VwIHRhZz1cImRpdlwiIG5hbWU9XCJwbGF5ZXJzLWxpc3RcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJwbGF5ZXJDb2xzIG14LTIgcC0yIG1iLTRcIiB2LWZvcj1cInBsYXllciBpbiBkYXRhXCIgOmtleT1cInBsYXllci5pZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW5cIj5cclxuICAgICAgICAgICAgPGg1IGNsYXNzPVwib3N3YWxkXCI+PHNtYWxsPiN7e3BsYXllci5wbm99fTwvc21hbGw+XHJcbiAgICAgICAgICAgIHt7cGxheWVyLnBsYXllcn19PHNwYW4gY2xhc3M9XCJtbC0yXCIgQGNsaWNrPVwic29ydFBvcygpXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtc2l6ZTowLjhlbVwiPjxpIHYtaWY9XCJhc2NcIiBjbGFzcz1cImZhIGZhLXNvcnQtbnVtZXJpYy1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byBzb3J0IERFU0MgYnkgY3VycmVudCByYW5rXCI+PC9pPjxpIHYtZWxzZSBjbGFzcz1cImZhIGZhLXNvcnQtbnVtZXJpYy11cFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBBU0MgYnkgY3VycmVudCByYW5rXCI+PC9pPjwvc3Bhbj48c3BhbiB2LWlmPVwic29ydGVkXCIgY2xhc3M9XCJtbC0zXCIgQGNsaWNrPVwicmVzdG9yZVNvcnQoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSBjbGFzcz1cImZhIGZhLXVuZG9cIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHJlc2V0IGxpc3RcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0byBteS0xXCIgIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtYXV0byBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIiA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm1sLTIgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAnZmEtZmVtYWxlJzogcGxheWVyLmdlbmRlciA9PSAnZicsXHJcbiAgICAgICAgJ2ZhLXVzZXJzJzogcGxheWVyLmlzX3RlYW0gPT0gJ3llcycgfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiY29sb3I6dG9tYXRvOyBmb250LXNpemU6MS40ZW1cIiBjbGFzcz1cIm1sLTVcIiB2LWlmPVwic29ydGVkXCI+e3twbGF5ZXIucG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgdGV4dC1jZW50ZXIgYW5pbWF0ZWQgZmFkZUluIHBnYWxsZXJ5XCI+XHJcbiAgICAgICAgICAgICAgPGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiA6aWQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1ibG9jayBtdC0yIG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICA8c3BhbiBAY2xpY2s9XCJzaG93UGxheWVyU3RhdHMocGxheWVyLmlkKVwiIHRpdGxlPVwiU2hvdyAgc3RhdHNcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWwtNFwiIHRpdGxlPVwiU2hvdyBTY29yZWNhcmRcIj5cclxuICAgICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIGV4YWN0IDp0bz1cInsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgIGV2ZW50X3NsdWc6c2x1ZywgcG5vOnBsYXllci5wbm99fVwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwhLS0tcG9wb3ZlciAtLT5cclxuICAgICAgICAgICAgICA8Yi1wb3BvdmVyIEBzaG93PVwiZ2V0TGFzdEdhbWVzKHBsYXllci5wbm8pXCIgcGxhY2VtZW50PVwiYm90dG9tXCIgIDp0YXJnZXQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiIHRyaWdnZXJzPVwiaG92ZXJcIiBib3VuZGFyeS1wYWRkaW5nPVwiNVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLXN0YXJ0IG1yLTIganVzdGlmeS1jb250ZW50LWFyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtZ3Jvdy0xIGFsaWduLXNlbGYtY2VudGVyXCIgc3R5bGU9XCJmb250LXNpemU6MS41ZW07XCI+e3ttc3RhdC5wb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtc2hyaW5rLTEgZC1pbmxpbmUtYmxvY2sgdGV4dC1tdXRlZFwiPjxzbWFsbD57e21zdGF0LndpbnN9fS17e21zdGF0LmRyYXdzfX0te3ttc3RhdC5sb3NzZXN9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtd3JhcCBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnkgZC1pbmxpbmUtYmxvY2tcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjhlbTsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZVwiPkxhc3QgR2FtZTogUm91bmQge3ttc3RhdC5yb3VuZH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0xIHRleHQtd2hpdGUgc2RhdGEtcmVzIHRleHQtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1pbmZvJzogbXN0YXQucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBtc3RhdC5yZXN1bHQgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IG1zdGF0LnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7bXN0YXQuc2NvcmV9fS17e21zdGF0Lm9wcG9fc2NvcmV9fSAoe3ttc3RhdC5yZXN1bHR8Zmlyc3RjaGFyfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVwibXN0YXQub3BwX3Bob3RvXCIgOmFsdD1cIm1zdGF0Lm9wcG9cIiBjbGFzcz1cInJvdW5kZWQtY2lyY2xlIG0tYXV0byBkLWlubGluZS1ibG9ja1wiIHdpZHRoPVwiMjVcIiBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1pbmZvIGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj48c21hbGw+I3t7bXN0YXQub3Bwb19ub319IHt7bXN0YXQub3Bwb3xhYmJydn19PC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2ItcG9wb3Zlcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L3RyYW5zaXRpb24tZ3JvdXA+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgcGxheWVyc3RhdHM6IFBsYXllclN0YXRzLFxyXG4gIH0sXHJcbiAgcHJvcHM6IFsnc2x1ZyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBTdGF0czoge30sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzcwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzcwcHgnLFxyXG4gICAgICAgIHN0eWxlOiAnY3Vyc29yOiBwb2ludGVyJyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGFGbGF0OiB7fSxcclxuICAgICAgbXN0YXQ6IHt9LFxyXG4gICAgICBkYXRhOiB7fSxcclxuICAgICAgc29ydGVkOiBmYWxzZSxcclxuICAgICAgYXNjOiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICB0aGlzLmRhdGFGbGF0ID0gXy5mbGF0dGVuRGVlcChfLmNsb25lKHJlc3VsdGRhdGEpKTtcclxuICAgIHRoaXMuZGF0YSA9IF8uY2hhaW4ocmVzdWx0ZGF0YSkubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLURBVEEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TGFzdEdhbWVzOiBmdW5jdGlvbiAodG91X25vKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRvdV9ubylcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMuZGF0YUZsYXQpO1xyXG4gICAgICBsZXQgcmVzID0gXy5jaGFpbihjKVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgIHJldHVybiB2LnBubyA9PT0gdG91X25vO1xyXG4gICAgICAgIH0pLnRha2VSaWdodCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubXN0YXQgPSBfLmZpcnN0KHJlcyk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubXN0YXQpXHJcbiAgICB9LFxyXG4gICAgc29ydFBvczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuYXNjID0gIXRoaXMuYXNjO1xyXG4gICAgICBjb25zb2xlLmxvZygnU29ydGluZy4uJyk7XHJcbiAgICAgIGxldCBzb3J0RGlyID0gJ2FzYyc7XHJcbiAgICAgIGlmIChmYWxzZSA9PSB0aGlzLmFzYykge1xyXG4gICAgICAgIHNvcnREaXIgPSAnZGVzYyc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRlZCA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdyYW5rJywgc29ydERpcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHNvcnRlZCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IHNvcnRlZDtcclxuICAgIH0sXHJcbiAgICByZXN0b3JlU29ydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmFzYyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdwbm8nLCAnYXNjJyk7XHJcbiAgICB9LFxyXG4gICAgc2hvd1BsYXllclN0YXRzOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdDT01QVVRFX1BMQVlFUl9TVEFUUycsIGlkKTtcclxuICAgICAgdGhpcy5wU3RhdHMucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmVPcHAgPSB0aGlzLmxhc3RkYXRhLmF2ZV9vcHBfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmUgPSB0aGlzLmxhc3RkYXRhLmF2ZV9zY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucFJhbmsgPSB0aGlzLmxhc3RkYXRhLnJhbms7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb3NpdGlvbiA9IHRoaXMubGFzdGRhdGEucG9zaXRpb247XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb2ludHMgPSB0aGlzLmxhc3RkYXRhLnBvaW50cztcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9PcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsUmFua3MgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxSYW5rcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5hbGxPcHBTY29yZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYnlSID0gdGhpcy5wbGF5ZXJfc3RhdHMucFJieVI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0V2lucyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0V2lucztcclxuICAgICAgdGhpcy5wU3RhdHMuc3RhcnRzID0gdGhpcy5wbGF5ZXJfc3RhdHMuc3RhcnRzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBseVdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBseVdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnJlcGxpZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBsaWVzO1xyXG5cclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJyx0cnVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgICBsYXN0ZGF0YTogJ0xBU1RSRERBVEEnLFxyXG4gICAgICBwbGF5ZXJkYXRhOiAnUExBWUVSREFUQScsXHJcbiAgICAgIHBsYXllcjogJ1BMQVlFUicsXHJcbiAgICAgIHBsYXllcl9zdGF0czogJ1BMQVlFUl9TVEFUUydcclxuICAgIH0pLFxyXG5cclxuICB9XHJcbn0pO1xyXG5cclxuIHZhciBSZXN1bHRzID0gVnVlLmNvbXBvbmVudCgncmVzdWx0cycsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIGhvdmVyIHN0YWNrZWQ9XCJzbVwiIHN0cmlwZWQgZm9vdC1jbG9uZSA6ZmllbGRzPVwicmVzdWx0c19maWVsZHNcIiA6aXRlbXM9XCJyZXN1bHQoY3VycmVudFJvdW5kKVwiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdWx0c19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5yZXN1bHRzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgbGFiZWw6ICcjJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICAvLyB7IGtleTogJ3Bvc2l0aW9uJyxsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOid0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5zY29yZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ09wcG9uZW50JyB9LFxyXG4gICAgICAvLyB7IGtleTogJ29wcF9wb3NpdGlvbicsIGxhYmVsOiAnUG9zaXRpb24nLCdjbGFzcyc6ICd0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnb3Bwb19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9wcG9fc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2RpZmYnLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnLSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0OiBmdW5jdGlvbihyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcblxyXG4gICAgICBfLmZvckVhY2goZGF0YSwgZnVuY3Rpb24ocikge1xyXG4gICAgICAgIGxldCBvcHBfbm8gPSByWydvcHBvX25vJ107XHJcbiAgICAgICAgLy8gRmluZCB3aGVyZSB0aGUgb3Bwb25lbnQncyBjdXJyZW50IHBvc2l0aW9uIGFuZCBhZGQgdG8gY29sbGVjdGlvblxyXG4gICAgICAgIGxldCByb3cgPSBfLmZpbmQoZGF0YSwgeyBwbm86IG9wcF9ubyB9KTtcclxuICAgICAgICByWydvcHBfcG9zaXRpb24nXSA9IHJvdy5wb3NpdGlvbjtcclxuICAgICAgICAvLyBjaGVjayByZXN1bHQgKHdpbiwgbG9zcywgZHJhdylcclxuICAgICAgICBsZXQgcmVzdWx0ID0gci5yZXN1bHQ7XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2luZm8nO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdkcmF3Jykge1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5zb3J0QnkoJ21hcmdpbicpXHJcbiAgICAgICAgLnNvcnRCeSgncG9pbnRzJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxudmFyIFN0YW5kaW5ncyA9IFZ1ZS5jb21wb25lbnQoJ3N0YW5kaW5ncycse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSByZXNwb25zaXZlIHN0YWNrZWQ9XCJzbVwiIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJyZXN1bHQoY3VycmVudFJvdW5kKVwiIDpmaWVsZHM9XCJzdGFuZGluZ3NfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJyYW5rXCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLnZhbHVlLnJhbmt9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInBsYXllclwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5wbGF5ZXJ9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cIndvbkxvc3RcIj48L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cIm1hcmdpblwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5tYXJnaW59fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImxhc3RHYW1lXCI+XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGFuZGluZ3NfZmllbGRzOiBbXSxcclxuICAgICAgaW1nUHJvcHM6IHtcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgYmxvY2s6IHRydWUsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHdpZHRoOiAnMjVweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMjVweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9LFxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zdGFuZGluZ3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JhbmsnLCBjbGFzczogJ3RleHQtY2VudGVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXaW4tRHJhdy1Mb3NzJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS53aW5zfSAtICR7aXRlbS5kcmF3c30gLSAke2l0ZW0ubG9zc2VzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3BvaW50cycsXHJcbiAgICAgICAgbGFiZWw6ICdQb2ludHMnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLmFyID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9KmA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdsYXN0R2FtZScsXHJcbiAgICAgICAgbGFiZWw6ICdMYXN0IEdhbWUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGl0ZW0uc2NvcmUgPT0gMCAmJlxyXG4gICAgICAgICAgICBpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJlxyXG4gICAgICAgICAgICBpdGVtLnJlc3VsdCA9PSAnYXdhaXRpbmcnXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBBd2FpdGluZyByZXN1bHQgb2YgZ2FtZSAke2l0ZW0ucm91bmR9IHZzICR7aXRlbS5vcHBvfWA7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGBhICR7aXRlbS5zY29yZX0tJHtpdGVtLm9wcG9fc2NvcmV9XHJcbiAgICAgICAgICAgICR7aXRlbS5yZXN1bHQudG9VcHBlckNhc2UoKX0gdnMgJHtpdGVtLm9wcG99IGA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICByZXN1bHQocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YVtyb3VuZF0pO1xyXG4gICAgICBfLmZvckVhY2goZGF0YSwgZnVuY3Rpb24ocikge1xyXG4gICAgICAgIGxldCBvcHBfbm8gPSByWydvcHBvX25vJ107XHJcbiAgICAgICAgLy8gRmluZCB3aGVyZSB0aGUgb3Bwb25lbnQncyBjdXJyZW50IHBvc2l0aW9uIGFuZCBhZGQgdG8gY29sbGVjdGlvblxyXG4gICAgICAgIGxldCByb3cgPSBfLmZpbmQoZGF0YSwgeyBwbm86IG9wcF9ubyB9KTtcclxuICAgICAgICByWydvcHBfcG9zaXRpb24nXSA9IHJvd1sncG9zaXRpb24nXTtcclxuICAgICAgICAvLyBjaGVjayByZXN1bHQgKHdpbiwgbG9zcywgZHJhdylcclxuICAgICAgICBsZXQgcmVzdWx0ID0gclsncmVzdWx0J107XHJcblxyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXSA9IFtdO1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnd2luJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnbG9zcycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdkYW5nZXInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnaW5mbyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdkcmF3Jykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLnNvcnRCeSgnbWFyZ2luJylcclxuICAgICAgICAuc29ydEJ5KCdwb2ludHMnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5jb25zdCBQYWlyaW5ncyA9VnVlLmNvbXBvbmVudCgncGFpcmluZ3MnLCAge1xyXG4gIHRlbXBsYXRlOiBgXHJcbjx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWhvdmVyIHRhYmxlLXJlc3BvbnNpdmUgdGFibGUtc3RyaXBlZCAgYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgIDxjYXB0aW9uPnt7Y2FwdGlvbn19PC9jYXB0aW9uPlxyXG4gICAgPHRoZWFkIGNsYXNzPVwidGhlYWQtZGFya1wiPlxyXG4gICAgICAgIDx0cj5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj4jPC90aD5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5QbGF5ZXI8L3RoPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk9wcG9uZW50PC90aD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90aGVhZD5cclxuICAgIDx0Ym9keT5cclxuICAgICAgICA8dHIgdi1mb3I9XCIocGxheWVyLGkpIGluIHBhaXJpbmcoY3VycmVudFJvdW5kKVwiIDprZXk9XCJpXCI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwicm93XCI+e3tpICsgMX19PC90aD5cclxuICAgICAgICA8dGQgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIj48Yi1pbWctbGF6eSB2LWJpbmQ9XCJpbWdQcm9wc1wiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiPjwvYi1pbWctbGF6eT48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0neSdcIj4qPC9zdXA+e3twbGF5ZXIucGxheWVyfX08L3RkPlxyXG4gICAgICAgIDx0ZCA6aWQ9XCIncG9wb3Zlci0nK3BsYXllci5vcHBfaWRcIj48Yi1pbWctbGF6eSB2LWJpbmQ9XCJpbWdQcm9wc1wiIDphbHQ9XCJwbGF5ZXIub3Bwb1wiIDpzcmM9XCJwbGF5ZXIub3BwX3Bob3RvXCI+PC9iLWltZy1sYXp5PjxzdXAgIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0nbidcIj4qPC9zdXA+e3twbGF5ZXIub3Bwb319PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuICA8L3RhYmxlPlxyXG5gLFxyXG5cclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHN0eWxlOidtYXJnaW4tcmlnaHQ6LjVlbScsXHJcbiAgICAgICAgd2lkdGg6ICcyNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcyNXB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICAvLyBnZXQgcGFpcmluZ1xyXG4gICAgcGFpcmluZyhyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgcm91bmRfcmVzID0gdGhpcy5yZXN1bHRkYXRhW3JvdW5kXTtcclxuICAgICAgLy8gU29ydCBieSBwbGF5ZXIgbnVtYmVyaW5nIGlmIHJvdW5kIDEgdG8gb2J0YWluIHJvdW5kIDEgcGFpcmluZ1xyXG4gICAgICBpZiAociA9PT0gMSkge1xyXG4gICAgICAgIHJvdW5kX3JlcyA9IF8uc29ydEJ5KHJvdW5kX3JlcywgJ3BubycpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBwYWlyZWRfcGxheWVycyA9IFtdO1xyXG4gICAgICBsZXQgcnAgPSBfLm1hcChyb3VuZF9yZXMsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gclsncG5vJ107XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKHBhaXJlZF9wbGF5ZXJzLCBwbGF5ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhaXJlZF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKG9wcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNvbXBhY3QocnApO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7UGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c31cclxuXHJcbiIsImV4cG9ydCB7IFN0YXRzUHJvZmlsZSBhcyBkZWZhdWx0IH07XHJcbmxldCBTdGF0c1Byb2ZpbGUgPSBWdWUuY29tcG9uZW50KCdzdGF0c19wcm9maWxlJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtMTAgb2Zmc2V0LTEganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlldz0ncHJvZmlsZSdcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXcgPT09J3Byb2ZpbGUnXCIgOnByZXNzZWQ9XCJ2aWV3ID09PSdwcm9maWxlJ1wiIHRpdGxlPVwiUGxheWVyIFByb2ZpbGVcIj5cclxuICAgICAgICA8Yi1pY29uIGljb249XCJwZXJzb25cIj48L2ItaWNvbj5Qcm9maWxlPC9iLWJ1dHRvbj5cclxuICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlldz0naGVhZDJoZWFkJ1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlldyA9PT0naGVhZDJoZWFkJ1wiIDpwcmVzc2VkPVwidmlldyA9PT0naGVhZDJoZWFkJ1wiIHRpdGxlPVwiSGVhZCBUbyBIZWFkXCI+XHJcbiAgICAgICAgPGItaWNvbiBpY29uPVwicGVvcGxlLWZpbGxcIj48L2ItaWNvbj5IMkg8L2ItYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxoMyB2LWlmPVwidmlldyA9PT0ncHJvZmlsZSdcIiBjbGFzcz1cImJlYmFzIG1iLTJcIj5cclxuICAgIDxiLWljb24gaWNvbj1cInBlcnNvblwiPjwvYi1pY29uPiBTdGF0cyBQcm9maWxlPC9oMz5cclxuICAgIDxoMyBjbGFzcz1cIm1iLTIgYmViYXNcIiB2LWlmPVwidmlldyA9PT0naGVhZDJoZWFkJ1wiPlxyXG4gICAgPGItaWNvbiBpY29uPVwicGVvcGxlLWZpbGxcIj48L2ItaWNvbj4gSGVhZCB0byBIZWFkPC9oMz5cclxuXHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXcgPT09J3Byb2ZpbGUnXCI+XHJcbiAgICAgIDxkaXYgdi1pZj1cInZpZXcgPT09J3Byb2ZpbGUnICYmIChhbGxfcGxheWVycy5sZW5ndGggPD0wKVwiIGNsYXNzPVwibXktNSBteC1hdXRvIGQtZmxleCBmbGV4LXJvdyBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItc3Bpbm5lciB2YXJpYW50PVwicHJpbWFyeVwiIHN0eWxlPVwid2lkdGg6IDdyZW07IGhlaWdodDogN3JlbTtcIiBsYWJlbD1cIkxvYWRpbmcgcGxheWVyc1wiPjwvYi1zcGlubmVyPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJteS01IG14LWF1dG8gdy01MCBkLW1kLWZsZXggZmxleC1tZC1yb3cgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibXItbWQtMiBtYi1zbS0yXCI+XHJcbiAgICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoXCI+UGxheWVyIG5hbWU6PC9sYWJlbD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWwtbWQtMiBmbGV4LWdyb3ctMVwiPlxyXG4gICAgICAgICAgPHZ1ZS1zaW1wbGUtc3VnZ2VzdFxyXG4gICAgICAgICAgdi1tb2RlbD1cInBzZWFyY2hcIlxyXG4gICAgICAgICAgZGlzcGxheS1hdHRyaWJ1dGU9XCJwbGF5ZXJcIlxyXG4gICAgICAgICAgdmFsdWUtYXR0cmlidXRlPVwic2x1Z1wiXHJcbiAgICAgICAgICBAc2VsZWN0PVwiZ2V0cHJvZmlsZVwiXHJcbiAgICAgICAgICA6c3R5bGVzPVwiYXV0b0NvbXBsZXRlU3R5bGVcIlxyXG4gICAgICAgICAgOmRlc3R5bGVkPXRydWVcclxuICAgICAgICAgIDpmaWx0ZXItYnktcXVlcnk9dHJ1ZVxyXG4gICAgICAgICAgOmxpc3Q9XCJhbGxfcGxheWVyc1wiXHJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIlBsYXllciBuYW1lIGhlcmVcIlxyXG4gICAgICAgICAgaWQ9XCJzZWFyY2hcIlxyXG4gICAgICAgICAgdHlwZT1cInNlYXJjaFwiPlxyXG4gICAgICAgICAgPC92dWUtc2ltcGxlLXN1Z2dlc3Q+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHYtc2hvdz1cImxvYWRpbmdcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtbWQtcm93LXJldmVyc2UgbXktMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCIgdi1zaG93PVwicHNlYXJjaCAmJiAhbm90Zm91bmRcIj5TZWFyY2hpbmcgPGVtPnt7cHNlYXJjaH19PC9lbT4uLi48L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiIHYtc2hvdz1cInBzZWFyY2ggJiYgbm90Zm91bmRcIj48ZW0+e3twc2VhcmNofX08L2VtPiBub3QgZm91bmQhPC9zcGFuPlxyXG4gICAgICAgIDxiLXNwaW5uZXIgdi1zaG93PVwiIW5vdGZvdW5kXCIgc3R5bGU9XCJ3aWR0aDogN3JlbTsgaGVpZ2h0OiA3cmVtO1wiIHR5cGU9XCJncm93XCIgdmFyaWFudD1cInN1Y2Nlc3NcIiBsYWJlbD1cIkJ1c3lcIj48L2Itc3Bpbm5lcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgdi1pZj1cInBkYXRhLnBsYXllclwiIGNsYXNzPVwicC0yIG14LWF1dG8gZC1tZC1mbGV4IGZsZXgtbWQtcm93IGFsaWduLWl0ZW1zLXN0YXJ0IGp1c3RpZnktY29udGVudC1hcm91bmRcIj5cclxuICAgICAgICAgIDxkaXYgdi1zaG93PVwicHNlYXJjaCA9PT1wZGF0YS5wbGF5ZXIgJiYgIW5vdGZvdW5kXCIgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gdGV4dC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGFuaW1hdGVkIGZhZGVJblwiPlxyXG4gICAgICAgICAgPGg0PlByb2ZpbGUgU3VtbWFyeTwvaDQ+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm9zd2FsZFwiPnt7cGRhdGEucGxheWVyfX1cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9jayBteC1hdXRvIHAtMlwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm14LWF1dG8gZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BkYXRhLmNvdW50cnkgfGxvd2VyY2FzZVwiIHRpdGxlPVwicGRhdGEuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm1sLTIgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwZGF0YS5nZW5kZXIgPT0gJ20nLCdmYS1mZW1hbGUnOiBwZGF0YS5nZW5kZXIgPT0gJ2YnLCdmYS11c2Vycyc6IHBkYXRhLmlzX3RlYW0gPT0gJ3llcycgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2g1PlxyXG4gICAgICAgICAgICA8aW1nIDpzcmM9J3BkYXRhLnBob3RvJyA6YWx0PVwicGRhdGEucGxheWVyXCIgdi1iaW5kPVwiaW1nUHJvcHNcIj48L2ltZz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtdXBwZXJjYXNlIHRleHQtbGVmdFwiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtO1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWFkIHRleHQtY2VudGVyXCI+e3twZGF0YS50b3RhbF90b3VybmV5cyB8IHBsdXJhbGl6ZSgndG91cm5leScseyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1ibG9jayB0ZXh0LXByaW1hcnkgZm9udC13ZWlnaHQtbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgVG91cm5leSA8c3BhbiBjbGFzcz1cInRleHQtY2FwaXRhbGl6ZVwiPihBbGwgVGltZSk8L3NwYW4+IEhvbm9yczpcclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIkZpcnN0IFByaXplXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGdvbGRjb2wgZm9udC13ZWlnaHQtYm9sZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnt7dG91cm5leV9wb2RpdW1zKDEpfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIlNlY29uZCBQcml6ZVwiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBzaWx2ZXJjb2wgZm9udC13ZWlnaHQtYm9sZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnt7dG91cm5leV9wb2RpdW1zKDIpfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIlRoaXJkIFByaXplXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGJyb256ZWNvbCBmb250LXdlaWdodC1ib2xkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlXCI+e3t0b3VybmV5X3BvZGl1bXMoMyl9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtaW5mbyBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj57e3BkYXRhLnRvdGFsX2dhbWVzIHwgcGx1cmFsaXplKCdnYW1lJyx7IGluY2x1ZGVOdW1iZXI6IHRydWUgfSl9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgdGV4dC1zdWNjZXNzIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPnt7cGRhdGEudG90YWxfd2lucyB8IHBsdXJhbGl6ZSgnd2luJyx7IGluY2x1ZGVOdW1iZXI6IHRydWUgfSl9fSA8ZW0+KHt7cGRhdGEucGVyY2VudF93aW5zfX0lKTwvZW0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LXdhcm5pbmcgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+IHt7cGRhdGEudG90YWxfZHJhd3MgfCBwbHVyYWxpemUoJ2RyYXcnLHsgaW5jbHVkZU51bWJlcjogdHJ1ZSB9KX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LWRhbmdlciBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj4ge3twZGF0YS50b3RhbF9sb3NzZXMgfCBwbHVyYWxpemUoWydsb3NzJywnbG9zc2VzJ10seyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtcHJpbWFyeSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5BdmUgU2NvcmU6IHt7cGRhdGEuYXZlX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtcHJpbWFyeSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5BdmUgT3Bwb25lbnRzIFNjb3JlOiB7e3BkYXRhLmF2ZV9vcHBfc2NvcmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgdGV4dC1wcmltYXJ5IGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPkF2ZSBDdW0uIE1hcjoge3twZGF0YS5hdmVfbWFyZ2lufX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxkaXYgdi1zaG93PVwiIWxvYWRpbmdcIj5cclxuICAgICAgICAgIDxoNCB0aXRsZT1cIlBlcmZvcm1hbmNlIHN1bW1hcnkgcGVyIHRvdXJuZXlcIj5Db21wZXRpdGlvbnM8L2g0PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0xIG1iLTEgYmctbGlnaHRcIiB2LWZvcj1cIihjLCB0aW5kZXgpIGluIHBkYXRhLmNvbXBldGl0aW9uc1wiIDprZXk9XCJjLmlkXCI+XHJcbiAgICAgICAgICAgICAgPGg1IGNsYXNzPVwib3N3YWxkIHRleHQtbGVmdFwiPnt7Yy50aXRsZX19XHJcbiAgICAgICAgICAgICAgPGItYmFkZ2UgdGl0bGU9XCJGaW5hbCBSYW5rXCI+e3tjLmZpbmFsX3JkLnJhbmt9fTwvYi1iYWRnZT48L2g1PlxyXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saW5rIHRleHQtZGVjb3JhdGlvbi1ub25lXCIgdHlwZT1cImJ1dHRvblwiIHRpdGxlPVwiQ2xpY2sgdG8gdmlldyBwbGF5ZXIgc2NvcmVzaGVldCBmb3IgdGhpcyBldmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOidTY29yZXNoZWV0JywgcGFyYW1zOnsgIGV2ZW50X3NsdWc6Yy5zbHVnLCBwbm86Yy5maW5hbF9yZC5wbm99fVwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJkb2N1bWVudHMtYWx0XCI+PC9iLWljb24+IFNjb3JlY2FyZFxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGItYnV0dG9uIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiB2YXJpYW50PVwibGlua1wiIHYtYi10b2dnbGU9XCJjb2xsYXBzZSt0aW5kZXgrMVwiIHRpdGxlPVwiQ2xpY2sgdG8gdG9nZ2xlIHBsYXllciBzdGF0cyBmb3IgdGhpcyBldmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJiYXItY2hhcnQtZmlsbFwiIHZhcmlhbnQ9XCJzdWNjZXNzXCIgZmxpcC1oPjwvYi1pY29uPlN0YXRpc3RpY3NcclxuICAgICAgICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGItY29sbGFwc2UgOmlkPVwiY29sbGFwc2UrdGluZGV4KzFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDYgY2xhc3M9XCJvc3dhbGRcIj57e2MuZmluYWxfcmQucGxheWVyfX0gRXZlbnQgU3RhdHMgU3VtbWFyeTwvaDY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmVcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgUG9pbnRzOiB7e2MuZmluYWxfcmQucG9pbnRzfX0ve3tjLmZpbmFsX3JkLnJvdW5kfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaW5hbCBQb3M6IHt7Yy5maW5hbF9yZC5wb3NpdGlvbn19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmVcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSB0ZXh0LXN1Y2Nlc3MgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdvbjoge3tjLmZpbmFsX3JkLndpbnN9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gdGV4dC13YXJuaW5nIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEcmV3OiB7e2MuZmluYWxfcmQuZHJhd3N9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gdGV4dC1kYW5nZXIgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvc3Q6IHt7Yy5maW5hbF9yZC5sb3NzZXN9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF2ZXJhZ2UgU2NvcmU6IHt7Yy5maW5hbF9yZC5hdmVfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF2ZXJhZ2UgT3BwLiBTY29yZToge3tjLmZpbmFsX3JkLmF2ZV9vcHBfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdGFsIFNjb3JlOiB7e2MuZmluYWxfcmQudG90YWxfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdGFsIE9wcC4gU2NvcmU6IHt7Yy5maW5hbF9yZC50b3RhbF9vcHBzY29yZX19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFyZ2luOiB7e2MuZmluYWxfcmQubWFyZ2lufX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZVwiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgOmNsYXNzPVwieyd0ZXh0LXN1Y2Nlc3MnOiBjLmZpbmFsX3JkLnJlc3VsdCA9PSAnd2luJywndGV4dC13YXJuaW5nJzogYy5maW5hbF9yZC5yZXN1bHQgPT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogYy5maW5hbF9yZC5yZXN1bHQgPT0gJ2xvc3MnfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIEZpbmFsIGdhbWUgd2FzIGEge3tjLmZpbmFsX3JkLnNjb3JlfX0gLSB7e2MuZmluYWxfcmQub3Bwb19zY29yZX19IHt7Yy5maW5hbF9yZC5yZXN1bHR9fSAoYSBkaWZmZXJlbmNlIG9mIHt7Yy5maW5hbF9yZC5kaWZmfGFkZHBsdXN9fSkgYWdhaW5zdCB7e2MuZmluYWxfcmQub3Bwb319XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibXktNSBteC1hdXRvIGQtZmxleCBmbGV4LXJvdyBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICA8cD5Db21pbmcgU29vbiE8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgIDwhLS0gPGItZm9ybS1yb3cgY2xhc3M9XCJteS0xXCI+XHJcbiAgICAgICAgPGItY29sIHNtPVwiMVwiIGNsYXNzPVwibWwtc20tYXV0b1wiPlxyXG4gICAgICAgIDxsYWJlbCBmb3I9XCJzZWFyY2gxXCI+UGxheWVyIDE8L2xhYmVsPlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiM1wiIGNsYXNzPVwibXItc20tYXV0b1wiPlxyXG4gICAgICAgIDxiLWZvcm0taW5wdXQgcGxhY2Vob2xkZXI9XCJTdGFydCB0eXBpbmcgcGxheWVyIG5hbWVcIiBzaXplPVwic21cIiBpZD1cInNlYXJjaDFcIiB2LW1vZGVsPVwic2VhcmNoMVwiIHR5cGU9XCJzZWFyY2hcIj48L2ItZm9ybS1pbnB1dD5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbCBzbT1cIjFcIiBjbGFzcz1cIm1sLXNtLWF1dG9cIj5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJtbC0yXCIgZm9yPVwic2VhcmNoMlwiPlBsYXllciAyPC9sYWJlbD5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbCBzbT1cIjNcIiBjbGFzcz1cIm1yLXNtLWF1dG9cIj5cclxuICAgICAgICA8Yi1mb3JtLWlucHV0IHNpemU9XCJzbVwiIHBsYWNlaG9sZGVyPVwiU3RhcnQgdHlwaW5nIHBsYXllciBuYW1lXCIgaWQ9XCJzZWFyY2gyXCIgdi1tb2RlbD1cInNlYXJjaDJcIiB0eXBlPVwic2VhcmNoXCI+PC9iLWZvcm0taW5wdXQ+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgPC9iLWZvcm0tcm93PlxyXG4gICAgICA8Yi1yb3cgY29scz1cIjRcIj5cclxuICAgICAgICA8Yi1jb2w+PC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2w+e3tzZWFyY2gxfX08L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbD48L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbD57e3NlYXJjaDJ9fTwvYi1jb2w+XHJcbiAgICAgIDwvYi1yb3c+XHJcbiAgICAgIC0tPlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAgYCxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB2aWV3OiAncHJvZmlsZScsXHJcbiAgICAgIC8vIHNob3dUb3VTdGF0czogZmFsc2UsXHJcbiAgICAgIHBzZWFyY2g6IG51bGwsXHJcbiAgICAgIHNlYXJjaDE6IG51bGwsXHJcbiAgICAgIHNlYXJjaDI6IG51bGwsXHJcbiAgICAgIHBkYXRhOiB7fSxcclxuICAgICAgcHNsdWc6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlOiAnY29sbGFwc2UnLFxyXG4gICAgICBsb2FkaW5nOiBudWxsLFxyXG4gICAgICBub3Rmb3VuZDogbnVsbCxcclxuICAgICAgYXV0b0NvbXBsZXRlU3R5bGUgOiB7XHJcbiAgICAgICAgdnVlU2ltcGxlU3VnZ2VzdDogXCJwb3NpdGlvbi1yZWxhdGl2ZVwiLFxyXG4gICAgICAgIGlucHV0V3JhcHBlcjogXCJcIixcclxuICAgICAgICBkZWZhdWx0SW5wdXQgOiBcImZvcm0tY29udHJvbFwiLFxyXG4gICAgICAgIHN1Z2dlc3Rpb25zOiBcInBvc2l0aW9uLWFic29sdXRlIGxpc3QtZ3JvdXAgei0xMDAwXCIsXHJcbiAgICAgICAgc3VnZ2VzdEl0ZW06IFwibGlzdC1ncm91cC1pdGVtXCJcclxuICAgICAgfSxcclxuICAgICAgaW1nUHJvcHM6IHtcclxuICAgICAgICBibG9jazogdHJ1ZSxcclxuICAgICAgICB0aHVtYm5haWw6IHRydWUsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyM2NjYnLFxyXG4gICAgICAgIHdpZHRoOiAxMjAsXHJcbiAgICAgICAgaGVpZ2h0OiAxMjAsXHJcbiAgICAgICAgY2xhc3M6ICdtYi0zIHNoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmdldFBsYXllcnMoKTtcclxuICB9LFxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3OiB7XHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cobik7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhbGxfcGxheWVyc190b3U6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgaWYodmFsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmdldFBEYXRhKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0UGxheWVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnR0VUX0FMTF9QTEFZRVJTJywgbnVsbCk7XHJcbiAgICB9LFxyXG4gICAgZ2V0UERhdGE6IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnBzbHVnKTtcclxuICAgICAgdmFyIGRhdGEgPSBfLmZpbmQodiwgWydzbHVnJywgdGhpcy5wc2x1Z10pO1xyXG4gICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMucGRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0cHJvZmlsZTogZnVuY3Rpb24gKGkpIHtcclxuICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy5ub3Rmb3VuZCA9IHRydWU7XHJcbiAgICAgIGNvbnNvbGUubG9nKGkpO1xyXG4gICAgICBsZXQgcyA9IGkuc2x1Z1xyXG4gICAgICBpZiAocykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHMpO1xyXG4gICAgICAgIHRoaXMucHNsdWcgPSBzO1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdHRVRfUExBWUVSX1RPVV9EQVRBJyx0aGlzLnBzbHVnKTtcclxuICAgICAgICB0aGlzLm5vdGZvdW5kID0gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5ub3Rmb3VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0b3VybmV5X3BvZGl1bXM6IGZ1bmN0aW9uIChyYW5rKSB7XHJcbiAgICAgIGxldCBjID0gdGhpcy5wZGF0YS5jb21wZXRpdGlvbnM7XHJcbiAgICAgIGxldCB3aW5zID0gXy5maWx0ZXIoYywgWydmaW5hbF9yYW5rJywgcmFua10pO1xyXG4gICAgICByZXR1cm4gd2lucy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgYWxsX3BsYXllcnM6ICdBTExfUExBWUVSUycsXHJcbiAgICAgIGFsbF9wbGF5ZXJzX3RvdTogJ0FMTF9QTEFZRVJTX1RPVV9EQVRBJyxcclxuICAgIH0pLFxyXG4gICAgcGxheWVybGlzdDoge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMuYWxsX3BsYXllcnM7XHJcbiAgICAgICAgbGV0IGZwID0gXy5tYXAobiwgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBwLnBsYXllcjtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyhmcCk7XHJcbiAgICAgICAgcmV0dXJuIGZwO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5jb21taXQoJ1NFVF9BTExfUExBWUVSUycsIG5ld1ZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfVxyXG59KTtcclxuIiwiXHJcbmV4cG9ydCB7IFJhdGluZ1N0YXRzIGFzIGRlZmF1bHQgfTtcclxubGV0IFJhdGluZ1N0YXRzID0gVnVlLmNvbXBvbmVudCgncmF0aW5nX3N0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBSYXRpbmcgU3RhdHMgLS0+XHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC04IG9mZnNldC0yIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgIDxiLXRhYmxlIHJlc3BvbnNpdmU9XCJzbVwiIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJjb21wdXRlZF9pdGVtc1wiIDpmaWVsZHM9XCJmaWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgICA8IS0tIEEgdmlydHVhbCBjb2x1bW4gLS0+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwocmF0aW5nX2NoYW5nZSk9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIHYtYmluZDpjbGFzcz1cIntcclxuICAgICAgICAgICAndGV4dC1pbmZvJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPT0gMCxcclxuICAgICAgICAgICAndGV4dC1kYW5nZXInOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA8IDAsXHJcbiAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID4gMCB9XCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2V9fVxyXG4gICAgICAgICAgICA8aSB2LWJpbmQ6Y2xhc3M9XCJ7XHJcbiAgICAgICAgICAgICAnZmFzIGZhLWxvbmctYXJyb3ctbGVmdCc6ZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPT0gMCxcclxuICAgICAgICAgICAgICdmYXMgZmEtbG9uZy1hcnJvdy1kb3duJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPCAwLFxyXG4gICAgICAgICAgICAgJ2ZhcyBmYS1sb25nLWFycm93LXVwJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPiAwIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChuYW1lKT1cImRhdGFcIj5cclxuICAgICAgICAgICAgPGItaW1nLWxhenkgOnRpdGxlPVwiZGF0YS5pdGVtLm5hbWVcIiA6YWx0PVwiZGF0YS5pdGVtLm5hbWVcIiA6c3JjPVwiZGF0YS5pdGVtLnBob3RvXCIgdi1iaW5kPVwicGljUHJvcHNcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICB7e2RhdGEuaXRlbS5uYW1lfX1cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgIDwvYi10YWJsZT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2NvbXB1dGVkX2l0ZW1zJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwaWNQcm9wczoge1xyXG4gICAgICAgIGJsb2NrOiBmYWxzZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICB3aWR0aDogJzMwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzMwcHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtLCBteC0xJyxcclxuICAgICAgfSxcclxuICAgICAgZmllbGRzOiBbXHJcbiAgICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIGxhYmVsOiAnUmFuaycgfSxcclxuICAgICAgICAnbmFtZScsXHJcbiAgICAgICAgeyBrZXk6ICdyYXRpbmdfY2hhbmdlJywgbGFiZWw6ICdDaGFuZ2UnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICAgIHsga2V5OiAnZXhwZWN0ZWRfd2lucycsIGxhYmVsOiAnRS53aW5zJyB9LFxyXG4gICAgICAgIHsga2V5OiAnYWN0dWFsX3dpbnMnLCBsYWJlbDogJ0Eud2lucycgfSxcclxuICAgICAgICB7IGtleTogJ29sZF9yYXRpbmcnLCBsYWJlbDogJ09sZCBSYXRpbmcnICwgc29ydGFibGU6IHRydWV9LFxyXG4gICAgICAgIHsga2V5OiAnbmV3X3JhdGluZycsIGxhYmVsOiAnTmV3IFJhdGluZycgLCBzb3J0YWJsZTogdHJ1ZX0sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG59KTtcclxuIiwiXHJcbmltcG9ydCBiYXNlVVJMIGZyb20gJy4uL2NvbmZpZy5qcyc7XHJcbmxldCBTY29yZWJvYXJkID0gVnVlLmNvbXBvbmVudCgnc2NvcmVib2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3cgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwiZXJyb3JcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgPC90ZW1wbGF0ZT5cclxuICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gIDxkaXYgY2xhc3M9XCJjb2xcIiBpZD1cInNjb3JlYm9hcmRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVycyBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIiB2LWZvcj1cImkgaW4gcm93Q291bnRcIiA6a2V5PVwiaVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTMgY29sLXNtLTYgY29sLTEyIFwiIHYtZm9yPVwicGxheWVyIGluIGl0ZW1Db3VudEluUm93KGkpXCIgOmtleT1cInBsYXllci5yYW5rXCI+XHJcbiAgICAgICAgPGItbWVkaWEgY2xhc3M9XCJwYi0wIG1iLTEgbXItMVwiIHZlcnRpY2FsLWFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IHNsb3Q9XCJhc2lkZVwiPlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgICAgPGItaW1nIHJvdW5kZWQ9XCJjaXJjbGVcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiBjbGFzcz1cImFuaW1hdGVkIGZsaXBJblhcIiAvPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29scz1cIjEyXCIgbWQ9XCJhdXRvXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsYWctaWNvblwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29sIGxnPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdmJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cInRleHQtY2VudGVyXCIgdi1pZj1cInBsYXllci50ZWFtXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPjxzcGFuPnt7cGxheWVyLnRlYW19fTwvc3Bhbj48L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3c+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNsYXNzPVwidGV4dC13aGl0ZVwiIHYtYmluZDpjbGFzcz1cInsndGV4dC13YXJuaW5nJzogcGxheWVyLnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogcGxheWVyLnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgcG9zaXRpb24gIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAge3twbGF5ZXIucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1sb25nLWFycm93LXVwJzogcGxheWVyLnJhbmsgPCBwbGF5ZXIubGFzdHJhbmssJ2ZhLWxvbmctYXJyb3ctZG93bic6IHBsYXllci5yYW5rID4gcGxheWVyLmxhc3RyYW5rLFxyXG4gICAgICAgICAgICAgICAgICdmYS1hcnJvd3MtaCc6IHBsYXllci5yYW5rID09IHBsYXllci5sYXN0cmFuayB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDUgY2xhc3M9XCJtLTAgIGFuaW1hdGVkIGZhZGVJbkxlZnRcIj57e3BsYXllci5wbGF5ZXJ9fTwvaDU+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmQtdGV4dCBtdC0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgcG9pbnRzIHAtMVwiPnt7cGxheWVyLnBvaW50c319LXt7cGxheWVyLmxvc3Nlc319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIG1hclwiPnt7cGxheWVyLm1hcmdpbiB8IGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gdi1pZj1cInBsYXllci5sYXN0cG9zaXRpb25cIiBjbGFzcz1cInNkYXRhIHAxXCI+d2FzIHt7cGxheWVyLmxhc3Rwb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInBsYXllci5yZXN1bHQgPT0nYXdhaXRpbmcnIFwiIGNsYXNzPVwiYmctaW5mbyBkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiPnt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhciB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgIHt7cGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhcn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZSBwLTEgIHNkYXRhXCI+QXdhaXRpbmdcclxuICAgICAgICAgICAgICAgIFJlc3VsdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgc2RhdGFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J3RleHQtd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj57e3BsYXllci5zY29yZX19XHJcbiAgICAgICAgICAgICAgICAtIHt7cGxheWVyLm9wcG9fc2NvcmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgcC0wIG1sLTEgb3BwXCI+dnMge3twbGF5ZXIub3Bwb319PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJwbGF5ZXIucHJldnJlc3VsdHNcIiBjbGFzcz1cInJvdyBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwicmVzXCIgdi1mb3I9XCJyZXMgaW4gcGxheWVyLnByZXZyZXN1bHRzXCIgOmtleT1cInJlcy5rZXlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiByZXMgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiByZXMgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiByZXMgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiByZXMgPT09ICd3aW4nIH1cIj57e3Jlc3xmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1tZWRpYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY3VycmVudFJvdW5kJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpdGVtc1BlclJvdzogNCxcclxuICAgICAgcGVyX3BhZ2U6IDQwLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhZ2V1cmw6IGJhc2VVUkwgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcmVsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIHBlcmlvZDogMC41LFxyXG4gICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgc2NvcmVib2FyZF9kYXRhOiBbXSxcclxuICAgICAgcmVzcG9uc2VfZGF0YTogW10sXHJcbiAgICAgIC8vIHBsYXllcnM6IFtdLFxyXG4gICAgICAvLyB0b3RhbF9yb3VuZHM6IDAsXHJcbiAgICAgIC8vIGN1cnJlbnRSb3VuZDogbnVsbCxcclxuICAgICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgICBpc19saXZlX2dhbWU6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHRoaXMuZmV0Y2hTY29yZWJvYXJkRGF0YSgpO1xyXG4gICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKFxyXG4gICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIHRoaXMucGVyaW9kICogNjAwMDBcclxuICAgICk7XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgY3VycmVudFJvdW5kOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0RldGFpbHModGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgIH1cclxuICAgICB9XHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmdldFdpbmRvd1dpZHRoKTtcclxuICAgIHRoaXMuY2FuY2VsQXV0b1VwZGF0ZSgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgIGNhbmNlbEF1dG9VcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG4gICAgfSxcclxuICAgIGZldGNoU2NvcmVib2FyZERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuaXNfbGl2ZV9nYW1lID09IHRydWUpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXRlbUNvdW50SW5Sb3c6IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNjb3JlYm9hcmRfZGF0YS5zbGljZShcclxuICAgICAgICAoaW5kZXggLSAxKSAqIHRoaXMuaXRlbXNQZXJSb3csXHJcbiAgICAgICAgaW5kZXggKiB0aGlzLml0ZW1zUGVyUm93XHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc0RldGFpbHM6IGZ1bmN0aW9uKGN1cnJlbnRQYWdlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzdWx0X2RhdGEpXHJcbiAgICAgIGxldCByZXN1bHRkYXRhID0gdGhpcy5yZXN1bHRfZGF0YTtcclxuICAgICAgLy8gbGV0IGxhc3RSZEQgPSBfLmxhc3QoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICAgIGxldCBjciA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuXHJcbiAgICAgIGxldCB0aGlzUmREYXRhID0gXy5udGgoXy5jbG9uZShyZXN1bHRkYXRhKSwgY3IpO1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLVRoaXMgUm91bmQgRGF0YS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNyKTtcclxuICAgICAgY29uc29sZS5sb2codGhpc1JkRGF0YSk7XHJcblxyXG4gICAgICBsZXQgaW5pdGlhbFJkRGF0YSA9IFtdO1xyXG4gICAgICBsZXQgcHJldmlvdXNSZERhdGEgPSBbXTtcclxuICAgICAgaWYodGhpcy5jdXJyZW50Um91bmQgPiAxKVxyXG4gICAgICB7XHJcbiAgICAgICAgcHJldmlvdXNSZERhdGEgPSBfLm50aChfLmNsb25lKHJlc3VsdGRhdGEpLGNyIC0gMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS1QcmV2aW91cyBSb3VuZCBEYXRhLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91c1JkRGF0YSk7XHJcbiAgICAgICAgaW5pdGlhbFJkRGF0YSA9IF8udGFrZShfLmNsb25lKHJlc3VsdGRhdGEpLCBjcik7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGN1cnJlbnRSZERhdGEgPSBfLm1hcCh0aGlzUmREYXRhLCBwbGF5ZXIgPT4ge1xyXG4gICAgICAgIGxldCB4ID0gcGxheWVyLnBubyAtIDE7XHJcbiAgICAgICAgcGxheWVyLnBob3RvID0gdGhpcy5wbGF5ZXJzW3hdLnBob3RvO1xyXG4gICAgICAgIHBsYXllci5nZW5kZXIgPSB0aGlzLnBsYXllcnNbeF0uZ2VuZGVyO1xyXG4gICAgICAgIHBsYXllci5jb3VudHJ5X2Z1bGwgPSB0aGlzLnBsYXllcnNbeF0uY291bnRyeV9mdWxsO1xyXG4gICAgICAgIHBsYXllci5jb3VudHJ5ID0gdGhpcy5wbGF5ZXJzW3hdLmNvdW50cnk7XHJcbiAgICAgICAgaWYgKHByZXZpb3VzUmREYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gXy5maW5kKHByZXZpb3VzUmREYXRhLCB7XHJcbiAgICAgICAgICAgIHBsYXllcjogcGxheWVyLnBsYXllcixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3Rwb3NpdGlvbiA9IHBsYXllckRhdGFbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHJhbmsgPSBwbGF5ZXJEYXRhWydyYW5rJ107XHJcbiAgICAgICAgICAvLyBwcmV2aW91cyByb3VuZHMgcmVzdWx0c1xyXG4gICAgICAgICAgaWYoaW5pdGlhbFJkRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5wcmV2cmVzdWx0cyA9IF8uY2hhaW4oaW5pdGlhbFJkRGF0YSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHYucGxheWVyID09PSBwbGF5ZXIucGxheWVyO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKCdyZXN1bHQnKVxyXG4gICAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMudG90YWxfcm91bmRzID0gcmVzdWx0ZGF0YS5sZW5ndGg7XHJcbiAgICAgIC8vIHRoaXMuY3VycmVudFJvdW5kID0gbGFzdFJkRGF0YVswXS5yb3VuZDtcclxuICAgICAgbGV0IGNodW5rcyA9IF8uY2h1bmsoY3VycmVudFJkRGF0YSwgdGhpcy50b3RhbF9wbGF5ZXJzKTtcclxuICAgICAgLy8gdGhpcy5yZWxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNjb3JlYm9hcmRfZGF0YSA9IGNodW5rc1tjdXJyZW50UGFnZSAtIDFdO1xyXG4gICAgICBjb25zb2xlLmxvZygnU2NvcmVib2FyZCBEYXRhJylcclxuICAgICAgY29uc29sZS5sb2codGhpcy5zY29yZWJvYXJkX2RhdGEpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHJlc3VsdF9kYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGNhdGVnb3J5OiAnQ0FURUdPUlknLFxyXG4gICAgfSksXHJcbiAgICByb3dDb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5zY29yZWJvYXJkX2RhdGEubGVuZ3RoIC8gdGhpcy5pdGVtc1BlclJvdyk7XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhZ2V1cmxcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjb3JlYm9hcmQ7IiwiaW1wb3J0IHsgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0IH0gZnJvbSAnLi9hbGVydHMuanMnO1xyXG5leHBvcnQgeyBTY29yZXNoZWV0IGFzIGRlZmF1bHQgfTtcclxuXHJcbmxldCBTY29yZXNoZWV0ID0gVnVlLmNvbXBvbmVudCgnc2NvcmVDYXJkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy10b3BcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXhcIj5cclxuICAgICAgICA8Yi1pbWcgY2xhc3M9XCJ0aHVtYm5haWwgbG9nbyBtbC1hdXRvXCIgOnNyYz1cImxvZ29cIiA6YWx0PVwiZXZlbnRfdGl0bGVcIiAvPlxyXG4gICAgICAgIDxoMiBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj5TY29yZWNhcmRzIDxpIGNsYXNzPVwiZmFzIGZhLWNsaXBib2FyZFwiPjwvaT48L3NwYW4+XHJcbiAgICAgICAgPC9oMj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTIgY29sLTEyXCI+XHJcbiAgICAgIDwhLS0gcGxheWVyIGxpc3QgaGVyZSAtLT5cclxuICAgICAgICA8dWwgY2xhc3M9XCIgcC0yIG1iLTUgYmctd2hpdGUgcm91bmRlZFwiPlxyXG4gICAgICAgICAgPGxpIDprZXk9XCJwbGF5ZXIucG5vXCIgdi1mb3I9XCJwbGF5ZXIgaW4gcGRhdGFcIiBjbGFzcz1cImJlYmFzXCI+XHJcbiAgICAgICAgICA8c3Bhbj57e3BsYXllci5wbm99fTwvc3Bhbj4gPGItaW1nLWxhenkgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgdi1iaW5kPVwicGljUHJvcHNcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJnZXRDYXJkKHBsYXllci5wbm8pXCIgdmFyaWFudD1cImxpbmtcIj57e3BsYXllci5wbGF5ZXJ9fTwvYi1idXR0b24+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEwIGNvbC0xMlwiPlxyXG4gICAgICA8dGVtcGxhdGUgdi1pZj1cInJlc3VsdGRhdGFcIj5cclxuICAgICAgICA8aDQgY2xhc3M9XCJncmVlblwiPlNjb3JlY2FyZDogPGItaW1nIDphbHQ9XCJtUGxheWVyLnBsYXllclwiIGNsYXNzPVwibXgtMlwiIDpzcmM9XCJtUGxheWVyLnBob3RvXCIgc3R5bGU9XCJ3aWR0aDo2MHB4OyBoZWlnaHQ6NjBweFwiPjwvYi1pbWc+IHt7bVBsYXllci5wbGF5ZXJ9fTwvaDQ+XHJcbiAgICAgICAgPGItdGFibGUgcmVzcG9uc2l2ZT1cIm1kXCIgc21hbGwgaG92ZXIgZm9vdC1jbG9uZSBoZWFkLXZhcmlhbnQ9XCJsaWdodFwiIGJvcmRlcmVkIHRhYmxlLXZhcmlhbnQ9XCJsaWdodFwiIDpmaWVsZHM9XCJmaWVsZHNcIiA6aXRlbXM9XCJzY29yZWNhcmRcIiBpZD1cInNjb3JlY2FyZFwiIGNsYXNzPVwiYmViYXMgc2hhZG93IHAtNCBteC1hdXRvXCIgc3R5bGU9XCJ3aWR0aDo5MCU7IHRleHQtYWxpZ246Y2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlXCI+XHJcbiAgICAgICAgPCEtLSBBIGN1c3RvbSBmb3JtYXR0ZWQgY29sdW1uIC0tPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChyb3VuZCk9XCJkYXRhXCI+XHJcbiAgICAgICAgICB7e2RhdGEuaXRlbS5yb3VuZH19IDxzdXAgdi1pZj1cImRhdGEuaXRlbS5zdGFydCA9PSd5J1wiPio8L3N1cD5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChvcHBvKT1cImRhdGFcIj5cclxuICAgICAgICAgIDxzbWFsbD4je3tkYXRhLml0ZW0ub3Bwb19ub319PC9zbWFsbD48Yi1pbWctbGF6eSA6dGl0bGU9XCJkYXRhLml0ZW0ub3Bwb1wiIDphbHQ9XCJkYXRhLml0ZW0ub3Bwb1wiIDpzcmM9XCJkYXRhLml0ZW0ub3BwX3Bob3RvXCIgdi1iaW5kPVwicGljUHJvcHNcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChkYXRhLml0ZW0ub3Bwb19ubylcIiB2YXJpYW50PVwibGlua1wiPlxyXG4gICAgICAgICAgICAgIHt7ZGF0YS5pdGVtLm9wcG98YWJicnZ9fVxyXG4gICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6dGFibGUtY2FwdGlvbj5cclxuICAgICAgICAgIFNjb3JlY2FyZDogI3t7bVBsYXllci5wbm99fSB7e21QbGF5ZXIucGxheWVyfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvYi10YWJsZT5cclxuICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwbGF5ZXJfbm86IHRoaXMuJHJvdXRlLnBhcmFtcy5wbm8sXHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHRvdXJuZXlfc2x1ZzogJycsXHJcbiAgICAgIHBpY1Byb3BzOiB7XHJcbiAgICAgICAgYmxvY2s6IGZhbHNlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIHdpZHRoOiAnMzBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMzBweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20sIG14LTEnLFxyXG4gICAgICB9LFxyXG4gICAgICBmaWVsZHM6IFt7a2V5Oidyb3VuZCcsbGFiZWw6J1JkJyxzb3J0YWJsZTp0cnVlfSwge2tleTogJ29wcG8nLCBsYWJlbDonT3BwLiBOYW1lJ30se2tleTonb3Bwb19zY29yZScsbGFiZWw6J09wcC4gU2NvcmUnLHNvcnRhYmxlOnRydWV9LHtrZXk6J3Njb3JlJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidkaWZmJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidyZXN1bHQnLHNvcnRhYmxlOnRydWV9LCB7a2V5Oid3aW5zJyxsYWJlbDonV29uJyxzb3J0YWJsZTp0cnVlfSx7a2V5Oidsb3NzZXMnLGxhYmVsOidMb3N0Jyxzb3J0YWJsZTp0cnVlfSx7a2V5Oidwb2ludHMnLHNvcnRhYmxlOnRydWV9LHtrZXk6J21hcmdpbicsc29ydGFibGU6dHJ1ZSxsYWJlbDonTWFyJ30se2tleToncG9zaXRpb24nLGxhYmVsOidSYW5rJyxzb3J0YWJsZTp0cnVlfV0sXHJcbiAgICAgIHBkYXRhOiB7fSxcclxuICAgICAgc2NvcmVjYXJkOiB7fSxcclxuICAgICAgbVBsYXllcjoge30sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBjcmVhdGVkKCkge1xyXG4gICAgdmFyIHAgPSB0aGlzLnNsdWcuc3BsaXQoJy0nKTtcclxuICAgIHAuc2hpZnQoKTtcclxuICAgIHRoaXMudG91cm5leV9zbHVnID0gcC5qb2luKCctJyk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnRvdXJuZXlfc2x1Zyk7XHJcbiAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfUkVTREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IGBQbGF5ZXIgU2NvcmVjYXJkcyAtICR7dGhpcy50b3VybmV5X3RpdGxlfWA7XHJcbiAgfSxcclxuICB3YXRjaDp7XHJcbiAgICByZXN1bHRkYXRhOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIGlmIChuZXdWYWwpIHtcclxuICAgICAgICAgIHRoaXMucGRhdGEgPSBfLmNoYWluKHRoaXMucmVzdWx0ZGF0YSlcclxuICAgICAgICAgICAgLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgICAgICB0aGlzLmdldENhcmQodGhpcy5wbGF5ZXJfbm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldENhcmQ6IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgIGxldCBjID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICBsZXQgcyA9IF8uY2hhaW4oYykubWFwKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHYsIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5wbm8gPT0gbjtcclxuICAgICAgICB9KS5tYXAoIGZ1bmN0aW9uKGkpe1xyXG4gICAgICAgICAgaS5fY2VsbFZhcmlhbnRzID0gW107XHJcbiAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ2luZm8nO1xyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J3dpbicpe1xyXG4gICAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J2xvc3MnKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdkYW5nZXInO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J2RyYXcnKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICd3YXJuaW5nJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KS5mbGF0dGVuRGVlcCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubVBsYXllciA9IF8uZmlyc3Qocyk7XHJcbiAgICAgIHRoaXMuJHJvdXRlci5yZXBsYWNlKHsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgcG5vOiBuIH0gfSk7XHJcbiAgICAgIHRoaXMucGxheWVyX25vID0gbjtcclxuICAgICAgY29uc29sZS5sb2cocyk7XHJcbiAgICAgIHRoaXMuc2NvcmVjYXJkID0gcztcclxuICB9LFxyXG5cclxufSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiAnVE9UQUxQTEFZRVJTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGNhdGVnb3J5OiAnQ0FURUdPUlknLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogJ1BBUkVOVFNMVUcnLFxyXG4gICAgICBldmVudF90aXRsZTogJ0VWRU5UX1RJVExFJyxcclxuICAgICAgdG91cm5leV90aXRsZTogJ1RPVVJORVlfVElUTEUnLFxyXG4gICAgICBsb2dvOiAnTE9HT19VUkwnLFxyXG4gICAgfSksXHJcbiAgICBicmVhZGNydW1iczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ05TRiBOZXdzJyxcclxuICAgICAgICAgIGhyZWY6ICcvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leV90aXRsZSxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgc2x1ZzogdGhpcy50b3VybmV5X3NsdWcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogYCR7Xy5jYXBpdGFsaXplKHRoaXMuY2F0ZWdvcnkpfSAtIFJlc3VsdHMgYW5kIFN0YXRzYCxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdDYXRlRGV0YWlsJyxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgZXZlbnRfc2x1ZzogdGhpcy5zbHVnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdTY29yZWNhcmRzJyxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCIgbGV0IExvV2lucyA9IFZ1ZS5jb21wb25lbnQoJ2xvd2lucycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gTG93IFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0TG93U2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImxvd3dpbnNfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbG93d2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG93d2luc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldExvd1Njb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlXaW5zID1WdWUuY29tcG9uZW50KCdoaXdpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIEhpZ2ggV2lubmluZyBTY29yZXMgLS0+XHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0SGlTY29yZSgnd2luJylcIiA6ZmllbGRzPVwiaGlnaHdpbnNfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+YCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpZ2h3aW5zX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWdod2luc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldEhpU2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heEJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlMb3NzID0gVnVlLmNvbXBvbmVudCgnaGlsb3NzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8IS0tIEhpZ2ggTG9zaW5nIFNjb3JlcyAtLT5cclxuICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ2xvc3MnKVwiIDpmaWVsZHM9XCJoaWxvc3NfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWxvc3NfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpbG9zc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnV2lubmVyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldEhpU2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heChmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgQ29tYm9TY29yZXMgPSBWdWUuY29tcG9uZW50KCdjb21ib3Njb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaWNvbWJvKClcIiA6ZmllbGRzPVwiaGljb21ib19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWNvbWJvX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWNvbWJvX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdjb21ib19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdDb21iaW5lZCBTY29yZScsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpY29tYm8oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuY29tYm9fc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnY29tYm9fc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IFRvdGFsU2NvcmVzID0gVnVlLmNvbXBvbmVudCgndG90YWxzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgIC8vICAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3RvdGFsX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1RvdGFsIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgVG90YWxPcHBTY29yZXMgPVZ1ZS5jb21wb25lbnQoJ29wcHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJ0b3RhbG9wcHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvdGFsb3Bwc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnRvdGFsb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgIC8vICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAndG90YWxfb3Bwc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnVG90YWwgT3Bwb25lbnQgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBBdmVTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAvLydpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0F2ZXJhZ2UgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IEF2ZU9wcFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2F2ZW9wcHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIGhvdmVyIHJlc3BvbnNpdmUgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cImF2ZW9wcHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF2ZW9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hdmVvcHBzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgIC8vICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX29wcF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBMb1NwcmVhZCA9IFZ1ZS5jb21wb25lbnQoJ2xvc3ByZWFkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwibG9TcHJlYWQoKVwiIDpmaWVsZHM9XCJsb3NwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvc3ByZWFkX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5sb3NwcmVhZF9maWVsZHMgPSBbXHJcbiAgICAgICdyb3VuZCcsXHJcbiAgICAgIHsga2V5OiAnZGlmZicsIGxhYmVsOiAnU3ByZWFkJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGxvU3ByZWFkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1pbkJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5kaWZmO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2RpZmYnKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlTcHJlYWQgPSAgIFZ1ZS5jb21wb25lbnQoJ2hpc3ByZWFkJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaVNwcmVhZCgpXCIgOmZpZWxkcz1cImhpc3ByZWFkX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpc3ByZWFkX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaXNwcmVhZF9maWVsZHMgPSBbXHJcbiAgICAgICdyb3VuZCcsXHJcbiAgICAgIHsga2V5OiAnZGlmZicsIGxhYmVsOiAnU3ByZWFkJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpU3ByZWFkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heChmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiB9KTtcclxuZXhwb3J0IHtIaVdpbnMsIExvV2lucyxIaUxvc3MsQ29tYm9TY29yZXMsVG90YWxTY29yZXMsVG90YWxPcHBTY29yZXMsQXZlU2NvcmVzLEF2ZU9wcFNjb3JlcyxIaVNwcmVhZCwgTG9TcHJlYWR9IiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbmxldCB0b3BQZXJmb3JtZXJzID0gVnVlLmNvbXBvbmVudCgndG9wLXN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgIDxoMyBjbGFzcz1cImJlYmFzXCI+e3t0aXRsZX19XHJcbiAgICAgICAgPHNwYW4+PGkgY2xhc3M9XCJmYXMgZmEtbWVkYWxcIj48L2k+PC9zcGFuPlxyXG4gICAgICA8L2gzPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC1sZy0yIGNvbC1zbS00IGNvbC0xMlwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibXQtNSBkLWZsZXggYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGlkPVwidG9wLWJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgPGItYnV0dG9uLWdyb3VwIHZlcnRpY2FsPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIlRvcCAzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgQGNsaWNrPVwic2hvd1BpYygndG9wMycpXCJcclxuICAgICAgICAgICAgICBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J3RvcDMnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Ub3AgM1xyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkhpZ2hlc3QgKEdhbWUpIFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2hpZ2FtZXMnKVwiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaWdhbWVzJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJ1bGxzZXllIG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5IaWdoIEdhbWVcclxuICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpYXZlcydcIiBAY2xpY2s9XCJzaG93UGljKCdoaWF2ZXMnKVwiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRodW1icy11cCBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBBdmUgU2NvcmU8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkxvd2VzdCBBdmVyYWdlIE9wcG9uZW50IFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiXHJcbiAgICAgICAgICAgICAgQGNsaWNrPVwic2hvd1BpYygnbG9vcHBhdmVzJylcIiBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2xvb3BwYXZlcydcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1iZWVyIG1yLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+TG93IE9wcCBBdmU8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdi1pZj1cInJhdGluZ19zdGF0c1wiIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoIFJhbmsgUG9pbnRzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgQGNsaWNrPVwic2hvd1BpYygnaGlyYXRlJylcIlxyXG4gICAgICAgICAgICAgIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlyYXRlJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJvbHQgbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5IaSBSYW5rIFBvaW50czwvYi1idXR0b24+XHJcbiAgICAgICAgICA8L2ItYnV0dG9uLWdyb3VwPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBjb2wtc20tOCBjb2wtMTJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgOmNsYXNzPVwieydkZWxheTEnOiAgaXRlbS5wb3NpdGlvbiA9PSAnMXN0JywgJ2RlbGF5Mic6IGl0ZW0ucG9zaXRpb24gPT0gJzJuZCcsICdkZWxheTMnOiBpdGVtLnBvc2l0aW9uID09ICczcmQnfVwiIGNsYXNzPVwiY29sLXNtLTQgY29sLTEyIGFuaW1hdGVkIGZsaXBJblhcIiB2LWZvcj1cIihpdGVtLCBpbmRleCkgaW4gc3RhdHNcIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cInAtMiB0ZXh0LWNlbnRlciBiZWJhcyBiZy1kYXJrIHRleHQtd2hpdGVcIj57e2l0ZW0ucGxheWVyfX08L2g0PlxyXG4gICAgICAgICAgPGRpdiA6Y2xhc3M9XCJ7J2dvbGQnOiBpdGVtLnBvc2l0aW9uID09ICcxc3QnLCdzaWx2ZXInOiBpdGVtLnBvc2l0aW9uID09ICcybmQnLCdicm9uemUnOiBpdGVtLnBvc2l0aW9uID09ICczcmQnfVwiIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIFwiPlxyXG4gICAgICAgICAgICA8aW1nIDpzcmM9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLnBob3RvXCIgd2lkdGg9JzEyMCcgaGVpZ2h0PScxMjAnIGNsYXNzPVwiaW1nLWZsdWlkIHJvdW5kZWQtY2lyY2xlXCJcclxuICAgICAgICAgICAgICA6YWx0PVwicGxheWVyc1tpdGVtLnBuby0xXS5wb3N0X3RpdGxlfGxvd2VyY2FzZVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbWwtNVwiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyc1tpdGVtLnBuby0xXS5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgIDp0aXRsZT1cInBsYXllcnNbaXRlbS5wbm8tMV0uY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmYVwiXHJcbiAgICAgICAgICAgICAgICA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnbScsICdmYS1mZW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnZid9XCJcclxuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYmctZGFyayB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5wb2ludHNcIj57e2l0ZW0ucG9pbnRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlXCI+PHNtYWxsIHYtaWY9XCJpdGVtLnJhdGluZ19jaGFuZ2UgPj0gMFwiPkdhaW5lZDwvc21hbGw+IHt7aXRlbS5yYXRpbmdfY2hhbmdlfX0gcG9pbnRzIDxzbWFsbCB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlIDw9IDBcIj5sb3NzPC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5tYXJnaW5cIj57e2l0ZW0ubWFyZ2lufGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgdGV4dC1jZW50ZXIgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCIgdi1pZj1cIml0ZW0uc2NvcmVcIj5Sb3VuZFxyXG4gICAgICAgICAgICAgICAge3tpdGVtLnJvdW5kfX0gdnMge3tpdGVtLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgYmctc3VjY2VzcyB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnNjb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLnBvc2l0aW9uXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ucG9zaXRpb259fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uYXZlX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9vcHBfc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5hdmVfb3BwX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLm5ld19yYXRpbmdcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5vbGRfcmF0aW5nfX0gLSB7e2l0ZW0ubmV3X3JhdGluZ319PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICBwcm9maWxlcyA6IFtdLFxyXG4gICAgICBzdGF0czogW10sXHJcbiAgICAgIGNvbXB1dGVkX3JhdGluZ19pdGVtczogW10sXHJcbiAgICAgIGN1cnJlbnRWaWV3OiAnJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNob3dQaWMoJ3RvcDMnKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHNob3dQaWM6IGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB0XHJcbiAgICAgIGxldCBhcnIscixzID0gW107XHJcbiAgICAgIGlmICh0ID09ICdoaWF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX3Njb3JlJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlID0gJ0hpZ2hlc3QgQXZlcmFnZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2xvb3BwYXZlcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdhdmVfb3BwX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZVJpZ2h0KGFyciwgMykucmV2ZXJzZSgpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX29wcF9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nTG93ZXN0IE9wcG9uZW50IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdoaWdhbWVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuY29tcHV0ZVN0YXRzKCk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnc2NvcmUnLCdyb3VuZCcsJ29wcG8nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0hpZ2ggR2FtZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ3RvcDMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygncG9pbnRzJyk7XHJcbiAgICAgICAgcyA9IF8uc29ydEJ5KGFycixbJ3BvaW50cycsJ21hcmdpbiddKS5yZXZlcnNlKClcclxuICAgICAgICByID0gXy50YWtlKHMsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAncG9pbnRzJywnbWFyZ2luJywncG9zaXRpb24nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J1RvcCAzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdoaXJhdGUnKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSYXRpbmdEYXRhKCk7XHJcbiAgICAgICAgYXJyID0gdGhpcy5jb21wdXRlZF9yYXRpbmdfaXRlbXM7XHJcblxyXG4gICAgICAgIHMgPSBfLnNvcnRCeShhcnIsIFsncmF0aW5nX2NoYW5nZScsJ25ld19yYXRpbmcnXSkucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByID0gXy50YWtlKHMsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnbmV3X3JhdGluZycsICdyYXRpbmdfY2hhbmdlJywgJ29sZF9yYXRpbmcnXSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLXRvcCByYW5rLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZT0nSGlnaCBSYXRpbmcgUG9pbnQgR2FpbmVycydcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdGF0cyA9IHI7XHJcbiAgICAgIC8vIHRoaXMucHJvZmlsZXMgPSB0aGlzLnBsYXllcnNbci5wbm8tMV07XHJcblxyXG4gICAgfSxcclxuICAgIGdldFN0YXRzOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeSh0aGlzLmZpbmFsc3RhdHMsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIGNvbXB1dGVTdGF0czogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVSYXRpbmdEYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCByZXN1bHRkYXRhID0gdGhpcy5yZXN1bHRkYXRhO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2hhaW4ocmVzdWx0ZGF0YSkubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgICAgbGV0IGl0ZW1zID0gXy5jbG9uZSh0aGlzLnJhdGluZ19zdGF0cyk7XHJcbiAgICAgIHRoaXMuY29tcHV0ZWRfcmF0aW5nX2l0ZW1zID0gXy5tYXAoaXRlbXMsIGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgbGV0IG4gPSB4LnBubztcclxuICAgICAgICBsZXQgcCA9IF8uZmlsdGVyKGRhdGEsIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5wbm8gPT0gbjtcclxuICAgICAgICB9KTtcclxuICAgICAgICB4LnBob3RvID0gcFswXS5waG90bztcclxuICAgICAgICB4LnBvc2l0aW9uID0gcFswXS5wb3NpdGlvbjtcclxuICAgICAgICB4LnBsYXllciA9IHgubmFtZTtcclxuICAgICAgICB4LnJhdGluZ19jaGFuZ2UgPSBwYXJzZUludCh4LnJhdGluZ19jaGFuZ2UpO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4ubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgZmluYWxzdGF0czogJ0ZJTkFMX1JPVU5EX1NUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICByYXRpbmdfc3RhdHM6ICdSQVRJTkdfU1RBVFMnLFxyXG4gICAgICBvbmdvaW5nOiAnT05HT0lOR19UT1VSTkVZJyxcclxuICAgIH0pLFxyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB0b3BQZXJmb3JtZXJzOyIsImV4cG9ydCB7IHN0b3JlIGFzIGRlZmF1bHQgfTtcclxuXHJcbmltcG9ydCB7IGJhc2VVUkwsIGF1dGhVUkwsIHByb2ZpbGVVUkwsIHN0YXRzVVJMIH0gZnJvbSAnLi9jb25maWcuanMnXHJcbmNvbnN0IHN0b3JlID0gbmV3IFZ1ZXguU3RvcmUoe1xyXG4gIHN0cmljdDogdHJ1ZSxcclxuICBzdGF0ZToge1xyXG4gICAgdG91YXBpOiBbXSxcclxuICAgIHRvdWFjY2Vzc3RpbWU6ICcnLFxyXG4gICAgZGV0YWlsOiBbXSxcclxuICAgIGxhc3RkZXRhaWxhY2Nlc3M6ICcnLFxyXG4gICAgZXZlbnRfc3RhdHM6IFtdLFxyXG4gICAgcGxheWVyczogW10sXHJcbiAgICByZXN1bHRfZGF0YTogW10sXHJcbiAgICB0b3RhbF9wbGF5ZXJzOiBudWxsLFxyXG4gICAgZXJyb3I6ICcnLFxyXG4gICAgbG9hZGluZzogdHJ1ZSxcclxuICAgIGxvZ2luX2xvYWRpbmc6IGZhbHNlLFxyXG4gICAgbG9naW5fc3VjY2VzczogZmFsc2UsXHJcbiAgICBhY2Nlc3NUb2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RfdG9rZW4nKSB8fCAnJyxcclxuICAgIHVzZXJfZGF0YTogbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RfdXNlcicpIHx8ICcnLFxyXG4gICAgb25nb2luZzogZmFsc2UsXHJcbiAgICBjdXJyZW50UGFnZTogbnVsbCxcclxuICAgIFdQdG90YWw6IG51bGwsXHJcbiAgICBXUHBhZ2VzOiBudWxsLFxyXG4gICAgY2F0ZWdvcnk6ICcnLFxyXG4gICAgcGFyZW50c2x1ZzogJycsXHJcbiAgICBldmVudF90aXRsZTogJycsXHJcbiAgICB0b3VybmV5X3RpdGxlOiAnJyxcclxuICAgIGxvZ29fdXJsOiAnJyxcclxuICAgIHRvdGFsX3JvdW5kczogbnVsbCxcclxuICAgIGZpbmFsX3JvdW5kX3N0YXRzOiBbXSxcclxuICAgIHJhdGluZ19zdGF0czogW10sXHJcbiAgICBzaG93c3RhdHM6IGZhbHNlLFxyXG4gICAgcGxheWVyX2xhc3RfcmRfZGF0YTogW10sXHJcbiAgICBwbGF5ZXJkYXRhOiBbXSxcclxuICAgIHBsYXllcjogbnVsbCxcclxuICAgIGFsbF9wbGF5ZXJzOiBbXSxcclxuICAgIGFsbF9wbGF5ZXJzX3RvdV9kYXRhOltdLFxyXG4gICAgcGxheWVyX3N0YXRzOiBbXSxcclxuICB9LFxyXG4gIGdldHRlcnM6IHtcclxuICAgIFBMQVlFUl9TVEFUUzogc3RhdGUgPT4gc3RhdGUucGxheWVyX3N0YXRzLFxyXG4gICAgTEFTVFJEREFUQTogc3RhdGUgPT4gc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSxcclxuICAgIFBMQVlFUkRBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcmRhdGEsXHJcbiAgICBQTEFZRVI6IHN0YXRlID0+IHN0YXRlLnBsYXllcixcclxuICAgIEFMTF9QTEFZRVJTOiBzdGF0ZSA9PiBzdGF0ZS5hbGxfcGxheWVycyxcclxuICAgIEFMTF9QTEFZRVJTX1RPVV9EQVRBOiBzdGF0ZSA9PiBzdGF0ZS5hbGxfcGxheWVyc190b3VfZGF0YSxcclxuICAgIFNIT1dTVEFUUzogc3RhdGUgPT4gc3RhdGUuc2hvd3N0YXRzLFxyXG4gICAgVE9VQVBJOiBzdGF0ZSA9PiBzdGF0ZS50b3VhcGksXHJcbiAgICBUT1VBQ0NFU1NUSU1FOiBzdGF0ZSA9PiBzdGF0ZS50b3VhY2Nlc3N0aW1lLFxyXG4gICAgREVUQUlMOiBzdGF0ZSA9PiBzdGF0ZS5kZXRhaWwsXHJcbiAgICBMQVNUREVUQUlMQUNDRVNTOiBzdGF0ZSA9PiBzdGF0ZS5sYXN0ZGV0YWlsYWNjZXNzLFxyXG4gICAgRVZFTlRTVEFUUzogc3RhdGUgPT4gc3RhdGUuZXZlbnRfc3RhdHMsXHJcbiAgICBQTEFZRVJTOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJzLFxyXG4gICAgVE9UQUxQTEFZRVJTOiBzdGF0ZSA9PiBzdGF0ZS50b3RhbF9wbGF5ZXJzLFxyXG4gICAgUkVTVUxUREFUQTogc3RhdGUgPT4gc3RhdGUucmVzdWx0X2RhdGEsXHJcbiAgICBSQVRJTkdfU1RBVFM6IHN0YXRlID0+IHN0YXRlLnJhdGluZ19zdGF0cyxcclxuICAgIEVSUk9SOiBzdGF0ZSA9PiBzdGF0ZS5lcnJvcixcclxuICAgIExPQURJTkc6IHN0YXRlID0+IHN0YXRlLmxvYWRpbmcsXHJcbiAgICBBQ0NFU1NfVE9LRU46IHN0YXRlID0+IHN0YXRlLmFjY2Vzc1Rva2VuLFxyXG4gICAgVVNFUjogc3RhdGUgPT4gSlNPTi5wYXJzZShzdGF0ZS51c2VyX2RhdGEpLFxyXG4gICAgTE9HSU5fTE9BRElORzogc3RhdGUgPT4gc3RhdGUubG9naW5fbG9hZGluZyxcclxuICAgIExPR0lOX1NVQ0NFU1M6IHN0YXRlID0+IHN0YXRlLmxvZ2luX3N1Y2Nlc3MsXHJcbiAgICBDVVJSUEFHRTogc3RhdGUgPT4gc3RhdGUuY3VycmVudFBhZ2UsXHJcbiAgICBXUFRPVEFMOiBzdGF0ZSA9PiBzdGF0ZS5XUHRvdGFsLFxyXG4gICAgV1BQQUdFUzogc3RhdGUgPT4gc3RhdGUuV1BwYWdlcyxcclxuICAgIENBVEVHT1JZOiBzdGF0ZSA9PiBzdGF0ZS5jYXRlZ29yeSxcclxuICAgIFRPVEFMX1JPVU5EUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcm91bmRzLFxyXG4gICAgRklOQUxfUk9VTkRfU1RBVFM6IHN0YXRlID0+IHN0YXRlLmZpbmFsX3JvdW5kX3N0YXRzLFxyXG4gICAgUEFSRU5UU0xVRzogc3RhdGUgPT4gc3RhdGUucGFyZW50c2x1ZyxcclxuICAgIEVWRU5UX1RJVExFOiBzdGF0ZSA9PiBzdGF0ZS5ldmVudF90aXRsZSxcclxuICAgIFRPVVJORVlfVElUTEU6IHN0YXRlID0+IHN0YXRlLnRvdXJuZXlfdGl0bGUsXHJcbiAgICBPTkdPSU5HX1RPVVJORVk6IHN0YXRlID0+IHN0YXRlLm9uZ29pbmcsXHJcbiAgICBMT0dPX1VSTDogc3RhdGUgPT4gc3RhdGUubG9nb191cmwsXHJcbiAgfSxcclxuICBtdXRhdGlvbnM6IHtcclxuICAgIFNFVF9TSE9XU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5zaG93c3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9GSU5BTF9SRF9TVEFUUzogKHN0YXRlLCByZXN1bHRzdGF0cykgPT4ge1xyXG4gICAgICBsZXQgbGVuID0gcmVzdWx0c3RhdHMubGVuZ3RoO1xyXG4gICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgIHN0YXRlLmZpbmFsX3JvdW5kX3N0YXRzID0gXy5sYXN0KHJlc3VsdHN0YXRzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFNFVF9UT1VEQVRBOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91YXBpID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRERVRBSUw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5kZXRhaWwgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MQVNUX0FDQ0VTU19USU1FOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91YWNjZXNzdGltZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0RFVEFJTF9MQVNUX0FDQ0VTU19USU1FOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubGFzdGRldGFpbGFjY2VzcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1dQX0NPTlNUQU5UUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLldQcGFnZXMgPSBwYXlsb2FkWyd4LXdwLXRvdGFscGFnZXMnXTtcclxuICAgICAgc3RhdGUuV1B0b3RhbCA9IHBheWxvYWRbJ3gtd3AtdG90YWwnXTtcclxuICAgIH0sXHJcbiAgICBTRVRfUExBWUVSUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBhID0gcGF5bG9hZC5tYXAoZnVuY3Rpb24gKHZhbCwgaW5kZXgsIGtleSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGtleVtpbmRleF1bJ3Bvc3RfdGl0bGUnXSk7XHJcbiAgICAgICAga2V5W2luZGV4XVsndG91X25vJ10gPSBpbmRleCArIDE7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3BsYXllcnMgPSBwYXlsb2FkLmxlbmd0aDtcclxuICAgICAgc3RhdGUucGxheWVycyA9IGE7XHJcbiAgICB9LFxyXG4gICAgU0VUX0FMTF9QTEFZRVJTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuYWxsX3BsYXllcnMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9BTExfUExBWUVSU19UT1VfREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmFsbF9wbGF5ZXJzX3RvdV9kYXRhLnB1c2gocGF5bG9hZCk7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JBVElOR19TVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnJhdGluZ19zdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JFU1VMVDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBwID0gc3RhdGUucGxheWVycztcclxuICAgICAgbGV0IHIgPSBfLm1hcChwYXlsb2FkLCBmdW5jdGlvbiAoeikge1xyXG4gICAgICAgIHJldHVybiBfLm1hcCh6LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgbGV0IGkgPSBvLnBubyAtIDE7XHJcbiAgICAgICAgICBvLnBob3RvID0gcFtpXS5waG90bztcclxuICAgICAgICAgIG8uaWQgPSBwW2ldLmlkO1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5X2Z1bGwgPSBwW2ldLmNvdW50cnlfZnVsbDtcclxuICAgICAgICAgIG8uZ2VuZGVyID0gcFtpXS5nZW5kZXI7XHJcbiAgICAgICAgICBvLmlzX3RlYW0gPSBwW2ldLmlzX3RlYW07XHJcbiAgICAgICAgICBsZXQgeCA9IG8ub3Bwb19ubyAtIDE7XHJcbiAgICAgICAgICBvLm9wcF9waG90byA9IHBbeF0ucGhvdG87XHJcbiAgICAgICAgICBvLm9wcF9pZCA9IHBbeF0uaWQ7XHJcbiAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocik7XHJcbiAgICAgIHN0YXRlLnJlc3VsdF9kYXRhID0gcjtcclxuICAgIH0sXHJcbiAgICBTRVRfT05HT0lORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLm9uZ29pbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVFNUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DVVJSUEFHRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmN1cnJlbnRQYWdlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVJST1I6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5lcnJvciA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVVNFUl9EQVRBOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudXNlcl9kYXRhID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HSU5fU1VDQ0VTUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvZ2luX3N1Y2Nlc3MgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0dJTl9MT0FESU5HOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9naW5fbG9hZGluZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVEFMX1JPVU5EUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3JvdW5kcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0NBVEVHT1JZOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgLy8gdmFyIGNhdGVnb3J5ID0gIHBheWxvYWQudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpLm1hcCgocykgID0+cy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHMuc3Vic3RyaW5nKDEpKS5qb2luKCcgJyk7XHJcbiAgICAgIHN0YXRlLmNhdGVnb3J5ID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9VUk5FWV9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdXJuZXlfdGl0bGUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9QQVJFTlRTTFVHOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUucGFyZW50c2x1ZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UX1RJVExFOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfdGl0bGUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0dPX1VSTDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvZ29fdXJsID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICAvL1xyXG4gICAgQ09NUFVURV9QTEFZRVJfU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgbGVuID0gc3RhdGUucmVzdWx0X2RhdGEubGVuZ3RoO1xyXG4gICAgICBsZXQgbGFzdHJvdW5kID0gc3RhdGUucmVzdWx0X2RhdGFbbGVuIC0gMV07XHJcbiAgICAgIGxldCBwbGF5ZXIgPSAoc3RhdGUucGxheWVyID0gXy5maWx0ZXIoc3RhdGUucGxheWVycywgeyBpZDogcGF5bG9hZCB9KSk7XHJcbiAgICAgIGxldCBuYW1lID0gXy5tYXAocGxheWVyLCAncG9zdF90aXRsZScpICsgJyc7IC8vIGNvbnZlcnQgdG8gc3RyaW5nXHJcbiAgICAgIGxldCBwbGF5ZXJfdG5vID0gcGFyc2VJbnQoXy5tYXAocGxheWVyLCAndG91X25vJykpO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfbGFzdF9yZF9kYXRhID0gXy5maW5kKGxhc3Ryb3VuZCwgeyBwbm86IHBsYXllcl90bm8gfSk7XHJcblxyXG4gICAgICBsZXQgcGRhdGEgPSAoc3RhdGUucGxheWVyZGF0YSA9IF8uY2hhaW4oc3RhdGUucmVzdWx0X2RhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbE9wcFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgb3Bwc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnb3Bwb19zY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBvcHBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsUmFua3MgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zY29yZSA9PSBwYXJzZUludChwSGlTY29yZSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGhpc1xyXG4gICAgICAgICksXHJcbiAgICAgICAgJ3JvdW5kJ1xyXG4gICAgICApO1xyXG4gICAgICBsZXQgcExvU2NvcmVSb3VuZHMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihcclxuICAgICAgICAgIF8uZmxhdHRlbkRlZXAocGRhdGEpLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2NvcmUgPT0gcGFyc2VJbnQocExvU2NvcmUpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApLFxyXG4gICAgICAgICdyb3VuZCdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcyA9IHBIaVNjb3JlUm91bmRzLmpvaW4oKTtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBMb1Njb3JlUm91bmRzID0gcExvU2NvcmVSb3VuZHMuam9pbigpO1xyXG5cclxuICAgICAgbGV0IHBSYnlSID0gXy5tYXAocGRhdGEsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgICBpZiAobC5yZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICd3b24nO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdkcmV3JztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdsb3N0JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBzdGFydGluZyA9ICdyZXBseWluZyc7XHJcbiAgICAgICAgICBpZiAobC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgc3RhcnRpbmcgPSAnc3RhcnRpbmcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PSAnQVInKSB7XHJcbiAgICAgICAgICAgIGwucmVwb3J0ID1cclxuICAgICAgICAgICAgICAnSW4gcm91bmQgJyArXHJcbiAgICAgICAgICAgICAgbC5yb3VuZCArXHJcbiAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPGVtIHYtaWY9XCJsLnN0YXJ0XCI+LCAoJyArXHJcbiAgICAgICAgICAgICAgc3RhcnRpbmcgK1xyXG4gICAgICAgICAgICAgICcpPC9lbT4gaXMgcGxheWluZyA8c3Ryb25nPicgK1xyXG4gICAgICAgICAgICAgIGwub3BwbyArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPi4gUmVzdWx0cyBhcmUgYmVpbmcgYXdhaXRlZCc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgKyBsLnJvdW5kICsgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICsgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgKyBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBwbGF5ZWQgPHN0cm9uZz4nICsgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IGFuZCAnICsgcmVzdWx0ICtcclxuICAgICAgICAgICAgICAnIDxlbT4nICsgbC5zY29yZSArICcgLSAnICtcclxuICAgICAgICAgICAgICBsLm9wcG9fc2NvcmUgKyAnLDwvZW0+IGEgZGlmZmVyZW5jZSBvZiAnICtcclxuICAgICAgICAgICAgICBsLmRpZmYgKyAnLiA8c3BhbiBjbGFzcz1cInN1bW1hcnlcIj48ZW0+JyArXHJcbiAgICAgICAgICAgICAgbmFtZSArICc8L2VtPiBpcyByYW5rZWQgPHN0cm9uZz4nICsgbC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiB3aXRoIDxzdHJvbmc+JyArIGwucG9pbnRzICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IHBvaW50cyBhbmQgYSBjdW11bGF0aXZlIHNwcmVhZCBvZiAnICtcclxuICAgICAgICAgICAgICBsLm1hcmdpbiArICcgPC9zcGFuPic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gbDtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wUmJ5UiA9IF8uZmxhdHRlbkRlZXAocFJieVIpO1xyXG5cclxuICAgICAgbGV0IGFsbFdpbnMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihfLmZsYXR0ZW5EZWVwKHBkYXRhKSwgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiAnd2luJyA9PSBwLnJlc3VsdDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0V2lucyA9IF8uZmlsdGVyKGFsbFdpbnMsIFsnc3RhcnQnLCAneSddKS5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ24nXSkubGVuZ3RoO1xyXG4gICAgICBsZXQgc3RhcnRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICBpZiAocC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydHMgPSBzdGFydHMubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbGllcyA9IHN0YXRlLnRvdGFsX3JvdW5kcyAtIHN0YXJ0cy5sZW5ndGg7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWN0aW9uczoge1xyXG4gICAgRE9fU1RBVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfU0hPV1NUQVRTJywgcGF5bG9hZCk7XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgQVVUSF9UT0tFTihjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHthdXRoVVJMfXRva2VuL3ZhbGlkYXRlYDtcclxuICAgICAgLy9sZXQgdXJsID0gcG9zdFVSTDtcclxuICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aXRsZTogJ1BsaXVzIEFsaXR0bGUgdGVzdCBBUEkgUG9zdGluZycsXHJcbiAgICAgICAgICBjb250ZW50OiAnQW5vdGhlciBtaW5vciBQb3N0IGZyb20gV1AgQVBJJyxcclxuICAgICAgICAgIHN0YXR1czogJ3B1Ymxpc2gnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgICR7cGF5bG9hZH1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIH0pXHJcbiAgICAgICAgbGV0IHJlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICBpZiAocmVzLmNvZGUgPT0gXCJqd3RfYXV0aF92YWxpZF90b2tlblwiKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRE9fTE9HSU4oY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2F1dGhVUkx9dG9rZW5gO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCwge1xyXG4gICAgICAgIHVzZXJuYW1lOiBwYXlsb2FkLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHBheWxvYWQucGFzc1xyXG4gICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS50b2tlbikge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RfdG9rZW4nLCBKU09OLnN0cmluZ2lmeShkYXRhLnRva2VuKSlcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0X3VzZXInLCBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXJfZGlzcGxheV9uYW1lKSlcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9TVUNDRVNTJywgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCBmYWxzZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVyci5tZXNzYWdlLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGFzeW5jIEdFVF9BTExfUExBWUVSUyhjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtwcm9maWxlVVJMfWA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCggdXJsLCB7XHJcbiAgICAgICAgICAvL3BhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0sXHJcbiAgICAgICAgICAvLyBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICAke3Rva2VufWB9XHJcbiAgICAgICAgfSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICBsZXQgZGF0YSA9IF8ubWFwKHIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICBkLmNvdW50cnkgPSBkLmNvdW50cnkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGQuZ2VuZGVyID0gZC5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgcmV0dXJuIGQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgR0VUX1BMQVlFUl9UT1VfREFUQShjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtzdGF0c1VSTH0ke3BheWxvYWR9YDtcclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KCB1cmwsIHtcclxuICAgICAgICAgIC8vcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIGRhdGEuY291bnRyeSA9IGRhdGEuY291bnRyeS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGRhdGEuZ2VuZGVyID0gZGF0YS5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTX1RPVV9EQVRBJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRkVUQ0hfQVBJIChjb250ZXh0LCBwYXlsb2FkKSAge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIC8vIGxldCB0b2tlbiA9IGNvbnRleHQuZ2V0dGVycy5BQ0NFU1NfVE9LRU5cclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KHVybCwge1xyXG4gICAgICAgICAgcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnR2V0dGluZyBsaXN0cyBvZiB0b3VybmFtZW50cycpO1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLm1hcChkYXRhID0+IHtcclxuICAgICAgICAgICAgLy8gRm9ybWF0IGFuZCBhc3NpZ24gVG91cm5hbWVudCBzdGFydCBkYXRlIGludG8gYSBsZXRpYWJsZVxyXG4gICAgICAgICAgICBsZXQgc3RhcnREYXRlID0gZGF0YS5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSBtb21lbnQobmV3IERhdGUoc3RhcnREYXRlKSkuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICdkZGRkLCBNTU1NIERvIFlZWVknXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKG1vbWVudChoZWFkZXJzLmRhdGUpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1vbWVudChoZWFkZXJzLmRhdGUpLCBcImZvbnQtc2l6ZTozMHB4O2NvbG9yOmdyZWVuO1wiKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTEFTVF9BQ0NFU1NfVElNRScsIGhlYWRlcnMuZGF0ZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VEQVRBJywgZGF0YSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NVUlJQQUdFJywgcGF5bG9hZCk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0RFVEFJTCAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pO1xyXG4gICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgZGF0YSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9EQVRBIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjb250ZXh0KTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9kYXRhYDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBkYXRhLnBsYXllcnM7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdGRVRDSCBEQVRBICRzdG9yZScpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IGxvZ28gPSBkYXRhLnRvdXJuZXlbMF0uZXZlbnRfbG9nby5ndWlkO1xyXG4gICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICBsZXQgcmF0aW5nX3N0YXRzID0gbnVsbDtcclxuICAgICAgICBpZiAoZGF0YS5zdGF0c19qc29uKSB7XHJcbiAgICAgICAgICByYXRpbmdfc3RhdHMgPSBKU09OLnBhcnNlKGRhdGEuc3RhdHNfanNvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkFUSU5HX1NUQVRTJywgcmF0aW5nX3N0YXRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCAoZXJyb3IpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIEZFVENIX1JFU0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10X2RhdGFgO1xyXG4gICAgICAgICAgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pLnRoZW4ocmVzcG9uc2U9PntcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBkYXRhLmV2ZW50X2NhdGVnb3J5WzBdLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgICBsZXQgcGFyZW50X3NsdWcgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF9uYW1lO1xyXG4gICAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRTVEFUUycsIGRhdGEudG91cm5leSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JFU1VMVCcsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HT19VUkwnLCBsb2dvKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9UQUxfUk9VTkRTJywgdG90YWxfcm91bmRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+e1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgc3RvcmU7XHJcbiJdfQ==
