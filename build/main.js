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

  function AsyncIterator(generator, PromiseImpl) {
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
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
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
        return new PromiseImpl(function(resolve, reject) {
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
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  computed: _objectSpread(_objectSpread({}, mapGetters({
    login_loading: 'LOGIN_LOADING',
    login_success: 'LOGIN_SUCCESS',
    user_display: 'USER',
    access: 'ACCESS_TOKEN'
  })), {}, {
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CateDetail = Vue.component('cate', {
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-center\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div v-if=\"viewIndex !=8 && viewIndex !=5\" class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-center\" >\n                <div class=\"mr-lg-0\">\n                  <b-img fluid thumbnail class=\"logo\" :src=\"logo\" :alt=\"event_title\" />\n                </div>\n                <div class=\"mx-auto\">\n                  <h2 class=\"text-center bebas\">{{ event_title }}\n                  <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n                  </h2>\n                </div>\n              </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><b-icon icon=\"document-text\"></b-icon> Results</b-button>\n                <b-button title=\"Round-By-Round Standings\" @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><b-icon icon=\"list-ol\"></b-icon> Standings</b-button>\n                <b-button title=\"Category Statistics\" @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><b-icon icon=\"bar-chart-fill\"></b-icon> Statistics</b-button>\n                <router-link :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:1}}\">\n                <b-button variant=\"link\" class=\"text-decoration-none\"><b-icon icon=\"documents-alt\"></b-icon> Scorecards</b-button>\n                </router-link>\n                <b-button title=\"Round-By-Round Scoreboard\" @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><b-icon icon=\"display\"></b-icon>\n                Scoreboard</b-button>\n                <b-button title=\"Top 3 Performances\" @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><b-icon icon=\"award\"></b-icon>\n                Top Performers</b-button>\n                <b-button title=\"Post-tourney Rating Statistics\" v-if=\"rating_stats\" @click=\"viewIndex=7\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==7\" :pressed=\"viewIndex==7\">\n                <b-icon icon=\"graph-up\"></b-icon>\n                Rating Stats</b-button>\n                <b-button title=\"Player Profile and Statistics\"  @click=\"viewIndex=8\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==8\" :pressed=\"viewIndex==8\">\n                <b-icon icon=\"trophy\"></b-icon>\n                Profile Stats</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"col-md-10 offset-md-1 col-12 justify-content-center align-items-center\">\n            <div class=\"d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n          </div>\n        </div>\n        <template v-if=\"viewIndex==0\">\n          <allplayers :slug=\"slug\"></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-if=\"viewIndex==7\">\n          <ratings :caption=\"caption\" :computed_items=\"computed_rating_items\">\n          </ratings>\n        </template>\n        <template v-if=\"viewIndex==8\">\n           <profiles></profiles>\n        </template>\n        <template v-if=\"viewIndex==5\">\n        <scoreboard :currentRound=\"currentRound\"></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==1\"></pairings>\n                <results :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==2\"></results>\n                <standings :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\" v-if=\"viewIndex==3\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
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
  computed: _objectSpread(_objectSpread({}, Vuex.mapGetters({
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
  })), {}, {
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// let LoadingAlert, ErrorAlert;
var tDetail = Vue.component('tdetail', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n          <loading></loading>\n        </div>\n        <div v-else class=\"col-12 justify-content-center align-self-center\">\n          <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <div class=\"p-3 text-center d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start\">\n            <b-img fluid thumbnail slot=\"aside\" vertical-align=\"center\" class=\"align-self-center mr-1 logo-medium\"\n              :src=\"tourney.event_logo\" :alt=\"tourney.event_logo_title\" />\n            <h3 class=\"mx-1\">\n              {{tourney.title}}\n            </h3>\n          </div>\n          <div class=\"p-2 d-flex flex-column justify-content-center align-items-center\">\n            <ul class=\"list-inline text-center\" id=\"event-details\">\n              <li class=\"list-inline-item\" v-if=\"tourney.start_date\"><i class=\"fa fa-calendar\"></i>\n                {{tourney.start_date}}</li>\n              <li class=\"list-inline-item\" v-if=\"tourney.venue\"><i class=\"fa fa-map-marker\"></i> {{tourney.venue}}</li>\n              <li v-if=\"tourney.tournament_director\"><i class=\"fa fa-legal\"></i>\n                {{tourney.tournament_director}}</li>\n            </ul>\n            <h5>\n              Categories <i class=\"fa fa-list\" aria-hidden=\"true\"></i>\n            </h5>\n            <ul class=\"list-inline text-center cate-list\">\n              <li v-for=\"(cat, c) in tourney.tou_categories\" :key=\"c\" class=\"list-inline-item\">\n                <template v-if=\"cat.event_id\">\n                  <router-link :to=\"{ name: 'CateDetail', params: {  event_slug:cat.event_slug }}\">\n                    <span>{{cat.cat_name}}</span>\n                  </router-link>\n                </template>\n                <template v-else>\n                  <span>{{cat.cat_name}}</span>\n                </template>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n       ",
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
    document.title = "".concat(this.tourney.title, " ");
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
  computed: _objectSpread(_objectSpread({}, Vuex.mapGetters({
    // tourney: 'DETAIL',
    error: 'ERROR',
    loading: 'LOADING',
    last_access_time: 'TOUACCESSTIME',
    toulist: 'TOUAPI'
  })), {}, {
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
exports["default"] = tDetail;

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mapGetters = Vuex.mapGetters; // let LoadingAlert, ErrorAlert;

var scrList = Vue.component('scrList', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n            <h2 class=\"bebas text-center\">\n                <i class=\"fa fa-trophy\"></i> Tournaments\n            </h2>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 col-lg-10 offset-lg-1\">\n          <div class=\"d-flex align-items-center justify-content-around\">\n            <div class=\"text-center my-4 mx-1\" title=\"All tourneys\">\n              <button type=\"button\" class=\"tagbutton btn btn-light\"  :class=\"{'active':0 === activeList}\" @click=\"fetchList(currentPage)\"> All <span class=\"badge badge-dark\">\n              {{total_tourneys}} </span>\n              </button>\n            </div>\n            <div v-for=\"cat in categories\"  :key=\"cat.id\"\n            class=\"text-center my-4 mx-1\" v-if=\"cat.count>0\">\n              <button type=\"button\" @click=\"filterCat(cat.id)\" class=\"tagbutton btn btn-light\" :class=\"{\n              'active':cat.slug === 'general',\n              'active':cat.slug === 'open',\n              'active':cat.slug === 'intermediate',\n              'active':cat.slug === 'masters',\n              'active':cat.slug === 'ladies',\n              'active':cat.slug === 'veterans',\n              'active':cat.id === activeList,\n              }\"> {{cat.name}} <span class=\"badge badge-dark\"> {{cat.count}} </span></button>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row justify-content-start align-contents-center\">\n        <div class=\"col-12\">\n          <div class=\"d-flex flex-column flex-lg-row justify-content-around align-items-center\">\n            <b-pagination :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n            :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n            <p class=\"text-muted\"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class=\"emphasize\">{{WPtotal}}</span> total (<em>{{activeCat}}</em>) tournaments!</small></p>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n      <div :key=\"item.id\" class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\">\n      <div class=\"d-flex flex-column flex-lg-row mb-4 align-content-center align-items-center justify-content-lg-center justify-content-center tourney-list animated bounceInLeft\" >\n        <div class=\"mr-lg-0\">\n          <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n          <b-img :src=\"item.event_logo\" :alt=\"item.event_logo_title\" fluid  rounded=\"circle\" class=\"logo\"/></router-link>\n        </div>\n        <div class=\"ml-lg-3 mb-2\">\n          <h4 class=\"mb-1\">\n          <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\" v-if=\"item.slug\">\n              {{item.title}}\n          </router-link>\n          </h4>\n          <div class=\"text-center tou-details\">\n            <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-calendar\"></i>\n                  {{item.start_date}}\n              </small>\n            </div>\n            <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-map-marker\"></i>\n                  {{item.venue}}\n              </small>\n            </div>\n            <div class=\"d-inline p-1\">\n              <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\" v-if=\"item.slug\">\n                <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                </small>\n              </router-link>\n            </div>\n            <ul class=\"list-unstyled list-inline text-center category-list\">\n                <li class=\"list-inline-item mx-1\"\n                v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n            </ul>\n          </div>\n        </div>\n      </div>\n      </div>\n      </div>\n      <div class=\"row justify-content-start align-items-center\">\n        <div class=\"col-12 col-lg-10 offset-lg-1\">\n          <b-pagination :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n          :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n          <p class=\"text-muted\"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class=\"emphasize\">{{WPtotal}}</span> total (<em>{{activeCat}}</em>) tournaments!</small></p>\n        </div>\n      </div>\n   </template>\n</div>\n",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert
  },
  data: function data() {
    return {
      path: this.$route.path,
      currentPage: 1,
      activeList: 0,
      activeCat: 'all'
    };
  },
  created: function created() {
    console.log('List.js loaded');
    document.title = 'Scrabble Tournaments - NSF';
    this.fetchList(this.currentPage);
  },
  methods: {
    fetchList: function fetchList(pageNum) {
      this.currentPage = pageNum;
      var params = {};
      params.page = pageNum;
      this.$store.dispatch('FETCH_API', params);
      this.$store.dispatch('FETCH_CATEGORIES');
      console.log('done!');
      console.log(this.activeList, this.activeCat);
    },
    filterCat: function filterCat(cat_id) {
      this.activeList = cat_id;
      var a = this.categories.filter(function (c) {
        return c.id == cat_id;
      });
      this.activeCat = a[0].name;
      console.log(this.activeList, this.activeCat);
      var params = {};
      params.page = 1;
      params.category = cat_id;
      this.$store.dispatch('FETCH_API', params);
      this.$store.dispatch('FETCH_CATEGORIES');
    }
  },
  computed: _objectSpread(_objectSpread({}, mapGetters({
    categories: 'CATEGORIES_COUNT',
    tourneys: 'TOUAPI',
    error: 'ERROR',
    loading: 'LOADING',
    WPtotal: 'WPTOTAL',
    WPpages: 'WPPAGES'
  })), {}, {
    total_tourneys: function total_tourneys() {
      if (this.categories.length > 0) {
        var c = this.categories;
        var t = c.reduce(function (total, cat) {
          return total + cat.count;
        }, 0);
        return t;
      }

      return 0;
    },
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <div class=\"animated fadeInLeftBig\" id=\"pheader\">\n          <div class=\"d-flex align-items-center align-content-center justify-content-center mt-5\">\n            <div>\n              <h4 class=\"text-center bebas\">{{playerName}}\n                <span class=\"d-block mx-auto\" style=\"font-size:small\">\n                  <i class=\"mx-3 flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\"\n                    :title=\"player.country_full\"></i>\n                  <i class=\"mx-3 fa\" :class=\"{'fa-male': player.gender == 'm',\n                   'fa-female': player.gender == 'f','fa-users': player.is_team == 'yes' }\" aria-hidden=\"true\">\n                  </i>\n                </span>\n              </h4>\n            </div>\n            <div>\n              <img width=\"100px\" height=\"100px\" class=\"img-thumbnail img-fluid mx-3 d-block shadow-sm\"\n                :src=\"player.photo\" />\n            </div>\n            <div>\n              <h4 class=\"text-center yanone mx-3\">{{pstats.pPosition}} position</h4>\n            </div>\n          </div>\n        </div> <!-- #pheader-->\n\n        <div class=\"d-flex align-items-center align-content-center justify-content-center\">\n          <b-btn v-b-toggle.collapse1 class=\"m-1\">Quick Stats</b-btn>\n          <b-btn v-b-toggle.collapse2 class=\"m-1\">Round by Round </b-btn>\n          <b-btn v-b-toggle.collapse3 class=\"m-1\">Charts</b-btn>\n          <b-button title=\"Close\" size=\"sm\" @click=\"closeCard()\" class=\"m-1\" variant=\"outline-danger\" :disabled=\"!show\"\n            :pressed.sync=\"show\"><i class=\"fas fa-times\"></i></b-button>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-lg-8 offset-lg-2\">\n        <b-collapse id=\"collapse1\">\n          <b-card class=\"animated flipInX\">\n            <div class=\"card-header text-center\">Quick Stats</div>\n            <ul class=\"list-group list-group-flush stats\">\n              <li class=\"list-group-item\">Points:\n                <span>{{pstats.pPoints}} / {{total_rounds}}</span>\n              </li>\n              <li class=\"list-group-item\">Rank:\n                <span>{{pstats.pRank}} </span>\n              </li>\n              <li class=\"list-group-item\">Highest Score:\n                <span>{{pstats.pHiScore}}</span> (rd <em>{{pstats.pHiScoreRounds}}</em>)\n              </li>\n              <li class=\"list-group-item\">Lowest Score:\n                <span>{{pstats.pLoScore}}</span> (rd <em>{{pstats.pLoScoreRounds}}</em>)\n              </li>\n              <li class=\"list-group-item\">Ave Score:\n                <span>{{pstats.pAve}}</span>\n              </li>\n              <li class=\"list-group-item\">Ave Opp Score:\n                <span>{{pstats.pAveOpp}}</span>\n              </li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!---- Round By Round Results -->\n        <b-collapse id=\"collapse2\">\n          <b-card class=\"animated fadeInUp\">\n            <h4>Round By Round Summary </h4>\n            <ul class=\"list-group list-group-flush\" v-for=\"(report, i) in pstats.pRbyR\" :key=\"i\">\n              <li v-html=\"report.report\" v-if=\"report.result=='win'\" class=\"list-group-item list-group-item-success\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='draw'\"\n                class=\"list-group-item list-group-item-warning\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='loss'\"\n                class=\"list-group-item list-group-item-danger\">{{report.report}}</li>\n              <li v-html=\"report.report\" v-else-if=\"report.result =='awaiting'\" class=\"list-group-item list-group-item-info\">\n                {{report.report}}</li>\n              <li v-html=\"report.report\" v-else class=\"list-group-item list-group-item-light\">{{report.report}}</li>\n            </ul>\n          </b-card>\n        </b-collapse>\n        <!-- Charts -->\n        <b-collapse id=\"collapse3\">\n          <b-card class=\"animated fadeInDown\">\n            <div class=\"card-header text-center\">Stats Charts</div>\n            <div class=\"d-flex align-items-center justify-content-center\">\n              <div>\n                <b-button @click=\"updateChart('mixed')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                   :disabled=\"chartModel=='mixed'\"\n                   :pressed=\"chartModel=='mixed'\"><i class=\"fas fa-file-csv\"\n                    aria-hidden=\"true\"></i> Mixed Scores</b-button>\n                <b-button @click=\"updateChart('rank')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='rank'\" :pressed=\"chartModel=='rank'\"><i class=\"fas fa-chart-line\"\n                    aria-hidden=\"true\"></i> Rank per Rd</b-button>\n                <b-button @click=\"updateChart('wins')\" variant=\"link\" class=\"text-decoration-none ml-1\"\n                  :disabled=\"chartModel=='wins'\" :pressed=\"chartModel=='wins'\"><i class=\"fas fa-balance-scale fa-stack\"\n                    aria-hidden=\"true\"></i> Starts/Replies Wins(%)</b-button>\n              </div>\n            </div>\n            <div id=\"chart\">\n              <apexchart v-if=\"chartModel=='mixed'\" type=line height=400 :options=\"chartOptions\"                :series=\"seriesMixed\" />\n              <apexchart v-if=\"chartModel=='rank'\" type='line' height=400 :options=\"chartOptionsRank\"\n                :series=\"seriesRank\" />\n              <apexchart v-if=\"chartModel=='wins'\" type=radialBar height=400 :options=\"chartOptRadial\"\n                :series=\"seriesRadial\" />\n            </div>\n          </b-card>\n        </b-collapse>\n      </div>\n    </div>\n  </div>\n  ",
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var StatsProfile = Vue.component('stats_profile', {
  template: "\n  <div class=\"row\">\n  <div class=\"col-10 offset-1 justify-content-center align-items-center\">\n    <div class=\"row\">\n      <div class=\"col-12 d-flex justify-content-center align-items-center\">\n        <b-button @click=\"view='profile'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='profile'\" :pressed=\"view ==='profile'\" title=\"Player Profile\">\n        <b-icon icon=\"person\"></b-icon>Profile</b-button>\n        <b-button @click=\"view='head2head'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='head2head'\" :pressed=\"view ==='head2head'\" title=\"Head To Head\">\n        <b-icon icon=\"people-fill\"></b-icon>H2H</b-button>\n      </div>\n    </div>\n\n    <h3 v-if=\"view ==='profile'\" class=\"bebas mb-2\">\n    <b-icon icon=\"person\"></b-icon> Stats Profile</h3>\n    <h3 class=\"mb-2 bebas\" v-if=\"view ==='head2head'\">\n    <b-icon icon=\"people-fill\"></b-icon> Head to Head</h3>\n\n    <template v-if=\"view ==='profile'\">\n      <div v-if=\"view ==='profile' && (all_players.length <=0)\" class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n          <b-spinner variant=\"primary\" style=\"width: 6rem; height: 6rem;\" label=\"Loading players\"></b-spinner>\n      </div>\n      <div v-else class=\"my-5 mx-auto w-75 d-md-flex flex-md-row align-items-center justify-content-center\">\n        <div class=\"mr-md-3 mb-sm-2\">\n          <label for=\"search\">Player name:</label>\n        </div>\n        <div class=\"ml-md-2 flex-grow-1\">\n          <vue-simple-suggest\n          v-model=\"psearch\"\n          display-attribute=\"player\"\n          value-attribute=\"slug\"\n          @select=\"getprofile\"\n          :styles=\"autoCompleteStyle\"\n          :destyled=true\n          :filter-by-query=true\n          :list=\"all_players\"\n          placeholder=\"Player name here\"\n          id=\"search\"\n          type=\"search\">\n          </vue-simple-suggest>\n        </div>\n      </div>\n      <div v-show=\"loading\">\n        <div class=\"d-flex flex-md-row-reverse my-2 justify-content-center align-items-center\">\n        <span class=\"text-success\" v-show=\"psearch && !notfound\">Searching <em>{{psearch}}</em>...</span>\n        <span class=\"text-danger\" v-show=\"psearch && notfound\"><em>{{psearch}}</em> not found!</span>\n        <b-spinner v-show=\"!notfound\" style=\"width: 6rem; height: 6rem;\" type=\"grow\" variant=\"success\" label=\"Busy\"></b-spinner>\n        </div>\n      </div>\n      <div v-if=\"pdata.player\" class=\"p-2 mx-auto d-md-flex flex-md-row align-items-start justify-content-around\">\n          <div v-show=\"psearch ===pdata.player && !notfound\" class=\"d-flex flex-column text-center align-items-center animated fadeIn\">\n          <h4>Profile Summary</h4>\n            <h5 class=\"oswald\">{{pdata.player}}\n            <span class=\"d-inline-block mx-auto p-2\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+pdata.country |lowercase\" title=\"pdata.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }\" aria-hidden=\"true\"></i>\n            </span>\n            </h5>\n            <img :src='pdata.photo' :alt=\"pdata.player\" v-bind=\"imgProps\"></img>\n            <div class=\"text-uppercase text-left\" style=\"font-size:0.9em;\">\n              <div v-if=\"pdata.total_tourneys\" class=\"lead text-center\">{{pdata.total_tourneys | pluralize('tourney',{ includeNumber: true })}}\n              </div>\n              <div v-else class=\"lead text-center\">No rated competition</div>\n              <div class=\"d-block text-primary font-weight-light\">\n               Tourney <span class=\"text-capitalize\">(All Time)</span> Honors:\n                <ul class=\"list-inline\">\n                  <li title=\"First Prize\" class=\"list-inline-item goldcol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(1)}}</span>\n                  </li>\n                  <li title=\"Second Prize\" class=\"list-inline-item silvercol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(2)}}</span>\n                  </li>\n                  <li title=\"Third Prize\" class=\"list-inline-item bronzecol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(3)}}</span>\n                  </li>\n                </ul>\n              </div>\n              <template v-if=\"pdata.total_games\">\n              <span class=\"d-block text-info font-weight-light text-capitalize\">{{pdata.total_games | pluralize('game',{ includeNumber: true })}}</span>\n              <span  class=\"d-block text-success font-weight-light text-capitalize\">{{pdata.total_wins | pluralize('win',{ includeNumber: true })}} <em>({{pdata.percent_wins}}%)</em></span>\n              <span class=\"d-block text-warning font-weight-light text-capitalize\"> {{pdata.total_draws | pluralize('draw',{ includeNumber: true })}}</span>\n              <span  class=\"d-block text-danger font-weight-light text-capitalize\"> {{pdata.total_losses | pluralize(['loss','losses'],{ includeNumber: true })}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Score: {{pdata.ave_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Opponents Score: {{pdata.ave_opp_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Cum. Mar: {{pdata.ave_margin}}</span>\n              </template>\n              <template v-else>\n              <span class=\"d-block text-info font-weight-light text-capitalize\">No Stats Available</span>\n              </template>\n            </div>\n          </div>\n        <div>\n          <div v-show=\"!loading\">\n          <h4 title=\"Performance summary per tourney\">Competitions</h4>\n            <template v-if=\"pdata.competitions\">\n            <div class=\"p-1 mb-1 bg-light\" v-for=\"(c, tindex) in pdata.competitions\" :key=\"c.id\">\n              <h5 class=\"oswald text-left\">{{c.title}}\n              <b-badge title=\"Final Rank\">{{c.final_rd.rank}}</b-badge></h5>\n                  <button class=\"btn btn-link text-decoration-none\" type=\"button\" title=\"Click to view player scoresheet for this event\">\n                  <router-link :to=\"{ name:'Scoresheet', params:{  event_slug:c.slug, pno:c.final_rd.pno}}\">\n                  <b-icon icon=\"documents-alt\"></b-icon> Scorecard\n                  </router-link>\n                  </button>\n                  <b-button class=\"text-decoration-none\" variant=\"link\" v-b-toggle=\"collapse+tindex+1\" title=\"Click to toggle player stats for this event\">\n                  <b-icon icon=\"bar-chart-fill\" variant=\"success\" flip-h></b-icon>Statistics\n                  </b-button>\n                  <b-collapse :id=\"collapse+tindex+1\">\n                    <div class=\"card card-body\">\n                    <h6 class=\"oswald\">{{c.final_rd.player}} Event Stats Summary</h6>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Points: {{c.final_rd.points}}/{{c.final_rd.round}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Final Pos: {{c.final_rd.position}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item text-success font-weight-light text-capitalize\">\n                        Won: {{c.final_rd.wins}}\n                      </li>\n                      <li class=\"list-inline-item text-warning font-weight-light text-capitalize\">\n                        Drew: {{c.final_rd.draws}}\n                      </li>\n                      <li class=\"list-inline-item text-danger font-weight-light text-capitalize\">\n                        Lost: {{c.final_rd.losses}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Score: {{c.final_rd.ave_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Opp. Score: {{c.final_rd.ave_opp_score}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Score: {{c.final_rd.total_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Opp. Score: {{c.final_rd.total_oppscore}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Margin: {{c.final_rd.margin}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li :class=\"{'text-success': c.final_rd.result == 'win','text-warning': c.final_rd.result == 'draw',\n                      'text-danger': c.final_rd.result == 'loss'}\"\n                      class=\"list-inline-item font-weight-light\">\n                      Final game was a {{c.final_rd.score}} - {{c.final_rd.oppo_score}} {{c.final_rd.result}} (a difference of {{c.final_rd.diff|addplus}}) against {{c.final_rd.oppo}}\n                      </li>\n                    </ul>\n                  </div>\n                </b-collapse>\n            </div>\n          </template>\n          <template v-else>\n            <div class=\"p-1 mb-1 bg-light\">No Competition so far!</div>\n          </template>\n          </div>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n      <p>Coming Soon!</p>\n      </div>\n     <!-- <b-form-row class=\"my-1\">\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label for=\"search1\">Player 1</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input placeholder=\"Start typing player name\" size=\"sm\" id=\"search1\" v-model=\"search1\" type=\"search\"></b-form-input>\n        </b-col>\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label class=\"ml-2\" for=\"search2\">Player 2</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input size=\"sm\" placeholder=\"Start typing player name\" id=\"search2\" v-model=\"search2\" type=\"search\"></b-form-input>\n        </b-col>\n      </b-form-row>\n      <b-row cols=\"4\">\n        <b-col></b-col>\n        <b-col>{{search1}}</b-col>\n        <b-col></b-col>\n        <b-col>{{search2}}</b-col>\n      </b-row>\n      -->\n    </template>\n  </div>\n</div>\n  ",
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
  computed: _objectSpread(_objectSpread({}, Vuex.mapGetters({
    all_players: 'ALL_PLAYERS',
    all_players_tou: 'ALL_PLAYERS_TOU_DATA'
  })), {}, {
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  computed: _objectSpread(_objectSpread({}, Vuex.mapGetters({
    result_data: 'RESULTDATA',
    players: 'PLAYERS',
    total_players: 'TOTALPLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    loading: 'LOADING',
    error: 'ERROR',
    category: 'CATEGORY'
  })), {}, {
    rowCount: function rowCount() {
      return Math.ceil(this.scoreboard_data.length / this.itemsPerRow);
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.pageurl, " ");
    }
  })
});
exports["default"] = Scoreboard;

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Scoresheet = Vue.component('scoreCard', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n    <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    </template>\n    <template v-else>\n    <div class=\"row no-gutters\">\n      <div class=\"col-12 justify-content-center align-items-center\">\n        <b-breadcrumb :items=\"breadcrumbs\" />\n      </div>\n    </div>\n    <div class=\"row justify-content-center align-items-center\">\n      <div class=\"col-12\">\n        <div class=\"d-flex\">\n          <b-img fluid thumbnail class=\"logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n          <h2 class=\"text-center bebas\">{{ event_title }}\n          <span class=\"text-center d-block\">Scorecards <i class=\"fas fa-clipboard\"></i></span>\n          </h2>\n        </div>\n      </div>\n    </div>\n    <div class=\"row justify-content-between\">\n      <div class=\"col-md-2 col-12\">\n      <!-- player list here -->\n        <ul class=\" p-2 mb-5 bg-white rounded\">\n          <li :key=\"player.pno\" v-for=\"player in pdata\" class=\"bebas\">\n          <span>{{player.pno}}</span> <b-img-lazy :alt=\"player.player\" :src=\"player.photo\" v-bind=\"picProps\"></b-img-lazy>\n            <b-button @click=\"getCard(player.pno)\" variant=\"link\">{{player.player}}</b-button>\n          </li>\n        </ul>\n      </div>\n      <div class=\"col-md-10 col-12\">\n      <template v-if=\"mPlayer\">\n        <h4 class=\"green\">Scorecard: <b-img :alt=\"mPlayer.player\" class=\"mx-2\" :src=\"mPlayer.photo\" style=\"width:60px; height:60px\"></b-img> {{mPlayer.player}}</h4>\n        <b-table responsive=\"md\" small hover foot-clone head-variant=\"light\" bordered table-variant=\"light\" :fields=\"fields\" :items=\"scorecard\" id=\"scorecard\" class=\"bebas shadow p-4 mx-auto\" style=\"width:90%; text-align:center; vertical-align: middle\">\n        <!-- A custom formatted column -->\n        <template v-slot:cell(round)=\"data\">\n          {{data.item.round}} <sup v-if=\"data.item.start =='y'\">*</sup>\n        </template>\n        <template v-slot:cell(oppo)=\"data\">\n          <small>#{{data.item.oppo_no}}</small><b-img-lazy :title=\"data.item.oppo\" :alt=\"data.item.oppo\" :src=\"data.item.opp_photo\" v-bind=\"picProps\"></b-img-lazy>\n          <b-button @click=\"getCard(data.item.oppo_no)\" variant=\"link\">\n              {{data.item.oppo|abbrv}}\n          </b-button>\n        </template>\n        <template v-slot:table-caption>\n          Scorecard: #{{mPlayer.pno}} {{mPlayer.player}}\n        </template>\n        </b-table>\n      </template>\n      </div>\n     </div>\n    </template>\n  </div>\n  ",
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
  computed: _objectSpread(_objectSpread({}, Vuex.mapGetters({
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
  })), {}, {
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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    categories_count: {},
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
    CATEGORIES_COUNT: function CATEGORIES_COUNT(state) {
      return state.categories_count;
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
    SET_CATEGORIES_COUNT: function SET_CATEGORIES_COUNT(state, payload) {
      state.categories_count = payload;
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
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
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
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
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
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
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
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
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
    FETCH_CATEGORIES: function FETCH_CATEGORIES(context, payload) {
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var url, response, data;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                url = "".concat(_config.baseURL, "t_category");
                _context5.next = 3;
                return axios.get(url);

              case 3:
                response = _context5.sent;

                try {
                  data = response.data;
                  context.commit('SET_CATEGORIES_COUNT', data);
                } catch (err) {
                  context.commit('SET_ERROR', err.toString());
                }

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    FETCH_API: function FETCH_API(context, payload) {
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var url, response, headers, data;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config.baseURL, "tournament"); // let token = context.getters.ACCESS_TOKEN

                _context6.next = 4;
                return axios.get(url, {
                  params: {
                    page: payload.page,
                    t_category: payload.category
                  } // headers: {'Authorization': `Bearer  ${token}`}

                });

              case 4:
                response = _context6.sent;

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
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
        var url, response, headers, data, startDate;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config.baseURL, "tournament");
                _context7.prev = 2;
                _context7.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context7.sent;
                headers = response.headers;
                data = response.data[0];
                startDate = data.start_date;
                data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_DETAIL_LAST_ACCESS_TIME', headers.date);
                context.commit('SET_EVENTDETAIL', data);
                context.commit('SET_LOADING', false);
                _context7.next = 20;
                break;

              case 16:
                _context7.prev = 16;
                _context7.t0 = _context7["catch"](2);
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', _context7.t0.toString());

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[2, 16]]);
      }))();
    },
    FETCH_DATA: function FETCH_DATA(context, payload) {
      return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
        var url, response, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds, rating_stats;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                context.commit('SET_LOADING', true); // console.log(context);

                url = "".concat(_config.baseURL, "t_data");
                _context8.prev = 2;
                _context8.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context8.sent;
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
                _context8.next = 36;
                break;

              case 32:
                _context8.prev = 32;
                _context8.t0 = _context8["catch"](2);
                context.commit('SET_ERROR', _context8.t0.toString());
                context.commit('SET_LOADING', false);

              case 36:
                ;

              case 37:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[2, 32]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Byb2ZpbGUuanMiLCJ2dWUvcGFnZXMvcmF0aW5nX3N0YXRzLmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc2NvcmVzaGVldC5qcyIsInZ1ZS9wYWdlcy9zdGF0cy5qcyIsInZ1ZS9wYWdlcy90b3AuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QkFBZixFQUFpQyxJQUFJLENBQUMsT0FBdEM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixJQUFJLENBQUMsT0FBbkM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixPQUE5QjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxZQUFmLEVBQTZCLE9BQTdCO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG9CQUFmLEVBQXFDLE9BQXJDO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsRUFBK0IsUUFBL0I7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsY0FBZixFQUErQixJQUEvQjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxtQkFBZixFQUFvQyxhQUFwQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxXQUFsQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxZQUFuQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxnQkFBZixFQUFpQyxXQUFqQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBQ0MsT0F0QkQsV0FzQlMsVUFBQSxLQUFLLEVBQUc7QUFDakIsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsS0FBSyxDQUFDLFFBQU4sRUFBNUI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBWjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBQ0QsT0ExQkM7QUEyQkw7QUF0T007QUEzVGtCLENBQWYsQ0FBZCxDLENBcWlCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywga2V5LCBhcmcpIHtcbiAgdHJ5IHtcbiAgICB2YXIgaW5mbyA9IGdlbltrZXldKGFyZyk7XG4gICAgdmFyIHZhbHVlID0gaW5mby52YWx1ZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWplY3QoZXJyb3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpbmZvLmRvbmUpIHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oX25leHQsIF90aHJvdyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX2FzeW5jVG9HZW5lcmF0b3IoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciBnZW4gPSBmbi5hcHBseShzZWxmLCBhcmdzKTtcblxuICAgICAgZnVuY3Rpb24gX25leHQodmFsdWUpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfdGhyb3coZXJyKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgfVxuXG4gICAgICBfbmV4dCh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9hc3luY1RvR2VuZXJhdG9yOyIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9ialtrZXldID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9kZWZpbmVQcm9wZXJ0eTsiLCJmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikge1xuICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgIFwiZGVmYXVsdFwiOiBvYmpcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIik7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBydW50aW1lID0gKGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQgYW5kIG91dGVyRm4ucHJvdG90eXBlIGlzIGEgR2VuZXJhdG9yLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBwcm90b0dlbmVyYXRvciA9IG91dGVyRm4gJiYgb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IgPyBvdXRlckZuIDogR2VuZXJhdG9yO1xuICAgIHZhciBnZW5lcmF0b3IgPSBPYmplY3QuY3JlYXRlKHByb3RvR2VuZXJhdG9yLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgZXhwb3J0cy53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgLy8gVGhpcyBpcyBhIHBvbHlmaWxsIGZvciAlSXRlcmF0b3JQcm90b3R5cGUlIGZvciBlbnZpcm9ubWVudHMgdGhhdFxuICAvLyBkb24ndCBuYXRpdmVseSBzdXBwb3J0IGl0LlxuICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcbiAgSXRlcmF0b3JQcm90b3R5cGVbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHZhciBnZXRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8gJiYgZ2V0UHJvdG8oZ2V0UHJvdG8odmFsdWVzKFtdKSkpO1xuICBpZiAoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgJiZcbiAgICAgIE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPcCAmJlxuICAgICAgaGFzT3duLmNhbGwoTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUsIGl0ZXJhdG9yU3ltYm9sKSkge1xuICAgIC8vIFRoaXMgZW52aXJvbm1lbnQgaGFzIGEgbmF0aXZlICVJdGVyYXRvclByb3RvdHlwZSU7IHVzZSBpdCBpbnN0ZWFkXG4gICAgLy8gb2YgdGhlIHBvbHlmaWxsLlxuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gTmF0aXZlSXRlcmF0b3JQcm90b3R5cGU7XG4gIH1cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPVxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID1cbiAgICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICAvLyBIZWxwZXIgZm9yIGRlZmluaW5nIHRoZSAubmV4dCwgLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzIG9mIHRoZVxuICAvLyBJdGVyYXRvciBpbnRlcmZhY2UgaW4gdGVybXMgb2YgYSBzaW5nbGUgLl9pbnZva2UgbWV0aG9kLlxuICBmdW5jdGlvbiBkZWZpbmVJdGVyYXRvck1ldGhvZHMocHJvdG90eXBlKSB7XG4gICAgW1wibmV4dFwiLCBcInRocm93XCIsIFwicmV0dXJuXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpYCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC5cbiAgZXhwb3J0cy5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiB7IF9fYXdhaXQ6IGFyZyB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yLCBQcm9taXNlSW1wbCkge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAvLyBJZiBhIHJlamVjdGVkIFByb21pc2Ugd2FzIHlpZWxkZWQsIHRocm93IHRoZSByZWplY3Rpb24gYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBzbyBpdCBjYW4gYmUgaGFuZGxlZCB0aGVyZS5cbiAgICAgICAgICByZXR1cm4gaW52b2tlKFwidGhyb3dcIiwgZXJyb3IsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlSW1wbChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QsIFByb21pc2VJbXBsKSB7XG4gICAgaWYgKFByb21pc2VJbXBsID09PSB2b2lkIDApIFByb21pc2VJbXBsID0gUHJvbWlzZTtcblxuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSxcbiAgICAgIFByb21pc2VJbXBsXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiY29uc3QgYmFzZVVSTCA9ICcvd3AtanNvbi93cC92Mi8nO1xyXG5jb25zdCBhdXRoVVJMID0gJy93cC1qc29uL2p3dC1hdXRoL3YxLyc7XHJcbmNvbnN0IHByb2ZpbGVVUkwgPSAnL3dwLWpzb24vdG91cy92MS9wbGF5ZXJzJztcclxuY29uc3Qgc3RhdHNVUkwgPSAnL3dwLWpzb24vdG91cy92MS9zdGF0cy8nO1xyXG5leHBvcnQgeyBiYXNlVVJMLCBhdXRoVVJMLCBwcm9maWxlVVJMLCBzdGF0c1VSTCAgfTtcclxuXHJcbiIsImltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlLmpzJztcclxuaW1wb3J0IHNjckxpc3QgZnJvbSAnLi9wYWdlcy9saXN0LmpzJztcclxuaW1wb3J0IHREZXRhaWwgZnJvbSAnLi9wYWdlcy9kZXRhaWwuanMnO1xyXG5pbXBvcnQgQ2F0ZURldGFpbCBmcm9tICcuL3BhZ2VzL2NhdGVnb3J5LmpzJztcclxuaW1wb3J0IHNDYXJkIGZyb20gJy4vcGFnZXMvc2NvcmVzaGVldC5qcyc7XHJcblxyXG5WdWUuZmlsdGVyKCdhYmJydicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiAgJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBmaXJzdCA9IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIHZhciBuID0gdmFsdWUudHJpbSgpLnNwbGl0KFwiIFwiKTtcclxuICB2YXIgbGFzdCA9IG5bbi5sZW5ndGggLSAxXTtcclxuICByZXR1cm4gZmlyc3QgKyBcIi4gXCIgKyBsYXN0O1xyXG59KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2ZpcnN0Y2hhcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pO1xyXG5cclxuVnVlLmZpbHRlcignYWRkcGx1cycsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiAnJztcclxuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgdmFyIG4gPSBNYXRoLmZsb29yKE51bWJlcih2YWx1ZSkpO1xyXG4gIGlmIChuICE9PSBJbmZpbml0eSAmJiBTdHJpbmcobikgPT09IHZhbHVlICYmIG4gPiAwKSB7XHJcbiAgICByZXR1cm4gJysnICsgdmFsdWU7XHJcbiAgfVxyXG4gIHJldHVybiB2YWx1ZTtcclxufSk7XHJcblxyXG5WdWUuZmlsdGVyKCdwcmV0dHknLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh2YWx1ZSksIG51bGwsIDIpO1xyXG59KTtcclxuXHJcbiAgY29uc3Qgcm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgIGNvbXBvbmVudDogc2NyTGlzdCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ05TRiBUb3VybmFtZW50cyAtIFJlc3VsdHMgYW5kIFN0YXRpc3RpY3MnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzLzpzbHVnJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IHREZXRhaWwsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdUb3VybmFtZW50IERldGFpbHMnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcnLFxyXG4gICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgIGNvbXBvbmVudDogQ2F0ZURldGFpbCxcclxuICAgICAgcHJvcHM6IHRydWUsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcvOnBubycsXHJcbiAgICAgIG5hbWU6ICdTY29yZXNoZWV0JyxcclxuICAgICAgY29tcG9uZW50OiBzQ2FyZCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ1BsYXllciBTY29yZWNhcmRzJyB9XHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbmNvbnN0IHJvdXRlciA9IG5ldyBWdWVSb3V0ZXIoe1xyXG4gIG1vZGU6ICdoaXN0b3J5JyxcclxuICByb3V0ZXM6IHJvdXRlcywgLy8gc2hvcnQgZm9yIGByb3V0ZXM6IHJvdXRlc2BcclxufSk7XHJcbnJvdXRlci5iZWZvcmVFYWNoKCh0bywgZnJvbSwgbmV4dCkgPT4ge1xyXG4gIGRvY3VtZW50LnRpdGxlID0gdG8ubWV0YS50aXRsZTtcclxuICBuZXh0KCk7XHJcbn0pO1xyXG5cclxubmV3IFZ1ZSh7XHJcbiAgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSxcclxuICByb3V0ZXIsXHJcbiAgbWl4aW5zOiBbVnVlMkZpbHRlcnMubWl4aW5dLFxyXG4gIHN0b3JlXHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBMb2FkaW5nQWxlcnQgPSBWdWUuY29tcG9uZW50KCdsb2FkaW5nJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgbWF4LXZ3LTc1IG10LTVcIj5cclxuXHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImxkcy1ibG9ja3MgbXQtNVwiIHdpZHRoPVwiMjAwcHhcIiAgaGVpZ2h0PVwiMjAwcHhcIiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwKSBub25lIHJlcGVhdCBzY3JvbGwgMCUgMCU7XCI+PHJlY3QgeD1cIjE5XCIgeT1cIjE5XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNDBcIiB5PVwiMTlcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuMTVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCIxOVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC4zc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiMTlcIiB5PVwiNDBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjEuMDVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCI0MFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC40NDk5OTk5OTk5OTk5OTk5NnNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjE5XCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjg5OTk5OTk5OTk5OTk5OTlzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI0MFwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC43NXNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjYxXCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjFzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjJzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgIDwvcmVjdD48L3N2Zz5cclxuICAgICAgIDxoNCBjbGFzcz1cImRpc3BsYXktMyBiZWJhcyB0ZXh0LWNlbnRlciB0ZXh0LXNlY29uZGFyeVwiPkxvYWRpbmcuLlxyXG4gICAgICAgIDwhLS0gPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nLi48L3NwYW4+XHJcbiAgICAgICAgLS0+XHJcbiAgICAgICA8L2g0PlxyXG4gICAgPC9kaXY+YFxyXG4gfSk7XHJcblxyXG52YXIgRXJyb3JBbGVydCA9VnVlLmNvbXBvbmVudCgnZXJyb3InLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbXQtNSBteC1hdXRvIGQtYmxvY2sgbWF4LXZ3LTc1XCIgcm9sZT1cImFsZXJ0XCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJhbGVydC1oZWFkaW5nIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8c2xvdCBuYW1lPVwiZXJyb3JcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5FcnJvci4uLjwvc3Bhbj5cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yX21zZ1wiPjwvc2xvdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gLFxyXG4gICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICByZXR1cm4ge307XHJcbiAgIH0sXHJcbiB9KTtcclxuIGxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG4gdmFyIExvZ2luRm9ybSA9VnVlLmNvbXBvbmVudCgnbG9naW4nLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvZ2luX3N1Y2Nlc3NcIiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtMiBweS0xXCI+PGkgY2xhc3M9XCJmYXMgZmEtdXNlci1hbHRcIj48L2k+IDxzbWFsbD5XZWxjb21lIHt7dXNlcl9kaXNwbGF5fX08L3NtYWxsPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LTIgcHktMVwiIEBjbGljaz1cImxvZ091dFwiPjxpIHN0eWxlPVwiY29sb3I6dG9tYXRvXCIgY2xhc3M9XCJmYXMgZmEtc2lnbi1vdXQtYWx0IFwiPjwvaT48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZT5cclxuICAgICAgICAgIDxiLWZvcm0gQHN1Ym1pdD1cIm9uU3VibWl0XCIgaW5saW5lIGNsYXNzPVwidy04MCBteC1hdXRvXCI+XHJcbiAgICAgICAgICA8Yi1mb3JtLWludmFsaWQtZmVlZGJhY2sgOnN0YXRlPVwidmFsaWRhdGlvblwiPlxyXG4gICAgICAgICAgICBZb3VyIHVzZXJuYW1lIG9yIHBhc3N3b3JkIG11c3QgYmUgbW9yZSB0aGFuIDEgY2hhcmFjdGVyIGluIGxlbmd0aC5cclxuICAgICAgICAgICAgPC9iLWZvcm0taW52YWxpZC1mZWVkYmFjaz5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInNyLW9ubHlcIiBmb3I9XCJpbmxpbmUtZm9ybS1pbnB1dC11c2VybmFtZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDxiLWlucHV0XHJcbiAgICAgICAgICBpZD1cImlubGluZS1mb3JtLWlucHV0LXVzZXJuYW1lXCIgcGxhY2Vob2xkZXI9XCJVc2VybmFtZVwiIDpzdGF0ZT1cInZhbGlkYXRpb25cIlxyXG4gICAgICAgICAgY2xhc3M9XCJtYi0yIG1yLXNtLTIgbWItc20tMCBmb3JtLWNvbnRyb2wtc21cIlxyXG4gICAgICAgICAgdi1tb2RlbD1cImZvcm0udXNlclwiID5cclxuICAgICAgICAgIDwvYi1pbnB1dD5cclxuICAgICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICA8Yi1pbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cImlubGluZS1mb3JtLWlucHV0LXBhc3N3b3JkXCIgOnN0YXRlPVwidmFsaWRhdGlvblwiIGNsYXNzPVwiZm9ybS1jb250cm9sLXNtXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIHYtbW9kZWw9XCJmb3JtLnBhc3NcIj48L2ItaW5wdXQ+XHJcbiAgICAgICAgICA8L2ItaW5wdXQtZ3JvdXA+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwib3V0bGluZS1kYXJrXCIgc2l6ZT1cInNtXCIgdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWwtc20tMlwiPlxyXG4gICAgICAgICAgICA8aSAgOmNsYXNzPVwieydmYS1zYXZlJyA6IGxvZ2luX2xvYWRpbmcgPT0gZmFsc2UsICdmYS1zcGlubmVyIGZhLXB1bHNlJzogbG9naW5fbG9hZGluZyA9PSB0cnVlfVwiIGNsYXNzPVwiZmFzXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9iLWZvcm0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZm9ybToge1xyXG4gICAgICAgIHBhc3M6JycsXHJcbiAgICAgICAgdXNlcjogJydcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgIH0sXHJcbiAgIG1vdW50ZWQoKSB7XHJcbiAgICBpZih0aGlzLmFjY2Vzcy5sZW5ndGggPiAwKVxyXG4gICAge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnQVVUSF9UT0tFTicsIHRoaXMuYWNjZXNzKTtcclxuICAgICB9XHJcbiAgICAgY29uc29sZS5sb2codGhpcy51c2VyX2Rpc3BsYXkpXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBvblN1Ym1pdChldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkodGhpcy5mb3JtKSk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19MT0dJTicsIHRoaXMuZm9ybSk7XHJcbiAgICB9LFxyXG4gICAgbG9nT3V0KCkge1xyXG4gICAgICAvLyAgbG9nb3V0IGZ1bmN0aW9uXHJcbiAgICAgIGNvbnNvbGUubG9nKCdDbGlja2VkIGxvZ091dCcpO1xyXG4gICAgfVxyXG4gICB9LFxyXG4gICBjb21wdXRlZDoge1xyXG4gICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICAgbG9naW5fbG9hZGluZzogJ0xPR0lOX0xPQURJTkcnLFxyXG4gICAgICAgbG9naW5fc3VjY2VzczogJ0xPR0lOX1NVQ0NFU1MnLFxyXG4gICAgICAgdXNlcl9kaXNwbGF5OiAnVVNFUicsXHJcbiAgICAgICBhY2Nlc3M6ICdBQ0NFU1NfVE9LRU4nXHJcbiAgICAgfSksXHJcblxyXG4gICAgIHZhbGlkYXRpb24oKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmZvcm0udXNlci5sZW5ndGggPiAxICYmIHRoaXMuZm9ybS5wYXNzLmxlbmd0aCA+IDFcclxuICAgIH0sXHJcbiAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQsIExvZ2luRm9ybSB9O1xyXG5cclxuIiwiaW1wb3J0IHsgUGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c30gZnJvbSAnLi9wbGF5ZXJsaXN0LmpzJztcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0IHsgSGlXaW5zLCBMb1dpbnMsIEhpTG9zcywgQ29tYm9TY29yZXMsIFRvdGFsU2NvcmVzLCBUb3RhbE9wcFNjb3JlcywgQXZlU2NvcmVzLCBBdmVPcHBTY29yZXMsIEhpU3ByZWFkLCBMb1NwcmVhZCB9IGZyb20gJy4vc3RhdHMuanMnO1xyXG5pbXBvcnQgU3RhdHNQcm9maWxlIGZyb20gJy4vcHJvZmlsZS5qcyc7XHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vc2NvcmVib2FyZC5qcyc7XHJcbmltcG9ydCBSYXRpbmdTdGF0cyBmcm9tICcuL3JhdGluZ19zdGF0cy5qcyc7XHJcbmltcG9ydCB0b3BQZXJmb3JtZXJzIGZyb20gJy4vdG9wLmpzJztcclxuZXhwb3J0IHsgQ2F0ZURldGFpbCBhcyBkZWZhdWx0IH07XHJcbmxldCBDYXRlRGV0YWlsID0gVnVlLmNvbXBvbmVudCgnY2F0ZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cIiEoZXJyb3J8fGxvYWRpbmcpXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwidmlld0luZGV4ICE9OCAmJiB2aWV3SW5kZXggIT01XCIgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLTBcIj5cclxuICAgICAgICAgICAgICAgICAgPGItaW1nIGZsdWlkIHRodW1ibmFpbCBjbGFzcz1cImxvZ29cIiA6c3JjPVwibG9nb1wiIDphbHQ9XCJldmVudF90aXRsZVwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwidG90YWxfcm91bmRzKyAnIHJvdW5kcywgJyArIHRvdGFsX3BsYXllcnMgKycgcGxheWVycydcIiB2LXNob3c9XCJ0b3RhbF9yb3VuZHNcIiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj57eyB0b3RhbF9yb3VuZHMgfX0gR2FtZXMge3sgdG90YWxfcGxheWVyc319IDxpIGNsYXNzPVwiZmFzIGZhLXVzZXJzXCI+PC9pPiA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTBcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTBcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MFwiPjxpIGNsYXNzPVwiZmEgZmEtdXNlcnNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFBsYXllcnM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0xXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0xXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTFcIj4gPGkgY2xhc3M9XCJmYSBmYS11c2VyLXBsdXNcIj48L2k+IFBhaXJpbmdzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MlwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0yXCI+PGItaWNvbiBpY29uPVwiZG9jdW1lbnQtdGV4dFwiPjwvYi1pY29uPiBSZXN1bHRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlJvdW5kLUJ5LVJvdW5kIFN0YW5kaW5nc1wiIEBjbGljaz1cInZpZXdJbmRleD0zXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0zXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTNcIj48Yi1pY29uIGljb249XCJsaXN0LW9sXCI+PC9iLWljb24+IFN0YW5kaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDYXRlZ29yeSBTdGF0aXN0aWNzXCIgQGNsaWNrPVwidmlld0luZGV4PTRcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTRcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NFwiPjxiLWljb24gaWNvbj1cImJhci1jaGFydC1maWxsXCI+PC9iLWljb24+IFN0YXRpc3RpY3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgIGV2ZW50X3NsdWc6c2x1ZywgcG5vOjF9fVwiPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiPjxiLWljb24gaWNvbj1cImRvY3VtZW50cy1hbHRcIj48L2ItaWNvbj4gU2NvcmVjYXJkczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUm91bmQtQnktUm91bmQgU2NvcmVib2FyZFwiIEBjbGljaz1cInZpZXdJbmRleD01XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTVcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NVwiPjxiLWljb24gaWNvbj1cImRpc3BsYXlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFNjb3JlYm9hcmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiVG9wIDMgUGVyZm9ybWFuY2VzXCIgQGNsaWNrPVwidmlld0luZGV4PTZcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT02XCI+PGItaWNvbiBpY29uPVwiYXdhcmRcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFRvcCBQZXJmb3JtZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlBvc3QtdG91cm5leSBSYXRpbmcgU3RhdGlzdGljc1wiIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9N1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT03XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTdcIj5cclxuICAgICAgICAgICAgICAgIDxiLWljb24gaWNvbj1cImdyYXBoLXVwXCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBSYXRpbmcgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiUGxheWVyIFByb2ZpbGUgYW5kIFN0YXRpc3RpY3NcIiAgQGNsaWNrPVwidmlld0luZGV4PThcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09OFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT04XCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJ0cm9waHlcIj48L2ItaWNvbj5cclxuICAgICAgICAgICAgICAgIFByb2ZpbGUgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMSBjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtblwiPlxyXG4gICAgICAgICAgICAgIDxoMyBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzIHAtMCBtLTBcIj4ge3t0YWJfaGVhZGluZ319XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInZpZXdJbmRleCA+MCAmJiB2aWV3SW5kZXggPCA0XCI+XHJcbiAgICAgICAgICAgICAge3sgY3VycmVudFJvdW5kIH19XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJzaG93UGFnaW5hdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCJ0b3RhbF9yb3VuZHNcIiB2LW1vZGVsPVwiY3VycmVudFJvdW5kXCIgOnBlci1wYWdlPVwiMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cInRydWVcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIGNoYW5nZT1cInJvdW5kQ2hhbmdlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvYi1wYWdpbmF0aW9uPlxyXG4gICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTBcIj5cclxuICAgICAgICAgIDxhbGxwbGF5ZXJzIDpzbHVnPVwic2x1Z1wiPjwvYWxscGxheWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT02XCI+XHJcbiAgICAgICAgICA8cGVyZm9ybWVycz48L3BlcmZvcm1lcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09N1wiPlxyXG4gICAgICAgICAgPHJhdGluZ3MgOmNhcHRpb249XCJjYXB0aW9uXCIgOmNvbXB1dGVkX2l0ZW1zPVwiY29tcHV0ZWRfcmF0aW5nX2l0ZW1zXCI+XHJcbiAgICAgICAgICA8L3JhdGluZ3M+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09OFwiPlxyXG4gICAgICAgICAgIDxwcm9maWxlcz48L3Byb2ZpbGVzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTVcIj5cclxuICAgICAgICA8c2NvcmVib2FyZCA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCI+PC9zY29yZWJvYXJkPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTRcIiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMCBjb2xcIj5cclxuICAgICAgICAgICAgICAgIDxiLXRhYnMgY29udGVudC1jbGFzcz1cIm10LTMgc3RhdHNUYWJzXCIgcGlsbHMgc21hbGwgbGF6eSBuby1mYWRlICB2LW1vZGVsPVwidGFiSW5kZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGl3aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaXdpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIExvc3Nlc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaWxvc3MgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGlsb3NzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG93aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sb3dpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJDb21iaW5lZCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbWJvc2NvcmVzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbWJvc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0b3RhbHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9zY29yZScpXCI+PC90b3RhbHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9vcHBzY29yZScpXCI+PC9vcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX3Njb3JlJylcIj48L2F2ZXNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX29wcHNjb3JlJylcIj48L2F2ZW9wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggU3ByZWFkcyBcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlzcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9oaXNwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBTcHJlYWRzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvbG9zcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgIDwvYi10YWJzPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggb2Zmc2V0LW1kLTIgY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8cGFpcmluZ3MgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTFcIj48L3BhaXJpbmdzPlxyXG4gICAgICAgICAgICAgICAgPHJlc3VsdHMgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiIHYtaWY9XCJ2aWV3SW5kZXg9PTJcIj48L3Jlc3VsdHM+XHJcbiAgICAgICAgICAgICAgICA8c3RhbmRpbmdzIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIiB2LWlmPVwidmlld0luZGV4PT0zXCI+PC9zdGFuZGluZ3M+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgYWxscGxheWVyczogUGxheWVyTGlzdCxcclxuICAgIHBhaXJpbmdzOiBQYWlyaW5ncyxcclxuICAgIHJlc3VsdHM6IFJlc3VsdHMsXHJcbiAgICByYXRpbmdzOiBSYXRpbmdTdGF0cyxcclxuICAgIHN0YW5kaW5nczogU3RhbmRpbmdzLFxyXG4gICAgaGl3aW5zOiBIaVdpbnMsXHJcbiAgICBoaWxvc3M6IEhpTG9zcyxcclxuICAgIGxvd2luOiBMb1dpbnMsXHJcbiAgICBjb21ib3Njb3JlczogQ29tYm9TY29yZXMsXHJcbiAgICB0b3RhbHNjb3JlczogVG90YWxTY29yZXMsXHJcbiAgICBvcHBzY29yZXM6IFRvdGFsT3BwU2NvcmVzLFxyXG4gICAgYXZlc2NvcmVzOiBBdmVTY29yZXMsXHJcbiAgICBhdmVvcHBzY29yZXM6IEF2ZU9wcFNjb3JlcyxcclxuICAgIGhpc3ByZWFkOiBIaVNwcmVhZCxcclxuICAgIGxvc3ByZWFkOiBMb1NwcmVhZCxcclxuICAgIC8vICdsdWNreXN0aWZmLXRhYmxlJzogTHVja3lTdGlmZlRhYmxlLFxyXG4gICAgLy8gJ3R1ZmZsdWNrLXRhYmxlJzogVHVmZkx1Y2tUYWJsZVxyXG4gICAgc2NvcmVib2FyZDogU2NvcmVib2FyZCxcclxuICAgIHBlcmZvcm1lcnM6IHRvcFBlcmZvcm1lcnMsXHJcbiAgICBwcm9maWxlczogU3RhdHNQcm9maWxlXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBpc0FjdGl2ZTogZmFsc2UsXHJcbiAgICAgIGdhbWVkYXRhOiBbXSxcclxuICAgICAgdGFiSW5kZXg6IDAsXHJcbiAgICAgIHZpZXdJbmRleDogMCxcclxuICAgICAgY3VycmVudFJvdW5kOiAxLFxyXG4gICAgICB0YWJfaGVhZGluZzogJycsXHJcbiAgICAgIGNhcHRpb246ICcnLFxyXG4gICAgICBzaG93UGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgIGNvbXB1dGVkX3JhdGluZ19pdGVtczogW10sXHJcbiAgICAgIGx1Y2t5c3RpZmY6IFtdLFxyXG4gICAgICB0dWZmbHVjazogW10sXHJcbiAgICAgIHRpbWVyOiAnJyxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3SW5kZXg6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBpZiAodmFsICE9IDQpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Vmlldyh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJhdGluZ19zdGF0czoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRWaWV3OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRWaWV3IGZ1bmN0aW9uIHZhbC0+ICcgKyB2YWwpO1xyXG4gICAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGxheWVycyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQYWlyaW5nIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcqUGxheXMgZmlyc3QnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1Jlc3VsdHMgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1Jlc3VsdHMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1N0YW5kaW5ncyBhZnRlciBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnU3RhbmRpbmdzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSBudWxsO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQb3N0IFRvdXJuYW1lbnQgUmF0aW5nIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhdGluZyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gbnVsbDtcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5X3RpdGxlLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICBzbHVnOiB0aGlzLnRvdXJuZXlfc2x1ZyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAvL3RleHQ6IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KSxcclxuICAgICAgICAgIC8vIGxldCBjYXRlZ29yeSA9IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KTtcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0ICBiYXNlVVJMICBmcm9tICcuLi9jb25maWcuanMnO1xyXG5leHBvcnQge3REZXRhaWwgYXMgZGVmYXVsdH07XHJcbi8vIGxldCBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQ7XHJcbmxldCB0RGV0YWlsID0gVnVlLmNvbXBvbmVudCgndGRldGFpbCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnJlYWRjcnVtYiA6aXRlbXM9XCJicmVhZGNydW1ic1wiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInAtMyB0ZXh0LWNlbnRlciBkLWZsZXggZmxleC1jb2x1bW4gZmxleC1sZy1yb3cgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1sZy1jZW50ZXIganVzdGlmeS1jb250ZW50LXN0YXJ0XCI+XHJcbiAgICAgICAgICAgIDxiLWltZyBmbHVpZCB0aHVtYm5haWwgc2xvdD1cImFzaWRlXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIiBjbGFzcz1cImFsaWduLXNlbGYtY2VudGVyIG1yLTEgbG9nby1tZWRpdW1cIlxyXG4gICAgICAgICAgICAgIDpzcmM9XCJ0b3VybmV5LmV2ZW50X2xvZ29cIiA6YWx0PVwidG91cm5leS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgPGgzIGNsYXNzPVwibXgtMVwiPlxyXG4gICAgICAgICAgICAgIHt7dG91cm5leS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTIgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyXCIgaWQ9XCJldmVudC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnN0YXJ0X2RhdGVcIj48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnN0YXJ0X2RhdGV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnZlbnVlXCI+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiB7e3RvdXJuZXkudmVudWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaWY9XCJ0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3JcIj48aSBjbGFzcz1cImZhIGZhLWxlZ2FsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3J9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxoNT5cclxuICAgICAgICAgICAgICBDYXRlZ29yaWVzIDxpIGNsYXNzPVwiZmEgZmEtbGlzdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtZm9yPVwiKGNhdCwgYykgaW4gdG91cm5leS50b3VfY2F0ZWdvcmllc1wiIDprZXk9XCJjXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImNhdC5ldmVudF9pZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnQ2F0ZURldGFpbCcsIHBhcmFtczogeyAgZXZlbnRfc2x1ZzpjYXQuZXZlbnRfc2x1ZyB9fVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPnt7Y2F0LmNhdF9uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e3tjYXQuY2F0X25hbWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9kaXY+XHJcbiAgICAgICBgLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgcGFnZXVybDogYCR7YmFzZVVSTH10b3VybmFtZW50YCArIHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3RoaXMudG91cm5leS50aXRsZX0gYDtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICBpZiAodGhpcy50b3VybmV5LnNsdWcgIT0gdGhpcy5zbHVnKSB7XHJcbiAgICAgICAgLy8gcmVzZXQgdGl0bGUgYmVjYXVzZSBvZiBicmVhZGNydW1ic1xyXG4gICAgICAgIHRoaXMudG91cm5leS50aXRsZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBlID0gdGhpcy50b3VsaXN0LmZpbmQoZXZlbnQgPT4gZXZlbnQuc2x1ZyA9PT0gdGhpcy5zbHVnKTtcclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICBsZXQgbm93ID0gbW9tZW50KCk7XHJcbiAgICAgICAgY29uc3QgYSA9IG1vbWVudCh0aGlzLmxhc3RfYWNjZXNzX3RpbWUpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVfZWxhcHNlZCA9IG5vdy5kaWZmKGEsICdzZWNvbmRzJyk7XHJcbiAgICAgICAgaWYgKHRpbWVfZWxhcHNlZCA8IDMwMCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS1NYXRjaCBGb3VuZCBpbiBUb3VybmV5IExpc3QtLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHRpbWVfZWxhcHNlZCk7XHJcbiAgICAgICAgICB0aGlzLnRvdXJuZXkgPSBlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIC8vIHRvdXJuZXk6ICdERVRBSUwnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBsYXN0X2FjY2Vzc190aW1lOiAnVE9VQUNDRVNTVElNRScsXHJcbiAgICAgIHRvdWxpc3Q6ICdUT1VBUEknXHJcbiAgICB9KSxcclxuICAgIHRvdXJuZXk6IHtcclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHN0b3JlLmdldHRlcnMuREVUQUlMO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5jb21taXQoJ1NFVF9FVkVOVERFVEFJTCcsIG5ld1ZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBicmVhZGNydW1iczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ05TRiBOZXdzJyxcclxuICAgICAgICAgIGhyZWY6ICcvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leS50aXRsZSxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMuIFBsZWFzZSByZWZyZXNoIHRvIHRyeSBhZ2FpbiBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcblxyXG4iLCJsZXQgbWFwR2V0dGVycyA9IFZ1ZXgubWFwR2V0dGVycztcclxuLy8gbGV0IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydDtcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxubGV0IHNjckxpc3QgPSBWdWUuY29tcG9uZW50KCdzY3JMaXN0Jywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzcz1cImJlYmFzIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT4gVG91cm5hbWVudHNcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWFyb3VuZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgbXktNCBteC0xXCIgdGl0bGU9XCJBbGwgdG91cm5leXNcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInRhZ2J1dHRvbiBidG4gYnRuLWxpZ2h0XCIgIDpjbGFzcz1cInsnYWN0aXZlJzowID09PSBhY3RpdmVMaXN0fVwiIEBjbGljaz1cImZldGNoTGlzdChjdXJyZW50UGFnZSlcIj4gQWxsIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZGFya1wiPlxyXG4gICAgICAgICAgICAgIHt7dG90YWxfdG91cm5leXN9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHYtZm9yPVwiY2F0IGluIGNhdGVnb3JpZXNcIiAgOmtleT1cImNhdC5pZFwiXHJcbiAgICAgICAgICAgIGNsYXNzPVwidGV4dC1jZW50ZXIgbXktNCBteC0xXCIgdi1pZj1cImNhdC5jb3VudD4wXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgQGNsaWNrPVwiZmlsdGVyQ2F0KGNhdC5pZClcIiBjbGFzcz1cInRhZ2J1dHRvbiBidG4gYnRuLWxpZ2h0XCIgOmNsYXNzPVwie1xyXG4gICAgICAgICAgICAgICdhY3RpdmUnOmNhdC5zbHVnID09PSAnZ2VuZXJhbCcsXHJcbiAgICAgICAgICAgICAgJ2FjdGl2ZSc6Y2F0LnNsdWcgPT09ICdvcGVuJyxcclxuICAgICAgICAgICAgICAnYWN0aXZlJzpjYXQuc2x1ZyA9PT0gJ2ludGVybWVkaWF0ZScsXHJcbiAgICAgICAgICAgICAgJ2FjdGl2ZSc6Y2F0LnNsdWcgPT09ICdtYXN0ZXJzJyxcclxuICAgICAgICAgICAgICAnYWN0aXZlJzpjYXQuc2x1ZyA9PT0gJ2xhZGllcycsXHJcbiAgICAgICAgICAgICAgJ2FjdGl2ZSc6Y2F0LnNsdWcgPT09ICd2ZXRlcmFucycsXHJcbiAgICAgICAgICAgICAgJ2FjdGl2ZSc6Y2F0LmlkID09PSBhY3RpdmVMaXN0LFxyXG4gICAgICAgICAgICAgIH1cIj4ge3tjYXQubmFtZX19IDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZGFya1wiPiB7e2NhdC5jb3VudH19IDwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LXN0YXJ0IGFsaWduLWNvbnRlbnRzLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC1sZy1yb3cganVzdGlmeS1jb250ZW50LWFyb3VuZCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGItcGFnaW5hdGlvbiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+PHNtYWxsPllvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXMuIFRoZXJlIGFyZSA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPiB0b3RhbCAoPGVtPnt7YWN0aXZlQ2F0fX08L2VtPikgdG91cm5hbWVudHMhPC9zbWFsbD48L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiA6a2V5PVwiaXRlbS5pZFwiIGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiIHYtZm9yPVwiaXRlbSBpbiB0b3VybmV5c1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IG1iLTQgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1sZy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciB0b3VybmV5LWxpc3QgYW5pbWF0ZWQgYm91bmNlSW5MZWZ0XCIgPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy0wXCI+XHJcbiAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgPGItaW1nIDpzcmM9XCJpdGVtLmV2ZW50X2xvZ29cIiA6YWx0PVwiaXRlbS5ldmVudF9sb2dvX3RpdGxlXCIgZmx1aWQgIHJvdW5kZWQ9XCJjaXJjbGVcIiBjbGFzcz1cImxvZ29cIi8+PC9yb3V0ZXItbGluaz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibWwtbGctMyBtYi0yXCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJtYi0xXCI+XHJcbiAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiIHYtaWY9XCJpdGVtLnNsdWdcIj5cclxuICAgICAgICAgICAgICB7e2l0ZW0udGl0bGV9fVxyXG4gICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgdG91LWRldGFpbHNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgIDxzbWFsbD48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICB7e2l0ZW0uc3RhcnRfZGF0ZX19XHJcbiAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICA8c21hbGw+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICB7e2l0ZW0udmVudWV9fVxyXG4gICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIiB2LWlmPVwiaXRlbS5zbHVnXCI+XHJcbiAgICAgICAgICAgICAgICA8c21hbGwgdGl0bGU9XCJCcm93c2UgdG91cm5leVwiPjxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZWdvcnktbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBteC0xXCJcclxuICAgICAgICAgICAgICAgIHYtZm9yPVwiY2F0ZWdvcnkgaW4gaXRlbS50b3VfY2F0ZWdvcmllc1wiPnt7Y2F0ZWdvcnkuY2F0X25hbWV9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtc3RhcnQgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIj5cclxuICAgICAgICAgIDxiLXBhZ2luYXRpb24gOnRvdGFsLXJvd3M9XCIrV1B0b3RhbFwiIEBjaGFuZ2U9XCJmZXRjaExpc3RcIiB2LW1vZGVsPVwiY3VycmVudFBhZ2VcIiA6cGVyLXBhZ2U9XCIxMFwiXHJcbiAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiAvPlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+PHNtYWxsPllvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXMuIFRoZXJlIGFyZSA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPiB0b3RhbCAoPGVtPnt7YWN0aXZlQ2F0fX08L2VtPikgdG91cm5hbWVudHMhPC9zbWFsbD48L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIGFjdGl2ZUxpc3Q6IDAsXHJcbiAgICAgIGFjdGl2ZUNhdDogJ2FsbCcsXHJcbiAgICB9O1xyXG4gICAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdC5qcyBsb2FkZWQnKVxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnU2NyYWJibGUgVG91cm5hbWVudHMgLSBOU0YnO1xyXG4gICAgdGhpcy5mZXRjaExpc3QodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaExpc3Q6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2VOdW07XHJcbiAgICAgIGxldCBwYXJhbXMgPSB7fTtcclxuICAgICAgcGFyYW1zLnBhZ2UgPSBwYWdlTnVtO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFyYW1zKTtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0NBVEVHT1JJRVMnKTtcclxuICAgICAgY29uc29sZS5sb2coJ2RvbmUhJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWN0aXZlTGlzdCwgdGhpcy5hY3RpdmVDYXQpO1xyXG4gICAgfSxcclxuICAgIGZpbHRlckNhdDogZnVuY3Rpb24oY2F0X2lkKXtcclxuICAgICAgdGhpcy5hY3RpdmVMaXN0ID0gY2F0X2lkO1xyXG4gICAgICBsZXQgYSA9IHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoYyA9PiBjLmlkID09IGNhdF9pZCk7XHJcbiAgICAgIHRoaXMuYWN0aXZlQ2F0ID0gYVswXS5uYW1lO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmFjdGl2ZUxpc3QsIHRoaXMuYWN0aXZlQ2F0KTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHt9O1xyXG4gICAgICBwYXJhbXMucGFnZSA9IDE7XHJcbiAgICAgIHBhcmFtcy5jYXRlZ29yeSA9IGNhdF9pZCA7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9BUEknLCBwYXJhbXMpO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQ0FURUdPUklFUycpO1xyXG4gICAgfVxyXG5cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgY2F0ZWdvcmllczogJ0NBVEVHT1JJRVNfQ09VTlQnLFxyXG4gICAgICB0b3VybmV5czogJ1RPVUFQSScsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIFdQdG90YWw6ICdXUFRPVEFMJyxcclxuICAgICAgV1BwYWdlczogJ1dQUEFHRVMnLFxyXG4gICAgfSksXHJcbiAgICB0b3RhbF90b3VybmV5czogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgIGxldCBjID0gdGhpcy5jYXRlZ29yaWVzO1xyXG4gICAgICAgbGV0IHQgPSBjLnJlZHVjZSgodG90YWwsIGNhdCkgPT5cclxuICAgICAgICB0b3RhbCArIGNhdC5jb3VudCwgMCk7XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9LFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFNvcnJ5IHdlIGFyZSBjdXJyZW50bHkgaGF2aW5nIHRyb3VibGUgZmluZGluZyB0aGUgbGlzdCBvZiB0b3VybmFtZW50cy5gO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHNjckxpc3Q7IiwidmFyIHBsYXllcl9taXhlZF9zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3Jhbmtfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzID0gW10gIDtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnID0ge1xyXG4gIHBsb3RPcHRpb25zOiB7XHJcbiAgICByYWRpYWxCYXI6IHtcclxuICAgICAgaG9sbG93OiB7IHNpemU6ICc1MCUnLCB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG59O1xyXG5cclxudmFyIHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBjaGFydDoge1xyXG4gICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB6b29tOiB7XHJcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgc2hhZG93OiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHRvcDogMTgsXHJcbiAgICAgIGxlZnQ6IDcsXHJcbiAgICAgIGJsdXI6IDEwLFxyXG4gICAgICBvcGFjaXR5OiAxXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbJyM3N0I2RUEnLCAnIzU0NTQ1NCddLFxyXG4gIGRhdGFMYWJlbHM6IHtcclxuICAgIGVuYWJsZWQ6IHRydWVcclxuICB9LFxyXG4gIHN0cm9rZToge1xyXG4gICAgY3VydmU6ICdzbW9vdGgnIC8vIHN0cmFpZ2h0XHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgdGV4dDogJycsXHJcbiAgICBhbGlnbjogJ2xlZnQnXHJcbiAgfSxcclxuICBncmlkOiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgcm93OiB7XHJcbiAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICBvcGFjaXR5OiAwLjVcclxuICAgIH0sXHJcbiAgfSxcclxuICB4YXhpczoge1xyXG4gICAgY2F0ZWdvcmllczogW10sXHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgeWF4aXM6IHtcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgbWluOiBudWxsLFxyXG4gICAgbWF4OiBudWxsXHJcbiAgfSxcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgb2Zmc2V0WDogLTVcclxuICB9XHJcbn07XHJcblxyXG52YXIgUGxheWVyU3RhdHMgPSBWdWUuY29tcG9uZW50KCdwbGF5ZXJzdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluTGVmdEJpZ1wiIGlkPVwicGhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXNcIj57e3BsYXllck5hbWV9fVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBpbWctZmx1aWQgbXgtMyBkLWJsb2NrIHNoYWRvdy1zbVwiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwicGxheWVyLnBob3RvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgeWFub25lIG14LTNcIj57e3BzdGF0cy5wUG9zaXRpb259fSBwb3NpdGlvbjwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+IDwhLS0gI3BoZWFkZXItLT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UxIGNsYXNzPVwibS0xXCI+UXVpY2sgU3RhdHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UyIGNsYXNzPVwibS0xXCI+Um91bmQgYnkgUm91bmQgPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMyBjbGFzcz1cIm0tMVwiPkNoYXJ0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDbG9zZVwiIHNpemU9XCJzbVwiIEBjbGljaz1cImNsb3NlQ2FyZCgpXCIgY2xhc3M9XCJtLTFcIiB2YXJpYW50PVwib3V0bGluZS1kYW5nZXJcIiA6ZGlzYWJsZWQ9XCIhc2hvd1wiXHJcbiAgICAgICAgICAgIDpwcmVzc2VkLnN5bmM9XCJzaG93XCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTFcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlF1aWNrIFN0YXRzPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaCBzdGF0c1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlBvaW50czpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBQb2ludHN9fSAvIHt7dG90YWxfcm91bmRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5SYW5rOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFJhbmt9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5IaWdoZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEhpU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wSGlTY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBMb1Njb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBPcHAgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlT3BwfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tLS0gUm91bmQgQnkgUm91bmQgUmVzdWx0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMlwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgIDxoND5Sb3VuZCBCeSBSb3VuZCBTdW1tYXJ5IDwvaDQ+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaFwiIHYtZm9yPVwiKHJlcG9ydCwgaSkgaW4gcHN0YXRzLnBSYnlSXCIgOmtleT1cImlcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtaWY9XCJyZXBvcnQucmVzdWx0PT0nd2luJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2RyYXcnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS13YXJuaW5nXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdsb3NzJ1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tZGFuZ2VyXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdhd2FpdGluZydcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1saWdodFwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tIENoYXJ0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlM1wiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkRvd25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+U3RhdHMgQ2hhcnRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdtaXhlZCcpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiXHJcbiAgICAgICAgICAgICAgICAgICA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIj48aSBjbGFzcz1cImZhcyBmYS1maWxlLWNzdlwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBNaXhlZCBTY29yZXM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdyYW5rJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3JhbmsnXCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtbGluZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBSYW5rIHBlciBSZDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ3dpbnMnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nd2lucydcIj48aSBjbGFzcz1cImZhcyBmYS1iYWxhbmNlLXNjYWxlIGZhLXN0YWNrXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFN0YXJ0cy9SZXBsaWVzIFdpbnMoJSk8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXJ0XCI+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiIHR5cGU9bGluZSBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zXCIgICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc01peGVkXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0ncmFuaydcIiB0eXBlPSdsaW5lJyBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zUmFua1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzUmFua1wiIC8+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgdHlwZT1yYWRpYWxCYXIgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0UmFkaWFsXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYWRpYWxcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHByb3BzOiBbJ3BzdGF0cyddLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGFwZXhjaGFydDogVnVlQXBleENoYXJ0cyxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBsYXllcjogJycsXHJcbiAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgIHBsYXllck5hbWU6ICcnLFxyXG4gICAgICBhbGxTY29yZXM6IFtdLFxyXG4gICAgICBhbGxPcHBTY29yZXM6IFtdLFxyXG4gICAgICBhbGxSYW5rczogW10sXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICAgIGNoYXJ0TW9kZWw6ICdyYW5rJyxcclxuICAgICAgc2VyaWVzTWl4ZWQ6IHBsYXllcl9taXhlZF9zZXJpZXMsXHJcbiAgICAgIHNlcmllc1Jhbms6IHBsYXllcl9yYW5rX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFkaWFsOiBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyxcclxuICAgICAgY2hhcnRPcHRSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnLFxyXG4gICAgICBjaGFydE9wdGlvbnNSYW5rOiBwbGF5ZXJfcmFua19jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uczoge1xyXG4gICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcclxuICAgICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzaGFkb3c6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDAwJyxcclxuICAgICAgICAgICAgdG9wOiAxOCxcclxuICAgICAgICAgICAgbGVmdDogNyxcclxuICAgICAgICAgICAgYmx1cjogMTAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yczogWycjOEZCQzhGJywgJyM1NDU0NTQnXSxcclxuICAgICAgICBkYXRhTGFiZWxzOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgIGN1cnZlOiAnc3RyYWlnaHQnIC8vIHNtb290aFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgYWxpZ246ICdsZWZ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgICAgICAgIHJvdzoge1xyXG4gICAgICAgICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeGF4aXM6IHtcclxuICAgICAgICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1pbjogbnVsbCxcclxuICAgICAgICAgIG1heDogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICAgICAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgICAgICAgIG9mZnNldFk6IC0yNSxcclxuICAgICAgICAgIG9mZnNldFg6IC01XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRvU2Nyb2xsKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvd1N0YXRzO1xyXG4gICAgdGhpcy5hbGxTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsT3BwU2NvcmVzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbE9wcFNjb3Jlcyk7XHJcbiAgICB0aGlzLmFsbFJhbmtzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbFJhbmtzKTtcclxuICAgIHRoaXMudXBkYXRlQ2hhcnQodGhpcy5jaGFydE1vZGVsKTtcclxuICAgIHRoaXMudG90YWxfcGxheWVycyA9IHRoaXMucGxheWVycy5sZW5ndGg7XHJcbiAgICB0aGlzLnBsYXllciA9IHRoaXMucHN0YXRzLnBsYXllclswXTtcclxuICAgIHRoaXMucGxheWVyTmFtZSA9IHRoaXMucGxheWVyLnBvc3RfdGl0bGU7XHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95KCkge1xyXG4gICAgdGhpcy5jbG9zZUNhcmQoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuXHJcbiAgICBkb1Njcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxyXG4gICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtteUZ1bmN0aW9uKCl9O1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhlYWRlclwiKTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcclxuICAgICAgdmFyIHN0aWNreSA9IGhlYWRlci5vZmZzZXRUb3A7XHJcbiAgICAgIHZhciBoID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDUwO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IChzdGlja3kgKyBoKSkge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBzZXRDaGFydENhdGVnb3JpZXM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCByb3VuZHMgPSBfLnJhbmdlKDEsIHRoaXMudG90YWxfcm91bmRzICsgMSk7XHJcbiAgICAgIGxldCByZHMgPSBfLm1hcChyb3VuZHMsIGZ1bmN0aW9uKG51bSl7IHJldHVybiAnUmQgJysgbnVtOyB9KTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMueGF4aXMuY2F0ZWdvcmllcyA9IHJkcztcclxuICAgIH0sXHJcbiAgICB1cGRhdGVDaGFydDogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLVVwZGF0aW5nLi4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLmNoYXJ0TW9kZWwgPSB0eXBlO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS5hbGlnbiA9ICdsZWZ0JztcclxuICAgICAgdmFyIGZpcnN0TmFtZSA9IF8udHJpbShfLnNwbGl0KHRoaXMucGxheWVyTmFtZSwgJyAnLCAyKVswXSk7XHJcbiAgICAgIGlmICgncmFuaycgPT0gdHlwZSkge1xyXG4gICAgICAgIC8vIHRoaXMuID0gJ2Jhcic7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnRpdGxlLnRleHQgPWBSYW5raW5nOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5taW4gPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5tYXggPXRoaXMudG90YWxfcGxheWVycztcclxuICAgICAgICB0aGlzLnNlcmllc1JhbmsgPSBbe1xyXG4gICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfSByYW5rIHRoaXMgcmRgLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxSYW5rc1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCdtaXhlZCcgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2hhcnRDYXRlZ29yaWVzKClcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS50ZXh0ID0gYFNjb3JlczogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5taW4gPSAxMDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWF4ID0gOTAwO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzTWl4ZWQgPSBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX1gLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmFsbFNjb3Jlc1xyXG4gICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnT3Bwb25lbnQnLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxPcHBTY29yZXNcclxuICAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ3dpbnMnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscz0gW107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMgPVtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzLnVuc2hpZnQoJ1N0YXJ0czogJSBXaW5zJywnUmVwbGllczogJSBXaW5zJyk7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMudW5zaGlmdCgnIzdDRkMwMCcsICcjQkRCNzZCJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGFydE9wdFJhZGlhbCk7XHJcbiAgICAgICAgdmFyIHMgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5zdGFydFdpbnMgLyB0aGlzLnBzdGF0cy5zdGFydHMpLDEpO1xyXG4gICAgICAgIHZhciByID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMucmVwbHlXaW5zIC8gdGhpcy5wc3RhdHMucmVwbGllcyksMSk7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwgPSBbXTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbC51bnNoaWZ0KHMscik7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZXJpZXNSYWRpYWwpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgY2xvc2VDYXJkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLUNsb3NpbmcgQ2FyZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsIGZhbHNlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHNob3dTdGF0czogJ1NIT1dTVEFUUycsXHJcbiAgICB9KSxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG52YXIgUGxheWVyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ2FsbHBsYXllcnMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dTdGF0c1wiPlxyXG4gICAgICAgIDxwbGF5ZXJzdGF0cyA6cHN0YXRzPVwicFN0YXRzXCI+PC9wbGF5ZXJzdGF0cz5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgPGRpdiBpZD1cInAtbGlzdFwiIGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICA8dHJhbnNpdGlvbi1ncm91cCB0YWc9XCJkaXZcIiBuYW1lPVwicGxheWVycy1saXN0XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGxheWVyQ29scyBteC0yIHAtMiBtYi00XCIgdi1mb3I9XCJwbGF5ZXIgaW4gZGF0YVwiIDprZXk9XCJwbGF5ZXIuaWRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCI+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm9zd2FsZFwiPjxzbWFsbD4je3twbGF5ZXIucG5vfX08L3NtYWxsPlxyXG4gICAgICAgICAgICB7e3BsYXllci5wbGF5ZXJ9fTxzcGFuIGNsYXNzPVwibWwtMlwiIEBjbGljaz1cInNvcnRQb3MoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSB2LWlmPVwiYXNjXCIgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBERVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48aSB2LWVsc2UgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtdXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHNvcnQgQVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48L3NwYW4+PHNwYW4gdi1pZj1cInNvcnRlZFwiIGNsYXNzPVwibWwtM1wiIEBjbGljaz1cInJlc3RvcmVTb3J0KClcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC1zaXplOjAuOGVtXCI+PGkgY2xhc3M9XCJmYSBmYS11bmRvXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byByZXNldCBsaXN0XCI+PC9pPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG8gbXktMVwiICBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm14LWF1dG8gZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCIgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PSAnbScsXHJcbiAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLFxyXG4gICAgICAgICdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImNvbG9yOnRvbWF0bzsgZm9udC1zaXplOjEuNGVtXCIgY2xhc3M9XCJtbC01XCIgdi1pZj1cInNvcnRlZFwiPnt7cGxheWVyLnBvc2l0aW9ufX08L3NwYW4+XHJcbiAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWJsb2NrIHRleHQtY2VudGVyIGFuaW1hdGVkIGZhZGVJbiBwZ2FsbGVyeVwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgbXQtMiBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gQGNsaWNrPVwic2hvd1BsYXllclN0YXRzKHBsYXllci5pZClcIiB0aXRsZT1cIlNob3cgIHN0YXRzXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYmFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1sLTRcIiB0aXRsZT1cIlNob3cgU2NvcmVjYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayBleGFjdCA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzpwbGF5ZXIucG5vfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8IS0tLXBvcG92ZXIgLS0+XHJcbiAgICAgICAgICAgICAgPGItcG9wb3ZlciBAc2hvdz1cImdldExhc3RHYW1lcyhwbGF5ZXIucG5vKVwiIHBsYWNlbWVudD1cImJvdHRvbVwiICA6dGFyZ2V0PVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIiB0cmlnZ2Vycz1cImhvdmVyXCIgYm91bmRhcnktcGFkZGluZz1cIjVcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC13cmFwIGFsaWduLWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1zdGFydCBtci0yIGp1c3RpZnktY29udGVudC1hcm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LWdyb3ctMSBhbGlnbi1zZWxmLWNlbnRlclwiIHN0eWxlPVwiZm9udC1zaXplOjEuNWVtO1wiPnt7bXN0YXQucG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LXNocmluay0xIGQtaW5saW5lLWJsb2NrIHRleHQtbXV0ZWRcIj48c21hbGw+e3ttc3RhdC53aW5zfX0te3ttc3RhdC5kcmF3c319LXt7bXN0YXQubG9zc2VzfX08L3NtYWxsPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5IGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC44ZW07IHRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmVcIj5MYXN0IEdhbWU6IFJvdW5kIHt7bXN0YXQucm91bmR9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMSB0ZXh0LXdoaXRlIHNkYXRhLXJlcyB0ZXh0LWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBtc3RhdC5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2F3YWl0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogbXN0YXQucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBtc3RhdC5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7e21zdGF0LnNjb3JlfX0te3ttc3RhdC5vcHBvX3Njb3JlfX0gKHt7bXN0YXQucmVzdWx0fGZpcnN0Y2hhcn19KVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cIm1zdGF0Lm9wcF9waG90b1wiIDphbHQ9XCJtc3RhdC5vcHBvXCIgY2xhc3M9XCJyb3VuZGVkLWNpcmNsZSBtLWF1dG8gZC1pbmxpbmUtYmxvY2tcIiB3aWR0aD1cIjI1XCIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZS1ibG9ja1wiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+PHNtYWxsPiN7e21zdGF0Lm9wcG9fbm99fSB7e21zdGF0Lm9wcG98YWJicnZ9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9iLXBvcG92ZXI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC90cmFuc2l0aW9uLWdyb3VwPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIHBsYXllcnN0YXRzOiBQbGF5ZXJTdGF0cyxcclxuICB9LFxyXG4gIHByb3BzOiBbJ3NsdWcnXSxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwU3RhdHM6IHt9LFxyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgICBibG9jazogdHJ1ZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICc3MHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICc3MHB4JyxcclxuICAgICAgICBzdHlsZTogJ2N1cnNvcjogcG9pbnRlcicsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgICBkYXRhRmxhdDoge30sXHJcbiAgICAgIG1zdGF0OiB7fSxcclxuICAgICAgZGF0YToge30sXHJcbiAgICAgIHNvcnRlZDogZmFsc2UsXHJcbiAgICAgIGFzYzogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHJlc3VsdGRhdGEgPSB0aGlzLnJlc3VsdF9kYXRhO1xyXG4gICAgdGhpcy5kYXRhRmxhdCA9IF8uZmxhdHRlbkRlZXAoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICB0aGlzLmRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1EQVRBLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldExhc3RHYW1lczogZnVuY3Rpb24gKHRvdV9ubykge1xyXG4gICAgICBjb25zb2xlLmxvZyh0b3Vfbm8pXHJcbiAgICAgIGxldCBjID0gXy5jbG9uZSh0aGlzLmRhdGFGbGF0KTtcclxuICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oYylcclxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICByZXR1cm4gdi5wbm8gPT09IHRvdV9ubztcclxuICAgICAgICB9KS50YWtlUmlnaHQoKS52YWx1ZSgpO1xyXG4gICAgICB0aGlzLm1zdGF0ID0gXy5maXJzdChyZXMpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1zdGF0KVxyXG4gICAgfSxcclxuICAgIHNvcnRQb3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFzYyA9ICF0aGlzLmFzYztcclxuICAgICAgY29uc29sZS5sb2coJ1NvcnRpbmcuLicpO1xyXG4gICAgICBsZXQgc29ydERpciA9ICdhc2MnO1xyXG4gICAgICBpZiAoZmFsc2UgPT0gdGhpcy5hc2MpIHtcclxuICAgICAgICBzb3J0RGlyID0gJ2Rlc2MnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0ZWQgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncmFuaycsIHNvcnREaXIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzb3J0ZWQpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBzb3J0ZWQ7XHJcbiAgICB9LFxyXG4gICAgcmVzdG9yZVNvcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hc2MgPSB0cnVlO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncG5vJywgJ2FzYycpO1xyXG4gICAgfSxcclxuICAgIHNob3dQbGF5ZXJTdGF0czogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnQ09NUFVURV9QTEFZRVJfU1RBVFMnLCBpZCk7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBsYXllciA9IHRoaXMucGxheWVyO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlT3BwID0gdGhpcy5sYXN0ZGF0YS5hdmVfb3BwX3Njb3JlO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlID0gdGhpcy5sYXN0ZGF0YS5hdmVfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYW5rID0gdGhpcy5sYXN0ZGF0YS5yYW5rO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9zaXRpb24gPSB0aGlzLmxhc3RkYXRhLnBvc2l0aW9uO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9pbnRzID0gdGhpcy5sYXN0ZGF0YS5wb2ludHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaU9wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb09wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFJhbmtzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsUmFua3M7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFNjb3JlcyA9IHRoaXMucGxheWVyX3N0YXRzLmFsbFNjb3JlcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsT3BwU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUmJ5UiA9IHRoaXMucGxheWVyX3N0YXRzLnBSYnlSO1xyXG4gICAgICB0aGlzLnBTdGF0cy5zdGFydFdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5zdGFydFdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0cyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0cztcclxuICAgICAgdGhpcy5wU3RhdHMucmVwbHlXaW5zID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBsaWVzID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbGllcztcclxuXHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgcmVzdWx0X2RhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiAnVE9UQUxQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgc2hvd1N0YXRzOiAnU0hPV1NUQVRTJyxcclxuICAgICAgbGFzdGRhdGE6ICdMQVNUUkREQVRBJyxcclxuICAgICAgcGxheWVyZGF0YTogJ1BMQVlFUkRBVEEnLFxyXG4gICAgICBwbGF5ZXI6ICdQTEFZRVInLFxyXG4gICAgICBwbGF5ZXJfc3RhdHM6ICdQTEFZRVJfU1RBVFMnXHJcbiAgICB9KSxcclxuXHJcbiAgfVxyXG59KTtcclxuXHJcbiB2YXIgUmVzdWx0cyA9IFZ1ZS5jb21wb25lbnQoJ3Jlc3VsdHMnLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSBob3ZlciBzdGFja2VkPVwic21cIiBzdHJpcGVkIGZvb3QtY2xvbmUgOmZpZWxkcz1cInJlc3VsdHNfZmllbGRzXCIgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCIgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3VsdHNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVzdWx0c19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGxhYmVsOiAnIycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgLy8geyBrZXk6ICdwb3NpdGlvbicsbGFiZWw6ICdQb3NpdGlvbicsJ2NsYXNzJzondGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1Njb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdPcHBvbmVudCcgfSxcclxuICAgICAgLy8geyBrZXk6ICdvcHBfcG9zaXRpb24nLCBsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOiAndGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcHBvX3Njb3JlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdkaWZmJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJy0nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdDogZnVuY3Rpb24ocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YVtyb3VuZF0pO1xyXG5cclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3cucG9zaXRpb247XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHIucmVzdWx0O1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXSA9IFtdO1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbnZhciBTdGFuZGluZ3MgPSBWdWUuY29tcG9uZW50KCdzdGFuZGluZ3MnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBzdGFja2VkPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiA6ZmllbGRzPVwic3RhbmRpbmdzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicmFua1wiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5yYW5rfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwbGF5ZXJcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucGxheWVyfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ3b25Mb3N0XCI+PC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJtYXJnaW5cIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUubWFyZ2lufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJsYXN0R2FtZVwiPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhbmRpbmdzX2ZpZWxkczogW10sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzI1cHgnLFxyXG4gICAgICAgIGhlaWdodDogJzI1cHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc3RhbmRpbmdzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV2luLURyYXctTG9zcycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ud2luc30gLSAke2l0ZW0uZHJhd3N9IC0gJHtpdGVtLmxvc3Nlc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdwb2ludHMnLFxyXG4gICAgICAgIGxhYmVsOiAnUG9pbnRzJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5hciA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSpgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbGFzdEdhbWUnLFxyXG4gICAgICAgIGxhYmVsOiAnTGFzdCBHYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBpdGVtLnNjb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5vcHBvX3Njb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5yZXN1bHQgPT0gJ2F3YWl0aW5nJ1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgQXdhaXRpbmcgcmVzdWx0IG9mIGdhbWUgJHtpdGVtLnJvdW5kfSB2cyAke2l0ZW0ub3Bwb31gO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBgYSAke2l0ZW0uc2NvcmV9LSR7aXRlbS5vcHBvX3Njb3JlfVxyXG4gICAgICAgICAgICAke2l0ZW0ucmVzdWx0LnRvVXBwZXJDYXNlKCl9IHZzICR7aXRlbS5vcHBvfSBgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0KHIpIHtcclxuICAgICAgbGV0IHJvdW5kID0gciAtIDE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGFbcm91bmRdKTtcclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3dbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJbJ3Jlc3VsdCddO1xyXG5cclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ10gPSBbXTtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2luZm8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5zb3J0QnkoJ21hcmdpbicpXHJcbiAgICAgICAgLnNvcnRCeSgncG9pbnRzJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgUGFpcmluZ3MgPVZ1ZS5jb21wb25lbnQoJ3BhaXJpbmdzJywgIHtcclxuICB0ZW1wbGF0ZTogYFxyXG48dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1yZXNwb25zaXZlIHRhYmxlLXN0cmlwZWQgIGFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICA8Y2FwdGlvbj57e2NhcHRpb259fTwvY2FwdGlvbj5cclxuICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWRhcmtcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+UGxheWVyPC90aD5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5PcHBvbmVudDwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGhlYWQ+XHJcbiAgICA8dGJvZHk+XHJcbiAgICAgICAgPHRyIHYtZm9yPVwiKHBsYXllcixpKSBpbiBwYWlyaW5nKGN1cnJlbnRSb3VuZClcIiA6a2V5PVwiaVwiPlxyXG4gICAgICAgIDx0aCBzY29wZT1cInJvd1wiPnt7aSArIDF9fTwvdGg+XHJcbiAgICAgICAgPHRkIDppZD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIj48L2ItaW1nLWxhenk+PHN1cCB2LWlmPVwicGxheWVyLnN0YXJ0ID09J3knXCI+Kjwvc3VwPnt7cGxheWVyLnBsYXllcn19PC90ZD5cclxuICAgICAgICA8dGQgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIub3BwX2lkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLm9wcG9cIiA6c3JjPVwicGxheWVyLm9wcF9waG90b1wiPjwvYi1pbWctbGF6eT48c3VwICB2LWlmPVwicGxheWVyLnN0YXJ0ID09J24nXCI+Kjwvc3VwPnt7cGxheWVyLm9wcG99fTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGJvZHk+XHJcbiAgPC90YWJsZT5cclxuYCxcclxuXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICBzdHlsZTonbWFyZ2luLXJpZ2h0Oi41ZW0nLFxyXG4gICAgICAgIHdpZHRoOiAnMjVweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMjVweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLy8gZ2V0IHBhaXJpbmdcclxuICAgIHBhaXJpbmcocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IHJvdW5kX3JlcyA9IHRoaXMucmVzdWx0ZGF0YVtyb3VuZF07XHJcbiAgICAgIC8vIFNvcnQgYnkgcGxheWVyIG51bWJlcmluZyBpZiByb3VuZCAxIHRvIG9idGFpbiByb3VuZCAxIHBhaXJpbmdcclxuICAgICAgaWYgKHIgPT09IDEpIHtcclxuICAgICAgICByb3VuZF9yZXMgPSBfLnNvcnRCeShyb3VuZF9yZXMsICdwbm8nKTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgcGFpcmVkX3BsYXllcnMgPSBbXTtcclxuICAgICAgbGV0IHJwID0gXy5tYXAocm91bmRfcmVzLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IHJbJ3BubyddO1xyXG4gICAgICAgIGxldCBvcHBvbmVudCA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICBpZiAoXy5pbmNsdWRlcyhwYWlyZWRfcGxheWVycywgcGxheWVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgcGFpcmVkX3BsYXllcnMucHVzaChvcHBvbmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jb21wYWN0KHJwKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQge1BhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHN9XHJcblxyXG4iLCJleHBvcnQgeyBTdGF0c1Byb2ZpbGUgYXMgZGVmYXVsdCB9O1xyXG5sZXQgU3RhdHNQcm9maWxlID0gVnVlLmNvbXBvbmVudCgnc3RhdHNfcHJvZmlsZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLTEwIG9mZnNldC0xIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXc9J3Byb2ZpbGUnXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3ID09PSdwcm9maWxlJ1wiIDpwcmVzc2VkPVwidmlldyA9PT0ncHJvZmlsZSdcIiB0aXRsZT1cIlBsYXllciBQcm9maWxlXCI+XHJcbiAgICAgICAgPGItaWNvbiBpY29uPVwicGVyc29uXCI+PC9iLWljb24+UHJvZmlsZTwvYi1idXR0b24+XHJcbiAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXc9J2hlYWQyaGVhZCdcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXcgPT09J2hlYWQyaGVhZCdcIiA6cHJlc3NlZD1cInZpZXcgPT09J2hlYWQyaGVhZCdcIiB0aXRsZT1cIkhlYWQgVG8gSGVhZFwiPlxyXG4gICAgICAgIDxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+SDJIPC9iLWJ1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8aDMgdi1pZj1cInZpZXcgPT09J3Byb2ZpbGUnXCIgY2xhc3M9XCJiZWJhcyBtYi0yXCI+XHJcbiAgICA8Yi1pY29uIGljb249XCJwZXJzb25cIj48L2ItaWNvbj4gU3RhdHMgUHJvZmlsZTwvaDM+XHJcbiAgICA8aDMgY2xhc3M9XCJtYi0yIGJlYmFzXCIgdi1pZj1cInZpZXcgPT09J2hlYWQyaGVhZCdcIj5cclxuICAgIDxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+IEhlYWQgdG8gSGVhZDwvaDM+XHJcblxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3ID09PSdwcm9maWxlJ1wiPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJ2aWV3ID09PSdwcm9maWxlJyAmJiAoYWxsX3BsYXllcnMubGVuZ3RoIDw9MClcIiBjbGFzcz1cIm15LTUgbXgtYXV0byBkLWZsZXggZmxleC1yb3cgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLXNwaW5uZXIgdmFyaWFudD1cInByaW1hcnlcIiBzdHlsZT1cIndpZHRoOiA2cmVtOyBoZWlnaHQ6IDZyZW07XCIgbGFiZWw9XCJMb2FkaW5nIHBsYXllcnNcIj48L2Itc3Bpbm5lcj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwibXktNSBteC1hdXRvIHctNzUgZC1tZC1mbGV4IGZsZXgtbWQtcm93IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1yLW1kLTMgbWItc20tMlwiPlxyXG4gICAgICAgICAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPlBsYXllciBuYW1lOjwvbGFiZWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1sLW1kLTIgZmxleC1ncm93LTFcIj5cclxuICAgICAgICAgIDx2dWUtc2ltcGxlLXN1Z2dlc3RcclxuICAgICAgICAgIHYtbW9kZWw9XCJwc2VhcmNoXCJcclxuICAgICAgICAgIGRpc3BsYXktYXR0cmlidXRlPVwicGxheWVyXCJcclxuICAgICAgICAgIHZhbHVlLWF0dHJpYnV0ZT1cInNsdWdcIlxyXG4gICAgICAgICAgQHNlbGVjdD1cImdldHByb2ZpbGVcIlxyXG4gICAgICAgICAgOnN0eWxlcz1cImF1dG9Db21wbGV0ZVN0eWxlXCJcclxuICAgICAgICAgIDpkZXN0eWxlZD10cnVlXHJcbiAgICAgICAgICA6ZmlsdGVyLWJ5LXF1ZXJ5PXRydWVcclxuICAgICAgICAgIDpsaXN0PVwiYWxsX3BsYXllcnNcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgbmFtZSBoZXJlXCJcclxuICAgICAgICAgIGlkPVwic2VhcmNoXCJcclxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIj5cclxuICAgICAgICAgIDwvdnVlLXNpbXBsZS1zdWdnZXN0PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiB2LXNob3c9XCJsb2FkaW5nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LW1kLXJvdy1yZXZlcnNlIG15LTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiIHYtc2hvdz1cInBzZWFyY2ggJiYgIW5vdGZvdW5kXCI+U2VhcmNoaW5nIDxlbT57e3BzZWFyY2h9fTwvZW0+Li4uPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1kYW5nZXJcIiB2LXNob3c9XCJwc2VhcmNoICYmIG5vdGZvdW5kXCI+PGVtPnt7cHNlYXJjaH19PC9lbT4gbm90IGZvdW5kITwvc3Bhbj5cclxuICAgICAgICA8Yi1zcGlubmVyIHYtc2hvdz1cIiFub3Rmb3VuZFwiIHN0eWxlPVwid2lkdGg6IDZyZW07IGhlaWdodDogNnJlbTtcIiB0eXBlPVwiZ3Jvd1wiIHZhcmlhbnQ9XCJzdWNjZXNzXCIgbGFiZWw9XCJCdXN5XCI+PC9iLXNwaW5uZXI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHYtaWY9XCJwZGF0YS5wbGF5ZXJcIiBjbGFzcz1cInAtMiBteC1hdXRvIGQtbWQtZmxleCBmbGV4LW1kLXJvdyBhbGlnbi1pdGVtcy1zdGFydCBqdXN0aWZ5LWNvbnRlbnQtYXJvdW5kXCI+XHJcbiAgICAgICAgICA8ZGl2IHYtc2hvdz1cInBzZWFyY2ggPT09cGRhdGEucGxheWVyICYmICFub3Rmb3VuZFwiIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIHRleHQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBhbmltYXRlZCBmYWRlSW5cIj5cclxuICAgICAgICAgIDxoND5Qcm9maWxlIFN1bW1hcnk8L2g0PlxyXG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJvc3dhbGRcIj57e3BkYXRhLnBsYXllcn19XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgbXgtYXV0byBwLTJcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJteC1hdXRvIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwZGF0YS5jb3VudHJ5IHxsb3dlcmNhc2VcIiB0aXRsZT1cInBkYXRhLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGRhdGEuZ2VuZGVyID09ICdtJywnZmEtZmVtYWxlJzogcGRhdGEuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwZGF0YS5pc190ZWFtID09ICd5ZXMnIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPGltZyA6c3JjPSdwZGF0YS5waG90bycgOmFsdD1cInBkYXRhLnBsYXllclwiIHYtYmluZD1cImltZ1Byb3BzXCI+PC9pbWc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXVwcGVyY2FzZSB0ZXh0LWxlZnRcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbTtcIj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJwZGF0YS50b3RhbF90b3VybmV5c1wiIGNsYXNzPVwibGVhZCB0ZXh0LWNlbnRlclwiPnt7cGRhdGEudG90YWxfdG91cm5leXMgfCBwbHVyYWxpemUoJ3RvdXJuZXknLHsgaW5jbHVkZU51bWJlcjogdHJ1ZSB9KX19XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJsZWFkIHRleHQtY2VudGVyXCI+Tm8gcmF0ZWQgY29tcGV0aXRpb248L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1ibG9jayB0ZXh0LXByaW1hcnkgZm9udC13ZWlnaHQtbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgVG91cm5leSA8c3BhbiBjbGFzcz1cInRleHQtY2FwaXRhbGl6ZVwiPihBbGwgVGltZSk8L3NwYW4+IEhvbm9yczpcclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIkZpcnN0IFByaXplXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGdvbGRjb2wgZm9udC13ZWlnaHQtYm9sZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnt7dG91cm5leV9wb2RpdW1zKDEpfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIlNlY29uZCBQcml6ZVwiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBzaWx2ZXJjb2wgZm9udC13ZWlnaHQtYm9sZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnt7dG91cm5leV9wb2RpdW1zKDIpfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgIDxsaSB0aXRsZT1cIlRoaXJkIFByaXplXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGJyb256ZWNvbCBmb250LXdlaWdodC1ib2xkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJhZGdlXCI+e3t0b3VybmV5X3BvZGl1bXMoMyl9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJwZGF0YS50b3RhbF9nYW1lc1wiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LWluZm8gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+e3twZGF0YS50b3RhbF9nYW1lcyB8IHBsdXJhbGl6ZSgnZ2FtZScseyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gIGNsYXNzPVwiZC1ibG9jayB0ZXh0LXN1Y2Nlc3MgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+e3twZGF0YS50b3RhbF93aW5zIHwgcGx1cmFsaXplKCd3aW4nLHsgaW5jbHVkZU51bWJlcjogdHJ1ZSB9KX19IDxlbT4oe3twZGF0YS5wZXJjZW50X3dpbnN9fSUpPC9lbT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtd2FybmluZyBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj4ge3twZGF0YS50b3RhbF9kcmF3cyB8IHBsdXJhbGl6ZSgnZHJhdycseyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gIGNsYXNzPVwiZC1ibG9jayB0ZXh0LWRhbmdlciBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj4ge3twZGF0YS50b3RhbF9sb3NzZXMgfCBwbHVyYWxpemUoWydsb3NzJywnbG9zc2VzJ10seyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtcHJpbWFyeSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5BdmUgU2NvcmU6IHt7cGRhdGEuYXZlX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtcHJpbWFyeSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5BdmUgT3Bwb25lbnRzIFNjb3JlOiB7e3BkYXRhLmF2ZV9vcHBfc2NvcmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgdGV4dC1wcmltYXJ5IGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPkF2ZSBDdW0uIE1hcjoge3twZGF0YS5hdmVfbWFyZ2lufX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LWluZm8gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+Tm8gU3RhdHMgQXZhaWxhYmxlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxkaXYgdi1zaG93PVwiIWxvYWRpbmdcIj5cclxuICAgICAgICAgIDxoNCB0aXRsZT1cIlBlcmZvcm1hbmNlIHN1bW1hcnkgcGVyIHRvdXJuZXlcIj5Db21wZXRpdGlvbnM8L2g0PlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInBkYXRhLmNvbXBldGl0aW9uc1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0xIG1iLTEgYmctbGlnaHRcIiB2LWZvcj1cIihjLCB0aW5kZXgpIGluIHBkYXRhLmNvbXBldGl0aW9uc1wiIDprZXk9XCJjLmlkXCI+XHJcbiAgICAgICAgICAgICAgPGg1IGNsYXNzPVwib3N3YWxkIHRleHQtbGVmdFwiPnt7Yy50aXRsZX19XHJcbiAgICAgICAgICAgICAgPGItYmFkZ2UgdGl0bGU9XCJGaW5hbCBSYW5rXCI+e3tjLmZpbmFsX3JkLnJhbmt9fTwvYi1iYWRnZT48L2g1PlxyXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saW5rIHRleHQtZGVjb3JhdGlvbi1ub25lXCIgdHlwZT1cImJ1dHRvblwiIHRpdGxlPVwiQ2xpY2sgdG8gdmlldyBwbGF5ZXIgc2NvcmVzaGVldCBmb3IgdGhpcyBldmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOidTY29yZXNoZWV0JywgcGFyYW1zOnsgIGV2ZW50X3NsdWc6Yy5zbHVnLCBwbm86Yy5maW5hbF9yZC5wbm99fVwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJkb2N1bWVudHMtYWx0XCI+PC9iLWljb24+IFNjb3JlY2FyZFxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGItYnV0dG9uIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiB2YXJpYW50PVwibGlua1wiIHYtYi10b2dnbGU9XCJjb2xsYXBzZSt0aW5kZXgrMVwiIHRpdGxlPVwiQ2xpY2sgdG8gdG9nZ2xlIHBsYXllciBzdGF0cyBmb3IgdGhpcyBldmVudFwiPlxyXG4gICAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJiYXItY2hhcnQtZmlsbFwiIHZhcmlhbnQ9XCJzdWNjZXNzXCIgZmxpcC1oPjwvYi1pY29uPlN0YXRpc3RpY3NcclxuICAgICAgICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGItY29sbGFwc2UgOmlkPVwiY29sbGFwc2UrdGluZGV4KzFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCBjYXJkLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDYgY2xhc3M9XCJvc3dhbGRcIj57e2MuZmluYWxfcmQucGxheWVyfX0gRXZlbnQgU3RhdHMgU3VtbWFyeTwvaDY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmVcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgUG9pbnRzOiB7e2MuZmluYWxfcmQucG9pbnRzfX0ve3tjLmZpbmFsX3JkLnJvdW5kfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBGaW5hbCBQb3M6IHt7Yy5maW5hbF9yZC5wb3NpdGlvbn19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmVcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSB0ZXh0LXN1Y2Nlc3MgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFdvbjoge3tjLmZpbmFsX3JkLndpbnN9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gdGV4dC13YXJuaW5nIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBEcmV3OiB7e2MuZmluYWxfcmQuZHJhd3N9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gdGV4dC1kYW5nZXIgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvc3Q6IHt7Yy5maW5hbF9yZC5sb3NzZXN9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF2ZXJhZ2UgU2NvcmU6IHt7Yy5maW5hbF9yZC5hdmVfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF2ZXJhZ2UgT3BwLiBTY29yZToge3tjLmZpbmFsX3JkLmF2ZV9vcHBfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdGFsIFNjb3JlOiB7e2MuZmluYWxfcmQudG90YWxfc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRvdGFsIE9wcC4gU2NvcmU6IHt7Yy5maW5hbF9yZC50b3RhbF9vcHBzY29yZX19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgTWFyZ2luOiB7e2MuZmluYWxfcmQubWFyZ2lufX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZVwiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgOmNsYXNzPVwieyd0ZXh0LXN1Y2Nlc3MnOiBjLmZpbmFsX3JkLnJlc3VsdCA9PSAnd2luJywndGV4dC13YXJuaW5nJzogYy5maW5hbF9yZC5yZXN1bHQgPT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogYy5maW5hbF9yZC5yZXN1bHQgPT0gJ2xvc3MnfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIEZpbmFsIGdhbWUgd2FzIGEge3tjLmZpbmFsX3JkLnNjb3JlfX0gLSB7e2MuZmluYWxfcmQub3Bwb19zY29yZX19IHt7Yy5maW5hbF9yZC5yZXN1bHR9fSAoYSBkaWZmZXJlbmNlIG9mIHt7Yy5maW5hbF9yZC5kaWZmfGFkZHBsdXN9fSkgYWdhaW5zdCB7e2MuZmluYWxfcmQub3Bwb319XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0xIG1iLTEgYmctbGlnaHRcIj5ObyBDb21wZXRpdGlvbiBzbyBmYXIhPC9kaXY+XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJteS01IG14LWF1dG8gZC1mbGV4IGZsZXgtcm93IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgIDxwPkNvbWluZyBTb29uITwvcD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgPCEtLSA8Yi1mb3JtLXJvdyBjbGFzcz1cIm15LTFcIj5cclxuICAgICAgICA8Yi1jb2wgc209XCIxXCIgY2xhc3M9XCJtbC1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cInNlYXJjaDFcIj5QbGF5ZXIgMTwvbGFiZWw+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2wgc209XCIzXCIgY2xhc3M9XCJtci1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGItZm9ybS1pbnB1dCBwbGFjZWhvbGRlcj1cIlN0YXJ0IHR5cGluZyBwbGF5ZXIgbmFtZVwiIHNpemU9XCJzbVwiIGlkPVwic2VhcmNoMVwiIHYtbW9kZWw9XCJzZWFyY2gxXCIgdHlwZT1cInNlYXJjaFwiPjwvYi1mb3JtLWlucHV0PlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiMVwiIGNsYXNzPVwibWwtc20tYXV0b1wiPlxyXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cIm1sLTJcIiBmb3I9XCJzZWFyY2gyXCI+UGxheWVyIDI8L2xhYmVsPlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sIHNtPVwiM1wiIGNsYXNzPVwibXItc20tYXV0b1wiPlxyXG4gICAgICAgIDxiLWZvcm0taW5wdXQgc2l6ZT1cInNtXCIgcGxhY2Vob2xkZXI9XCJTdGFydCB0eXBpbmcgcGxheWVyIG5hbWVcIiBpZD1cInNlYXJjaDJcIiB2LW1vZGVsPVwic2VhcmNoMlwiIHR5cGU9XCJzZWFyY2hcIj48L2ItZm9ybS1pbnB1dD5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICA8L2ItZm9ybS1yb3c+XHJcbiAgICAgIDxiLXJvdyBjb2xzPVwiNFwiPlxyXG4gICAgICAgIDxiLWNvbD48L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbD57e3NlYXJjaDF9fTwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sPjwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sPnt7c2VhcmNoMn19PC9iLWNvbD5cclxuICAgICAgPC9iLXJvdz5cclxuICAgICAgLS0+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHZpZXc6ICdwcm9maWxlJyxcclxuICAgICAgLy8gc2hvd1RvdVN0YXRzOiBmYWxzZSxcclxuICAgICAgcHNlYXJjaDogbnVsbCxcclxuICAgICAgc2VhcmNoMTogbnVsbCxcclxuICAgICAgc2VhcmNoMjogbnVsbCxcclxuICAgICAgcGRhdGE6IHt9LFxyXG4gICAgICBwc2x1ZzogbnVsbCxcclxuICAgICAgY29sbGFwc2U6ICdjb2xsYXBzZScsXHJcbiAgICAgIGxvYWRpbmc6IG51bGwsXHJcbiAgICAgIG5vdGZvdW5kOiBudWxsLFxyXG4gICAgICBhdXRvQ29tcGxldGVTdHlsZSA6IHtcclxuICAgICAgICB2dWVTaW1wbGVTdWdnZXN0OiBcInBvc2l0aW9uLXJlbGF0aXZlXCIsXHJcbiAgICAgICAgaW5wdXRXcmFwcGVyOiBcIlwiLFxyXG4gICAgICAgIGRlZmF1bHRJbnB1dCA6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICAgICAgc3VnZ2VzdGlvbnM6IFwicG9zaXRpb24tYWJzb2x1dGUgbGlzdC1ncm91cCB6LTEwMDBcIixcclxuICAgICAgICBzdWdnZXN0SXRlbTogXCJsaXN0LWdyb3VwLWl0ZW1cIlxyXG4gICAgICB9LFxyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIHRodW1ibmFpbDogdHJ1ZSxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnIzY2NicsXHJcbiAgICAgICAgd2lkdGg6IDEyMCxcclxuICAgICAgICBoZWlnaHQ6IDEyMCxcclxuICAgICAgICBjbGFzczogJ21iLTMgc2hhZG93LXNtJyxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZ2V0UGxheWVycygpO1xyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIHZpZXc6IHtcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKG4pIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhuKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFsbF9wbGF5ZXJzX3RvdToge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICBpZih2YWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuZ2V0UERhdGEodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRQbGF5ZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdHRVRfQUxMX1BMQVlFUlMnLCBudWxsKTtcclxuICAgIH0sXHJcbiAgICBnZXRQRGF0YTogZnVuY3Rpb24gKHYpIHtcclxuICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucHNsdWcpO1xyXG4gICAgICB2YXIgZGF0YSA9IF8uZmluZCh2LCBbJ3NsdWcnLCB0aGlzLnBzbHVnXSk7XHJcbiAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5wZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRwcm9maWxlOiBmdW5jdGlvbiAoaSkge1xyXG4gICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICB0aGlzLm5vdGZvdW5kID0gdHJ1ZTtcclxuICAgICAgY29uc29sZS5sb2coaSk7XHJcbiAgICAgIGxldCBzID0gaS5zbHVnXHJcbiAgICAgIGlmIChzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocyk7XHJcbiAgICAgICAgdGhpcy5wc2x1ZyA9IHM7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0dFVF9QTEFZRVJfVE9VX0RBVEEnLHRoaXMucHNsdWcpO1xyXG4gICAgICAgIHRoaXMubm90Zm91bmQgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm5vdGZvdW5kID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvdXJuZXlfcG9kaXVtczogZnVuY3Rpb24gKHJhbmspIHtcclxuICAgICAgbGV0IGMgPSB0aGlzLnBkYXRhLmNvbXBldGl0aW9ucztcclxuICAgICAgbGV0IHdpbnMgPSBfLmZpbHRlcihjLCBbJ2ZpbmFsX3JhbmsnLCByYW5rXSk7XHJcbiAgICAgIHJldHVybiB3aW5zLmxlbmd0aDtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICBhbGxfcGxheWVyczogJ0FMTF9QTEFZRVJTJyxcclxuICAgICAgYWxsX3BsYXllcnNfdG91OiAnQUxMX1BMQVlFUlNfVE9VX0RBVEEnLFxyXG4gICAgfSksXHJcbiAgICBwbGF5ZXJsaXN0OiB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCBuID0gdGhpcy5hbGxfcGxheWVycztcclxuICAgICAgICBsZXQgZnAgPSBfLm1hcChuLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIHAucGxheWVyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZwKTtcclxuICAgICAgICByZXR1cm4gZnA7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTJywgbmV3VmFsKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9XHJcbn0pO1xyXG4iLCJcclxuZXhwb3J0IHsgUmF0aW5nU3RhdHMgYXMgZGVmYXVsdCB9O1xyXG5sZXQgUmF0aW5nU3RhdHMgPSBWdWUuY29tcG9uZW50KCdyYXRpbmdfc3RhdHMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIFJhdGluZyBTdGF0cyAtLT5cclxuICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLTggb2Zmc2V0LTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgPGItdGFibGUgcmVzcG9uc2l2ZT1cInNtXCIgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImNvbXB1dGVkX2l0ZW1zXCIgOmZpZWxkcz1cImZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICAgIDwhLS0gQSB2aXJ0dWFsIGNvbHVtbiAtLT5cclxuICAgICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChyYXRpbmdfY2hhbmdlKT1cImRhdGFcIj5cclxuICAgICAgICAgICAgPHNwYW4gdi1iaW5kOmNsYXNzPVwie1xyXG4gICAgICAgICAgICd0ZXh0LWluZm8nOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA9PSAwLFxyXG4gICAgICAgICAgICd0ZXh0LWRhbmdlcic6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlIDwgMCxcclxuICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPiAwIH1cIj5cclxuICAgICAgICAgICAge3tkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZX19XHJcbiAgICAgICAgICAgIDxpIHYtYmluZDpjbGFzcz1cIntcclxuICAgICAgICAgICAgICdmYXMgZmEtbG9uZy1hcnJvdy1sZWZ0JzpkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA9PSAwLFxyXG4gICAgICAgICAgICAgJ2ZhcyBmYS1sb25nLWFycm93LWRvd24nOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA8IDAsXHJcbiAgICAgICAgICAgICAnZmFzIGZhLWxvbmctYXJyb3ctdXAnOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA+IDAgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKG5hbWUpPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICA8Yi1pbWctbGF6eSA6dGl0bGU9XCJkYXRhLml0ZW0ubmFtZVwiIDphbHQ9XCJkYXRhLml0ZW0ubmFtZVwiIDpzcmM9XCJkYXRhLml0ZW0ucGhvdG9cIiB2LWJpbmQ9XCJwaWNQcm9wc1wiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgIHt7ZGF0YS5pdGVtLm5hbWV9fVxyXG4gICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgPC9iLXRhYmxlPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY29tcHV0ZWRfaXRlbXMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBpY1Byb3BzOiB7XHJcbiAgICAgICAgYmxvY2s6IGZhbHNlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIHdpZHRoOiAnMzBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMzBweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20sIG14LTEnLFxyXG4gICAgICB9LFxyXG4gICAgICBmaWVsZHM6IFtcclxuICAgICAgICB7IGtleTogJ3Bvc2l0aW9uJywgbGFiZWw6ICdSYW5rJyB9LFxyXG4gICAgICAgICduYW1lJyxcclxuICAgICAgICB7IGtleTogJ3JhdGluZ19jaGFuZ2UnLCBsYWJlbDogJ0NoYW5nZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgICAgeyBrZXk6ICdleHBlY3RlZF93aW5zJywgbGFiZWw6ICdFLndpbnMnIH0sXHJcbiAgICAgICAgeyBrZXk6ICdhY3R1YWxfd2lucycsIGxhYmVsOiAnQS53aW5zJyB9LFxyXG4gICAgICAgIHsga2V5OiAnb2xkX3JhdGluZycsIGxhYmVsOiAnT2xkIFJhdGluZycgLCBzb3J0YWJsZTogdHJ1ZX0sXHJcbiAgICAgICAgeyBrZXk6ICduZXdfcmF0aW5nJywgbGFiZWw6ICdOZXcgUmF0aW5nJyAsIHNvcnRhYmxlOiB0cnVlfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfSxcclxuXHJcbn0pO1xyXG4iLCJpbXBvcnQgYmFzZVVSTCBmcm9tICcuLi9jb25maWcuanMnO1xyXG5leHBvcnQgeyBTY29yZWJvYXJkIGFzIGRlZmF1bHR9O1xyXG5cclxuXHJcbmxldCBTY29yZWJvYXJkID0gVnVlLmNvbXBvbmVudCgnc2NvcmVib2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3cgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwiZXJyb3JcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgPC90ZW1wbGF0ZT5cclxuICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gIDxkaXYgY2xhc3M9XCJjb2xcIiBpZD1cInNjb3JlYm9hcmRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVycyBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIiB2LWZvcj1cImkgaW4gcm93Q291bnRcIiA6a2V5PVwiaVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTMgY29sLXNtLTYgY29sLTEyIFwiIHYtZm9yPVwicGxheWVyIGluIGl0ZW1Db3VudEluUm93KGkpXCIgOmtleT1cInBsYXllci5yYW5rXCI+XHJcbiAgICAgICAgPGItbWVkaWEgY2xhc3M9XCJwYi0wIG1iLTEgbXItMVwiIHZlcnRpY2FsLWFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IHNsb3Q9XCJhc2lkZVwiPlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgICAgPGItaW1nIHJvdW5kZWQ9XCJjaXJjbGVcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgd2lkdGg9XCI1MFwiIGhlaWdodD1cIjUwXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiBjbGFzcz1cImFuaW1hdGVkIGZsaXBJblhcIiAvPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29scz1cIjEyXCIgbWQ9XCJhdXRvXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsYWctaWNvblwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29sIGxnPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdmJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cInRleHQtY2VudGVyXCIgdi1pZj1cInBsYXllci50ZWFtXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPjxzcGFuPnt7cGxheWVyLnRlYW19fTwvc3Bhbj48L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3c+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNsYXNzPVwidGV4dC13aGl0ZVwiIHYtYmluZDpjbGFzcz1cInsndGV4dC13YXJuaW5nJzogcGxheWVyLnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogcGxheWVyLnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgcG9zaXRpb24gIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAge3twbGF5ZXIucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1sb25nLWFycm93LXVwJzogcGxheWVyLnJhbmsgPCBwbGF5ZXIubGFzdHJhbmssJ2ZhLWxvbmctYXJyb3ctZG93bic6IHBsYXllci5yYW5rID4gcGxheWVyLmxhc3RyYW5rLFxyXG4gICAgICAgICAgICAgICAgICdmYS1hcnJvd3MtaCc6IHBsYXllci5yYW5rID09IHBsYXllci5sYXN0cmFuayB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDUgY2xhc3M9XCJtLTAgIGFuaW1hdGVkIGZhZGVJbkxlZnRcIj57e3BsYXllci5wbGF5ZXJ9fTwvaDU+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmQtdGV4dCBtdC0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgcG9pbnRzIHAtMVwiPnt7cGxheWVyLnBvaW50c319LXt7cGxheWVyLmxvc3Nlc319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIG1hclwiPnt7cGxheWVyLm1hcmdpbiB8IGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gdi1pZj1cInBsYXllci5sYXN0cG9zaXRpb25cIiBjbGFzcz1cInNkYXRhIHAxXCI+d2FzIHt7cGxheWVyLmxhc3Rwb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInBsYXllci5yZXN1bHQgPT0nYXdhaXRpbmcnIFwiIGNsYXNzPVwiYmctaW5mbyBkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiPnt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhciB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgIHt7cGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhcn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZSBwLTEgIHNkYXRhXCI+QXdhaXRpbmdcclxuICAgICAgICAgICAgICAgIFJlc3VsdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgc2RhdGFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J3RleHQtd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj57e3BsYXllci5zY29yZX19XHJcbiAgICAgICAgICAgICAgICAtIHt7cGxheWVyLm9wcG9fc2NvcmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgcC0wIG1sLTEgb3BwXCI+dnMge3twbGF5ZXIub3Bwb319PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJwbGF5ZXIucHJldnJlc3VsdHNcIiBjbGFzcz1cInJvdyBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwicmVzXCIgdi1mb3I9XCJyZXMgaW4gcGxheWVyLnByZXZyZXN1bHRzXCIgOmtleT1cInJlcy5rZXlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiByZXMgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiByZXMgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiByZXMgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiByZXMgPT09ICd3aW4nIH1cIj57e3Jlc3xmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1tZWRpYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY3VycmVudFJvdW5kJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpdGVtc1BlclJvdzogNCxcclxuICAgICAgcGVyX3BhZ2U6IDQwLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhZ2V1cmw6IGJhc2VVUkwgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcmVsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIHBlcmlvZDogMC41LFxyXG4gICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgc2NvcmVib2FyZF9kYXRhOiBbXSxcclxuICAgICAgcmVzcG9uc2VfZGF0YTogW10sXHJcbiAgICAgIC8vIHBsYXllcnM6IFtdLFxyXG4gICAgICAvLyB0b3RhbF9yb3VuZHM6IDAsXHJcbiAgICAgIC8vIGN1cnJlbnRSb3VuZDogbnVsbCxcclxuICAgICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgICBpc19saXZlX2dhbWU6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHRoaXMuZmV0Y2hTY29yZWJvYXJkRGF0YSgpO1xyXG4gICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKFxyXG4gICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIHRoaXMucGVyaW9kICogNjAwMDBcclxuICAgICk7XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgY3VycmVudFJvdW5kOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0RldGFpbHModGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgIH1cclxuICAgICB9XHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmdldFdpbmRvd1dpZHRoKTtcclxuICAgIHRoaXMuY2FuY2VsQXV0b1VwZGF0ZSgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgIGNhbmNlbEF1dG9VcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG4gICAgfSxcclxuICAgIGZldGNoU2NvcmVib2FyZERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuaXNfbGl2ZV9nYW1lID09IHRydWUpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXRlbUNvdW50SW5Sb3c6IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNjb3JlYm9hcmRfZGF0YS5zbGljZShcclxuICAgICAgICAoaW5kZXggLSAxKSAqIHRoaXMuaXRlbXNQZXJSb3csXHJcbiAgICAgICAgaW5kZXggKiB0aGlzLml0ZW1zUGVyUm93XHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc0RldGFpbHM6IGZ1bmN0aW9uKGN1cnJlbnRQYWdlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVzdWx0X2RhdGEpXHJcbiAgICAgIGxldCByZXN1bHRkYXRhID0gdGhpcy5yZXN1bHRfZGF0YTtcclxuICAgICAgLy8gbGV0IGxhc3RSZEQgPSBfLmxhc3QoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICAgIGxldCBjciA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuXHJcbiAgICAgIGxldCB0aGlzUmREYXRhID0gXy5udGgoXy5jbG9uZShyZXN1bHRkYXRhKSwgY3IpO1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLVRoaXMgUm91bmQgRGF0YS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNyKTtcclxuICAgICAgY29uc29sZS5sb2codGhpc1JkRGF0YSk7XHJcblxyXG4gICAgICBsZXQgaW5pdGlhbFJkRGF0YSA9IFtdO1xyXG4gICAgICBsZXQgcHJldmlvdXNSZERhdGEgPSBbXTtcclxuICAgICAgaWYodGhpcy5jdXJyZW50Um91bmQgPiAxKVxyXG4gICAgICB7XHJcbiAgICAgICAgcHJldmlvdXNSZERhdGEgPSBfLm50aChfLmNsb25lKHJlc3VsdGRhdGEpLGNyIC0gMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS1QcmV2aW91cyBSb3VuZCBEYXRhLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwcmV2aW91c1JkRGF0YSk7XHJcbiAgICAgICAgaW5pdGlhbFJkRGF0YSA9IF8udGFrZShfLmNsb25lKHJlc3VsdGRhdGEpLCBjcik7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGN1cnJlbnRSZERhdGEgPSBfLm1hcCh0aGlzUmREYXRhLCBwbGF5ZXIgPT4ge1xyXG4gICAgICAgIGxldCB4ID0gcGxheWVyLnBubyAtIDE7XHJcbiAgICAgICAgcGxheWVyLnBob3RvID0gdGhpcy5wbGF5ZXJzW3hdLnBob3RvO1xyXG4gICAgICAgIHBsYXllci5nZW5kZXIgPSB0aGlzLnBsYXllcnNbeF0uZ2VuZGVyO1xyXG4gICAgICAgIHBsYXllci5jb3VudHJ5X2Z1bGwgPSB0aGlzLnBsYXllcnNbeF0uY291bnRyeV9mdWxsO1xyXG4gICAgICAgIHBsYXllci5jb3VudHJ5ID0gdGhpcy5wbGF5ZXJzW3hdLmNvdW50cnk7XHJcbiAgICAgICAgaWYgKHByZXZpb3VzUmREYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gXy5maW5kKHByZXZpb3VzUmREYXRhLCB7XHJcbiAgICAgICAgICAgIHBsYXllcjogcGxheWVyLnBsYXllcixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3Rwb3NpdGlvbiA9IHBsYXllckRhdGFbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHJhbmsgPSBwbGF5ZXJEYXRhWydyYW5rJ107XHJcbiAgICAgICAgICAvLyBwcmV2aW91cyByb3VuZHMgcmVzdWx0c1xyXG4gICAgICAgICAgaWYoaW5pdGlhbFJkRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5wcmV2cmVzdWx0cyA9IF8uY2hhaW4oaW5pdGlhbFJkRGF0YSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbih2KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHYucGxheWVyID09PSBwbGF5ZXIucGxheWVyO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKCdyZXN1bHQnKVxyXG4gICAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMudG90YWxfcm91bmRzID0gcmVzdWx0ZGF0YS5sZW5ndGg7XHJcbiAgICAgIC8vIHRoaXMuY3VycmVudFJvdW5kID0gbGFzdFJkRGF0YVswXS5yb3VuZDtcclxuICAgICAgbGV0IGNodW5rcyA9IF8uY2h1bmsoY3VycmVudFJkRGF0YSwgdGhpcy50b3RhbF9wbGF5ZXJzKTtcclxuICAgICAgLy8gdGhpcy5yZWxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNjb3JlYm9hcmRfZGF0YSA9IGNodW5rc1tjdXJyZW50UGFnZSAtIDFdO1xyXG4gICAgICBjb25zb2xlLmxvZygnU2NvcmVib2FyZCBEYXRhJylcclxuICAgICAgY29uc29sZS5sb2codGhpcy5zY29yZWJvYXJkX2RhdGEpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHJlc3VsdF9kYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGNhdGVnb3J5OiAnQ0FURUdPUlknLFxyXG4gICAgfSksXHJcbiAgICByb3dDb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5zY29yZWJvYXJkX2RhdGEubGVuZ3RoIC8gdGhpcy5pdGVtc1BlclJvdyk7XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhZ2V1cmxcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIiwiaW1wb3J0IHsgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0IH0gZnJvbSAnLi9hbGVydHMuanMnO1xyXG5leHBvcnQgeyBTY29yZXNoZWV0IGFzIGRlZmF1bHQgfTtcclxuXHJcbmxldCBTY29yZXNoZWV0ID0gVnVlLmNvbXBvbmVudCgnc2NvcmVDYXJkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleFwiPlxyXG4gICAgICAgICAgPGItaW1nIGZsdWlkIHRodW1ibmFpbCBjbGFzcz1cImxvZ28gbWwtYXV0b1wiIDpzcmM9XCJsb2dvXCIgOmFsdD1cImV2ZW50X3RpdGxlXCIgLz5cclxuICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1jZW50ZXIgZC1ibG9ja1wiPlNjb3JlY2FyZHMgPGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkXCI+PC9pPjwvc3Bhbj5cclxuICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1iZXR3ZWVuXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMiBjb2wtMTJcIj5cclxuICAgICAgPCEtLSBwbGF5ZXIgbGlzdCBoZXJlIC0tPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cIiBwLTIgbWItNSBiZy13aGl0ZSByb3VuZGVkXCI+XHJcbiAgICAgICAgICA8bGkgOmtleT1cInBsYXllci5wbm9cIiB2LWZvcj1cInBsYXllciBpbiBwZGF0YVwiIGNsYXNzPVwiYmViYXNcIj5cclxuICAgICAgICAgIDxzcGFuPnt7cGxheWVyLnBub319PC9zcGFuPiA8Yi1pbWctbGF6eSA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiB2LWJpbmQ9XCJwaWNQcm9wc1wiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cImdldENhcmQocGxheWVyLnBubylcIiB2YXJpYW50PVwibGlua1wiPnt7cGxheWVyLnBsYXllcn19PC9iLWJ1dHRvbj5cclxuICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTAgY29sLTEyXCI+XHJcbiAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwibVBsYXllclwiPlxyXG4gICAgICAgIDxoNCBjbGFzcz1cImdyZWVuXCI+U2NvcmVjYXJkOiA8Yi1pbWcgOmFsdD1cIm1QbGF5ZXIucGxheWVyXCIgY2xhc3M9XCJteC0yXCIgOnNyYz1cIm1QbGF5ZXIucGhvdG9cIiBzdHlsZT1cIndpZHRoOjYwcHg7IGhlaWdodDo2MHB4XCI+PC9iLWltZz4ge3ttUGxheWVyLnBsYXllcn19PC9oND5cclxuICAgICAgICA8Yi10YWJsZSByZXNwb25zaXZlPVwibWRcIiBzbWFsbCBob3ZlciBmb290LWNsb25lIGhlYWQtdmFyaWFudD1cImxpZ2h0XCIgYm9yZGVyZWQgdGFibGUtdmFyaWFudD1cImxpZ2h0XCIgOmZpZWxkcz1cImZpZWxkc1wiIDppdGVtcz1cInNjb3JlY2FyZFwiIGlkPVwic2NvcmVjYXJkXCIgY2xhc3M9XCJiZWJhcyBzaGFkb3cgcC00IG14LWF1dG9cIiBzdHlsZT1cIndpZHRoOjkwJTsgdGV4dC1hbGlnbjpjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGVcIj5cclxuICAgICAgICA8IS0tIEEgY3VzdG9tIGZvcm1hdHRlZCBjb2x1bW4gLS0+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKHJvdW5kKT1cImRhdGFcIj5cclxuICAgICAgICAgIHt7ZGF0YS5pdGVtLnJvdW5kfX0gPHN1cCB2LWlmPVwiZGF0YS5pdGVtLnN0YXJ0ID09J3knXCI+Kjwvc3VwPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKG9wcG8pPVwiZGF0YVwiPlxyXG4gICAgICAgICAgPHNtYWxsPiN7e2RhdGEuaXRlbS5vcHBvX25vfX08L3NtYWxsPjxiLWltZy1sYXp5IDp0aXRsZT1cImRhdGEuaXRlbS5vcHBvXCIgOmFsdD1cImRhdGEuaXRlbS5vcHBvXCIgOnNyYz1cImRhdGEuaXRlbS5vcHBfcGhvdG9cIiB2LWJpbmQ9XCJwaWNQcm9wc1wiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJnZXRDYXJkKGRhdGEuaXRlbS5vcHBvX25vKVwiIHZhcmlhbnQ9XCJsaW5rXCI+XHJcbiAgICAgICAgICAgICAge3tkYXRhLml0ZW0ub3Bwb3xhYmJydn19XHJcbiAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDp0YWJsZS1jYXB0aW9uPlxyXG4gICAgICAgICAgU2NvcmVjYXJkOiAje3ttUGxheWVyLnBub319IHt7bVBsYXllci5wbGF5ZXJ9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPC9iLXRhYmxlPlxyXG4gICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBkYXRhKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLmV2ZW50X3NsdWcsXHJcbiAgICAgIHBsYXllcl9ubzogdGhpcy4kcm91dGUucGFyYW1zLnBubyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgdG91cm5leV9zbHVnOiAnJyxcclxuICAgICAgcGljUHJvcHM6IHtcclxuICAgICAgICBibG9jazogZmFsc2UsXHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgd2lkdGg6ICczMHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICczMHB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSwgbXgtMScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGZpZWxkczogW3trZXk6J3JvdW5kJyxsYWJlbDonUmQnLHNvcnRhYmxlOnRydWV9LCB7a2V5OiAnb3BwbycsIGxhYmVsOidPcHAuIE5hbWUnfSx7a2V5OidvcHBvX3Njb3JlJyxsYWJlbDonT3BwLiBTY29yZScsc29ydGFibGU6dHJ1ZX0se2tleTonc2NvcmUnLHNvcnRhYmxlOnRydWV9LHtrZXk6J2RpZmYnLHNvcnRhYmxlOnRydWV9LHtrZXk6J3Jlc3VsdCcsc29ydGFibGU6dHJ1ZX0sIHtrZXk6J3dpbnMnLGxhYmVsOidXb24nLHNvcnRhYmxlOnRydWV9LHtrZXk6J2xvc3NlcycsbGFiZWw6J0xvc3QnLHNvcnRhYmxlOnRydWV9LHtrZXk6J3BvaW50cycsc29ydGFibGU6dHJ1ZX0se2tleTonbWFyZ2luJyxzb3J0YWJsZTp0cnVlLGxhYmVsOidNYXInfSx7a2V5Oidwb3NpdGlvbicsbGFiZWw6J1JhbmsnLHNvcnRhYmxlOnRydWV9XSxcclxuICAgICAgcGRhdGE6IHt9LFxyXG4gICAgICBzY29yZWNhcmQ6IHt9LFxyXG4gICAgICBtUGxheWVyOiB7fSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGNyZWF0ZWQoKSB7XHJcbiAgICB2YXIgcCA9IHRoaXMuc2x1Zy5zcGxpdCgnLScpO1xyXG4gICAgcC5zaGlmdCgpO1xyXG4gICAgdGhpcy50b3VybmV5X3NsdWcgPSBwLmpvaW4oJy0nKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMudG91cm5leV9zbHVnKTtcclxuICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9SRVNEQVRBJywgdGhpcy5zbHVnKTtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gYFBsYXllciBTY29yZWNhcmRzIC0gJHt0aGlzLnRvdXJuZXlfdGl0bGV9YDtcclxuICB9LFxyXG4gIHdhdGNoOntcclxuICAgIHJlc3VsdGRhdGE6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgaWYgKG5ld1ZhbCkge1xyXG4gICAgICAgICAgdGhpcy5wZGF0YSA9IF8uY2hhaW4odGhpcy5yZXN1bHRkYXRhKVxyXG4gICAgICAgICAgICAubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgICAgICAgIHRoaXMuZ2V0Q2FyZCh0aGlzLnBsYXllcl9ubyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0Q2FyZDogZnVuY3Rpb24gKG4pIHtcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIGxldCBzID0gXy5jaGFpbihjKS5tYXAoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gXy5maWx0ZXIodiwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLnBubyA9PSBuO1xyXG4gICAgICAgIH0pLm1hcCggZnVuY3Rpb24oaSl7XHJcbiAgICAgICAgICBpLl9jZWxsVmFyaWFudHMgPSBbXTtcclxuICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnaW5mbyc7XHJcbiAgICAgICAgICBpZihpLnJlc3VsdCA9PT0nd2luJyl7XHJcbiAgICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihpLnJlc3VsdCA9PT0nbG9zcycpe1xyXG4gICAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihpLnJlc3VsdCA9PT0nZHJhdycpe1xyXG4gICAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pLmZsYXR0ZW5EZWVwKCkudmFsdWUoKTtcclxuICAgICAgdGhpcy5tUGxheWVyID0gXy5maXJzdChzKTtcclxuICAgICAgdGhpcy4kcm91dGVyLnJlcGxhY2UoeyBuYW1lOiAnU2NvcmVzaGVldCcsIHBhcmFtczogeyBwbm86IG4gfSB9KTtcclxuICAgICAgdGhpcy5wbGF5ZXJfbm8gPSBuO1xyXG4gICAgICBjb25zb2xlLmxvZyhzKTtcclxuICAgICAgdGhpcy5zY29yZWNhcmQgPSBzO1xyXG4gIH0sXHJcblxyXG59LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICBldmVudF9kYXRhOiAnRVZFTlRTVEFUUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgY2F0ZWdvcnk6ICdDQVRFR09SWScsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIHBhcmVudF9zbHVnOiAnUEFSRU5UU0xVRycsXHJcbiAgICAgIGV2ZW50X3RpdGxlOiAnRVZFTlRfVElUTEUnLFxyXG4gICAgICB0b3VybmV5X3RpdGxlOiAnVE9VUk5FWV9USVRMRScsXHJcbiAgICAgIGxvZ286ICdMT0dPX1VSTCcsXHJcbiAgICB9KSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5X3RpdGxlLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICBzbHVnOiB0aGlzLnRvdXJuZXlfc2x1ZyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBgJHtfLmNhcGl0YWxpemUodGhpcy5jYXRlZ29yeSl9IC0gUmVzdWx0cyBhbmQgU3RhdHNgLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ0NhdGVEZXRhaWwnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICBldmVudF9zbHVnOiB0aGlzLnNsdWdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1Njb3JlY2FyZHMnLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYXRoXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiIsIiBsZXQgTG9XaW5zID0gVnVlLmNvbXBvbmVudCgnbG93aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBMb3cgV2lubmluZyBTY29yZXMgLS0+XHJcbiAgICA8Yi10YWJsZSByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRMb3dTY29yZSgnd2luJylcIiA6ZmllbGRzPVwibG93d2luc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3d3aW5zX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5sb3d3aW5zX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TG93U2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1pbkJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBIaVdpbnMgPVZ1ZS5jb21wb25lbnQoJ2hpd2lucycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gSGlnaCBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJoaWdod2luc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlnaHdpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpZ2h3aW5zX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0SGlTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBIaUxvc3MgPSBWdWUuY29tcG9uZW50KCdoaWxvc3MnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDwhLS0gSGlnaCBMb3NpbmcgU2NvcmVzIC0tPlxyXG4gICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0SGlTY29yZSgnbG9zcycpXCIgOmZpZWxkcz1cImhpbG9zc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpbG9zc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlsb3NzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdMb3NlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdXaW5uZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0SGlTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBDb21ib1Njb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2NvbWJvc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImhpY29tYm8oKVwiIDpmaWVsZHM9XCJoaWNvbWJvX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpY29tYm9fZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpY29tYm9fZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2NvbWJvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0NvbWJpbmVkIFNjb3JlJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnb3Bwb19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdMb3NpbmcgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaGljb21ibygpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heEJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5jb21ib19zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdjb21ib19zY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgVG90YWxTY29yZXMgPSBWdWUuY29tcG9uZW50KCd0b3RhbHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJ0b3RhbHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvdGFsc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnRvdGFsc2NvcmVfZmllbGRzID0gW1xyXG4gICAgLy8gICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAndG90YWxfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnVG90YWwgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbE9wcFNjb3JlcyA9VnVlLmNvbXBvbmVudCgnb3Bwc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsb3Bwc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxvcHBzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgLy8gJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9vcHBzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEF2ZVNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2F2ZXNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cImF2ZXNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF2ZXNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hdmVzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgIC8vJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdhdmVfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQXZlcmFnZSBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgQXZlT3BwU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnYXZlb3Bwc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgaG92ZXIgcmVzcG9uc2l2ZSBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwiYXZlb3Bwc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXZlb3Bwc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmF2ZW9wcHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgLy8gJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdhdmVfb3BwX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0F2ZXJhZ2UgT3Bwb25lbnQgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IExvU3ByZWFkID0gVnVlLmNvbXBvbmVudCgnbG9zcHJlYWQnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJsb1NwcmVhZCgpXCIgOmZpZWxkcz1cImxvc3ByZWFkX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbG9zcHJlYWRfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxvc3ByZWFkX2ZpZWxkcyA9IFtcclxuICAgICAgJ3JvdW5kJyxcclxuICAgICAgeyBrZXk6ICdkaWZmJywgbGFiZWw6ICdTcHJlYWQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgbG9TcHJlYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWluQnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmRpZmY7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBIaVNwcmVhZCA9ICAgVnVlLmNvbXBvbmVudCgnaGlzcHJlYWQnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImhpU3ByZWFkKClcIiA6ZmllbGRzPVwiaGlzcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlzcHJlYWRfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpc3ByZWFkX2ZpZWxkcyA9IFtcclxuICAgICAgJ3JvdW5kJyxcclxuICAgICAgeyBrZXk6ICdkaWZmJywgbGFiZWw6ICdTcHJlYWQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnV2lubmVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgaGlTcHJlYWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5kaWZmO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2RpZmYnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuIH0pO1xyXG5leHBvcnQge0hpV2lucywgTG9XaW5zLEhpTG9zcyxDb21ib1Njb3JlcyxUb3RhbFNjb3JlcyxUb3RhbE9wcFNjb3JlcyxBdmVTY29yZXMsQXZlT3BwU2NvcmVzLEhpU3ByZWFkLCBMb1NwcmVhZH0iLCJsZXQgbWFwR2V0dGVycyA9IFZ1ZXgubWFwR2V0dGVycztcclxubGV0IHRvcFBlcmZvcm1lcnMgPSBWdWUuY29tcG9uZW50KCd0b3Atc3RhdHMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEwIG9mZnNldC1sZy0xIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgPGgzIGNsYXNzPVwiYmViYXNcIj57e3RpdGxlfX1cclxuICAgICAgICA8c3Bhbj48aSBjbGFzcz1cImZhcyBmYS1tZWRhbFwiPjwvaT48L3NwYW4+XHJcbiAgICAgIDwvaDM+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTIgY29sLXNtLTQgY29sLTEyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJtdC01IGQtZmxleCBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJ0b3AtYnRuLWdyb3VwXCI+XHJcbiAgICAgICAgICA8Yi1idXR0b24tZ3JvdXAgdmVydGljYWw+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiVG9wIDNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCd0b3AzJylcIlxyXG4gICAgICAgICAgICAgIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0ndG9wMydcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10cm9waHkgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlRvcCAzXHJcbiAgICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiSGlnaGVzdCAoR2FtZSkgU2NvcmVzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgQGNsaWNrPVwic2hvd1BpYygnaGlnYW1lcycpXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpZ2FtZXMnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYnVsbHNleWUgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggR2FtZVxyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkhpZ2hlc3QgQXZlcmFnZSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlhdmVzJ1wiIEBjbGljaz1cInNob3dQaWMoJ2hpYXZlcycpXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGh1bWJzLXVwIG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5IaWdoIEF2ZSBTY29yZTwvYi1idXR0b24+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiTG93ZXN0IEF2ZXJhZ2UgT3Bwb25lbnQgU2NvcmVzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCJcclxuICAgICAgICAgICAgICBAY2xpY2s9XCJzaG93UGljKCdsb29wcGF2ZXMnKVwiIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0nbG9vcHBhdmVzJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJlZXIgbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Mb3cgT3BwIEF2ZTwvYi1idXR0b24+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2LWlmPVwicmF0aW5nX3N0YXRzXCIgdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkhpZ2ggUmFuayBQb2ludHNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCdoaXJhdGUnKVwiXHJcbiAgICAgICAgICAgICAgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaXJhdGUnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYm9sdCBtci0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpIFJhbmsgUG9pbnRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgIDwvYi1idXR0b24tZ3JvdXA+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEwIGNvbC1zbS04IGNvbC0xMlwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiA6Y2xhc3M9XCJ7J2RlbGF5MSc6ICBpdGVtLnBvc2l0aW9uID09ICcxc3QnLCAnZGVsYXkyJzogaXRlbS5wb3NpdGlvbiA9PSAnMm5kJywgJ2RlbGF5Myc6IGl0ZW0ucG9zaXRpb24gPT0gJzNyZCd9XCIgY2xhc3M9XCJjb2wtc20tNCBjb2wtMTIgYW5pbWF0ZWQgZmxpcEluWFwiIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBzdGF0c1wiPlxyXG4gICAgICAgICAgPGg0IGNsYXNzPVwicC0yIHRleHQtY2VudGVyIGJlYmFzIGJnLWRhcmsgdGV4dC13aGl0ZVwiPnt7aXRlbS5wbGF5ZXJ9fTwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IDpjbGFzcz1cInsnZ29sZCc6IGl0ZW0ucG9zaXRpb24gPT0gJzFzdCcsJ3NpbHZlcic6IGl0ZW0ucG9zaXRpb24gPT0gJzJuZCcsJ2Jyb256ZSc6IGl0ZW0ucG9zaXRpb24gPT0gJzNyZCd9XCIgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgXCI+XHJcbiAgICAgICAgICAgIDxpbWcgOnNyYz1cInBsYXllcnNbaXRlbS5wbm8tMV0ucGhvdG9cIiB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgY2xhc3M9XCJpbWctZmx1aWQgcm91bmRlZC1jaXJjbGVcIlxyXG4gICAgICAgICAgICAgIDphbHQ9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLnBvc3RfdGl0bGV8bG93ZXJjYXNlXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayBtbC01XCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0xIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnkgfCBsb3dlcmNhc2VcIlxyXG4gICAgICAgICAgICAgICAgOnRpdGxlPVwicGxheWVyc1tpdGVtLnBuby0xXS5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0xIGZhXCJcclxuICAgICAgICAgICAgICAgIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdtJywgJ2ZhLWZlbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdmJ31cIlxyXG4gICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBiZy1kYXJrIHRleHQtd2hpdGVcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgIHYtaWY9XCJpdGVtLnBvaW50c1wiPnt7aXRlbS5wb2ludHN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgIHYtaWY9XCJpdGVtLnJhdGluZ19jaGFuZ2VcIj48c21hbGwgdi1pZj1cIml0ZW0ucmF0aW5nX2NoYW5nZSA+PSAwXCI+R2FpbmVkPC9zbWFsbD4ge3tpdGVtLnJhdGluZ19jaGFuZ2V9fSBwb2ludHMgPHNtYWxsIHYtaWY9XCJpdGVtLnJhdGluZ19jaGFuZ2UgPD0gMFwiPmxvc3M8L3NtYWxsPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgIHYtaWY9XCJpdGVtLm1hcmdpblwiPnt7aXRlbS5tYXJnaW58YWRkcGx1c319PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSB0ZXh0LWNlbnRlciBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIiB2LWlmPVwiaXRlbS5zY29yZVwiPlJvdW5kXHJcbiAgICAgICAgICAgICAgICB7e2l0ZW0ucm91bmR9fSB2cyB7e2l0ZW0ub3Bwb319PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBiZy1zdWNjZXNzIHRleHQtd2hpdGVcIj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLnNjb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uc2NvcmV9fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0ucG9zaXRpb25cIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5wb3NpdGlvbn19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5hdmVfc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5hdmVfc2NvcmV9fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uYXZlX29wcF9zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLmF2ZV9vcHBfc2NvcmV9fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0ubmV3X3JhdGluZ1wiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLm9sZF9yYXRpbmd9fSAtIHt7aXRlbS5uZXdfcmF0aW5nfX08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAgYCxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogJycsXHJcbiAgICAgIHByb2ZpbGVzIDogW10sXHJcbiAgICAgIHN0YXRzOiBbXSxcclxuICAgICAgY29tcHV0ZWRfcmF0aW5nX2l0ZW1zOiBbXSxcclxuICAgICAgY3VycmVudFZpZXc6ICcnXHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2hvd1BpYygndG9wMycpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2hvd1BpYzogZnVuY3Rpb24gKHQpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHRcclxuICAgICAgbGV0IGFycixyLHMgPSBbXTtcclxuICAgICAgaWYgKHQgPT0gJ2hpYXZlcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdhdmVfc2NvcmUnKTtcclxuICAgICAgICByID0gXy50YWtlKGFyciwgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdhdmVfc2NvcmUnXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGUgPSAnSGlnaGVzdCBBdmVyYWdlIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnbG9vcHBhdmVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ2F2ZV9vcHBfc2NvcmUnKTtcclxuICAgICAgICByID0gXy50YWtlUmlnaHQoYXJyLCAzKS5yZXZlcnNlKCkubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdhdmVfb3BwX3Njb3JlJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdMb3dlc3QgT3Bwb25lbnQgQXZlcmFnZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2hpZ2FtZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5jb21wdXRlU3RhdHMoKTtcclxuICAgICAgICByID0gXy50YWtlKGFyciwgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdzY29yZScsJ3JvdW5kJywnb3BwbyddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nSGlnaCBHYW1lIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAndG9wMycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdwb2ludHMnKTtcclxuICAgICAgICBzID0gXy5zb3J0QnkoYXJyLFsncG9pbnRzJywnbWFyZ2luJ10pLnJldmVyc2UoKVxyXG4gICAgICAgIHIgPSBfLnRha2UocywgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdwb2ludHMnLCdtYXJnaW4nLCdwb3NpdGlvbiddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nVG9wIDMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2hpcmF0ZScpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJhdGluZ0RhdGEoKTtcclxuICAgICAgICBhcnIgPSB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcztcclxuXHJcbiAgICAgICAgcyA9IF8uc29ydEJ5KGFyciwgWydyYXRpbmdfY2hhbmdlJywnbmV3X3JhdGluZyddKS5yZXZlcnNlKCk7XHJcblxyXG4gICAgICAgIHIgPSBfLnRha2UocywgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICduZXdfcmF0aW5nJywgJ3JhdGluZ19jaGFuZ2UnLCAnb2xkX3JhdGluZyddKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tdG9wIHJhbmstLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHIpO1xyXG5cclxuICAgICAgICB0aGlzLnRpdGxlPSdIaWdoIFJhdGluZyBQb2ludCBHYWluZXJzJ1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0YXRzID0gcjtcclxuICAgICAgLy8gdGhpcy5wcm9maWxlcyA9IHRoaXMucGxheWVyc1tyLnBuby0xXTtcclxuXHJcbiAgICB9LFxyXG4gICAgZ2V0U3RhdHM6IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KHRoaXMuZmluYWxzdGF0cywga2V5KS5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gICAgY29tcHV0ZVN0YXRzOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heEJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZVJhdGluZ0RhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHJlc3VsdGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jaGFpbihyZXN1bHRkYXRhKS5sYXN0KCkuc29ydEJ5KCdwbm8nKS52YWx1ZSgpO1xyXG4gICAgICBsZXQgaXRlbXMgPSBfLmNsb25lKHRoaXMucmF0aW5nX3N0YXRzKTtcclxuICAgICAgdGhpcy5jb21wdXRlZF9yYXRpbmdfaXRlbXMgPSBfLm1hcChpdGVtcywgZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBsZXQgbiA9IHgucG5vO1xyXG4gICAgICAgIGxldCBwID0gXy5maWx0ZXIoZGF0YSwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLnBubyA9PSBuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHgucGhvdG8gPSBwWzBdLnBob3RvO1xyXG4gICAgICAgIHgucG9zaXRpb24gPSBwWzBdLnBvc2l0aW9uO1xyXG4gICAgICAgIHgucGxheWVyID0geC5uYW1lO1xyXG4gICAgICAgIHgucmF0aW5nX2NoYW5nZSA9IHBhcnNlSW50KHgucmF0aW5nX2NoYW5nZSk7XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBmaW5hbHN0YXRzOiAnRklOQUxfUk9VTkRfU1RBVFMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIHJhdGluZ19zdGF0czogJ1JBVElOR19TVEFUUycsXHJcbiAgICAgIG9uZ29pbmc6ICdPTkdPSU5HX1RPVVJORVknLFxyXG4gICAgfSksXHJcbiAgfSxcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IHRvcFBlcmZvcm1lcnM7IiwiZXhwb3J0IHsgc3RvcmUgYXMgZGVmYXVsdCB9O1xyXG5cclxuaW1wb3J0IHsgYmFzZVVSTCwgYXV0aFVSTCwgcHJvZmlsZVVSTCwgc3RhdHNVUkwgfSBmcm9tICcuL2NvbmZpZy5qcydcclxuY29uc3Qgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XHJcbiAgc3RyaWN0OiB0cnVlLFxyXG4gIHN0YXRlOiB7XHJcbiAgICB0b3VhcGk6IFtdLFxyXG4gICAgY2F0ZWdvcmllc19jb3VudDoge30sXHJcbiAgICB0b3VhY2Nlc3N0aW1lOiAnJyxcclxuICAgIGRldGFpbDogW10sXHJcbiAgICBsYXN0ZGV0YWlsYWNjZXNzOiAnJyxcclxuICAgIGV2ZW50X3N0YXRzOiBbXSxcclxuICAgIHBsYXllcnM6IFtdLFxyXG4gICAgcmVzdWx0X2RhdGE6IFtdLFxyXG4gICAgdG90YWxfcGxheWVyczogbnVsbCxcclxuICAgIGVycm9yOiAnJyxcclxuICAgIGxvYWRpbmc6IHRydWUsXHJcbiAgICBsb2dpbl9sb2FkaW5nOiBmYWxzZSxcclxuICAgIGxvZ2luX3N1Y2Nlc3M6IGZhbHNlLFxyXG4gICAgYWNjZXNzVG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0X3Rva2VuJykgfHwgJycsXHJcbiAgICB1c2VyX2RhdGE6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0X3VzZXInKSB8fCAnJyxcclxuICAgIG9uZ29pbmc6IGZhbHNlLFxyXG4gICAgY3VycmVudFBhZ2U6IG51bGwsXHJcbiAgICBXUHRvdGFsOiBudWxsLFxyXG4gICAgV1BwYWdlczogbnVsbCxcclxuICAgIGNhdGVnb3J5OiAnJyxcclxuICAgIHBhcmVudHNsdWc6ICcnLFxyXG4gICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgdG91cm5leV90aXRsZTogJycsXHJcbiAgICBsb2dvX3VybDogJycsXHJcbiAgICB0b3RhbF9yb3VuZHM6IG51bGwsXHJcbiAgICBmaW5hbF9yb3VuZF9zdGF0czogW10sXHJcbiAgICByYXRpbmdfc3RhdHM6IFtdLFxyXG4gICAgc2hvd3N0YXRzOiBmYWxzZSxcclxuICAgIHBsYXllcl9sYXN0X3JkX2RhdGE6IFtdLFxyXG4gICAgcGxheWVyZGF0YTogW10sXHJcbiAgICBwbGF5ZXI6IG51bGwsXHJcbiAgICBhbGxfcGxheWVyczogW10sXHJcbiAgICBhbGxfcGxheWVyc190b3VfZGF0YTpbXSxcclxuICAgIHBsYXllcl9zdGF0czogW10sXHJcbiAgfSxcclxuICBnZXR0ZXJzOiB7XHJcbiAgICBQTEFZRVJfU1RBVFM6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9zdGF0cyxcclxuICAgIExBU1RSRERBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9sYXN0X3JkX2RhdGEsXHJcbiAgICBQTEFZRVJEQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJkYXRhLFxyXG4gICAgUExBWUVSOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXIsXHJcbiAgICBBTExfUExBWUVSUzogc3RhdGUgPT4gc3RhdGUuYWxsX3BsYXllcnMsXHJcbiAgICBBTExfUExBWUVSU19UT1VfREFUQTogc3RhdGUgPT4gc3RhdGUuYWxsX3BsYXllcnNfdG91X2RhdGEsXHJcbiAgICBTSE9XU1RBVFM6IHN0YXRlID0+IHN0YXRlLnNob3dzdGF0cyxcclxuICAgIFRPVUFQSTogc3RhdGUgPT4gc3RhdGUudG91YXBpLFxyXG4gICAgVE9VQUNDRVNTVElNRTogc3RhdGUgPT4gc3RhdGUudG91YWNjZXNzdGltZSxcclxuICAgIERFVEFJTDogc3RhdGUgPT4gc3RhdGUuZGV0YWlsLFxyXG4gICAgTEFTVERFVEFJTEFDQ0VTUzogc3RhdGUgPT4gc3RhdGUubGFzdGRldGFpbGFjY2VzcyxcclxuICAgIEVWRU5UU1RBVFM6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3N0YXRzLFxyXG4gICAgUExBWUVSUzogc3RhdGUgPT4gc3RhdGUucGxheWVycyxcclxuICAgIFRPVEFMUExBWUVSUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcGxheWVycyxcclxuICAgIFJFU1VMVERBVEE6IHN0YXRlID0+IHN0YXRlLnJlc3VsdF9kYXRhLFxyXG4gICAgUkFUSU5HX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5yYXRpbmdfc3RhdHMsXHJcbiAgICBFUlJPUjogc3RhdGUgPT4gc3RhdGUuZXJyb3IsXHJcbiAgICBMT0FESU5HOiBzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nLFxyXG4gICAgQUNDRVNTX1RPS0VOOiBzdGF0ZSA9PiBzdGF0ZS5hY2Nlc3NUb2tlbixcclxuICAgIFVTRVI6IHN0YXRlID0+IEpTT04ucGFyc2Uoc3RhdGUudXNlcl9kYXRhKSxcclxuICAgIExPR0lOX0xPQURJTkc6IHN0YXRlID0+IHN0YXRlLmxvZ2luX2xvYWRpbmcsXHJcbiAgICBMT0dJTl9TVUNDRVNTOiBzdGF0ZSA9PiBzdGF0ZS5sb2dpbl9zdWNjZXNzLFxyXG4gICAgQ1VSUlBBR0U6IHN0YXRlID0+IHN0YXRlLmN1cnJlbnRQYWdlLFxyXG4gICAgV1BUT1RBTDogc3RhdGUgPT4gc3RhdGUuV1B0b3RhbCxcclxuICAgIFdQUEFHRVM6IHN0YXRlID0+IHN0YXRlLldQcGFnZXMsXHJcbiAgICBDQVRFR09SWTogc3RhdGUgPT4gc3RhdGUuY2F0ZWdvcnksXHJcbiAgICBDQVRFR09SSUVTX0NPVU5UOiBzdGF0ZSA9PiBzdGF0ZS5jYXRlZ29yaWVzX2NvdW50LFxyXG4gICAgVE9UQUxfUk9VTkRTOiBzdGF0ZSA9PiBzdGF0ZS50b3RhbF9yb3VuZHMsXHJcbiAgICBGSU5BTF9ST1VORF9TVEFUUzogc3RhdGUgPT4gc3RhdGUuZmluYWxfcm91bmRfc3RhdHMsXHJcbiAgICBQQVJFTlRTTFVHOiBzdGF0ZSA9PiBzdGF0ZS5wYXJlbnRzbHVnLFxyXG4gICAgRVZFTlRfVElUTEU6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3RpdGxlLFxyXG4gICAgVE9VUk5FWV9USVRMRTogc3RhdGUgPT4gc3RhdGUudG91cm5leV90aXRsZSxcclxuICAgIE9OR09JTkdfVE9VUk5FWTogc3RhdGUgPT4gc3RhdGUub25nb2luZyxcclxuICAgIExPR09fVVJMOiBzdGF0ZSA9PiBzdGF0ZS5sb2dvX3VybCxcclxuICB9LFxyXG4gIG11dGF0aW9uczoge1xyXG4gICAgU0VUX1NIT1dTVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnNob3dzdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0ZJTkFMX1JEX1NUQVRTOiAoc3RhdGUsIHJlc3VsdHN0YXRzKSA9PiB7XHJcbiAgICAgIGxldCBsZW4gPSByZXN1bHRzdGF0cy5sZW5ndGg7XHJcbiAgICAgIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgc3RhdGUuZmluYWxfcm91bmRfc3RhdHMgPSBfLmxhc3QocmVzdWx0c3RhdHMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVURBVEE6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhcGkgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVERFVEFJTDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmRldGFpbCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhY2Nlc3N0aW1lID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sYXN0ZGV0YWlsYWNjZXNzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfV1BfQ09OU1RBTlRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuV1BwYWdlcyA9IHBheWxvYWRbJ3gtd3AtdG90YWxwYWdlcyddO1xyXG4gICAgICBzdGF0ZS5XUHRvdGFsID0gcGF5bG9hZFsneC13cC10b3RhbCddO1xyXG4gICAgfSxcclxuICAgIFNFVF9QTEFZRVJTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGEgPSBwYXlsb2FkLm1hcChmdW5jdGlvbiAodmFsLCBpbmRleCwga2V5KSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coa2V5W2luZGV4XVsncG9zdF90aXRsZSddKTtcclxuICAgICAgICBrZXlbaW5kZXhdWyd0b3Vfbm8nXSA9IGluZGV4ICsgMTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICB9KTtcclxuICAgICAgc3RhdGUudG90YWxfcGxheWVycyA9IHBheWxvYWQubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJzID0gYTtcclxuICAgIH0sXHJcbiAgICBTRVRfQUxMX1BMQVlFUlM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5hbGxfcGxheWVycyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0FMTF9QTEFZRVJTX1RPVV9EQVRBOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuYWxsX3BsYXllcnNfdG91X2RhdGEucHVzaChwYXlsb2FkKTtcclxuICAgIH0sXHJcbiAgICBTRVRfUkFUSU5HX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUucmF0aW5nX3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfUkVTVUxUOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IHAgPSBzdGF0ZS5wbGF5ZXJzO1xyXG4gICAgICBsZXQgciA9IF8ubWFwKHBheWxvYWQsIGZ1bmN0aW9uICh6KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHosIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICBsZXQgaSA9IG8ucG5vIC0gMTtcclxuICAgICAgICAgIG8ucGhvdG8gPSBwW2ldLnBob3RvO1xyXG4gICAgICAgICAgby5pZCA9IHBbaV0uaWQ7XHJcbiAgICAgICAgICBvLmNvdW50cnkgPSBwW2ldLmNvdW50cnk7XHJcbiAgICAgICAgICBvLmNvdW50cnkgPSBwW2ldLmNvdW50cnk7XHJcbiAgICAgICAgICBvLmNvdW50cnlfZnVsbCA9IHBbaV0uY291bnRyeV9mdWxsO1xyXG4gICAgICAgICAgby5nZW5kZXIgPSBwW2ldLmdlbmRlcjtcclxuICAgICAgICAgIG8uaXNfdGVhbSA9IHBbaV0uaXNfdGVhbTtcclxuICAgICAgICAgIGxldCB4ID0gby5vcHBvX25vIC0gMTtcclxuICAgICAgICAgIG8ub3BwX3Bob3RvID0gcFt4XS5waG90bztcclxuICAgICAgICAgIG8ub3BwX2lkID0gcFt4XS5pZDtcclxuICAgICAgICAgIHJldHVybiBvO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhyKTtcclxuICAgICAgc3RhdGUucmVzdWx0X2RhdGEgPSByO1xyXG4gICAgfSxcclxuICAgIFNFVF9PTkdPSU5HOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUub25nb2luZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5ldmVudF9zdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0NVUlJQQUdFOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuY3VycmVudFBhZ2UgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FUlJPUjogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmVycm9yID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9BRElORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvYWRpbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9VU0VSX0RBVEE6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS51c2VyX2RhdGEgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0dJTl9TVUNDRVNTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9naW5fc3VjY2VzcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPR0lOX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dpbl9sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9UQUxfUk9VTkRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG90YWxfcm91bmRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ0FURUdPUklFU19DT1VOVDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmNhdGVnb3JpZXNfY291bnQgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DQVRFR09SWTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIC8vIHZhciBjYXRlZ29yeSA9ICBwYXlsb2FkLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKS5tYXAoKHMpICA9PnMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnN1YnN0cmluZygxKSkuam9pbignICcpO1xyXG4gICAgICBzdGF0ZS5jYXRlZ29yeSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVVJORVlfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VybmV5X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfUEFSRU5UU0xVRzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhcmVudHNsdWcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVF9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HT19VUkw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dvX3VybCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgLy9cclxuICAgIENPTVBVVEVfUExBWUVSX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHN0YXRlLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgICAgbGV0IGxhc3Ryb3VuZCA9IHN0YXRlLnJlc3VsdF9kYXRhW2xlbiAtIDFdO1xyXG4gICAgICBsZXQgcGxheWVyID0gKHN0YXRlLnBsYXllciA9IF8uZmlsdGVyKHN0YXRlLnBsYXllcnMsIHsgaWQ6IHBheWxvYWQgfSkpO1xyXG4gICAgICBsZXQgbmFtZSA9IF8ubWFwKHBsYXllciwgJ3Bvc3RfdGl0bGUnKSArICcnOyAvLyBjb252ZXJ0IHRvIHN0cmluZ1xyXG4gICAgICBsZXQgcGxheWVyX3RubyA9IHBhcnNlSW50KF8ubWFwKHBsYXllciwgJ3RvdV9ubycpKTtcclxuICAgICAgc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSA9IF8uZmluZChsYXN0cm91bmQsIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG5cclxuICAgICAgbGV0IHBkYXRhID0gKHN0YXRlLnBsYXllcmRhdGEgPSBfLmNoYWluKHN0YXRlLnJlc3VsdF9kYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgIHJldHVybiBfLmZpbHRlcihtLCB7IHBubzogcGxheWVyX3RubyB9KTtcclxuICAgICAgICB9KS52YWx1ZSgpKTtcclxuXHJcbiAgICAgIGxldCBhbGxTY29yZXMgPSAoc3RhdGUucGxheWVyX3N0YXRzLmFsbFNjb3JlcyA9IF8uY2hhaW4ocGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICBsZXQgc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gc2NvcmVzO1xyXG4gICAgICAgIH0pLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbE9wcFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgb3Bwc2NvcmVzID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAnb3Bwb19zY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBvcHBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsUmFua3MgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zY29yZSA9PSBwYXJzZUludChwSGlTY29yZSk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdGhpc1xyXG4gICAgICAgICksXHJcbiAgICAgICAgJ3JvdW5kJ1xyXG4gICAgICApO1xyXG4gICAgICBsZXQgcExvU2NvcmVSb3VuZHMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihcclxuICAgICAgICAgIF8uZmxhdHRlbkRlZXAocGRhdGEpLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2NvcmUgPT0gcGFyc2VJbnQocExvU2NvcmUpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApLFxyXG4gICAgICAgICdyb3VuZCdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcyA9IHBIaVNjb3JlUm91bmRzLmpvaW4oKTtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBMb1Njb3JlUm91bmRzID0gcExvU2NvcmVSb3VuZHMuam9pbigpO1xyXG5cclxuICAgICAgbGV0IHBSYnlSID0gXy5tYXAocGRhdGEsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgICBpZiAobC5yZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICd3b24nO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChsLnJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdkcmV3JztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdsb3N0JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBzdGFydGluZyA9ICdyZXBseWluZyc7XHJcbiAgICAgICAgICBpZiAobC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgc3RhcnRpbmcgPSAnc3RhcnRpbmcnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PSAnQVInKSB7XHJcbiAgICAgICAgICAgIGwucmVwb3J0ID1cclxuICAgICAgICAgICAgICAnSW4gcm91bmQgJyArXHJcbiAgICAgICAgICAgICAgbC5yb3VuZCArXHJcbiAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPGVtIHYtaWY9XCJsLnN0YXJ0XCI+LCAoJyArXHJcbiAgICAgICAgICAgICAgc3RhcnRpbmcgK1xyXG4gICAgICAgICAgICAgICcpPC9lbT4gaXMgcGxheWluZyA8c3Ryb25nPicgK1xyXG4gICAgICAgICAgICAgIGwub3BwbyArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPi4gUmVzdWx0cyBhcmUgYmVpbmcgYXdhaXRlZCc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgKyBsLnJvdW5kICsgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICsgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgKyBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBwbGF5ZWQgPHN0cm9uZz4nICsgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IGFuZCAnICsgcmVzdWx0ICtcclxuICAgICAgICAgICAgICAnIDxlbT4nICsgbC5zY29yZSArICcgLSAnICtcclxuICAgICAgICAgICAgICBsLm9wcG9fc2NvcmUgKyAnLDwvZW0+IGEgZGlmZmVyZW5jZSBvZiAnICtcclxuICAgICAgICAgICAgICBsLmRpZmYgKyAnLiA8c3BhbiBjbGFzcz1cInN1bW1hcnlcIj48ZW0+JyArXHJcbiAgICAgICAgICAgICAgbmFtZSArICc8L2VtPiBpcyByYW5rZWQgPHN0cm9uZz4nICsgbC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiB3aXRoIDxzdHJvbmc+JyArIGwucG9pbnRzICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IHBvaW50cyBhbmQgYSBjdW11bGF0aXZlIHNwcmVhZCBvZiAnICtcclxuICAgICAgICAgICAgICBsLm1hcmdpbiArICcgPC9zcGFuPic7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gbDtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wUmJ5UiA9IF8uZmxhdHRlbkRlZXAocFJieVIpO1xyXG5cclxuICAgICAgbGV0IGFsbFdpbnMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihfLmZsYXR0ZW5EZWVwKHBkYXRhKSwgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiAnd2luJyA9PSBwLnJlc3VsdDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0V2lucyA9IF8uZmlsdGVyKGFsbFdpbnMsIFsnc3RhcnQnLCAneSddKS5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ24nXSkubGVuZ3RoO1xyXG4gICAgICBsZXQgc3RhcnRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICBpZiAocC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydHMgPSBzdGFydHMubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbGllcyA9IHN0YXRlLnRvdGFsX3JvdW5kcyAtIHN0YXJ0cy5sZW5ndGg7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWN0aW9uczoge1xyXG4gICAgRE9fU1RBVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfU0hPV1NUQVRTJywgcGF5bG9hZCk7XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgQVVUSF9UT0tFTihjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHthdXRoVVJMfXRva2VuL3ZhbGlkYXRlYDtcclxuICAgICAgLy9sZXQgdXJsID0gcG9zdFVSTDtcclxuICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0aXRsZTogJ1BsaXVzIEFsaXR0bGUgdGVzdCBBUEkgUG9zdGluZycsXHJcbiAgICAgICAgICBjb250ZW50OiAnQW5vdGhlciBtaW5vciBQb3N0IGZyb20gV1AgQVBJJyxcclxuICAgICAgICAgIHN0YXR1czogJ3B1Ymxpc2gnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgICR7cGF5bG9hZH1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgIH0pXHJcbiAgICAgICAgbGV0IHJlcyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcclxuICAgICAgICBpZiAocmVzLmNvZGUgPT0gXCJqd3RfYXV0aF92YWxpZF90b2tlblwiKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRE9fTE9HSU4oY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2F1dGhVUkx9dG9rZW5gO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KHVybCwge1xyXG4gICAgICAgIHVzZXJuYW1lOiBwYXlsb2FkLnVzZXIsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHBheWxvYWQucGFzc1xyXG4gICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS50b2tlbikge1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RfdG9rZW4nLCBKU09OLnN0cmluZ2lmeShkYXRhLnRva2VuKSlcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0X3VzZXInLCBKU09OLnN0cmluZ2lmeShkYXRhLnVzZXJfZGlzcGxheV9uYW1lKSlcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9TVUNDRVNTJywgdHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCBmYWxzZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVyci5tZXNzYWdlLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGFzeW5jIEdFVF9BTExfUExBWUVSUyhjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtwcm9maWxlVVJMfWA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCggdXJsLCB7XHJcbiAgICAgICAgICAvL3BhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0sXHJcbiAgICAgICAgICAvLyBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICAke3Rva2VufWB9XHJcbiAgICAgICAgfSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgciA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICBsZXQgZGF0YSA9IF8ubWFwKHIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICBkLmNvdW50cnkgPSBkLmNvdW50cnkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGQuZ2VuZGVyID0gZC5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgcmV0dXJuIGQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgR0VUX1BMQVlFUl9UT1VfREFUQShjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtzdGF0c1VSTH0ke3BheWxvYWR9YDtcclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KCB1cmwsIHtcclxuICAgICAgICAgIC8vcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVxyXG4gICAgICAgIGRhdGEuY291bnRyeSA9IGRhdGEuY291bnRyeS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGRhdGEuZ2VuZGVyID0gZGF0YS5nZW5kZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0FMTF9QTEFZRVJTX1RPVV9EQVRBJywgZGF0YSk7XHJcbiAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGUudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRkVUQ0hfQ0FURUdPUklFUyAoY29udGV4dCwgcGF5bG9hZCkgIHtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9jYXRlZ29yeWA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwpXHJcbiAgICAgIHRyeXtcclxuXHJcbiAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfQ0FURUdPUklFU19DT1VOVCcsIGRhdGEpO1xyXG5cclxuICAgICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0FQSSAoY29udGV4dCwgcGF5bG9hZCkgIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICAvLyBsZXQgdG9rZW4gPSBjb250ZXh0LmdldHRlcnMuQUNDRVNTX1RPS0VOXHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCh1cmwsIHtcclxuICAgICAgICAgIHBhcmFtczogeyBwYWdlOiBwYXlsb2FkLnBhZ2UsIHRfY2F0ZWdvcnk6IHBheWxvYWQuY2F0ZWdvcnkgfSxcclxuICAgICAgICAgIC8vIGhlYWRlcnM6IHsnQXV0aG9yaXphdGlvbic6IGBCZWFyZXIgICR7dG9rZW59YH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnR2V0dGluZyBsaXN0cyBvZiB0b3VybmFtZW50cycpO1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLm1hcChkYXRhID0+IHtcclxuICAgICAgICAgICAgLy8gRm9ybWF0IGFuZCBhc3NpZ24gVG91cm5hbWVudCBzdGFydCBkYXRlIGludG8gYSBsZXRpYWJsZVxyXG4gICAgICAgICAgICBsZXQgc3RhcnREYXRlID0gZGF0YS5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSBtb21lbnQobmV3IERhdGUoc3RhcnREYXRlKSkuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICdkZGRkLCBNTU1NIERvIFlZWVknXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKG1vbWVudChoZWFkZXJzLmRhdGUpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1vbWVudChoZWFkZXJzLmRhdGUpLCBcImZvbnQtc2l6ZTozMHB4O2NvbG9yOmdyZWVuO1wiKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTEFTVF9BQ0NFU1NfVElNRScsIGhlYWRlcnMuZGF0ZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VEQVRBJywgZGF0YSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NVUlJQQUdFJywgcGF5bG9hZCk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0RFVEFJTCAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pO1xyXG4gICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgZGF0YSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9EQVRBIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjb250ZXh0KTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9kYXRhYDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBkYXRhLnBsYXllcnM7XHJcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdGRVRDSCBEQVRBICRzdG9yZScpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IGxvZ28gPSBkYXRhLnRvdXJuZXlbMF0uZXZlbnRfbG9nby5ndWlkO1xyXG4gICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICBsZXQgcmF0aW5nX3N0YXRzID0gbnVsbDtcclxuICAgICAgICBpZiAoZGF0YS5zdGF0c19qc29uKSB7XHJcbiAgICAgICAgICByYXRpbmdfc3RhdHMgPSBKU09OLnBhcnNlKGRhdGEuc3RhdHNfanNvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkFUSU5HX1NUQVRTJywgcmF0aW5nX3N0YXRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCAoZXJyb3IpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIEZFVENIX1JFU0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10X2RhdGFgO1xyXG4gICAgICAgICAgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pLnRoZW4ocmVzcG9uc2U9PntcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBkYXRhLmV2ZW50X2NhdGVnb3J5WzBdLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgICBsZXQgcGFyZW50X3NsdWcgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF9uYW1lO1xyXG4gICAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRTVEFUUycsIGRhdGEudG91cm5leSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JFU1VMVCcsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HT19VUkwnLCBsb2dvKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9UQUxfUk9VTkRTJywgdG90YWxfcm91bmRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+e1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgc3RvcmU7XHJcbiJdfQ==
