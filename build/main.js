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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mapGetters = Vuex.mapGetters; // let LoadingAlert, ErrorAlert;

var scrList = Vue.component('scrList', {
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n            <h2 class=\"bebas text-center\">\n                <i class=\"fa fa-trophy\"></i> Tournaments\n            </h2>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 col-lg-10 offset-lg-1\">\n          <div class=\"d-flex flex-column flex-lg-row align-items-center justify-content-around\">\n            <div class=\"text-center my-4 mx-1\" title=\"All tourneys\">\n              <button type=\"button\" class=\"tagbutton btn btn-light\" @click=\"fetchList(currentPage)\" :class=\"{'active':0 === activeList}\"> All <span class=\"badge badge-dark\">\n              {{total_tourneys}} </span>\n              </button>\n            </div>\n            <div v-for=\"cat in categories\"  :key=\"cat.id\"\n            class=\"text-center my-4 mx-1\" v-if=\"cat.count>0\">\n              <button type=\"button\" @click=\"filterCat(cat.id)\" class=\"  tagbutton btn\" :class=\"{\n              'btn-light':cat.slug === 'general',\n              'btn-light':cat.slug === 'open',\n              'btn-light':cat.slug === 'intermediate',\n              'btn-light':cat.slug === 'masters',\n              'btn-light':cat.slug === 'ladies',\n              'btn-light':cat.slug === 'veterans',\n              'active':cat.id === activeList,\n              }\"> {{cat.name}} <span class=\"badge badge-dark\"> {{cat.count}} </span></button>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row justify-content-start align-contents-center\">\n        <div class=\"col-12\">\n          <div class=\"d-flex flex-column flex-lg-row justify-content-around align-items-center\">\n            <b-pagination :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n            :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n            <p class=\"text-muted\"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class=\"emphasize\">{{WPtotal}}</span> total <em>{{activeCat}}</em> tournaments!</small></p>\n          </div>\n        </div>\n      </div>\n      <div class=\"row\">\n      <div class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\" :key=\"item.id\">\n      <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft\" >\n        <div class=\"mr-lg-5\">\n          <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n          <b-img fluid thumbnail rounded=\"circle\" class=\"logo\"\n                :src=\"item.event_logo\":alt=\"item.event_logo_title\" />\n          </router-link>\n        </div>\n        <div class=\"mr-lg-auto\">\n          <h4 class=\"mb-1\">\n          <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n              {{item.title}}\n          </router-link>\n          </h4>\n          <div class=\"text-center\">\n          <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-calendar\"></i>\n                  {{item.start_date}}\n              </small>\n          </div>\n        <div class=\"d-inline p-1\">\n            <small><i class=\"fa fa-map-marker\"></i>\n                {{item.venue}}\n            </small>\n        </div>\n        <div class=\"d-inline p-1\">\n            <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                </small>\n            </router-link>\n        </div>\n        <ul class=\"list-unstyled list-inline text-center category-list\">\n            <li class=\"list-inline-item mx-1\"\n            v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n        </ul>\n        </div>\n        </div>\n      </div>\n      </div>\n      </div>\n      <div class=\"row justify-content-start align-items-center\">\n        <div class=\"col-12 col-lg-10 offset-lg-1\">\n          <b-pagination :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n          :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n          <p class=\"text-muted\"><small>You are on page {{currentPage}} of {{WPpages}} pages. There are <span class=\"emphasize\">{{WPtotal}}</span> total <em>{{activeCat}}</em> tournaments!</small></p>\n        </div>\n      </div>\n   </template>\n</div>\n",
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
  template: "\n  <div class=\"row\">\n  <div class=\"col-10 offset-1 justify-content-center align-items-center\">\n    <div class=\"row\">\n      <div class=\"col-12 d-flex justify-content-center align-items-center\">\n        <b-button @click=\"view='profile'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='profile'\" :pressed=\"view ==='profile'\" title=\"Player Profile\">\n        <b-icon icon=\"person\"></b-icon>Profile</b-button>\n        <b-button @click=\"view='head2head'\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"view ==='head2head'\" :pressed=\"view ==='head2head'\" title=\"Head To Head\">\n        <b-icon icon=\"people-fill\"></b-icon>H2H</b-button>\n      </div>\n    </div>\n\n    <h3 v-if=\"view ==='profile'\" class=\"bebas mb-2\">\n    <b-icon icon=\"person\"></b-icon> Stats Profile</h3>\n    <h3 class=\"mb-2 bebas\" v-if=\"view ==='head2head'\">\n    <b-icon icon=\"people-fill\"></b-icon> Head to Head</h3>\n\n    <template v-if=\"view ==='profile'\">\n      <div v-if=\"view ==='profile' && (all_players.length <=0)\" class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n          <b-spinner variant=\"primary\" style=\"width: 6rem; height: 6rem;\" label=\"Loading players\"></b-spinner>\n      </div>\n      <div v-else class=\"my-5 mx-auto w-75 d-md-flex flex-md-row align-items-center justify-content-center\">\n        <div class=\"mr-md-3 mb-sm-2\">\n          <label for=\"search\">Player name:</label>\n        </div>\n        <div class=\"ml-md-2 flex-grow-1\">\n          <vue-simple-suggest\n          v-model=\"psearch\"\n          display-attribute=\"player\"\n          value-attribute=\"slug\"\n          @select=\"getprofile\"\n          :styles=\"autoCompleteStyle\"\n          :destyled=true\n          :filter-by-query=true\n          :list=\"all_players\"\n          placeholder=\"Player name here\"\n          id=\"search\"\n          type=\"search\">\n          </vue-simple-suggest>\n        </div>\n      </div>\n      <div v-show=\"loading\">\n        <div class=\"d-flex flex-md-row-reverse my-2 justify-content-center align-items-center\">\n        <span class=\"text-success\" v-show=\"psearch && !notfound\">Searching <em>{{psearch}}</em>...</span>\n        <span class=\"text-danger\" v-show=\"psearch && notfound\"><em>{{psearch}}</em> not found!</span>\n        <b-spinner v-show=\"!notfound\" style=\"width: 6rem; height: 6rem;\" type=\"grow\" variant=\"success\" label=\"Busy\"></b-spinner>\n        </div>\n      </div>\n      <div v-if=\"pdata.player\" class=\"p-2 mx-auto d-md-flex flex-md-row align-items-start justify-content-around\">\n          <div v-show=\"psearch ===pdata.player && !notfound\" class=\"d-flex flex-column text-center align-items-center animated fadeIn\">\n          <h4>Profile Summary</h4>\n            <h5 class=\"oswald\">{{pdata.player}}\n            <span class=\"d-inline-block mx-auto p-2\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+pdata.country |lowercase\" title=\"pdata.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': pdata.gender == 'm','fa-female': pdata.gender == 'f','fa-users': pdata.is_team == 'yes' }\" aria-hidden=\"true\"></i>\n            </span>\n            </h5>\n            <img :src='pdata.photo' :alt=\"pdata.player\" v-bind=\"imgProps\"></img>\n            <div class=\"text-uppercase text-left\" style=\"font-size:0.9em;\">\n              <div class=\"lead text-center\">{{pdata.total_tourneys | pluralize('tourney',{ includeNumber: true })}}\n              </div>\n              <div class=\"d-block text-primary font-weight-light\">\n               Tourney <span class=\"text-capitalize\">(All Time)</span> Honors:\n                <ul class=\"list-inline\">\n                  <li title=\"First Prize\" class=\"list-inline-item goldcol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(1)}}</span>\n                  </li>\n                  <li title=\"Second Prize\" class=\"list-inline-item silvercol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(2)}}</span>\n                  </li>\n                  <li title=\"Third Prize\" class=\"list-inline-item bronzecol font-weight-bold\">\n                    <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>\n                    <span class=\"badge\">{{tourney_podiums(3)}}</span>\n                  </li>\n                </ul>\n              </div>\n              <span class=\"d-block text-info font-weight-light text-capitalize\">{{pdata.total_games | pluralize('game',{ includeNumber: true })}}</span>\n              <span class=\"d-block text-success font-weight-light text-capitalize\">{{pdata.total_wins | pluralize('win',{ includeNumber: true })}} <em>({{pdata.percent_wins}}%)</em></span>\n              <span class=\"d-block text-warning font-weight-light text-capitalize\"> {{pdata.total_draws | pluralize('draw',{ includeNumber: true })}}</span>\n              <span class=\"d-block text-danger font-weight-light text-capitalize\"> {{pdata.total_losses | pluralize(['loss','losses'],{ includeNumber: true })}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Score: {{pdata.ave_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Opponents Score: {{pdata.ave_opp_score}}</span>\n              <span class=\"d-block text-primary font-weight-light text-capitalize\">Ave Cum. Mar: {{pdata.ave_margin}}</span>\n            </div>\n          </div>\n        <div>\n          <div v-show=\"!loading\">\n          <h4 title=\"Performance summary per tourney\">Competitions</h4>\n            <div class=\"p-1 mb-1 bg-light\" v-for=\"(c, tindex) in pdata.competitions\" :key=\"c.id\">\n              <h5 class=\"oswald text-left\">{{c.title}}\n              <b-badge title=\"Final Rank\">{{c.final_rd.rank}}</b-badge></h5>\n                  <button class=\"btn btn-link text-decoration-none\" type=\"button\" title=\"Click to view player scoresheet for this event\">\n                  <router-link :to=\"{ name:'Scoresheet', params:{  event_slug:c.slug, pno:c.final_rd.pno}}\">\n                  <b-icon icon=\"documents-alt\"></b-icon> Scorecard\n                  </router-link>\n                  </button>\n                  <b-button class=\"text-decoration-none\" variant=\"link\" v-b-toggle=\"collapse+tindex+1\" title=\"Click to toggle player stats for this event\">\n                  <b-icon icon=\"bar-chart-fill\" variant=\"success\" flip-h></b-icon>Statistics\n                  </b-button>\n                  <b-collapse :id=\"collapse+tindex+1\">\n                    <div class=\"card card-body\">\n                    <h6 class=\"oswald\">{{c.final_rd.player}} Event Stats Summary</h6>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Points: {{c.final_rd.points}}/{{c.final_rd.round}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Final Pos: {{c.final_rd.position}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item text-success font-weight-light text-capitalize\">\n                        Won: {{c.final_rd.wins}}\n                      </li>\n                      <li class=\"list-inline-item text-warning font-weight-light text-capitalize\">\n                        Drew: {{c.final_rd.draws}}\n                      </li>\n                      <li class=\"list-inline-item text-danger font-weight-light text-capitalize\">\n                        Lost: {{c.final_rd.losses}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Score: {{c.final_rd.ave_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Average Opp. Score: {{c.final_rd.ave_opp_score}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Score: {{c.final_rd.total_score}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Total Opp. Score: {{c.final_rd.total_oppscore}}\n                      </li>\n                      <li class=\"list-inline-item font-weight-light text-capitalize\">\n                        Margin: {{c.final_rd.margin}}\n                      </li>\n                    </ul>\n                    <ul class=\"list-inline\" style=\"font-size:0.9em\">\n                      <li :class=\"{'text-success': c.final_rd.result == 'win','text-warning': c.final_rd.result == 'draw',\n                      'text-danger': c.final_rd.result == 'loss'}\"\n                      class=\"list-inline-item font-weight-light\">\n                      Final game was a {{c.final_rd.score}} - {{c.final_rd.oppo_score}} {{c.final_rd.result}} (a difference of {{c.final_rd.diff|addplus}}) against {{c.final_rd.oppo}}\n                      </li>\n                    </ul>\n                  </div>\n                </b-collapse>\n            </div>\n          </div>\n        </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"my-5 mx-auto d-flex flex-row align-items-center justify-content-center\">\n      <p>Coming Soon!</p>\n      </div>\n     <!-- <b-form-row class=\"my-1\">\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label for=\"search1\">Player 1</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input placeholder=\"Start typing player name\" size=\"sm\" id=\"search1\" v-model=\"search1\" type=\"search\"></b-form-input>\n        </b-col>\n        <b-col sm=\"1\" class=\"ml-sm-auto\">\n        <label class=\"ml-2\" for=\"search2\">Player 2</label>\n        </b-col>\n        <b-col sm=\"3\" class=\"mr-sm-auto\">\n        <b-form-input size=\"sm\" placeholder=\"Start typing player name\" id=\"search2\" v-model=\"search2\" type=\"search\"></b-form-input>\n        </b-col>\n      </b-form-row>\n      <b-row cols=\"4\">\n        <b-col></b-col>\n        <b-col>{{search1}}</b-col>\n        <b-col></b-col>\n        <b-col>{{search2}}</b-col>\n      </b-row>\n      -->\n    </template>\n  </div>\n</div>\n  ",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Byb2ZpbGUuanMiLCJ2dWUvcGFnZXMvcmF0aW5nX3N0YXRzLmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc2NvcmVzaGVldC5qcyIsInZ1ZS9wYWdlcy9zdGF0cy5qcyIsInZ1ZS9wYWdlcy90b3AuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN6dEJBLElBQU0sT0FBTyxHQUFHLGlCQUFoQjs7QUFDQSxJQUFNLE9BQU8sR0FBRyx1QkFBaEI7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsMEJBQW5COztBQUNBLElBQU0sUUFBUSxHQUFHLHlCQUFqQjs7Ozs7Ozs7QUNIQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxHQUFHLENBQUMsTUFBSixDQUFXLE9BQVgsRUFBb0IsVUFBVSxLQUFWLEVBQWlCO0FBQ25DLE1BQUksQ0FBQyxLQUFMLEVBQVksT0FBUSxFQUFSO0FBQ1osRUFBQSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQU4sRUFBUjtBQUNBLE1BQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFnQixXQUFoQixFQUFaO0FBQ0EsTUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQU4sR0FBYSxLQUFiLENBQW1CLEdBQW5CLENBQVI7QUFDQSxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFaLENBQVo7QUFDQSxTQUFPLEtBQUssR0FBRyxJQUFSLEdBQWUsSUFBdEI7QUFDRCxDQVBEO0FBU0EsR0FBRyxDQUFDLE1BQUosQ0FBVyxXQUFYLEVBQXdCLFVBQVUsS0FBVixFQUFpQjtBQUNyQyxNQUFJLENBQUMsS0FBTCxFQUFZLE9BQU8sRUFBUDtBQUNaLEVBQUEsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFOLEVBQVI7QUFDQSxTQUFPLEtBQUssQ0FBQyxNQUFOLENBQWEsQ0FBYixFQUFnQixXQUFoQixFQUFQO0FBQ0QsQ0FKSDtBQU1BLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBWCxFQUFzQixVQUFVLEtBQVYsRUFBaUI7QUFDckMsTUFBSSxDQUFDLEtBQUwsRUFBWSxPQUFPLEVBQVA7QUFDWixFQUFBLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBTixFQUFSO0FBQ0EsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxNQUFNLENBQUMsS0FBRCxDQUFqQixDQUFSOztBQUNBLE1BQUksQ0FBQyxLQUFLLFFBQU4sSUFBa0IsTUFBTSxDQUFDLENBQUQsQ0FBTixLQUFjLEtBQWhDLElBQXlDLENBQUMsR0FBRyxDQUFqRCxFQUFvRDtBQUNsRCxXQUFPLE1BQU0sS0FBYjtBQUNEOztBQUNELFNBQU8sS0FBUDtBQUNELENBUkQ7QUFVQSxHQUFHLENBQUMsTUFBSixDQUFXLFFBQVgsRUFBcUIsVUFBVSxLQUFWLEVBQWlCO0FBQ3BDLFNBQU8sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQVgsQ0FBZixFQUFrQyxJQUFsQyxFQUF3QyxDQUF4QyxDQUFQO0FBQ0QsQ0FGRDtBQUlFLElBQU0sTUFBTSxHQUFHLENBQ2I7QUFDRSxFQUFBLElBQUksRUFBRSxjQURSO0FBRUUsRUFBQSxJQUFJLEVBQUUsY0FGUjtBQUdFLEVBQUEsU0FBUyxFQUFFLGdCQUhiO0FBSUUsRUFBQSxJQUFJLEVBQUU7QUFBRSxJQUFBLEtBQUssRUFBRTtBQUFUO0FBSlIsQ0FEYSxFQU9iO0FBQ0UsRUFBQSxJQUFJLEVBQUUsb0JBRFI7QUFFRSxFQUFBLElBQUksRUFBRSxlQUZSO0FBR0UsRUFBQSxTQUFTLEVBQUUsa0JBSGI7QUFJRSxFQUFBLElBQUksRUFBRTtBQUFFLElBQUEsS0FBSyxFQUFFO0FBQVQ7QUFKUixDQVBhLEVBYWI7QUFDRSxFQUFBLElBQUksRUFBRSx5QkFEUjtBQUVFLEVBQUEsSUFBSSxFQUFFLFlBRlI7QUFHRSxFQUFBLFNBQVMsRUFBRSxvQkFIYjtBQUlFLEVBQUEsS0FBSyxFQUFFLElBSlQ7QUFLRSxFQUFBLElBQUksRUFBRTtBQUFFLElBQUEsS0FBSyxFQUFFO0FBQVQ7QUFMUixDQWJhLEVBb0JiO0FBQ0UsRUFBQSxJQUFJLEVBQUUsOEJBRFI7QUFFRSxFQUFBLElBQUksRUFBRSxZQUZSO0FBR0UsRUFBQSxTQUFTLEVBQUUsc0JBSGI7QUFJRSxFQUFBLElBQUksRUFBRTtBQUFFLElBQUEsS0FBSyxFQUFFO0FBQVQ7QUFKUixDQXBCYSxDQUFmO0FBNEJGLElBQU0sTUFBTSxHQUFHLElBQUksU0FBSixDQUFjO0FBQzNCLEVBQUEsSUFBSSxFQUFFLFNBRHFCO0FBRTNCLEVBQUEsTUFBTSxFQUFFLE1BRm1CLENBRVg7O0FBRlcsQ0FBZCxDQUFmO0FBSUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsVUFBQyxFQUFELEVBQUssSUFBTCxFQUFXLElBQVgsRUFBb0I7QUFDcEMsRUFBQSxRQUFRLENBQUMsS0FBVCxHQUFpQixFQUFFLENBQUMsSUFBSCxDQUFRLEtBQXpCO0FBQ0EsRUFBQSxJQUFJO0FBQ0wsQ0FIRDtBQUtBLElBQUksR0FBSixDQUFRO0FBQ04sRUFBQSxFQUFFLEVBQUUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FERTtBQUVOLEVBQUEsTUFBTSxFQUFOLE1BRk07QUFHTixFQUFBLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFiLENBSEY7QUFJTixFQUFBLEtBQUssRUFBTDtBQUpNLENBQVI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hFQSxJQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLFNBQWQsRUFBd0I7QUFDekMsRUFBQSxRQUFRO0FBRGlDLENBQXhCLENBQW5COztBQTZCQSxJQUFJLFVBQVUsR0FBRSxHQUFHLENBQUMsU0FBSixDQUFjLE9BQWQsRUFBdUI7QUFDcEMsRUFBQSxRQUFRLHVYQUQ0QjtBQVdwQyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU8sRUFBUDtBQUNEO0FBYm1DLENBQXZCLENBQWhCOztBQWVDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxVQUF0QjtBQUNBLElBQUksU0FBUyxHQUFFLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUF1QjtBQUNwQyxFQUFBLFFBQVEsK25EQUQ0QjtBQThCckMsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxJQUFJLEVBQUU7QUFDSixRQUFBLElBQUksRUFBQyxFQUREO0FBRUosUUFBQSxJQUFJLEVBQUU7QUFGRjtBQURELEtBQVA7QUFNQSxHQXJDbUM7QUFzQ3BDLEVBQUEsT0F0Q29DLHFCQXNDMUI7QUFDVCxRQUFHLEtBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsQ0FBeEIsRUFDQTtBQUNFLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsWUFBckIsRUFBbUMsS0FBSyxNQUF4QztBQUNBOztBQUNELElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLFlBQWpCO0FBQ0YsR0E1Q29DO0FBNkNyQyxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsUUFETyxvQkFDRSxHQURGLEVBQ087QUFDWixNQUFBLEdBQUcsQ0FBQyxjQUFKO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBSyxJQUFwQixDQUFaO0FBQ0EsV0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixVQUFyQixFQUFpQyxLQUFLLElBQXRDO0FBQ0QsS0FMTTtBQU1QLElBQUEsTUFOTyxvQkFNRTtBQUNQO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLGdCQUFaO0FBQ0Q7QUFUTSxHQTdDNEI7QUF3RHBDLEVBQUEsUUFBUSxrQ0FDSCxVQUFVLENBQUM7QUFDWixJQUFBLGFBQWEsRUFBRSxlQURIO0FBRVosSUFBQSxhQUFhLEVBQUUsZUFGSDtBQUdaLElBQUEsWUFBWSxFQUFFLE1BSEY7QUFJWixJQUFBLE1BQU0sRUFBRTtBQUpJLEdBQUQsQ0FEUDtBQVFOLElBQUEsVUFSTSx3QkFRTztBQUNaLGFBQU8sS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLE1BQWYsR0FBd0IsQ0FBeEIsSUFBNkIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLE1BQWYsR0FBd0IsQ0FBNUQ7QUFDRDtBQVZNO0FBeEQ0QixDQUF2QixDQUFmOzs7Ozs7Ozs7Ozs7Ozs7QUM3Q0Q7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsTUFBZCxFQUFzQjtBQUNyQyxFQUFBLFFBQVEsMmxSQUQ2QjtBQTRJckMsRUFBQSxVQUFVLEVBQUU7QUFDVixJQUFBLE9BQU8sRUFBRSxvQkFEQztBQUVWLElBQUEsS0FBSyxFQUFFLGtCQUZHO0FBR1YsSUFBQSxVQUFVLEVBQUUsc0JBSEY7QUFJVixJQUFBLFFBQVEsRUFBRSxvQkFKQTtBQUtWLElBQUEsT0FBTyxFQUFFLG1CQUxDO0FBTVYsSUFBQSxPQUFPLEVBQUUsd0JBTkM7QUFPVixJQUFBLFNBQVMsRUFBRSxxQkFQRDtBQVFWLElBQUEsTUFBTSxFQUFFLGFBUkU7QUFTVixJQUFBLE1BQU0sRUFBRSxhQVRFO0FBVVYsSUFBQSxLQUFLLEVBQUUsYUFWRztBQVdWLElBQUEsV0FBVyxFQUFFLGtCQVhIO0FBWVYsSUFBQSxXQUFXLEVBQUUsa0JBWkg7QUFhVixJQUFBLFNBQVMsRUFBRSxxQkFiRDtBQWNWLElBQUEsU0FBUyxFQUFFLGdCQWREO0FBZVYsSUFBQSxZQUFZLEVBQUUsbUJBZko7QUFnQlYsSUFBQSxRQUFRLEVBQUUsZUFoQkE7QUFpQlYsSUFBQSxRQUFRLEVBQUUsZUFqQkE7QUFrQlY7QUFDQTtBQUNBLElBQUEsVUFBVSxFQUFFLHNCQXBCRjtBQXFCVixJQUFBLFVBQVUsRUFBRSxlQXJCRjtBQXNCVixJQUFBLFFBQVEsRUFBRTtBQXRCQSxHQTVJeUI7QUFvS3JDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMLE1BQUEsSUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsVUFEcEI7QUFFTCxNQUFBLElBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxJQUZiO0FBR0wsTUFBQSxZQUFZLEVBQUUsRUFIVDtBQUlMLE1BQUEsUUFBUSxFQUFFLEtBSkw7QUFLTCxNQUFBLFFBQVEsRUFBRSxFQUxMO0FBTUwsTUFBQSxRQUFRLEVBQUUsQ0FOTDtBQU9MLE1BQUEsU0FBUyxFQUFFLENBUE47QUFRTCxNQUFBLFlBQVksRUFBRSxDQVJUO0FBU0wsTUFBQSxXQUFXLEVBQUUsRUFUUjtBQVVMLE1BQUEsT0FBTyxFQUFFLEVBVko7QUFXTCxNQUFBLGNBQWMsRUFBRSxLQVhYO0FBWUwsTUFBQSxxQkFBcUIsRUFBRSxFQVpsQjtBQWFMLE1BQUEsVUFBVSxFQUFFLEVBYlA7QUFjTCxNQUFBLFFBQVEsRUFBRSxFQWRMO0FBZUwsTUFBQSxLQUFLLEVBQUU7QUFmRixLQUFQO0FBaUJELEdBdExvQztBQXVMckMsRUFBQSxPQUFPLEVBQUUsbUJBQVc7QUFDbEIsUUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixHQUFoQixDQUFSO0FBQ0EsSUFBQSxDQUFDLENBQUMsS0FBRjtBQUNBLFNBQUssWUFBTCxHQUFvQixDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBcEI7QUFDQSxTQUFLLFNBQUw7QUFDRCxHQTVMb0M7QUE2THJDLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxTQUFTLEVBQUU7QUFDVCxNQUFBLFNBQVMsRUFBRSxJQURGO0FBRVQsTUFBQSxPQUFPLEVBQUUsaUJBQVMsR0FBVCxFQUFjO0FBQ3JCLFlBQUksR0FBRyxJQUFJLENBQVgsRUFBYztBQUNaLGVBQUssT0FBTCxDQUFhLEdBQWI7QUFDRDtBQUNGO0FBTlEsS0FETjtBQVNMLElBQUEsWUFBWSxFQUFFO0FBQ1osTUFBQSxTQUFTLEVBQUUsSUFEQztBQUVaLE1BQUEsSUFBSSxFQUFFLElBRk07QUFHWixNQUFBLE9BQU8sRUFBRSxpQkFBUyxHQUFULEVBQWM7QUFDckIsWUFBSSxHQUFKLEVBQVM7QUFDUCxlQUFLLGdCQUFMO0FBQ0Q7QUFDRjtBQVBXO0FBVFQsR0E3TDhCO0FBZ05yQyxFQUFBLFlBQVksRUFBRSx3QkFBWTtBQUN4QixJQUFBLFFBQVEsQ0FBQyxLQUFULEdBQWlCLEtBQUssV0FBdEI7O0FBQ0EsUUFBSSxLQUFLLFNBQUwsSUFBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsV0FBSyxPQUFMLENBQWEsS0FBSyxRQUFsQjtBQUNEO0FBQ0YsR0FyTm9DO0FBc05yQyxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQ3BCLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsWUFBckIsRUFBbUMsS0FBSyxJQUF4QztBQUNELEtBSE07QUFJUCxJQUFBLGdCQUFnQixFQUFFLDRCQUFZO0FBQzVCLFVBQUksVUFBVSxHQUFHLEtBQUssVUFBdEI7O0FBQ0EsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLEVBQW9CLElBQXBCLEdBQTJCLE1BQTNCLENBQWtDLEtBQWxDLEVBQXlDLEtBQXpDLEVBQVg7O0FBQ0EsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFLLFlBQWIsQ0FBWjs7QUFDQSxXQUFLLHFCQUFMLEdBQTZCLENBQUMsQ0FBQyxHQUFGLENBQU0sS0FBTixFQUFhLFVBQVUsQ0FBVixFQUFhO0FBQ3JELFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFWOztBQUNBLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLGlCQUFPLENBQUMsQ0FBQyxHQUFGLElBQVMsQ0FBaEI7QUFDRCxTQUZPLENBQVI7O0FBR0EsUUFBQSxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxLQUFmO0FBQ0EsUUFBQSxDQUFDLENBQUMsUUFBRixHQUFhLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxRQUFsQjtBQUNBLGVBQU8sQ0FBUDtBQUNELE9BUjRCLENBQTdCO0FBVUQsS0FsQk07QUFtQlAsSUFBQSxPQUFPLEVBQUUsaUJBQVMsR0FBVCxFQUFjO0FBQ3JCLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnQ0FBZ0MsR0FBNUM7O0FBQ0EsY0FBUSxHQUFSO0FBQ0UsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLFNBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsRUFBZjtBQUNBOztBQUNGLGFBQUssQ0FBTDtBQUNFLGVBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNBLGVBQUssV0FBTCxHQUFtQixrQkFBbkI7QUFDQSxlQUFLLE9BQUwsR0FBZSxjQUFmO0FBQ0E7O0FBQ0YsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLGtCQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLFNBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsMEJBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsV0FBZjtBQUNBOztBQUNGLGFBQUssQ0FBTDtBQUNFLGVBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNBLGVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsbUNBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsbUJBQWY7QUFDQTs7QUFDRjtBQUNFLGVBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNBLGVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDQTtBQW5DSixPQUZxQixDQXVDckI7O0FBQ0QsS0EzRE07QUE0RFAsSUFBQSxPQUFPLEVBQUUsaUJBQVMsR0FBVCxFQUFjO0FBQ3JCLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw0QkFBNEIsR0FBeEM7O0FBQ0EsY0FBUSxHQUFSO0FBQ0UsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLHFCQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLHFCQUFmO0FBQ0E7O0FBQ0YsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLG9CQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLG9CQUFmO0FBQ0E7O0FBQ0YsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLG9CQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLG9CQUFmO0FBQ0E7O0FBQ0YsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLHlCQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLGtDQUFmO0FBQ0E7O0FBQ0YsYUFBSyxDQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsZ0NBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsdUJBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsa0NBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsZ0JBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsa0NBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIseUJBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsb0NBQWY7QUFDQTs7QUFDRixhQUFLLENBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsY0FBbkI7QUFDQSxlQUFLLE9BQUwsR0FBZSwyQkFBZjtBQUNBOztBQUNGLGFBQUssQ0FBTDtBQUNFLGVBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNBLGVBQUssV0FBTCxHQUFtQixhQUFuQjtBQUNBLGVBQUssT0FBTCxHQUFlLDBCQUFmO0FBQ0E7O0FBQ0YsYUFBSyxFQUFMO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsbURBQWY7QUFDQTs7QUFDRixhQUFLLEVBQUw7QUFDRSxlQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxlQUFLLFdBQUwsR0FBbUIsV0FBbkI7QUFDQSxlQUFLLE9BQUwsR0FBZSwrQ0FBZjtBQUNBOztBQUNGO0FBQ0UsZUFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZUFBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0EsZUFBSyxPQUFMLEdBQWUsRUFBZjtBQUNBO0FBakVKLE9BRnFCLENBcUVyQjs7QUFDRCxLQWxJTTtBQW1JUCxJQUFBLFdBQVcsRUFBRSxxQkFBUyxJQUFULEVBQWU7QUFDMUIsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosRUFEMEIsQ0FFMUI7O0FBQ0EsV0FBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0QsS0F2SU07QUF3SVAsSUFBQSxnQkFBZ0IsRUFBRSw0QkFBVztBQUMzQixNQUFBLGFBQWEsQ0FBQyxLQUFLLEtBQU4sQ0FBYjtBQUNELEtBMUlNO0FBMklQLElBQUEsVUFBVSxFQUFFLG9CQUFTLEdBQVQsRUFBYztBQUN4QixVQUFJLFVBQVUsR0FBRyxLQUFLLFVBQUwsQ0FBZ0IsS0FBSyxZQUFMLEdBQW9CLENBQXBDLENBQWpCO0FBQ0EsYUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsRUFBcUIsR0FBckIsRUFBMEIsT0FBMUIsRUFBUDtBQUNELEtBOUlNO0FBK0lQLElBQUEsU0FBUyxFQUFFLHFCQUF5QjtBQUFBLFVBQWhCLE1BQWdCLHVFQUFQLEtBQU87QUFDbEM7QUFDQSxVQUFJLElBQUksR0FBRyxLQUFLLFVBQWhCLENBRmtDLENBRU47O0FBQzVCLFVBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sS0FBSyxPQUFYLEVBQW9CLFlBQXBCLENBQWQ7O0FBQ0EsVUFBSSxNQUFNLEdBQUcsRUFBYjs7QUFDQSxVQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFDWCxHQURXLENBQ1AsVUFBUyxDQUFULEVBQVk7QUFDZixZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFDUCxHQURPLENBQ0gsVUFBUyxJQUFULEVBQWU7QUFDbEIsaUJBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQ0osTUFESSxDQUNHLFVBQVMsQ0FBVCxFQUFZO0FBQ2xCLG1CQUFPLENBQUMsQ0FBQyxRQUFELENBQUQsS0FBZ0IsQ0FBaEIsSUFBcUIsQ0FBQyxDQUFDLFFBQUQsQ0FBRCxLQUFnQixNQUE1QztBQUNELFdBSEksRUFJSixLQUpJLEVBQVA7QUFLRCxTQVBPLEVBUVAsV0FSTyxHQVNQLE1BVE8sQ0FTQSxNQVRBLEVBVVAsS0FWTyxFQUFWOztBQVdBLFlBQUksTUFBTSxLQUFLLEtBQWYsRUFBc0I7QUFDcEIsaUJBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLEVBQWEsQ0FBYixDQUFQO0FBQ0Q7O0FBQ0QsZUFBTyxDQUFDLENBQUMsU0FBRixDQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBUDtBQUNELE9BakJXLEVBa0JYLE1BbEJXLENBa0JKLFVBQVMsQ0FBVCxFQUFZO0FBQ2xCLGVBQU8sQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFsQjtBQUNELE9BcEJXLEVBcUJYLEtBckJXLEVBQWQ7O0FBdUJBLE1BQUEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxPQUFOLEVBQWUsVUFBUyxDQUFULEVBQVk7QUFDekIsWUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxJQUFaLENBQWY7O0FBQ0EsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLEVBQ1IsR0FEUSxDQUNKLE1BREksRUFFUixHQUZRLENBRUosVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsQ0FBUDtBQUNELFNBSlEsRUFLUixLQUxRLEVBQVg7O0FBTUEsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLLFFBQUwsQ0FBWDs7QUFDQSxZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBRixDQUNSLElBRFEsRUFFUixVQUFTLElBQVQsRUFBZSxHQUFmLEVBQW9CO0FBQ2xCLGlCQUFPLElBQUksR0FBRyxHQUFkO0FBQ0QsU0FKTyxFQUtSLENBTFEsQ0FBVjs7QUFPQSxZQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBRixDQUFPLFFBQVAsRUFBaUI7QUFDakMsVUFBQSxNQUFNLEVBQUU7QUFEeUIsU0FBakIsQ0FBbEI7O0FBR0EsWUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLFFBQUQsQ0FBckI7QUFDQSxZQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsUUFBRCxDQUFyQjtBQUNBLFlBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFELENBQVgsR0FBdUIsR0FBbEMsQ0FyQnlCLENBc0J6Qjs7QUFDQSxRQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVk7QUFDVixVQUFBLE1BQU0sRUFBRSxJQURFO0FBRVYsVUFBQSxNQUFNLEVBQUUsSUFGRTtBQUdWLFVBQUEsVUFBVSxFQUFFLEdBSEY7QUFJVixVQUFBLGtCQUFrQixFQUFFLEdBSlY7QUFLVixVQUFBLFFBQVEsWUFBSyxHQUFMLGdCQUFjLElBQWQ7QUFMRSxTQUFaO0FBT0QsT0E5QkQ7O0FBK0JBLGFBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxNQUFULEVBQWlCLFlBQWpCLENBQVA7QUFDRCxLQTNNTTtBQTRNUCxJQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixVQUFJLENBQUMsR0FBRyxLQUFLLFlBQWI7QUFDQSxVQUFJLENBQUMsR0FBRyxLQUFLLFlBQUwsR0FBb0IsQ0FBNUI7O0FBQ0EsVUFBSSxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1YsYUFBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0Q7QUFDRixLQWxOTTtBQW1OUCxJQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixVQUFJLENBQUMsR0FBRyxLQUFLLFlBQUwsR0FBb0IsQ0FBNUI7O0FBQ0EsVUFBSSxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1YsYUFBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0Q7QUFDRixLQXhOTTtBQXlOUCxJQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQixVQUFJLEtBQUssWUFBTCxJQUFxQixDQUF6QixFQUE0QjtBQUMxQixhQUFLLFlBQUwsR0FBb0IsQ0FBcEI7QUFDRDtBQUNGLEtBN05NO0FBOE5QLElBQUEsUUFBUSxFQUFFLG9CQUFXO0FBQ25CO0FBQ0EsVUFBSSxLQUFLLFlBQUwsSUFBcUIsS0FBSyxZQUE5QixFQUE0QztBQUMxQyxhQUFLLFlBQUwsR0FBb0IsS0FBSyxZQUF6QjtBQUNEO0FBQ0Y7QUFuT00sR0F0TjRCO0FBMmJyQyxFQUFBLFFBQVEsa0NBQ0gsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFDakIsSUFBQSxPQUFPLEVBQUUsU0FEUTtBQUVqQixJQUFBLGFBQWEsRUFBRSxjQUZFO0FBR2pCLElBQUEsVUFBVSxFQUFFLFlBSEs7QUFJakIsSUFBQSxZQUFZLEVBQUUsY0FKRztBQUtqQixJQUFBLFVBQVUsRUFBRSxZQUxLO0FBTWpCLElBQUEsS0FBSyxFQUFFLE9BTlU7QUFPakIsSUFBQSxPQUFPLEVBQUUsU0FQUTtBQVFqQixJQUFBLFFBQVEsRUFBRSxVQVJPO0FBU2pCLElBQUEsWUFBWSxFQUFFLGNBVEc7QUFVakIsSUFBQSxXQUFXLEVBQUUsWUFWSTtBQVdqQixJQUFBLFdBQVcsRUFBRSxhQVhJO0FBWWpCLElBQUEsYUFBYSxFQUFFLGVBWkU7QUFhakIsSUFBQSxJQUFJLEVBQUU7QUFiVyxHQUFoQixDQURHO0FBZ0JOLElBQUEsV0FBVyxFQUFFLHVCQUFZO0FBQ3ZCLGFBQU8sQ0FDTDtBQUNFLFFBQUEsSUFBSSxFQUFFLFVBRFI7QUFFRSxRQUFBLElBQUksRUFBRTtBQUZSLE9BREssRUFLTDtBQUNFLFFBQUEsSUFBSSxFQUFFLGFBRFI7QUFFRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFO0FBREo7QUFGTixPQUxLLEVBV0w7QUFDRSxRQUFBLElBQUksRUFBRSxLQUFLLGFBRGI7QUFFRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFLGVBREo7QUFFRixVQUFBLE1BQU0sRUFBRTtBQUNOLFlBQUEsSUFBSSxFQUFFLEtBQUs7QUFETDtBQUZOO0FBRk4sT0FYSyxFQW9CTDtBQUNFO0FBQ0E7QUFDQSxRQUFBLElBQUksWUFBSyxDQUFDLENBQUMsVUFBRixDQUFhLEtBQUssUUFBbEIsQ0FBTCx5QkFITjtBQUlFLFFBQUEsTUFBTSxFQUFFO0FBSlYsT0FwQkssQ0FBUDtBQTJCRCxLQTVDSztBQTZDTixJQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQix1RkFDRSxLQUFLLElBRFA7QUFHRDtBQWpESztBQTNiNkIsQ0FBdEIsQ0FBakIsQyxDQStlQTs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZmQTs7QUFDQTs7Ozs7O0FBQ0E7QUFDQSxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLFNBQWQsRUFBeUI7QUFDckMsRUFBQSxRQUFRLG1yRkFENkI7QUE0RHJDLEVBQUEsVUFBVSxFQUFFO0FBQ1YsSUFBQSxPQUFPLEVBQUUsb0JBREM7QUFFVixJQUFBLEtBQUssRUFBRTtBQUZHLEdBNUR5QjtBQWdFckMsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxJQUFJLEVBQUUsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixJQURwQjtBQUVMLE1BQUEsSUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLElBRmI7QUFHTCxNQUFBLE9BQU8sRUFBRSxVQUFHLGtCQUFILGtCQUF5QixLQUFLLE1BQUwsQ0FBWTtBQUh6QyxLQUFQO0FBS0QsR0F0RW9DO0FBdUVyQyxFQUFBLFlBQVksRUFBRSx3QkFBWTtBQUN4QixJQUFBLFFBQVEsQ0FBQyxLQUFULHlCQUFnQyxLQUFLLE9BQUwsQ0FBYSxLQUE3QztBQUNELEdBekVvQztBQTBFckMsRUFBQSxPQUFPLEVBQUUsbUJBQVc7QUFDbEIsU0FBSyxTQUFMO0FBQ0QsR0E1RW9DO0FBNkVyQyxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQUE7O0FBQ25CLFVBQUksS0FBSyxPQUFMLENBQWEsSUFBYixJQUFxQixLQUFLLElBQTlCLEVBQW9DO0FBQ25DO0FBQ0EsYUFBSyxPQUFMLENBQWEsS0FBYixHQUFxQixFQUFyQjtBQUNEOztBQUNELFVBQUksQ0FBQyxHQUFHLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsVUFBQSxLQUFLO0FBQUEsZUFBSSxLQUFLLENBQUMsSUFBTixLQUFlLEtBQUksQ0FBQyxJQUF4QjtBQUFBLE9BQXZCLENBQVI7O0FBQ0EsVUFBSSxDQUFKLEVBQU87QUFDTCxZQUFJLEdBQUcsR0FBRyxNQUFNLEVBQWhCO0FBQ0EsWUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssZ0JBQU4sQ0FBaEI7QUFDQSxZQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQsRUFBWSxTQUFaLENBQXJCOztBQUNBLFlBQUksWUFBWSxHQUFHLEdBQW5CLEVBQXdCO0FBQ3RCLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSw4Q0FBWjtBQUNBLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaO0FBQ0EsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVo7QUFDQSxlQUFLLE9BQUwsR0FBZSxDQUFmO0FBQ0QsU0FMRCxNQUtPO0FBQ1AsZUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixjQUFyQixFQUFxQyxLQUFLLElBQTFDO0FBQ0M7QUFDRixPQVpELE1BWU87QUFDTCxhQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLGNBQXJCLEVBQXFDLEtBQUssSUFBMUM7QUFDRDtBQUNGO0FBdEJNLEdBN0U0QjtBQXFHckMsRUFBQSxRQUFRLGtDQUNILElBQUksQ0FBQyxVQUFMLENBQWdCO0FBQ2pCO0FBQ0EsSUFBQSxLQUFLLEVBQUUsT0FGVTtBQUdqQixJQUFBLE9BQU8sRUFBRSxTQUhRO0FBSWpCLElBQUEsZ0JBQWdCLEVBQUUsZUFKRDtBQUtqQixJQUFBLE9BQU8sRUFBRTtBQUxRLEdBQWhCLENBREc7QUFRTixJQUFBLE9BQU8sRUFBRTtBQUNQLE1BQUEsR0FBRyxFQUFFLGVBQVk7QUFDZixlQUFPLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBb0IsTUFBM0I7QUFDRCxPQUhNO0FBSVAsTUFBQSxHQUFHLEVBQUUsYUFBVSxNQUFWLEVBQWtCO0FBQ3JCLGFBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsaUJBQW5CLEVBQXNDLE1BQXRDO0FBQ0Q7QUFOTSxLQVJIO0FBZ0JOLElBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLGFBQU8sQ0FDTDtBQUNFLFFBQUEsSUFBSSxFQUFFLFVBRFI7QUFFRSxRQUFBLElBQUksRUFBRTtBQUZSLE9BREssRUFLTDtBQUNFLFFBQUEsSUFBSSxFQUFFLGFBRFI7QUFFRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFO0FBREo7QUFGTixPQUxLLEVBV0w7QUFDRSxRQUFBLElBQUksRUFBRSxLQUFLLE9BQUwsQ0FBYSxLQURyQjtBQUVFLFFBQUEsTUFBTSxFQUFFO0FBRlYsT0FYSyxDQUFQO0FBZ0JELEtBakNLO0FBa0NOLElBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQ3BCO0FBQ0Q7QUFwQ0s7QUFyRzZCLENBQXpCLENBQWQ7ZUE2SWUsTzs7Ozs7Ozs7Ozs7Ozs7O0FDOUlmOzs7Ozs7QUFGQSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBdEIsQyxDQUNBOztBQUVBLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsU0FBZCxFQUF5QjtBQUNyQyxFQUFBLFFBQVEsNHdLQUQ2QjtBQWdIckMsRUFBQSxVQUFVLEVBQUU7QUFDVixJQUFBLE9BQU8sRUFBRSxvQkFEQztBQUVWLElBQUEsS0FBSyxFQUFFO0FBRkcsR0FoSHlCO0FBb0hyQyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLElBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxJQURiO0FBRUwsTUFBQSxXQUFXLEVBQUUsQ0FGUjtBQUdMLE1BQUEsVUFBVSxFQUFFLENBSFA7QUFJTCxNQUFBLFNBQVMsRUFBRTtBQUpOLEtBQVA7QUFNQyxHQTNIa0M7QUE0SHJDLEVBQUEsT0FBTyxFQUFFLG1CQUFZO0FBQ25CLElBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxnQkFBWjtBQUNBLElBQUEsUUFBUSxDQUFDLEtBQVQsR0FBaUIsNEJBQWpCO0FBQ0EsU0FBSyxTQUFMLENBQWUsS0FBSyxXQUFwQjtBQUNELEdBaElvQztBQWlJckMsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLFNBQVMsRUFBRSxtQkFBUyxPQUFULEVBQWtCO0FBQzNCLFdBQUssV0FBTCxHQUFtQixPQUFuQjtBQUNBLFVBQUksTUFBTSxHQUFHLEVBQWI7QUFDQSxNQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsT0FBZDtBQUNBLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsV0FBckIsRUFBa0MsTUFBbEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLGtCQUFyQjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUssVUFBakIsRUFBNkIsS0FBSyxTQUFsQztBQUNELEtBVE07QUFVUCxJQUFBLFNBQVMsRUFBRSxtQkFBUyxNQUFULEVBQWdCO0FBQ3pCLFdBQUssVUFBTCxHQUFrQixNQUFsQjtBQUNBLFVBQUksQ0FBQyxHQUFHLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixVQUFBLENBQUM7QUFBQSxlQUFJLENBQUMsQ0FBQyxFQUFGLElBQVEsTUFBWjtBQUFBLE9BQXhCLENBQVI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLLElBQXRCO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUssVUFBakIsRUFBNkIsS0FBSyxTQUFsQztBQUNBLFVBQUksTUFBTSxHQUFHLEVBQWI7QUFDQSxNQUFBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsQ0FBZDtBQUNBLE1BQUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsTUFBbEI7QUFDQSxXQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLFdBQXJCLEVBQWtDLE1BQWxDO0FBQ0EsV0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixrQkFBckI7QUFDRDtBQXBCTSxHQWpJNEI7QUF3SnJDLEVBQUEsUUFBUSxrQ0FDSCxVQUFVLENBQUM7QUFDWixJQUFBLFVBQVUsRUFBRSxrQkFEQTtBQUVaLElBQUEsUUFBUSxFQUFFLFFBRkU7QUFHWixJQUFBLEtBQUssRUFBRSxPQUhLO0FBSVosSUFBQSxPQUFPLEVBQUUsU0FKRztBQUtaLElBQUEsT0FBTyxFQUFFLFNBTEc7QUFNWixJQUFBLE9BQU8sRUFBRTtBQU5HLEdBQUQsQ0FEUDtBQVNOLElBQUEsY0FBYyxFQUFFLDBCQUFZO0FBQzFCLFVBQUksS0FBSyxVQUFMLENBQWdCLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQy9CLFlBQUksQ0FBQyxHQUFHLEtBQUssVUFBYjtBQUNBLFlBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBQyxLQUFELEVBQVEsR0FBUjtBQUFBLGlCQUNoQixLQUFLLEdBQUcsR0FBRyxDQUFDLEtBREk7QUFBQSxTQUFULEVBQ1ksQ0FEWixDQUFSO0FBRUMsZUFBTyxDQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxDQUFQO0FBQ0QsS0FqQks7QUFrQk4sSUFBQSxXQUFXLEVBQUUsdUJBQVc7QUFDdEIsYUFBTyxDQUNMO0FBQ0UsUUFBQSxJQUFJLEVBQUUsVUFEUjtBQUVFLFFBQUEsSUFBSSxFQUFFO0FBRlIsT0FESyxFQUtMO0FBQ0UsUUFBQSxJQUFJLEVBQUUsYUFEUjtBQUVFLFFBQUEsTUFBTSxFQUFFLElBRlY7QUFHRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFO0FBREo7QUFITixPQUxLLENBQVA7QUFhRCxLQWhDSztBQWlDTixJQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQjtBQUNEO0FBbkNLO0FBeEo2QixDQUF6QixDQUFkO2VBOExnQixPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDak1oQixJQUFJLG1CQUFtQixHQUFHLENBQUM7QUFBRSxFQUFBLElBQUksRUFBRSxFQUFSO0FBQWEsRUFBQSxJQUFJLEVBQUU7QUFBbkIsQ0FBRCxDQUExQjtBQUNBLElBQUksa0JBQWtCLEdBQUcsQ0FBQztBQUFFLEVBQUEsSUFBSSxFQUFFLEVBQVI7QUFBYSxFQUFBLElBQUksRUFBRTtBQUFuQixDQUFELENBQXpCO0FBQ0EsSUFBSSwwQkFBMEIsR0FBRyxFQUFqQztBQUNBLElBQUksMEJBQTBCLEdBQUc7QUFDL0IsRUFBQSxXQUFXLEVBQUU7QUFDWCxJQUFBLFNBQVMsRUFBRTtBQUNULE1BQUEsTUFBTSxFQUFFO0FBQUUsUUFBQSxJQUFJLEVBQUU7QUFBUjtBQURDO0FBREEsR0FEa0I7QUFNL0IsRUFBQSxNQUFNLEVBQUUsRUFOdUI7QUFPL0IsRUFBQSxNQUFNLEVBQUU7QUFQdUIsQ0FBakM7QUFVQSxJQUFJLHdCQUF3QixHQUFHO0FBQzdCLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxNQUFNLEVBQUUsR0FESDtBQUVMLElBQUEsSUFBSSxFQUFFO0FBQ0osTUFBQSxPQUFPLEVBQUU7QUFETCxLQUZEO0FBS0wsSUFBQSxNQUFNLEVBQUU7QUFDTixNQUFBLE9BQU8sRUFBRSxJQURIO0FBRU4sTUFBQSxLQUFLLEVBQUUsTUFGRDtBQUdOLE1BQUEsR0FBRyxFQUFFLEVBSEM7QUFJTixNQUFBLElBQUksRUFBRSxDQUpBO0FBS04sTUFBQSxJQUFJLEVBQUUsRUFMQTtBQU1OLE1BQUEsT0FBTyxFQUFFO0FBTkg7QUFMSCxHQURzQjtBQWU3QixFQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsRUFBWSxTQUFaLENBZnFCO0FBZ0I3QixFQUFBLFVBQVUsRUFBRTtBQUNWLElBQUEsT0FBTyxFQUFFO0FBREMsR0FoQmlCO0FBbUI3QixFQUFBLE1BQU0sRUFBRTtBQUNOLElBQUEsS0FBSyxFQUFFLFFBREQsQ0FDVTs7QUFEVixHQW5CcUI7QUFzQjdCLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxJQUFJLEVBQUUsRUFERDtBQUVMLElBQUEsS0FBSyxFQUFFO0FBRkYsR0F0QnNCO0FBMEI3QixFQUFBLElBQUksRUFBRTtBQUNKLElBQUEsV0FBVyxFQUFFLFNBRFQ7QUFFSixJQUFBLEdBQUcsRUFBRTtBQUNILE1BQUEsTUFBTSxFQUFFLENBQUMsU0FBRCxFQUFZLGFBQVosQ0FETDtBQUNpQztBQUNwQyxNQUFBLE9BQU8sRUFBRTtBQUZOO0FBRkQsR0ExQnVCO0FBaUM3QixFQUFBLEtBQUssRUFBRTtBQUNMLElBQUEsVUFBVSxFQUFFLEVBRFA7QUFFTCxJQUFBLEtBQUssRUFBRTtBQUNMLE1BQUEsSUFBSSxFQUFFO0FBREQ7QUFGRixHQWpDc0I7QUF1QzdCLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxLQUFLLEVBQUU7QUFDTCxNQUFBLElBQUksRUFBRTtBQURELEtBREY7QUFJTCxJQUFBLEdBQUcsRUFBRSxJQUpBO0FBS0wsSUFBQSxHQUFHLEVBQUU7QUFMQSxHQXZDc0I7QUE4QzdCLEVBQUEsTUFBTSxFQUFFO0FBQ04sSUFBQSxRQUFRLEVBQUUsS0FESjtBQUVOLElBQUEsZUFBZSxFQUFFLE9BRlg7QUFHTixJQUFBLFFBQVEsRUFBRSxJQUhKO0FBSU4sSUFBQSxPQUFPLEVBQUUsQ0FBQyxFQUpKO0FBS04sSUFBQSxPQUFPLEVBQUUsQ0FBQztBQUxKO0FBOUNxQixDQUEvQjtBQXVEQSxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLGFBQWQsRUFBNkI7QUFDN0MsRUFBQSxRQUFRLGs1TEFEcUM7QUFnSDdDLEVBQUEsS0FBSyxFQUFFLENBQUMsUUFBRCxDQWhIc0M7QUFpSDdDLEVBQUEsVUFBVSxFQUFFO0FBQ1YsSUFBQSxTQUFTLEVBQUU7QUFERCxHQWpIaUM7QUFvSDdDLEVBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2hCLFdBQU87QUFDTCxNQUFBLE1BQU0sRUFBRSxFQURIO0FBRUwsTUFBQSxJQUFJLEVBQUUsSUFGRDtBQUdMLE1BQUEsVUFBVSxFQUFFLEVBSFA7QUFJTCxNQUFBLFNBQVMsRUFBRSxFQUpOO0FBS0wsTUFBQSxZQUFZLEVBQUUsRUFMVDtBQU1MLE1BQUEsUUFBUSxFQUFFLEVBTkw7QUFPTCxNQUFBLGFBQWEsRUFBRSxJQVBWO0FBUUwsTUFBQSxVQUFVLEVBQUUsTUFSUDtBQVNMLE1BQUEsV0FBVyxFQUFFLG1CQVRSO0FBVUwsTUFBQSxVQUFVLEVBQUUsa0JBVlA7QUFXTCxNQUFBLFlBQVksRUFBRSwwQkFYVDtBQVlMLE1BQUEsY0FBYyxFQUFFLDBCQVpYO0FBYUwsTUFBQSxnQkFBZ0IsRUFBRSx3QkFiYjtBQWNMLE1BQUEsWUFBWSxFQUFFO0FBQ1osUUFBQSxLQUFLLEVBQUU7QUFDTCxVQUFBLE1BQU0sRUFBRSxHQURIO0FBRUwsVUFBQSxJQUFJLEVBQUU7QUFDSixZQUFBLE9BQU8sRUFBRTtBQURMLFdBRkQ7QUFLTCxVQUFBLE1BQU0sRUFBRTtBQUNOLFlBQUEsT0FBTyxFQUFFLElBREg7QUFFTixZQUFBLEtBQUssRUFBRSxNQUZEO0FBR04sWUFBQSxHQUFHLEVBQUUsRUFIQztBQUlOLFlBQUEsSUFBSSxFQUFFLENBSkE7QUFLTixZQUFBLElBQUksRUFBRSxFQUxBO0FBTU4sWUFBQSxPQUFPLEVBQUU7QUFOSDtBQUxILFNBREs7QUFlWixRQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsRUFBWSxTQUFaLENBZkk7QUFnQlosUUFBQSxVQUFVLEVBQUU7QUFDVixVQUFBLE9BQU8sRUFBRTtBQURDLFNBaEJBO0FBbUJaLFFBQUEsTUFBTSxFQUFFO0FBQ04sVUFBQSxLQUFLLEVBQUUsVUFERCxDQUNZOztBQURaLFNBbkJJO0FBc0JaLFFBQUEsS0FBSyxFQUFFO0FBQ0wsVUFBQSxJQUFJLEVBQUUsRUFERDtBQUVMLFVBQUEsS0FBSyxFQUFFO0FBRkYsU0F0Qks7QUEwQlosUUFBQSxJQUFJLEVBQUU7QUFDSixVQUFBLFdBQVcsRUFBRSxTQURUO0FBRUosVUFBQSxHQUFHLEVBQUU7QUFDSCxZQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsRUFBWSxhQUFaLENBREw7QUFDaUM7QUFDcEMsWUFBQSxPQUFPLEVBQUU7QUFGTjtBQUZELFNBMUJNO0FBaUNaLFFBQUEsS0FBSyxFQUFFO0FBQ0wsVUFBQSxVQUFVLEVBQUUsRUFEUDtBQUVMLFVBQUEsS0FBSyxFQUFFO0FBQ0wsWUFBQSxJQUFJLEVBQUU7QUFERDtBQUZGLFNBakNLO0FBdUNaLFFBQUEsS0FBSyxFQUFFO0FBQ0wsVUFBQSxLQUFLLEVBQUU7QUFDTCxZQUFBLElBQUksRUFBRTtBQURELFdBREY7QUFJTCxVQUFBLEdBQUcsRUFBRSxJQUpBO0FBS0wsVUFBQSxHQUFHLEVBQUU7QUFMQSxTQXZDSztBQThDWixRQUFBLE1BQU0sRUFBRTtBQUNOLFVBQUEsUUFBUSxFQUFFLEtBREo7QUFFTixVQUFBLGVBQWUsRUFBRSxPQUZYO0FBR04sVUFBQSxRQUFRLEVBQUUsSUFISjtBQUlOLFVBQUEsT0FBTyxFQUFFLENBQUMsRUFKSjtBQUtOLFVBQUEsT0FBTyxFQUFFLENBQUM7QUFMSjtBQTlDSTtBQWRULEtBQVA7QUFxRUQsR0ExTDRDO0FBMkw3QyxFQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNuQixTQUFLLFFBQUw7QUFDQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxZQUFqQjtBQUNBLFNBQUssSUFBTCxHQUFZLEtBQUssU0FBakI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFLLE1BQUwsQ0FBWSxTQUF0QixDQUFqQjtBQUNBLFNBQUssWUFBTCxHQUFvQixDQUFDLENBQUMsT0FBRixDQUFVLEtBQUssTUFBTCxDQUFZLFlBQXRCLENBQXBCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLENBQUMsQ0FBQyxPQUFGLENBQVUsS0FBSyxNQUFMLENBQVksUUFBdEIsQ0FBaEI7QUFDQSxTQUFLLFdBQUwsQ0FBaUIsS0FBSyxVQUF0QjtBQUNBLFNBQUssYUFBTCxHQUFxQixLQUFLLE9BQUwsQ0FBYSxNQUFsQztBQUNBLFNBQUssTUFBTCxHQUFjLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsQ0FBZDtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLE1BQUwsQ0FBWSxVQUE5QjtBQUNELEdBdE00QztBQXVNN0MsRUFBQSxhQXZNNkMsMkJBdU03QjtBQUNkLFNBQUssU0FBTDtBQUNELEdBek00QztBQTBNN0MsRUFBQSxPQUFPLEVBQUU7QUFFUCxJQUFBLFFBQVEsRUFBRSxvQkFBWTtBQUNwQjtBQUNBLE1BQUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsWUFBVztBQUFDLFFBQUEsVUFBVTtBQUFHLE9BQTNDLENBRm9CLENBSXBCOzs7QUFDQSxVQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBVCxDQUF3QixTQUF4QixDQUFiLENBTG9CLENBT3BCOztBQUNBLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFwQjtBQUNBLFVBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLEVBQTlCLENBVG9CLENBV3BCOztBQUNBLGVBQVMsVUFBVCxHQUFzQjtBQUNwQixZQUFJLE1BQU0sQ0FBQyxXQUFQLEdBQXNCLE1BQU0sR0FBRyxDQUFuQyxFQUF1QztBQUNyQyxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEdBQWpCLENBQXFCLFFBQXJCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsVUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixNQUFqQixDQUF3QixRQUF4QjtBQUNEO0FBQ0Y7QUFFRixLQXRCTTtBQXVCUCxJQUFBLGtCQUFrQixFQUFFLDhCQUFVO0FBQzVCLFVBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBUixFQUFXLEtBQUssWUFBTCxHQUFvQixDQUEvQixDQUFiOztBQUNBLFVBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sTUFBTixFQUFjLFVBQVMsR0FBVCxFQUFhO0FBQUUsZUFBTyxRQUFPLEdBQWQ7QUFBb0IsT0FBakQsQ0FBVjs7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsVUFBeEIsR0FBcUMsR0FBckM7QUFDRCxLQTNCTTtBQTRCUCxJQUFBLFdBQVcsRUFBRSxxQkFBVSxJQUFWLEVBQWdCO0FBQzNCO0FBQ0EsV0FBSyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsV0FBSyxZQUFMLENBQWtCLEtBQWxCLENBQXdCLEtBQXhCLEdBQWdDLE1BQWhDOztBQUNBLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFLLFVBQWIsRUFBeUIsR0FBekIsRUFBOEIsQ0FBOUIsRUFBaUMsQ0FBakMsQ0FBUCxDQUFoQjs7QUFDQSxVQUFJLFVBQVUsSUFBZCxFQUFvQjtBQUNsQjtBQUNBLGFBQUssZ0JBQUwsQ0FBc0IsS0FBdEIsQ0FBNEIsSUFBNUIsc0JBQThDLEtBQUssVUFBbkQ7QUFDQSxhQUFLLGdCQUFMLENBQXNCLEtBQXRCLENBQTRCLEdBQTVCLEdBQWtDLENBQWxDO0FBQ0EsYUFBSyxnQkFBTCxDQUFzQixLQUF0QixDQUE0QixHQUE1QixHQUFpQyxLQUFLLGFBQXRDO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLENBQUM7QUFDakIsVUFBQSxJQUFJLFlBQUssU0FBTCxrQkFEYTtBQUVqQixVQUFBLElBQUksRUFBRSxLQUFLO0FBRk0sU0FBRCxDQUFsQjtBQUlEOztBQUNELFVBQUksV0FBVyxJQUFmLEVBQXFCO0FBQ25CLGFBQUssa0JBQUw7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsSUFBeEIscUJBQTBDLEtBQUssVUFBL0M7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsR0FBeEIsR0FBOEIsR0FBOUI7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBd0IsR0FBeEIsR0FBOEIsR0FBOUI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsQ0FDakI7QUFDRSxVQUFBLElBQUksWUFBSyxTQUFMLENBRE47QUFFRSxVQUFBLElBQUksRUFBRSxLQUFLO0FBRmIsU0FEaUIsRUFLakI7QUFDQSxVQUFBLElBQUksRUFBRSxVQUROO0FBRUEsVUFBQSxJQUFJLEVBQUUsS0FBSztBQUZYLFNBTGlCLENBQW5CO0FBU0Q7O0FBQ0QsVUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsYUFBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTRCLEVBQTVCO0FBQ0EsYUFBSyxjQUFMLENBQW9CLE1BQXBCLEdBQTRCLEVBQTVCO0FBQ0EsYUFBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLE9BQTNCLENBQW1DLGdCQUFuQyxFQUFvRCxpQkFBcEQ7QUFDQSxhQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsT0FBM0IsQ0FBbUMsU0FBbkMsRUFBOEMsU0FBOUM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxjQUFqQjs7QUFDQSxZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLE9BQU8sS0FBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLE1BQUwsQ0FBWSxNQUEzQyxDQUFSLEVBQTJELENBQTNELENBQVI7O0FBQ0EsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFPLEtBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsS0FBSyxNQUFMLENBQVksT0FBM0MsQ0FBUixFQUE0RCxDQUE1RCxDQUFSOztBQUNBLGFBQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLGFBQUssWUFBTCxDQUFrQixPQUFsQixDQUEwQixDQUExQixFQUE0QixDQUE1QjtBQUNBLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLFlBQWpCO0FBQ0Q7QUFFRixLQXZFTTtBQXdFUCxJQUFBLFNBQVMsRUFBRSxxQkFBWTtBQUN2QjtBQUNFLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsVUFBckIsRUFBaUMsS0FBakM7QUFDRDtBQTNFTSxHQTFNb0M7QUF1UjdDLEVBQUEsUUFBUSxvQkFDSCxJQUFJLENBQUMsVUFBTCxDQUFnQjtBQUNqQixJQUFBLFlBQVksRUFBRSxjQURHO0FBRWpCLElBQUEsT0FBTyxFQUFFLFNBRlE7QUFHakIsSUFBQSxTQUFTLEVBQUU7QUFITSxHQUFoQixDQURHO0FBdlJxQyxDQUE3QixDQUFsQjtBQWlTQSxJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLFlBQWQsRUFBNEI7QUFDM0MsRUFBQSxRQUFRLDJ3SUFEbUM7QUFpRTNDLEVBQUEsVUFBVSxFQUFFO0FBQ1YsSUFBQSxXQUFXLEVBQUU7QUFESCxHQWpFK0I7QUFvRTNDLEVBQUEsS0FBSyxFQUFFLENBQUMsTUFBRCxDQXBFb0M7QUFxRTNDLEVBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2hCLFdBQU87QUFDTCxNQUFBLE1BQU0sRUFBRSxFQURIO0FBRUwsTUFBQSxRQUFRLEVBQUU7QUFDUixRQUFBLE1BQU0sRUFBRSxJQURBO0FBRVIsUUFBQSxLQUFLLEVBQUUsSUFGQztBQUdSLFFBQUEsT0FBTyxFQUFFLFFBSEQ7QUFJUixRQUFBLEtBQUssRUFBRSxJQUpDO0FBS1IsUUFBQSxLQUFLLEVBQUUsSUFMQztBQU1SLFFBQUEsVUFBVSxFQUFFLE1BTko7QUFPUixRQUFBLEtBQUssRUFBRSxNQVBDO0FBUVIsUUFBQSxNQUFNLEVBQUUsTUFSQTtBQVNSLFFBQUEsS0FBSyxFQUFFLGlCQVRDO0FBVVIsaUJBQU87QUFWQyxPQUZMO0FBY0wsTUFBQSxRQUFRLEVBQUUsRUFkTDtBQWVMLE1BQUEsS0FBSyxFQUFFLEVBZkY7QUFnQkwsTUFBQSxJQUFJLEVBQUUsRUFoQkQ7QUFpQkwsTUFBQSxNQUFNLEVBQUUsS0FqQkg7QUFrQkwsTUFBQSxHQUFHLEVBQUU7QUFsQkEsS0FBUDtBQW9CRCxHQTFGMEM7QUEyRjNDLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFFBQUksVUFBVSxHQUFHLEtBQUssV0FBdEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBZCxDQUFoQjtBQUNBLFNBQUssSUFBTCxHQUFZLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUixFQUFvQixJQUFwQixHQUEyQixNQUEzQixDQUFrQyxLQUFsQyxFQUF5QyxLQUF6QyxFQUFaO0FBQ0EsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDBDQUFaO0FBQ0EsSUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUssSUFBakI7QUFDRCxHQWpHMEM7QUFrRzNDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxZQUFZLEVBQUUsc0JBQVUsTUFBVixFQUFrQjtBQUM5QixNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjs7QUFDQSxVQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssUUFBYixDQUFSOztBQUNBLFVBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBUixFQUNQLE1BRE8sQ0FDQSxVQUFTLENBQVQsRUFBWTtBQUNqQixlQUFPLENBQUMsQ0FBQyxHQUFGLEtBQVUsTUFBakI7QUFDRixPQUhPLEVBR0wsU0FISyxHQUdPLEtBSFAsRUFBVjs7QUFJQSxXQUFLLEtBQUwsR0FBYSxDQUFDLENBQUMsS0FBRixDQUFRLEdBQVIsQ0FBYixDQVA4QixDQVE5QjtBQUNELEtBVk07QUFXUCxJQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNuQixXQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsV0FBSyxHQUFMLEdBQVcsQ0FBQyxLQUFLLEdBQWpCO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFdBQVo7QUFDQSxVQUFJLE9BQU8sR0FBRyxLQUFkOztBQUNBLFVBQUksU0FBUyxLQUFLLEdBQWxCLEVBQXVCO0FBQ3JCLFFBQUEsT0FBTyxHQUFHLE1BQVY7QUFDRDs7QUFDRCxVQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBRixDQUFVLEtBQUssSUFBZixFQUFxQixNQUFyQixFQUE2QixPQUE3QixDQUFiOztBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0EsV0FBSyxJQUFMLEdBQVksTUFBWjtBQUNELEtBdEJNO0FBdUJQLElBQUEsV0FBVyxFQUFFLHVCQUFZO0FBQ3ZCLFdBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxXQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0EsV0FBSyxJQUFMLEdBQVksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxLQUFLLElBQWYsRUFBcUIsS0FBckIsRUFBNEIsS0FBNUIsQ0FBWjtBQUNELEtBM0JNO0FBNEJQLElBQUEsZUFBZSxFQUFFLHlCQUFVLEVBQVYsRUFBYztBQUM3QixXQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLHNCQUFuQixFQUEyQyxFQUEzQztBQUNBLFdBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsS0FBSyxNQUExQjtBQUNBLFdBQUssTUFBTCxDQUFZLE9BQVosR0FBc0IsS0FBSyxRQUFMLENBQWMsYUFBcEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxJQUFaLEdBQW1CLEtBQUssUUFBTCxDQUFjLFNBQWpDO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFLLFFBQUwsQ0FBYyxJQUFsQztBQUNBLFdBQUssTUFBTCxDQUFZLFNBQVosR0FBd0IsS0FBSyxRQUFMLENBQWMsUUFBdEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLEtBQUssUUFBTCxDQUFjLE1BQXBDO0FBQ0EsV0FBSyxNQUFMLENBQVksUUFBWixHQUF1QixLQUFLLFlBQUwsQ0FBa0IsUUFBekM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLEtBQUssWUFBTCxDQUFrQixRQUF6QztBQUNBLFdBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsS0FBSyxZQUFMLENBQWtCLFdBQTVDO0FBQ0EsV0FBSyxNQUFMLENBQVksV0FBWixHQUEwQixLQUFLLFlBQUwsQ0FBa0IsV0FBNUM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxjQUFaLEdBQTZCLEtBQUssWUFBTCxDQUFrQixjQUEvQztBQUNBLFdBQUssTUFBTCxDQUFZLGNBQVosR0FBNkIsS0FBSyxZQUFMLENBQWtCLGNBQS9DO0FBQ0EsV0FBSyxNQUFMLENBQVksUUFBWixHQUF1QixLQUFLLFlBQUwsQ0FBa0IsUUFBekM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLEtBQUssWUFBTCxDQUFrQixTQUExQztBQUNBLFdBQUssTUFBTCxDQUFZLFlBQVosR0FBMkIsS0FBSyxZQUFMLENBQWtCLFlBQTdDO0FBQ0EsV0FBSyxNQUFMLENBQVksS0FBWixHQUFvQixLQUFLLFlBQUwsQ0FBa0IsS0FBdEM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxTQUFaLEdBQXdCLEtBQUssWUFBTCxDQUFrQixTQUExQztBQUNBLFdBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsS0FBSyxZQUFMLENBQWtCLE1BQXZDO0FBQ0EsV0FBSyxNQUFMLENBQVksU0FBWixHQUF3QixLQUFLLFlBQUwsQ0FBa0IsU0FBMUM7QUFDQSxXQUFLLE1BQUwsQ0FBWSxPQUFaLEdBQXNCLEtBQUssWUFBTCxDQUFrQixPQUF4QztBQUVBLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsVUFBckIsRUFBZ0MsSUFBaEM7QUFDRDtBQXBETSxHQWxHa0M7QUF3SjNDLEVBQUEsUUFBUSxvQkFDSCxJQUFJLENBQUMsVUFBTCxDQUFnQjtBQUNqQixJQUFBLFdBQVcsRUFBRSxZQURJO0FBRWpCLElBQUEsT0FBTyxFQUFFLFNBRlE7QUFHakIsSUFBQSxhQUFhLEVBQUUsY0FIRTtBQUlqQixJQUFBLFlBQVksRUFBRSxjQUpHO0FBS2pCLElBQUEsU0FBUyxFQUFFLFdBTE07QUFNakIsSUFBQSxRQUFRLEVBQUUsWUFOTztBQU9qQixJQUFBLFVBQVUsRUFBRSxZQVBLO0FBUWpCLElBQUEsTUFBTSxFQUFFLFFBUlM7QUFTakIsSUFBQSxZQUFZLEVBQUU7QUFURyxHQUFoQixDQURHO0FBeEptQyxDQUE1QixDQUFqQjs7QUF3S0MsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxTQUFkLEVBQXlCO0FBQ3JDLEVBQUEsUUFBUSx1UkFENkI7QUFRdEMsRUFBQSxLQUFLLEVBQUUsQ0FBQyxTQUFELEVBQVksY0FBWixFQUE0QixZQUE1QixDQVIrQjtBQVN0QyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLGNBQWMsRUFBRTtBQURYLEtBQVA7QUFHRCxHQWJxQztBQWN0QyxFQUFBLE9BQU8sRUFBRSxtQkFBVztBQUNsQixTQUFLLGNBQUwsR0FBc0IsQ0FDcEI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsTUFBQSxLQUFLLEVBQUUsR0FBdEI7QUFBMkIsZUFBTyxhQUFsQztBQUFpRCxNQUFBLFFBQVEsRUFBRTtBQUEzRCxLQURvQixFQUVwQjtBQUFFLE1BQUEsR0FBRyxFQUFFLFFBQVA7QUFBaUIsTUFBQSxLQUFLLEVBQUUsUUFBeEI7QUFBa0MsTUFBQSxRQUFRLEVBQUU7QUFBNUMsS0FGb0IsRUFHcEI7QUFDQTtBQUNFLE1BQUEsR0FBRyxFQUFFLE9BRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxPQUZUO0FBR0UsZUFBTyxhQUhUO0FBSUUsTUFBQSxRQUFRLEVBQUUsSUFKWjtBQUtFLE1BQUEsU0FBUyxFQUFFLG1CQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixFQUFzQjtBQUMvQixZQUFJLElBQUksQ0FBQyxVQUFMLElBQW1CLENBQW5CLElBQXdCLElBQUksQ0FBQyxLQUFMLElBQWMsQ0FBMUMsRUFBNkM7QUFDM0MsaUJBQU8sSUFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLElBQUksQ0FBQyxLQUFaO0FBQ0Q7QUFDRjtBQVhILEtBSm9CLEVBaUJwQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE1BQVA7QUFBZSxNQUFBLEtBQUssRUFBRTtBQUF0QixLQWpCb0IsRUFrQnBCO0FBQ0E7QUFDRSxNQUFBLEdBQUcsRUFBRSxZQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsT0FGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsUUFBUSxFQUFFLElBSlo7QUFLRSxNQUFBLFNBQVMsRUFBRSxtQkFBQyxLQUFELEVBQVEsR0FBUixFQUFhLElBQWIsRUFBc0I7QUFDL0IsWUFBSSxJQUFJLENBQUMsVUFBTCxJQUFtQixDQUFuQixJQUF3QixJQUFJLENBQUMsS0FBTCxJQUFjLENBQTFDLEVBQTZDO0FBQzNDLGlCQUFPLElBQVA7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBTyxJQUFJLENBQUMsVUFBWjtBQUNEO0FBQ0Y7QUFYSCxLQW5Cb0IsRUFnQ3BCO0FBQ0UsTUFBQSxHQUFHLEVBQUUsTUFEUDtBQUVFLE1BQUEsS0FBSyxFQUFFLFFBRlQ7QUFHRSxlQUFPLGFBSFQ7QUFJRSxNQUFBLFFBQVEsRUFBRSxJQUpaO0FBS0UsTUFBQSxTQUFTLEVBQUUsbUJBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxJQUFiLEVBQXNCO0FBQy9CLFlBQUksSUFBSSxDQUFDLFVBQUwsSUFBbUIsQ0FBbkIsSUFBd0IsSUFBSSxDQUFDLEtBQUwsSUFBYyxDQUExQyxFQUE2QztBQUMzQyxpQkFBTyxHQUFQO0FBQ0Q7O0FBQ0QsWUFBSSxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ2IsNEJBQVcsS0FBWDtBQUNEOztBQUNELHlCQUFVLEtBQVY7QUFDRDtBQWJILEtBaENvQixDQUF0QjtBQWdERCxHQS9EcUM7QUFnRXRDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxNQUFNLEVBQUUsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2xCLFVBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFoQjs7QUFDQSxVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFSLENBQVg7O0FBRUEsTUFBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsVUFBUyxDQUFULEVBQVk7QUFDMUIsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQUQsQ0FBZCxDQUQwQixDQUUxQjs7QUFDQSxZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBRixDQUFPLElBQVAsRUFBYTtBQUFFLFVBQUEsR0FBRyxFQUFFO0FBQVAsU0FBYixDQUFWOztBQUNBLFFBQUEsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxHQUFvQixHQUFHLENBQUMsUUFBeEIsQ0FKMEIsQ0FLMUI7O0FBQ0EsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQWY7QUFDQSxRQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsR0FBcUIsRUFBckI7QUFDQSxRQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsVUFBbkIsSUFBaUMsTUFBakM7O0FBQ0EsWUFBSSxNQUFNLEtBQUssTUFBZixFQUF1QjtBQUN2QixVQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsVUFBbkIsSUFBaUMsU0FBakM7QUFDQzs7QUFDRCxZQUFJLE1BQU0sS0FBSyxLQUFmLEVBQXNCO0FBQ3BCLFVBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixVQUFuQixJQUFpQyxTQUFqQztBQUNEOztBQUNELFlBQUksTUFBTSxLQUFLLE1BQWYsRUFBdUI7QUFDckIsVUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLFVBQW5CLElBQWlDLFFBQWpDO0FBQ0Q7QUFHRixPQXBCRDs7QUFzQkEsYUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFDSixNQURJLENBQ0csUUFESCxFQUVKLE1BRkksQ0FFRyxRQUZILEVBR0osS0FISSxHQUlKLE9BSkksRUFBUDtBQUtEO0FBaENNO0FBaEU2QixDQUF6QixDQUFkOztBQW9HRCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLFdBQWQsRUFBMEI7QUFDeEMsRUFBQSxRQUFRLHV5QkFEZ0M7QUFzQnhDLEVBQUEsS0FBSyxFQUFFLENBQUMsU0FBRCxFQUFZLGNBQVosRUFBNEIsWUFBNUIsQ0F0QmlDO0FBdUJ4QyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLGdCQUFnQixFQUFFLEVBRGI7QUFFTCxNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsT0FBTyxFQUFFLFFBREQ7QUFFUixRQUFBLE1BQU0sRUFBRSxJQUZBO0FBR1IsUUFBQSxLQUFLLEVBQUUsSUFIQztBQUlSLFFBQUEsS0FBSyxFQUFFLElBSkM7QUFLUixRQUFBLEtBQUssRUFBRSxJQUxDO0FBTVIsUUFBQSxVQUFVLEVBQUUsTUFOSjtBQU9SLFFBQUEsS0FBSyxFQUFFLE1BUEM7QUFRUixRQUFBLE1BQU0sRUFBRSxNQVJBO0FBU1IsaUJBQU87QUFUQztBQUZMLEtBQVA7QUFjRCxHQXRDdUM7QUF1Q3hDLEVBQUEsT0FBTyxFQUFFLG1CQUFXO0FBQ2xCLFNBQUssZ0JBQUwsR0FBd0IsQ0FDdEI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsZUFBTyxhQUF0QjtBQUFxQyxNQUFBLFFBQVEsRUFBRTtBQUEvQyxLQURzQixFQUV0QjtBQUFFLE1BQUEsR0FBRyxFQUFFLFFBQVA7QUFBaUIsZUFBTztBQUF4QixLQUZzQixFQUd0QjtBQUNFLE1BQUEsR0FBRyxFQUFFLFNBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxlQUZUO0FBR0UsZUFBTyxhQUhUO0FBSUUsTUFBQSxTQUFTLEVBQUUsbUJBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxJQUFiLEVBQXNCO0FBQy9CLHlCQUFVLElBQUksQ0FBQyxJQUFmLGdCQUF5QixJQUFJLENBQUMsS0FBOUIsZ0JBQXlDLElBQUksQ0FBQyxNQUE5QztBQUNEO0FBTkgsS0FIc0IsRUFXdEI7QUFDRSxNQUFBLEdBQUcsRUFBRSxRQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsUUFGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsU0FBUyxFQUFFLG1CQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixFQUFzQjtBQUMvQixZQUFJLElBQUksQ0FBQyxFQUFMLEdBQVUsQ0FBZCxFQUFpQjtBQUNmLDJCQUFVLElBQUksQ0FBQyxNQUFmO0FBQ0Q7O0FBQ0QseUJBQVUsSUFBSSxDQUFDLE1BQWY7QUFDRDtBQVRILEtBWHNCLEVBc0J0QjtBQUNFLE1BQUEsR0FBRyxFQUFFLFFBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxRQUZUO0FBR0UsZUFBTyxhQUhUO0FBSUUsTUFBQSxRQUFRLEVBQUUsSUFKWjtBQUtFLE1BQUEsU0FBUyxFQUFFLG1CQUFBLEtBQUssRUFBSTtBQUNsQixZQUFJLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYiw0QkFBVyxLQUFYO0FBQ0Q7O0FBQ0QseUJBQVUsS0FBVjtBQUNEO0FBVkgsS0F0QnNCLEVBa0N0QjtBQUNFLE1BQUEsR0FBRyxFQUFFLFVBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxXQUZUO0FBR0UsTUFBQSxRQUFRLEVBQUUsS0FIWjtBQUlFLE1BQUEsU0FBUyxFQUFFLG1CQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixFQUFzQjtBQUMvQixZQUNFLElBQUksQ0FBQyxLQUFMLElBQWMsQ0FBZCxJQUNBLElBQUksQ0FBQyxVQUFMLElBQW1CLENBRG5CLElBRUEsSUFBSSxDQUFDLE1BQUwsSUFBZSxVQUhqQixFQUlFO0FBQ0EsbURBQWtDLElBQUksQ0FBQyxLQUF2QyxpQkFBbUQsSUFBSSxDQUFDLElBQXhEO0FBQ0QsU0FORCxNQU1LO0FBQ0gsNkJBQVksSUFBSSxDQUFDLEtBQWpCLGNBQTBCLElBQUksQ0FBQyxVQUEvQiwyQkFDRSxJQUFJLENBQUMsTUFBTCxDQUFZLFdBQVosRUFERixpQkFDa0MsSUFBSSxDQUFDLElBRHZDO0FBRUQ7QUFDRjtBQWZILEtBbENzQixDQUF4QjtBQW9ERCxHQTVGdUM7QUE2RnhDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxNQURPLGtCQUNBLENBREEsRUFDRztBQUNSLFVBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFoQjs7QUFDQSxVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBTCxDQUFnQixLQUFoQixDQUFSLENBQVg7O0FBQ0EsTUFBQSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsVUFBUyxDQUFULEVBQVk7QUFDMUIsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFNBQUQsQ0FBZCxDQUQwQixDQUUxQjs7QUFDQSxZQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBRixDQUFPLElBQVAsRUFBYTtBQUFFLFVBQUEsR0FBRyxFQUFFO0FBQVAsU0FBYixDQUFWOztBQUNBLFFBQUEsQ0FBQyxDQUFDLGNBQUQsQ0FBRCxHQUFvQixHQUFHLENBQUMsVUFBRCxDQUF2QixDQUowQixDQUsxQjs7QUFDQSxZQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsUUFBRCxDQUFkO0FBRUEsUUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELEdBQXFCLEVBQXJCO0FBQ0EsUUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLFVBQW5CLElBQWlDLFNBQWpDOztBQUNBLFlBQUksTUFBTSxLQUFLLEtBQWYsRUFBc0I7QUFDcEIsVUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLFVBQW5CLElBQWlDLFNBQWpDO0FBQ0Q7O0FBQ0QsWUFBSSxNQUFNLEtBQUssTUFBZixFQUF1QjtBQUNyQixVQUFBLENBQUMsQ0FBQyxlQUFELENBQUQsQ0FBbUIsVUFBbkIsSUFBaUMsUUFBakM7QUFDRDs7QUFDRCxZQUFJLE1BQU0sS0FBSyxVQUFmLEVBQTJCO0FBQ3pCLFVBQUEsQ0FBQyxDQUFDLGVBQUQsQ0FBRCxDQUFtQixVQUFuQixJQUFpQyxNQUFqQztBQUNEOztBQUNELFlBQUksTUFBTSxLQUFLLE1BQWYsRUFBdUI7QUFDckIsVUFBQSxDQUFDLENBQUMsZUFBRCxDQUFELENBQW1CLFVBQW5CLElBQWlDLFNBQWpDO0FBQ0Q7QUFDRixPQXRCRDs7QUF1QkEsYUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFDSixNQURJLENBQ0csUUFESCxFQUVKLE1BRkksQ0FFRyxRQUZILEVBR0osS0FISSxHQUlKLE9BSkksRUFBUDtBQUtEO0FBaENNO0FBN0YrQixDQUExQixDQUFoQjs7QUFpSUEsSUFBTSxRQUFRLEdBQUUsR0FBRyxDQUFDLFNBQUosQ0FBYyxVQUFkLEVBQTJCO0FBQ3pDLEVBQUEsUUFBUSxrM0JBRGlDO0FBcUJ6QyxFQUFBLEtBQUssRUFBRSxDQUFDLFNBQUQsRUFBWSxjQUFaLEVBQTRCLFlBQTVCLENBckJrQztBQXNCekMsRUFBQSxJQXRCeUMsa0JBc0JsQztBQUNMLFdBQU87QUFDTCxNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsT0FBTyxFQUFFLFFBREQ7QUFFUixRQUFBLEtBQUssRUFBRSxJQUZDO0FBR1IsUUFBQSxLQUFLLEVBQUUsSUFIQztBQUlSLFFBQUEsVUFBVSxFQUFFLE1BSko7QUFLUixRQUFBLEtBQUssRUFBQyxtQkFMRTtBQU1SLFFBQUEsS0FBSyxFQUFFLE1BTkM7QUFPUixRQUFBLE1BQU0sRUFBRSxNQVBBO0FBUVIsaUJBQU87QUFSQztBQURMLEtBQVA7QUFZRCxHQW5Dd0M7QUFvQ3pDLEVBQUEsT0FBTyxFQUFFO0FBQ1A7QUFDQSxJQUFBLE9BRk8sbUJBRUMsQ0FGRCxFQUVJO0FBQ1QsVUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQWhCO0FBQ0EsVUFBSSxTQUFTLEdBQUcsS0FBSyxVQUFMLENBQWdCLEtBQWhCLENBQWhCLENBRlMsQ0FHVDs7QUFDQSxVQUFJLENBQUMsS0FBSyxDQUFWLEVBQWE7QUFDWCxRQUFBLFNBQVMsR0FBRyxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsS0FBcEIsQ0FBWjtBQUNEOztBQUNELFVBQUksY0FBYyxHQUFHLEVBQXJCOztBQUNBLFVBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sU0FBTixFQUFpQixVQUFTLENBQVQsRUFBWTtBQUNwQyxZQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBRCxDQUFkO0FBQ0EsWUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQUQsQ0FBaEI7O0FBQ0EsWUFBSSxDQUFDLENBQUMsUUFBRixDQUFXLGNBQVgsRUFBMkIsTUFBM0IsQ0FBSixFQUF3QztBQUN0QyxpQkFBTyxLQUFQO0FBQ0Q7O0FBQ0QsUUFBQSxjQUFjLENBQUMsSUFBZixDQUFvQixNQUFwQjtBQUNBLFFBQUEsY0FBYyxDQUFDLElBQWYsQ0FBb0IsUUFBcEI7QUFDQSxlQUFPLENBQVA7QUFDRCxPQVRRLENBQVQ7O0FBVUEsYUFBTyxDQUFDLENBQUMsT0FBRixDQUFVLEVBQVYsQ0FBUDtBQUNEO0FBckJNO0FBcENnQyxDQUEzQixDQUFoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2p2QkEsSUFBSSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxlQUFkLEVBQStCO0FBQ2hELEVBQUEsUUFBUSxrNFZBRHdDO0FBMExoRCxFQUFBLElBQUksRUFBRSxnQkFBWTtBQUNoQixXQUFPO0FBQ0wsTUFBQSxJQUFJLEVBQUUsU0FERDtBQUVMO0FBQ0EsTUFBQSxPQUFPLEVBQUUsSUFISjtBQUlMLE1BQUEsT0FBTyxFQUFFLElBSko7QUFLTCxNQUFBLE9BQU8sRUFBRSxJQUxKO0FBTUwsTUFBQSxLQUFLLEVBQUUsRUFORjtBQU9MLE1BQUEsS0FBSyxFQUFFLElBUEY7QUFRTCxNQUFBLFFBQVEsRUFBRSxVQVJMO0FBU0wsTUFBQSxPQUFPLEVBQUUsSUFUSjtBQVVMLE1BQUEsUUFBUSxFQUFFLElBVkw7QUFXTCxNQUFBLGlCQUFpQixFQUFHO0FBQ2xCLFFBQUEsZ0JBQWdCLEVBQUUsbUJBREE7QUFFbEIsUUFBQSxZQUFZLEVBQUUsRUFGSTtBQUdsQixRQUFBLFlBQVksRUFBRyxjQUhHO0FBSWxCLFFBQUEsV0FBVyxFQUFFLHFDQUpLO0FBS2xCLFFBQUEsV0FBVyxFQUFFO0FBTEssT0FYZjtBQWtCTCxNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsS0FBSyxFQUFFLElBREM7QUFFUixRQUFBLFNBQVMsRUFBRSxJQUZIO0FBR1IsUUFBQSxLQUFLLEVBQUUsSUFIQztBQUlSLFFBQUEsS0FBSyxFQUFFLElBSkM7QUFLUixRQUFBLFVBQVUsRUFBRSxNQUxKO0FBTVIsUUFBQSxLQUFLLEVBQUUsR0FOQztBQU9SLFFBQUEsTUFBTSxFQUFFLEdBUEE7QUFRUixpQkFBTztBQVJDO0FBbEJMLEtBQVA7QUE2QkQsR0F4TitDO0FBeU5oRCxFQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNuQixTQUFLLFVBQUw7QUFDRCxHQTNOK0M7QUE0TmhELEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxJQUFJLEVBQUU7QUFDSixNQUFBLE9BQU8sRUFBRSxpQkFBVSxDQUFWLEVBQWE7QUFDcEIsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7QUFDRDtBQUhHLEtBREQ7QUFNTCxJQUFBLGVBQWUsRUFBRTtBQUNmLE1BQUEsU0FBUyxFQUFFLElBREk7QUFFZixNQUFBLE9BQU8sRUFBRSxpQkFBVSxHQUFWLEVBQWU7QUFDdEIsWUFBRyxHQUFHLENBQUMsTUFBSixHQUFhLENBQWhCLEVBQW1CO0FBQ2pCLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxlQUFLLFFBQUwsQ0FBYyxHQUFkO0FBQ0Q7QUFDRjtBQVBjO0FBTlosR0E1TnlDO0FBNE9oRCxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsVUFBVSxFQUFFLHNCQUFZO0FBQ3RCLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsaUJBQXJCLEVBQXdDLElBQXhDO0FBQ0QsS0FITTtBQUlQLElBQUEsUUFBUSxFQUFFLGtCQUFVLENBQVYsRUFBYTtBQUNyQixXQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0EsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQUssS0FBakI7O0FBQ0EsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFQLEVBQVUsQ0FBQyxNQUFELEVBQVMsS0FBSyxLQUFkLENBQVYsQ0FBWDs7QUFDQSxVQUFJLElBQUosRUFBVTtBQUNSLGFBQUssS0FBTCxHQUFhLElBQWI7QUFDQSxhQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0Q7QUFDRixLQVpNO0FBYVAsSUFBQSxVQUFVLEVBQUUsb0JBQVUsQ0FBVixFQUFhO0FBQ3ZCLFdBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBWjtBQUNBLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFWOztBQUNBLFVBQUksQ0FBSixFQUFPO0FBQ0wsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7QUFDQSxhQUFLLEtBQUwsR0FBYSxDQUFiO0FBQ0EsYUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixxQkFBckIsRUFBMkMsS0FBSyxLQUFoRDtBQUNBLGFBQUssUUFBTCxHQUFnQixLQUFoQjtBQUNELE9BTEQsTUFLTztBQUNMLGFBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNEO0FBQ0YsS0ExQk07QUEyQlAsSUFBQSxlQUFlLEVBQUUseUJBQVUsSUFBVixFQUFnQjtBQUMvQixVQUFJLENBQUMsR0FBRyxLQUFLLEtBQUwsQ0FBVyxZQUFuQjs7QUFDQSxVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsRUFBWSxDQUFDLFlBQUQsRUFBZSxJQUFmLENBQVosQ0FBWDs7QUFDQSxhQUFPLElBQUksQ0FBQyxNQUFaO0FBQ0Q7QUEvQk0sR0E1T3VDO0FBNlFoRCxFQUFBLFFBQVEsa0NBQ0gsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFDakIsSUFBQSxXQUFXLEVBQUUsYUFESTtBQUVqQixJQUFBLGVBQWUsRUFBRTtBQUZBLEdBQWhCLENBREc7QUFLTixJQUFBLFVBQVUsRUFBRTtBQUNWLE1BQUEsR0FBRyxFQUFFLGVBQVk7QUFDZixZQUFJLENBQUMsR0FBRyxLQUFLLFdBQWI7O0FBQ0EsWUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFOLEVBQVMsVUFBVSxDQUFWLEVBQWE7QUFDN0IsaUJBQU8sQ0FBQyxDQUFDLE1BQVQ7QUFDRCxTQUZRLENBQVQ7O0FBR0EsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEVBQVo7QUFDQSxlQUFPLEVBQVA7QUFDRCxPQVJTO0FBU1YsTUFBQSxHQUFHLEVBQUUsYUFBVSxNQUFWLEVBQWtCO0FBQ3JCLGFBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsaUJBQW5CLEVBQXNDLE1BQXRDO0FBQ0Q7QUFYUztBQUxOO0FBN1F3QyxDQUEvQixDQUFuQjs7Ozs7Ozs7OztBQ0NBLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsY0FBZCxFQUE4QjtBQUM5QyxFQUFBLFFBQVEsa3dDQURzQztBQTZCOUMsRUFBQSxLQUFLLEVBQUUsQ0FBQyxTQUFELEVBQVksZ0JBQVosQ0E3QnVDO0FBOEI5QyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsS0FBSyxFQUFFLEtBREM7QUFFUixRQUFBLE9BQU8sRUFBRSxRQUZEO0FBR1IsUUFBQSxLQUFLLEVBQUUsSUFIQztBQUlSLFFBQUEsS0FBSyxFQUFFLElBSkM7QUFLUixRQUFBLEtBQUssRUFBRSxNQUxDO0FBTVIsUUFBQSxNQUFNLEVBQUUsTUFOQTtBQU9SLGlCQUFPO0FBUEMsT0FETDtBQVVMLE1BQUEsTUFBTSxFQUFFLENBQ047QUFBRSxRQUFBLEdBQUcsRUFBRSxVQUFQO0FBQW1CLFFBQUEsS0FBSyxFQUFFO0FBQTFCLE9BRE0sRUFFTixNQUZNLEVBR047QUFBRSxRQUFBLEdBQUcsRUFBRSxlQUFQO0FBQXdCLFFBQUEsS0FBSyxFQUFFLFFBQS9CO0FBQXlDLFFBQUEsUUFBUSxFQUFFO0FBQW5ELE9BSE0sRUFJTjtBQUFFLFFBQUEsR0FBRyxFQUFFLGVBQVA7QUFBd0IsUUFBQSxLQUFLLEVBQUU7QUFBL0IsT0FKTSxFQUtOO0FBQUUsUUFBQSxHQUFHLEVBQUUsYUFBUDtBQUFzQixRQUFBLEtBQUssRUFBRTtBQUE3QixPQUxNLEVBTU47QUFBRSxRQUFBLEdBQUcsRUFBRSxZQUFQO0FBQXFCLFFBQUEsS0FBSyxFQUFFLFlBQTVCO0FBQTJDLFFBQUEsUUFBUSxFQUFFO0FBQXJELE9BTk0sRUFPTjtBQUFFLFFBQUEsR0FBRyxFQUFFLFlBQVA7QUFBcUIsUUFBQSxLQUFLLEVBQUUsWUFBNUI7QUFBMkMsUUFBQSxRQUFRLEVBQUU7QUFBckQsT0FQTTtBQVZILEtBQVA7QUFvQkQ7QUFuRDZDLENBQTlCLENBQWxCOzs7Ozs7Ozs7Ozs7Ozs7QUNEQTs7Ozs7O0FBQ0EsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxZQUFkLEVBQTRCO0FBQzNDLEVBQUEsUUFBUSwybkpBRG1DO0FBMkYzQyxFQUFBLEtBQUssRUFBRSxDQUFDLGNBQUQsQ0EzRm9DO0FBNEYzQyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLFdBQVcsRUFBRSxDQURSO0FBRUwsTUFBQSxRQUFRLEVBQUUsRUFGTDtBQUdMLE1BQUEsV0FBVyxFQUFFLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsSUFIM0I7QUFJTCxNQUFBLE9BQU8sRUFBRSxxQkFBVSxLQUFLLE1BQUwsQ0FBWSxJQUoxQjtBQUtMLE1BQUEsSUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsVUFMcEI7QUFNTCxNQUFBLFNBQVMsRUFBRSxLQU5OO0FBT0wsTUFBQSxXQUFXLEVBQUUsQ0FQUjtBQVFMLE1BQUEsTUFBTSxFQUFFLEdBUkg7QUFTTCxNQUFBLEtBQUssRUFBRSxJQVRGO0FBVUwsTUFBQSxlQUFlLEVBQUUsRUFWWjtBQVdMLE1BQUEsYUFBYSxFQUFFLEVBWFY7QUFZTDtBQUNBO0FBQ0E7QUFDQSxNQUFBLFdBQVcsRUFBRSxFQWZSO0FBZ0JMLE1BQUEsWUFBWSxFQUFFO0FBaEJULEtBQVA7QUFrQkQsR0EvRzBDO0FBaUgzQyxFQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNuQjtBQUNBLFNBQUssY0FBTCxDQUFvQixLQUFLLFdBQXpCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsV0FBVyxDQUN0QixZQUFXO0FBQ1QsV0FBSyxNQUFMO0FBQ0QsS0FGRCxDQUVFLElBRkYsQ0FFTyxJQUZQLENBRHNCLEVBSXRCLEtBQUssTUFBTCxHQUFjLEtBSlEsQ0FBeEI7QUFNRCxHQTFIMEM7QUEySDNDLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxZQUFZLEVBQUU7QUFDWixNQUFBLFNBQVMsRUFBRSxJQURDO0FBRVosTUFBQSxPQUFPLEVBQUUsbUJBQVk7QUFDbkIsYUFBSyxjQUFMLENBQW9CLEtBQUssV0FBekI7QUFDRDtBQUpXO0FBRFQsR0EzSG9DO0FBbUkzQyxFQUFBLGFBQWEsRUFBRSx5QkFBVztBQUN4QjtBQUNBLFNBQUssZ0JBQUw7QUFDRCxHQXRJMEM7QUF1STNDLEVBQUEsT0FBTyxFQUFFO0FBQ04sSUFBQSxnQkFBZ0IsRUFBRSw0QkFBVztBQUM1QixNQUFBLGFBQWEsQ0FBQyxLQUFLLEtBQU4sQ0FBYjtBQUNELEtBSE07QUFJUCxJQUFBLG1CQUFtQixFQUFFLCtCQUFXO0FBQzlCLFdBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsWUFBckIsRUFBbUMsS0FBSyxJQUF4QztBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFLLElBQWpCO0FBQ0QsS0FQTTtBQVFQLElBQUEsTUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFVBQUksS0FBSyxZQUFMLElBQXFCLElBQXpCLEVBQStCO0FBQzdCLGFBQUssY0FBTCxDQUFvQixLQUFLLFdBQXpCO0FBQ0Q7QUFDRixLQVpNO0FBYVAsSUFBQSxjQUFjLEVBQUUsd0JBQVMsS0FBVCxFQUFnQjtBQUM5QixhQUFPLEtBQUssZUFBTCxDQUFxQixLQUFyQixDQUNMLENBQUMsS0FBSyxHQUFHLENBQVQsSUFBYyxLQUFLLFdBRGQsRUFFTCxLQUFLLEdBQUcsS0FBSyxXQUZSLENBQVA7QUFJRCxLQWxCTTtBQW1CUCxJQUFBLGNBQWMsRUFBRSx3QkFBUyxXQUFULEVBQXNCO0FBQUE7O0FBQ3BDO0FBQ0EsVUFBSSxVQUFVLEdBQUcsS0FBSyxXQUF0QixDQUZvQyxDQUdwQzs7QUFDQSxVQUFJLEVBQUUsR0FBRyxLQUFLLFlBQUwsR0FBb0IsQ0FBN0I7O0FBRUEsVUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBTixFQUEyQixFQUEzQixDQUFqQjs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksMEJBQVo7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksRUFBWjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFaO0FBRUEsVUFBSSxhQUFhLEdBQUcsRUFBcEI7QUFDQSxVQUFJLGNBQWMsR0FBRyxFQUFyQjs7QUFDQSxVQUFHLEtBQUssWUFBTCxHQUFvQixDQUF2QixFQUNBO0FBQ0UsUUFBQSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVIsQ0FBTixFQUEwQixFQUFFLEdBQUcsQ0FBL0IsQ0FBakI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksOEJBQVo7QUFDQSxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBWjtBQUNBLFFBQUEsYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFSLENBQVAsRUFBNEIsRUFBNUIsQ0FBaEI7QUFDRDs7QUFDRCxVQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRixDQUFNLFVBQU4sRUFBa0IsVUFBQSxNQUFNLEVBQUk7QUFDOUMsWUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQVAsR0FBYSxDQUFyQjtBQUNBLFFBQUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsS0FBL0I7QUFDQSxRQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLEtBQUksQ0FBQyxPQUFMLENBQWEsQ0FBYixFQUFnQixNQUFoQztBQUNBLFFBQUEsTUFBTSxDQUFDLFlBQVAsR0FBc0IsS0FBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFlBQXRDO0FBQ0EsUUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsT0FBakM7O0FBQ0EsWUFBSSxjQUFjLENBQUMsTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUM3QixjQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsSUFBRixDQUFPLGNBQVAsRUFBdUI7QUFDdEMsWUFBQSxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBRHVCLFdBQXZCLENBQWpCOztBQUdBLFVBQUEsTUFBTSxDQUFDLFlBQVAsR0FBc0IsVUFBVSxDQUFDLFVBQUQsQ0FBaEM7QUFDQSxVQUFBLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFVBQVUsQ0FBQyxNQUFELENBQTVCLENBTDZCLENBTTdCOztBQUNBLGNBQUcsYUFBYSxDQUFDLE1BQWQsR0FBdUIsQ0FBMUIsRUFBNkI7QUFDM0IsWUFBQSxNQUFNLENBQUMsV0FBUCxHQUFxQixDQUFDLENBQUMsS0FBRixDQUFRLGFBQVIsRUFDcEIsV0FEb0IsR0FFcEIsTUFGb0IsQ0FFYixVQUFTLENBQVQsRUFBWTtBQUNsQixxQkFBTyxDQUFDLENBQUMsTUFBRixLQUFhLE1BQU0sQ0FBQyxNQUEzQjtBQUNELGFBSm9CLEVBS3BCLEdBTG9CLENBS2hCLFFBTGdCLEVBTWxCLEtBTmtCLEVBQXJCO0FBT0Q7QUFDRjs7QUFDRCxlQUFPLE1BQVA7QUFDRCxPQXhCbUIsQ0FBcEIsQ0FwQm9DLENBOENwQztBQUNBOzs7QUFDQSxVQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLGFBQVIsRUFBdUIsS0FBSyxhQUE1QixDQUFiLENBaERvQyxDQWlEcEM7OztBQUNBLFdBQUssZUFBTCxHQUF1QixNQUFNLENBQUMsV0FBVyxHQUFHLENBQWYsQ0FBN0I7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksaUJBQVo7QUFDQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxlQUFqQjtBQUNEO0FBeEVNLEdBdklrQztBQWlOM0MsRUFBQSxRQUFRLGtDQUNILElBQUksQ0FBQyxVQUFMLENBQWdCO0FBQ2pCLElBQUEsV0FBVyxFQUFFLFlBREk7QUFFakIsSUFBQSxPQUFPLEVBQUUsU0FGUTtBQUdqQixJQUFBLGFBQWEsRUFBRSxjQUhFO0FBSWpCLElBQUEsWUFBWSxFQUFFLGNBSkc7QUFLakIsSUFBQSxPQUFPLEVBQUUsU0FMUTtBQU1qQixJQUFBLEtBQUssRUFBRSxPQU5VO0FBT2pCLElBQUEsUUFBUSxFQUFFO0FBUE8sR0FBaEIsQ0FERztBQVVOLElBQUEsUUFBUSxFQUFFLG9CQUFXO0FBQ25CLGFBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLGVBQUwsQ0FBcUIsTUFBckIsR0FBOEIsS0FBSyxXQUE3QyxDQUFQO0FBQ0QsS0FaSztBQWFOLElBQUEsU0FBUyxFQUFFLHFCQUFXO0FBQ3BCLHVGQUNFLEtBQUssT0FEUDtBQUdEO0FBakJLO0FBak5tQyxDQUE1QixDQUFqQjtlQXNPZSxVOzs7Ozs7Ozs7Ozs7Ozs7QUN4T2Y7Ozs7OztBQUdBLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsV0FBZCxFQUEyQjtBQUMxQyxFQUFBLFFBQVEsbzdGQURrQztBQWtFMUMsRUFBQSxJQWxFMEMsa0JBa0VuQztBQUNMLFdBQU87QUFDTCxNQUFBLElBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFVBRHBCO0FBRUwsTUFBQSxTQUFTLEVBQUUsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixHQUZ6QjtBQUdMLE1BQUEsSUFBSSxFQUFFLEtBQUssTUFBTCxDQUFZLElBSGI7QUFJTCxNQUFBLFlBQVksRUFBRSxFQUpUO0FBS0wsTUFBQSxRQUFRLEVBQUU7QUFDUixRQUFBLEtBQUssRUFBRSxLQURDO0FBRVIsUUFBQSxPQUFPLEVBQUUsUUFGRDtBQUdSLFFBQUEsS0FBSyxFQUFFLElBSEM7QUFJUixRQUFBLEtBQUssRUFBRSxJQUpDO0FBS1IsUUFBQSxLQUFLLEVBQUUsTUFMQztBQU1SLFFBQUEsTUFBTSxFQUFFLE1BTkE7QUFPUixpQkFBTztBQVBDLE9BTEw7QUFjTCxNQUFBLE1BQU0sRUFBRSxDQUFDO0FBQUMsUUFBQSxHQUFHLEVBQUMsT0FBTDtBQUFhLFFBQUEsS0FBSyxFQUFDLElBQW5CO0FBQXdCLFFBQUEsUUFBUSxFQUFDO0FBQWpDLE9BQUQsRUFBeUM7QUFBQyxRQUFBLEdBQUcsRUFBRSxNQUFOO0FBQWMsUUFBQSxLQUFLLEVBQUM7QUFBcEIsT0FBekMsRUFBMEU7QUFBQyxRQUFBLEdBQUcsRUFBQyxZQUFMO0FBQWtCLFFBQUEsS0FBSyxFQUFDLFlBQXhCO0FBQXFDLFFBQUEsUUFBUSxFQUFDO0FBQTlDLE9BQTFFLEVBQThIO0FBQUMsUUFBQSxHQUFHLEVBQUMsT0FBTDtBQUFhLFFBQUEsUUFBUSxFQUFDO0FBQXRCLE9BQTlILEVBQTBKO0FBQUMsUUFBQSxHQUFHLEVBQUMsTUFBTDtBQUFZLFFBQUEsUUFBUSxFQUFDO0FBQXJCLE9BQTFKLEVBQXFMO0FBQUMsUUFBQSxHQUFHLEVBQUMsUUFBTDtBQUFjLFFBQUEsUUFBUSxFQUFDO0FBQXZCLE9BQXJMLEVBQW1OO0FBQUMsUUFBQSxHQUFHLEVBQUMsTUFBTDtBQUFZLFFBQUEsS0FBSyxFQUFDLEtBQWxCO0FBQXdCLFFBQUEsUUFBUSxFQUFDO0FBQWpDLE9BQW5OLEVBQTBQO0FBQUMsUUFBQSxHQUFHLEVBQUMsUUFBTDtBQUFjLFFBQUEsS0FBSyxFQUFDLE1BQXBCO0FBQTJCLFFBQUEsUUFBUSxFQUFDO0FBQXBDLE9BQTFQLEVBQW9TO0FBQUMsUUFBQSxHQUFHLEVBQUMsUUFBTDtBQUFjLFFBQUEsUUFBUSxFQUFDO0FBQXZCLE9BQXBTLEVBQWlVO0FBQUMsUUFBQSxHQUFHLEVBQUMsUUFBTDtBQUFjLFFBQUEsUUFBUSxFQUFDLElBQXZCO0FBQTRCLFFBQUEsS0FBSyxFQUFDO0FBQWxDLE9BQWpVLEVBQTBXO0FBQUMsUUFBQSxHQUFHLEVBQUMsVUFBTDtBQUFnQixRQUFBLEtBQUssRUFBQyxNQUF0QjtBQUE2QixRQUFBLFFBQVEsRUFBQztBQUF0QyxPQUExVyxDQWRIO0FBZUwsTUFBQSxLQUFLLEVBQUUsRUFmRjtBQWdCTCxNQUFBLFNBQVMsRUFBRSxFQWhCTjtBQWlCTCxNQUFBLE9BQU8sRUFBRTtBQWpCSixLQUFQO0FBbUJELEdBdEZ5QztBQXVGMUMsRUFBQSxVQUFVLEVBQUU7QUFDVixJQUFBLE9BQU8sRUFBRSxvQkFEQztBQUVWLElBQUEsS0FBSyxFQUFFO0FBRkcsR0F2RjhCO0FBMkYxQyxFQUFBLE9BM0YwQyxxQkEyRmhDO0FBQ1IsUUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixHQUFoQixDQUFSO0FBQ0EsSUFBQSxDQUFDLENBQUMsS0FBRjtBQUNBLFNBQUssWUFBTCxHQUFvQixDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBcEI7QUFDQSxJQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxZQUFqQjtBQUNBLFNBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsZUFBckIsRUFBc0MsS0FBSyxJQUEzQztBQUNBLElBQUEsUUFBUSxDQUFDLEtBQVQsaUNBQXdDLEtBQUssYUFBN0M7QUFDRCxHQWxHeUM7QUFtRzFDLEVBQUEsS0FBSyxFQUFDO0FBQ0osSUFBQSxVQUFVLEVBQUU7QUFDVixNQUFBLFNBQVMsRUFBRSxJQUREO0FBRVYsTUFBQSxJQUFJLEVBQUUsSUFGSTtBQUdWLE1BQUEsT0FBTyxFQUFFLGlCQUFVLE1BQVYsRUFBa0I7QUFDekIsWUFBSSxNQUFKLEVBQVk7QUFDVixlQUFLLEtBQUwsR0FBYSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBYixFQUNWLElBRFUsR0FDSCxNQURHLENBQ0ksS0FESixFQUNXLEtBRFgsRUFBYjtBQUVBLGVBQUssT0FBTCxDQUFhLEtBQUssU0FBbEI7QUFDRDtBQUNGO0FBVFM7QUFEUixHQW5Hb0M7QUFnSDFDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxPQUFPLEVBQUUsaUJBQVUsQ0FBVixFQUFhO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBSyxVQUFiLENBQVI7O0FBQ0EsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLEVBQVcsR0FBWCxDQUFlLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLGVBQU8sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVksVUFBVSxDQUFWLEVBQWE7QUFDOUIsaUJBQU8sQ0FBQyxDQUFDLEdBQUYsSUFBUyxDQUFoQjtBQUNELFNBRk0sRUFFSixHQUZJLENBRUMsVUFBUyxDQUFULEVBQVc7QUFDakIsVUFBQSxDQUFDLENBQUMsYUFBRixHQUFrQixFQUFsQjtBQUNBLFVBQUEsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsTUFBaEIsR0FBeUIsTUFBekI7O0FBQ0EsY0FBRyxDQUFDLENBQUMsTUFBRixLQUFZLEtBQWYsRUFBcUI7QUFDbkIsWUFBQSxDQUFDLENBQUMsYUFBRixDQUFnQixNQUFoQixHQUF5QixTQUF6QjtBQUNEOztBQUNELGNBQUcsQ0FBQyxDQUFDLE1BQUYsS0FBWSxNQUFmLEVBQXNCO0FBQ3BCLFlBQUEsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsTUFBaEIsR0FBeUIsUUFBekI7QUFDRDs7QUFDRCxjQUFHLENBQUMsQ0FBQyxNQUFGLEtBQVksTUFBZixFQUFzQjtBQUNwQixZQUFBLENBQUMsQ0FBQyxhQUFGLENBQWdCLE1BQWhCLEdBQXlCLFNBQXpCO0FBQ0Q7O0FBQ0QsaUJBQU8sQ0FBUDtBQUNELFNBZk0sQ0FBUDtBQWdCRCxPQWpCTyxFQWlCTCxXQWpCSyxHQWlCUyxLQWpCVCxFQUFSOztBQWtCQSxXQUFLLE9BQUwsR0FBZSxDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsQ0FBZjtBQUNBLFdBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUI7QUFBRSxRQUFBLElBQUksRUFBRSxZQUFSO0FBQXNCLFFBQUEsTUFBTSxFQUFFO0FBQUUsVUFBQSxHQUFHLEVBQUU7QUFBUDtBQUE5QixPQUFyQjtBQUNBLFdBQUssU0FBTCxHQUFpQixDQUFqQjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0g7QUExQlEsR0FoSGlDO0FBNkkxQyxFQUFBLFFBQVEsa0NBQ0gsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFDakIsSUFBQSxPQUFPLEVBQUUsU0FEUTtBQUVqQixJQUFBLGFBQWEsRUFBRSxjQUZFO0FBR2pCLElBQUEsVUFBVSxFQUFFLFlBSEs7QUFJakIsSUFBQSxVQUFVLEVBQUUsWUFKSztBQUtqQixJQUFBLEtBQUssRUFBRSxPQUxVO0FBTWpCLElBQUEsT0FBTyxFQUFFLFNBTlE7QUFPakIsSUFBQSxRQUFRLEVBQUUsVUFQTztBQVFqQixJQUFBLFlBQVksRUFBRSxjQVJHO0FBU2pCLElBQUEsV0FBVyxFQUFFLFlBVEk7QUFVakIsSUFBQSxXQUFXLEVBQUUsYUFWSTtBQVdqQixJQUFBLGFBQWEsRUFBRSxlQVhFO0FBWWpCLElBQUEsSUFBSSxFQUFFO0FBWlcsR0FBaEIsQ0FERztBQWVOLElBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLGFBQU8sQ0FDTDtBQUNFLFFBQUEsSUFBSSxFQUFFLFVBRFI7QUFFRSxRQUFBLElBQUksRUFBRTtBQUZSLE9BREssRUFLTDtBQUNFLFFBQUEsSUFBSSxFQUFFLGFBRFI7QUFFRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFO0FBREo7QUFGTixPQUxLLEVBV0w7QUFDRSxRQUFBLElBQUksRUFBRSxLQUFLLGFBRGI7QUFFRSxRQUFBLEVBQUUsRUFBRTtBQUNGLFVBQUEsSUFBSSxFQUFFLGVBREo7QUFFRixVQUFBLE1BQU0sRUFBRTtBQUNOLFlBQUEsSUFBSSxFQUFFLEtBQUs7QUFETDtBQUZOO0FBRk4sT0FYSyxFQW9CTDtBQUNFLFFBQUEsSUFBSSxZQUFLLENBQUMsQ0FBQyxVQUFGLENBQWEsS0FBSyxRQUFsQixDQUFMLHlCQUROO0FBRUUsUUFBQSxFQUFFLEVBQUU7QUFDRixVQUFBLElBQUksRUFBRSxZQURKO0FBRUYsVUFBQSxNQUFNLEVBQUU7QUFDTixZQUFBLFVBQVUsRUFBRSxLQUFLO0FBRFg7QUFGTjtBQUZOLE9BcEJLLEVBNkJMO0FBQ0UsUUFBQSxJQUFJLEVBQUUsWUFEUjtBQUVFLFFBQUEsTUFBTSxFQUFFO0FBRlYsT0E3QkssQ0FBUDtBQWtDRCxLQWxESztBQW1ETixJQUFBLFNBQVMsRUFBRSxxQkFBVztBQUNwQix1RkFDRSxLQUFLLElBRFA7QUFHRDtBQXZESztBQTdJa0MsQ0FBM0IsQ0FBakI7Ozs7Ozs7Ozs7QUNIQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBSixDQUFjLFFBQWQsRUFBd0I7QUFDcEMsRUFBQSxRQUFRLGdSQUQ0QjtBQVFwQyxFQUFBLEtBQUssRUFBRSxDQUFDLFNBQUQsRUFBWSxZQUFaLENBUjZCO0FBU3BDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMLE1BQUEsY0FBYyxFQUFFO0FBRFgsS0FBUDtBQUdELEdBYm1DO0FBY3BDLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFNBQUssY0FBTCxHQUFzQixDQUNwQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE9BQVA7QUFBZ0IsTUFBQSxRQUFRLEVBQUU7QUFBMUIsS0FEb0IsRUFFcEI7QUFBRSxNQUFBLEdBQUcsRUFBRSxPQUFQO0FBQWdCLE1BQUEsS0FBSyxFQUFFLGVBQXZCO0FBQXdDLE1BQUEsUUFBUSxFQUFFO0FBQWxELEtBRm9CLEVBR3BCO0FBQUUsTUFBQSxHQUFHLEVBQUUsUUFBUDtBQUFpQixNQUFBLEtBQUssRUFBRSxRQUF4QjtBQUFrQyxNQUFBLFFBQVEsRUFBRTtBQUE1QyxLQUhvQixFQUlwQjtBQUFFLE1BQUEsR0FBRyxFQUFFLFlBQVA7QUFBcUIsTUFBQSxLQUFLLEVBQUU7QUFBNUIsS0FKb0IsRUFLcEI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsTUFBQSxLQUFLLEVBQUU7QUFBdEIsS0FMb0IsQ0FBdEI7QUFPRCxHQXRCbUM7QUF1QnBDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxXQUFXLEVBQUUscUJBQVMsTUFBVCxFQUFpQjtBQUM1QixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBYixDQUFYOztBQUNBLGFBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQ0osR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsZUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsRUFDSixHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFQO0FBQ0QsU0FISSxFQUlKLE1BSkksQ0FJRyxVQUFTLENBQVQsRUFBWTtBQUNsQixpQkFBTyxDQUFDLENBQUMsUUFBRCxDQUFELEtBQWdCLE1BQXZCO0FBQ0QsU0FOSSxFQU9KLEtBUEksQ0FPRSxVQUFTLENBQVQsRUFBWTtBQUNqQixpQkFBTyxDQUFDLENBQUMsS0FBVDtBQUNELFNBVEksRUFVSixLQVZJLEVBQVA7QUFXRCxPQWJJLEVBY0osTUFkSSxDQWNHLE9BZEgsRUFlSixLQWZJLEVBQVA7QUFnQkQ7QUFuQk07QUF2QjJCLENBQXhCLENBQWI7O0FBOENBLElBQUksTUFBTSxHQUFFLEdBQUcsQ0FBQyxTQUFKLENBQWMsUUFBZCxFQUF3QjtBQUNuQyxFQUFBLFFBQVEsNFFBRDJCO0FBT25DLEVBQUEsS0FBSyxFQUFFLENBQUMsU0FBRCxFQUFZLFlBQVosQ0FQNEI7QUFRbkMsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxlQUFlLEVBQUU7QUFEWixLQUFQO0FBR0QsR0Faa0M7QUFhbkMsRUFBQSxXQUFXLEVBQUUsdUJBQVc7QUFDdEIsU0FBSyxlQUFMLEdBQXVCLENBQ3JCO0FBQUUsTUFBQSxHQUFHLEVBQUUsT0FBUDtBQUFnQixNQUFBLFFBQVEsRUFBRTtBQUExQixLQURxQixFQUVyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE9BQVA7QUFBZ0IsTUFBQSxLQUFLLEVBQUUsZUFBdkI7QUFBd0MsTUFBQSxRQUFRLEVBQUU7QUFBbEQsS0FGcUIsRUFHckI7QUFBRSxNQUFBLEdBQUcsRUFBRSxRQUFQO0FBQWlCLE1BQUEsS0FBSyxFQUFFLFFBQXhCO0FBQWtDLE1BQUEsUUFBUSxFQUFFO0FBQTVDLEtBSHFCLEVBSXJCO0FBQUUsTUFBQSxHQUFHLEVBQUUsWUFBUDtBQUFxQixNQUFBLEtBQUssRUFBRTtBQUE1QixLQUpxQixFQUtyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE1BQVA7QUFBZSxNQUFBLEtBQUssRUFBRTtBQUF0QixLQUxxQixDQUF2QjtBQU9ELEdBckJrQztBQXNCbkMsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLFVBQVUsRUFBRSxvQkFBUyxNQUFULEVBQWlCO0FBQzNCLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBSyxVQUFiLENBQVg7O0FBQ0EsYUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFDSixHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixlQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBUixFQUNKLEdBREksQ0FDQSxVQUFTLENBQVQsRUFBWTtBQUNmLGlCQUFPLENBQVA7QUFDRCxTQUhJLEVBSUosTUFKSSxDQUlHLFVBQVMsQ0FBVCxFQUFZO0FBQ2xCLGlCQUFPLENBQUMsQ0FBQyxRQUFELENBQUQsS0FBZ0IsTUFBdkI7QUFDRCxTQU5JLEVBT0osS0FQSSxDQU9FLFVBQVMsQ0FBVCxFQUFZO0FBQ2pCLGlCQUFPLENBQUMsQ0FBQyxLQUFUO0FBQ0QsU0FUSSxFQVVKLEtBVkksRUFBUDtBQVdELE9BYkksRUFjSixNQWRJLENBY0csT0FkSCxFQWVKLEtBZkksR0FnQkosT0FoQkksRUFBUDtBQWlCRDtBQXBCTTtBQXRCMEIsQ0FBeEIsQ0FBWjs7QUE4Q0EsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxRQUFkLEVBQXdCO0FBQ3BDLEVBQUEsUUFBUSxpUkFENEI7QUFTcEMsRUFBQSxLQUFLLEVBQUUsQ0FBQyxTQUFELEVBQVksWUFBWixDQVQ2QjtBQVVwQyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLGFBQWEsRUFBRTtBQURWLEtBQVA7QUFHRCxHQWRtQztBQWVwQyxFQUFBLFdBQVcsRUFBRSx1QkFBVztBQUN0QixTQUFLLGFBQUwsR0FBcUIsQ0FDbkI7QUFBRSxNQUFBLEdBQUcsRUFBRSxPQUFQO0FBQWdCLE1BQUEsUUFBUSxFQUFFO0FBQTFCLEtBRG1CLEVBRW5CO0FBQUUsTUFBQSxHQUFHLEVBQUUsT0FBUDtBQUFnQixNQUFBLEtBQUssRUFBRSxjQUF2QjtBQUF1QyxNQUFBLFFBQVEsRUFBRTtBQUFqRCxLQUZtQixFQUduQjtBQUFFLE1BQUEsR0FBRyxFQUFFLFFBQVA7QUFBaUIsTUFBQSxLQUFLLEVBQUUsT0FBeEI7QUFBaUMsTUFBQSxRQUFRLEVBQUU7QUFBM0MsS0FIbUIsRUFJbkI7QUFBRSxNQUFBLEdBQUcsRUFBRSxZQUFQO0FBQXFCLE1BQUEsS0FBSyxFQUFFO0FBQTVCLEtBSm1CLEVBS25CO0FBQUUsTUFBQSxHQUFHLEVBQUUsTUFBUDtBQUFlLE1BQUEsS0FBSyxFQUFFO0FBQXRCLEtBTG1CLENBQXJCO0FBT0QsR0F2Qm1DO0FBd0JwQyxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsVUFBVSxFQUFFLG9CQUFTLE1BQVQsRUFBaUI7QUFDM0IsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFLLFVBQWIsQ0FBWDs7QUFDQSxhQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUixFQUNKLEdBREksQ0FDQSxVQUFTLENBQVQsRUFBWTtBQUNmLGVBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLEVBQ0osR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsaUJBQU8sQ0FBUDtBQUNELFNBSEksRUFJSixNQUpJLENBSUcsVUFBUyxDQUFULEVBQVk7QUFDbEIsaUJBQU8sQ0FBQyxDQUFDLFFBQUQsQ0FBRCxLQUFnQixNQUF2QjtBQUNELFNBTkksRUFPSixHQVBJLENBT0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFDLENBQUMsS0FBVDtBQUNELFNBVEksRUFVSixLQVZJLEVBQVA7QUFXRCxPQWJJLEVBY0osTUFkSSxDQWNHLE9BZEgsRUFlSixLQWZJLEdBZ0JKLE9BaEJJLEVBQVA7QUFpQkQ7QUFwQk07QUF4QjJCLENBQXhCLENBQWI7O0FBZ0RELElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsYUFBZCxFQUE2QjtBQUM3QyxFQUFBLFFBQVEseU5BRHFDO0FBUTdDLEVBQUEsS0FBSyxFQUFFLENBQUMsU0FBRCxFQUFZLFlBQVosQ0FSc0M7QUFTN0MsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxjQUFjLEVBQUU7QUFEWCxLQUFQO0FBR0QsR0FiNEM7QUFjN0MsRUFBQSxXQUFXLEVBQUUsdUJBQVc7QUFDdEIsU0FBSyxjQUFMLEdBQXNCLENBQ3BCO0FBQUUsTUFBQSxHQUFHLEVBQUUsT0FBUDtBQUFnQixNQUFBLFFBQVEsRUFBRTtBQUExQixLQURvQixFQUVwQjtBQUNFLE1BQUEsR0FBRyxFQUFFLGFBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxnQkFGVDtBQUdFLE1BQUEsUUFBUSxFQUFFLElBSFo7QUFJRSxlQUFPO0FBSlQsS0FGb0IsRUFRcEI7QUFDRSxNQUFBLEdBQUcsRUFBRSxPQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsZUFGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsUUFBUSxFQUFFO0FBSlosS0FSb0IsRUFjcEI7QUFDRSxNQUFBLEdBQUcsRUFBRSxZQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsY0FGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsUUFBUSxFQUFFO0FBSlosS0Fkb0IsRUFvQnBCO0FBQUUsTUFBQSxHQUFHLEVBQUUsUUFBUDtBQUFpQixNQUFBLEtBQUssRUFBRSxRQUF4QjtBQUFrQyxlQUFPO0FBQXpDLEtBcEJvQixFQXFCcEI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsTUFBQSxLQUFLLEVBQUUsT0FBdEI7QUFBK0IsZUFBTztBQUF0QyxLQXJCb0IsQ0FBdEI7QUF1QkQsR0F0QzRDO0FBdUM3QyxFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsT0FETyxxQkFDRztBQUNSLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBSyxVQUFiLENBQVg7O0FBQ0EsYUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLElBQVIsRUFDSixHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixlQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsQ0FBUixFQUNKLEdBREksQ0FDQSxVQUFTLENBQVQsRUFBWTtBQUNmLGlCQUFPLENBQVA7QUFDRCxTQUhJLEVBSUosTUFKSSxDQUlHLFVBQVMsQ0FBVCxFQUFZO0FBQ2xCLGlCQUFPLENBQUMsQ0FBQyxRQUFELENBQUQsS0FBZ0IsS0FBdkI7QUFDRCxTQU5JLEVBT0osS0FQSSxDQU9FLFVBQVMsQ0FBVCxFQUFZO0FBQ2pCLGlCQUFPLENBQUMsQ0FBQyxXQUFUO0FBQ0QsU0FUSSxFQVVKLEtBVkksRUFBUDtBQVdELE9BYkksRUFjSixNQWRJLENBY0csYUFkSCxFQWVKLEtBZkksR0FnQkosT0FoQkksRUFBUDtBQWlCRDtBQXBCTTtBQXZDb0MsQ0FBN0IsQ0FBbEI7O0FBK0RDLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsYUFBZCxFQUE2QjtBQUM5QyxFQUFBLFFBQVEscVZBRHNDO0FBVzlDLEVBQUEsS0FBSyxFQUFFLENBQUMsU0FBRCxFQUFZLE9BQVosQ0FYdUM7QUFZOUMsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxpQkFBaUIsRUFBRTtBQURkLEtBQVA7QUFHRCxHQWhCNkM7QUFpQjlDLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFNBQUssaUJBQUwsR0FBeUIsQ0FDekI7QUFDRTtBQUFFLE1BQUEsR0FBRyxFQUFFLFVBQVA7QUFBbUIsTUFBQSxRQUFRLEVBQUU7QUFBN0IsS0FGdUIsRUFHdkI7QUFDRSxNQUFBLEdBQUcsRUFBRSxhQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsYUFGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsUUFBUSxFQUFFO0FBSlosS0FIdUIsRUFTdkI7QUFBRSxNQUFBLEdBQUcsRUFBRSxRQUFQO0FBQWlCLE1BQUEsS0FBSyxFQUFFLFFBQXhCO0FBQWtDLGVBQU87QUFBekMsS0FUdUIsRUFVdkI7QUFDRSxNQUFBLEdBQUcsRUFBRSxTQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsVUFGVDtBQUdFLE1BQUEsUUFBUSxFQUFFLEtBSFo7QUFJRSxlQUFPLGFBSlQ7QUFLRSxNQUFBLFNBQVMsRUFBRSxtQkFBQyxLQUFELEVBQVEsR0FBUixFQUFhLElBQWIsRUFBc0I7QUFDL0IsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUwsR0FBYSxJQUFJLENBQUMsTUFBN0I7QUFDQSx5QkFBVSxJQUFJLENBQUMsTUFBZixnQkFBMkIsSUFBM0I7QUFDRDtBQVJILEtBVnVCLEVBb0J2QjtBQUNFLE1BQUEsR0FBRyxFQUFFLFFBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxRQUZUO0FBR0UsZUFBTyxhQUhUO0FBSUUsTUFBQSxTQUFTLEVBQUUsbUJBQUEsS0FBSyxFQUFJO0FBQ2xCLFlBQUksS0FBSyxHQUFHLENBQVosRUFBZTtBQUNiLDRCQUFXLEtBQVg7QUFDRDs7QUFDRCx5QkFBVSxLQUFWO0FBQ0Q7QUFUSCxLQXBCdUIsQ0FBekI7QUFnQ0Q7QUFsRDZDLENBQTdCLENBQWxCOztBQXFEQSxJQUFJLGNBQWMsR0FBRSxHQUFHLENBQUMsU0FBSixDQUFjLFdBQWQsRUFBMkI7QUFDOUMsRUFBQSxRQUFRLGdYQURzQztBQVc5QyxFQUFBLEtBQUssRUFBRSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBWHVDO0FBWTlDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMLE1BQUEsb0JBQW9CLEVBQUU7QUFEakIsS0FBUDtBQUdELEdBaEI2QztBQWlCOUMsRUFBQSxXQUFXLEVBQUUsdUJBQVc7QUFDdEIsU0FBSyxvQkFBTCxHQUE0QixDQUMzQjtBQUNDO0FBQUUsTUFBQSxHQUFHLEVBQUUsVUFBUDtBQUFtQixNQUFBLFFBQVEsRUFBRTtBQUE3QixLQUYwQixFQUcxQjtBQUNFLE1BQUEsR0FBRyxFQUFFLGdCQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsc0JBRlQ7QUFHRSxlQUFPLGFBSFQ7QUFJRSxNQUFBLFFBQVEsRUFBRTtBQUpaLEtBSDBCLEVBUzFCO0FBQUUsTUFBQSxHQUFHLEVBQUUsUUFBUDtBQUFpQixNQUFBLEtBQUssRUFBRSxRQUF4QjtBQUFrQyxlQUFPO0FBQXpDLEtBVDBCLEVBVTFCO0FBQ0UsTUFBQSxHQUFHLEVBQUUsU0FEUDtBQUVFLE1BQUEsS0FBSyxFQUFFLFVBRlQ7QUFHRSxNQUFBLFFBQVEsRUFBRSxLQUhaO0FBSUUsZUFBTyxhQUpUO0FBS0UsTUFBQSxTQUFTLEVBQUUsbUJBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxJQUFiLEVBQXNCO0FBQy9CLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFMLEdBQWEsSUFBSSxDQUFDLE1BQTdCO0FBQ0EseUJBQVUsSUFBSSxDQUFDLE1BQWYsZ0JBQTJCLElBQTNCO0FBQ0Q7QUFSSCxLQVYwQixFQW9CMUI7QUFDRSxNQUFBLEdBQUcsRUFBRSxRQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsUUFGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsU0FBUyxFQUFFLG1CQUFBLEtBQUssRUFBSTtBQUNsQixZQUFJLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYiw0QkFBVyxLQUFYO0FBQ0Q7O0FBQ0QseUJBQVUsS0FBVjtBQUNEO0FBVEgsS0FwQjBCLENBQTVCO0FBZ0NEO0FBbEQ2QyxDQUEzQixDQUFwQjs7QUFxREEsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTJCO0FBQzFDLEVBQUEsUUFBUSxrVkFEa0M7QUFXMUMsRUFBQSxLQUFLLEVBQUUsQ0FBQyxTQUFELEVBQVksT0FBWixDQVhtQztBQVkxQyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLGVBQWUsRUFBRTtBQURaLEtBQVA7QUFHRCxHQWhCeUM7QUFpQjFDLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFNBQUssZUFBTCxHQUF1QixDQUNyQjtBQUNBO0FBQUUsTUFBQSxHQUFHLEVBQUUsVUFBUDtBQUFtQixNQUFBLFFBQVEsRUFBRTtBQUE3QixLQUZxQixFQUdyQjtBQUNFLE1BQUEsR0FBRyxFQUFFLFdBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxlQUZUO0FBR0UsZUFBTyxhQUhUO0FBSUUsTUFBQSxRQUFRLEVBQUU7QUFKWixLQUhxQixFQVNyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLFFBQVA7QUFBaUIsTUFBQSxLQUFLLEVBQUUsUUFBeEI7QUFBa0MsZUFBTztBQUF6QyxLQVRxQixFQVVyQjtBQUNFLE1BQUEsR0FBRyxFQUFFLFNBRFA7QUFFRSxNQUFBLEtBQUssRUFBRSxVQUZUO0FBR0UsTUFBQSxRQUFRLEVBQUUsS0FIWjtBQUlFLGVBQU8sYUFKVDtBQUtFLE1BQUEsU0FBUyxFQUFFLG1CQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixFQUFzQjtBQUMvQixZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBTCxHQUFhLElBQUksQ0FBQyxNQUE3QjtBQUNBLHlCQUFVLElBQUksQ0FBQyxNQUFmLGdCQUEyQixJQUEzQjtBQUNEO0FBUkgsS0FWcUIsRUFvQnJCO0FBQ0UsTUFBQSxHQUFHLEVBQUUsUUFEUDtBQUVFLE1BQUEsS0FBSyxFQUFFLFFBRlQ7QUFHRSxlQUFPLGFBSFQ7QUFJRSxNQUFBLFNBQVMsRUFBRSxtQkFBQSxLQUFLLEVBQUk7QUFDbEIsWUFBSSxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ2IsNEJBQVcsS0FBWDtBQUNEOztBQUNELHlCQUFVLEtBQVY7QUFDRDtBQVRILEtBcEJxQixDQUF2QjtBQWdDRDtBQWxEeUMsQ0FBM0IsQ0FBaEI7O0FBcURELElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQyxTQUFKLENBQWMsY0FBZCxFQUE4QjtBQUMvQyxFQUFBLFFBQVEscVZBRHVDO0FBVy9DLEVBQUEsS0FBSyxFQUFFLENBQUMsU0FBRCxFQUFZLE9BQVosQ0FYd0M7QUFZL0MsRUFBQSxJQUFJLEVBQUUsZ0JBQVc7QUFDZixXQUFPO0FBQ0wsTUFBQSxrQkFBa0IsRUFBRTtBQURmLEtBQVA7QUFHRCxHQWhCOEM7QUFpQi9DLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFNBQUssa0JBQUwsR0FBMEIsQ0FDeEI7QUFDQTtBQUFFLE1BQUEsR0FBRyxFQUFFLFVBQVA7QUFBbUIsTUFBQSxRQUFRLEVBQUU7QUFBN0IsS0FGd0IsRUFHeEI7QUFDRSxNQUFBLEdBQUcsRUFBRSxlQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsd0JBRlQ7QUFHRSxlQUFPLGFBSFQ7QUFJRSxNQUFBLFFBQVEsRUFBRTtBQUpaLEtBSHdCLEVBU3hCO0FBQUUsTUFBQSxHQUFHLEVBQUUsUUFBUDtBQUFpQixNQUFBLEtBQUssRUFBRSxRQUF4QjtBQUFrQyxlQUFPO0FBQXpDLEtBVHdCLEVBVXhCO0FBQ0UsTUFBQSxHQUFHLEVBQUUsU0FEUDtBQUVFLE1BQUEsS0FBSyxFQUFFLFVBRlQ7QUFHRSxNQUFBLFFBQVEsRUFBRSxLQUhaO0FBSUUsZUFBTyxhQUpUO0FBS0UsTUFBQSxTQUFTLEVBQUUsbUJBQUMsS0FBRCxFQUFRLEdBQVIsRUFBYSxJQUFiLEVBQXNCO0FBQy9CLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFMLEdBQWEsSUFBSSxDQUFDLE1BQTdCO0FBQ0EseUJBQVUsSUFBSSxDQUFDLE1BQWYsZ0JBQTJCLElBQTNCO0FBQ0Q7QUFSSCxLQVZ3QixFQW9CeEI7QUFDRSxNQUFBLEdBQUcsRUFBRSxRQURQO0FBRUUsTUFBQSxLQUFLLEVBQUUsUUFGVDtBQUdFLGVBQU8sYUFIVDtBQUlFLE1BQUEsU0FBUyxFQUFFLG1CQUFBLEtBQUssRUFBSTtBQUNsQixZQUFJLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDYiw0QkFBVyxLQUFYO0FBQ0Q7O0FBQ0QseUJBQVUsS0FBVjtBQUNEO0FBVEgsS0FwQndCLENBQTFCO0FBZ0NEO0FBbEQ4QyxDQUE5QixDQUFuQjs7QUFxREEsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxVQUFkLEVBQTBCO0FBQ3ZDLEVBQUEsUUFBUSwyT0FEK0I7QUFRdkMsRUFBQSxLQUFLLEVBQUUsQ0FBQyxTQUFELEVBQVksWUFBWixDQVJnQztBQVN2QyxFQUFBLElBQUksRUFBRSxnQkFBVztBQUNmLFdBQU87QUFDTCxNQUFBLGVBQWUsRUFBRTtBQURaLEtBQVA7QUFHRCxHQWJzQztBQWN2QyxFQUFBLFdBQVcsRUFBRSx1QkFBVztBQUN0QixTQUFLLGVBQUwsR0FBdUIsQ0FDckIsT0FEcUIsRUFFckI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsTUFBQSxLQUFLLEVBQUUsUUFBdEI7QUFBZ0MsTUFBQSxRQUFRLEVBQUU7QUFBMUMsS0FGcUIsRUFHckI7QUFBRSxNQUFBLEdBQUcsRUFBRSxPQUFQO0FBQWdCLE1BQUEsS0FBSyxFQUFFLGVBQXZCO0FBQXdDLE1BQUEsUUFBUSxFQUFFO0FBQWxELEtBSHFCLEVBSXJCO0FBQUUsTUFBQSxHQUFHLEVBQUUsWUFBUDtBQUFxQixNQUFBLEtBQUssRUFBRSxjQUE1QjtBQUE0QyxNQUFBLFFBQVEsRUFBRTtBQUF0RCxLQUpxQixFQUtyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLFFBQVA7QUFBaUIsTUFBQSxLQUFLLEVBQUUsUUFBeEI7QUFBa0MsTUFBQSxRQUFRLEVBQUU7QUFBNUMsS0FMcUIsRUFNckI7QUFBRSxNQUFBLEdBQUcsRUFBRSxNQUFQO0FBQWUsTUFBQSxLQUFLLEVBQUUsT0FBdEI7QUFBK0IsTUFBQSxRQUFRLEVBQUU7QUFBekMsS0FOcUIsQ0FBdkI7QUFRRCxHQXZCc0M7QUF3QnZDLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxRQUFRLEVBQUUsb0JBQVc7QUFDbkIsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFLLFVBQWIsQ0FBWDs7QUFDQSxhQUFPLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUixFQUNKLEdBREksQ0FDQSxVQUFTLENBQVQsRUFBWTtBQUNmLGVBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxDQUFSLEVBQ0osR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsaUJBQU8sQ0FBUDtBQUNELFNBSEksRUFJSixNQUpJLENBSUcsVUFBUyxDQUFULEVBQVk7QUFDbEIsaUJBQU8sQ0FBQyxDQUFDLFFBQUQsQ0FBRCxLQUFnQixLQUF2QjtBQUNELFNBTkksRUFPSixLQVBJLENBT0UsVUFBUyxDQUFULEVBQVk7QUFDakIsaUJBQU8sQ0FBQyxDQUFDLElBQVQ7QUFDRCxTQVRJLEVBVUosS0FWSSxFQUFQO0FBV0QsT0FiSSxFQWNKLE1BZEksQ0FjRyxNQWRILEVBZUosS0FmSSxFQUFQO0FBZ0JEO0FBbkJNO0FBeEI4QixDQUExQixDQUFmOztBQStDQyxJQUFJLFFBQVEsR0FBSyxHQUFHLENBQUMsU0FBSixDQUFjLFVBQWQsRUFBeUI7QUFDekMsRUFBQSxRQUFRLCtPQURpQztBQVF6QyxFQUFBLEtBQUssRUFBRSxDQUFDLFNBQUQsRUFBWSxZQUFaLENBUmtDO0FBU3pDLEVBQUEsSUFBSSxFQUFFLGdCQUFXO0FBQ2YsV0FBTztBQUNMLE1BQUEsZUFBZSxFQUFFO0FBRFosS0FBUDtBQUdELEdBYndDO0FBY3pDLEVBQUEsV0FBVyxFQUFFLHVCQUFXO0FBQ3RCLFNBQUssZUFBTCxHQUF1QixDQUNyQixPQURxQixFQUVyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE1BQVA7QUFBZSxNQUFBLEtBQUssRUFBRSxRQUF0QjtBQUFnQyxNQUFBLFFBQVEsRUFBRTtBQUExQyxLQUZxQixFQUdyQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE9BQVA7QUFBZ0IsTUFBQSxLQUFLLEVBQUUsZUFBdkI7QUFBd0MsTUFBQSxRQUFRLEVBQUU7QUFBbEQsS0FIcUIsRUFJckI7QUFBRSxNQUFBLEdBQUcsRUFBRSxZQUFQO0FBQXFCLE1BQUEsS0FBSyxFQUFFLGNBQTVCO0FBQTRDLE1BQUEsUUFBUSxFQUFFO0FBQXRELEtBSnFCLEVBS3JCO0FBQUUsTUFBQSxHQUFHLEVBQUUsUUFBUDtBQUFpQixNQUFBLEtBQUssRUFBRSxRQUF4QjtBQUFrQyxNQUFBLFFBQVEsRUFBRTtBQUE1QyxLQUxxQixFQU1yQjtBQUFFLE1BQUEsR0FBRyxFQUFFLE1BQVA7QUFBZSxNQUFBLEtBQUssRUFBRSxPQUF0QjtBQUErQixNQUFBLFFBQVEsRUFBRTtBQUF6QyxLQU5xQixDQUF2QjtBQVFELEdBdkJ3QztBQXdCekMsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLFFBQVEsRUFBRSxvQkFBVztBQUNuQixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBYixDQUFYOztBQUNBLGFBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQ0osR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsZUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsRUFDSixHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFQO0FBQ0QsU0FISSxFQUlKLE1BSkksQ0FJRyxVQUFTLENBQVQsRUFBWTtBQUNsQixpQkFBTyxDQUFDLENBQUMsUUFBRCxDQUFELEtBQWdCLEtBQXZCO0FBQ0QsU0FOSSxFQU9KLEdBUEksQ0FPQSxVQUFTLENBQVQsRUFBWTtBQUNmLGlCQUFPLENBQUMsQ0FBQyxJQUFUO0FBQ0QsU0FUSSxFQVVKLEtBVkksRUFBUDtBQVdELE9BYkksRUFjSixNQWRJLENBY0csTUFkSCxFQWVKLEtBZkksR0FnQkosT0FoQkksRUFBUDtBQWlCRDtBQXBCTTtBQXhCZ0MsQ0FBekIsQ0FBakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Y0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQXRCO0FBQ0EsSUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTJCO0FBQzdDLEVBQUEsUUFBUSxzMkpBRHFDO0FBNEU3QyxFQUFBLElBQUksRUFBRSxnQkFBWTtBQUNoQixXQUFPO0FBQ0wsTUFBQSxLQUFLLEVBQUUsRUFERjtBQUVMLE1BQUEsUUFBUSxFQUFHLEVBRk47QUFHTCxNQUFBLEtBQUssRUFBRSxFQUhGO0FBSUwsTUFBQSxxQkFBcUIsRUFBRSxFQUpsQjtBQUtMLE1BQUEsV0FBVyxFQUFFO0FBTFIsS0FBUDtBQU9ELEdBcEY0QztBQXFGN0MsRUFBQSxPQUFPLEVBQUUsbUJBQVc7QUFDbEIsU0FBSyxPQUFMLENBQWEsTUFBYjtBQUNELEdBdkY0QztBQXdGN0MsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLE9BQU8sRUFBRSxpQkFBVSxDQUFWLEVBQWE7QUFDcEIsV0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsVUFBSSxHQUFKO0FBQUEsVUFBUSxDQUFSO0FBQUEsVUFBVSxDQUFDLEdBQUcsRUFBZDs7QUFDQSxVQUFJLENBQUMsSUFBSSxRQUFULEVBQW1CO0FBQ2pCLFFBQUEsR0FBRyxHQUFHLEtBQUssUUFBTCxDQUFjLFdBQWQsQ0FBTjtBQUNBLFFBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxFQUFZLENBQVosRUFBZSxHQUFmLENBQW1CLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLGlCQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxFQUFVLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsV0FBbEIsQ0FBVixDQUFQO0FBQ0QsU0FGRyxDQUFKO0FBR0EsYUFBSyxLQUFMLEdBQWEsd0JBQWI7QUFDRDs7QUFDRCxVQUFJLENBQUMsSUFBSSxXQUFULEVBQXNCO0FBQ3BCLFFBQUEsR0FBRyxHQUFHLEtBQUssUUFBTCxDQUFjLGVBQWQsQ0FBTjtBQUNBLFFBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFGLENBQVksR0FBWixFQUFpQixDQUFqQixFQUFvQixPQUFwQixHQUE4QixHQUE5QixDQUFrQyxVQUFVLENBQVYsRUFBYTtBQUNqRCxpQkFBTyxDQUFDLENBQUMsSUFBRixDQUFPLENBQVAsRUFBVSxDQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLGVBQWxCLENBQVYsQ0FBUDtBQUNELFNBRkcsQ0FBSjtBQUdBLGFBQUssS0FBTCxHQUFXLGdDQUFYO0FBQ0Q7O0FBQ0QsVUFBSSxDQUFDLElBQUksU0FBVCxFQUFvQjtBQUNsQixRQUFBLEdBQUcsR0FBRyxLQUFLLFlBQUwsRUFBTjtBQUNBLFFBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBUCxFQUFZLENBQVosRUFBZSxHQUFmLENBQW1CLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLGlCQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxFQUFVLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsT0FBbEIsRUFBMEIsT0FBMUIsRUFBa0MsTUFBbEMsQ0FBVixDQUFQO0FBQ0QsU0FGRyxDQUFKO0FBR0EsYUFBSyxLQUFMLEdBQVcsa0JBQVg7QUFDRDs7QUFDRCxVQUFJLENBQUMsSUFBSSxNQUFULEVBQWlCO0FBQ2YsUUFBQSxHQUFHLEdBQUcsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUFOO0FBQ0EsUUFBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxHQUFULEVBQWEsQ0FBQyxRQUFELEVBQVUsUUFBVixDQUFiLEVBQWtDLE9BQWxDLEVBQUo7QUFDQSxRQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBRixDQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsR0FBYixDQUFpQixVQUFVLENBQVYsRUFBYTtBQUNoQyxpQkFBTyxDQUFDLENBQUMsSUFBRixDQUFPLENBQVAsRUFBVSxDQUFDLFFBQUQsRUFBVyxLQUFYLEVBQWtCLFFBQWxCLEVBQTJCLFFBQTNCLEVBQW9DLFVBQXBDLENBQVYsQ0FBUDtBQUNELFNBRkcsQ0FBSjtBQUdBLGFBQUssS0FBTCxHQUFXLE9BQVg7QUFDRDs7QUFDRCxVQUFJLENBQUMsSUFBSSxRQUFULEVBQW1CO0FBQ2pCLGFBQUssZ0JBQUw7QUFDQSxRQUFBLEdBQUcsR0FBRyxLQUFLLHFCQUFYO0FBRUEsUUFBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxHQUFULEVBQWMsQ0FBQyxlQUFELEVBQWlCLFlBQWpCLENBQWQsRUFBOEMsT0FBOUMsRUFBSjtBQUVBLFFBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxHQUFiLENBQWlCLFVBQVUsQ0FBVixFQUFhO0FBQ2hDLGlCQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sQ0FBUCxFQUFVLENBQUMsUUFBRCxFQUFXLEtBQVgsRUFBa0IsWUFBbEIsRUFBZ0MsZUFBaEMsRUFBaUQsWUFBakQsQ0FBVixDQUFQO0FBQ0QsU0FGRyxDQUFKO0FBR0EsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDhDQUFaO0FBQ0EsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7QUFFQSxhQUFLLEtBQUwsR0FBVywyQkFBWDtBQUNEOztBQUVELFdBQUssS0FBTCxHQUFhLENBQWIsQ0EvQ29CLENBZ0RwQjtBQUVELEtBbkRNO0FBb0RQLElBQUEsUUFBUSxFQUFFLGtCQUFVLEdBQVYsRUFBZTtBQUN2QixhQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBSyxVQUFkLEVBQTBCLEdBQTFCLEVBQStCLE9BQS9CLEVBQVA7QUFDRCxLQXRETTtBQXVEUCxJQUFBLFlBQVksRUFBRSx3QkFBVztBQUN2QixVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQUssVUFBYixDQUFYOztBQUNBLGFBQU8sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLEVBQ0osR0FESSxDQUNBLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsZUFBTyxDQUFDLENBQUMsS0FBRixDQUFRLENBQVIsRUFDSixHQURJLENBQ0EsVUFBUyxDQUFULEVBQVk7QUFDZixpQkFBTyxDQUFQO0FBQ0QsU0FISSxFQUlKLE1BSkksQ0FJRyxVQUFTLENBQVQsRUFBWTtBQUNsQixpQkFBTyxDQUFDLENBQUMsUUFBRCxDQUFELEtBQWdCLEtBQXZCO0FBQ0QsU0FOSSxFQU9KLEtBUEksQ0FPRSxVQUFTLENBQVQsRUFBWTtBQUNqQixpQkFBTyxDQUFDLENBQUMsS0FBVDtBQUNELFNBVEksRUFVSixLQVZJLEVBQVA7QUFXRCxPQWJJLEVBY0osTUFkSSxDQWNHLE9BZEgsRUFlSixLQWZJLEdBZ0JKLE9BaEJJLEVBQVA7QUFpQkQsS0ExRU07QUEyRVAsSUFBQSxnQkFBZ0IsRUFBRSw0QkFBWTtBQUM1QixVQUFJLFVBQVUsR0FBRyxLQUFLLFVBQXRCOztBQUNBLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsVUFBUixFQUFvQixJQUFwQixHQUEyQixNQUEzQixDQUFrQyxLQUFsQyxFQUF5QyxLQUF6QyxFQUFYOztBQUNBLFVBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBSyxZQUFiLENBQVo7O0FBQ0EsV0FBSyxxQkFBTCxHQUE2QixDQUFDLENBQUMsR0FBRixDQUFNLEtBQU4sRUFBYSxVQUFVLENBQVYsRUFBYTtBQUNyRCxZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBVjs7QUFDQSxZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsRUFBZSxVQUFVLENBQVYsRUFBYTtBQUNsQyxpQkFBTyxDQUFDLENBQUMsR0FBRixJQUFTLENBQWhCO0FBQ0QsU0FGTyxDQUFSOztBQUdBLFFBQUEsQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssS0FBZjtBQUNBLFFBQUEsQ0FBQyxDQUFDLFFBQUYsR0FBYSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssUUFBbEI7QUFDQSxRQUFBLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBQyxDQUFDLElBQWI7QUFDQSxRQUFBLENBQUMsQ0FBQyxhQUFGLEdBQWtCLFFBQVEsQ0FBQyxDQUFDLENBQUMsYUFBSCxDQUExQjtBQUNBLGVBQU8sQ0FBUDtBQUNELE9BVjRCLENBQTdCO0FBV0Q7QUExRk0sR0F4Rm9DO0FBb0w3QyxFQUFBLFFBQVEsb0JBQ0gsVUFBVSxDQUFDO0FBQ1osSUFBQSxPQUFPLEVBQUUsU0FERztBQUVaLElBQUEsWUFBWSxFQUFFLGNBRkY7QUFHWixJQUFBLFVBQVUsRUFBRSxtQkFIQTtBQUlaLElBQUEsVUFBVSxFQUFFLFlBSkE7QUFLWixJQUFBLFlBQVksRUFBRSxjQUxGO0FBTVosSUFBQSxPQUFPLEVBQUU7QUFORyxHQUFELENBRFA7QUFwTHFDLENBQTNCLENBQXBCO2VBK0xlLGE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUxmOzs7O0FBQ0EsSUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBVCxDQUFlO0FBQzNCLEVBQUEsTUFBTSxFQUFFLElBRG1CO0FBRTNCLEVBQUEsS0FBSyxFQUFFO0FBQ0wsSUFBQSxNQUFNLEVBQUUsRUFESDtBQUVMLElBQUEsZ0JBQWdCLEVBQUUsRUFGYjtBQUdMLElBQUEsYUFBYSxFQUFFLEVBSFY7QUFJTCxJQUFBLE1BQU0sRUFBRSxFQUpIO0FBS0wsSUFBQSxnQkFBZ0IsRUFBRSxFQUxiO0FBTUwsSUFBQSxXQUFXLEVBQUUsRUFOUjtBQU9MLElBQUEsT0FBTyxFQUFFLEVBUEo7QUFRTCxJQUFBLFdBQVcsRUFBRSxFQVJSO0FBU0wsSUFBQSxhQUFhLEVBQUUsSUFUVjtBQVVMLElBQUEsS0FBSyxFQUFFLEVBVkY7QUFXTCxJQUFBLE9BQU8sRUFBRSxJQVhKO0FBWUwsSUFBQSxhQUFhLEVBQUUsS0FaVjtBQWFMLElBQUEsYUFBYSxFQUFFLEtBYlY7QUFjTCxJQUFBLFdBQVcsRUFBRSxZQUFZLENBQUMsT0FBYixDQUFxQixTQUFyQixLQUFtQyxFQWQzQztBQWVMLElBQUEsU0FBUyxFQUFFLFlBQVksQ0FBQyxPQUFiLENBQXFCLFFBQXJCLEtBQWtDLEVBZnhDO0FBZ0JMLElBQUEsT0FBTyxFQUFFLEtBaEJKO0FBaUJMLElBQUEsV0FBVyxFQUFFLElBakJSO0FBa0JMLElBQUEsT0FBTyxFQUFFLElBbEJKO0FBbUJMLElBQUEsT0FBTyxFQUFFLElBbkJKO0FBb0JMLElBQUEsUUFBUSxFQUFFLEVBcEJMO0FBcUJMLElBQUEsVUFBVSxFQUFFLEVBckJQO0FBc0JMLElBQUEsV0FBVyxFQUFFLEVBdEJSO0FBdUJMLElBQUEsYUFBYSxFQUFFLEVBdkJWO0FBd0JMLElBQUEsUUFBUSxFQUFFLEVBeEJMO0FBeUJMLElBQUEsWUFBWSxFQUFFLElBekJUO0FBMEJMLElBQUEsaUJBQWlCLEVBQUUsRUExQmQ7QUEyQkwsSUFBQSxZQUFZLEVBQUUsRUEzQlQ7QUE0QkwsSUFBQSxTQUFTLEVBQUUsS0E1Qk47QUE2QkwsSUFBQSxtQkFBbUIsRUFBRSxFQTdCaEI7QUE4QkwsSUFBQSxVQUFVLEVBQUUsRUE5QlA7QUErQkwsSUFBQSxNQUFNLEVBQUUsSUEvQkg7QUFnQ0wsSUFBQSxXQUFXLEVBQUUsRUFoQ1I7QUFpQ0wsSUFBQSxvQkFBb0IsRUFBQyxFQWpDaEI7QUFrQ0wsSUFBQSxZQUFZLEVBQUU7QUFsQ1QsR0FGb0I7QUFzQzNCLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxZQUFZLEVBQUUsc0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFlBQVY7QUFBQSxLQURaO0FBRVAsSUFBQSxVQUFVLEVBQUUsb0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLG1CQUFWO0FBQUEsS0FGVjtBQUdQLElBQUEsVUFBVSxFQUFFLG9CQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxVQUFWO0FBQUEsS0FIVjtBQUlQLElBQUEsTUFBTSxFQUFFLGdCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxNQUFWO0FBQUEsS0FKTjtBQUtQLElBQUEsV0FBVyxFQUFFLHFCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxXQUFWO0FBQUEsS0FMWDtBQU1QLElBQUEsb0JBQW9CLEVBQUUsOEJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLG9CQUFWO0FBQUEsS0FOcEI7QUFPUCxJQUFBLFNBQVMsRUFBRSxtQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsU0FBVjtBQUFBLEtBUFQ7QUFRUCxJQUFBLE1BQU0sRUFBRSxnQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsTUFBVjtBQUFBLEtBUk47QUFTUCxJQUFBLGFBQWEsRUFBRSx1QkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsYUFBVjtBQUFBLEtBVGI7QUFVUCxJQUFBLE1BQU0sRUFBRSxnQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsTUFBVjtBQUFBLEtBVk47QUFXUCxJQUFBLGdCQUFnQixFQUFFLDBCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxnQkFBVjtBQUFBLEtBWGhCO0FBWVAsSUFBQSxVQUFVLEVBQUUsb0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFdBQVY7QUFBQSxLQVpWO0FBYVAsSUFBQSxPQUFPLEVBQUUsaUJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLE9BQVY7QUFBQSxLQWJQO0FBY1AsSUFBQSxZQUFZLEVBQUUsc0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLGFBQVY7QUFBQSxLQWRaO0FBZVAsSUFBQSxVQUFVLEVBQUUsb0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFdBQVY7QUFBQSxLQWZWO0FBZ0JQLElBQUEsWUFBWSxFQUFFLHNCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxZQUFWO0FBQUEsS0FoQlo7QUFpQlAsSUFBQSxLQUFLLEVBQUUsZUFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsS0FBVjtBQUFBLEtBakJMO0FBa0JQLElBQUEsT0FBTyxFQUFFLGlCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxPQUFWO0FBQUEsS0FsQlA7QUFtQlAsSUFBQSxZQUFZLEVBQUUsc0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFdBQVY7QUFBQSxLQW5CWjtBQW9CUCxJQUFBLElBQUksRUFBRSxjQUFBLEtBQUs7QUFBQSxhQUFJLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLFNBQWpCLENBQUo7QUFBQSxLQXBCSjtBQXFCUCxJQUFBLGFBQWEsRUFBRSx1QkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsYUFBVjtBQUFBLEtBckJiO0FBc0JQLElBQUEsYUFBYSxFQUFFLHVCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxhQUFWO0FBQUEsS0F0QmI7QUF1QlAsSUFBQSxRQUFRLEVBQUUsa0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFdBQVY7QUFBQSxLQXZCUjtBQXdCUCxJQUFBLE9BQU8sRUFBRSxpQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsT0FBVjtBQUFBLEtBeEJQO0FBeUJQLElBQUEsT0FBTyxFQUFFLGlCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxPQUFWO0FBQUEsS0F6QlA7QUEwQlAsSUFBQSxRQUFRLEVBQUUsa0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFFBQVY7QUFBQSxLQTFCUjtBQTJCUCxJQUFBLGdCQUFnQixFQUFFLDBCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxnQkFBVjtBQUFBLEtBM0JoQjtBQTRCUCxJQUFBLFlBQVksRUFBRSxzQkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsWUFBVjtBQUFBLEtBNUJaO0FBNkJQLElBQUEsaUJBQWlCLEVBQUUsMkJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLGlCQUFWO0FBQUEsS0E3QmpCO0FBOEJQLElBQUEsVUFBVSxFQUFFLG9CQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxVQUFWO0FBQUEsS0E5QlY7QUErQlAsSUFBQSxXQUFXLEVBQUUscUJBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFdBQVY7QUFBQSxLQS9CWDtBQWdDUCxJQUFBLGFBQWEsRUFBRSx1QkFBQSxLQUFLO0FBQUEsYUFBSSxLQUFLLENBQUMsYUFBVjtBQUFBLEtBaENiO0FBaUNQLElBQUEsZUFBZSxFQUFFLHlCQUFBLEtBQUs7QUFBQSxhQUFJLEtBQUssQ0FBQyxPQUFWO0FBQUEsS0FqQ2Y7QUFrQ1AsSUFBQSxRQUFRLEVBQUUsa0JBQUEsS0FBSztBQUFBLGFBQUksS0FBSyxDQUFDLFFBQVY7QUFBQTtBQWxDUixHQXRDa0I7QUEwRTNCLEVBQUEsU0FBUyxFQUFFO0FBQ1QsSUFBQSxhQUFhLEVBQUUsdUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDakMsTUFBQSxLQUFLLENBQUMsU0FBTixHQUFrQixPQUFsQjtBQUNELEtBSFE7QUFJVCxJQUFBLGtCQUFrQixFQUFFLDRCQUFDLEtBQUQsRUFBUSxXQUFSLEVBQXdCO0FBQzFDLFVBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUF0Qjs7QUFDQSxVQUFJLEdBQUcsR0FBRyxDQUFWLEVBQWE7QUFDWCxRQUFBLEtBQUssQ0FBQyxpQkFBTixHQUEwQixDQUFDLENBQUMsSUFBRixDQUFPLFdBQVAsQ0FBMUI7QUFDRDtBQUNGLEtBVFE7QUFVVCxJQUFBLFdBQVcsRUFBRSxxQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUMvQixNQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsT0FBZjtBQUNELEtBWlE7QUFhVCxJQUFBLGVBQWUsRUFBRSx5QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNuQyxNQUFBLEtBQUssQ0FBQyxNQUFOLEdBQWUsT0FBZjtBQUNELEtBZlE7QUFnQlQsSUFBQSxvQkFBb0IsRUFBRSw4QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUN4QyxNQUFBLEtBQUssQ0FBQyxhQUFOLEdBQXNCLE9BQXRCO0FBQ0QsS0FsQlE7QUFtQlQsSUFBQSwyQkFBMkIsRUFBRSxxQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUMvQyxNQUFBLEtBQUssQ0FBQyxnQkFBTixHQUF5QixPQUF6QjtBQUNELEtBckJRO0FBc0JULElBQUEsZ0JBQWdCLEVBQUUsMEJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDcEMsTUFBQSxLQUFLLENBQUMsT0FBTixHQUFnQixPQUFPLENBQUMsaUJBQUQsQ0FBdkI7QUFDQSxNQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLE9BQU8sQ0FBQyxZQUFELENBQXZCO0FBQ0QsS0F6QlE7QUEwQlQsSUFBQSxXQUFXLEVBQUUscUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDL0IsVUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCLEdBQXRCLEVBQTJCO0FBQzdDO0FBQ0EsUUFBQSxHQUFHLENBQUMsS0FBRCxDQUFILENBQVcsUUFBWCxJQUF1QixLQUFLLEdBQUcsQ0FBL0I7QUFDQSxlQUFPLEdBQVA7QUFDRCxPQUpPLENBQVI7QUFLQSxNQUFBLEtBQUssQ0FBQyxhQUFOLEdBQXNCLE9BQU8sQ0FBQyxNQUE5QjtBQUNBLE1BQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsQ0FBaEI7QUFDRCxLQWxDUTtBQW1DVCxJQUFBLGVBQWUsRUFBRSx5QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNuQyxNQUFBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLE9BQXBCO0FBQ0QsS0FyQ1E7QUFzQ1QsSUFBQSx3QkFBd0IsRUFBRSxrQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUM1QyxNQUFBLEtBQUssQ0FBQyxvQkFBTixDQUEyQixJQUEzQixDQUFnQyxPQUFoQztBQUNELEtBeENRO0FBeUNULElBQUEsZ0JBQWdCLEVBQUUsMEJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDcEMsTUFBQSxLQUFLLENBQUMsWUFBTixHQUFxQixPQUFyQjtBQUNELEtBM0NRO0FBNENULElBQUEsVUFBVSxFQUFFLG9CQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQzlCLFVBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFkOztBQUNBLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQU0sT0FBTixFQUFlLFVBQVUsQ0FBVixFQUFhO0FBQ2xDLGVBQU8sQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFOLEVBQVMsVUFBVSxDQUFWLEVBQWE7QUFDM0IsY0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUYsR0FBUSxDQUFoQjtBQUNBLFVBQUEsQ0FBQyxDQUFDLEtBQUYsR0FBVSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssS0FBZjtBQUNBLFVBQUEsQ0FBQyxDQUFDLEVBQUYsR0FBTyxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssRUFBWjtBQUNBLFVBQUEsQ0FBQyxDQUFDLE9BQUYsR0FBWSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssT0FBakI7QUFDQSxVQUFBLENBQUMsQ0FBQyxPQUFGLEdBQVksQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLLE9BQWpCO0FBQ0EsVUFBQSxDQUFDLENBQUMsWUFBRixHQUFpQixDQUFDLENBQUMsQ0FBRCxDQUFELENBQUssWUFBdEI7QUFDQSxVQUFBLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLLE1BQWhCO0FBQ0EsVUFBQSxDQUFDLENBQUMsT0FBRixHQUFZLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxPQUFqQjtBQUNBLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFGLEdBQVksQ0FBcEI7QUFDQSxVQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBQyxDQUFDLENBQUQsQ0FBRCxDQUFLLEtBQW5CO0FBQ0EsVUFBQSxDQUFDLENBQUMsTUFBRixHQUFXLENBQUMsQ0FBQyxDQUFELENBQUQsQ0FBSyxFQUFoQjtBQUNBLGlCQUFPLENBQVA7QUFDRCxTQWJNLENBQVA7QUFjRCxPQWZPLENBQVIsQ0FGOEIsQ0FrQjlCOzs7QUFDQSxNQUFBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLENBQXBCO0FBQ0QsS0FoRVE7QUFpRVQsSUFBQSxXQUFXLEVBQUUscUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDL0IsTUFBQSxLQUFLLENBQUMsT0FBTixHQUFnQixPQUFoQjtBQUNELEtBbkVRO0FBb0VULElBQUEsY0FBYyxFQUFFLHdCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2xDLE1BQUEsS0FBSyxDQUFDLFdBQU4sR0FBb0IsT0FBcEI7QUFDRCxLQXRFUTtBQXVFVCxJQUFBLFlBQVksRUFBRSxzQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNoQyxNQUFBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLE9BQXBCO0FBQ0QsS0F6RVE7QUEwRVQsSUFBQSxTQUFTLEVBQUUsbUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDN0IsTUFBQSxLQUFLLENBQUMsS0FBTixHQUFjLE9BQWQ7QUFDRCxLQTVFUTtBQTZFVCxJQUFBLFdBQVcsRUFBRSxxQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUMvQixNQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLE9BQWhCO0FBQ0QsS0EvRVE7QUFnRlQsSUFBQSxhQUFhLEVBQUUsdUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDakMsTUFBQSxLQUFLLENBQUMsU0FBTixHQUFrQixPQUFsQjtBQUNELEtBbEZRO0FBbUZULElBQUEsaUJBQWlCLEVBQUUsMkJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDckMsTUFBQSxLQUFLLENBQUMsYUFBTixHQUFzQixPQUF0QjtBQUNELEtBckZRO0FBc0ZULElBQUEsaUJBQWlCLEVBQUUsMkJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDckMsTUFBQSxLQUFLLENBQUMsYUFBTixHQUFzQixPQUF0QjtBQUNELEtBeEZRO0FBeUZULElBQUEsZ0JBQWdCLEVBQUUsMEJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDcEMsTUFBQSxLQUFLLENBQUMsWUFBTixHQUFxQixPQUFyQjtBQUNELEtBM0ZRO0FBNEZULElBQUEsb0JBQW9CLEVBQUUsOEJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDeEMsTUFBQSxLQUFLLENBQUMsZ0JBQU4sR0FBeUIsT0FBekI7QUFDRCxLQTlGUTtBQStGVCxJQUFBLFlBQVksRUFBRSxzQkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNoQztBQUNBLE1BQUEsS0FBSyxDQUFDLFFBQU4sR0FBaUIsT0FBakI7QUFDRCxLQWxHUTtBQW1HVCxJQUFBLGlCQUFpQixFQUFFLDJCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ3JDLE1BQUEsS0FBSyxDQUFDLGFBQU4sR0FBc0IsT0FBdEI7QUFDRCxLQXJHUTtBQXNHVCxJQUFBLGNBQWMsRUFBRSx3QkFBQyxLQUFELEVBQVEsT0FBUixFQUFvQjtBQUNsQyxNQUFBLEtBQUssQ0FBQyxVQUFOLEdBQW1CLE9BQW5CO0FBQ0QsS0F4R1E7QUF5R1QsSUFBQSxlQUFlLEVBQUUseUJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbkMsTUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixPQUFwQjtBQUNELEtBM0dRO0FBNEdULElBQUEsWUFBWSxFQUFFLHNCQUFDLEtBQUQsRUFBUSxPQUFSLEVBQW9CO0FBQ2hDLE1BQUEsS0FBSyxDQUFDLFFBQU4sR0FBaUIsT0FBakI7QUFDRCxLQTlHUTtBQStHVDtBQUNBLElBQUEsb0JBQW9CLEVBQUUsOEJBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDeEMsVUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsTUFBNUI7QUFDQSxVQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsV0FBTixDQUFrQixHQUFHLEdBQUcsQ0FBeEIsQ0FBaEI7O0FBQ0EsVUFBSSxNQUFNLEdBQUksS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUssQ0FBQyxPQUFmLEVBQXdCO0FBQUUsUUFBQSxFQUFFLEVBQUU7QUFBTixPQUF4QixDQUE3Qjs7QUFDQSxVQUFJLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRixDQUFNLE1BQU4sRUFBYyxZQUFkLElBQThCLEVBQXpDLENBSndDLENBSUs7O0FBQzdDLFVBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRixDQUFNLE1BQU4sRUFBYyxRQUFkLENBQUQsQ0FBekI7QUFDQSxNQUFBLEtBQUssQ0FBQyxtQkFBTixHQUE0QixDQUFDLENBQUMsSUFBRixDQUFPLFNBQVAsRUFBa0I7QUFBRSxRQUFBLEdBQUcsRUFBRTtBQUFQLE9BQWxCLENBQTVCOztBQUVBLFVBQUksS0FBSyxHQUFJLEtBQUssQ0FBQyxVQUFOLEdBQW1CLENBQUMsQ0FBQyxLQUFGLENBQVEsS0FBSyxDQUFDLFdBQWQsRUFDN0IsR0FENkIsQ0FDekIsVUFBVSxDQUFWLEVBQWE7QUFDaEIsZUFBTyxDQUFDLENBQUMsTUFBRixDQUFTLENBQVQsRUFBWTtBQUFFLFVBQUEsR0FBRyxFQUFFO0FBQVAsU0FBWixDQUFQO0FBQ0QsT0FINkIsRUFHM0IsS0FIMkIsRUFBaEM7O0FBS0EsVUFBSSxTQUFTLEdBQUksS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBbkIsR0FBK0IsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQzdDLEdBRDZDLENBQ3pDLFVBQVMsQ0FBVCxFQUFZO0FBQ2YsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLENBQU4sRUFBUyxPQUFULENBQWQsQ0FBYjs7QUFDQSxlQUFPLE1BQVA7QUFDRCxPQUo2QyxFQUkzQyxLQUoyQyxFQUFoRDs7QUFNQSxVQUFJLFlBQVksR0FBSSxLQUFLLENBQUMsWUFBTixDQUFtQixZQUFuQixHQUFrQyxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFDbkQsR0FEbUQsQ0FDL0MsVUFBVSxDQUFWLEVBQWE7QUFDaEIsWUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLENBQU4sRUFBUyxZQUFULENBQWQsQ0FBaEI7O0FBQ0EsZUFBTyxTQUFQO0FBQ0QsT0FKbUQsRUFLbkQsS0FMbUQsRUFBdEQ7O0FBT0EsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixRQUFuQixHQUE4QixDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFDM0IsR0FEMkIsQ0FDdkIsVUFBVSxDQUFWLEVBQWE7QUFDaEIsWUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxDQUFDLENBQUMsR0FBRixDQUFNLENBQU4sRUFBUyxVQUFULENBQWQsQ0FBUjs7QUFDQSxlQUFPLENBQVA7QUFDRCxPQUoyQixFQUszQixLQUwyQixFQUE5QjtBQU9BLFVBQUksUUFBUSxHQUFJLEtBQUssQ0FBQyxZQUFOLENBQW1CLFFBQW5CLEdBQThCLENBQUMsQ0FBQyxLQUFGLENBQVEsU0FBUixJQUFxQixFQUFuRTtBQUNBLFVBQUksUUFBUSxHQUFJLEtBQUssQ0FBQyxZQUFOLENBQW1CLFFBQW5CLEdBQThCLENBQUMsQ0FBQyxLQUFGLENBQVEsU0FBUixJQUFxQixFQUFuRTtBQUVBLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsV0FBbkIsR0FBaUMsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxZQUFSLElBQXdCLEVBQXpEO0FBQ0EsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixXQUFuQixHQUFpQyxDQUFDLENBQUMsS0FBRixDQUFRLFlBQVIsSUFBd0IsRUFBekQ7O0FBRUEsVUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FDbkIsQ0FBQyxDQUFDLE1BQUYsQ0FDRSxDQUFDLENBQUMsV0FBRixDQUFjLEtBQWQsQ0FERixFQUVFLFVBQVUsQ0FBVixFQUFhO0FBQ1gsZUFBTyxDQUFDLENBQUMsS0FBRixJQUFXLFFBQVEsQ0FBQyxRQUFELENBQTFCO0FBQ0QsT0FKSCxFQUtFLEtBTEYsQ0FEbUIsRUFRbkIsT0FSbUIsQ0FBckI7O0FBVUEsVUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FDbkIsQ0FBQyxDQUFDLE1BQUYsQ0FDRSxDQUFDLENBQUMsV0FBRixDQUFjLEtBQWQsQ0FERixFQUVFLFVBQVUsQ0FBVixFQUFhO0FBQ1gsZUFBTyxDQUFDLENBQUMsS0FBRixJQUFXLFFBQVEsQ0FBQyxRQUFELENBQTFCO0FBQ0QsT0FKSCxFQUtFLEtBTEYsQ0FEbUIsRUFRbkIsT0FSbUIsQ0FBckI7O0FBV0EsTUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixjQUFuQixHQUFvQyxjQUFjLENBQUMsSUFBZixFQUFwQztBQUNBLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsY0FBbkIsR0FBb0MsY0FBYyxDQUFDLElBQWYsRUFBcEM7O0FBRUEsVUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxLQUFOLEVBQWEsVUFBVSxDQUFWLEVBQWE7QUFDcEMsZUFBTyxDQUFDLENBQUMsR0FBRixDQUFNLENBQU4sRUFBUyxVQUFVLENBQVYsRUFBYTtBQUMzQixjQUFJLE1BQU0sR0FBRyxFQUFiOztBQUNBLGNBQUksQ0FBQyxDQUFDLE1BQUYsS0FBYSxLQUFqQixFQUF3QjtBQUN0QixZQUFBLE1BQU0sR0FBRyxLQUFUO0FBQ0QsV0FGRCxNQUVPLElBQUksQ0FBQyxDQUFDLE1BQUYsS0FBYSxVQUFqQixFQUE2QjtBQUNsQyxZQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0QsV0FGTSxNQUVBLElBQUksQ0FBQyxDQUFDLE1BQUYsS0FBYSxNQUFqQixFQUF5QjtBQUM5QixZQUFBLE1BQU0sR0FBRyxNQUFUO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsWUFBQSxNQUFNLEdBQUcsTUFBVDtBQUNEOztBQUNELGNBQUksUUFBUSxHQUFHLFVBQWY7O0FBQ0EsY0FBSSxDQUFDLENBQUMsS0FBRixJQUFXLEdBQWYsRUFBb0I7QUFDbEIsWUFBQSxRQUFRLEdBQUcsVUFBWDtBQUNEOztBQUNELGNBQUksTUFBTSxJQUFJLElBQWQsRUFBb0I7QUFDbEIsWUFBQSxDQUFDLENBQUMsTUFBRixHQUNFLGNBQ0EsQ0FBQyxDQUFDLEtBREYsR0FFQSxHQUZBLEdBR0EsSUFIQSxHQUlBLHdCQUpBLEdBS0EsUUFMQSxHQU1BLDRCQU5BLEdBT0EsQ0FBQyxDQUFDLElBUEYsR0FRQSxzQ0FURjtBQVVELFdBWEQsTUFXTztBQUNMLFlBQUEsQ0FBQyxDQUFDLE1BQUYsR0FDRSxjQUFjLENBQUMsQ0FBQyxLQUFoQixHQUF3QixHQUF4QixHQUNBLElBREEsR0FDTyx3QkFEUCxHQUNrQyxRQURsQyxHQUVBLHdCQUZBLEdBRTJCLENBQUMsQ0FBQyxJQUY3QixHQUdBLGdCQUhBLEdBR21CLE1BSG5CLEdBSUEsT0FKQSxHQUlVLENBQUMsQ0FBQyxLQUpaLEdBSW9CLEtBSnBCLEdBS0EsQ0FBQyxDQUFDLFVBTEYsR0FLZSx5QkFMZixHQU1BLENBQUMsQ0FBQyxJQU5GLEdBTVMsOEJBTlQsR0FPQSxJQVBBLEdBT08sMEJBUFAsR0FPb0MsQ0FBQyxDQUFDLFFBUHRDLEdBUUEseUJBUkEsR0FRNEIsQ0FBQyxDQUFDLE1BUjlCLEdBU0EsOENBVEEsR0FVQSxDQUFDLENBQUMsTUFWRixHQVVXLFVBWGI7QUFZRDs7QUFDRCxpQkFBTyxDQUFQO0FBQ0QsU0F6Q00sQ0FBUDtBQTBDRCxPQTNDVyxDQUFaOztBQTRDQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLEtBQW5CLEdBQTJCLENBQUMsQ0FBQyxXQUFGLENBQWMsS0FBZCxDQUEzQjs7QUFFQSxVQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRixDQUNaLENBQUMsQ0FBQyxNQUFGLENBQVMsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxLQUFkLENBQVQsRUFBK0IsVUFBVSxDQUFWLEVBQWE7QUFDMUMsZUFBTyxTQUFTLENBQUMsQ0FBQyxNQUFsQjtBQUNELE9BRkQsQ0FEWSxDQUFkOztBQU1BLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsU0FBbkIsR0FBK0IsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxPQUFULEVBQWtCLENBQUMsT0FBRCxFQUFVLEdBQVYsQ0FBbEIsRUFBa0MsTUFBakU7QUFDQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLFNBQW5CLEdBQStCLENBQUMsQ0FBQyxNQUFGLENBQVMsT0FBVCxFQUFrQixDQUFDLE9BQUQsRUFBVSxHQUFWLENBQWxCLEVBQWtDLE1BQWpFOztBQUNBLFVBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFGLENBQ1gsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFDLENBQUMsV0FBRixDQUFjLEtBQWQsQ0FBVCxFQUErQixVQUFVLENBQVYsRUFBYTtBQUMxQyxZQUFJLENBQUMsQ0FBQyxLQUFGLElBQVcsR0FBZixFQUFvQjtBQUNsQixpQkFBTyxDQUFQO0FBQ0Q7QUFDRixPQUpELENBRFcsQ0FBYjs7QUFRQSxNQUFBLEtBQUssQ0FBQyxZQUFOLENBQW1CLE1BQW5CLEdBQTRCLE1BQU0sQ0FBQyxNQUFuQztBQUNBLE1BQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsT0FBbkIsR0FBNkIsS0FBSyxDQUFDLFlBQU4sR0FBcUIsTUFBTSxDQUFDLE1BQXpEO0FBQ0Q7QUEvT1EsR0ExRWdCO0FBMlQzQixFQUFBLE9BQU8sRUFBRTtBQUNQLElBQUEsUUFBUSxFQUFFLGtCQUFDLE9BQUQsRUFBVSxPQUFWLEVBQXNCO0FBQzlCLE1BQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLE9BQWhDO0FBQ0QsS0FITTtBQUlELElBQUEsVUFKQyxzQkFJVSxPQUpWLEVBSW1CLE9BSm5CLEVBSTRCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQzdCLGdCQUFBLEdBRDZCLGFBQ3BCLGVBRG9CLHFCQUVqQzs7QUFDQSxnQkFBQSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYLENBQVY7QUFIaUM7QUFBQTtBQUFBLHVCQUtYLEtBQUssQ0FBQyxJQUFOLENBQVcsR0FBWCxFQUNwQjtBQUNFLGtCQUFBLEtBQUssRUFBRSxnQ0FEVDtBQUVFLGtCQUFBLE9BQU8sRUFBRSxnQ0FGWDtBQUdFLGtCQUFBLE1BQU0sRUFBRTtBQUhWLGlCQURvQixFQU1wQjtBQUNFLGtCQUFBLE9BQU8sRUFBRTtBQUNQLG9DQUFnQixrQkFEVDtBQUVQLG9CQUFBLGFBQWEsb0JBQWEsT0FBYjtBQUZOO0FBRFgsaUJBTm9CLENBTFc7O0FBQUE7QUFLNUIsZ0JBQUEsUUFMNEI7QUFpQjNCLGdCQUFBLEdBakIyQixHQWlCckIsUUFBUSxDQUFDLElBakJZLEVBa0IvQjs7QUFDQSxvQkFBSSxHQUFHLENBQUMsSUFBSixJQUFZLHNCQUFoQixFQUF3QztBQUN0QyxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG1CQUFmLEVBQW9DLElBQXBDO0FBQ0Q7O0FBckI4QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQXVCL0IsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxtQkFBZixFQUFvQyxLQUFwQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsV0FBZixFQUE0QixZQUFJLFFBQUosRUFBNUI7O0FBeEIrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTBCbEMsS0E5Qk07QUErQkQsSUFBQSxRQS9CQyxvQkErQlEsT0EvQlIsRUErQmlCLE9BL0JqQixFQStCMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDL0IsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxtQkFBZixFQUFvQyxJQUFwQztBQUNJLGdCQUFBLEdBRjJCLGFBRWxCLGVBRmtCO0FBQUE7QUFBQSx1QkFHVixLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsRUFBZ0I7QUFDbkMsa0JBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxJQURpQjtBQUVuQyxrQkFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDO0FBRmlCLGlCQUFoQixDQUhVOztBQUFBO0FBRzNCLGdCQUFBLFFBSDJCOztBQU8vQixvQkFBSTtBQUNFLGtCQUFBLElBREYsR0FDUyxRQUFRLENBQUMsSUFEbEI7O0FBRUYsc0JBQUksSUFBSSxDQUFDLEtBQVQsRUFBZ0I7QUFDZCxvQkFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixTQUFyQixFQUFnQyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxLQUFwQixDQUFoQztBQUNBLG9CQUFBLFlBQVksQ0FBQyxPQUFiLENBQXFCLFFBQXJCLEVBQStCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBSSxDQUFDLGlCQUFwQixDQUEvQjtBQUNBLG9CQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWjtBQUNBLG9CQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsS0FBcEM7QUFDQSxvQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG1CQUFmLEVBQW9DLElBQXBDO0FBQ0QsbUJBTkQsTUFNTztBQUNMLG9CQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsS0FBcEM7QUFDQSxvQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG1CQUFmLEVBQW9DLEtBQXBDO0FBQ0Q7QUFDRixpQkFaRCxDQWFBLE9BQU8sR0FBUCxFQUFZO0FBQ1Ysa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxtQkFBZixFQUFvQyxLQUFwQztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsS0FBcEM7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsR0FBRyxDQUFDLE9BQUosQ0FBWSxRQUFaLEVBQTVCO0FBQ0Q7O0FBeEI4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTBCaEMsS0F6RE07QUEwREQsSUFBQSxlQTFEQywyQkEwRGUsT0ExRGYsRUEwRHdCLE9BMUR4QixFQTBEaUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDbEMsZ0JBQUEsR0FEa0MsYUFDekIsa0JBRHlCO0FBQUE7QUFBQSx1QkFFakIsS0FBSyxDQUN2QixHQURrQixDQUNiLEdBRGEsRUFDUixDQUNUO0FBQ0E7QUFGUyxpQkFEUSxDQUZpQjs7QUFBQTtBQUVsQyxnQkFBQSxRQUZrQzs7QUFPdEMsb0JBQUk7QUFDRSxrQkFBQSxDQURGLEdBQ00sUUFBUSxDQUFDLElBRGY7QUFFRSxrQkFBQSxJQUZGLEdBRVMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxDQUFOLEVBQVMsVUFBVSxDQUFWLEVBQWE7QUFDL0Isb0JBQUEsQ0FBQyxDQUFDLE9BQUYsR0FBWSxDQUFDLENBQUMsT0FBRixDQUFVLFdBQVYsRUFBWjtBQUNBLG9CQUFBLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxXQUFULEVBQVg7QUFDRCwyQkFBTyxDQUFQO0FBQ0EsbUJBSlUsQ0FGVDtBQU9GLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsaUJBQWYsRUFBa0MsSUFBbEM7QUFDQSxpQkFSRixDQVFHLE9BQU8sQ0FBUCxFQUFVO0FBQ1gsa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLENBQUMsQ0FBQyxRQUFGLEVBQTVCO0FBQ0E7O0FBakJvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWtCdkMsS0E1RU07QUE2RUQsSUFBQSxtQkE3RUMsK0JBNkVtQixPQTdFbkIsRUE2RTRCLE9BN0U1QixFQTZFcUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDdEMsZ0JBQUEsR0FEc0MsYUFDN0IsZ0JBRDZCLFNBQ2xCLE9BRGtCO0FBQUE7QUFBQSx1QkFFckIsS0FBSyxDQUN2QixHQURrQixDQUNiLEdBRGEsRUFDUixDQUNUO0FBQ0E7QUFGUyxpQkFEUSxDQUZxQjs7QUFBQTtBQUV0QyxnQkFBQSxRQUZzQzs7QUFPMUMsb0JBQUk7QUFDRSxrQkFBQSxJQURGLEdBQ1MsUUFBUSxDQUFDLElBRGxCO0FBRUYsa0JBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLFdBQWIsRUFBZjtBQUNBLGtCQUFBLElBQUksQ0FBQyxNQUFMLEdBQWMsSUFBSSxDQUFDLE1BQUwsQ0FBWSxXQUFaLEVBQWQ7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLDBCQUFmLEVBQTJDLElBQTNDO0FBQ0EsaUJBTEYsQ0FLRyxPQUFPLENBQVAsRUFBVTtBQUNYLGtCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsV0FBZixFQUE0QixDQUFDLENBQUMsUUFBRixFQUE1QjtBQUNBOztBQWR3QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWUzQyxLQTVGTTtBQTZGRCxJQUFBLGdCQTdGQyw0QkE2RmlCLE9BN0ZqQixFQTZGMEIsT0E3RjFCLEVBNkZvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNyQyxnQkFBQSxHQURxQyxhQUM1QixlQUQ0QjtBQUFBO0FBQUEsdUJBRXBCLEtBQUssQ0FBQyxHQUFOLENBQVUsR0FBVixDQUZvQjs7QUFBQTtBQUVyQyxnQkFBQSxRQUZxQzs7QUFHekMsb0JBQUc7QUFFRyxrQkFBQSxJQUZILEdBRVUsUUFBUSxDQUFDLElBRm5CO0FBR0Qsa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxzQkFBZixFQUF1QyxJQUF2QztBQUVELGlCQUxELENBS0MsT0FBTSxHQUFOLEVBQVU7QUFDVCxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFdBQWYsRUFBNEIsR0FBRyxDQUFDLFFBQUosRUFBNUI7QUFDRDs7QUFWd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXMUMsS0F4R007QUF5R0QsSUFBQSxTQXpHQyxxQkF5R1UsT0F6R1YsRUF5R21CLE9BekduQixFQXlHNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDbEMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQTlCO0FBQ0ksZ0JBQUEsR0FGOEIsYUFFckIsZUFGcUIsaUJBR2xDOztBQUhrQztBQUFBLHVCQUliLEtBQUssQ0FDdkIsR0FEa0IsQ0FDZCxHQURjLEVBQ1Q7QUFDUixrQkFBQSxNQUFNLEVBQUU7QUFBRSxvQkFBQSxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQWhCO0FBQXNCLG9CQUFBLFVBQVUsRUFBRSxPQUFPLENBQUM7QUFBMUMsbUJBREEsQ0FFUjs7QUFGUSxpQkFEUyxDQUphOztBQUFBO0FBSTlCLGdCQUFBLFFBSjhCOztBQVMvQixvQkFBSTtBQUNFLGtCQUFBLE9BREYsR0FDWSxRQUFRLENBQUMsT0FEckIsRUFFSDs7QUFDSSxrQkFBQSxJQUhELEdBR1EsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBQWtCLFVBQUEsSUFBSSxFQUFJO0FBQ25DO0FBQ0Esd0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFyQjtBQUNBLG9CQUFBLElBQUksQ0FBQyxVQUFMLEdBQWtCLE1BQU0sQ0FBQyxJQUFJLElBQUosQ0FBUyxTQUFULENBQUQsQ0FBTixDQUE0QixNQUE1QixDQUNoQixvQkFEZ0IsQ0FBbEI7QUFHQSwyQkFBTyxJQUFQO0FBQ0QsbUJBUFUsQ0FIUixFQVdIOztBQUNBLGtCQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQVQsQ0FBekIsRUFBeUMsNkJBQXpDO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxzQkFBZixFQUF1QyxPQUFPLENBQUMsSUFBL0M7QUFDQSxrQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGtCQUFmLEVBQW1DLE9BQW5DO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQTlCO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLE9BQS9CO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBQ0QsaUJBbEJBLENBbUJELE9BQU0sS0FBTixFQUFhO0FBQ1gsa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBQ0Esa0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLEtBQUssQ0FBQyxRQUFOLEVBQTVCO0FBQ0Q7O0FBL0IrQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdDbkMsS0F6SU07QUEwSUQsSUFBQSxZQTFJQyx3QkEwSWEsT0ExSWIsRUEwSXNCLE9BMUl0QixFQTBJK0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDcEMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQTlCO0FBQ0ksZ0JBQUEsR0FGZ0MsYUFFdkIsZUFGdUI7QUFBQTtBQUFBO0FBQUEsdUJBSWIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxHQUFWLEVBQWU7QUFBRSxrQkFBQSxNQUFNLEVBQUU7QUFBRSxvQkFBQSxJQUFJLEVBQUU7QUFBUjtBQUFWLGlCQUFmLENBSmE7O0FBQUE7QUFJOUIsZ0JBQUEsUUFKOEI7QUFLN0IsZ0JBQUEsT0FMNkIsR0FLbkIsUUFBUSxDQUFDLE9BTFU7QUFNN0IsZ0JBQUEsSUFONkIsR0FNdEIsUUFBUSxDQUFDLElBQVQsQ0FBYyxDQUFkLENBTnNCO0FBTzdCLGdCQUFBLFNBUDZCLEdBT2pCLElBQUksQ0FBQyxVQVBZO0FBUWpDLGdCQUFBLElBQUksQ0FBQyxVQUFMLEdBQWtCLE1BQU0sQ0FBQyxJQUFJLElBQUosQ0FBUyxTQUFULENBQUQsQ0FBTixDQUE0QixNQUE1QixDQUNoQixvQkFEZ0IsQ0FBbEI7QUFFQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGtCQUFmLEVBQW1DLE9BQW5DO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSw2QkFBZixFQUE4QyxPQUFPLENBQUMsSUFBdEQ7QUFDQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGlCQUFmLEVBQWtDLElBQWxDO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBYmlDO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBZWpDLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsV0FBZixFQUE0QixhQUFNLFFBQU4sRUFBNUI7O0FBaEJpQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CckMsS0E3Sk07QUE4SkQsSUFBQSxVQTlKQyxzQkE4SlcsT0E5SlgsRUE4Sm9CLE9BOUpwQixFQThKNkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDbEMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQTlCLEVBRGtDLENBRWxDOztBQUNJLGdCQUFBLEdBSDhCLGFBR3JCLGVBSHFCO0FBQUE7QUFBQTtBQUFBLHVCQUtYLEtBQUssQ0FBQyxHQUFOLENBQVUsR0FBVixFQUFlO0FBQUUsa0JBQUEsTUFBTSxFQUFFO0FBQUUsb0JBQUEsSUFBSSxFQUFFO0FBQVI7QUFBVixpQkFBZixDQUxXOztBQUFBO0FBSzVCLGdCQUFBLFFBTDRCO0FBTTVCLGdCQUFBLElBTjRCLEdBTXJCLFFBQVEsQ0FBQyxJQUFULENBQWMsQ0FBZCxDQU5xQjtBQU81QixnQkFBQSxPQVA0QixHQU9sQixJQUFJLENBQUMsT0FQYTtBQVE1QixnQkFBQSxPQVI0QixHQVFsQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxPQUFoQixDQVJrQixFQVVoQztBQUNBOztBQUNJLGdCQUFBLFFBWjRCLEdBWWpCLElBQUksQ0FBQyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLElBQXZCLENBQTRCLFdBQTVCLEVBWmlCO0FBYTVCLGdCQUFBLElBYjRCLEdBYXJCLElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBYixFQUFnQixVQUFoQixDQUEyQixJQWJOO0FBYzVCLGdCQUFBLGFBZDRCLEdBY1osSUFBSSxDQUFDLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBZEo7QUFlNUIsZ0JBQUEsV0FmNEIsR0FlZCxJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsU0FmRjtBQWdCNUIsZ0JBQUEsV0FoQjRCLEdBZ0JkLGFBQWEsR0FBRyxJQUFoQixHQUF1QixRQUF2QixHQUFrQyxHQWhCcEI7QUFpQjVCLGdCQUFBLFlBakI0QixHQWlCYixPQUFPLENBQUMsTUFqQks7QUFrQmhDLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsSUFBSSxDQUFDLE9BQXRDO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLElBQUksQ0FBQyxPQUFuQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixPQUE5QjtBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsWUFBZixFQUE2QixPQUE3QjtBQUNJLGdCQUFBLFlBdEI0QixHQXNCYixJQXRCYTs7QUF1QmhDLG9CQUFJLElBQUksQ0FBQyxVQUFULEVBQXFCO0FBQ25CLGtCQUFBLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxVQUFoQixDQUFmO0FBQ0Q7O0FBQ0QsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxrQkFBZixFQUFtQyxZQUFuQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsb0JBQWYsRUFBcUMsT0FBckM7QUFDQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsRUFBK0IsUUFBL0I7QUFDQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsRUFBK0IsSUFBL0I7QUFDQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLG1CQUFmLEVBQW9DLGFBQXBDO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxpQkFBZixFQUFrQyxXQUFsQztBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsa0JBQWYsRUFBbUMsWUFBbkM7QUFDQSxnQkFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGdCQUFmLEVBQWlDLFdBQWpDO0FBQ0EsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxhQUFmLEVBQThCLEtBQTlCO0FBbENnQztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQXNDaEMsZ0JBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLGFBQU0sUUFBTixFQUE1QjtBQUNBLGdCQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5Qjs7QUF2Q2dDO0FBd0NqQzs7QUF4Q2lDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBeUNuQyxLQXZNTTtBQXdNUCxJQUFBLGFBeE1PLHlCQXdNUSxPQXhNUixFQXdNaUIsT0F4TWpCLEVBd00wQjtBQUMvQixNQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixJQUE5QjtBQUNJLFVBQUksR0FBRyxhQUFNLGVBQU4sV0FBUDtBQUNBLE1BQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxHQUFWLEVBQWU7QUFBRSxRQUFBLE1BQU0sRUFBRTtBQUFFLFVBQUEsSUFBSSxFQUFFO0FBQVI7QUFBVixPQUFmLEVBQThDLElBQTlDLENBQW1ELFVBQUEsUUFBUSxFQUFFO0FBQzdELFlBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsQ0FBZCxDQUFYO0FBQ0EsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQW5CO0FBQ0EsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsT0FBaEIsQ0FBZDtBQUNBLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLElBQXZCLENBQTRCLFdBQTVCLEVBQWY7QUFDQSxZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsVUFBaEIsQ0FBMkIsSUFBdEM7QUFDQSxZQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsVUFBcEM7QUFDQSxZQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTCxDQUFhLENBQWIsRUFBZ0IsU0FBbEM7QUFDQSxZQUFJLFdBQVcsR0FBRyxhQUFhLEdBQUcsSUFBaEIsR0FBdUIsUUFBdkIsR0FBa0MsR0FBcEQ7QUFDQSxZQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsTUFBM0I7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsSUFBSSxDQUFDLE9BQXRDO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsSUFBSSxDQUFDLE9BQW5DO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsT0FBOUI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsWUFBZixFQUE2QixPQUE3QjtBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvQkFBZixFQUFxQyxPQUFyQztBQUNBLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxjQUFmLEVBQStCLFFBQS9CO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGNBQWYsRUFBK0IsSUFBL0I7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsbUJBQWYsRUFBb0MsYUFBcEM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsaUJBQWYsRUFBa0MsV0FBbEM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsa0JBQWYsRUFBbUMsWUFBbkM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsZ0JBQWYsRUFBaUMsV0FBakM7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNDLE9BdEJELFdBc0JTLFVBQUEsS0FBSyxFQUFHO0FBQ2pCLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxXQUFmLEVBQTRCLEtBQUssQ0FBQyxRQUFOLEVBQTVCO0FBQ0EsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7QUFDQSxRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsYUFBZixFQUE4QixLQUE5QjtBQUNELE9BMUJDO0FBMkJMO0FBdE9NO0FBM1RrQixDQUFmLENBQWQsQyxDQXFpQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvciwgUHJvbWlzZUltcGwpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlSW1wbC5yZXNvbHZlKHZhbHVlLl9fYXdhaXQpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJ0aHJvd1wiLCBlcnIsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZUltcGwoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0LCBQcm9taXNlSW1wbCkge1xuICAgIGlmIChQcm9taXNlSW1wbCA9PT0gdm9pZCAwKSBQcm9taXNlSW1wbCA9IFByb21pc2U7XG5cbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCksXG4gICAgICBQcm9taXNlSW1wbFxuICAgICk7XG5cbiAgICByZXR1cm4gZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgLy8gTm90ZTogW1wicmV0dXJuXCJdIG11c3QgYmUgdXNlZCBmb3IgRVMzIHBhcnNpbmcgY29tcGF0aWJpbGl0eS5cbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgZXhwb3J0cy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcblxuICAvLyBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlXG4gIC8vIG9yIG5vdCwgcmV0dXJuIHRoZSBydW50aW1lIG9iamVjdCBzbyB0aGF0IHdlIGNhbiBkZWNsYXJlIHRoZSB2YXJpYWJsZVxuICAvLyByZWdlbmVyYXRvclJ1bnRpbWUgaW4gdGhlIG91dGVyIHNjb3BlLCB3aGljaCBhbGxvd3MgdGhpcyBtb2R1bGUgdG8gYmVcbiAgLy8gaW5qZWN0ZWQgZWFzaWx5IGJ5IGBiaW4vcmVnZW5lcmF0b3IgLS1pbmNsdWRlLXJ1bnRpbWUgc2NyaXB0LmpzYC5cbiAgcmV0dXJuIGV4cG9ydHM7XG5cbn0oXG4gIC8vIElmIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZSwgdXNlIG1vZHVsZS5leHBvcnRzXG4gIC8vIGFzIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgbmFtZXNwYWNlLiBPdGhlcndpc2UgY3JlYXRlIGEgbmV3IGVtcHR5XG4gIC8vIG9iamVjdC4gRWl0aGVyIHdheSwgdGhlIHJlc3VsdGluZyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGluaXRpYWxpemVcbiAgLy8gdGhlIHJlZ2VuZXJhdG9yUnVudGltZSB2YXJpYWJsZSBhdCB0aGUgdG9wIG9mIHRoaXMgZmlsZS5cbiAgdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiA/IG1vZHVsZS5leHBvcnRzIDoge31cbikpO1xuXG50cnkge1xuICByZWdlbmVyYXRvclJ1bnRpbWUgPSBydW50aW1lO1xufSBjYXRjaCAoYWNjaWRlbnRhbFN0cmljdE1vZGUpIHtcbiAgLy8gVGhpcyBtb2R1bGUgc2hvdWxkIG5vdCBiZSBydW5uaW5nIGluIHN0cmljdCBtb2RlLCBzbyB0aGUgYWJvdmVcbiAgLy8gYXNzaWdubWVudCBzaG91bGQgYWx3YXlzIHdvcmsgdW5sZXNzIHNvbWV0aGluZyBpcyBtaXNjb25maWd1cmVkLiBKdXN0XG4gIC8vIGluIGNhc2UgcnVudGltZS5qcyBhY2NpZGVudGFsbHkgcnVucyBpbiBzdHJpY3QgbW9kZSwgd2UgY2FuIGVzY2FwZVxuICAvLyBzdHJpY3QgbW9kZSB1c2luZyBhIGdsb2JhbCBGdW5jdGlvbiBjYWxsLiBUaGlzIGNvdWxkIGNvbmNlaXZhYmx5IGZhaWxcbiAgLy8gaWYgYSBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBmb3JiaWRzIHVzaW5nIEZ1bmN0aW9uLCBidXQgaW4gdGhhdCBjYXNlXG4gIC8vIHRoZSBwcm9wZXIgc29sdXRpb24gaXMgdG8gZml4IHRoZSBhY2NpZGVudGFsIHN0cmljdCBtb2RlIHByb2JsZW0uIElmXG4gIC8vIHlvdSd2ZSBtaXNjb25maWd1cmVkIHlvdXIgYnVuZGxlciB0byBmb3JjZSBzdHJpY3QgbW9kZSBhbmQgYXBwbGllZCBhXG4gIC8vIENTUCB0byBmb3JiaWQgRnVuY3Rpb24sIGFuZCB5b3UncmUgbm90IHdpbGxpbmcgdG8gZml4IGVpdGhlciBvZiB0aG9zZVxuICAvLyBwcm9ibGVtcywgcGxlYXNlIGRldGFpbCB5b3VyIHVuaXF1ZSBwcmVkaWNhbWVudCBpbiBhIEdpdEh1YiBpc3N1ZS5cbiAgRnVuY3Rpb24oXCJyXCIsIFwicmVnZW5lcmF0b3JSdW50aW1lID0gclwiKShydW50aW1lKTtcbn1cbiIsImNvbnN0IGJhc2VVUkwgPSAnL3dwLWpzb24vd3AvdjIvJztcclxuY29uc3QgYXV0aFVSTCA9ICcvd3AtanNvbi9qd3QtYXV0aC92MS8nO1xyXG5jb25zdCBwcm9maWxlVVJMID0gJy93cC1qc29uL3RvdXMvdjEvcGxheWVycyc7XHJcbmNvbnN0IHN0YXRzVVJMID0gJy93cC1qc29uL3RvdXMvdjEvc3RhdHMvJztcclxuZXhwb3J0IHsgYmFzZVVSTCwgYXV0aFVSTCwgcHJvZmlsZVVSTCwgc3RhdHNVUkwgIH07XHJcblxyXG4iLCJpbXBvcnQgc3RvcmUgZnJvbSAnLi9zdG9yZS5qcyc7XHJcbmltcG9ydCBzY3JMaXN0IGZyb20gJy4vcGFnZXMvbGlzdC5qcyc7XHJcbmltcG9ydCB0RGV0YWlsIGZyb20gJy4vcGFnZXMvZGV0YWlsLmpzJztcclxuaW1wb3J0IENhdGVEZXRhaWwgZnJvbSAnLi9wYWdlcy9jYXRlZ29yeS5qcyc7XHJcbmltcG9ydCBzQ2FyZCBmcm9tICcuL3BhZ2VzL3Njb3Jlc2hlZXQuanMnO1xyXG5cclxuVnVlLmZpbHRlcignYWJicnYnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gICcnO1xyXG4gIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICB2YXIgZmlyc3QgPSB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTtcclxuICB2YXIgbiA9IHZhbHVlLnRyaW0oKS5zcGxpdChcIiBcIik7XHJcbiAgdmFyIGxhc3QgPSBuW24ubGVuZ3RoIC0gMV07XHJcbiAgcmV0dXJuIGZpcnN0ICsgXCIuIFwiICsgbGFzdDtcclxufSk7XHJcblxyXG5WdWUuZmlsdGVyKCdmaXJzdGNoYXInLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJztcclxuICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKTtcclxuICB9KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBuID0gTWF0aC5mbG9vcihOdW1iZXIodmFsdWUpKTtcclxuICBpZiAobiAhPT0gSW5maW5pdHkgJiYgU3RyaW5nKG4pID09PSB2YWx1ZSAmJiBuID4gMCkge1xyXG4gICAgcmV0dXJuICcrJyArIHZhbHVlO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn0pO1xyXG5cclxuVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodmFsdWUpLCBudWxsLCAyKTtcclxufSk7XHJcblxyXG4gIGNvbnN0IHJvdXRlcyA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICBjb21wb25lbnQ6IHNjckxpc3QsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdOU0YgVG91cm5hbWVudHMgLSBSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cy86c2x1ZycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgY29tcG9uZW50OiB0RGV0YWlsLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnVG91cm5hbWVudCBEZXRhaWxzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnJyxcclxuICAgICAgbmFtZTogJ0NhdGVEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IENhdGVEZXRhaWwsXHJcbiAgICAgIHByb3BzOiB0cnVlLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnUmVzdWx0cyBhbmQgU3RhdGlzdGljcycgfSxcclxuICAgICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnLzpwbm8nLFxyXG4gICAgICBuYW1lOiAnU2NvcmVzaGVldCcsXHJcbiAgICAgIGNvbXBvbmVudDogc0NhcmQsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdQbGF5ZXIgU2NvcmVjYXJkcycgfVxyXG4gICAgfVxyXG4gIF07XHJcblxyXG5jb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHtcclxuICBtb2RlOiAnaGlzdG9yeScsXHJcbiAgcm91dGVzOiByb3V0ZXMsIC8vIHNob3J0IGZvciBgcm91dGVzOiByb3V0ZXNgXHJcbn0pO1xyXG5yb3V0ZXIuYmVmb3JlRWFjaCgodG8sIGZyb20sIG5leHQpID0+IHtcclxuICBkb2N1bWVudC50aXRsZSA9IHRvLm1ldGEudGl0bGU7XHJcbiAgbmV4dCgpO1xyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gIGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyksXHJcbiAgcm91dGVyLFxyXG4gIG1peGluczogW1Z1ZTJGaWx0ZXJzLm1peGluXSxcclxuICBzdG9yZVxyXG59KTtcclxuXHJcblxyXG4iLCJ2YXIgTG9hZGluZ0FsZXJ0ID0gVnVlLmNvbXBvbmVudCgnbG9hZGluZycse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIG1heC12dy03NSBtdC01XCI+XHJcblxyXG4gICAgICAgIDxzdmcgY2xhc3M9XCJsZHMtYmxvY2tzIG10LTVcIiB3aWR0aD1cIjIwMHB4XCIgIGhlaWdodD1cIjIwMHB4XCIgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwieE1pZFlNaWRcIiBzdHlsZT1cImJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMCkgbm9uZSByZXBlYXQgc2Nyb2xsIDAlIDAlO1wiPjxyZWN0IHg9XCIxOVwiIHk9XCIxOVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMHNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjQwXCIgeT1cIjE5XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjE1c1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNjFcIiB5PVwiMTlcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuM3NcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjE5XCIgeT1cIjQwXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIxLjA1c1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNjFcIiB5PVwiNDBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuNDQ5OTk5OTk5OTk5OTk5OTZzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCIxOVwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC44OTk5OTk5OTk5OTk5OTk5c1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNDBcIiB5PVwiNjFcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuNzVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4xc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC4yc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgICA8L3JlY3Q+PC9zdmc+XHJcbiAgICAgICA8aDQgY2xhc3M9XCJkaXNwbGF5LTMgYmViYXMgdGV4dC1jZW50ZXIgdGV4dC1zZWNvbmRhcnlcIj5Mb2FkaW5nLi5cclxuICAgICAgICA8IS0tIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtcHVsc2VcIj48L2k+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+TG9hZGluZy4uPC9zcGFuPlxyXG4gICAgICAgIC0tPlxyXG4gICAgICAgPC9oND5cclxuICAgIDwvZGl2PmBcclxuIH0pO1xyXG5cclxudmFyIEVycm9yQWxlcnQgPVZ1ZS5jb21wb25lbnQoJ2Vycm9yJywge1xyXG4gICB0ZW1wbGF0ZTogYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIG10LTUgbXgtYXV0byBkLWJsb2NrIG1heC12dy03NVwiIHJvbGU9XCJhbGVydFwiPlxyXG4gICAgICAgICAgPGg0IGNsYXNzPVwiYWxlcnQtaGVhZGluZyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yXCI+PC9zbG90PlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+RXJyb3IuLi48L3NwYW4+XHJcbiAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LWF1dG8gdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxzbG90IG5hbWU9XCJlcnJvcl9tc2dcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+YCxcclxuICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgcmV0dXJuIHt9O1xyXG4gICB9LFxyXG4gfSk7XHJcbiBsZXQgbWFwR2V0dGVycyA9IFZ1ZXgubWFwR2V0dGVycztcclxuIHZhciBMb2dpbkZvcm0gPVZ1ZS5jb21wb25lbnQoJ2xvZ2luJywge1xyXG4gICB0ZW1wbGF0ZTogYFxyXG4gICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2dpbl9zdWNjZXNzXCIgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LTIgcHktMVwiPjxpIGNsYXNzPVwiZmFzIGZhLXVzZXItYWx0XCI+PC9pPiA8c21hbGw+V2VsY29tZSB7e3VzZXJfZGlzcGxheX19PC9zbWFsbD48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC0yIHB5LTFcIiBAY2xpY2s9XCJsb2dPdXRcIj48aSBzdHlsZT1cImNvbG9yOnRvbWF0b1wiIGNsYXNzPVwiZmFzIGZhLXNpZ24tb3V0LWFsdCBcIj48L2k+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2U+XHJcbiAgICAgICAgICA8Yi1mb3JtIEBzdWJtaXQ9XCJvblN1Ym1pdFwiIGlubGluZSBjbGFzcz1cInctODAgbXgtYXV0b1wiPlxyXG4gICAgICAgICAgPGItZm9ybS1pbnZhbGlkLWZlZWRiYWNrIDpzdGF0ZT1cInZhbGlkYXRpb25cIj5cclxuICAgICAgICAgICAgWW91ciB1c2VybmFtZSBvciBwYXNzd29yZCBtdXN0IGJlIG1vcmUgdGhhbiAxIGNoYXJhY3RlciBpbiBsZW5ndGguXHJcbiAgICAgICAgICAgIDwvYi1mb3JtLWludmFsaWQtZmVlZGJhY2s+XHJcbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtdXNlcm5hbWVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8Yi1pbnB1dFxyXG4gICAgICAgICAgaWQ9XCJpbmxpbmUtZm9ybS1pbnB1dC11c2VybmFtZVwiIHBsYWNlaG9sZGVyPVwiVXNlcm5hbWVcIiA6c3RhdGU9XCJ2YWxpZGF0aW9uXCJcclxuICAgICAgICAgIGNsYXNzPVwibWItMiBtci1zbS0yIG1iLXNtLTAgZm9ybS1jb250cm9sLXNtXCJcclxuICAgICAgICAgIHYtbW9kZWw9XCJmb3JtLnVzZXJcIiA+XHJcbiAgICAgICAgICA8L2ItaW5wdXQ+XHJcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwic3Itb25seVwiIGZvcj1cImlubGluZS1mb3JtLWlucHV0LXBhc3N3b3JkXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgPGItaW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgaWQ9XCJpbmxpbmUtZm9ybS1pbnB1dC1wYXNzd29yZFwiIDpzdGF0ZT1cInZhbGlkYXRpb25cIiBjbGFzcz1cImZvcm0tY29udHJvbC1zbVwiIHBsYWNlaG9sZGVyPVwiUGFzc3dvcmRcIiB2LW1vZGVsPVwiZm9ybS5wYXNzXCI+PC9iLWlucHV0PlxyXG4gICAgICAgICAgPC9iLWlucHV0LWdyb3VwPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cIm91dGxpbmUtZGFya1wiIHNpemU9XCJzbVwiIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1sLXNtLTJcIj5cclxuICAgICAgICAgICAgPGkgIDpjbGFzcz1cInsnZmEtc2F2ZScgOiBsb2dpbl9sb2FkaW5nID09IGZhbHNlLCAnZmEtc3Bpbm5lciBmYS1wdWxzZSc6IGxvZ2luX2xvYWRpbmcgPT0gdHJ1ZX1cIiBjbGFzcz1cImZhc1wiPjwvaT5cclxuICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgIDwvYi1mb3JtPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgYCxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvcm06IHtcclxuICAgICAgICBwYXNzOicnLFxyXG4gICAgICAgIHVzZXI6ICcnXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gICB9LFxyXG4gICBtb3VudGVkKCkge1xyXG4gICAgaWYodGhpcy5hY2Nlc3MubGVuZ3RoID4gMClcclxuICAgIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0FVVEhfVE9LRU4nLCB0aGlzLmFjY2Vzcyk7XHJcbiAgICAgfVxyXG4gICAgIGNvbnNvbGUubG9nKHRoaXMudXNlcl9kaXNwbGF5KVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgb25TdWJtaXQoZXZ0KSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHRoaXMuZm9ybSkpO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRE9fTE9HSU4nLCB0aGlzLmZvcm0pO1xyXG4gICAgfSxcclxuICAgIGxvZ091dCgpIHtcclxuICAgICAgLy8gIGxvZ291dCBmdW5jdGlvblxyXG4gICAgICBjb25zb2xlLmxvZygnQ2xpY2tlZCBsb2dPdXQnKTtcclxuICAgIH1cclxuICAgfSxcclxuICAgY29tcHV0ZWQ6IHtcclxuICAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgIGxvZ2luX2xvYWRpbmc6ICdMT0dJTl9MT0FESU5HJyxcclxuICAgICAgIGxvZ2luX3N1Y2Nlc3M6ICdMT0dJTl9TVUNDRVNTJyxcclxuICAgICAgIHVzZXJfZGlzcGxheTogJ1VTRVInLFxyXG4gICAgICAgYWNjZXNzOiAnQUNDRVNTX1RPS0VOJ1xyXG4gICAgIH0pLFxyXG5cclxuICAgICB2YWxpZGF0aW9uKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5mb3JtLnVzZXIubGVuZ3RoID4gMSAmJiB0aGlzLmZvcm0ucGFzcy5sZW5ndGggPiAxXHJcbiAgICB9LFxyXG4gICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0LCBMb2dpbkZvcm0gfTtcclxuXHJcbiIsImltcG9ydCB7IFBhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHN9IGZyb20gJy4vcGxheWVybGlzdC5qcyc7XHJcbmltcG9ydCB7TG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0fSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmltcG9ydCB7IEhpV2lucywgTG9XaW5zLCBIaUxvc3MsIENvbWJvU2NvcmVzLCBUb3RhbFNjb3JlcywgVG90YWxPcHBTY29yZXMsIEF2ZVNjb3JlcywgQXZlT3BwU2NvcmVzLCBIaVNwcmVhZCwgTG9TcHJlYWQgfSBmcm9tICcuL3N0YXRzLmpzJztcclxuaW1wb3J0IFN0YXRzUHJvZmlsZSBmcm9tICcuL3Byb2ZpbGUuanMnO1xyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL3Njb3JlYm9hcmQuanMnO1xyXG5pbXBvcnQgUmF0aW5nU3RhdHMgZnJvbSAnLi9yYXRpbmdfc3RhdHMuanMnO1xyXG5pbXBvcnQgdG9wUGVyZm9ybWVycyBmcm9tICcuL3RvcC5qcyc7XHJcbmV4cG9ydCB7IENhdGVEZXRhaWwgYXMgZGVmYXVsdCB9O1xyXG5sZXQgQ2F0ZURldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ2NhdGUnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDxkaXYgdi1pZj1cInJlc3VsdGRhdGFcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCIhKGVycm9yfHxsb2FkaW5nKVwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cInZpZXdJbmRleCAhPTggJiYgdmlld0luZGV4ICE9NVwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiID5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy0wXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxiLWltZyBmbHVpZCB0aHVtYm5haWwgY2xhc3M9XCJsb2dvXCIgOnNyYz1cImxvZ29cIiA6YWx0PVwiZXZlbnRfdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIDp0aXRsZT1cInRvdGFsX3JvdW5kcysgJyByb3VuZHMsICcgKyB0b3RhbF9wbGF5ZXJzICsnIHBsYXllcnMnXCIgdi1zaG93PVwidG90YWxfcm91bmRzXCIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+e3sgdG90YWxfcm91bmRzIH19IEdhbWVzIHt7IHRvdGFsX3BsYXllcnN9fSA8aSBjbGFzcz1cImZhcyBmYS11c2Vyc1wiPjwvaT4gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0wXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0wXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTBcIj48aSBjbGFzcz1cImZhIGZhLXVzZXJzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBQbGF5ZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MVwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0xXCI+IDxpIGNsYXNzPVwiZmEgZmEtdXNlci1wbHVzXCI+PC9pPiBQYWlyaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTJcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTJcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MlwiPjxiLWljb24gaWNvbj1cImRvY3VtZW50LXRleHRcIj48L2ItaWNvbj4gUmVzdWx0czwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJSb3VuZC1CeS1Sb3VuZCBTdGFuZGluZ3NcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9M1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09M1wiIDpwcmVzc2VkPVwidmlld0luZGV4PT0zXCI+PGItaWNvbiBpY29uPVwibGlzdC1vbFwiPjwvYi1pY29uPiBTdGFuZGluZ3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiQ2F0ZWdvcnkgU3RhdGlzdGljc1wiIEBjbGljaz1cInZpZXdJbmRleD00XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT00XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTRcIj48Yi1pY29uIGljb249XCJiYXItY2hhcnQtZmlsbFwiPjwvYi1pY29uPiBTdGF0aXN0aWNzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzoxfX1cIj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIj48Yi1pY29uIGljb249XCJkb2N1bWVudHMtYWx0XCI+PC9iLWljb24+IFNjb3JlY2FyZHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlJvdW5kLUJ5LVJvdW5kIFNjb3JlYm9hcmRcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9NVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT01XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTVcIj48Yi1pY29uIGljb249XCJkaXNwbGF5XCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBTY29yZWJvYXJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlRvcCAzIFBlcmZvcm1hbmNlc1wiIEBjbGljaz1cInZpZXdJbmRleD02XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTZcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NlwiPjxiLWljb24gaWNvbj1cImF3YXJkXCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBUb3AgUGVyZm9ybWVyczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJQb3N0LXRvdXJuZXkgUmF0aW5nIFN0YXRpc3RpY3NcIiB2LWlmPVwicmF0aW5nX3N0YXRzXCIgQGNsaWNrPVwidmlld0luZGV4PTdcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09N1wiIDpwcmVzc2VkPVwidmlld0luZGV4PT03XCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1pY29uIGljb249XCJncmFwaC11cFwiPjwvYi1pY29uPlxyXG4gICAgICAgICAgICAgICAgUmF0aW5nIFN0YXRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlBsYXllciBQcm9maWxlIGFuZCBTdGF0aXN0aWNzXCIgIEBjbGljaz1cInZpZXdJbmRleD04XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PThcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09OFwiPlxyXG4gICAgICAgICAgICAgICAgPGItaWNvbiBpY29uPVwidHJvcGh5XCI+PC9iLWljb24+XHJcbiAgICAgICAgICAgICAgICBQcm9maWxlIFN0YXRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTAgb2Zmc2V0LW1kLTEgY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhcyBwLTAgbS0wXCI+IHt7dGFiX2hlYWRpbmd9fVxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJ2aWV3SW5kZXggPjAgJiYgdmlld0luZGV4IDwgNFwiPlxyXG4gICAgICAgICAgICAgIHt7IGN1cnJlbnRSb3VuZCB9fVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1BhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwidG90YWxfcm91bmRzXCIgdi1tb2RlbD1cImN1cnJlbnRSb3VuZFwiIDpwZXItcGFnZT1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiBjaGFuZ2U9XCJyb3VuZENoYW5nZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8L2ItcGFnaW5hdGlvbj5cclxuICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT0wXCI+XHJcbiAgICAgICAgICA8YWxscGxheWVycyA6c2x1Zz1cInNsdWdcIj48L2FsbHBsYXllcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09NlwiPlxyXG4gICAgICAgICAgPHBlcmZvcm1lcnM+PC9wZXJmb3JtZXJzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTdcIj5cclxuICAgICAgICAgIDxyYXRpbmdzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpjb21wdXRlZF9pdGVtcz1cImNvbXB1dGVkX3JhdGluZ19pdGVtc1wiPlxyXG4gICAgICAgICAgPC9yYXRpbmdzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PThcIj5cclxuICAgICAgICAgICA8cHJvZmlsZXM+PC9wcm9maWxlcz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT01XCI+XHJcbiAgICAgICAgPHNjb3JlYm9hcmQgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiPjwvc2NvcmVib2FyZD5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDxkaXYgdi1lbHNlLWlmPVwidmlld0luZGV4PT00XCIgY2xhc3M9XCJyb3cgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTAgb2Zmc2V0LW1kLTAgY29sXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi10YWJzIGNvbnRlbnQtY2xhc3M9XCJtdC0zIHN0YXRzVGFic1wiIHBpbGxzIHNtYWxsIGxhenkgbm8tZmFkZSAgdi1tb2RlbD1cInRhYkluZGV4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiSGlnaCBXaW5zXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhpd2lucyAgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGl3aW5zPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiSGlnaCBMb3NzZXNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlsb3NzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hpbG9zcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBXaW5zXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvd2lucyAgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbG93aW5zPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiQ29tYmluZWQgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb21ib3Njb3JlcyA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9jb21ib3Njb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dG90YWxzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygndG90YWxfc2NvcmUnKVwiPjwvdG90YWxzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJUb3RhbCBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygndG90YWxfb3Bwc2NvcmUnKVwiPjwvb3Bwc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiQXZlIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YXZlc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ2F2ZV9zY29yZScpXCI+PC9hdmVzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgT3BwIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YXZlb3Bwc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ2F2ZV9vcHBzY29yZScpXCI+PC9hdmVvcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFNwcmVhZHMgXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhpc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvaGlzcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJMb3cgU3ByZWFkc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsb3NwcmVhZCA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L2xvc3ByZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICA8L2ItdGFicz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IG9mZnNldC1tZC0yIGNvbC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPHBhaXJpbmdzIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIiB2LWlmPVwidmlld0luZGV4PT0xXCI+PC9wYWlyaW5ncz5cclxuICAgICAgICAgICAgICAgIDxyZXN1bHRzIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIiB2LWlmPVwidmlld0luZGV4PT0yXCI+PC9yZXN1bHRzPlxyXG4gICAgICAgICAgICAgICAgPHN0YW5kaW5ncyA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCIgdi1pZj1cInZpZXdJbmRleD09M1wiPjwvc3RhbmRpbmdzPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICAgIGFsbHBsYXllcnM6IFBsYXllckxpc3QsXHJcbiAgICBwYWlyaW5nczogUGFpcmluZ3MsXHJcbiAgICByZXN1bHRzOiBSZXN1bHRzLFxyXG4gICAgcmF0aW5nczogUmF0aW5nU3RhdHMsXHJcbiAgICBzdGFuZGluZ3M6IFN0YW5kaW5ncyxcclxuICAgIGhpd2luczogSGlXaW5zLFxyXG4gICAgaGlsb3NzOiBIaUxvc3MsXHJcbiAgICBsb3dpbjogTG9XaW5zLFxyXG4gICAgY29tYm9zY29yZXM6IENvbWJvU2NvcmVzLFxyXG4gICAgdG90YWxzY29yZXM6IFRvdGFsU2NvcmVzLFxyXG4gICAgb3Bwc2NvcmVzOiBUb3RhbE9wcFNjb3JlcyxcclxuICAgIGF2ZXNjb3JlczogQXZlU2NvcmVzLFxyXG4gICAgYXZlb3Bwc2NvcmVzOiBBdmVPcHBTY29yZXMsXHJcbiAgICBoaXNwcmVhZDogSGlTcHJlYWQsXHJcbiAgICBsb3NwcmVhZDogTG9TcHJlYWQsXHJcbiAgICAvLyAnbHVja3lzdGlmZi10YWJsZSc6IEx1Y2t5U3RpZmZUYWJsZSxcclxuICAgIC8vICd0dWZmbHVjay10YWJsZSc6IFR1ZmZMdWNrVGFibGVcclxuICAgIHNjb3JlYm9hcmQ6IFNjb3JlYm9hcmQsXHJcbiAgICBwZXJmb3JtZXJzOiB0b3BQZXJmb3JtZXJzLFxyXG4gICAgcHJvZmlsZXM6IFN0YXRzUHJvZmlsZVxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgdG91cm5leV9zbHVnOiAnJyxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBnYW1lZGF0YTogW10sXHJcbiAgICAgIHRhYkluZGV4OiAwLFxyXG4gICAgICB2aWV3SW5kZXg6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogMSxcclxuICAgICAgdGFiX2hlYWRpbmc6ICcnLFxyXG4gICAgICBjYXB0aW9uOiAnJyxcclxuICAgICAgc2hvd1BhZ2luYXRpb246IGZhbHNlLFxyXG4gICAgICBjb21wdXRlZF9yYXRpbmdfaXRlbXM6IFtdLFxyXG4gICAgICBsdWNreXN0aWZmOiBbXSxcclxuICAgICAgdHVmZmx1Y2s6IFtdLFxyXG4gICAgICB0aW1lcjogJycsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcCA9IHRoaXMuc2x1Zy5zcGxpdCgnLScpO1xyXG4gICAgcC5zaGlmdCgpO1xyXG4gICAgdGhpcy50b3VybmV5X3NsdWcgPSBwLmpvaW4oJy0nKTtcclxuICAgIHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgdmlld0luZGV4OiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCAhPSA0KSB7XHJcbiAgICAgICAgICB0aGlzLmdldFZpZXcodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICByYXRpbmdfc3RhdHM6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZVJhdGluZ0RhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmV2ZW50X3RpdGxlO1xyXG4gICAgaWYgKHRoaXMudmlld0luZGV4ID09IDQpIHtcclxuICAgICAgdGhpcy5nZXRUYWJzKHRoaXMudGFiSW5kZXgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHVwZGF0ZVJhdGluZ0RhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgbGV0IHJlc3VsdGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jaGFpbihyZXN1bHRkYXRhKS5sYXN0KCkuc29ydEJ5KCdwbm8nKS52YWx1ZSgpO1xyXG4gICAgICBsZXQgaXRlbXMgPSBfLmNsb25lKHRoaXMucmF0aW5nX3N0YXRzKTtcclxuICAgICAgdGhpcy5jb21wdXRlZF9yYXRpbmdfaXRlbXMgPSBfLm1hcChpdGVtcywgZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICBsZXQgbiA9IHgucG5vO1xyXG4gICAgICAgIGxldCBwID0gXy5maWx0ZXIoZGF0YSwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLnBubyA9PSBuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHgucGhvdG8gPSBwWzBdLnBob3RvO1xyXG4gICAgICAgIHgucG9zaXRpb24gPSBwWzBdLnBvc2l0aW9uO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG4gICAgZ2V0VmlldzogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdSYW4gZ2V0VmlldyBmdW5jdGlvbiB2YWwtPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1BsYXllcnMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGFpcmluZyBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnKlBsYXlzIGZpcnN0JztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdSZXN1bHRzIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSZXN1bHRzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTdGFuZGluZ3MgYWZ0ZXIgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1N0YW5kaW5ncyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gbnVsbDtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUG9zdCBUb3VybmFtZW50IFJhdGluZyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYXRpbmcgU3RhdGlzdGljcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9IG51bGw7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSBudWxsO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICBnZXRUYWJzOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRUYWJzIGZ1bmN0aW9uLT4gJyArIHZhbCk7XHJcbiAgICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoIFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaCBMb3NpbmcgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoZXN0IENvbWJpbmVkIFNjb3JlIHBlciByb3VuZCc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1RvdGFsIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnVG90YWwgUGxheWVyIFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMgU3RhdGlzdGljcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0F2ZXJhZ2UgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYW5raW5nIGJ5IEF2ZXJhZ2UgUGxheWVyIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0F2ZXJhZ2UgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYW5raW5nIGJ5IEF2ZXJhZ2UgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgODpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaCBTcHJlYWRzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoZXN0IFNwcmVhZCBwZXIgcm91bmQgJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnTG93IFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0xvd2VzdCBTcHJlYWRzIHBlciByb3VuZCc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDEwOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMdWNreSBTdGlmZnMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0x1Y2t5IFN0aWZmcyAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgd2lubmVycyknO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVHVmZiBMdWNrJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUdWZmIEx1Y2sgKGZyZXF1ZW50IGxvdyBtYXJnaW4vc3ByZWFkIGxvc2VycyknO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnU2VsZWN0IGEgVGFiJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICByb3VuZENoYW5nZTogZnVuY3Rpb24ocGFnZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhwYWdlKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50Um91bmQpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHBhZ2U7XHJcbiAgICB9LFxyXG4gICAgY2FuY2VsQXV0b1VwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XHJcbiAgICB9LFxyXG4gICAgZmV0Y2hTdGF0czogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGxldCBsYXN0UmREYXRhID0gdGhpcy5yZXN1bHRkYXRhW3RoaXMudG90YWxfcm91bmRzIC0gMV07XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeShsYXN0UmREYXRhLCBrZXkpLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICB0dWZmbHVja3k6IGZ1bmN0aW9uKHJlc3VsdCA9ICd3aW4nKSB7XHJcbiAgICAgIC8vIG1ldGhvZCBydW5zIGJvdGggbHVja3lzdGlmZiBhbmQgdHVmZmx1Y2sgdGFibGVzXHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5yZXN1bHRkYXRhOyAvL0pTT04ucGFyc2UodGhpcy5ldmVudF9kYXRhLnJlc3VsdHMpO1xyXG4gICAgICBsZXQgcGxheWVycyA9IF8ubWFwKHRoaXMucGxheWVycywgJ3Bvc3RfdGl0bGUnKTtcclxuICAgICAgbGV0IGxzZGF0YSA9IFtdO1xyXG4gICAgICBsZXQgaGlnaHNpeCA9IF8uY2hhaW4ocGxheWVycylcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgIGxldCByZXMgPSBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obGlzdCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBfLmNoYWluKGxpc3QpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGRbJ3BsYXllciddID09PSBuICYmIGRbJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mbGF0dGVuRGVlcCgpXHJcbiAgICAgICAgICAgIC5zb3J0QnkoJ2RpZmYnKVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHJlcywgNik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gXy50YWtlUmlnaHQocmVzLCA2KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgcmV0dXJuIG4ubGVuZ3RoID4gNTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgXy5tYXAoaGlnaHNpeCwgZnVuY3Rpb24oaCkge1xyXG4gICAgICAgIGxldCBsYXN0ZGF0YSA9IF8udGFrZVJpZ2h0KGRhdGEpO1xyXG4gICAgICAgIGxldCBkaWZmID0gXy5jaGFpbihoKVxyXG4gICAgICAgICAgLm1hcCgnZGlmZicpXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG4pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIGxldCBuYW1lID0gaFswXVsncGxheWVyJ107XHJcbiAgICAgICAgbGV0IHN1bSA9IF8ucmVkdWNlKFxyXG4gICAgICAgICAgZGlmZixcclxuICAgICAgICAgIGZ1bmN0aW9uKG1lbW8sIG51bSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWVtbyArIG51bTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICBsZXQgcGxheWVyX2RhdGEgPSBfLmZpbmQobGFzdGRhdGEsIHtcclxuICAgICAgICAgIHBsYXllcjogbmFtZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWFyID0gcGxheWVyX2RhdGFbJ21hcmdpbiddO1xyXG4gICAgICAgIGxldCB3b24gPSBwbGF5ZXJfZGF0YVsncG9pbnRzJ107XHJcbiAgICAgICAgbGV0IGxvc3MgPSBwbGF5ZXJfZGF0YVsncm91bmQnXSAtIHdvbjtcclxuICAgICAgICAvLyBwdXNoIHZhbHVlcyBpbnRvIGxzZGF0YSBhcnJheVxyXG4gICAgICAgIGxzZGF0YS5wdXNoKHtcclxuICAgICAgICAgIHBsYXllcjogbmFtZSxcclxuICAgICAgICAgIHNwcmVhZDogZGlmZixcclxuICAgICAgICAgIHN1bV9zcHJlYWQ6IHN1bSxcclxuICAgICAgICAgIGN1bW11bGF0aXZlX3NwcmVhZDogbWFyLFxyXG4gICAgICAgICAgd29uX2xvc3M6IGAke3dvbn0gLSAke2xvc3N9YCxcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeShsc2RhdGEsICdzdW1fc3ByZWFkJyk7XHJcbiAgICB9LFxyXG4gICAgdG9OZXh0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgeCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kICsgMTtcclxuICAgICAgaWYgKG4gPD0geCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvUHJldlJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IG4gPSB0aGlzLmN1cnJlbnRSb3VuZCAtIDE7XHJcbiAgICAgIGlmIChuID49IDEpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IG47XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0b0ZpcnN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gMTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvTGFzdFJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJyBnb2luZyB0byBsYXN0IHJvdW5kJylcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFJvdW5kICE9IHRoaXMudG90YWxfcm91bmRzKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSB0aGlzLnRvdGFsX3JvdW5kcztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIHJhdGluZ19zdGF0czogJ1JBVElOR19TVEFUUycsXHJcbiAgICAgIGV2ZW50X2RhdGE6ICdFVkVOVFNUQVRTJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgY2F0ZWdvcnk6ICdDQVRFR09SWScsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIHBhcmVudF9zbHVnOiAnUEFSRU5UU0xVRycsXHJcbiAgICAgIGV2ZW50X3RpdGxlOiAnRVZFTlRfVElUTEUnLFxyXG4gICAgICB0b3VybmV5X3RpdGxlOiAnVE9VUk5FWV9USVRMRScsXHJcbiAgICAgIGxvZ286ICdMT0dPX1VSTCcsXHJcbiAgICB9KSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ05TRiBOZXdzJyxcclxuICAgICAgICAgIGhyZWY6ICcvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leV90aXRsZSxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgc2x1ZzogdGhpcy50b3VybmV5X3NsdWcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgLy90ZXh0OiBfLmNhcGl0YWxpemUodGhpcy5jYXRlZ29yeSksXHJcbiAgICAgICAgICAvLyBsZXQgY2F0ZWdvcnkgPSBfLmNhcGl0YWxpemUodGhpcy5jYXRlZ29yeSk7XHJcbiAgICAgICAgICB0ZXh0OiBgJHtfLmNhcGl0YWxpemUodGhpcy5jYXRlZ29yeSl9IC0gUmVzdWx0cyBhbmQgU3RhdHNgLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhdGhcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgQ2F0ZURldGFpbDsiLCJpbXBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQgfSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmltcG9ydCAgYmFzZVVSTCAgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuLy8gbGV0IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydDtcclxubGV0IHREZXRhaWwgPSBWdWUuY29tcG9uZW50KCd0ZGV0YWlsJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicC0zIHRleHQtY2VudGVyIGQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cclxuICAgICAgICAgICAgPGItaW1nIGZsdWlkIHRodW1ibmFpbCBzbG90PVwiYXNpZGVcIiB2ZXJ0aWNhbC1hbGlnbj1cImNlbnRlclwiIGNsYXNzPVwiYWxpZ24tc2VsZi1jZW50ZXIgbXItMSBsb2dvLW1lZGl1bVwiXHJcbiAgICAgICAgICAgICAgOnNyYz1cInRvdXJuZXkuZXZlbnRfbG9nb1wiIDphbHQ9XCJ0b3VybmV5LmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3M9XCJteC0xXCI+XHJcbiAgICAgICAgICAgICAge3t0b3VybmV5LnRpdGxlfX1cclxuICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInAtMiBkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXJcIiBpZD1cImV2ZW50LWRldGFpbHNcIj5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCIgdi1pZj1cInRvdXJuZXkuc3RhcnRfZGF0ZVwiPjxpIGNsYXNzPVwiZmEgZmEtY2FsZW5kYXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICB7e3RvdXJuZXkuc3RhcnRfZGF0ZX19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCIgdi1pZj1cInRvdXJuZXkudmVudWVcIj48aSBjbGFzcz1cImZhIGZhLW1hcC1tYXJrZXJcIj48L2k+IHt7dG91cm5leS52ZW51ZX19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1pZj1cInRvdXJuZXkudG91cm5hbWVudF9kaXJlY3RvclwiPjxpIGNsYXNzPVwiZmEgZmEtbGVnYWxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICB7e3RvdXJuZXkudG91cm5hbWVudF9kaXJlY3Rvcn19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPGg1PlxyXG4gICAgICAgICAgICAgIENhdGVnb3JpZXMgPGkgY2xhc3M9XCJmYSBmYS1saXN0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2g1PlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSB0ZXh0LWNlbnRlciBjYXRlLWxpc3RcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1mb3I9XCIoY2F0LCBjKSBpbiB0b3VybmV5LnRvdV9jYXRlZ29yaWVzXCIgOmtleT1cImNcIiBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwiY2F0LmV2ZW50X2lkXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJ7IG5hbWU6ICdDYXRlRGV0YWlsJywgcGFyYW1zOiB7ICBldmVudF9zbHVnOmNhdC5ldmVudF9zbHVnIH19XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3tjYXQuY2F0X25hbWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICAgICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBwYWdldXJsOiBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgICsgdGhpcy4kcm91dGUucGF0aCxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVVcGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gYFRvdXJuYW1lbnQ6ICR7dGhpcy50b3VybmV5LnRpdGxlfWA7XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgaWYgKHRoaXMudG91cm5leS5zbHVnICE9IHRoaXMuc2x1Zykge1xyXG4gICAgICAgIC8vIHJlc2V0IHRpdGxlIGJlY2F1c2Ugb2YgYnJlYWRjcnVtYnNcclxuICAgICAgICB0aGlzLnRvdXJuZXkudGl0bGUgPSAnJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgZSA9IHRoaXMudG91bGlzdC5maW5kKGV2ZW50ID0+IGV2ZW50LnNsdWcgPT09IHRoaXMuc2x1Zyk7XHJcbiAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgbGV0IG5vdyA9IG1vbWVudCgpO1xyXG4gICAgICAgIGNvbnN0IGEgPSBtb21lbnQodGhpcy5sYXN0X2FjY2Vzc190aW1lKTtcclxuICAgICAgICBjb25zdCB0aW1lX2VsYXBzZWQgPSBub3cuZGlmZihhLCAnc2Vjb25kcycpO1xyXG4gICAgICAgIGlmICh0aW1lX2VsYXBzZWQgPCAzMDApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tTWF0Y2ggRm91bmQgaW4gVG91cm5leSBMaXN0LS0tLS0tLS0tLScpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aW1lX2VsYXBzZWQpO1xyXG4gICAgICAgICAgdGhpcy50b3VybmV5ID0gZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREVUQUlMJywgdGhpcy5zbHVnKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICAvLyB0b3VybmV5OiAnREVUQUlMJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgbGFzdF9hY2Nlc3NfdGltZTogJ1RPVUFDQ0VTU1RJTUUnLFxyXG4gICAgICB0b3VsaXN0OiAnVE9VQVBJJ1xyXG4gICAgfSksXHJcbiAgICB0b3VybmV5OiB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRzdG9yZS5nZXR0ZXJzLkRFVEFJTDtcclxuICAgICAgfSxcclxuICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdTRVRfRVZFTlRERVRBSUwnLCBuZXdWYWwpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXkudGl0bGUsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzLiBQbGVhc2UgcmVmcmVzaCB0byB0cnkgYWdhaW4gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0RGV0YWlsO1xyXG4iLCJsZXQgbWFwR2V0dGVycyA9IFZ1ZXgubWFwR2V0dGVycztcclxuLy8gbGV0IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydDtcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxubGV0IHNjckxpc3QgPSBWdWUuY29tcG9uZW50KCdzY3JMaXN0Jywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzcz1cImJlYmFzIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT4gVG91cm5hbWVudHNcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWFyb3VuZFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXIgbXktNCBteC0xXCIgdGl0bGU9XCJBbGwgdG91cm5leXNcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInRhZ2J1dHRvbiBidG4gYnRuLWxpZ2h0XCIgQGNsaWNrPVwiZmV0Y2hMaXN0KGN1cnJlbnRQYWdlKVwiIDpjbGFzcz1cInsnYWN0aXZlJzowID09PSBhY3RpdmVMaXN0fVwiPiBBbGwgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1kYXJrXCI+XHJcbiAgICAgICAgICAgICAge3t0b3RhbF90b3VybmV5c319IDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgdi1mb3I9XCJjYXQgaW4gY2F0ZWdvcmllc1wiICA6a2V5PVwiY2F0LmlkXCJcclxuICAgICAgICAgICAgY2xhc3M9XCJ0ZXh0LWNlbnRlciBteS00IG14LTFcIiB2LWlmPVwiY2F0LmNvdW50PjBcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBAY2xpY2s9XCJmaWx0ZXJDYXQoY2F0LmlkKVwiIGNsYXNzPVwiICB0YWdidXR0b24gYnRuXCIgOmNsYXNzPVwie1xyXG4gICAgICAgICAgICAgICdidG4tbGlnaHQnOmNhdC5zbHVnID09PSAnZ2VuZXJhbCcsXHJcbiAgICAgICAgICAgICAgJ2J0bi1saWdodCc6Y2F0LnNsdWcgPT09ICdvcGVuJyxcclxuICAgICAgICAgICAgICAnYnRuLWxpZ2h0JzpjYXQuc2x1ZyA9PT0gJ2ludGVybWVkaWF0ZScsXHJcbiAgICAgICAgICAgICAgJ2J0bi1saWdodCc6Y2F0LnNsdWcgPT09ICdtYXN0ZXJzJyxcclxuICAgICAgICAgICAgICAnYnRuLWxpZ2h0JzpjYXQuc2x1ZyA9PT0gJ2xhZGllcycsXHJcbiAgICAgICAgICAgICAgJ2J0bi1saWdodCc6Y2F0LnNsdWcgPT09ICd2ZXRlcmFucycsXHJcbiAgICAgICAgICAgICAgJ2FjdGl2ZSc6Y2F0LmlkID09PSBhY3RpdmVMaXN0LFxyXG4gICAgICAgICAgICAgIH1cIj4ge3tjYXQubmFtZX19IDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZGFya1wiPiB7e2NhdC5jb3VudH19IDwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LXN0YXJ0IGFsaWduLWNvbnRlbnRzLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC1sZy1yb3cganVzdGlmeS1jb250ZW50LWFyb3VuZCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGItcGFnaW5hdGlvbiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+PHNtYWxsPllvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXMuIFRoZXJlIGFyZSA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPiB0b3RhbCA8ZW0+e3thY3RpdmVDYXR9fTwvZW0+IHRvdXJuYW1lbnRzITwvc21hbGw+PC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCIgdi1mb3I9XCJpdGVtIGluIHRvdXJuZXlzXCIgOmtleT1cIml0ZW0uaWRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnQgdG91cm5leS1saXN0IGFuaW1hdGVkIGJvdW5jZUluTGVmdFwiID5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibXItbGctNVwiPlxyXG4gICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgIDxiLWltZyBmbHVpZCB0aHVtYm5haWwgcm91bmRlZD1cImNpcmNsZVwiIGNsYXNzPVwibG9nb1wiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwiaXRlbS5ldmVudF9sb2dvXCI6YWx0PVwiaXRlbS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLWF1dG9cIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cIm1iLTFcIj5cclxuICAgICAgICAgIDxyb3V0ZXItbGluayB2LWlmPVwiaXRlbS5zbHVnXCIgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgICAgIHt7aXRlbS50aXRsZX19XHJcbiAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgPC9oND5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgIDxzbWFsbD48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICB7e2l0ZW0uc3RhcnRfZGF0ZX19XHJcbiAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgPHNtYWxsPjxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT5cclxuICAgICAgICAgICAgICAgIHt7aXRlbS52ZW51ZX19XHJcbiAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICA8cm91dGVyLWxpbmsgdi1pZj1cIml0ZW0uc2x1Z1wiIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgIDxzbWFsbCB0aXRsZT1cIkJyb3dzZSB0b3VybmV5XCI+PGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGxpc3QtaW5saW5lIHRleHQtY2VudGVyIGNhdGVnb3J5LWxpc3RcIj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBteC0xXCJcclxuICAgICAgICAgICAgdi1mb3I9XCJjYXRlZ29yeSBpbiBpdGVtLnRvdV9jYXRlZ29yaWVzXCI+e3tjYXRlZ29yeS5jYXRfbmFtZX19PC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1zdGFydCBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiPlxyXG4gICAgICAgICAgPGItcGFnaW5hdGlvbiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIC8+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cInRleHQtbXV0ZWRcIj48c21hbGw+WW91IGFyZSBvbiBwYWdlIHt7Y3VycmVudFBhZ2V9fSBvZiB7e1dQcGFnZXN9fSBwYWdlcy4gVGhlcmUgYXJlIDxzcGFuIGNsYXNzPVwiZW1waGFzaXplXCI+e3tXUHRvdGFsfX08L3NwYW4+IHRvdGFsIDxlbT57e2FjdGl2ZUNhdH19PC9lbT4gdG91cm5hbWVudHMhPC9zbWFsbD48L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIGFjdGl2ZUxpc3Q6IDAsXHJcbiAgICAgIGFjdGl2ZUNhdDogJ2FsbCcsXHJcbiAgICB9O1xyXG4gICAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdC5qcyBsb2FkZWQnKVxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnU2NyYWJibGUgVG91cm5hbWVudHMgLSBOU0YnO1xyXG4gICAgdGhpcy5mZXRjaExpc3QodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaExpc3Q6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2VOdW07XHJcbiAgICAgIGxldCBwYXJhbXMgPSB7fTtcclxuICAgICAgcGFyYW1zLnBhZ2UgPSBwYWdlTnVtO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFyYW1zKTtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0NBVEVHT1JJRVMnKTtcclxuICAgICAgY29uc29sZS5sb2coJ2RvbmUhJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYWN0aXZlTGlzdCwgdGhpcy5hY3RpdmVDYXQpO1xyXG4gICAgfSxcclxuICAgIGZpbHRlckNhdDogZnVuY3Rpb24oY2F0X2lkKXtcclxuICAgICAgdGhpcy5hY3RpdmVMaXN0ID0gY2F0X2lkO1xyXG4gICAgICBsZXQgYSA9IHRoaXMuY2F0ZWdvcmllcy5maWx0ZXIoYyA9PiBjLmlkID09IGNhdF9pZCk7XHJcbiAgICAgIHRoaXMuYWN0aXZlQ2F0ID0gYVswXS5uYW1lO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmFjdGl2ZUxpc3QsIHRoaXMuYWN0aXZlQ2F0KTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHt9O1xyXG4gICAgICBwYXJhbXMucGFnZSA9IDE7XHJcbiAgICAgIHBhcmFtcy5jYXRlZ29yeSA9IGNhdF9pZCA7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9BUEknLCBwYXJhbXMpO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQ0FURUdPUklFUycpO1xyXG4gICAgfVxyXG5cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5tYXBHZXR0ZXJzKHtcclxuICAgICAgY2F0ZWdvcmllczogJ0NBVEVHT1JJRVNfQ09VTlQnLFxyXG4gICAgICB0b3VybmV5czogJ1RPVUFQSScsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIFdQdG90YWw6ICdXUFRPVEFMJyxcclxuICAgICAgV1BwYWdlczogJ1dQUEFHRVMnLFxyXG4gICAgfSksXHJcbiAgICB0b3RhbF90b3VybmV5czogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgIGxldCBjID0gdGhpcy5jYXRlZ29yaWVzO1xyXG4gICAgICAgbGV0IHQgPSBjLnJlZHVjZSgodG90YWwsIGNhdCkgPT5cclxuICAgICAgICB0b3RhbCArIGNhdC5jb3VudCwgMCk7XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9LFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFNvcnJ5IHdlIGFyZSBjdXJyZW50bHkgaGF2aW5nIHRyb3VibGUgZmluZGluZyB0aGUgbGlzdCBvZiB0b3VybmFtZW50cy5gO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHNjckxpc3Q7IiwidmFyIHBsYXllcl9taXhlZF9zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3Jhbmtfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzID0gW10gIDtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnID0ge1xyXG4gIHBsb3RPcHRpb25zOiB7XHJcbiAgICByYWRpYWxCYXI6IHtcclxuICAgICAgaG9sbG93OiB7IHNpemU6ICc1MCUnLCB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG59O1xyXG5cclxudmFyIHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBjaGFydDoge1xyXG4gICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB6b29tOiB7XHJcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgc2hhZG93OiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHRvcDogMTgsXHJcbiAgICAgIGxlZnQ6IDcsXHJcbiAgICAgIGJsdXI6IDEwLFxyXG4gICAgICBvcGFjaXR5OiAxXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbJyM3N0I2RUEnLCAnIzU0NTQ1NCddLFxyXG4gIGRhdGFMYWJlbHM6IHtcclxuICAgIGVuYWJsZWQ6IHRydWVcclxuICB9LFxyXG4gIHN0cm9rZToge1xyXG4gICAgY3VydmU6ICdzbW9vdGgnIC8vIHN0cmFpZ2h0XHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgdGV4dDogJycsXHJcbiAgICBhbGlnbjogJ2xlZnQnXHJcbiAgfSxcclxuICBncmlkOiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgcm93OiB7XHJcbiAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICBvcGFjaXR5OiAwLjVcclxuICAgIH0sXHJcbiAgfSxcclxuICB4YXhpczoge1xyXG4gICAgY2F0ZWdvcmllczogW10sXHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgeWF4aXM6IHtcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgbWluOiBudWxsLFxyXG4gICAgbWF4OiBudWxsXHJcbiAgfSxcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgb2Zmc2V0WDogLTVcclxuICB9XHJcbn07XHJcblxyXG52YXIgUGxheWVyU3RhdHMgPSBWdWUuY29tcG9uZW50KCdwbGF5ZXJzdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluTGVmdEJpZ1wiIGlkPVwicGhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXNcIj57e3BsYXllck5hbWV9fVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBpbWctZmx1aWQgbXgtMyBkLWJsb2NrIHNoYWRvdy1zbVwiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwicGxheWVyLnBob3RvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgeWFub25lIG14LTNcIj57e3BzdGF0cy5wUG9zaXRpb259fSBwb3NpdGlvbjwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+IDwhLS0gI3BoZWFkZXItLT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UxIGNsYXNzPVwibS0xXCI+UXVpY2sgU3RhdHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UyIGNsYXNzPVwibS0xXCI+Um91bmQgYnkgUm91bmQgPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMyBjbGFzcz1cIm0tMVwiPkNoYXJ0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDbG9zZVwiIHNpemU9XCJzbVwiIEBjbGljaz1cImNsb3NlQ2FyZCgpXCIgY2xhc3M9XCJtLTFcIiB2YXJpYW50PVwib3V0bGluZS1kYW5nZXJcIiA6ZGlzYWJsZWQ9XCIhc2hvd1wiXHJcbiAgICAgICAgICAgIDpwcmVzc2VkLnN5bmM9XCJzaG93XCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTFcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlF1aWNrIFN0YXRzPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaCBzdGF0c1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlBvaW50czpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBQb2ludHN9fSAvIHt7dG90YWxfcm91bmRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5SYW5rOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFJhbmt9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5IaWdoZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEhpU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wSGlTY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBMb1Njb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBPcHAgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlT3BwfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tLS0gUm91bmQgQnkgUm91bmQgUmVzdWx0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMlwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgIDxoND5Sb3VuZCBCeSBSb3VuZCBTdW1tYXJ5IDwvaDQ+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaFwiIHYtZm9yPVwiKHJlcG9ydCwgaSkgaW4gcHN0YXRzLnBSYnlSXCIgOmtleT1cImlcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtaWY9XCJyZXBvcnQucmVzdWx0PT0nd2luJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2RyYXcnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS13YXJuaW5nXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdsb3NzJ1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tZGFuZ2VyXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdhd2FpdGluZydcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1saWdodFwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tIENoYXJ0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlM1wiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkRvd25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+U3RhdHMgQ2hhcnRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdtaXhlZCcpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiXHJcbiAgICAgICAgICAgICAgICAgICA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIj48aSBjbGFzcz1cImZhcyBmYS1maWxlLWNzdlwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBNaXhlZCBTY29yZXM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdyYW5rJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3JhbmsnXCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtbGluZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBSYW5rIHBlciBSZDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ3dpbnMnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nd2lucydcIj48aSBjbGFzcz1cImZhcyBmYS1iYWxhbmNlLXNjYWxlIGZhLXN0YWNrXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFN0YXJ0cy9SZXBsaWVzIFdpbnMoJSk8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXJ0XCI+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiIHR5cGU9bGluZSBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zXCIgICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc01peGVkXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0ncmFuaydcIiB0eXBlPSdsaW5lJyBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zUmFua1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzUmFua1wiIC8+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgdHlwZT1yYWRpYWxCYXIgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0UmFkaWFsXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYWRpYWxcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHByb3BzOiBbJ3BzdGF0cyddLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGFwZXhjaGFydDogVnVlQXBleENoYXJ0cyxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBsYXllcjogJycsXHJcbiAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgIHBsYXllck5hbWU6ICcnLFxyXG4gICAgICBhbGxTY29yZXM6IFtdLFxyXG4gICAgICBhbGxPcHBTY29yZXM6IFtdLFxyXG4gICAgICBhbGxSYW5rczogW10sXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICAgIGNoYXJ0TW9kZWw6ICdyYW5rJyxcclxuICAgICAgc2VyaWVzTWl4ZWQ6IHBsYXllcl9taXhlZF9zZXJpZXMsXHJcbiAgICAgIHNlcmllc1Jhbms6IHBsYXllcl9yYW5rX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFkaWFsOiBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyxcclxuICAgICAgY2hhcnRPcHRSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnLFxyXG4gICAgICBjaGFydE9wdGlvbnNSYW5rOiBwbGF5ZXJfcmFua19jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uczoge1xyXG4gICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcclxuICAgICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzaGFkb3c6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDAwJyxcclxuICAgICAgICAgICAgdG9wOiAxOCxcclxuICAgICAgICAgICAgbGVmdDogNyxcclxuICAgICAgICAgICAgYmx1cjogMTAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yczogWycjOEZCQzhGJywgJyM1NDU0NTQnXSxcclxuICAgICAgICBkYXRhTGFiZWxzOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgIGN1cnZlOiAnc3RyYWlnaHQnIC8vIHNtb290aFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgYWxpZ246ICdsZWZ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgICAgICAgIHJvdzoge1xyXG4gICAgICAgICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeGF4aXM6IHtcclxuICAgICAgICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1pbjogbnVsbCxcclxuICAgICAgICAgIG1heDogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICAgICAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgICAgICAgIG9mZnNldFk6IC0yNSxcclxuICAgICAgICAgIG9mZnNldFg6IC01XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRvU2Nyb2xsKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvd1N0YXRzO1xyXG4gICAgdGhpcy5hbGxTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsT3BwU2NvcmVzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbE9wcFNjb3Jlcyk7XHJcbiAgICB0aGlzLmFsbFJhbmtzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbFJhbmtzKTtcclxuICAgIHRoaXMudXBkYXRlQ2hhcnQodGhpcy5jaGFydE1vZGVsKTtcclxuICAgIHRoaXMudG90YWxfcGxheWVycyA9IHRoaXMucGxheWVycy5sZW5ndGg7XHJcbiAgICB0aGlzLnBsYXllciA9IHRoaXMucHN0YXRzLnBsYXllclswXTtcclxuICAgIHRoaXMucGxheWVyTmFtZSA9IHRoaXMucGxheWVyLnBvc3RfdGl0bGU7XHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95KCkge1xyXG4gICAgdGhpcy5jbG9zZUNhcmQoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuXHJcbiAgICBkb1Njcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxyXG4gICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtteUZ1bmN0aW9uKCl9O1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhlYWRlclwiKTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcclxuICAgICAgdmFyIHN0aWNreSA9IGhlYWRlci5vZmZzZXRUb3A7XHJcbiAgICAgIHZhciBoID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDUwO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IChzdGlja3kgKyBoKSkge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBzZXRDaGFydENhdGVnb3JpZXM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCByb3VuZHMgPSBfLnJhbmdlKDEsIHRoaXMudG90YWxfcm91bmRzICsgMSk7XHJcbiAgICAgIGxldCByZHMgPSBfLm1hcChyb3VuZHMsIGZ1bmN0aW9uKG51bSl7IHJldHVybiAnUmQgJysgbnVtOyB9KTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMueGF4aXMuY2F0ZWdvcmllcyA9IHJkcztcclxuICAgIH0sXHJcbiAgICB1cGRhdGVDaGFydDogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLVVwZGF0aW5nLi4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLmNoYXJ0TW9kZWwgPSB0eXBlO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS5hbGlnbiA9ICdsZWZ0JztcclxuICAgICAgdmFyIGZpcnN0TmFtZSA9IF8udHJpbShfLnNwbGl0KHRoaXMucGxheWVyTmFtZSwgJyAnLCAyKVswXSk7XHJcbiAgICAgIGlmICgncmFuaycgPT0gdHlwZSkge1xyXG4gICAgICAgIC8vIHRoaXMuID0gJ2Jhcic7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnRpdGxlLnRleHQgPWBSYW5raW5nOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5taW4gPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5tYXggPXRoaXMudG90YWxfcGxheWVycztcclxuICAgICAgICB0aGlzLnNlcmllc1JhbmsgPSBbe1xyXG4gICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfSByYW5rIHRoaXMgcmRgLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxSYW5rc1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCdtaXhlZCcgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2hhcnRDYXRlZ29yaWVzKClcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS50ZXh0ID0gYFNjb3JlczogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5taW4gPSAxMDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWF4ID0gOTAwO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzTWl4ZWQgPSBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX1gLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmFsbFNjb3Jlc1xyXG4gICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnT3Bwb25lbnQnLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxPcHBTY29yZXNcclxuICAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ3dpbnMnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscz0gW107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMgPVtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzLnVuc2hpZnQoJ1N0YXJ0czogJSBXaW5zJywnUmVwbGllczogJSBXaW5zJyk7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMudW5zaGlmdCgnIzdDRkMwMCcsICcjQkRCNzZCJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGFydE9wdFJhZGlhbCk7XHJcbiAgICAgICAgdmFyIHMgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5zdGFydFdpbnMgLyB0aGlzLnBzdGF0cy5zdGFydHMpLDEpO1xyXG4gICAgICAgIHZhciByID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMucmVwbHlXaW5zIC8gdGhpcy5wc3RhdHMucmVwbGllcyksMSk7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwgPSBbXTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbC51bnNoaWZ0KHMscik7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZXJpZXNSYWRpYWwpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgY2xvc2VDYXJkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLUNsb3NpbmcgQ2FyZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsIGZhbHNlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHNob3dTdGF0czogJ1NIT1dTVEFUUycsXHJcbiAgICB9KSxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG52YXIgUGxheWVyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ2FsbHBsYXllcnMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dTdGF0c1wiPlxyXG4gICAgICAgIDxwbGF5ZXJzdGF0cyA6cHN0YXRzPVwicFN0YXRzXCI+PC9wbGF5ZXJzdGF0cz5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgPGRpdiBpZD1cInAtbGlzdFwiIGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICA8dHJhbnNpdGlvbi1ncm91cCB0YWc9XCJkaXZcIiBuYW1lPVwicGxheWVycy1saXN0XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGxheWVyQ29scyBteC0yIHAtMiBtYi00XCIgdi1mb3I9XCJwbGF5ZXIgaW4gZGF0YVwiIDprZXk9XCJwbGF5ZXIuaWRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCI+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm9zd2FsZFwiPjxzbWFsbD4je3twbGF5ZXIucG5vfX08L3NtYWxsPlxyXG4gICAgICAgICAgICB7e3BsYXllci5wbGF5ZXJ9fTxzcGFuIGNsYXNzPVwibWwtMlwiIEBjbGljaz1cInNvcnRQb3MoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSB2LWlmPVwiYXNjXCIgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBERVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48aSB2LWVsc2UgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtdXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHNvcnQgQVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48L3NwYW4+PHNwYW4gdi1pZj1cInNvcnRlZFwiIGNsYXNzPVwibWwtM1wiIEBjbGljaz1cInJlc3RvcmVTb3J0KClcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC1zaXplOjAuOGVtXCI+PGkgY2xhc3M9XCJmYSBmYS11bmRvXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byByZXNldCBsaXN0XCI+PC9pPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG8gbXktMVwiICBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm14LWF1dG8gZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCIgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PSAnbScsXHJcbiAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLFxyXG4gICAgICAgICdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImNvbG9yOnRvbWF0bzsgZm9udC1zaXplOjEuNGVtXCIgY2xhc3M9XCJtbC01XCIgdi1pZj1cInNvcnRlZFwiPnt7cGxheWVyLnBvc2l0aW9ufX08L3NwYW4+XHJcbiAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWJsb2NrIHRleHQtY2VudGVyIGFuaW1hdGVkIGZhZGVJbiBwZ2FsbGVyeVwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgbXQtMiBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gQGNsaWNrPVwic2hvd1BsYXllclN0YXRzKHBsYXllci5pZClcIiB0aXRsZT1cIlNob3cgIHN0YXRzXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYmFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1sLTRcIiB0aXRsZT1cIlNob3cgU2NvcmVjYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayBleGFjdCA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzpwbGF5ZXIucG5vfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8IS0tLXBvcG92ZXIgLS0+XHJcbiAgICAgICAgICAgICAgPGItcG9wb3ZlciBAc2hvdz1cImdldExhc3RHYW1lcyhwbGF5ZXIucG5vKVwiIHBsYWNlbWVudD1cImJvdHRvbVwiICA6dGFyZ2V0PVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIiB0cmlnZ2Vycz1cImhvdmVyXCIgYm91bmRhcnktcGFkZGluZz1cIjVcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC13cmFwIGFsaWduLWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1zdGFydCBtci0yIGp1c3RpZnktY29udGVudC1hcm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LWdyb3ctMSBhbGlnbi1zZWxmLWNlbnRlclwiIHN0eWxlPVwiZm9udC1zaXplOjEuNWVtO1wiPnt7bXN0YXQucG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LXNocmluay0xIGQtaW5saW5lLWJsb2NrIHRleHQtbXV0ZWRcIj48c21hbGw+e3ttc3RhdC53aW5zfX0te3ttc3RhdC5kcmF3c319LXt7bXN0YXQubG9zc2VzfX08L3NtYWxsPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5IGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC44ZW07IHRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmVcIj5MYXN0IEdhbWU6IFJvdW5kIHt7bXN0YXQucm91bmR9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMSB0ZXh0LXdoaXRlIHNkYXRhLXJlcyB0ZXh0LWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBtc3RhdC5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2F3YWl0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogbXN0YXQucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBtc3RhdC5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7e21zdGF0LnNjb3JlfX0te3ttc3RhdC5vcHBvX3Njb3JlfX0gKHt7bXN0YXQucmVzdWx0fGZpcnN0Y2hhcn19KVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cIm1zdGF0Lm9wcF9waG90b1wiIDphbHQ9XCJtc3RhdC5vcHBvXCIgY2xhc3M9XCJyb3VuZGVkLWNpcmNsZSBtLWF1dG8gZC1pbmxpbmUtYmxvY2tcIiB3aWR0aD1cIjI1XCIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZS1ibG9ja1wiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+PHNtYWxsPiN7e21zdGF0Lm9wcG9fbm99fSB7e21zdGF0Lm9wcG98YWJicnZ9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9iLXBvcG92ZXI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC90cmFuc2l0aW9uLWdyb3VwPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIHBsYXllcnN0YXRzOiBQbGF5ZXJTdGF0cyxcclxuICB9LFxyXG4gIHByb3BzOiBbJ3NsdWcnXSxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwU3RhdHM6IHt9LFxyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgICBibG9jazogdHJ1ZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICc3MHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICc3MHB4JyxcclxuICAgICAgICBzdHlsZTogJ2N1cnNvcjogcG9pbnRlcicsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgICBkYXRhRmxhdDoge30sXHJcbiAgICAgIG1zdGF0OiB7fSxcclxuICAgICAgZGF0YToge30sXHJcbiAgICAgIHNvcnRlZDogZmFsc2UsXHJcbiAgICAgIGFzYzogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHJlc3VsdGRhdGEgPSB0aGlzLnJlc3VsdF9kYXRhO1xyXG4gICAgdGhpcy5kYXRhRmxhdCA9IF8uZmxhdHRlbkRlZXAoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICB0aGlzLmRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1EQVRBLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldExhc3RHYW1lczogZnVuY3Rpb24gKHRvdV9ubykge1xyXG4gICAgICBjb25zb2xlLmxvZyh0b3Vfbm8pXHJcbiAgICAgIGxldCBjID0gXy5jbG9uZSh0aGlzLmRhdGFGbGF0KTtcclxuICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oYylcclxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICByZXR1cm4gdi5wbm8gPT09IHRvdV9ubztcclxuICAgICAgICB9KS50YWtlUmlnaHQoKS52YWx1ZSgpO1xyXG4gICAgICB0aGlzLm1zdGF0ID0gXy5maXJzdChyZXMpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1zdGF0KVxyXG4gICAgfSxcclxuICAgIHNvcnRQb3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFzYyA9ICF0aGlzLmFzYztcclxuICAgICAgY29uc29sZS5sb2coJ1NvcnRpbmcuLicpO1xyXG4gICAgICBsZXQgc29ydERpciA9ICdhc2MnO1xyXG4gICAgICBpZiAoZmFsc2UgPT0gdGhpcy5hc2MpIHtcclxuICAgICAgICBzb3J0RGlyID0gJ2Rlc2MnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0ZWQgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncmFuaycsIHNvcnREaXIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzb3J0ZWQpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBzb3J0ZWQ7XHJcbiAgICB9LFxyXG4gICAgcmVzdG9yZVNvcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hc2MgPSB0cnVlO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncG5vJywgJ2FzYycpO1xyXG4gICAgfSxcclxuICAgIHNob3dQbGF5ZXJTdGF0czogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnQ09NUFVURV9QTEFZRVJfU1RBVFMnLCBpZCk7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBsYXllciA9IHRoaXMucGxheWVyO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlT3BwID0gdGhpcy5sYXN0ZGF0YS5hdmVfb3BwX3Njb3JlO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlID0gdGhpcy5sYXN0ZGF0YS5hdmVfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYW5rID0gdGhpcy5sYXN0ZGF0YS5yYW5rO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9zaXRpb24gPSB0aGlzLmxhc3RkYXRhLnBvc2l0aW9uO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9pbnRzID0gdGhpcy5sYXN0ZGF0YS5wb2ludHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaU9wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb09wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFJhbmtzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsUmFua3M7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFNjb3JlcyA9IHRoaXMucGxheWVyX3N0YXRzLmFsbFNjb3JlcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsT3BwU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUmJ5UiA9IHRoaXMucGxheWVyX3N0YXRzLnBSYnlSO1xyXG4gICAgICB0aGlzLnBTdGF0cy5zdGFydFdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5zdGFydFdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0cyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0cztcclxuICAgICAgdGhpcy5wU3RhdHMucmVwbHlXaW5zID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBsaWVzID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbGllcztcclxuXHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgcmVzdWx0X2RhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiAnVE9UQUxQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgc2hvd1N0YXRzOiAnU0hPV1NUQVRTJyxcclxuICAgICAgbGFzdGRhdGE6ICdMQVNUUkREQVRBJyxcclxuICAgICAgcGxheWVyZGF0YTogJ1BMQVlFUkRBVEEnLFxyXG4gICAgICBwbGF5ZXI6ICdQTEFZRVInLFxyXG4gICAgICBwbGF5ZXJfc3RhdHM6ICdQTEFZRVJfU1RBVFMnXHJcbiAgICB9KSxcclxuXHJcbiAgfVxyXG59KTtcclxuXHJcbiB2YXIgUmVzdWx0cyA9IFZ1ZS5jb21wb25lbnQoJ3Jlc3VsdHMnLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSBob3ZlciBzdGFja2VkPVwic21cIiBzdHJpcGVkIGZvb3QtY2xvbmUgOmZpZWxkcz1cInJlc3VsdHNfZmllbGRzXCIgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCIgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3VsdHNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVzdWx0c19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGxhYmVsOiAnIycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgLy8geyBrZXk6ICdwb3NpdGlvbicsbGFiZWw6ICdQb3NpdGlvbicsJ2NsYXNzJzondGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1Njb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdPcHBvbmVudCcgfSxcclxuICAgICAgLy8geyBrZXk6ICdvcHBfcG9zaXRpb24nLCBsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOiAndGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcHBvX3Njb3JlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdkaWZmJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJy0nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdDogZnVuY3Rpb24ocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YVtyb3VuZF0pO1xyXG5cclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3cucG9zaXRpb247XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHIucmVzdWx0O1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXSA9IFtdO1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbnZhciBTdGFuZGluZ3MgPSBWdWUuY29tcG9uZW50KCdzdGFuZGluZ3MnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBzdGFja2VkPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiA6ZmllbGRzPVwic3RhbmRpbmdzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicmFua1wiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5yYW5rfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwbGF5ZXJcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucGxheWVyfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ3b25Mb3N0XCI+PC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJtYXJnaW5cIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUubWFyZ2lufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJsYXN0R2FtZVwiPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhbmRpbmdzX2ZpZWxkczogW10sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzI1cHgnLFxyXG4gICAgICAgIGhlaWdodDogJzI1cHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc3RhbmRpbmdzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV2luLURyYXctTG9zcycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ud2luc30gLSAke2l0ZW0uZHJhd3N9IC0gJHtpdGVtLmxvc3Nlc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdwb2ludHMnLFxyXG4gICAgICAgIGxhYmVsOiAnUG9pbnRzJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5hciA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSpgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbGFzdEdhbWUnLFxyXG4gICAgICAgIGxhYmVsOiAnTGFzdCBHYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBpdGVtLnNjb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5vcHBvX3Njb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5yZXN1bHQgPT0gJ2F3YWl0aW5nJ1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgQXdhaXRpbmcgcmVzdWx0IG9mIGdhbWUgJHtpdGVtLnJvdW5kfSB2cyAke2l0ZW0ub3Bwb31gO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBgYSAke2l0ZW0uc2NvcmV9LSR7aXRlbS5vcHBvX3Njb3JlfVxyXG4gICAgICAgICAgICAke2l0ZW0ucmVzdWx0LnRvVXBwZXJDYXNlKCl9IHZzICR7aXRlbS5vcHBvfSBgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0KHIpIHtcclxuICAgICAgbGV0IHJvdW5kID0gciAtIDE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGFbcm91bmRdKTtcclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3dbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJbJ3Jlc3VsdCddO1xyXG5cclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ10gPSBbXTtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2luZm8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5zb3J0QnkoJ21hcmdpbicpXHJcbiAgICAgICAgLnNvcnRCeSgncG9pbnRzJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgUGFpcmluZ3MgPVZ1ZS5jb21wb25lbnQoJ3BhaXJpbmdzJywgIHtcclxuICB0ZW1wbGF0ZTogYFxyXG48dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1yZXNwb25zaXZlIHRhYmxlLXN0cmlwZWQgIGFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICA8Y2FwdGlvbj57e2NhcHRpb259fTwvY2FwdGlvbj5cclxuICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWRhcmtcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+UGxheWVyPC90aD5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5PcHBvbmVudDwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGhlYWQ+XHJcbiAgICA8dGJvZHk+XHJcbiAgICAgICAgPHRyIHYtZm9yPVwiKHBsYXllcixpKSBpbiBwYWlyaW5nKGN1cnJlbnRSb3VuZClcIiA6a2V5PVwiaVwiPlxyXG4gICAgICAgIDx0aCBzY29wZT1cInJvd1wiPnt7aSArIDF9fTwvdGg+XHJcbiAgICAgICAgPHRkIDppZD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIj48L2ItaW1nLWxhenk+PHN1cCB2LWlmPVwicGxheWVyLnN0YXJ0ID09J3knXCI+Kjwvc3VwPnt7cGxheWVyLnBsYXllcn19PC90ZD5cclxuICAgICAgICA8dGQgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIub3BwX2lkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLm9wcG9cIiA6c3JjPVwicGxheWVyLm9wcF9waG90b1wiPjwvYi1pbWctbGF6eT48c3VwICB2LWlmPVwicGxheWVyLnN0YXJ0ID09J24nXCI+Kjwvc3VwPnt7cGxheWVyLm9wcG99fTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGJvZHk+XHJcbiAgPC90YWJsZT5cclxuYCxcclxuXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICBzdHlsZTonbWFyZ2luLXJpZ2h0Oi41ZW0nLFxyXG4gICAgICAgIHdpZHRoOiAnMjVweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMjVweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLy8gZ2V0IHBhaXJpbmdcclxuICAgIHBhaXJpbmcocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IHJvdW5kX3JlcyA9IHRoaXMucmVzdWx0ZGF0YVtyb3VuZF07XHJcbiAgICAgIC8vIFNvcnQgYnkgcGxheWVyIG51bWJlcmluZyBpZiByb3VuZCAxIHRvIG9idGFpbiByb3VuZCAxIHBhaXJpbmdcclxuICAgICAgaWYgKHIgPT09IDEpIHtcclxuICAgICAgICByb3VuZF9yZXMgPSBfLnNvcnRCeShyb3VuZF9yZXMsICdwbm8nKTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgcGFpcmVkX3BsYXllcnMgPSBbXTtcclxuICAgICAgbGV0IHJwID0gXy5tYXAocm91bmRfcmVzLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IHJbJ3BubyddO1xyXG4gICAgICAgIGxldCBvcHBvbmVudCA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICBpZiAoXy5pbmNsdWRlcyhwYWlyZWRfcGxheWVycywgcGxheWVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgcGFpcmVkX3BsYXllcnMucHVzaChvcHBvbmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jb21wYWN0KHJwKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQge1BhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHN9XHJcblxyXG4iLCJleHBvcnQgeyBTdGF0c1Byb2ZpbGUgYXMgZGVmYXVsdCB9O1xyXG5sZXQgU3RhdHNQcm9maWxlID0gVnVlLmNvbXBvbmVudCgnc3RhdHNfcHJvZmlsZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICA8ZGl2IGNsYXNzPVwiY29sLTEwIG9mZnNldC0xIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXc9J3Byb2ZpbGUnXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3ID09PSdwcm9maWxlJ1wiIDpwcmVzc2VkPVwidmlldyA9PT0ncHJvZmlsZSdcIiB0aXRsZT1cIlBsYXllciBQcm9maWxlXCI+XHJcbiAgICAgICAgPGItaWNvbiBpY29uPVwicGVyc29uXCI+PC9iLWljb24+UHJvZmlsZTwvYi1idXR0b24+XHJcbiAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXc9J2hlYWQyaGVhZCdcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXcgPT09J2hlYWQyaGVhZCdcIiA6cHJlc3NlZD1cInZpZXcgPT09J2hlYWQyaGVhZCdcIiB0aXRsZT1cIkhlYWQgVG8gSGVhZFwiPlxyXG4gICAgICAgIDxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+SDJIPC9iLWJ1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8aDMgdi1pZj1cInZpZXcgPT09J3Byb2ZpbGUnXCIgY2xhc3M9XCJiZWJhcyBtYi0yXCI+XHJcbiAgICA8Yi1pY29uIGljb249XCJwZXJzb25cIj48L2ItaWNvbj4gU3RhdHMgUHJvZmlsZTwvaDM+XHJcbiAgICA8aDMgY2xhc3M9XCJtYi0yIGJlYmFzXCIgdi1pZj1cInZpZXcgPT09J2hlYWQyaGVhZCdcIj5cclxuICAgIDxiLWljb24gaWNvbj1cInBlb3BsZS1maWxsXCI+PC9iLWljb24+IEhlYWQgdG8gSGVhZDwvaDM+XHJcblxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3ID09PSdwcm9maWxlJ1wiPlxyXG4gICAgICA8ZGl2IHYtaWY9XCJ2aWV3ID09PSdwcm9maWxlJyAmJiAoYWxsX3BsYXllcnMubGVuZ3RoIDw9MClcIiBjbGFzcz1cIm15LTUgbXgtYXV0byBkLWZsZXggZmxleC1yb3cgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLXNwaW5uZXIgdmFyaWFudD1cInByaW1hcnlcIiBzdHlsZT1cIndpZHRoOiA2cmVtOyBoZWlnaHQ6IDZyZW07XCIgbGFiZWw9XCJMb2FkaW5nIHBsYXllcnNcIj48L2Itc3Bpbm5lcj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwibXktNSBteC1hdXRvIHctNzUgZC1tZC1mbGV4IGZsZXgtbWQtcm93IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1yLW1kLTMgbWItc20tMlwiPlxyXG4gICAgICAgICAgPGxhYmVsIGZvcj1cInNlYXJjaFwiPlBsYXllciBuYW1lOjwvbGFiZWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1sLW1kLTIgZmxleC1ncm93LTFcIj5cclxuICAgICAgICAgIDx2dWUtc2ltcGxlLXN1Z2dlc3RcclxuICAgICAgICAgIHYtbW9kZWw9XCJwc2VhcmNoXCJcclxuICAgICAgICAgIGRpc3BsYXktYXR0cmlidXRlPVwicGxheWVyXCJcclxuICAgICAgICAgIHZhbHVlLWF0dHJpYnV0ZT1cInNsdWdcIlxyXG4gICAgICAgICAgQHNlbGVjdD1cImdldHByb2ZpbGVcIlxyXG4gICAgICAgICAgOnN0eWxlcz1cImF1dG9Db21wbGV0ZVN0eWxlXCJcclxuICAgICAgICAgIDpkZXN0eWxlZD10cnVlXHJcbiAgICAgICAgICA6ZmlsdGVyLWJ5LXF1ZXJ5PXRydWVcclxuICAgICAgICAgIDpsaXN0PVwiYWxsX3BsYXllcnNcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJQbGF5ZXIgbmFtZSBoZXJlXCJcclxuICAgICAgICAgIGlkPVwic2VhcmNoXCJcclxuICAgICAgICAgIHR5cGU9XCJzZWFyY2hcIj5cclxuICAgICAgICAgIDwvdnVlLXNpbXBsZS1zdWdnZXN0PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiB2LXNob3c9XCJsb2FkaW5nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LW1kLXJvdy1yZXZlcnNlIG15LTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiIHYtc2hvdz1cInBzZWFyY2ggJiYgIW5vdGZvdW5kXCI+U2VhcmNoaW5nIDxlbT57e3BzZWFyY2h9fTwvZW0+Li4uPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1kYW5nZXJcIiB2LXNob3c9XCJwc2VhcmNoICYmIG5vdGZvdW5kXCI+PGVtPnt7cHNlYXJjaH19PC9lbT4gbm90IGZvdW5kITwvc3Bhbj5cclxuICAgICAgICA8Yi1zcGlubmVyIHYtc2hvdz1cIiFub3Rmb3VuZFwiIHN0eWxlPVwid2lkdGg6IDZyZW07IGhlaWdodDogNnJlbTtcIiB0eXBlPVwiZ3Jvd1wiIHZhcmlhbnQ9XCJzdWNjZXNzXCIgbGFiZWw9XCJCdXN5XCI+PC9iLXNwaW5uZXI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IHYtaWY9XCJwZGF0YS5wbGF5ZXJcIiBjbGFzcz1cInAtMiBteC1hdXRvIGQtbWQtZmxleCBmbGV4LW1kLXJvdyBhbGlnbi1pdGVtcy1zdGFydCBqdXN0aWZ5LWNvbnRlbnQtYXJvdW5kXCI+XHJcbiAgICAgICAgICA8ZGl2IHYtc2hvdz1cInBzZWFyY2ggPT09cGRhdGEucGxheWVyICYmICFub3Rmb3VuZFwiIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIHRleHQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBhbmltYXRlZCBmYWRlSW5cIj5cclxuICAgICAgICAgIDxoND5Qcm9maWxlIFN1bW1hcnk8L2g0PlxyXG4gICAgICAgICAgICA8aDUgY2xhc3M9XCJvc3dhbGRcIj57e3BkYXRhLnBsYXllcn19XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgbXgtYXV0byBwLTJcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJteC1hdXRvIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwZGF0YS5jb3VudHJ5IHxsb3dlcmNhc2VcIiB0aXRsZT1cInBkYXRhLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGRhdGEuZ2VuZGVyID09ICdtJywnZmEtZmVtYWxlJzogcGRhdGEuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwZGF0YS5pc190ZWFtID09ICd5ZXMnIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPGltZyA6c3JjPSdwZGF0YS5waG90bycgOmFsdD1cInBkYXRhLnBsYXllclwiIHYtYmluZD1cImltZ1Byb3BzXCI+PC9pbWc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXVwcGVyY2FzZSB0ZXh0LWxlZnRcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbTtcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVhZCB0ZXh0LWNlbnRlclwiPnt7cGRhdGEudG90YWxfdG91cm5leXMgfCBwbHVyYWxpemUoJ3RvdXJuZXknLHsgaW5jbHVkZU51bWJlcjogdHJ1ZSB9KX19XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgdGV4dC1wcmltYXJ5IGZvbnQtd2VpZ2h0LWxpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgIFRvdXJuZXkgPHNwYW4gY2xhc3M9XCJ0ZXh0LWNhcGl0YWxpemVcIj4oQWxsIFRpbWUpPC9zcGFuPiBIb25vcnM6XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8bGkgdGl0bGU9XCJGaXJzdCBQcml6ZVwiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBnb2xkY29sIGZvbnQtd2VpZ2h0LWJvbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10cm9waHkgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2VcIj57e3RvdXJuZXlfcG9kaXVtcygxKX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGkgdGl0bGU9XCJTZWNvbmQgUHJpemVcIiBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gc2lsdmVyY29sIGZvbnQtd2VpZ2h0LWJvbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10cm9waHkgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYmFkZ2VcIj57e3RvdXJuZXlfcG9kaXVtcygyKX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8bGkgdGl0bGU9XCJUaGlyZCBQcml6ZVwiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBicm9uemVjb2wgZm9udC13ZWlnaHQtYm9sZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJiYWRnZVwiPnt7dG91cm5leV9wb2RpdW1zKDMpfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LWluZm8gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+e3twZGF0YS50b3RhbF9nYW1lcyB8IHBsdXJhbGl6ZSgnZ2FtZScseyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtc3VjY2VzcyBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj57e3BkYXRhLnRvdGFsX3dpbnMgfCBwbHVyYWxpemUoJ3dpbicseyBpbmNsdWRlTnVtYmVyOiB0cnVlIH0pfX0gPGVtPih7e3BkYXRhLnBlcmNlbnRfd2luc319JSk8L2VtPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgdGV4dC13YXJuaW5nIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPiB7e3BkYXRhLnRvdGFsX2RyYXdzIHwgcGx1cmFsaXplKCdkcmF3Jyx7IGluY2x1ZGVOdW1iZXI6IHRydWUgfSl9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgdGV4dC1kYW5nZXIgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+IHt7cGRhdGEudG90YWxfbG9zc2VzIHwgcGx1cmFsaXplKFsnbG9zcycsJ2xvc3NlcyddLHsgaW5jbHVkZU51bWJlcjogdHJ1ZSB9KX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LXByaW1hcnkgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+QXZlIFNjb3JlOiB7e3BkYXRhLmF2ZV9zY29yZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayB0ZXh0LXByaW1hcnkgZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+QXZlIE9wcG9uZW50cyBTY29yZToge3twZGF0YS5hdmVfb3BwX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHRleHQtcHJpbWFyeSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5BdmUgQ3VtLiBNYXI6IHt7cGRhdGEuYXZlX21hcmdpbn19PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtc2hvdz1cIiFsb2FkaW5nXCI+XHJcbiAgICAgICAgICA8aDQgdGl0bGU9XCJQZXJmb3JtYW5jZSBzdW1tYXJ5IHBlciB0b3VybmV5XCI+Q29tcGV0aXRpb25zPC9oND5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtMSBtYi0xIGJnLWxpZ2h0XCIgdi1mb3I9XCIoYywgdGluZGV4KSBpbiBwZGF0YS5jb21wZXRpdGlvbnNcIiA6a2V5PVwiYy5pZFwiPlxyXG4gICAgICAgICAgICAgIDxoNSBjbGFzcz1cIm9zd2FsZCB0ZXh0LWxlZnRcIj57e2MudGl0bGV9fVxyXG4gICAgICAgICAgICAgIDxiLWJhZGdlIHRpdGxlPVwiRmluYWwgUmFua1wiPnt7Yy5maW5hbF9yZC5yYW5rfX08L2ItYmFkZ2U+PC9oNT5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tbGluayB0ZXh0LWRlY29yYXRpb24tbm9uZVwiIHR5cGU9XCJidXR0b25cIiB0aXRsZT1cIkNsaWNrIHRvIHZpZXcgcGxheWVyIHNjb3Jlc2hlZXQgZm9yIHRoaXMgZXZlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTonU2NvcmVzaGVldCcsIHBhcmFtczp7ICBldmVudF9zbHVnOmMuc2x1ZywgcG5vOmMuZmluYWxfcmQucG5vfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGItaWNvbiBpY29uPVwiZG9jdW1lbnRzLWFsdFwiPjwvYi1pY29uPiBTY29yZWNhcmRcclxuICAgICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgdmFyaWFudD1cImxpbmtcIiB2LWItdG9nZ2xlPVwiY29sbGFwc2UrdGluZGV4KzFcIiB0aXRsZT1cIkNsaWNrIHRvIHRvZ2dsZSBwbGF5ZXIgc3RhdHMgZm9yIHRoaXMgZXZlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgPGItaWNvbiBpY29uPVwiYmFyLWNoYXJ0LWZpbGxcIiB2YXJpYW50PVwic3VjY2Vzc1wiIGZsaXAtaD48L2ItaWNvbj5TdGF0aXN0aWNzXHJcbiAgICAgICAgICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDxiLWNvbGxhcHNlIDppZD1cImNvbGxhcHNlK3RpbmRleCsxXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgY2FyZC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGg2IGNsYXNzPVwib3N3YWxkXCI+e3tjLmZpbmFsX3JkLnBsYXllcn19IEV2ZW50IFN0YXRzIFN1bW1hcnk8L2g2PlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFBvaW50czoge3tjLmZpbmFsX3JkLnBvaW50c319L3t7Yy5maW5hbF9yZC5yb3VuZH19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRmluYWwgUG9zOiB7e2MuZmluYWxfcmQucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gdGV4dC1zdWNjZXNzIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBXb246IHt7Yy5maW5hbF9yZC53aW5zfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIHRleHQtd2FybmluZyBmb250LXdlaWdodC1saWdodCB0ZXh0LWNhcGl0YWxpemVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRHJldzoge3tjLmZpbmFsX3JkLmRyYXdzfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIHRleHQtZGFuZ2VyIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBMb3N0OiB7e2MuZmluYWxfcmQubG9zc2VzfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZVwiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdmVyYWdlIFNjb3JlOiB7e2MuZmluYWxfcmQuYXZlX3Njb3JlfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBdmVyYWdlIE9wcC4gU2NvcmU6IHt7Yy5maW5hbF9yZC5hdmVfb3BwX3Njb3JlfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZVwiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb3RhbCBTY29yZToge3tjLmZpbmFsX3JkLnRvdGFsX3Njb3JlfX1cclxuICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0IHRleHQtY2FwaXRhbGl6ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUb3RhbCBPcHAuIFNjb3JlOiB7e2MuZmluYWxfcmQudG90YWxfb3Bwc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gZm9udC13ZWlnaHQtbGlnaHQgdGV4dC1jYXBpdGFsaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hcmdpbjoge3tjLmZpbmFsX3JkLm1hcmdpbn19XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmVcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGxpIDpjbGFzcz1cInsndGV4dC1zdWNjZXNzJzogYy5maW5hbF9yZC5yZXN1bHQgPT0gJ3dpbicsJ3RleHQtd2FybmluZyc6IGMuZmluYWxfcmQucmVzdWx0ID09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LWRhbmdlcic6IGMuZmluYWxfcmQucmVzdWx0ID09ICdsb3NzJ31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIGZvbnQtd2VpZ2h0LWxpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBGaW5hbCBnYW1lIHdhcyBhIHt7Yy5maW5hbF9yZC5zY29yZX19IC0ge3tjLmZpbmFsX3JkLm9wcG9fc2NvcmV9fSB7e2MuZmluYWxfcmQucmVzdWx0fX0gKGEgZGlmZmVyZW5jZSBvZiB7e2MuZmluYWxfcmQuZGlmZnxhZGRwbHVzfX0pIGFnYWluc3Qge3tjLmZpbmFsX3JkLm9wcG99fVxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgPGRpdiBjbGFzcz1cIm15LTUgbXgtYXV0byBkLWZsZXggZmxleC1yb3cgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgPHA+Q29taW5nIFNvb24hPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICA8IS0tIDxiLWZvcm0tcm93IGNsYXNzPVwibXktMVwiPlxyXG4gICAgICAgIDxiLWNvbCBzbT1cIjFcIiBjbGFzcz1cIm1sLXNtLWF1dG9cIj5cclxuICAgICAgICA8bGFiZWwgZm9yPVwic2VhcmNoMVwiPlBsYXllciAxPC9sYWJlbD5cclxuICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgIDxiLWNvbCBzbT1cIjNcIiBjbGFzcz1cIm1yLXNtLWF1dG9cIj5cclxuICAgICAgICA8Yi1mb3JtLWlucHV0IHBsYWNlaG9sZGVyPVwiU3RhcnQgdHlwaW5nIHBsYXllciBuYW1lXCIgc2l6ZT1cInNtXCIgaWQ9XCJzZWFyY2gxXCIgdi1tb2RlbD1cInNlYXJjaDFcIiB0eXBlPVwic2VhcmNoXCI+PC9iLWZvcm0taW5wdXQ+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2wgc209XCIxXCIgY2xhc3M9XCJtbC1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwibWwtMlwiIGZvcj1cInNlYXJjaDJcIj5QbGF5ZXIgMjwvbGFiZWw+XHJcbiAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2wgc209XCIzXCIgY2xhc3M9XCJtci1zbS1hdXRvXCI+XHJcbiAgICAgICAgPGItZm9ybS1pbnB1dCBzaXplPVwic21cIiBwbGFjZWhvbGRlcj1cIlN0YXJ0IHR5cGluZyBwbGF5ZXIgbmFtZVwiIGlkPVwic2VhcmNoMlwiIHYtbW9kZWw9XCJzZWFyY2gyXCIgdHlwZT1cInNlYXJjaFwiPjwvYi1mb3JtLWlucHV0PlxyXG4gICAgICAgIDwvYi1jb2w+XHJcbiAgICAgIDwvYi1mb3JtLXJvdz5cclxuICAgICAgPGItcm93IGNvbHM9XCI0XCI+XHJcbiAgICAgICAgPGItY29sPjwvYi1jb2w+XHJcbiAgICAgICAgPGItY29sPnt7c2VhcmNoMX19PC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2w+PC9iLWNvbD5cclxuICAgICAgICA8Yi1jb2w+e3tzZWFyY2gyfX08L2ItY29sPlxyXG4gICAgICA8L2Itcm93PlxyXG4gICAgICAtLT5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdmlldzogJ3Byb2ZpbGUnLFxyXG4gICAgICAvLyBzaG93VG91U3RhdHM6IGZhbHNlLFxyXG4gICAgICBwc2VhcmNoOiBudWxsLFxyXG4gICAgICBzZWFyY2gxOiBudWxsLFxyXG4gICAgICBzZWFyY2gyOiBudWxsLFxyXG4gICAgICBwZGF0YToge30sXHJcbiAgICAgIHBzbHVnOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZTogJ2NvbGxhcHNlJyxcclxuICAgICAgbG9hZGluZzogbnVsbCxcclxuICAgICAgbm90Zm91bmQ6IG51bGwsXHJcbiAgICAgIGF1dG9Db21wbGV0ZVN0eWxlIDoge1xyXG4gICAgICAgIHZ1ZVNpbXBsZVN1Z2dlc3Q6IFwicG9zaXRpb24tcmVsYXRpdmVcIixcclxuICAgICAgICBpbnB1dFdyYXBwZXI6IFwiXCIsXHJcbiAgICAgICAgZGVmYXVsdElucHV0IDogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgICAgICBzdWdnZXN0aW9uczogXCJwb3NpdGlvbi1hYnNvbHV0ZSBsaXN0LWdyb3VwIHotMTAwMFwiLFxyXG4gICAgICAgIHN1Z2dlc3RJdGVtOiBcImxpc3QtZ3JvdXAtaXRlbVwiXHJcbiAgICAgIH0sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgYmxvY2s6IHRydWUsXHJcbiAgICAgICAgdGh1bWJuYWlsOiB0cnVlLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjNjY2JyxcclxuICAgICAgICB3aWR0aDogMTIwLFxyXG4gICAgICAgIGhlaWdodDogMTIwLFxyXG4gICAgICAgIGNsYXNzOiAnbWItMyBzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5nZXRQbGF5ZXJzKCk7XHJcbiAgfSxcclxuICB3YXRjaDoge1xyXG4gICAgdmlldzoge1xyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiAobikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG4pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgYWxsX3BsYXllcnNfdG91OiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIGlmKHZhbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5nZXRQRGF0YSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldFBsYXllcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0dFVF9BTExfUExBWUVSUycsIG51bGwpO1xyXG4gICAgfSxcclxuICAgIGdldFBEYXRhOiBmdW5jdGlvbiAodikge1xyXG4gICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5wc2x1Zyk7XHJcbiAgICAgIHZhciBkYXRhID0gXy5maW5kKHYsIFsnc2x1ZycsIHRoaXMucHNsdWddKTtcclxuICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnBkYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGdldHByb2ZpbGU6IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMubm90Zm91bmQgPSB0cnVlO1xyXG4gICAgICBjb25zb2xlLmxvZyhpKTtcclxuICAgICAgbGV0IHMgPSBpLnNsdWdcclxuICAgICAgaWYgKHMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhzKTtcclxuICAgICAgICB0aGlzLnBzbHVnID0gcztcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnR0VUX1BMQVlFUl9UT1VfREFUQScsdGhpcy5wc2x1Zyk7XHJcbiAgICAgICAgdGhpcy5ub3Rmb3VuZCA9IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubm90Zm91bmQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG91cm5leV9wb2RpdW1zOiBmdW5jdGlvbiAocmFuaykge1xyXG4gICAgICBsZXQgYyA9IHRoaXMucGRhdGEuY29tcGV0aXRpb25zO1xyXG4gICAgICBsZXQgd2lucyA9IF8uZmlsdGVyKGMsIFsnZmluYWxfcmFuaycsIHJhbmtdKTtcclxuICAgICAgcmV0dXJuIHdpbnMubGVuZ3RoO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIGFsbF9wbGF5ZXJzOiAnQUxMX1BMQVlFUlMnLFxyXG4gICAgICBhbGxfcGxheWVyc190b3U6ICdBTExfUExBWUVSU19UT1VfREFUQScsXHJcbiAgICB9KSxcclxuICAgIHBsYXllcmxpc3Q6IHtcclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLmFsbF9wbGF5ZXJzO1xyXG4gICAgICAgIGxldCBmcCA9IF8ubWFwKG4sIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcC5wbGF5ZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZnApO1xyXG4gICAgICAgIHJldHVybiBmcDtcclxuICAgICAgfSxcclxuICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdTRVRfQUxMX1BMQVlFUlMnLCBuZXdWYWwpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH1cclxufSk7XHJcbiIsIlxyXG5leHBvcnQgeyBSYXRpbmdTdGF0cyBhcyBkZWZhdWx0IH07XHJcbmxldCBSYXRpbmdTdGF0cyA9IFZ1ZS5jb21wb25lbnQoJ3JhdGluZ19zdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gUmF0aW5nIFN0YXRzIC0tPlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtOCBvZmZzZXQtMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICA8Yi10YWJsZSByZXNwb25zaXZlPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiY29tcHV0ZWRfaXRlbXNcIiA6ZmllbGRzPVwiZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgICAgPCEtLSBBIHZpcnR1YWwgY29sdW1uIC0tPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKHJhdGluZ19jaGFuZ2UpPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICA8c3BhbiB2LWJpbmQ6Y2xhc3M9XCJ7XHJcbiAgICAgICAgICAgJ3RleHQtaW5mbyc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID09IDAsXHJcbiAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPCAwLFxyXG4gICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA+IDAgfVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaXRlbS5yYXRpbmdfY2hhbmdlfX1cclxuICAgICAgICAgICAgPGkgdi1iaW5kOmNsYXNzPVwie1xyXG4gICAgICAgICAgICAgJ2ZhcyBmYS1sb25nLWFycm93LWxlZnQnOmRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID09IDAsXHJcbiAgICAgICAgICAgICAnZmFzIGZhLWxvbmctYXJyb3ctZG93bic6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlIDwgMCxcclxuICAgICAgICAgICAgICdmYXMgZmEtbG9uZy1hcnJvdy11cCc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID4gMCB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwobmFtZSk9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIDxiLWltZy1sYXp5IDp0aXRsZT1cImRhdGEuaXRlbS5uYW1lXCIgOmFsdD1cImRhdGEuaXRlbS5uYW1lXCIgOnNyYz1cImRhdGEuaXRlbS5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAge3tkYXRhLml0ZW0ubmFtZX19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICA8L2ItdGFibGU+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjb21wdXRlZF9pdGVtcyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGljUHJvcHM6IHtcclxuICAgICAgICBibG9jazogZmFsc2UsXHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgd2lkdGg6ICczMHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICczMHB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSwgbXgtMScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGZpZWxkczogW1xyXG4gICAgICAgIHsga2V5OiAncG9zaXRpb24nLCBsYWJlbDogJ1JhbmsnIH0sXHJcbiAgICAgICAgJ25hbWUnLFxyXG4gICAgICAgIHsga2V5OiAncmF0aW5nX2NoYW5nZScsIGxhYmVsOiAnQ2hhbmdlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgICB7IGtleTogJ2V4cGVjdGVkX3dpbnMnLCBsYWJlbDogJ0Uud2lucycgfSxcclxuICAgICAgICB7IGtleTogJ2FjdHVhbF93aW5zJywgbGFiZWw6ICdBLndpbnMnIH0sXHJcbiAgICAgICAgeyBrZXk6ICdvbGRfcmF0aW5nJywgbGFiZWw6ICdPbGQgUmF0aW5nJyAsIHNvcnRhYmxlOiB0cnVlfSxcclxuICAgICAgICB7IGtleTogJ25ld19yYXRpbmcnLCBsYWJlbDogJ05ldyBSYXRpbmcnICwgc29ydGFibGU6IHRydWV9LFxyXG4gICAgICBdLFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxufSk7XHJcbiIsIlxyXG5pbXBvcnQgYmFzZVVSTCBmcm9tICcuLi9jb25maWcuanMnO1xyXG5sZXQgU2NvcmVib2FyZCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlYm9hcmQnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImVycm9yXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gIDwvdGVtcGxhdGU+XHJcbiAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICA8ZGl2IGNsYXNzPVwiY29sXCIgaWQ9XCJzY29yZWJvYXJkXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnMgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgdi1mb3I9XCJpIGluIHJvd0NvdW50XCIgOmtleT1cImlcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1zbS02IGNvbC0xMiBcIiB2LWZvcj1cInBsYXllciBpbiBpdGVtQ291bnRJblJvdyhpKVwiIDprZXk9XCJwbGF5ZXIucmFua1wiPlxyXG4gICAgICAgIDxiLW1lZGlhIGNsYXNzPVwicGItMCBtYi0xIG1yLTFcIiB2ZXJ0aWNhbC1hbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBzbG90PVwiYXNpZGVcIj5cclxuICAgICAgICAgICAgPGItcm93IGNsYXNzPVwianVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgICAgICAgIDxiLWltZyByb3VuZGVkPVwiY2lyY2xlXCIgOnNyYz1cInBsYXllci5waG90b1wiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCIgLz5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNvbHM9XCIxMlwiIG1kPVwiYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGFnLWljb25cIiA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCJcclxuICAgICAgICAgICAgICAgICAgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNvbCBsZz1cIjJcIj5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09PSAnbScsXHJcbiAgICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09PSAnZicgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3cgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIHYtaWY9XCJwbGF5ZXIudGVhbVwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbD48c3Bhbj57e3BsYXllci50ZWFtfX08L3NwYW4+PC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgICAgPGItcm93PlxyXG4gICAgICAgICAgICAgIDxiLWNvbCBjbGFzcz1cInRleHQtd2hpdGVcIiB2LWJpbmQ6Y2xhc3M9XCJ7J3RleHQtd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICd0ZXh0LWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtY2VudGVyIHBvc2l0aW9uICBtdC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgIHt7cGxheWVyLnBvc2l0aW9ufX1cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbG9uZy1hcnJvdy11cCc6IHBsYXllci5yYW5rIDwgcGxheWVyLmxhc3RyYW5rLCdmYS1sb25nLWFycm93LWRvd24nOiBwbGF5ZXIucmFuayA+IHBsYXllci5sYXN0cmFuayxcclxuICAgICAgICAgICAgICAgICAnZmEtYXJyb3dzLWgnOiBwbGF5ZXIucmFuayA9PSBwbGF5ZXIubGFzdHJhbmsgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGg1IGNsYXNzPVwibS0wICBhbmltYXRlZCBmYWRlSW5MZWZ0XCI+e3twbGF5ZXIucGxheWVyfX08L2g1PlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJjYXJkLXRleHQgbXQtMFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIHBvaW50cyBwLTFcIj57e3BsYXllci5wb2ludHN9fS17e3BsYXllci5sb3NzZXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBtYXJcIj57e3BsYXllci5tYXJnaW4gfCBhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIubGFzdHBvc2l0aW9uXCIgY2xhc3M9XCJzZGF0YSBwMVwiPndhcyB7e3BsYXllci5sYXN0cG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cImJnLWluZm8gZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yZXN1bHQgfCBmaXJzdGNoYXIgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICB7e3BsYXllci5yZXN1bHQgfCBmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwicGxheWVyLnJlc3VsdCA9PSdhd2FpdGluZycgXCIgY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUgcC0xICBzZGF0YVwiPkF3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICBSZXN1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIHNkYXRhXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+e3twbGF5ZXIuc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgLSB7e3BsYXllci5vcHBvX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHAtMCBtbC0xIG9wcFwiPnZzIHt7cGxheWVyLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWlmPVwicGxheWVyLnByZXZyZXN1bHRzXCIgY2xhc3M9XCJyb3cgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIDp0aXRsZT1cInJlc1wiIHYtZm9yPVwicmVzIGluIHBsYXllci5wcmV2cmVzdWx0c1wiIDprZXk9XCJyZXMua2V5XCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0xIHRleHQtd2hpdGUgc2RhdGEtcmVzIHRleHQtY2VudGVyXCIgdi1iaW5kOmNsYXNzPVwieydiZy13YXJuaW5nJzogcmVzID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1pbmZvJzogcmVzID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcmVzID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1zdWNjZXNzJzogcmVzID09PSAnd2luJyB9XCI+e3tyZXN8Zmlyc3RjaGFyfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2ItbWVkaWE+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPC90ZW1wbGF0ZT5cclxuPC9kaXY+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2N1cnJlbnRSb3VuZCddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaXRlbXNQZXJSb3c6IDQsXHJcbiAgICAgIHBlcl9wYWdlOiA0MCxcclxuICAgICAgcGFyZW50X3NsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBwYWdldXJsOiBiYXNlVVJMICsgdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLmV2ZW50X3NsdWcsXHJcbiAgICAgIHJlbG9hZGluZzogZmFsc2UsXHJcbiAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgICBwZXJpb2Q6IDAuNSxcclxuICAgICAgdGltZXI6IG51bGwsXHJcbiAgICAgIHNjb3JlYm9hcmRfZGF0YTogW10sXHJcbiAgICAgIHJlc3BvbnNlX2RhdGE6IFtdLFxyXG4gICAgICAvLyBwbGF5ZXJzOiBbXSxcclxuICAgICAgLy8gdG90YWxfcm91bmRzOiAwLFxyXG4gICAgICAvLyBjdXJyZW50Um91bmQ6IG51bGwsXHJcbiAgICAgIGV2ZW50X3RpdGxlOiAnJyxcclxuICAgICAgaXNfbGl2ZV9nYW1lOiB0cnVlLFxyXG4gICAgfTtcclxuICB9LFxyXG5cclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyB0aGlzLmZldGNoU2NvcmVib2FyZERhdGEoKTtcclxuICAgIHRoaXMucHJvY2Vzc0RldGFpbHModGhpcy5jdXJyZW50UGFnZSlcclxuICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbChcclxuICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZWxvYWQoKTtcclxuICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICB0aGlzLnBlcmlvZCAqIDYwMDAwXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIGN1cnJlbnRSb3VuZDoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICB9XHJcbiAgICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5nZXRXaW5kb3dXaWR0aCk7XHJcbiAgICB0aGlzLmNhbmNlbEF1dG9VcGRhdGUoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFNjb3JlYm9hcmREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzX2xpdmVfZ2FtZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGl0ZW1Db3VudEluUm93OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zY29yZWJvYXJkX2RhdGEuc2xpY2UoXHJcbiAgICAgICAgKGluZGV4IC0gMSkgKiB0aGlzLml0ZW1zUGVyUm93LFxyXG4gICAgICAgIGluZGV4ICogdGhpcy5pdGVtc1BlclJvd1xyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NEZXRhaWxzOiBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnJlc3VsdF9kYXRhKVxyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAgIC8vIGxldCBsYXN0UmREID0gXy5sYXN0KF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgY3IgPSB0aGlzLmN1cnJlbnRSb3VuZCAtIDE7XHJcblxyXG4gICAgICBsZXQgdGhpc1JkRGF0YSA9IF8ubnRoKF8uY2xvbmUocmVzdWx0ZGF0YSksIGNyKTtcclxuICAgICAgY29uc29sZS5sb2coJy0tLS1UaGlzIFJvdW5kIERhdGEtLS0tLScpO1xyXG4gICAgICBjb25zb2xlLmxvZyhjcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXNSZERhdGEpO1xyXG5cclxuICAgICAgbGV0IGluaXRpYWxSZERhdGEgPSBbXTtcclxuICAgICAgbGV0IHByZXZpb3VzUmREYXRhID0gW107XHJcbiAgICAgIGlmKHRoaXMuY3VycmVudFJvdW5kID4gMSlcclxuICAgICAge1xyXG4gICAgICAgIHByZXZpb3VzUmREYXRhID0gXy5udGgoXy5jbG9uZShyZXN1bHRkYXRhKSxjciAtIDEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tUHJldmlvdXMgUm91bmQgRGF0YS0tLS0tJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocHJldmlvdXNSZERhdGEpO1xyXG4gICAgICAgIGluaXRpYWxSZERhdGEgPSBfLnRha2UoXy5jbG9uZShyZXN1bHRkYXRhKSwgY3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBjdXJyZW50UmREYXRhID0gXy5tYXAodGhpc1JkRGF0YSwgcGxheWVyID0+IHtcclxuICAgICAgICBsZXQgeCA9IHBsYXllci5wbm8gLSAxO1xyXG4gICAgICAgIHBsYXllci5waG90byA9IHRoaXMucGxheWVyc1t4XS5waG90bztcclxuICAgICAgICBwbGF5ZXIuZ2VuZGVyID0gdGhpcy5wbGF5ZXJzW3hdLmdlbmRlcjtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeV9mdWxsID0gdGhpcy5wbGF5ZXJzW3hdLmNvdW50cnlfZnVsbDtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeSA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5O1xyXG4gICAgICAgIGlmIChwcmV2aW91c1JkRGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IF8uZmluZChwcmV2aW91c1JkRGF0YSwge1xyXG4gICAgICAgICAgICBwbGF5ZXI6IHBsYXllci5wbGF5ZXIsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHBsYXllci5sYXN0cG9zaXRpb24gPSBwbGF5ZXJEYXRhWydwb3NpdGlvbiddO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3RyYW5rID0gcGxheWVyRGF0YVsncmFuayddO1xyXG4gICAgICAgICAgLy8gcHJldmlvdXMgcm91bmRzIHJlc3VsdHNcclxuICAgICAgICAgIGlmKGluaXRpYWxSZERhdGEubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucHJldnJlc3VsdHMgPSBfLmNoYWluKGluaXRpYWxSZERhdGEpXHJcbiAgICAgICAgICAgIC5mbGF0dGVuRGVlcCgpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICAgIHJldHVybiB2LnBsYXllciA9PT0gcGxheWVyLnBsYXllcjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgncmVzdWx0JylcclxuICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBsYXllcjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyB0aGlzLnRvdGFsX3JvdW5kcyA9IHJlc3VsdGRhdGEubGVuZ3RoO1xyXG4gICAgICAvLyB0aGlzLmN1cnJlbnRSb3VuZCA9IGxhc3RSZERhdGFbMF0ucm91bmQ7XHJcbiAgICAgIGxldCBjaHVua3MgPSBfLmNodW5rKGN1cnJlbnRSZERhdGEsIHRoaXMudG90YWxfcGxheWVycyk7XHJcbiAgICAgIC8vIHRoaXMucmVsb2FkaW5nID0gZmFsc2VcclxuICAgICAgdGhpcy5zY29yZWJvYXJkX2RhdGEgPSBjaHVua3NbY3VycmVudFBhZ2UgLSAxXTtcclxuICAgICAgY29uc29sZS5sb2coJ1Njb3JlYm9hcmQgRGF0YScpXHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NvcmVib2FyZF9kYXRhKVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgIH0pLFxyXG4gICAgcm93Q291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2NvcmVib2FyZF9kYXRhLmxlbmd0aCAvIHRoaXMuaXRlbXNQZXJSb3cpO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYWdldXJsXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZWJvYXJkOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuZXhwb3J0IHsgU2NvcmVzaGVldCBhcyBkZWZhdWx0IH07XHJcblxyXG5sZXQgU2NvcmVzaGVldCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlQ2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXhcIj5cclxuICAgICAgICAgIDxiLWltZyBmbHVpZCB0aHVtYm5haWwgY2xhc3M9XCJsb2dvIG1sLWF1dG9cIiA6c3JjPVwibG9nb1wiIDphbHQ9XCJldmVudF90aXRsZVwiIC8+XHJcbiAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj5TY29yZWNhcmRzIDxpIGNsYXNzPVwiZmFzIGZhLWNsaXBib2FyZFwiPjwvaT48L3NwYW4+XHJcbiAgICAgICAgICA8L2gyPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtYmV0d2VlblwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTIgY29sLTEyXCI+XHJcbiAgICAgIDwhLS0gcGxheWVyIGxpc3QgaGVyZSAtLT5cclxuICAgICAgICA8dWwgY2xhc3M9XCIgcC0yIG1iLTUgYmctd2hpdGUgcm91bmRlZFwiPlxyXG4gICAgICAgICAgPGxpIDprZXk9XCJwbGF5ZXIucG5vXCIgdi1mb3I9XCJwbGF5ZXIgaW4gcGRhdGFcIiBjbGFzcz1cImJlYmFzXCI+XHJcbiAgICAgICAgICA8c3Bhbj57e3BsYXllci5wbm99fTwvc3Bhbj4gPGItaW1nLWxhenkgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgdi1iaW5kPVwicGljUHJvcHNcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJnZXRDYXJkKHBsYXllci5wbm8pXCIgdmFyaWFudD1cImxpbmtcIj57e3BsYXllci5wbGF5ZXJ9fTwvYi1idXR0b24+XHJcbiAgICAgICAgICA8L2xpPlxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEwIGNvbC0xMlwiPlxyXG4gICAgICA8dGVtcGxhdGUgdi1pZj1cIm1QbGF5ZXJcIj5cclxuICAgICAgICA8aDQgY2xhc3M9XCJncmVlblwiPlNjb3JlY2FyZDogPGItaW1nIDphbHQ9XCJtUGxheWVyLnBsYXllclwiIGNsYXNzPVwibXgtMlwiIDpzcmM9XCJtUGxheWVyLnBob3RvXCIgc3R5bGU9XCJ3aWR0aDo2MHB4OyBoZWlnaHQ6NjBweFwiPjwvYi1pbWc+IHt7bVBsYXllci5wbGF5ZXJ9fTwvaDQ+XHJcbiAgICAgICAgPGItdGFibGUgcmVzcG9uc2l2ZT1cIm1kXCIgc21hbGwgaG92ZXIgZm9vdC1jbG9uZSBoZWFkLXZhcmlhbnQ9XCJsaWdodFwiIGJvcmRlcmVkIHRhYmxlLXZhcmlhbnQ9XCJsaWdodFwiIDpmaWVsZHM9XCJmaWVsZHNcIiA6aXRlbXM9XCJzY29yZWNhcmRcIiBpZD1cInNjb3JlY2FyZFwiIGNsYXNzPVwiYmViYXMgc2hhZG93IHAtNCBteC1hdXRvXCIgc3R5bGU9XCJ3aWR0aDo5MCU7IHRleHQtYWxpZ246Y2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlXCI+XHJcbiAgICAgICAgPCEtLSBBIGN1c3RvbSBmb3JtYXR0ZWQgY29sdW1uIC0tPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChyb3VuZCk9XCJkYXRhXCI+XHJcbiAgICAgICAgICB7e2RhdGEuaXRlbS5yb3VuZH19IDxzdXAgdi1pZj1cImRhdGEuaXRlbS5zdGFydCA9PSd5J1wiPio8L3N1cD5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6Y2VsbChvcHBvKT1cImRhdGFcIj5cclxuICAgICAgICAgIDxzbWFsbD4je3tkYXRhLml0ZW0ub3Bwb19ub319PC9zbWFsbD48Yi1pbWctbGF6eSA6dGl0bGU9XCJkYXRhLml0ZW0ub3Bwb1wiIDphbHQ9XCJkYXRhLml0ZW0ub3Bwb1wiIDpzcmM9XCJkYXRhLml0ZW0ub3BwX3Bob3RvXCIgdi1iaW5kPVwicGljUHJvcHNcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChkYXRhLml0ZW0ub3Bwb19ubylcIiB2YXJpYW50PVwibGlua1wiPlxyXG4gICAgICAgICAgICAgIHt7ZGF0YS5pdGVtLm9wcG98YWJicnZ9fVxyXG4gICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LXNsb3Q6dGFibGUtY2FwdGlvbj5cclxuICAgICAgICAgIFNjb3JlY2FyZDogI3t7bVBsYXllci5wbm99fSB7e21QbGF5ZXIucGxheWVyfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvYi10YWJsZT5cclxuICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICBwbGF5ZXJfbm86IHRoaXMuJHJvdXRlLnBhcmFtcy5wbm8sXHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHRvdXJuZXlfc2x1ZzogJycsXHJcbiAgICAgIHBpY1Byb3BzOiB7XHJcbiAgICAgICAgYmxvY2s6IGZhbHNlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIHdpZHRoOiAnMzBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMzBweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20sIG14LTEnLFxyXG4gICAgICB9LFxyXG4gICAgICBmaWVsZHM6IFt7a2V5Oidyb3VuZCcsbGFiZWw6J1JkJyxzb3J0YWJsZTp0cnVlfSwge2tleTogJ29wcG8nLCBsYWJlbDonT3BwLiBOYW1lJ30se2tleTonb3Bwb19zY29yZScsbGFiZWw6J09wcC4gU2NvcmUnLHNvcnRhYmxlOnRydWV9LHtrZXk6J3Njb3JlJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidkaWZmJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidyZXN1bHQnLHNvcnRhYmxlOnRydWV9LCB7a2V5Oid3aW5zJyxsYWJlbDonV29uJyxzb3J0YWJsZTp0cnVlfSx7a2V5Oidsb3NzZXMnLGxhYmVsOidMb3N0Jyxzb3J0YWJsZTp0cnVlfSx7a2V5Oidwb2ludHMnLHNvcnRhYmxlOnRydWV9LHtrZXk6J21hcmdpbicsc29ydGFibGU6dHJ1ZSxsYWJlbDonTWFyJ30se2tleToncG9zaXRpb24nLGxhYmVsOidSYW5rJyxzb3J0YWJsZTp0cnVlfV0sXHJcbiAgICAgIHBkYXRhOiB7fSxcclxuICAgICAgc2NvcmVjYXJkOiB7fSxcclxuICAgICAgbVBsYXllcjoge30sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBjcmVhdGVkKCkge1xyXG4gICAgdmFyIHAgPSB0aGlzLnNsdWcuc3BsaXQoJy0nKTtcclxuICAgIHAuc2hpZnQoKTtcclxuICAgIHRoaXMudG91cm5leV9zbHVnID0gcC5qb2luKCctJyk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnRvdXJuZXlfc2x1Zyk7XHJcbiAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfUkVTREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IGBQbGF5ZXIgU2NvcmVjYXJkcyAtICR7dGhpcy50b3VybmV5X3RpdGxlfWA7XHJcbiAgfSxcclxuICB3YXRjaDp7XHJcbiAgICByZXN1bHRkYXRhOiB7XHJcbiAgICAgIGltbWVkaWF0ZTogdHJ1ZSxcclxuICAgICAgZGVlcDogdHJ1ZSxcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIGlmIChuZXdWYWwpIHtcclxuICAgICAgICAgIHRoaXMucGRhdGEgPSBfLmNoYWluKHRoaXMucmVzdWx0ZGF0YSlcclxuICAgICAgICAgICAgLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgICAgICB0aGlzLmdldENhcmQodGhpcy5wbGF5ZXJfbm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldENhcmQ6IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgIGxldCBjID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICBsZXQgcyA9IF8uY2hhaW4oYykubWFwKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHYsIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5wbm8gPT0gbjtcclxuICAgICAgICB9KS5tYXAoIGZ1bmN0aW9uKGkpe1xyXG4gICAgICAgICAgaS5fY2VsbFZhcmlhbnRzID0gW107XHJcbiAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ2luZm8nO1xyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J3dpbicpe1xyXG4gICAgICAgICAgICBpLl9jZWxsVmFyaWFudHMucmVzdWx0ID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J2xvc3MnKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdkYW5nZXInO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoaS5yZXN1bHQgPT09J2RyYXcnKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICd3YXJuaW5nJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KS5mbGF0dGVuRGVlcCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubVBsYXllciA9IF8uZmlyc3Qocyk7XHJcbiAgICAgIHRoaXMuJHJvdXRlci5yZXBsYWNlKHsgbmFtZTogJ1Njb3Jlc2hlZXQnLCBwYXJhbXM6IHsgcG5vOiBuIH0gfSk7XHJcbiAgICAgIHRoaXMucGxheWVyX25vID0gbjtcclxuICAgICAgY29uc29sZS5sb2cocyk7XHJcbiAgICAgIHRoaXMuc2NvcmVjYXJkID0gcztcclxuICB9LFxyXG5cclxufSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiAnVE9UQUxQTEFZRVJTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGNhdGVnb3J5OiAnQ0FURUdPUlknLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogJ1BBUkVOVFNMVUcnLFxyXG4gICAgICBldmVudF90aXRsZTogJ0VWRU5UX1RJVExFJyxcclxuICAgICAgdG91cm5leV90aXRsZTogJ1RPVVJORVlfVElUTEUnLFxyXG4gICAgICBsb2dvOiAnTE9HT19VUkwnLFxyXG4gICAgfSksXHJcbiAgICBicmVhZGNydW1iczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ05TRiBOZXdzJyxcclxuICAgICAgICAgIGhyZWY6ICcvJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leV90aXRsZSxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgc2x1ZzogdGhpcy50b3VybmV5X3NsdWcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogYCR7Xy5jYXBpdGFsaXplKHRoaXMuY2F0ZWdvcnkpfSAtIFJlc3VsdHMgYW5kIFN0YXRzYCxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdDYXRlRGV0YWlsJyxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgZXZlbnRfc2x1ZzogdGhpcy5zbHVnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdTY29yZWNhcmRzJyxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iLCIgbGV0IExvV2lucyA9IFZ1ZS5jb21wb25lbnQoJ2xvd2lucycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gTG93IFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0TG93U2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImxvd3dpbnNfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbG93d2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG93d2luc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldExvd1Njb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlXaW5zID1WdWUuY29tcG9uZW50KCdoaXdpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIEhpZ2ggV2lubmluZyBTY29yZXMgLS0+XHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiZ2V0SGlTY29yZSgnd2luJylcIiA6ZmllbGRzPVwiaGlnaHdpbnNfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+YCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpZ2h3aW5zX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWdod2luc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldEhpU2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heEJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5zY29yZTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdzY29yZScpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlMb3NzID0gVnVlLmNvbXBvbmVudCgnaGlsb3NzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8IS0tIEhpZ2ggTG9zaW5nIFNjb3JlcyAtLT5cclxuICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ2xvc3MnKVwiIDpmaWVsZHM9XCJoaWxvc3NfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWxvc3NfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmhpbG9zc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3Njb3JlJywgbGFiZWw6ICdMb3NpbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnV2lubmVyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldEhpU2NvcmU6IGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heChmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgQ29tYm9TY29yZXMgPSBWdWUuY29tcG9uZW50KCdjb21ib3Njb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaWNvbWJvKClcIiA6ZmllbGRzPVwiaGljb21ib19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWNvbWJvX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWNvbWJvX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyb3VuZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdjb21ib19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdDb21iaW5lZCBTY29yZScsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnTG9zaW5nIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpY29tYm8oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuY29tYm9fc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnY29tYm9fc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IFRvdGFsU2NvcmVzID0gVnVlLmNvbXBvbmVudCgndG90YWxzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgIC8vICAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3RvdGFsX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1RvdGFsIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgVG90YWxPcHBTY29yZXMgPVZ1ZS5jb21wb25lbnQoJ29wcHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJ0b3RhbG9wcHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvdGFsb3Bwc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnRvdGFsb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgIC8vICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAndG90YWxfb3Bwc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnVG90YWwgT3Bwb25lbnQgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBBdmVTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAvLydpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0F2ZXJhZ2UgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IEF2ZU9wcFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ2F2ZW9wcHNjb3JlcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIGhvdmVyIHJlc3BvbnNpdmUgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cImF2ZW9wcHNjb3JlX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnc3RhdHMnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGF2ZW9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hdmVvcHBzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgIC8vICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnYXZlX29wcF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBMb1NwcmVhZCA9IFZ1ZS5jb21wb25lbnQoJ2xvc3ByZWFkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwibG9TcHJlYWQoKVwiIDpmaWVsZHM9XCJsb3NwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvc3ByZWFkX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5sb3NwcmVhZF9maWVsZHMgPSBbXHJcbiAgICAgICdyb3VuZCcsXHJcbiAgICAgIHsga2V5OiAnZGlmZicsIGxhYmVsOiAnU3ByZWFkJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGxvU3ByZWFkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1pbkJ5KGZ1bmN0aW9uKHcpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdy5kaWZmO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2RpZmYnKVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgSGlTcHJlYWQgPSAgIFZ1ZS5jb21wb25lbnQoJ2hpc3ByZWFkJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJoaVNwcmVhZCgpXCIgOmZpZWxkcz1cImhpc3ByZWFkX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGhpc3ByZWFkX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaXNwcmVhZF9maWVsZHMgPSBbXHJcbiAgICAgICdyb3VuZCcsXHJcbiAgICAgIHsga2V5OiAnZGlmZicsIGxhYmVsOiAnU3ByZWFkJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3Bwb19zY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1dpbm5lcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnTG9zZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGhpU3ByZWFkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSAnd2luJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1heChmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiB9KTtcclxuZXhwb3J0IHtIaVdpbnMsIExvV2lucyxIaUxvc3MsQ29tYm9TY29yZXMsVG90YWxTY29yZXMsVG90YWxPcHBTY29yZXMsQXZlU2NvcmVzLEF2ZU9wcFNjb3JlcyxIaVNwcmVhZCwgTG9TcHJlYWR9IiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbmxldCB0b3BQZXJmb3JtZXJzID0gVnVlLmNvbXBvbmVudCgndG9wLXN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgIDxoMyBjbGFzcz1cImJlYmFzXCI+e3t0aXRsZX19XHJcbiAgICAgICAgPHNwYW4+PGkgY2xhc3M9XCJmYXMgZmEtbWVkYWxcIj48L2k+PC9zcGFuPlxyXG4gICAgICA8L2gzPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC1sZy0yIGNvbC1zbS00IGNvbC0xMlwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwibXQtNSBkLWZsZXggYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IGlkPVwidG9wLWJ0bi1ncm91cFwiPlxyXG4gICAgICAgICAgPGItYnV0dG9uLWdyb3VwIHZlcnRpY2FsPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIlRvcCAzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgQGNsaWNrPVwic2hvd1BpYygndG9wMycpXCJcclxuICAgICAgICAgICAgICBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J3RvcDMnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Ub3AgM1xyXG4gICAgICAgICAgICA8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkhpZ2hlc3QgKEdhbWUpIFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2hpZ2FtZXMnKVwiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaWdhbWVzJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJ1bGxzZXllIG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5IaWdoIEdhbWVcclxuICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiXHJcbiAgICAgICAgICAgICAgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpYXZlcydcIiBAY2xpY2s9XCJzaG93UGljKCdoaWF2ZXMnKVwiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRodW1icy11cCBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBBdmUgU2NvcmU8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImluZm9cIiB0aXRsZT1cIkxvd2VzdCBBdmVyYWdlIE9wcG9uZW50IFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiXHJcbiAgICAgICAgICAgICAgQGNsaWNrPVwic2hvd1BpYygnbG9vcHBhdmVzJylcIiBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2xvb3BwYXZlcydcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1iZWVyIG1yLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+TG93IE9wcCBBdmU8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gdi1pZj1cInJhdGluZ19zdGF0c1wiIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoIFJhbmsgUG9pbnRzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgQGNsaWNrPVwic2hvd1BpYygnaGlyYXRlJylcIlxyXG4gICAgICAgICAgICAgIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlyYXRlJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJvbHQgbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5IaSBSYW5rIFBvaW50czwvYi1idXR0b24+XHJcbiAgICAgICAgICA8L2ItYnV0dG9uLWdyb3VwPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBjb2wtc20tOCBjb2wtMTJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgOmNsYXNzPVwieydkZWxheTEnOiAgaXRlbS5wb3NpdGlvbiA9PSAnMXN0JywgJ2RlbGF5Mic6IGl0ZW0ucG9zaXRpb24gPT0gJzJuZCcsICdkZWxheTMnOiBpdGVtLnBvc2l0aW9uID09ICczcmQnfVwiIGNsYXNzPVwiY29sLXNtLTQgY29sLTEyIGFuaW1hdGVkIGZsaXBJblhcIiB2LWZvcj1cIihpdGVtLCBpbmRleCkgaW4gc3RhdHNcIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cInAtMiB0ZXh0LWNlbnRlciBiZWJhcyBiZy1kYXJrIHRleHQtd2hpdGVcIj57e2l0ZW0ucGxheWVyfX08L2g0PlxyXG4gICAgICAgICAgPGRpdiA6Y2xhc3M9XCJ7J2dvbGQnOiBpdGVtLnBvc2l0aW9uID09ICcxc3QnLCdzaWx2ZXInOiBpdGVtLnBvc2l0aW9uID09ICcybmQnLCdicm9uemUnOiBpdGVtLnBvc2l0aW9uID09ICczcmQnfVwiIGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIFwiPlxyXG4gICAgICAgICAgICA8aW1nIDpzcmM9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLnBob3RvXCIgd2lkdGg9JzEyMCcgaGVpZ2h0PScxMjAnIGNsYXNzPVwiaW1nLWZsdWlkIHJvdW5kZWQtY2lyY2xlXCJcclxuICAgICAgICAgICAgICA6YWx0PVwicGxheWVyc1tpdGVtLnBuby0xXS5wb3N0X3RpdGxlfGxvd2VyY2FzZVwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbWwtNVwiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyc1tpdGVtLnBuby0xXS5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgIDp0aXRsZT1cInBsYXllcnNbaXRlbS5wbm8tMV0uY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmYVwiXHJcbiAgICAgICAgICAgICAgICA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnbScsICdmYS1mZW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnZid9XCJcclxuICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYmctZGFyayB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5wb2ludHNcIj57e2l0ZW0ucG9pbnRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlXCI+PHNtYWxsIHYtaWY9XCJpdGVtLnJhdGluZ19jaGFuZ2UgPj0gMFwiPkdhaW5lZDwvc21hbGw+IHt7aXRlbS5yYXRpbmdfY2hhbmdlfX0gcG9pbnRzIDxzbWFsbCB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlIDw9IDBcIj5sb3NzPC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICB2LWlmPVwiaXRlbS5tYXJnaW5cIj57e2l0ZW0ubWFyZ2lufGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgdGV4dC1jZW50ZXIgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCIgdi1pZj1cIml0ZW0uc2NvcmVcIj5Sb3VuZFxyXG4gICAgICAgICAgICAgICAge3tpdGVtLnJvdW5kfX0gdnMge3tpdGVtLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgYmctc3VjY2VzcyB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnNjb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLnBvc2l0aW9uXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ucG9zaXRpb259fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uYXZlX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9vcHBfc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5hdmVfb3BwX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLm5ld19yYXRpbmdcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5vbGRfcmF0aW5nfX0gLSB7e2l0ZW0ubmV3X3JhdGluZ319PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICBwcm9maWxlcyA6IFtdLFxyXG4gICAgICBzdGF0czogW10sXHJcbiAgICAgIGNvbXB1dGVkX3JhdGluZ19pdGVtczogW10sXHJcbiAgICAgIGN1cnJlbnRWaWV3OiAnJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNob3dQaWMoJ3RvcDMnKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHNob3dQaWM6IGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFZpZXcgPSB0XHJcbiAgICAgIGxldCBhcnIscixzID0gW107XHJcbiAgICAgIGlmICh0ID09ICdoaWF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX3Njb3JlJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlID0gJ0hpZ2hlc3QgQXZlcmFnZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2xvb3BwYXZlcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdhdmVfb3BwX3Njb3JlJyk7XHJcbiAgICAgICAgciA9IF8udGFrZVJpZ2h0KGFyciwgMykucmV2ZXJzZSgpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnYXZlX29wcF9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nTG93ZXN0IE9wcG9uZW50IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdoaWdhbWVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuY29tcHV0ZVN0YXRzKCk7XHJcbiAgICAgICAgciA9IF8udGFrZShhcnIsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnc2NvcmUnLCdyb3VuZCcsJ29wcG8nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0hpZ2ggR2FtZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ3RvcDMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygncG9pbnRzJyk7XHJcbiAgICAgICAgcyA9IF8uc29ydEJ5KGFycixbJ3BvaW50cycsJ21hcmdpbiddKS5yZXZlcnNlKClcclxuICAgICAgICByID0gXy50YWtlKHMsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAncG9pbnRzJywnbWFyZ2luJywncG9zaXRpb24nXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J1RvcCAzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdoaXJhdGUnKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSYXRpbmdEYXRhKCk7XHJcbiAgICAgICAgYXJyID0gdGhpcy5jb21wdXRlZF9yYXRpbmdfaXRlbXM7XHJcblxyXG4gICAgICAgIHMgPSBfLnNvcnRCeShhcnIsIFsncmF0aW5nX2NoYW5nZScsJ25ld19yYXRpbmcnXSkucmV2ZXJzZSgpO1xyXG5cclxuICAgICAgICByID0gXy50YWtlKHMsIDMpLm1hcChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgcmV0dXJuIF8ucGljayhwLCBbJ3BsYXllcicsICdwbm8nLCAnbmV3X3JhdGluZycsICdyYXRpbmdfY2hhbmdlJywgJ29sZF9yYXRpbmcnXSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLXRvcCByYW5rLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyKTtcclxuXHJcbiAgICAgICAgdGhpcy50aXRsZT0nSGlnaCBSYXRpbmcgUG9pbnQgR2FpbmVycydcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdGF0cyA9IHI7XHJcbiAgICAgIC8vIHRoaXMucHJvZmlsZXMgPSB0aGlzLnBsYXllcnNbci5wbm8tMV07XHJcblxyXG4gICAgfSxcclxuICAgIGdldFN0YXRzOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeSh0aGlzLmZpbmFsc3RhdHMsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIGNvbXB1dGVTdGF0czogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGVSYXRpbmdEYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxldCByZXN1bHRkYXRhID0gdGhpcy5yZXN1bHRkYXRhO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2hhaW4ocmVzdWx0ZGF0YSkubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgICAgbGV0IGl0ZW1zID0gXy5jbG9uZSh0aGlzLnJhdGluZ19zdGF0cyk7XHJcbiAgICAgIHRoaXMuY29tcHV0ZWRfcmF0aW5nX2l0ZW1zID0gXy5tYXAoaXRlbXMsIGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgbGV0IG4gPSB4LnBubztcclxuICAgICAgICBsZXQgcCA9IF8uZmlsdGVyKGRhdGEsIGZ1bmN0aW9uIChvKSB7XHJcbiAgICAgICAgICByZXR1cm4gby5wbm8gPT0gbjtcclxuICAgICAgICB9KTtcclxuICAgICAgICB4LnBob3RvID0gcFswXS5waG90bztcclxuICAgICAgICB4LnBvc2l0aW9uID0gcFswXS5wb3NpdGlvbjtcclxuICAgICAgICB4LnBsYXllciA9IHgubmFtZTtcclxuICAgICAgICB4LnJhdGluZ19jaGFuZ2UgPSBwYXJzZUludCh4LnJhdGluZ19jaGFuZ2UpO1xyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4ubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgZmluYWxzdGF0czogJ0ZJTkFMX1JPVU5EX1NUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICByYXRpbmdfc3RhdHM6ICdSQVRJTkdfU1RBVFMnLFxyXG4gICAgICBvbmdvaW5nOiAnT05HT0lOR19UT1VSTkVZJyxcclxuICAgIH0pLFxyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB0b3BQZXJmb3JtZXJzOyIsImV4cG9ydCB7IHN0b3JlIGFzIGRlZmF1bHQgfTtcclxuXHJcbmltcG9ydCB7IGJhc2VVUkwsIGF1dGhVUkwsIHByb2ZpbGVVUkwsIHN0YXRzVVJMIH0gZnJvbSAnLi9jb25maWcuanMnXHJcbmNvbnN0IHN0b3JlID0gbmV3IFZ1ZXguU3RvcmUoe1xyXG4gIHN0cmljdDogdHJ1ZSxcclxuICBzdGF0ZToge1xyXG4gICAgdG91YXBpOiBbXSxcclxuICAgIGNhdGVnb3JpZXNfY291bnQ6IHt9LFxyXG4gICAgdG91YWNjZXNzdGltZTogJycsXHJcbiAgICBkZXRhaWw6IFtdLFxyXG4gICAgbGFzdGRldGFpbGFjY2VzczogJycsXHJcbiAgICBldmVudF9zdGF0czogW10sXHJcbiAgICBwbGF5ZXJzOiBbXSxcclxuICAgIHJlc3VsdF9kYXRhOiBbXSxcclxuICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICBlcnJvcjogJycsXHJcbiAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgbG9naW5fbG9hZGluZzogZmFsc2UsXHJcbiAgICBsb2dpbl9zdWNjZXNzOiBmYWxzZSxcclxuICAgIGFjY2Vzc1Rva2VuOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndF90b2tlbicpIHx8ICcnLFxyXG4gICAgdXNlcl9kYXRhOiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndF91c2VyJykgfHwgJycsXHJcbiAgICBvbmdvaW5nOiBmYWxzZSxcclxuICAgIGN1cnJlbnRQYWdlOiBudWxsLFxyXG4gICAgV1B0b3RhbDogbnVsbCxcclxuICAgIFdQcGFnZXM6IG51bGwsXHJcbiAgICBjYXRlZ29yeTogJycsXHJcbiAgICBwYXJlbnRzbHVnOiAnJyxcclxuICAgIGV2ZW50X3RpdGxlOiAnJyxcclxuICAgIHRvdXJuZXlfdGl0bGU6ICcnLFxyXG4gICAgbG9nb191cmw6ICcnLFxyXG4gICAgdG90YWxfcm91bmRzOiBudWxsLFxyXG4gICAgZmluYWxfcm91bmRfc3RhdHM6IFtdLFxyXG4gICAgcmF0aW5nX3N0YXRzOiBbXSxcclxuICAgIHNob3dzdGF0czogZmFsc2UsXHJcbiAgICBwbGF5ZXJfbGFzdF9yZF9kYXRhOiBbXSxcclxuICAgIHBsYXllcmRhdGE6IFtdLFxyXG4gICAgcGxheWVyOiBudWxsLFxyXG4gICAgYWxsX3BsYXllcnM6IFtdLFxyXG4gICAgYWxsX3BsYXllcnNfdG91X2RhdGE6W10sXHJcbiAgICBwbGF5ZXJfc3RhdHM6IFtdLFxyXG4gIH0sXHJcbiAgZ2V0dGVyczoge1xyXG4gICAgUExBWUVSX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJfc3RhdHMsXHJcbiAgICBMQVNUUkREQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJfbGFzdF9yZF9kYXRhLFxyXG4gICAgUExBWUVSREFUQTogc3RhdGUgPT4gc3RhdGUucGxheWVyZGF0YSxcclxuICAgIFBMQVlFUjogc3RhdGUgPT4gc3RhdGUucGxheWVyLFxyXG4gICAgQUxMX1BMQVlFUlM6IHN0YXRlID0+IHN0YXRlLmFsbF9wbGF5ZXJzLFxyXG4gICAgQUxMX1BMQVlFUlNfVE9VX0RBVEE6IHN0YXRlID0+IHN0YXRlLmFsbF9wbGF5ZXJzX3RvdV9kYXRhLFxyXG4gICAgU0hPV1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5zaG93c3RhdHMsXHJcbiAgICBUT1VBUEk6IHN0YXRlID0+IHN0YXRlLnRvdWFwaSxcclxuICAgIFRPVUFDQ0VTU1RJTUU6IHN0YXRlID0+IHN0YXRlLnRvdWFjY2Vzc3RpbWUsXHJcbiAgICBERVRBSUw6IHN0YXRlID0+IHN0YXRlLmRldGFpbCxcclxuICAgIExBU1RERVRBSUxBQ0NFU1M6IHN0YXRlID0+IHN0YXRlLmxhc3RkZXRhaWxhY2Nlc3MsXHJcbiAgICBFVkVOVFNUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5ldmVudF9zdGF0cyxcclxuICAgIFBMQVlFUlM6IHN0YXRlID0+IHN0YXRlLnBsYXllcnMsXHJcbiAgICBUT1RBTFBMQVlFUlM6IHN0YXRlID0+IHN0YXRlLnRvdGFsX3BsYXllcnMsXHJcbiAgICBSRVNVTFREQVRBOiBzdGF0ZSA9PiBzdGF0ZS5yZXN1bHRfZGF0YSxcclxuICAgIFJBVElOR19TVEFUUzogc3RhdGUgPT4gc3RhdGUucmF0aW5nX3N0YXRzLFxyXG4gICAgRVJST1I6IHN0YXRlID0+IHN0YXRlLmVycm9yLFxyXG4gICAgTE9BRElORzogc3RhdGUgPT4gc3RhdGUubG9hZGluZyxcclxuICAgIEFDQ0VTU19UT0tFTjogc3RhdGUgPT4gc3RhdGUuYWNjZXNzVG9rZW4sXHJcbiAgICBVU0VSOiBzdGF0ZSA9PiBKU09OLnBhcnNlKHN0YXRlLnVzZXJfZGF0YSksXHJcbiAgICBMT0dJTl9MT0FESU5HOiBzdGF0ZSA9PiBzdGF0ZS5sb2dpbl9sb2FkaW5nLFxyXG4gICAgTE9HSU5fU1VDQ0VTUzogc3RhdGUgPT4gc3RhdGUubG9naW5fc3VjY2VzcyxcclxuICAgIENVUlJQQUdFOiBzdGF0ZSA9PiBzdGF0ZS5jdXJyZW50UGFnZSxcclxuICAgIFdQVE9UQUw6IHN0YXRlID0+IHN0YXRlLldQdG90YWwsXHJcbiAgICBXUFBBR0VTOiBzdGF0ZSA9PiBzdGF0ZS5XUHBhZ2VzLFxyXG4gICAgQ0FURUdPUlk6IHN0YXRlID0+IHN0YXRlLmNhdGVnb3J5LFxyXG4gICAgQ0FURUdPUklFU19DT1VOVDogc3RhdGUgPT4gc3RhdGUuY2F0ZWdvcmllc19jb3VudCxcclxuICAgIFRPVEFMX1JPVU5EUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcm91bmRzLFxyXG4gICAgRklOQUxfUk9VTkRfU1RBVFM6IHN0YXRlID0+IHN0YXRlLmZpbmFsX3JvdW5kX3N0YXRzLFxyXG4gICAgUEFSRU5UU0xVRzogc3RhdGUgPT4gc3RhdGUucGFyZW50c2x1ZyxcclxuICAgIEVWRU5UX1RJVExFOiBzdGF0ZSA9PiBzdGF0ZS5ldmVudF90aXRsZSxcclxuICAgIFRPVVJORVlfVElUTEU6IHN0YXRlID0+IHN0YXRlLnRvdXJuZXlfdGl0bGUsXHJcbiAgICBPTkdPSU5HX1RPVVJORVk6IHN0YXRlID0+IHN0YXRlLm9uZ29pbmcsXHJcbiAgICBMT0dPX1VSTDogc3RhdGUgPT4gc3RhdGUubG9nb191cmwsXHJcbiAgfSxcclxuICBtdXRhdGlvbnM6IHtcclxuICAgIFNFVF9TSE9XU1RBVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5zaG93c3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9GSU5BTF9SRF9TVEFUUzogKHN0YXRlLCByZXN1bHRzdGF0cykgPT4ge1xyXG4gICAgICBsZXQgbGVuID0gcmVzdWx0c3RhdHMubGVuZ3RoO1xyXG4gICAgICBpZiAobGVuID4gMSkge1xyXG4gICAgICAgIHN0YXRlLmZpbmFsX3JvdW5kX3N0YXRzID0gXy5sYXN0KHJlc3VsdHN0YXRzKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFNFVF9UT1VEQVRBOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91YXBpID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRERVRBSUw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5kZXRhaWwgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MQVNUX0FDQ0VTU19USU1FOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91YWNjZXNzdGltZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0RFVEFJTF9MQVNUX0FDQ0VTU19USU1FOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubGFzdGRldGFpbGFjY2VzcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1dQX0NPTlNUQU5UUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLldQcGFnZXMgPSBwYXlsb2FkWyd4LXdwLXRvdGFscGFnZXMnXTtcclxuICAgICAgc3RhdGUuV1B0b3RhbCA9IHBheWxvYWRbJ3gtd3AtdG90YWwnXTtcclxuICAgIH0sXHJcbiAgICBTRVRfUExBWUVSUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBhID0gcGF5bG9hZC5tYXAoZnVuY3Rpb24gKHZhbCwgaW5kZXgsIGtleSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGtleVtpbmRleF1bJ3Bvc3RfdGl0bGUnXSk7XHJcbiAgICAgICAga2V5W2luZGV4XVsndG91X25vJ10gPSBpbmRleCArIDE7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3BsYXllcnMgPSBwYXlsb2FkLmxlbmd0aDtcclxuICAgICAgc3RhdGUucGxheWVycyA9IGE7XHJcbiAgICB9LFxyXG4gICAgU0VUX0FMTF9QTEFZRVJTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuYWxsX3BsYXllcnMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9BTExfUExBWUVSU19UT1VfREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmFsbF9wbGF5ZXJzX3RvdV9kYXRhLnB1c2gocGF5bG9hZCk7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JBVElOR19TVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnJhdGluZ19zdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JFU1VMVDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBwID0gc3RhdGUucGxheWVycztcclxuICAgICAgbGV0IHIgPSBfLm1hcChwYXlsb2FkLCBmdW5jdGlvbiAoeikge1xyXG4gICAgICAgIHJldHVybiBfLm1hcCh6LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgbGV0IGkgPSBvLnBubyAtIDE7XHJcbiAgICAgICAgICBvLnBob3RvID0gcFtpXS5waG90bztcclxuICAgICAgICAgIG8uaWQgPSBwW2ldLmlkO1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5X2Z1bGwgPSBwW2ldLmNvdW50cnlfZnVsbDtcclxuICAgICAgICAgIG8uZ2VuZGVyID0gcFtpXS5nZW5kZXI7XHJcbiAgICAgICAgICBvLmlzX3RlYW0gPSBwW2ldLmlzX3RlYW07XHJcbiAgICAgICAgICBsZXQgeCA9IG8ub3Bwb19ubyAtIDE7XHJcbiAgICAgICAgICBvLm9wcF9waG90byA9IHBbeF0ucGhvdG87XHJcbiAgICAgICAgICBvLm9wcF9pZCA9IHBbeF0uaWQ7XHJcbiAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocik7XHJcbiAgICAgIHN0YXRlLnJlc3VsdF9kYXRhID0gcjtcclxuICAgIH0sXHJcbiAgICBTRVRfT05HT0lORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLm9uZ29pbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVFNUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DVVJSUEFHRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmN1cnJlbnRQYWdlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVJST1I6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5lcnJvciA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVVNFUl9EQVRBOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudXNlcl9kYXRhID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HSU5fU1VDQ0VTUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxvZ2luX3N1Y2Nlc3MgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9MT0dJTl9MT0FESU5HOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9naW5fbG9hZGluZyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVEFMX1JPVU5EUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3JvdW5kcyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0NBVEVHT1JJRVNfQ09VTlQ6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jYXRlZ29yaWVzX2NvdW50ID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ0FURUdPUlk6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICAvLyB2YXIgY2F0ZWdvcnkgPSAgcGF5bG9hZC50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJykubWFwKChzKSAgPT5zLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcy5zdWJzdHJpbmcoMSkpLmpvaW4oJyAnKTtcclxuICAgICAgc3RhdGUuY2F0ZWdvcnkgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9UT1VSTkVZX1RJVExFOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG91cm5leV90aXRsZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1BBUkVOVFNMVUc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5wYXJlbnRzbHVnID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVZFTlRfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5ldmVudF90aXRsZSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPR09fVVJMOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUubG9nb191cmwgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIC8vXHJcbiAgICBDT01QVVRFX1BMQVlFUl9TVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBsZW4gPSBzdGF0ZS5yZXN1bHRfZGF0YS5sZW5ndGg7XHJcbiAgICAgIGxldCBsYXN0cm91bmQgPSBzdGF0ZS5yZXN1bHRfZGF0YVtsZW4gLSAxXTtcclxuICAgICAgbGV0IHBsYXllciA9IChzdGF0ZS5wbGF5ZXIgPSBfLmZpbHRlcihzdGF0ZS5wbGF5ZXJzLCB7IGlkOiBwYXlsb2FkIH0pKTtcclxuICAgICAgbGV0IG5hbWUgPSBfLm1hcChwbGF5ZXIsICdwb3N0X3RpdGxlJykgKyAnJzsgLy8gY29udmVydCB0byBzdHJpbmdcclxuICAgICAgbGV0IHBsYXllcl90bm8gPSBwYXJzZUludChfLm1hcChwbGF5ZXIsICd0b3Vfbm8nKSk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9sYXN0X3JkX2RhdGEgPSBfLmZpbmQobGFzdHJvdW5kLCB7IHBubzogcGxheWVyX3RubyB9KTtcclxuXHJcbiAgICAgIGxldCBwZGF0YSA9IChzdGF0ZS5wbGF5ZXJkYXRhID0gXy5jaGFpbihzdGF0ZS5yZXN1bHRfZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5maWx0ZXIobSwgeyBwbm86IHBsYXllcl90bm8gfSk7XHJcbiAgICAgICAgfSkudmFsdWUoKSk7XHJcblxyXG4gICAgICBsZXQgYWxsU2NvcmVzID0gKHN0YXRlLnBsYXllcl9zdGF0cy5hbGxTY29yZXMgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgbGV0IHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ3Njb3JlJykpO1xyXG4gICAgICAgICAgcmV0dXJuIHNjb3JlcztcclxuICAgICAgICB9KS52YWx1ZSgpKTtcclxuXHJcbiAgICAgIGxldCBhbGxPcHBTY29yZXMgPSAoc3RhdGUucGxheWVyX3N0YXRzLmFsbE9wcFNjb3JlcyA9IF8uY2hhaW4ocGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobSkge1xyXG4gICAgICAgICAgbGV0IG9wcHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ29wcG9fc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gb3Bwc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLmFsbFJhbmtzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uIChtKSB7XHJcbiAgICAgICAgICBsZXQgciA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ3Bvc2l0aW9uJykpO1xyXG4gICAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZSA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmUgPSBfLm1heEJ5KGFsbFNjb3JlcykgKyAnJyk7XHJcbiAgICAgIGxldCBwTG9TY29yZSA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMucExvU2NvcmUgPSBfLm1pbkJ5KGFsbFNjb3JlcykgKyAnJyk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpT3BwU2NvcmUgPSBfLm1heEJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBMb09wcFNjb3JlID0gXy5taW5CeShhbGxPcHBTY29yZXMpICsgJyc7XHJcblxyXG4gICAgICBsZXQgcEhpU2NvcmVSb3VuZHMgPSBfLm1hcChcclxuICAgICAgICBfLmZpbHRlcihcclxuICAgICAgICAgIF8uZmxhdHRlbkRlZXAocGRhdGEpLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2NvcmUgPT0gcGFyc2VJbnQocEhpU2NvcmUpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICApLFxyXG4gICAgICAgICdyb3VuZCdcclxuICAgICAgKTtcclxuICAgICAgbGV0IHBMb1Njb3JlUm91bmRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXHJcbiAgICAgICAgICBfLmZsYXR0ZW5EZWVwKHBkYXRhKSxcclxuICAgICAgICAgIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBMb1Njb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHMgPSBwSGlTY29yZVJvdW5kcy5qb2luKCk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcyA9IHBMb1Njb3JlUm91bmRzLmpvaW4oKTtcclxuXHJcbiAgICAgIGxldCBwUmJ5UiA9IF8ubWFwKHBkYXRhLCBmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHJldHVybiBfLm1hcCh0LCBmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xyXG4gICAgICAgICAgaWYgKGwucmVzdWx0ID09PSAnd2luJykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnd29uJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAobC5yZXN1bHQgPT09ICdhd2FpdGluZycpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSBpZiAobC5yZXN1bHQgPT09ICdkcmF3Jykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnZHJldyc7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnbG9zdCc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgc3RhcnRpbmcgPSAncmVwbHlpbmcnO1xyXG4gICAgICAgICAgaWYgKGwuc3RhcnQgPT0gJ3knKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0aW5nID0gJ3N0YXJ0aW5nJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChyZXN1bHQgPT0gJ0FSJykge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgK1xyXG4gICAgICAgICAgICAgIGwucm91bmQgK1xyXG4gICAgICAgICAgICAgICcgJyArXHJcbiAgICAgICAgICAgICAgbmFtZSArXHJcbiAgICAgICAgICAgICAgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgK1xyXG4gICAgICAgICAgICAgIHN0YXJ0aW5nICtcclxuICAgICAgICAgICAgICAnKTwvZW0+IGlzIHBsYXlpbmcgPHN0cm9uZz4nICtcclxuICAgICAgICAgICAgICBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4uIFJlc3VsdHMgYXJlIGJlaW5nIGF3YWl0ZWQnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbC5yZXBvcnQgPVxyXG4gICAgICAgICAgICAgICdJbiByb3VuZCAnICsgbC5yb3VuZCArICcgJyArXHJcbiAgICAgICAgICAgICAgbmFtZSArICc8ZW0gdi1pZj1cImwuc3RhcnRcIj4sICgnICsgc3RhcnRpbmcgK1xyXG4gICAgICAgICAgICAgICcpPC9lbT4gcGxheWVkIDxzdHJvbmc+JyArIGwub3BwbyArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiBhbmQgJyArIHJlc3VsdCArXHJcbiAgICAgICAgICAgICAgJyA8ZW0+JyArIGwuc2NvcmUgKyAnIC0gJyArXHJcbiAgICAgICAgICAgICAgbC5vcHBvX3Njb3JlICsgJyw8L2VtPiBhIGRpZmZlcmVuY2Ugb2YgJyArXHJcbiAgICAgICAgICAgICAgbC5kaWZmICsgJy4gPHNwYW4gY2xhc3M9XCJzdW1tYXJ5XCI+PGVtPicgK1xyXG4gICAgICAgICAgICAgIG5hbWUgKyAnPC9lbT4gaXMgcmFua2VkIDxzdHJvbmc+JyArIGwucG9zaXRpb24gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gd2l0aCA8c3Ryb25nPicgKyBsLnBvaW50cyArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiBwb2ludHMgYW5kIGEgY3VtdWxhdGl2ZSBzcHJlYWQgb2YgJyArXHJcbiAgICAgICAgICAgICAgbC5tYXJnaW4gKyAnIDwvc3Bhbj4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucFJieVIgPSBfLmZsYXR0ZW5EZWVwKHBSYnlSKTtcclxuXHJcbiAgICAgIGxldCBhbGxXaW5zID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ3dpbicgPT0gcC5yZXN1bHQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydFdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ3knXSkubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zID0gXy5maWx0ZXIoYWxsV2lucywgWydzdGFydCcsICduJ10pLmxlbmd0aDtcclxuICAgICAgbGV0IHN0YXJ0cyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKF8uZmxhdHRlbkRlZXAocGRhdGEpLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgaWYgKHAuc3RhcnQgPT0gJ3knKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMuc3RhcnRzID0gc3RhcnRzLmxlbmd0aDtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnJlcGxpZXMgPSBzdGF0ZS50b3RhbF9yb3VuZHMgLSBzdGFydHMubGVuZ3RoO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGFjdGlvbnM6IHtcclxuICAgIERPX1NUQVRTOiAoY29udGV4dCwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1NIT1dTVEFUUycsIHBheWxvYWQpO1xyXG4gICAgfSxcclxuICAgIGFzeW5jIEFVVEhfVE9LRU4oY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBsZXQgdXJsID0gYCR7YXV0aFVSTH10b2tlbi92YWxpZGF0ZWA7XHJcbiAgICAgIC8vbGV0IHVybCA9IHBvc3RVUkw7XHJcbiAgICAgIHBheWxvYWQgPSBKU09OLnBhcnNlKHBheWxvYWQpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdCh1cmwsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGl0bGU6ICdQbGl1cyBBbGl0dGxlIHRlc3QgQVBJIFBvc3RpbmcnLFxyXG4gICAgICAgICAgY29udGVudDogJ0Fub3RoZXIgbWlub3IgUG9zdCBmcm9tIFdQIEFQSScsXHJcbiAgICAgICAgICBzdGF0dXM6ICdwdWJsaXNoJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICBBdXRob3JpemF0aW9uOiBgQmVhcmVyICAke3BheWxvYWR9YFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICB9KVxyXG4gICAgICAgIGxldCByZXMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgaWYgKHJlcy5jb2RlID09IFwiand0X2F1dGhfdmFsaWRfdG9rZW5cIikge1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9TVUNDRVNTJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCBmYWxzZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIERPX0xPR0lOKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHthdXRoVVJMfXRva2VuYDtcclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdCh1cmwsIHtcclxuICAgICAgICB1c2VybmFtZTogcGF5bG9hZC51c2VyLFxyXG4gICAgICAgIHBhc3N3b3JkOiBwYXlsb2FkLnBhc3NcclxuICAgICAgfSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgaWYgKGRhdGEudG9rZW4pIHtcclxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0X3Rva2VuJywgSlNPTi5zdHJpbmdpZnkoZGF0YS50b2tlbikpXHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndF91c2VyJywgSlNPTi5zdHJpbmdpZnkoZGF0YS51c2VyX2Rpc3BsYXlfbmFtZSkpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HSU5fU1VDQ0VTUycsIHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX1NVQ0NFU1MnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR0lOX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dJTl9TVUNDRVNTJywgZmFsc2UpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnIubWVzc2FnZS50b1N0cmluZygpKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBhc3luYyBHRVRfQUxMX1BMQVlFUlMoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBsZXQgdXJsID0gYCR7cHJvZmlsZVVSTH1gO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvc1xyXG4gICAgICAgIC5nZXQoIHVybCwge1xyXG4gICAgICAgICAgLy9wYXJhbXM6IHsgcGFnZTogcGF5bG9hZCB9LFxyXG4gICAgICAgICAgLy8gaGVhZGVyczogeydBdXRob3JpemF0aW9uJzogYEJlYXJlciAgJHt0b2tlbn1gfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHIgPSByZXNwb25zZS5kYXRhXHJcbiAgICAgICAgbGV0IGRhdGEgPSBfLm1hcChyLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgZC5jb3VudHJ5ID0gZC5jb3VudHJ5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICBkLmdlbmRlciA9IGQuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgIHJldHVybiBkO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9BTExfUExBWUVSUycsIGRhdGEpO1xyXG4gICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEdFVF9QTEFZRVJfVE9VX0RBVEEoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBsZXQgdXJsID0gYCR7c3RhdHNVUkx9JHtwYXlsb2FkfWA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCggdXJsLCB7XHJcbiAgICAgICAgICAvL3BhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0sXHJcbiAgICAgICAgICAvLyBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICAke3Rva2VufWB9XHJcbiAgICAgICAgfSlcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFcclxuICAgICAgICBkYXRhLmNvdW50cnkgPSBkYXRhLmNvdW50cnkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBkYXRhLmdlbmRlciA9IGRhdGEuZ2VuZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9BTExfUExBWUVSU19UT1VfREFUQScsIGRhdGEpO1xyXG4gICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0NBVEVHT1JJRVMgKGNvbnRleHQsIHBheWxvYWQpICB7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRfY2F0ZWdvcnlgO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsKVxyXG4gICAgICB0cnl7XHJcblxyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NBVEVHT1JJRVNfQ09VTlQnLCBkYXRhKTtcclxuXHJcbiAgICAgIH1jYXRjaChlcnIpe1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9BUEkgKGNvbnRleHQsIHBheWxvYWQpICB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10b3VybmFtZW50YDtcclxuICAgICAgLy8gbGV0IHRva2VuID0gY29udGV4dC5nZXR0ZXJzLkFDQ0VTU19UT0tFTlxyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvc1xyXG4gICAgICAgIC5nZXQodXJsLCB7XHJcbiAgICAgICAgICBwYXJhbXM6IHsgcGFnZTogcGF5bG9hZC5wYWdlLCB0X2NhdGVnb3J5OiBwYXlsb2FkLmNhdGVnb3J5IH0sXHJcbiAgICAgICAgICAvLyBoZWFkZXJzOiB7J0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICAke3Rva2VufWB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coJ0dldHRpbmcgbGlzdHMgb2YgdG91cm5hbWVudHMnKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YS5tYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEZvcm1hdCBhbmQgYXNzaWduIFRvdXJuYW1lbnQgc3RhcnQgZGF0ZSBpbnRvIGEgbGV0aWFibGVcclxuICAgICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhtb21lbnQoaGVhZGVycy5kYXRlKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIiVjXCIgKyBtb21lbnQoaGVhZGVycy5kYXRlKSwgXCJmb250LXNpemU6MzBweDtjb2xvcjpncmVlbjtcIik7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9XUF9DT05TVEFOVFMnLCBoZWFkZXJzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VREFUQScsIGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DVVJSUEFHRScsIHBheWxvYWQpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9ERVRBSUwgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHsgcGFyYW1zOiB7IHNsdWc6IHBheWxvYWQgfSB9KTtcclxuICAgICAgICAgbGV0IGhlYWRlcnMgPSByZXNwb25zZS5oZWFkZXJzO1xyXG4gICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgIGxldCBzdGFydERhdGUgPSBkYXRhLnN0YXJ0X2RhdGU7XHJcbiAgICAgICAgIGRhdGEuc3RhcnRfZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShzdGFydERhdGUpKS5mb3JtYXQoXHJcbiAgICAgICAgICAgJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0RFVEFJTF9MQVNUX0FDQ0VTU19USU1FJywgaGVhZGVycy5kYXRlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVERFVEFJTCcsIGRhdGEpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnJvci50b1N0cmluZygpKTtcclxuICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRkVUQ0hfREFUQSAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coY29udGV4dCk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRfZGF0YWA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pXHJcbiAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gSlNPTi5wYXJzZShkYXRhLnJlc3VsdHMpO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnRkVUQ0ggREFUQSAkc3RvcmUnKVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeSA9IGRhdGEuZXZlbnRfY2F0ZWdvcnlbMF0ubmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICBsZXQgdG91cm5leV90aXRsZSA9IGRhdGEudG91cm5leVswXS5wb3N0X3RpdGxlO1xyXG4gICAgICAgIGxldCBwYXJlbnRfc2x1ZyA9IGRhdGEudG91cm5leVswXS5wb3N0X25hbWU7XHJcbiAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICBsZXQgdG90YWxfcm91bmRzID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVFNUQVRTJywgZGF0YS50b3VybmV5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUExBWUVSUycsIHBsYXllcnMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkVTVUxUJywgcmVzdWx0cyk7XHJcbiAgICAgICAgbGV0IHJhdGluZ19zdGF0cyA9IG51bGw7XHJcbiAgICAgICAgaWYgKGRhdGEuc3RhdHNfanNvbikge1xyXG4gICAgICAgICAgcmF0aW5nX3N0YXRzID0gSlNPTi5wYXJzZShkYXRhLnN0YXRzX2pzb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JBVElOR19TVEFUUycsIHJhdGluZ19zdGF0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfQ0FURUdPUlknLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dPX1VSTCcsIGxvZ28pO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRfVElUTEUnLCBldmVudF90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1RBTF9ST1VORFMnLCB0b3RhbF9yb3VuZHMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGVycm9yKVxyXG4gICAgICB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBGRVRDSF9SRVNEQVRBIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dF9kYXRhYDtcclxuICAgICAgICAgIGF4aW9zLmdldCh1cmwsIHsgcGFyYW1zOiB7IHNsdWc6IHBheWxvYWQgfSB9KS50aGVuKHJlc3BvbnNlPT57XHJcbiAgICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgICBsZXQgcGxheWVycyA9IGRhdGEucGxheWVycztcclxuICAgICAgICAgIGxldCByZXN1bHRzID0gSlNPTi5wYXJzZShkYXRhLnJlc3VsdHMpO1xyXG4gICAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICBsZXQgbG9nbyA9IGRhdGEudG91cm5leVswXS5ldmVudF9sb2dvLmd1aWQ7XHJcbiAgICAgICAgICBsZXQgdG91cm5leV90aXRsZSA9IGRhdGEudG91cm5leVswXS5wb3N0X3RpdGxlO1xyXG4gICAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICAgIGxldCBldmVudF90aXRsZSA9IHRvdXJuZXlfdGl0bGUgKyAnICgnICsgY2F0ZWdvcnkgKyAnKSc7XHJcbiAgICAgICAgICBsZXQgdG90YWxfcm91bmRzID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9PTkdPSU5HJywgZGF0YS5vbmdvaW5nKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUExBWUVSUycsIHBsYXllcnMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRklOQUxfUkRfU1RBVFMnLCByZXN1bHRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfQ0FURUdPUlknLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVVJORVlfVElUTEUnLCB0b3VybmV5X3RpdGxlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRfVElUTEUnLCBldmVudF90aXRsZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1BBUkVOVFNMVUcnLCBwYXJlbnRfc2x1Zyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICB9KS5jYXRjaChlcnJvciA9PntcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnJvci50b1N0cmluZygpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IHN0b3JlO1xyXG4iXX0=
