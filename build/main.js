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
exports["default"] = void 0;
var baseURL = '/wp-json/wp/v2/';
exports["default"] = baseURL;

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

},{"./pages/category.js":9,"./pages/detail.js":10,"./pages/list.js":11,"./pages/scoresheet.js":15,"./store.js":18,"@babel/runtime/helpers/interopRequireDefault":3}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginForm = exports.ErrorAlert = exports.LoadingAlert = void 0;
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
var LoginForm = Vue.component('login', {
  template: "\n      <b-form @submit=\"onSubmit\" inline class=\"w-80 mx-auto\">\n      <label class=\"sr-only\" for=\"inline-form-input-username\">Username</label>\n      <b-input\n       id=\"inline-form-input-username\"\n       class=\"mb-2 mr-sm-2 mb-sm-0\"\n       v-model=\"user\" >\n      </b-input>\n     <label class=\"sr-only\" for=\"inline-form-input-password\">Password</label>\n      <b-input id=\"inline-form-input-password\"  v-model=\"pass\"></b-input>\n      </b-input-group>\n      <b-button type=\"submit\" class=\"ml-sm-2\" sm variant=\"outline-primary\"><i class=\"fa fa-save\"></i></b-button>\n      </b-form>\n    ",
  data: function data() {
    return {
      form: {
        pass: '',
        user: ''
      }
    };
  },
  methods: {
    onSubmit: function onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset: function onReset(evt) {
      var _this = this;

      evt.preventDefault(); // Reset our form values

      this.form.user = '';
      this.form.pass = ''; // Trick to reset/clear native browser form validation state

      this.show = false;
      this.$nextTick(function () {
        _this.show = true;
      });
    }
  }
});
exports.LoginForm = LoginForm;

},{}],9:[function(require,module,exports){
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

var _scoreboard = _interopRequireDefault(require("./scoreboard.js"));

var _rating_stats = _interopRequireDefault(require("./rating_stats.js"));

var _top = _interopRequireDefault(require("./top.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CateDetail = Vue.component('cate', {
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-center\" >\n                <div class=\"mr-lg-0\">\n                  <b-img fluid class=\"thumbnail logo\" :src=\"logo\" :alt=\"event_title\" />\n                </div>\n                <div class=\"mx-auto\">\n                  <h2 class=\"text-center bebas\">{{ event_title }}\n                  <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n                  </h2>\n                </div>\n              </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <router-link :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:1}}\">\n                <b-button variant=\"link\" class=\"text-decoration-none\"><i class=\"fas fa-clipboard\" aria-hidden=\"true\"></i> Scorecards</b-button>\n                </router-link>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><i class=\"fas fa-sticky-note\" aria-hidden=\"true\"></i> Results</b-button>\n                <b-button title=\"Round-By-Round Standings\" @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><i class=\"fas fa-sort-numeric-down    \"></i> Standings</b-button>\n                <b-button title=\"Category Statistics\" @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><i class=\"fas fa-chart-pie\"></i> Statistics</b-button>\n                <b-button title=\"Round-By-Round Scoreboard\" @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><i class=\"fas fa-chalkboard-teacher\"></i>\n                Scoreboard</b-button>\n                <b-button title=\"Top 3 Performances\" @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><i class=\"fas fa-medal\"></i>\n                Top Performers</b-button>\n                <b-button title=\"Post-tourney Rating Statistics\" v-if=\"rating_stats\" @click=\"viewIndex=7\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==7\" :pressed=\"viewIndex==7\"><i class=\"fas fa-stream\"></i>\n                Rating Stats</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-1 col-12 d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n        </div>\n\n        <template v-if=\"viewIndex==0\">\n          <allplayers :slug=\"slug\"></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-if=\"viewIndex==7\">\n          <ratings :caption=\"caption\" :computed_items=\"computed_rating_items\">\n          </ratings>\n        </template>\n        <template v-else-if=\"viewIndex==5\">\n        <scoreboard></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings v-if=\"viewIndex==1\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></pairings>\n                <results v-if=\"viewIndex==2\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></results>\n                <standings v-if=\"viewIndex==3\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
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
    performers: _top["default"]
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
    console.log('Category mounted');
    console.log(this.players);
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

        case 7:
          this.showPagination = false;
          this.tab_heading = 'Post Tournament Rating Statistics';
          this.caption = 'Rating Statistics';
          break;

        default:
          this.showPagination = false;
          this.tab_heading = '';
          this.caption = '';
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
      // console.log(page);
      // console.log(this.currentRound);
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

},{"./alerts.js":8,"./playerlist.js":12,"./rating_stats.js":13,"./scoreboard.js":14,"./stats.js":16,"./top.js":17,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],10:[function(require,module,exports){
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
    document.title = this.tourney.title;
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
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n      <div class=\"row no-gutters\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n          <b-breadcrumb :items=\"breadcrumbs\" />\n        <div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 col-lg-10 offset-lg-1 justify-content-center align-items-center\">\n          <loginform />\n        <div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 justify-content-center align-items-center\">\n            <h2 class=\"bebas text-center\">\n                <i class=\"fa fa-trophy\"></i> Tournaments\n            </h2>\n        </div>\n      </div>\n      <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                        :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n              <p class=\"text-muted\"> You are on page {{currentPage}} of {{WPpages}} pages; <span class=\"emphasize\">{{WPtotal}}</span> tournaments!</p>\n            </div>\n        </div>\n        <div class=\"row\">\n        <div  class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\" :key=\"item.id\">\n        <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft\" >\n          <div class=\"mr-lg-5\">\n            <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n              <b-img fluid class=\"thumbnail\"\n                  :src=\"item.event_logo\" width=\"100\"  height=\"100\" :alt=\"item.event_logo_title\" />\n            </router-link>\n          </div>\n          <div class=\"mr-lg-auto\">\n            <h4 class=\"mb-1 display-5\">\n            <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                {{item.title}}\n            </router-link>\n            </h4>\n            <div class=\"text-center\">\n            <div class=\"d-inline p-1\">\n                <small><i class=\"fa fa-calendar\"></i>\n                    {{item.start_date}}\n                </small>\n            </div>\n          <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-map-marker\"></i>\n                  {{item.venue}}\n              </small>\n          </div>\n          <div class=\"d-inline p-1\">\n              <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                  <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                  </small>\n              </router-link>\n          </div>\n          <ul class=\"list-unstyled list-inline text-center category-list\">\n              <li class=\"list-inline-item mx-auto\"\n              v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n          </ul>\n          </div>\n          </div>\n        </div>\n       </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 d-flex flex-column justify-content-lg-end\">\n          <p class=\"my-0 py-0\"><small class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages with <span class=\"emphasize\">{{WPtotal}}</span>\n          tournaments!</small></p>\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                  :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n        </div>\n      </div>\n   </template>\n</div>\n",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert,
    loginform: _alerts.LoginForm
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
    console.log('------------------------------------');
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
        label: 'Old Rating'
      }, {
        key: 'new_rating',
        label: 'New Rating'
      }]
    };
  }
});
exports["default"] = RatingStats;

},{}],14:[function(require,module,exports){
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
  template: "\n  <div class=\"row d-flex align-items-center justify-content-center\">\n  <template v-if=\"loading||error\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-if=\"error\" class=\"col align-self-center\">\n            <error>\n            <p slot=\"error\">{{error}}</p>\n            <p slot=\"error_msg\">{{error_msg}}</p>\n            </error>\n        </div>\n  </template>\n  <template v-else>\n  <div class=\"col\" id=\"scoreboard\">\n    <div class=\"row no-gutters d-flex align-items-center justify-content-center\" v-for=\"i in rowCount\" :key=\"i\">\n      <div class=\"col-lg-3 col-sm-6 col-12 \" v-for=\"player in itemCountInRow(i)\" :key=\"player.rank\">\n        <b-media class=\"pb-0 mb-1 mr-1\" vertical-align=\"center\">\n          <div slot=\"aside\">\n            <b-row class=\"justify-content-center\">\n              <b-col>\n                <b-img rounded=\"circle\" :src=\"player.photo\" width=\"50\" height=\"50\" :alt=\"player.player\" class=\"animated fadeIn\"/>\n              </b-col>\n            </b-row>\n            <b-row class=\"justify-content-center\">\n              <b-col cols=\"12\" md=\"auto\">\n                <span class=\"flag-icon\" :title=\"player.country_full\"\n                  :class=\"'flag-icon-'+player.country | lowercase\"></span>\n              </b-col>\n              <b-col col lg=\"2\">\n                <i class=\"fa\" v-bind:class=\"{'fa-male': player.gender === 'm',\n                     'fa-female': player.gender === 'f' }\" aria-hidden=\"true\"></i>\n              </b-col>\n            </b-row>\n            <b-row class=\"text-center\" v-if=\"player.team\">\n              <b-col><span>{{player.team}}</span></b-col>\n            </b-row>\n            <b-row>\n              <b-col class=\"text-white\" v-bind:class=\"{'text-warning': player.result === 'draw',\n             'text-info': player.result === 'awaiting',\n             'text-danger': player.result === 'loss',\n             'text-success': player.result === 'win' }\">\n                <h4 class=\"text-center position  mt-1\">\n                  {{player.position}}\n                  <i class=\"fa\" v-bind:class=\"{'fa-long-arrow-up': player.rank < player.lastrank,'fa-long-arrow-down': player.rank > player.lastrank,\n                 'fa-arrows-h': player.rank == player.lastrank }\" aria-hidden=\"true\"></i>\n                </h4>\n              </b-col>\n            </b-row>\n          </div>\n          <h5 class=\"m-0  animated fadeInLeft\">{{player.player}}</h5>\n          <p class=\"card-text mt-0\">\n            <span class=\"sdata points p-1\">{{player.points}}-{{player.losses}}</span>\n            <span class=\"sdata mar\">{{player.margin | addplus}}</span>\n            <span class=\"sdata p1\">was {{player.lastposition}}</span>\n          </p>\n          <div class=\"row\">\n            <b-col>\n              <span v-if=\"player.result =='awaiting' \" class=\"bg-info d-inline p-1 ml-1 text-white result\">{{\n                                   player.result | firstchar }}</span>\n              <span v-else class=\"d-inline p-1 ml-1 text-white result\" v-bind:class=\"{'bg-warning': player.result === 'draw',\n                         'bg-danger': player.result === 'loss',\n                         'bg-info': player.result === 'awaiting',\n                         'bg-success': player.result === 'win' }\">\n                {{player.result | firstchar}}</span>\n              <span v-if=\"player.result =='awaiting' \" class=\"text-info d-inline p-1  sdata\">Awaiting\n                Result</span>\n              <span v-else class=\"d-inline p-1 sdata\" v-bind:class=\"{'text-warning': player.result === 'draw',\n                       'text-danger': player.result === 'loss',\n                       'text-success': player.result === 'win' }\">{{player.score}}\n                - {{player.oppo_score}}</span>\n              <span class=\"d-block p-0 ml-1 opp\">vs {{player.oppo}}</span>\n            </b-col>\n          </div>\n          <div class=\"row align-content-center\">\n            <b-col>\n              <span :title=\"res\" v-for=\"res in player.prevresults\" :key=\"res.key\"\n                class=\"d-inline-block p-1 text-white sdata-res text-center\" v-bind:class=\"{'bg-warning': res === 'draw',\n                     'bg-info': res === 'awaiting',\n                     'bg-danger': res === 'loss',\n                     'bg-success': res === 'win' }\">{{res|firstchar}}</span>\n            </b-col>\n          </div>\n        </b-media>\n      </div>\n    </div>\n  </div>\n  </template>\n</div>\n    ",
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
      currentRound: null,
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

      console.log(this.result_data);
      var resultdata = this.result_data;

      var initialRdData = _.initial(_.clone(resultdata));

      var previousRdData = _.last(initialRdData);

      var lastRdD = _.last(_.clone(resultdata));

      var lastRdData = _.map(lastRdD, function (player) {
        var x = player.pno - 1;
        player.photo = _this.players[x].photo;
        player.gender = _this.players[x].gender;
        player.country_full = _this.players[x].country_full;
        player.country = _this.players[x].country; // if (
        //   player.result == 'draw' &&
        //   player.score == 0 &&
        //   player.oppo_score == 0
        // ) {
        //   player.result = 'AR';
        // }

        if (previousRdData) {
          var playerData = _.find(previousRdData, {
            player: player.player
          });

          player.lastposition = playerData['position'];
          player.lastrank = playerData['rank']; // previous rounds results

          player.prevresults = _.chain(initialRdData).flattenDeep().filter(function (v) {
            return v.player === player.player;
          }).map('result').value();
        }

        return player;
      }); // this.total_rounds = resultdata.length;


      this.currentRound = lastRdData[0].round;

      var chunks = _.chunk(lastRdData, this.total_players); // this.reloading = false


      this.scoreboard_data = chunks[currentPage - 1];
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

},{"../config.js":6,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],15:[function(require,module,exports){
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

},{"./alerts.js":8,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n  <div class=\"row\">\n    <div class=\"col-12 justify-content-center align-content-center\">\n      <h3 class=\"bebas\">{{title}}\n        <span><i class=\"fas fa-medal\"></i></span>\n      </h3>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-lg-2 col-sm-4 col-12\">\n      <div class=\"mt-5 d-flex align-content-center align-items-center justify-content-center\">\n        <div id=\"top-btn-group\">\n          <b-button-group vertical>\n            <b-button variant=\"info\" title=\"Top 3\" class=\"m-2 btn-block\" @click=\"showPic('top3')\"\n              active-class=\"success\" :pressed=\"currentView=='top3'\">\n              <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>Top 3\n            </b-button>\n            <b-button variant=\"info\" title=\"Highest (Game) Scores\" class=\"m-2 btn-block\" active-class=\"success\"\n              @click=\"showPic('higames')\" :pressed=\"currentView=='higames'\">\n              <i class=\"fas fa-bullseye m-1\" aria-hidden=\"true\"></i>High Game\n            </b-button>\n            <b-button variant=\"info\" title=\"Highest Average Scores\" class=\"m-2 btn-block\" active-class=\"success\"\n              :pressed=\"currentView=='hiaves'\" @click=\"showPic('hiaves')\">\n              <i class=\"fas fa-thumbs-up m-1\" aria-hidden=\"true\"></i>High Ave Score</b-button>\n            <b-button variant=\"info\" title=\"Lowest Average Opponent Scores\" class=\"m-2 btn-block\"\n              @click=\"showPic('looppaves')\" active-class=\"success\" :pressed=\"currentView=='looppaves'\">\n              <i class=\"fas fa-beer mr-1\" aria-hidden=\"true\"></i>Low Opp Ave</b-button>\n            <b-button v-if=\"rating_stats\" variant=\"info\" title=\"High Rank Points\" class=\"m-2 btn-block\" @click=\"showPic('hirate')\"\n              active-class=\"success\" :pressed=\"currentView=='hirate'\">\n              <i class=\"fas fa-bolt mr-1\" aria-hidden=\"true\"></i>Hi Rank Points</b-button>\n          </b-button-group>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-lg-10 col-sm-8 col-12\">\n      <div class=\"row\">\n        <div class=\"col-sm-4 col-12 animated fadeInRightBig\" v-for=\"(item, index) in stats\">\n          <h4 class=\"p-2 text-center bebas bg-dark text-white\">{{item.player}}</h4>\n          <div class=\"d-flex flex-column justify-content-center align-items-center\">\n            <img :src=\"players[item.pno-1].photo\" width='120' height='120' class=\"img-fluid rounded-circle\"\n              :alt=\"players[item.pno-1].post_title|lowercase\">\n            <span class=\"d-block ml-5\">\n              <i class=\"mx-1 flag-icon\" :class=\"'flag-icon-'+players[item.pno-1].country | lowercase\"\n                :title=\"players[item.pno-1].country_full\"></i>\n              <i class=\"mx-1 fa\"\n                :class=\"{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}\"\n                aria-hidden=\"true\">\n              </i>\n            </span>\n          </div>\n          <div class=\"d-flex flex-row justify-content-center align-content-center bg-dark text-white\">\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.points\">{{item.points}}</span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.rating_change\"><small v-if=\"item.rating_change >= 0\">Gained</small> {{item.rating_change}} points <small v-if=\"item.rating_change <= 0\">loss</small></span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\"\n                v-if=\"item.margin\">{{item.margin|addplus}}</span>\n              <span class=\"mx-1 text-center display-5 d-inline-block align-self-center\" v-if=\"item.score\">Round\n                {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class=\"d-flex justify-content-center align-items-center bg-success text-white\">\n              <div v-if=\"item.score\" class=\"display-4 yanone d-inline-flex\">{{item.score}}</div>\n              <div v-if=\"item.position\" class=\"display-4 yanone d-inline-flex\">{{item.position}}</div>\n              <div v-if=\"item.ave_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_score}}</div>\n              <div v-if=\"item.ave_opp_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_opp_score}}</div>\n              <div v-if=\"item.new_rating\" class=\"display-4 yanone d-inline-flex\">{{item.old_rating}} - {{item.new_rating}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n  ",
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

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],18:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _config = _interopRequireDefault(require("./config.js"));

var _this = void 0;

var store = new Vuex.Store({
  strict: false,
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
    player_stats: {}
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
    FETCH_API: function FETCH_API(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var url, response, headers, data;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config["default"], "tournament");
                _context.next = 4;
                return axios.get(url, {
                  params: {
                    page: payload
                  }
                });

              case 4:
                response = _context.sent;

                try {
                  headers = response.headers;
                  console.log('Getting lists of tournaments');
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
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    FETCH_DETAIL: function FETCH_DETAIL(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var url, response, headers, data, startDate;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config["default"], "tournament");
                _context2.prev = 2;
                _context2.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context2.sent;
                headers = response.headers;
                data = response.data[0];
                startDate = data.start_date;
                data.start_date = moment(new Date(startDate)).format('dddd, MMMM Do YYYY');
                context.commit('SET_WP_CONSTANTS', headers);
                context.commit('SET_DETAIL_LAST_ACCESS_TIME', headers.date);
                context.commit('SET_EVENTDETAIL', data);
                context.commit('SET_LOADING', false);
                _context2.next = 20;
                break;

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](2);
                context.commit('SET_LOADING', false);
                context.commit('SET_ERROR', _context2.t0.toString());

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 16]]);
      }))();
    },
    FETCH_DATA: function FETCH_DATA(context, payload) {
      return (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        var url, response, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds, rating_stats;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                context.commit('SET_LOADING', true);
                url = "".concat(_config["default"], "t_data");
                _context3.prev = 2;
                _context3.next = 5;
                return axios.get(url, {
                  params: {
                    slug: payload
                  }
                });

              case 5:
                response = _context3.sent;
                data = response.data[0];
                players = data.players;
                results = JSON.parse(data.results);
                console.log('FETCH DATA $store');
                console.log(data);
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
                _context3.next = 38;
                break;

              case 34:
                _context3.prev = 34;
                _context3.t0 = _context3["catch"](2);
                context.commit('SET_ERROR', _context3.t0.toString());
                context.commit('SET_LOADING', false);

              case 38:
                ;

              case 39:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 34]]);
      }))();
    },
    FETCH_RESDATA: function FETCH_RESDATA(context, payload) {
      context.commit('SET_LOADING', true);
      var url = "".concat(_config["default"], "t_data");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3JhdGluZ19zdGF0cy5qcyIsInZ1ZS9wYWdlcy9zY29yZWJvYXJkLmpzIiwidnVlL3BhZ2VzL3Njb3Jlc2hlZXQuanMiLCJ2dWUvcGFnZXMvc3RhdHMuanMiLCJ2dWUvcGFnZXMvdG9wLmpzIiwidnVlL3N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QWpDO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsS0FBOUI7QUFDQyxPQXRCRCxXQXNCUyxVQUFBLEtBQUssRUFBRztBQUNqQixRQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsV0FBZixFQUE0QixLQUFLLENBQUMsUUFBTixFQUE1QjtBQUNBLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO0FBQ0EsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLGFBQWYsRUFBOEIsS0FBOUI7QUFDRCxPQTFCQztBQTJCTDtBQTdITTtBQTlSa0IsQ0FBZixDQUFkLEMsQ0ErWkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJjb25zdCBiYXNlVVJMID0gJy93cC1qc29uL3dwL3YyLyc7XHJcbmV4cG9ydCB7YmFzZVVSTCBhcyBkZWZhdWx0fVxyXG5cclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUuanMnO1xyXG5pbXBvcnQgc2NyTGlzdCBmcm9tICcuL3BhZ2VzL2xpc3QuanMnO1xyXG5pbXBvcnQgdERldGFpbCBmcm9tICcuL3BhZ2VzL2RldGFpbC5qcyc7XHJcbmltcG9ydCBDYXRlRGV0YWlsIGZyb20gJy4vcGFnZXMvY2F0ZWdvcnkuanMnO1xyXG5pbXBvcnQgc0NhcmQgZnJvbSAnLi9wYWdlcy9zY29yZXNoZWV0LmpzJztcclxuXHJcblZ1ZS5maWx0ZXIoJ2FiYnJ2JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuICAnJztcclxuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgdmFyIGZpcnN0ID0gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XHJcbiAgdmFyIG4gPSB2YWx1ZS50cmltKCkuc3BsaXQoXCIgXCIpO1xyXG4gIHZhciBsYXN0ID0gbltuLmxlbmd0aCAtIDFdO1xyXG4gIHJldHVybiBmaXJzdCArIFwiLiBcIiArIGxhc3Q7XHJcbn0pO1xyXG5cclxuVnVlLmZpbHRlcignZmlyc3RjaGFyJywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSk7XHJcblxyXG4gIFZ1ZS5maWx0ZXIoJ2xvd2VyY2FzZScsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgfSlcclxuXHJcblZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBuID0gTWF0aC5mbG9vcihOdW1iZXIodmFsdWUpKTtcclxuICBpZiAobiAhPT0gSW5maW5pdHkgJiYgU3RyaW5nKG4pID09PSB2YWx1ZSAmJiBuID4gMCkge1xyXG4gICAgcmV0dXJuICcrJyArIHZhbHVlO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn0pO1xyXG5cclxuVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KEpTT04ucGFyc2UodmFsdWUpLCBudWxsLCAyKTtcclxufSk7XHJcblxyXG4gIGNvbnN0IHJvdXRlcyA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICBjb21wb25lbnQ6IHNjckxpc3QsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdOU0YgVG91cm5hbWVudHMgLSBSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50cy86c2x1ZycsXHJcbiAgICAgIG5hbWU6ICdUb3VybmV5RGV0YWlsJyxcclxuICAgICAgY29tcG9uZW50OiB0RGV0YWlsLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnVG91cm5hbWVudCBEZXRhaWxzJyB9LFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnJyxcclxuICAgICAgbmFtZTogJ0NhdGVEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IENhdGVEZXRhaWwsXHJcbiAgICAgIHByb3BzOiB0cnVlLFxyXG4gICAgICBtZXRhOiB7IHRpdGxlOiAnUmVzdWx0cyBhbmQgU3RhdGlzdGljcycgfSxcclxuICAgICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy90b3VybmFtZW50LzpldmVudF9zbHVnLzpwbm8nLFxyXG4gICAgICBuYW1lOiAnU2NvcmVzaGVldCcsXHJcbiAgICAgIGNvbXBvbmVudDogc0NhcmQsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdQbGF5ZXIgU2NvcmVjYXJkcycgfVxyXG4gICAgfVxyXG4gIF07XHJcblxyXG5jb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHtcclxuICBtb2RlOiAnaGlzdG9yeScsXHJcbiAgcm91dGVzOiByb3V0ZXMsIC8vIHNob3J0IGZvciBgcm91dGVzOiByb3V0ZXNgXHJcbn0pO1xyXG5yb3V0ZXIuYmVmb3JlRWFjaCgodG8sIGZyb20sIG5leHQpID0+IHtcclxuICBkb2N1bWVudC50aXRsZSA9IHRvLm1ldGEudGl0bGU7XHJcbiAgbmV4dCgpO1xyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gIGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyksXHJcbiAgcm91dGVyLFxyXG4gIHN0b3JlXHJcbn0pO1xyXG5cclxuXHJcbiIsInZhciBMb2FkaW5nQWxlcnQgPSBWdWUuY29tcG9uZW50KCdsb2FkaW5nJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgbWF4LXZ3LTc1IG10LTVcIj5cclxuXHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImxkcy1ibG9ja3MgbXQtNVwiIHdpZHRoPVwiMjAwcHhcIiAgaGVpZ2h0PVwiMjAwcHhcIiAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZFwiIHN0eWxlPVwiYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwKSBub25lIHJlcGVhdCBzY3JvbGwgMCUgMCU7XCI+PHJlY3QgeD1cIjE5XCIgeT1cIjE5XCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiNDBcIiB5PVwiMTlcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjAuMTVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCIxOVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC4zc1wiIGNhbGNNb2RlPVwiZGlzY3JldGVcIj48L2FuaW1hdGU+XHJcbiAgICAgIDwvcmVjdD48cmVjdCB4PVwiMTlcIiB5PVwiNDBcIiB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiBmaWxsPVwiIzQ1OTQ0OFwiPlxyXG4gICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9XCJmaWxsXCIgdmFsdWVzPVwiI2ZmZmZmZjsjNDU5NDQ4OyM0NTk0NDhcIiBrZXlUaW1lcz1cIjA7MC4xMjU7MVwiIGR1cj1cIjEuMnNcIiByZXBlYXRDb3VudD1cImluZGVmaW5pdGVcIiBiZWdpbj1cIjEuMDVzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI2MVwiIHk9XCI0MFwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC40NDk5OTk5OTk5OTk5OTk5NnNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjE5XCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjJzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjg5OTk5OTk5OTk5OTk5OTlzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgPC9yZWN0PjxyZWN0IHg9XCI0MFwiIHk9XCI2MVwiIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIGZpbGw9XCIjNDU5NDQ4XCI+XHJcbiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT1cImZpbGxcIiB2YWx1ZXM9XCIjZmZmZmZmOyM0NTk0NDg7IzQ1OTQ0OFwiIGtleVRpbWVzPVwiMDswLjEyNTsxXCIgZHVyPVwiMS4yc1wiIHJlcGVhdENvdW50PVwiaW5kZWZpbml0ZVwiIGJlZ2luPVwiMC43NXNcIiBjYWxjTW9kZT1cImRpc2NyZXRlXCI+PC9hbmltYXRlPlxyXG4gICAgICA8L3JlY3Q+PHJlY3QgeD1cIjYxXCIgeT1cIjYxXCIgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCIgZmlsbD1cIiM0NTk0NDhcIj5cclxuICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPVwiZmlsbFwiIHZhbHVlcz1cIiNmZmZmZmY7IzQ1OTQ0ODsjNDU5NDQ4XCIga2V5VGltZXM9XCIwOzAuMTI1OzFcIiBkdXI9XCIxLjFzXCIgcmVwZWF0Q291bnQ9XCJpbmRlZmluaXRlXCIgYmVnaW49XCIwLjJzXCIgY2FsY01vZGU9XCJkaXNjcmV0ZVwiPjwvYW5pbWF0ZT5cclxuICAgICAgIDwvcmVjdD48L3N2Zz5cclxuICAgICAgIDxoNCBjbGFzcz1cImRpc3BsYXktMyBiZWJhcyB0ZXh0LWNlbnRlciB0ZXh0LXNlY29uZGFyeVwiPkxvYWRpbmcuLlxyXG4gICAgICAgIDwhLS0gPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nLi48L3NwYW4+XHJcbiAgICAgICAgLS0+XHJcbiAgICAgICA8L2g0PlxyXG4gICAgPC9kaXY+YFxyXG4gfSk7XHJcblxyXG52YXIgRXJyb3JBbGVydCA9VnVlLmNvbXBvbmVudCgnZXJyb3InLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbXQtNSBteC1hdXRvIGQtYmxvY2sgbWF4LXZ3LTc1XCIgcm9sZT1cImFsZXJ0XCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJhbGVydC1oZWFkaW5nIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8c2xvdCBuYW1lPVwiZXJyb3JcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5FcnJvci4uLjwvc3Bhbj5cclxuICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yX21zZ1wiPjwvc2xvdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gLFxyXG4gICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICByZXR1cm4ge307XHJcbiAgIH0sXHJcbiB9KTtcclxuXHJcbiB2YXIgTG9naW5Gb3JtID1WdWUuY29tcG9uZW50KCdsb2dpbicsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgICA8Yi1mb3JtIEBzdWJtaXQ9XCJvblN1Ym1pdFwiIGlubGluZSBjbGFzcz1cInctODAgbXgtYXV0b1wiPlxyXG4gICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtdXNlcm5hbWVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgIDxiLWlucHV0XHJcbiAgICAgICBpZD1cImlubGluZS1mb3JtLWlucHV0LXVzZXJuYW1lXCJcclxuICAgICAgIGNsYXNzPVwibWItMiBtci1zbS0yIG1iLXNtLTBcIlxyXG4gICAgICAgdi1tb2RlbD1cInVzZXJcIiA+XHJcbiAgICAgIDwvYi1pbnB1dD5cclxuICAgICA8bGFiZWwgY2xhc3M9XCJzci1vbmx5XCIgZm9yPVwiaW5saW5lLWZvcm0taW5wdXQtcGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgIDxiLWlucHV0IGlkPVwiaW5saW5lLWZvcm0taW5wdXQtcGFzc3dvcmRcIiAgdi1tb2RlbD1cInBhc3NcIj48L2ItaW5wdXQ+XHJcbiAgICAgIDwvYi1pbnB1dC1ncm91cD5cclxuICAgICAgPGItYnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cIm1sLXNtLTJcIiBzbSB2YXJpYW50PVwib3V0bGluZS1wcmltYXJ5XCI+PGkgY2xhc3M9XCJmYSBmYS1zYXZlXCI+PC9pPjwvYi1idXR0b24+XHJcbiAgICAgIDwvYi1mb3JtPlxyXG4gICAgYCxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZvcm06IHtcclxuICAgICAgICBwYXNzOicnLFxyXG4gICAgICAgIHVzZXI6ICcnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBvblN1Ym1pdChldnQpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkodGhpcy5mb3JtKSlcclxuICAgIH0sXHJcbiAgICBvblJlc2V0KGV2dCkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAvLyBSZXNldCBvdXIgZm9ybSB2YWx1ZXNcclxuICAgICAgdGhpcy5mb3JtLnVzZXIgPSAnJztcclxuICAgICAgdGhpcy5mb3JtLnBhc3MgPSAnJztcclxuICAgICAgLy8gVHJpY2sgdG8gcmVzZXQvY2xlYXIgbmF0aXZlIGJyb3dzZXIgZm9ybSB2YWxpZGF0aW9uIHN0YXRlXHJcbiAgICAgIHRoaXMuc2hvdyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5zaG93ID0gdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcblxyXG5leHBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQsIExvZ2luRm9ybX1cclxuXHJcbiIsImltcG9ydCB7IFBhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHN9IGZyb20gJy4vcGxheWVybGlzdC5qcyc7XHJcbmltcG9ydCB7TG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0fSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmltcG9ydCB7IEhpV2lucywgTG9XaW5zLCBIaUxvc3MsIENvbWJvU2NvcmVzLCBUb3RhbFNjb3JlcywgVG90YWxPcHBTY29yZXMsIEF2ZVNjb3JlcywgQXZlT3BwU2NvcmVzLCBIaVNwcmVhZCwgTG9TcHJlYWQgfSBmcm9tICcuL3N0YXRzLmpzJztcclxuaW1wb3J0IFNjb3JlYm9hcmQgZnJvbSAnLi9zY29yZWJvYXJkLmpzJztcclxuaW1wb3J0IFJhdGluZ1N0YXRzIGZyb20gJy4vcmF0aW5nX3N0YXRzLmpzJztcclxuaW1wb3J0IHRvcFBlcmZvcm1lcnMgZnJvbSAnLi90b3AuanMnO1xyXG5leHBvcnQgeyBDYXRlRGV0YWlsIGFzIGRlZmF1bHQgfTtcclxubGV0IENhdGVEZXRhaWwgPSBWdWUuY29tcG9uZW50KCdjYXRlJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8ZGl2IHYtaWY9XCJyZXN1bHRkYXRhXCIgY2xhc3M9XCJyb3cgbm8tZ3V0dGVycyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLXRvcFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgICAgPGItYnJlYWRjcnVtYiA6aXRlbXM9XCJicmVhZGNydW1ic1wiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgdi1pZj1cImxvYWRpbmd8fGVycm9yXCIgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwiIShlcnJvcnx8bG9hZGluZylcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiID5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy0wXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxiLWltZyBmbHVpZCBjbGFzcz1cInRodW1ibmFpbCBsb2dvXCIgOnNyYz1cImxvZ29cIiA6YWx0PVwiZXZlbnRfdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIDp0aXRsZT1cInRvdGFsX3JvdW5kcysgJyByb3VuZHMsICcgKyB0b3RhbF9wbGF5ZXJzICsnIHBsYXllcnMnXCIgdi1zaG93PVwidG90YWxfcm91bmRzXCIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+e3sgdG90YWxfcm91bmRzIH19IEdhbWVzIHt7IHRvdGFsX3BsYXllcnN9fSA8aSBjbGFzcz1cImZhcyBmYS11c2Vyc1wiPjwvaT4gPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0wXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0wXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTBcIj48aSBjbGFzcz1cImZhIGZhLXVzZXJzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBQbGF5ZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzoxfX1cIj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIj48aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFNjb3JlY2FyZHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MVwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0xXCI+IDxpIGNsYXNzPVwiZmEgZmEtdXNlci1wbHVzXCI+PC9pPiBQYWlyaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTJcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTJcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MlwiPjxpIGNsYXNzPVwiZmFzIGZhLXN0aWNreS1ub3RlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBSZXN1bHRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlJvdW5kLUJ5LVJvdW5kIFN0YW5kaW5nc1wiIEBjbGljaz1cInZpZXdJbmRleD0zXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0zXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTNcIj48aSBjbGFzcz1cImZhcyBmYS1zb3J0LW51bWVyaWMtZG93biAgICBcIj48L2k+IFN0YW5kaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDYXRlZ29yeSBTdGF0aXN0aWNzXCIgQGNsaWNrPVwidmlld0luZGV4PTRcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTRcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NFwiPjxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LXBpZVwiPjwvaT4gU3RhdGlzdGljczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJSb3VuZC1CeS1Sb3VuZCBTY29yZWJvYXJkXCIgQGNsaWNrPVwidmlld0luZGV4PTVcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NVwiIDpwcmVzc2VkPVwidmlld0luZGV4PT01XCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhbGtib2FyZC10ZWFjaGVyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgU2NvcmVib2FyZDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJUb3AgMyBQZXJmb3JtYW5jZXNcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9NlwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT02XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTZcIj48aSBjbGFzcz1cImZhcyBmYS1tZWRhbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIFRvcCBQZXJmb3JtZXJzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIlBvc3QtdG91cm5leSBSYXRpbmcgU3RhdGlzdGljc1wiIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiBAY2xpY2s9XCJ2aWV3SW5kZXg9N1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT03XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTdcIj48aSBjbGFzcz1cImZhcyBmYS1zdHJlYW1cIj48L2k+XHJcbiAgICAgICAgICAgICAgICBSYXRpbmcgU3RhdHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMSBjb2wtMTIgZC1mbGV4IGZsZXgtY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXMgcC0wIG0tMFwiPiB7e3RhYl9oZWFkaW5nfX1cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwidmlld0luZGV4ID4wICYmIHZpZXdJbmRleCA8IDRcIj5cclxuICAgICAgICAgICAgICB7eyBjdXJyZW50Um91bmQgfX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dQYWdpbmF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cInRvdGFsX3JvdW5kc1wiIHYtbW9kZWw9XCJjdXJyZW50Um91bmRcIiA6cGVyLXBhZ2U9XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgY2hhbmdlPVwicm91bmRDaGFuZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgPC9iLXBhZ2luYXRpb24+XHJcbiAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT0wXCI+XHJcbiAgICAgICAgICA8YWxscGxheWVycyA6c2x1Zz1cInNsdWdcIj48L2FsbHBsYXllcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInZpZXdJbmRleD09NlwiPlxyXG4gICAgICAgICAgPHBlcmZvcm1lcnM+PC9wZXJmb3JtZXJzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTdcIj5cclxuICAgICAgICAgIDxyYXRpbmdzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpjb21wdXRlZF9pdGVtcz1cImNvbXB1dGVkX3JhdGluZ19pdGVtc1wiPlxyXG4gICAgICAgICAgPC9yYXRpbmdzPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtZWxzZS1pZj1cInZpZXdJbmRleD09NVwiPlxyXG4gICAgICAgIDxzY29yZWJvYXJkPjwvc2NvcmVib2FyZD5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDxkaXYgdi1lbHNlLWlmPVwidmlld0luZGV4PT00XCIgY2xhc3M9XCJyb3cgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtMTAgb2Zmc2V0LW1kLTAgY29sXCI+XHJcbiAgICAgICAgICAgICAgICA8Yi10YWJzIGNvbnRlbnQtY2xhc3M9XCJtdC0zIHN0YXRzVGFic1wiIHBpbGxzIHNtYWxsIGxhenkgbm8tZmFkZSAgdi1tb2RlbD1cInRhYkluZGV4XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiSGlnaCBXaW5zXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhpd2lucyAgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGl3aW5zPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiSGlnaCBMb3NzZXNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlsb3NzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hpbG9zcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBXaW5zXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvd2lucyAgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbG93aW5zPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiQ29tYmluZWQgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxjb21ib3Njb3JlcyA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9jb21ib3Njb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dG90YWxzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygndG90YWxfc2NvcmUnKVwiPjwvdG90YWxzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJUb3RhbCBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygndG90YWxfb3Bwc2NvcmUnKVwiPjwvb3Bwc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiQXZlIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YXZlc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ2F2ZV9zY29yZScpXCI+PC9hdmVzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgT3BwIFNjb3Jlc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YXZlb3Bwc2NvcmVzIDpjYXB0aW9uPVwiY2FwdGlvblwiIDpzdGF0cz1cImZldGNoU3RhdHMoJ2F2ZV9vcHBzY29yZScpXCI+PC9hdmVvcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFNwcmVhZHMgXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhpc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvaGlzcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJMb3cgU3ByZWFkc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsb3NwcmVhZCA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L2xvc3ByZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICA8L2ItdGFicz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IG9mZnNldC1tZC0yIGNvbC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPHBhaXJpbmdzIHYtaWY9XCJ2aWV3SW5kZXg9PTFcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9wYWlyaW5ncz5cclxuICAgICAgICAgICAgICAgIDxyZXN1bHRzIHYtaWY9XCJ2aWV3SW5kZXg9PTJcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9yZXN1bHRzPlxyXG4gICAgICAgICAgICAgICAgPHN0YW5kaW5ncyB2LWlmPVwidmlld0luZGV4PT0zXCIgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvc3RhbmRpbmdzPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICAgIGFsbHBsYXllcnM6IFBsYXllckxpc3QsXHJcbiAgICBwYWlyaW5nczogUGFpcmluZ3MsXHJcbiAgICByZXN1bHRzOiBSZXN1bHRzLFxyXG4gICAgcmF0aW5nczogUmF0aW5nU3RhdHMsXHJcbiAgICBzdGFuZGluZ3M6IFN0YW5kaW5ncyxcclxuICAgIGhpd2luczogSGlXaW5zLFxyXG4gICAgaGlsb3NzOiBIaUxvc3MsXHJcbiAgICBsb3dpbjogTG9XaW5zLFxyXG4gICAgY29tYm9zY29yZXM6IENvbWJvU2NvcmVzLFxyXG4gICAgdG90YWxzY29yZXM6IFRvdGFsU2NvcmVzLFxyXG4gICAgb3Bwc2NvcmVzOiBUb3RhbE9wcFNjb3JlcyxcclxuICAgIGF2ZXNjb3JlczogQXZlU2NvcmVzLFxyXG4gICAgYXZlb3Bwc2NvcmVzOiBBdmVPcHBTY29yZXMsXHJcbiAgICBoaXNwcmVhZDogSGlTcHJlYWQsXHJcbiAgICBsb3NwcmVhZDogTG9TcHJlYWQsXHJcbiAgICAvLyAnbHVja3lzdGlmZi10YWJsZSc6IEx1Y2t5U3RpZmZUYWJsZSxcclxuICAgIC8vICd0dWZmbHVjay10YWJsZSc6IFR1ZmZMdWNrVGFibGVcclxuICAgIHNjb3JlYm9hcmQ6IFNjb3JlYm9hcmQsXHJcbiAgICBwZXJmb3JtZXJzOiB0b3BQZXJmb3JtZXJzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgdG91cm5leV9zbHVnOiAnJyxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBnYW1lZGF0YTogW10sXHJcbiAgICAgIHRhYkluZGV4OiAwLFxyXG4gICAgICB2aWV3SW5kZXg6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogMSxcclxuICAgICAgdGFiX2hlYWRpbmc6ICcnLFxyXG4gICAgICBjYXB0aW9uOiAnJyxcclxuICAgICAgc2hvd1BhZ2luYXRpb246IGZhbHNlLFxyXG4gICAgICBjb21wdXRlZF9yYXRpbmdfaXRlbXM6IFtdLFxyXG4gICAgICBsdWNreXN0aWZmOiBbXSxcclxuICAgICAgdHVmZmx1Y2s6IFtdLFxyXG4gICAgICB0aW1lcjogJycsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2F0ZWdvcnkgbW91bnRlZCcpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5wbGF5ZXJzKTtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgdGhpcy5mZXRjaERhdGEoKTtcclxuICB9LFxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3SW5kZXg6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICBpZiAodmFsICE9IDQpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Vmlldyh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJhdGluZ19zdGF0czoge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRWaWV3OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRWaWV3IGZ1bmN0aW9uIHZhbC0+ICcgKyB2YWwpO1xyXG4gICAgICBzd2l0Y2ggKHZhbCkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGxheWVycyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQYWlyaW5nIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcqUGxheXMgZmlyc3QnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1Jlc3VsdHMgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1Jlc3VsdHMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1N0YW5kaW5ncyBhZnRlciBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnU3RhbmRpbmdzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUG9zdCBUb3VybmFtZW50IFJhdGluZyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYXRpbmcgU3RhdGlzdGljcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICcnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vIHRleHQ6IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KSxcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0ICBiYXNlVVJMICBmcm9tICcuLi9jb25maWcuanMnO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5sZXQgdERldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ3RkZXRhaWwnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgdGV4dC1jZW50ZXIgZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtbGctY2VudGVyIGp1c3RpZnktY29udGVudC1zdGFydFwiPlxyXG4gICAgICAgICAgICA8Yi1pbWcgc2xvdD1cImFzaWRlXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIiBjbGFzcz1cImFsaWduLXNlbGYtY2VudGVyIG1yLTMgcm91bmRlZCBpbWctZmx1aWRcIlxyXG4gICAgICAgICAgICAgIDpzcmM9XCJ0b3VybmV5LmV2ZW50X2xvZ29cIiB3aWR0aD1cIjE1MFwiIGhlaWdodD1cIjE1MFwiIDphbHQ9XCJ0b3VybmV5LmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJteC0xIGRpc3BsYXktNFwiPlxyXG4gICAgICAgICAgICAgIHt7dG91cm5leS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyXCIgaWQ9XCJldmVudC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnN0YXJ0X2RhdGVcIj48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnN0YXJ0X2RhdGV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnZlbnVlXCI+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiB7e3RvdXJuZXkudmVudWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaWY9XCJ0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3JcIj48aSBjbGFzcz1cImZhIGZhLWxlZ2FsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3J9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxoNT5cclxuICAgICAgICAgICAgICBDYXRlZ29yaWVzIDxpIGNsYXNzPVwiZmEgZmEtbGlzdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtZm9yPVwiKGNhdCwgYykgaW4gdG91cm5leS50b3VfY2F0ZWdvcmllc1wiIDprZXk9XCJjXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImNhdC5ldmVudF9pZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnQ2F0ZURldGFpbCcsIHBhcmFtczogeyBzbHVnOiB0b3VybmV5LnNsdWcgLCBldmVudF9zbHVnOmNhdC5ldmVudF9zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7Y2F0LmNhdF9uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gICAgICAgYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHBhZ2V1cmw6IGAke2Jhc2VVUkx9dG91cm5hbWVudGAgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLnRvdXJuZXkudGl0bGU7XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgaWYgKHRoaXMudG91cm5leS5zbHVnICE9IHRoaXMuc2x1Zykge1xyXG4gICAgICAgIC8vIHJlc2V0IHRpdGxlIGJlY2F1c2Ugb2YgYnJlYWRjcnVtYnNcclxuICAgICAgICB0aGlzLnRvdXJuZXkudGl0bGUgPSAnJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgZSA9IHRoaXMudG91bGlzdC5maW5kKGV2ZW50ID0+IGV2ZW50LnNsdWcgPT09IHRoaXMuc2x1Zyk7XHJcbiAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgbGV0IG5vdyA9IG1vbWVudCgpO1xyXG4gICAgICAgIGNvbnN0IGEgPSBtb21lbnQodGhpcy5sYXN0X2FjY2Vzc190aW1lKTtcclxuICAgICAgICBjb25zdCB0aW1lX2VsYXBzZWQgPSBub3cuZGlmZihhLCAnc2Vjb25kcycpO1xyXG4gICAgICAgIGlmICh0aW1lX2VsYXBzZWQgPCAzMDApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tTWF0Y2ggRm91bmQgaW4gVG91cm5leSBMaXN0LS0tLS0tLS0tLScpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aW1lX2VsYXBzZWQpO1xyXG4gICAgICAgICAgdGhpcy50b3VybmV5ID0gZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREVUQUlMJywgdGhpcy5zbHVnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgLy8gdG91cm5leTogJ0RFVEFJTCcsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGxhc3RfYWNjZXNzX3RpbWU6ICdUT1VBQ0NFU1NUSU1FJyxcclxuICAgICAgdG91bGlzdDogJ1RPVUFQSSdcclxuICAgIH0pLFxyXG4gICAgdG91cm5leToge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3RvcmUuZ2V0dGVycy5ERVRBSUw7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgbmV3VmFsKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5LnRpdGxlLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3Vlcy4gUGxlYXNlIHJlZnJlc2ggdG8gdHJ5IGFnYWluIGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4gZXhwb3J0IGRlZmF1bHQgdERldGFpbDtcclxuIiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbi8vIGxldCBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQ7XHJcbmltcG9ydCB7TG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0LCBMb2dpbkZvcm19IGZyb20gJy4vYWxlcnRzLmpzJztcclxubGV0IHNjckxpc3QgPSBWdWUuY29tcG9uZW50KCdzY3JMaXN0Jywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8bG9naW5mb3JtIC8+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMiBjbGFzcz1cImJlYmFzIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRyb3BoeVwiPjwvaT4gVG91cm5hbWVudHNcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIj5cclxuICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCIrV1B0b3RhbFwiIEBjaGFuZ2U9XCJmZXRjaExpc3RcIiB2LW1vZGVsPVwiY3VycmVudFBhZ2VcIiA6cGVyLXBhZ2U9XCIxMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIC8+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+IFlvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXM7IDxzcGFuIGNsYXNzPVwiZW1waGFzaXplXCI+e3tXUHRvdGFsfX08L3NwYW4+IHRvdXJuYW1lbnRzITwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgIGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiIHYtZm9yPVwiaXRlbSBpbiB0b3VybmV5c1wiIDprZXk9XCJpdGVtLmlkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnQgdG91cm5leS1saXN0IGFuaW1hdGVkIGJvdW5jZUluTGVmdFwiID5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy01XCI+XHJcbiAgICAgICAgICAgIDxyb3V0ZXItbGluayA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgPGItaW1nIGZsdWlkIGNsYXNzPVwidGh1bWJuYWlsXCJcclxuICAgICAgICAgICAgICAgICAgOnNyYz1cIml0ZW0uZXZlbnRfbG9nb1wiIHdpZHRoPVwiMTAwXCIgIGhlaWdodD1cIjEwMFwiIDphbHQ9XCJpdGVtLmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXItbGctYXV0b1wiPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJtYi0xIGRpc3BsYXktNVwiPlxyXG4gICAgICAgICAgICA8cm91dGVyLWxpbmsgdi1pZj1cIml0ZW0uc2x1Z1wiIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgIHt7aXRlbS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgICA8c21hbGw+PGkgY2xhc3M9XCJmYSBmYS1jYWxlbmRhclwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICB7e2l0ZW0uc3RhcnRfZGF0ZX19XHJcbiAgICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICA8c21hbGw+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICB7e2l0ZW0udmVudWV9fVxyXG4gICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgdi1pZj1cIml0ZW0uc2x1Z1wiIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPHNtYWxsIHRpdGxlPVwiQnJvd3NlIHRvdXJuZXlcIj48aSBjbGFzcz1cImZhIGZhLWxpbmtcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC11bnN0eWxlZCBsaXN0LWlubGluZSB0ZXh0LWNlbnRlciBjYXRlZ29yeS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbSBteC1hdXRvXCJcclxuICAgICAgICAgICAgICB2LWZvcj1cImNhdGVnb3J5IGluIGl0ZW0udG91X2NhdGVnb3JpZXNcIj57e2NhdGVnb3J5LmNhdF9uYW1lfX08L2xpPlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtbGctZW5kXCI+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cIm15LTAgcHktMFwiPjxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWRcIj5Zb3UgYXJlIG9uIHBhZ2Uge3tjdXJyZW50UGFnZX19IG9mIHt7V1BwYWdlc319IHBhZ2VzIHdpdGggPHNwYW4gY2xhc3M9XCJlbXBoYXNpemVcIj57e1dQdG90YWx9fTwvc3Bhbj5cclxuICAgICAgICAgIHRvdXJuYW1lbnRzITwvc21hbGw+PC9wPlxyXG4gICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgbG9naW5mb3JtOiBMb2dpbkZvcm1cclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICB9O1xyXG4gICAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdC5qcyBsb2FkZWQnKVxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnU2NyYWJibGUgVG91cm5hbWVudHMgLSBOU0YnO1xyXG4gICAgdGhpcy5mZXRjaExpc3QodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaExpc3Q6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuICAgICAgLy90aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFnZU51bSwge1xyXG4gICAgICAgIC8vIHRpbWVvdXQ6IDM2MDAwMDAgLy8xIGhvdXIgY2FjaGVcclxuICAgICAvLyB9KTtcclxuICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBwYWdlTnVtO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFnZU51bSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdkb25lIScpO1xyXG4gICAgfSxcclxuXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4ubWFwR2V0dGVycyh7XHJcbiAgICAgIHRvdXJuZXlzOiAnVE9VQVBJJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgV1B0b3RhbDogJ1dQVE9UQUwnLFxyXG4gICAgICBXUHBhZ2VzOiAnV1BQQUdFUycsXHJcbiAgICB9KSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnTlNGIE5ld3MnLFxyXG4gICAgICAgICAgaHJlZjogJy8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBTb3JyeSB3ZSBhcmUgY3VycmVudGx5IGhhdmluZyB0cm91YmxlIGZpbmRpbmcgdGhlIGxpc3Qgb2YgdG91cm5hbWVudHMuYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiBleHBvcnQgZGVmYXVsdCBzY3JMaXN0OyIsInZhciBwbGF5ZXJfbWl4ZWRfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYW5rX3NlcmllcyA9IFt7IG5hbWU6ICcnLCAgZGF0YTogW10gfV07XHJcbnZhciBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyA9IFtdICA7XHJcbnZhciBwbGF5ZXJfcmFkaWFsX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBwbG90T3B0aW9uczoge1xyXG4gICAgcmFkaWFsQmFyOiB7XHJcbiAgICAgIGhvbGxvdzogeyBzaXplOiAnNTAlJywgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbG9yczogW10sXHJcbiAgbGFiZWxzOiBbXSxcclxufTtcclxuXHJcbnZhciBwbGF5ZXJfcmFua19jaGFydF9jb25maWcgPSB7XHJcbiAgY2hhcnQ6IHtcclxuICAgIGhlaWdodDogNDAwLFxyXG4gICAgem9vbToge1xyXG4gICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHNoYWRvdzoge1xyXG4gICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICBjb2xvcjogJyMwMDAnLFxyXG4gICAgICB0b3A6IDE4LFxyXG4gICAgICBsZWZ0OiA3LFxyXG4gICAgICBibHVyOiAxMCxcclxuICAgICAgb3BhY2l0eTogMVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbG9yczogWycjNzdCNkVBJywgJyM1NDU0NTQnXSxcclxuICBkYXRhTGFiZWxzOiB7XHJcbiAgICBlbmFibGVkOiB0cnVlXHJcbiAgfSxcclxuICBzdHJva2U6IHtcclxuICAgIGN1cnZlOiAnc21vb3RoJyAvLyBzdHJhaWdodFxyXG4gIH0sXHJcbiAgdGl0bGU6IHtcclxuICAgIHRleHQ6ICcnLFxyXG4gICAgYWxpZ246ICdsZWZ0J1xyXG4gIH0sXHJcbiAgZ3JpZDoge1xyXG4gICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgIHJvdzoge1xyXG4gICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgb3BhY2l0eTogMC41XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgeGF4aXM6IHtcclxuICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgdGl0bGU6IHtcclxuICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgIH1cclxuICB9LFxyXG4gIHlheGlzOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgfSxcclxuICAgIG1pbjogbnVsbCxcclxuICAgIG1heDogbnVsbFxyXG4gIH0sXHJcbiAgbGVnZW5kOiB7XHJcbiAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgIG9mZnNldFk6IC0yNSxcclxuICAgIG9mZnNldFg6IC01XHJcbiAgfVxyXG59O1xyXG5cclxudmFyIFBsYXllclN0YXRzID0gVnVlLmNvbXBvbmVudCgncGxheWVyc3RhdHMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEwIG9mZnNldC1sZy0xIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkxlZnRCaWdcIiBpZD1cInBoZWFkZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgbXQtNVwiPlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtY2VudGVyIGJlYmFzXCI+e3twbGF5ZXJOYW1lfX1cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayBteC1hdXRvXCIgc3R5bGU9XCJmb250LXNpemU6c21hbGxcIj5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0zIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXIuY291bnRyeSB8IGxvd2VyY2FzZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0zIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PSAnbScsXHJcbiAgICAgICAgICAgICAgICAgICAnZmEtZmVtYWxlJzogcGxheWVyLmdlbmRlciA9PSAnZicsJ2ZhLXVzZXJzJzogcGxheWVyLmlzX3RlYW0gPT0gJ3llcycgfVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGltZyB3aWR0aD1cIjEwMHB4XCIgaGVpZ2h0PVwiMTAwcHhcIiBjbGFzcz1cImltZy10aHVtYm5haWwgaW1nLWZsdWlkIG14LTMgZC1ibG9jayBzaGFkb3ctc21cIlxyXG4gICAgICAgICAgICAgICAgOnNyYz1cInBsYXllci5waG90b1wiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxoNCBjbGFzcz1cInRleHQtY2VudGVyIHlhbm9uZSBteC0zXCI+e3twc3RhdHMucFBvc2l0aW9ufX0gcG9zaXRpb248L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PiA8IS0tICNwaGVhZGVyLS0+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMSBjbGFzcz1cIm0tMVwiPlF1aWNrIFN0YXRzPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMiBjbGFzcz1cIm0tMVwiPlJvdW5kIGJ5IFJvdW5kIDwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idG4gdi1iLXRvZ2dsZS5jb2xsYXBzZTMgY2xhc3M9XCJtLTFcIj5DaGFydHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnV0dG9uIHRpdGxlPVwiQ2xvc2VcIiBzaXplPVwic21cIiBAY2xpY2s9XCJjbG9zZUNhcmQoKVwiIGNsYXNzPVwibS0xXCIgdmFyaWFudD1cIm91dGxpbmUtZGFuZ2VyXCIgOmRpc2FibGVkPVwiIXNob3dcIlxyXG4gICAgICAgICAgICA6cHJlc3NlZC5zeW5jPVwic2hvd1wiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYi1idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctOCBvZmZzZXQtbGctMlwiPlxyXG4gICAgICAgIDxiLWNvbGxhcHNlIGlkPVwiY29sbGFwc2UxXCI+XHJcbiAgICAgICAgICA8Yi1jYXJkIGNsYXNzPVwiYW5pbWF0ZWQgZmxpcEluWFwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgdGV4dC1jZW50ZXJcIj5RdWljayBTdGF0czwvZGl2PlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwIGxpc3QtZ3JvdXAtZmx1c2ggc3RhdHNcIj5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Qb2ludHM6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wUG9pbnRzfX0gLyB7e3RvdGFsX3JvdW5kc319PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+UmFuazpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBSYW5rfX0gPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+SGlnaGVzdCBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBIaVNjb3JlfX08L3NwYW4+IChyZCA8ZW0+e3twc3RhdHMucEhpU2NvcmVSb3VuZHN9fTwvZW0+KVxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+TG93ZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucExvU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wTG9TY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5BdmUgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5BdmUgT3BwIFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEF2ZU9wcH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2ItY2FyZD5cclxuICAgICAgICA8L2ItY29sbGFwc2U+XHJcbiAgICAgICAgPCEtLS0tIFJvdW5kIEJ5IFJvdW5kIFJlc3VsdHMgLS0+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTJcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgICAgICA8aDQ+Um91bmQgQnkgUm91bmQgU3VtbWFyeSA8L2g0PlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWdyb3VwIGxpc3QtZ3JvdXAtZmx1c2hcIiB2LWZvcj1cIihyZXBvcnQsIGkpIGluIHBzdGF0cy5wUmJ5UlwiIDprZXk9XCJpXCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWlmPVwicmVwb3J0LnJlc3VsdD09J3dpbidcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tc3VjY2Vzc1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdkcmF3J1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0td2FybmluZ1wiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZS1pZj1cInJlcG9ydC5yZXN1bHQgPT0nbG9zcydcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWRhbmdlclwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZS1pZj1cInJlcG9ydC5yZXN1bHQgPT0nYXdhaXRpbmcnXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWluZm9cIj5cclxuICAgICAgICAgICAgICAgIHt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tbGlnaHRcIj57e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2ItY2FyZD5cclxuICAgICAgICA8L2ItY29sbGFwc2U+XHJcbiAgICAgICAgPCEtLSBDaGFydHMgLS0+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTNcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5Eb3duXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlN0YXRzIENoYXJ0czwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgnbWl4ZWQnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUtY3N2XCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IE1peGVkIFNjb3JlczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ3JhbmsnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J3JhbmsnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0ncmFuaydcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFydC1saW5lXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFJhbmsgcGVyIFJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgnd2lucycpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0nd2lucydcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWJhbGFuY2Utc2NhbGUgZmEtc3RhY2tcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gU3RhcnRzL1JlcGxpZXMgV2lucyglKTwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2hhcnRcIj5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCIgdHlwZT1saW5lIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdGlvbnNcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc01peGVkXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0ncmFuaydcIiB0eXBlPSdsaW5lJyBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zUmFua1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzUmFua1wiIC8+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgdHlwZT1yYWRpYWxCYXIgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0UmFkaWFsXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYWRpYWxcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIHByb3BzOiBbJ3BzdGF0cyddLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGFwZXhjaGFydDogVnVlQXBleENoYXJ0cyxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBsYXllcjogJycsXHJcbiAgICAgIHNob3c6IHRydWUsXHJcbiAgICAgIHBsYXllck5hbWU6ICcnLFxyXG4gICAgICBhbGxTY29yZXM6IFtdLFxyXG4gICAgICBhbGxPcHBTY29yZXM6IFtdLFxyXG4gICAgICBhbGxSYW5rczogW10sXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICAgIGNoYXJ0TW9kZWw6ICdyYW5rJyxcclxuICAgICAgc2VyaWVzTWl4ZWQ6IHBsYXllcl9taXhlZF9zZXJpZXMsXHJcbiAgICAgIHNlcmllc1Jhbms6IHBsYXllcl9yYW5rX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFkaWFsOiBwbGF5ZXJfcmFkaWFsX2NoYXJ0X3NlcmllcyxcclxuICAgICAgY2hhcnRPcHRSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnLFxyXG4gICAgICBjaGFydE9wdGlvbnNSYW5rOiBwbGF5ZXJfcmFua19jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uczoge1xyXG4gICAgICAgIGNoYXJ0OiB7XHJcbiAgICAgICAgICBoZWlnaHQ6IDQwMCxcclxuICAgICAgICAgIHpvb206IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzaGFkb3c6IHtcclxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgICAgY29sb3I6ICcjMDAwJyxcclxuICAgICAgICAgICAgdG9wOiAxOCxcclxuICAgICAgICAgICAgbGVmdDogNyxcclxuICAgICAgICAgICAgYmx1cjogMTAsXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbG9yczogWycjOEZCQzhGJywgJyM1NDU0NTQnXSxcclxuICAgICAgICBkYXRhTGFiZWxzOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdHJva2U6IHtcclxuICAgICAgICAgIGN1cnZlOiAnc3RyYWlnaHQnIC8vIHNtb290aFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgIHRleHQ6ICcnLFxyXG4gICAgICAgICAgYWxpZ246ICdsZWZ0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JpZDoge1xyXG4gICAgICAgICAgYm9yZGVyQ29sb3I6ICcjZTdlN2U3JyxcclxuICAgICAgICAgIHJvdzoge1xyXG4gICAgICAgICAgICBjb2xvcnM6IFsnI2YzZjNmMycsICd0cmFuc3BhcmVudCddLCAvLyB0YWtlcyBhbiBhcnJheSB3aGljaCB3aWxsIGJlIHJlcGVhdGVkIG9uIGNvbHVtbnNcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeGF4aXM6IHtcclxuICAgICAgICAgIGNhdGVnb3JpZXM6IFtdLFxyXG4gICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJ1JvdW5kcydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHlheGlzOiB7XHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG1pbjogbnVsbCxcclxuICAgICAgICAgIG1heDogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICBwb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgICBob3Jpem9udGFsQWxpZ246ICdyaWdodCcsXHJcbiAgICAgICAgICBmbG9hdGluZzogdHJ1ZSxcclxuICAgICAgICAgIG9mZnNldFk6IC0yNSxcclxuICAgICAgICAgIG9mZnNldFg6IC01XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRvU2Nyb2xsKCk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNlcmllc1JhZGlhbClcclxuICAgIHRoaXMuc2hvdyA9IHRoaXMuc2hvd1N0YXRzO1xyXG4gICAgdGhpcy5hbGxTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsT3BwU2NvcmVzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbE9wcFNjb3Jlcyk7XHJcbiAgICB0aGlzLmFsbFJhbmtzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbFJhbmtzKTtcclxuICAgIHRoaXMudXBkYXRlQ2hhcnQodGhpcy5jaGFydE1vZGVsKTtcclxuICAgIHRoaXMudG90YWxfcGxheWVycyA9IHRoaXMucGxheWVycy5sZW5ndGg7XHJcbiAgICB0aGlzLnBsYXllciA9IHRoaXMucHN0YXRzLnBsYXllclswXTtcclxuICAgIHRoaXMucGxheWVyTmFtZSA9IHRoaXMucGxheWVyLnBvc3RfdGl0bGU7XHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95KCkge1xyXG4gICAgdGhpcy5jbG9zZUNhcmQoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuXHJcbiAgICBkb1Njcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxyXG4gICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtteUZ1bmN0aW9uKCl9O1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhlYWRlclwiKTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcclxuICAgICAgdmFyIHN0aWNreSA9IGhlYWRlci5vZmZzZXRUb3A7XHJcbiAgICAgIHZhciBoID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDUwO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IChzdGlja3kgKyBoKSkge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBzZXRDaGFydENhdGVnb3JpZXM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCByb3VuZHMgPSBfLnJhbmdlKDEsIHRoaXMudG90YWxfcm91bmRzICsgMSk7XHJcbiAgICAgIGxldCByZHMgPSBfLm1hcChyb3VuZHMsIGZ1bmN0aW9uKG51bSl7IHJldHVybiAnUmQgJysgbnVtOyB9KTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMueGF4aXMuY2F0ZWdvcmllcyA9IHJkcztcclxuICAgIH0sXHJcbiAgICB1cGRhdGVDaGFydDogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLVVwZGF0aW5nLi4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLmNoYXJ0TW9kZWwgPSB0eXBlO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS5hbGlnbiA9ICdsZWZ0JztcclxuICAgICAgdmFyIGZpcnN0TmFtZSA9IF8udHJpbShfLnNwbGl0KHRoaXMucGxheWVyTmFtZSwgJyAnLCAyKVswXSk7XHJcbiAgICAgIGlmICgncmFuaycgPT0gdHlwZSkge1xyXG4gICAgICAgIC8vIHRoaXMuID0gJ2Jhcic7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnRpdGxlLnRleHQgPWBSYW5raW5nOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5taW4gPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5tYXggPXRoaXMudG90YWxfcGxheWVycztcclxuICAgICAgICB0aGlzLnNlcmllc1JhbmsgPSBbe1xyXG4gICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfSByYW5rIHRoaXMgcmRgLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxSYW5rc1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCdtaXhlZCcgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2hhcnRDYXRlZ29yaWVzKClcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS50ZXh0ID0gYFNjb3JlczogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5taW4gPSAxMDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWF4ID0gOTAwO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzTWl4ZWQgPSBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX1gLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmFsbFNjb3Jlc1xyXG4gICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnT3Bwb25lbnQnLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxPcHBTY29yZXNcclxuICAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ3dpbnMnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscz0gW107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMgPVtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzLnVuc2hpZnQoJ1N0YXJ0czogJSBXaW5zJywnUmVwbGllczogJSBXaW5zJyk7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMudW5zaGlmdCgnIzdDRkMwMCcsICcjQkRCNzZCJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGFydE9wdFJhZGlhbCk7XHJcbiAgICAgICAgdmFyIHMgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5zdGFydFdpbnMgLyB0aGlzLnBzdGF0cy5zdGFydHMpLDEpO1xyXG4gICAgICAgIHZhciByID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMucmVwbHlXaW5zIC8gdGhpcy5wc3RhdHMucmVwbGllcyksMSk7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwgPSBbXTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbC51bnNoaWZ0KHMscik7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZXJpZXNSYWRpYWwpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgY2xvc2VDYXJkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLUNsb3NpbmcgQ2FyZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsIGZhbHNlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHNob3dTdGF0czogJ1NIT1dTVEFUUycsXHJcbiAgICB9KSxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG52YXIgUGxheWVyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ2FsbHBsYXllcnMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dTdGF0c1wiPlxyXG4gICAgICAgIDxwbGF5ZXJzdGF0cyA6cHN0YXRzPVwicFN0YXRzXCI+PC9wbGF5ZXJzdGF0cz5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgPGRpdiBpZD1cInAtbGlzdFwiIGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICA8dHJhbnNpdGlvbi1ncm91cCB0YWc9XCJkaXZcIiBuYW1lPVwicGxheWVycy1saXN0XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGxheWVyQ29scyBteC0yIHAtMiBtYi00XCIgdi1mb3I9XCJwbGF5ZXIgaW4gZGF0YVwiIDprZXk9XCJwbGF5ZXIuaWRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uXCI+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzcz1cIm9zd2FsZFwiPjxzbWFsbD4je3twbGF5ZXIucG5vfX08L3NtYWxsPlxyXG4gICAgICAgICAgICB7e3BsYXllci5wbGF5ZXJ9fTxzcGFuIGNsYXNzPVwibWwtMlwiIEBjbGljaz1cInNvcnRQb3MoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSB2LWlmPVwiYXNjXCIgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBERVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48aSB2LWVsc2UgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtdXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHNvcnQgQVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48L3NwYW4+PHNwYW4gdi1pZj1cInNvcnRlZFwiIGNsYXNzPVwibWwtM1wiIEBjbGljaz1cInJlc3RvcmVTb3J0KClcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC1zaXplOjAuOGVtXCI+PGkgY2xhc3M9XCJmYSBmYS11bmRvXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byByZXNldCBsaXN0XCI+PC9pPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG8gbXktMVwiICBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm14LWF1dG8gZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCIgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJtbC0yIGZhXCIgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PSAnbScsXHJcbiAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLFxyXG4gICAgICAgICdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImNvbG9yOnRvbWF0bzsgZm9udC1zaXplOjEuNGVtXCIgY2xhc3M9XCJtbC01XCIgdi1pZj1cInNvcnRlZFwiPnt7cGxheWVyLnBvc2l0aW9ufX08L3NwYW4+XHJcbiAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWJsb2NrIHRleHQtY2VudGVyIGFuaW1hdGVkIGZhZGVJbiBwZ2FsbGVyeVwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCIgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIj48L2ItaW1nLWxhenk+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtYmxvY2sgbXQtMiBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gQGNsaWNrPVwic2hvd1BsYXllclN0YXRzKHBsYXllci5pZClcIiB0aXRsZT1cIlNob3cgIHN0YXRzXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtYmFyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1sLTRcIiB0aXRsZT1cIlNob3cgU2NvcmVjYXJkXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayBleGFjdCA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzpwbGF5ZXIucG5vfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8IS0tLXBvcG92ZXIgLS0+XHJcbiAgICAgICAgICAgICAgPGItcG9wb3ZlciBAc2hvdz1cImdldExhc3RHYW1lcyhwbGF5ZXIucG5vKVwiIHBsYWNlbWVudD1cImJvdHRvbVwiICA6dGFyZ2V0PVwiJ3BvcG92ZXItJytwbGF5ZXIuaWRcIiB0cmlnZ2Vycz1cImhvdmVyXCIgYm91bmRhcnktcGFkZGluZz1cIjVcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC13cmFwIGFsaWduLWNvbnRlbnQtYmV0d2VlbiBhbGlnbi1pdGVtcy1zdGFydCBtci0yIGp1c3RpZnktY29udGVudC1hcm91bmRcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LWdyb3ctMSBhbGlnbi1zZWxmLWNlbnRlclwiIHN0eWxlPVwiZm9udC1zaXplOjEuNWVtO1wiPnt7bXN0YXQucG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmbGV4LXNocmluay0xIGQtaW5saW5lLWJsb2NrIHRleHQtbXV0ZWRcIj48c21hbGw+e3ttc3RhdC53aW5zfX0te3ttc3RhdC5kcmF3c319LXt7bXN0YXQubG9zc2VzfX08L3NtYWxsPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1wcmltYXJ5IGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC44ZW07IHRleHQtZGVjb3JhdGlvbjp1bmRlcmxpbmVcIj5MYXN0IEdhbWU6IFJvdW5kIHt7bXN0YXQucm91bmR9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMSB0ZXh0LXdoaXRlIHNkYXRhLXJlcyB0ZXh0LWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBtc3RhdC5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2F3YWl0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogbXN0YXQucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBtc3RhdC5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB7e21zdGF0LnNjb3JlfX0te3ttc3RhdC5vcHBvX3Njb3JlfX0gKHt7bXN0YXQucmVzdWx0fGZpcnN0Y2hhcn19KVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgOnNyYz1cIm1zdGF0Lm9wcF9waG90b1wiIDphbHQ9XCJtc3RhdC5vcHBvXCIgY2xhc3M9XCJyb3VuZGVkLWNpcmNsZSBtLWF1dG8gZC1pbmxpbmUtYmxvY2tcIiB3aWR0aD1cIjI1XCIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZS1ibG9ja1wiIHN0eWxlPVwiZm9udC1zaXplOjAuOWVtXCI+PHNtYWxsPiN7e21zdGF0Lm9wcG9fbm99fSB7e21zdGF0Lm9wcG98YWJicnZ9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9iLXBvcG92ZXI+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgPC90cmFuc2l0aW9uLWdyb3VwPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIHBsYXllcnN0YXRzOiBQbGF5ZXJTdGF0cyxcclxuICB9LFxyXG4gIHByb3BzOiBbJ3NsdWcnXSxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwU3RhdHM6IHt9LFxyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgICBibG9jazogdHJ1ZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICc3MHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICc3MHB4JyxcclxuICAgICAgICBzdHlsZTogJ2N1cnNvcjogcG9pbnRlcicsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgICBkYXRhRmxhdDoge30sXHJcbiAgICAgIG1zdGF0OiB7fSxcclxuICAgICAgZGF0YToge30sXHJcbiAgICAgIHNvcnRlZDogZmFsc2UsXHJcbiAgICAgIGFzYzogdHJ1ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgbGV0IHJlc3VsdGRhdGEgPSB0aGlzLnJlc3VsdF9kYXRhO1xyXG4gICAgdGhpcy5kYXRhRmxhdCA9IF8uZmxhdHRlbkRlZXAoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICB0aGlzLmRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1EQVRBLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhKTtcclxuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldExhc3RHYW1lczogZnVuY3Rpb24gKHRvdV9ubykge1xyXG4gICAgICBjb25zb2xlLmxvZyh0b3Vfbm8pXHJcbiAgICAgIGxldCBjID0gXy5jbG9uZSh0aGlzLmRhdGFGbGF0KTtcclxuICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oYylcclxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICByZXR1cm4gdi5wbm8gPT09IHRvdV9ubztcclxuICAgICAgICB9KS50YWtlUmlnaHQoKS52YWx1ZSgpO1xyXG4gICAgICB0aGlzLm1zdGF0ID0gXy5maXJzdChyZXMpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1zdGF0KVxyXG4gICAgfSxcclxuICAgIHNvcnRQb3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFzYyA9ICF0aGlzLmFzYztcclxuICAgICAgY29uc29sZS5sb2coJ1NvcnRpbmcuLicpO1xyXG4gICAgICBsZXQgc29ydERpciA9ICdhc2MnO1xyXG4gICAgICBpZiAoZmFsc2UgPT0gdGhpcy5hc2MpIHtcclxuICAgICAgICBzb3J0RGlyID0gJ2Rlc2MnO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0ZWQgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncmFuaycsIHNvcnREaXIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzb3J0ZWQpO1xyXG4gICAgICB0aGlzLmRhdGEgPSBzb3J0ZWQ7XHJcbiAgICB9LFxyXG4gICAgcmVzdG9yZVNvcnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5zb3J0ZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5hc2MgPSB0cnVlO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfLm9yZGVyQnkodGhpcy5kYXRhLCAncG5vJywgJ2FzYycpO1xyXG4gICAgfSxcclxuICAgIHNob3dQbGF5ZXJTdGF0czogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnQ09NUFVURV9QTEFZRVJfU1RBVFMnLCBpZCk7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBsYXllciA9IHRoaXMucGxheWVyO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlT3BwID0gdGhpcy5sYXN0ZGF0YS5hdmVfb3BwX3Njb3JlO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wQXZlID0gdGhpcy5sYXN0ZGF0YS5hdmVfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYW5rID0gdGhpcy5sYXN0ZGF0YS5yYW5rO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9zaXRpb24gPSB0aGlzLmxhc3RkYXRhLnBvc2l0aW9uO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUG9pbnRzID0gdGhpcy5sYXN0ZGF0YS5wb2ludHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaU9wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb09wcFNjb3JlID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBIaVNjb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBMb1Njb3JlUm91bmRzID0gdGhpcy5wbGF5ZXJfc3RhdHMucExvU2NvcmVSb3VuZHM7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFJhbmtzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsUmFua3M7XHJcbiAgICAgIHRoaXMucFN0YXRzLmFsbFNjb3JlcyA9IHRoaXMucGxheWVyX3N0YXRzLmFsbFNjb3JlcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsT3BwU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsT3BwU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5wUmJ5UiA9IHRoaXMucGxheWVyX3N0YXRzLnBSYnlSO1xyXG4gICAgICB0aGlzLnBTdGF0cy5zdGFydFdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5zdGFydFdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0cyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0cztcclxuICAgICAgdGhpcy5wU3RhdHMucmVwbHlXaW5zID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBsaWVzID0gdGhpcy5wbGF5ZXJfc3RhdHMucmVwbGllcztcclxuXHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgcmVzdWx0X2RhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiAnVE9UQUxQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgc2hvd1N0YXRzOiAnU0hPV1NUQVRTJyxcclxuICAgICAgbGFzdGRhdGE6ICdMQVNUUkREQVRBJyxcclxuICAgICAgcGxheWVyZGF0YTogJ1BMQVlFUkRBVEEnLFxyXG4gICAgICBwbGF5ZXI6ICdQTEFZRVInLFxyXG4gICAgICBwbGF5ZXJfc3RhdHM6ICdQTEFZRVJfU1RBVFMnXHJcbiAgICB9KSxcclxuXHJcbiAgfVxyXG59KTtcclxuXHJcbiB2YXIgUmVzdWx0cyA9IFZ1ZS5jb21wb25lbnQoJ3Jlc3VsdHMnLCB7XHJcbiAgIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSBob3ZlciBzdGFja2VkPVwic21cIiBzdHJpcGVkIGZvb3QtY2xvbmUgOmZpZWxkcz1cInJlc3VsdHNfZmllbGRzXCIgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCIgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3VsdHNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucmVzdWx0c19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGxhYmVsOiAnIycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgLy8geyBrZXk6ICdwb3NpdGlvbicsbGFiZWw6ICdQb3NpdGlvbicsJ2NsYXNzJzondGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1Njb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdPcHBvbmVudCcgfSxcclxuICAgICAgLy8geyBrZXk6ICdvcHBfcG9zaXRpb24nLCBsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOiAndGV4dC1jZW50ZXInfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ29wcG9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5vcHBvX3Njb3JlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdkaWZmJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJy0nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdDogZnVuY3Rpb24ocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YVtyb3VuZF0pO1xyXG5cclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3cucG9zaXRpb247XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHIucmVzdWx0O1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXSA9IFtdO1xyXG4gICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbnZhciBTdGFuZGluZ3MgPSBWdWUuY29tcG9uZW50KCdzdGFuZGluZ3MnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBzdGFja2VkPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiA6ZmllbGRzPVwic3RhbmRpbmdzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicmFua1wiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5yYW5rfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwbGF5ZXJcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucGxheWVyfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ3b25Mb3N0XCI+PC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJtYXJnaW5cIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUubWFyZ2lufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJsYXN0R2FtZVwiPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhbmRpbmdzX2ZpZWxkczogW10sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzI1cHgnLFxyXG4gICAgICAgIGhlaWdodDogJzI1cHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtJyxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgfSxcclxuICBtb3VudGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc3RhbmRpbmdzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV2luLURyYXctTG9zcycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ud2luc30gLSAke2l0ZW0uZHJhd3N9IC0gJHtpdGVtLmxvc3Nlc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdwb2ludHMnLFxyXG4gICAgICAgIGxhYmVsOiAnUG9pbnRzJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5hciA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSpgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbGFzdEdhbWUnLFxyXG4gICAgICAgIGxhYmVsOiAnTGFzdCBHYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBpdGVtLnNjb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5vcHBvX3Njb3JlID09IDAgJiZcclxuICAgICAgICAgICAgaXRlbS5yZXN1bHQgPT0gJ2F3YWl0aW5nJ1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgQXdhaXRpbmcgcmVzdWx0IG9mIGdhbWUgJHtpdGVtLnJvdW5kfSB2cyAke2l0ZW0ub3Bwb31gO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBgYSAke2l0ZW0uc2NvcmV9LSR7aXRlbS5vcHBvX3Njb3JlfVxyXG4gICAgICAgICAgICAke2l0ZW0ucmVzdWx0LnRvVXBwZXJDYXNlKCl9IHZzICR7aXRlbS5vcHBvfSBgO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0KHIpIHtcclxuICAgICAgbGV0IHJvdW5kID0gciAtIDE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGFbcm91bmRdKTtcclxuICAgICAgXy5mb3JFYWNoKGRhdGEsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgb3BwX25vID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIC8vIEZpbmQgd2hlcmUgdGhlIG9wcG9uZW50J3MgY3VycmVudCBwb3NpdGlvbiBhbmQgYWRkIHRvIGNvbGxlY3Rpb25cclxuICAgICAgICBsZXQgcm93ID0gXy5maW5kKGRhdGEsIHsgcG5vOiBvcHBfbm8gfSk7XHJcbiAgICAgICAgclsnb3BwX3Bvc2l0aW9uJ10gPSByb3dbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgLy8gY2hlY2sgcmVzdWx0ICh3aW4sIGxvc3MsIGRyYXcpXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHJbJ3Jlc3VsdCddO1xyXG5cclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ10gPSBbXTtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2F3YWl0aW5nJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2luZm8nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICd3YXJuaW5nJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5zb3J0QnkoJ21hcmdpbicpXHJcbiAgICAgICAgLnNvcnRCeSgncG9pbnRzJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgUGFpcmluZ3MgPVZ1ZS5jb21wb25lbnQoJ3BhaXJpbmdzJywgIHtcclxuICB0ZW1wbGF0ZTogYFxyXG48dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1yZXNwb25zaXZlIHRhYmxlLXN0cmlwZWQgIGFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICA8Y2FwdGlvbj57e2NhcHRpb259fTwvY2FwdGlvbj5cclxuICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWRhcmtcIj5cclxuICAgICAgICA8dHI+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+IzwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+UGxheWVyPC90aD5cclxuICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5PcHBvbmVudDwvdGg+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGhlYWQ+XHJcbiAgICA8dGJvZHk+XHJcbiAgICAgICAgPHRyIHYtZm9yPVwiKHBsYXllcixpKSBpbiBwYWlyaW5nKGN1cnJlbnRSb3VuZClcIiA6a2V5PVwiaVwiPlxyXG4gICAgICAgIDx0aCBzY29wZT1cInJvd1wiPnt7aSArIDF9fTwvdGg+XHJcbiAgICAgICAgPHRkIDppZD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIj48L2ItaW1nLWxhenk+PHN1cCB2LWlmPVwicGxheWVyLnN0YXJ0ID09J3knXCI+Kjwvc3VwPnt7cGxheWVyLnBsYXllcn19PC90ZD5cclxuICAgICAgICA8dGQgOmlkPVwiJ3BvcG92ZXItJytwbGF5ZXIub3BwX2lkXCI+PGItaW1nLWxhenkgdi1iaW5kPVwiaW1nUHJvcHNcIiA6YWx0PVwicGxheWVyLm9wcG9cIiA6c3JjPVwicGxheWVyLm9wcF9waG90b1wiPjwvYi1pbWctbGF6eT48c3VwICB2LWlmPVwicGxheWVyLnN0YXJ0ID09J24nXCI+Kjwvc3VwPnt7cGxheWVyLm9wcG99fTwvdGQ+XHJcbiAgICAgICAgPC90cj5cclxuICAgIDwvdGJvZHk+XHJcbiAgPC90YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHN0eWxlOidtYXJnaW4tcmlnaHQ6LjVlbScsXHJcbiAgICAgICAgd2lkdGg6ICcyNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcyNXB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICAvLyBnZXQgcGFpcmluZ1xyXG4gICAgcGFpcmluZyhyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgcm91bmRfcmVzID0gdGhpcy5yZXN1bHRkYXRhW3JvdW5kXTtcclxuICAgICAgLy8gU29ydCBieSBwbGF5ZXIgbnVtYmVyaW5nIGlmIHJvdW5kIDEgdG8gb2J0YWluIHJvdW5kIDEgcGFpcmluZ1xyXG4gICAgICBpZiAociA9PT0gMSkge1xyXG4gICAgICAgIHJvdW5kX3JlcyA9IF8uc29ydEJ5KHJvdW5kX3JlcywgJ3BubycpO1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBwYWlyZWRfcGxheWVycyA9IFtdO1xyXG4gICAgICBsZXQgcnAgPSBfLm1hcChyb3VuZF9yZXMsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gclsncG5vJ107XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKHBhaXJlZF9wbGF5ZXJzLCBwbGF5ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhaXJlZF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKG9wcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNvbXBhY3QocnApO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7UGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c31cclxuXHJcbiIsIlxyXG5leHBvcnQgeyBSYXRpbmdTdGF0cyBhcyBkZWZhdWx0IH07XHJcbmxldCBSYXRpbmdTdGF0cyA9IFZ1ZS5jb21wb25lbnQoJ3JhdGluZ19zdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYDwhLS0gUmF0aW5nIFN0YXRzIC0tPlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtOCBvZmZzZXQtMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICA8Yi10YWJsZSByZXNwb25zaXZlPVwic21cIiBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiY29tcHV0ZWRfaXRlbXNcIiA6ZmllbGRzPVwiZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgICAgPCEtLSBBIHZpcnR1YWwgY29sdW1uIC0tPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHYtc2xvdDpjZWxsKHJhdGluZ19jaGFuZ2UpPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICA8c3BhbiB2LWJpbmQ6Y2xhc3M9XCJ7XHJcbiAgICAgICAgICAgJ3RleHQtaW5mbyc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID09IDAsXHJcbiAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPCAwLFxyXG4gICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA+IDAgfVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEuaXRlbS5yYXRpbmdfY2hhbmdlfX1cclxuICAgICAgICAgICAgPGkgdi1iaW5kOmNsYXNzPVwie1xyXG4gICAgICAgICAgICAgJ2ZhIGZhLWxvbmctYXJyb3ctbGVmdCc6ZGF0YS5pdGVtLnJhdGluZ19jaGFuZ2UgPT0gMCxcclxuICAgICAgICAgICAgICdmYSBmYS1sb25nLWFycm93LWRvd24nOiBkYXRhLml0ZW0ucmF0aW5nX2NoYW5nZSA8IDAsXHJcbiAgICAgICAgICAgICAnZmEgZmEtbG9uZy1hcnJvdy11cCc6IGRhdGEuaXRlbS5yYXRpbmdfY2hhbmdlID4gMCB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwobmFtZSk9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIDxiLWltZy1sYXp5IDp0aXRsZT1cImRhdGEuaXRlbS5uYW1lXCIgOmFsdD1cImRhdGEuaXRlbS5uYW1lXCIgOnNyYz1cImRhdGEuaXRlbS5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAge3tkYXRhLml0ZW0ubmFtZX19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICA8L2ItdGFibGU+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjb21wdXRlZF9pdGVtcyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGljUHJvcHM6IHtcclxuICAgICAgICBibG9jazogZmFsc2UsXHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgd2lkdGg6ICczMHB4JyxcclxuICAgICAgICBoZWlnaHQ6ICczMHB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSwgbXgtMScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGZpZWxkczogW1xyXG4gICAgICAgIHsga2V5OiAncG9zaXRpb24nLCBsYWJlbDogJ1JhbmsnIH0sXHJcbiAgICAgICAgJ25hbWUnLFxyXG4gICAgICAgIHsga2V5OiAncmF0aW5nX2NoYW5nZScsIGxhYmVsOiAnQ2hhbmdlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgICB7IGtleTogJ2V4cGVjdGVkX3dpbnMnLCBsYWJlbDogJ0Uud2lucycgfSxcclxuICAgICAgICB7IGtleTogJ2FjdHVhbF93aW5zJywgbGFiZWw6ICdBLndpbnMnIH0sXHJcbiAgICAgICAgeyBrZXk6ICdvbGRfcmF0aW5nJywgbGFiZWw6ICdPbGQgUmF0aW5nJyB9LFxyXG4gICAgICAgIHsga2V5OiAnbmV3X3JhdGluZycsIGxhYmVsOiAnTmV3IFJhdGluZycgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfSxcclxuXHJcbn0pO1xyXG4iLCJcclxuaW1wb3J0IGJhc2VVUkwgZnJvbSAnLi4vY29uZmlnLmpzJztcclxubGV0IFNjb3JlYm9hcmQgPSBWdWUuY29tcG9uZW50KCdzY29yZWJvYXJkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvdyBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJlcnJvclwiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgPGRpdiBjbGFzcz1cImNvbFwiIGlkPVwic2NvcmVib2FyZFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiIHYtZm9yPVwiaSBpbiByb3dDb3VudFwiIDprZXk9XCJpXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMyBjb2wtc20tNiBjb2wtMTIgXCIgdi1mb3I9XCJwbGF5ZXIgaW4gaXRlbUNvdW50SW5Sb3coaSlcIiA6a2V5PVwicGxheWVyLnJhbmtcIj5cclxuICAgICAgICA8Yi1tZWRpYSBjbGFzcz1cInBiLTAgbWItMSBtci0xXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgc2xvdD1cImFzaWRlXCI+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgICA8Yi1pbWcgcm91bmRlZD1cImNpcmNsZVwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluXCIvPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29scz1cIjEyXCIgbWQ9XCJhdXRvXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsYWctaWNvblwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29sIGxnPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdmJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cInRleHQtY2VudGVyXCIgdi1pZj1cInBsYXllci50ZWFtXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPjxzcGFuPnt7cGxheWVyLnRlYW19fTwvc3Bhbj48L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3c+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNsYXNzPVwidGV4dC13aGl0ZVwiIHYtYmluZDpjbGFzcz1cInsndGV4dC13YXJuaW5nJzogcGxheWVyLnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogcGxheWVyLnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgcG9zaXRpb24gIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAge3twbGF5ZXIucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1sb25nLWFycm93LXVwJzogcGxheWVyLnJhbmsgPCBwbGF5ZXIubGFzdHJhbmssJ2ZhLWxvbmctYXJyb3ctZG93bic6IHBsYXllci5yYW5rID4gcGxheWVyLmxhc3RyYW5rLFxyXG4gICAgICAgICAgICAgICAgICdmYS1hcnJvd3MtaCc6IHBsYXllci5yYW5rID09IHBsYXllci5sYXN0cmFuayB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDUgY2xhc3M9XCJtLTAgIGFuaW1hdGVkIGZhZGVJbkxlZnRcIj57e3BsYXllci5wbGF5ZXJ9fTwvaDU+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmQtdGV4dCBtdC0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgcG9pbnRzIHAtMVwiPnt7cGxheWVyLnBvaW50c319LXt7cGxheWVyLmxvc3Nlc319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIG1hclwiPnt7cGxheWVyLm1hcmdpbiB8IGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBwMVwiPndhcyB7e3BsYXllci5sYXN0cG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cImJnLWluZm8gZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yZXN1bHQgfCBmaXJzdGNoYXIgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICB7e3BsYXllci5yZXN1bHQgfCBmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwicGxheWVyLnJlc3VsdCA9PSdhd2FpdGluZycgXCIgY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUgcC0xICBzZGF0YVwiPkF3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICBSZXN1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIHNkYXRhXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+e3twbGF5ZXIuc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgLSB7e3BsYXllci5vcHBvX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHAtMCBtbC0xIG9wcFwiPnZzIHt7cGxheWVyLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwicmVzXCIgdi1mb3I9XCJyZXMgaW4gcGxheWVyLnByZXZyZXN1bHRzXCIgOmtleT1cInJlcy5rZXlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiByZXMgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiByZXMgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiByZXMgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiByZXMgPT09ICd3aW4nIH1cIj57e3Jlc3xmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1tZWRpYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuICAgIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpdGVtc1BlclJvdzogNCxcclxuICAgICAgcGVyX3BhZ2U6IDQwLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhZ2V1cmw6IGJhc2VVUkwgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcmVsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIHBlcmlvZDogMC41LFxyXG4gICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgc2NvcmVib2FyZF9kYXRhOiBbXSxcclxuICAgICAgcmVzcG9uc2VfZGF0YTogW10sXHJcbiAgICAgIC8vIHBsYXllcnM6IFtdLFxyXG4gICAgICAvLyB0b3RhbF9yb3VuZHM6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogbnVsbCxcclxuICAgICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgICBpc19saXZlX2dhbWU6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHRoaXMuZmV0Y2hTY29yZWJvYXJkRGF0YSgpO1xyXG4gICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKFxyXG4gICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIHRoaXMucGVyaW9kICogNjAwMDBcclxuICAgICk7XHJcblxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5nZXRXaW5kb3dXaWR0aCk7XHJcbiAgICB0aGlzLmNhbmNlbEF1dG9VcGRhdGUoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFNjb3JlYm9hcmREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzX2xpdmVfZ2FtZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGl0ZW1Db3VudEluUm93OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zY29yZWJvYXJkX2RhdGEuc2xpY2UoXHJcbiAgICAgICAgKGluZGV4IC0gMSkgKiB0aGlzLml0ZW1zUGVyUm93LFxyXG4gICAgICAgIGluZGV4ICogdGhpcy5pdGVtc1BlclJvd1xyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NEZXRhaWxzOiBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3VsdF9kYXRhKVxyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAgIGxldCBpbml0aWFsUmREYXRhID0gXy5pbml0aWFsKF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgcHJldmlvdXNSZERhdGEgPSBfLmxhc3QoaW5pdGlhbFJkRGF0YSk7XHJcbiAgICAgIGxldCBsYXN0UmREID0gXy5sYXN0KF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgbGFzdFJkRGF0YSA9IF8ubWFwKGxhc3RSZEQsIHBsYXllciA9PiB7XHJcbiAgICAgICAgbGV0IHggPSBwbGF5ZXIucG5vIC0gMTtcclxuICAgICAgICBwbGF5ZXIucGhvdG8gPSB0aGlzLnBsYXllcnNbeF0ucGhvdG87XHJcbiAgICAgICAgcGxheWVyLmdlbmRlciA9IHRoaXMucGxheWVyc1t4XS5nZW5kZXI7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnlfZnVsbCA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5X2Z1bGw7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnkgPSB0aGlzLnBsYXllcnNbeF0uY291bnRyeTtcclxuICAgICAgICAvLyBpZiAoXHJcbiAgICAgICAgLy8gICBwbGF5ZXIucmVzdWx0ID09ICdkcmF3JyAmJlxyXG4gICAgICAgIC8vICAgcGxheWVyLnNjb3JlID09IDAgJiZcclxuICAgICAgICAvLyAgIHBsYXllci5vcHBvX3Njb3JlID09IDBcclxuICAgICAgICAvLyApIHtcclxuICAgICAgICAvLyAgIHBsYXllci5yZXN1bHQgPSAnQVInO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAocHJldmlvdXNSZERhdGEpIHtcclxuICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gXy5maW5kKHByZXZpb3VzUmREYXRhLCB7XHJcbiAgICAgICAgICAgIHBsYXllcjogcGxheWVyLnBsYXllcixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3Rwb3NpdGlvbiA9IHBsYXllckRhdGFbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHJhbmsgPSBwbGF5ZXJEYXRhWydyYW5rJ107XHJcbiAgICAgICAgICAvLyBwcmV2aW91cyByb3VuZHMgcmVzdWx0c1xyXG4gICAgICAgICAgcGxheWVyLnByZXZyZXN1bHRzID0gXy5jaGFpbihpbml0aWFsUmREYXRhKVxyXG4gICAgICAgICAgICAuZmxhdHRlbkRlZXAoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdi5wbGF5ZXIgPT09IHBsYXllci5wbGF5ZXI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoJ3Jlc3VsdCcpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMudG90YWxfcm91bmRzID0gcmVzdWx0ZGF0YS5sZW5ndGg7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbGFzdFJkRGF0YVswXS5yb3VuZDtcclxuICAgICAgbGV0IGNodW5rcyA9IF8uY2h1bmsobGFzdFJkRGF0YSwgdGhpcy50b3RhbF9wbGF5ZXJzKTtcclxuICAgICAgLy8gdGhpcy5yZWxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNjb3JlYm9hcmRfZGF0YSA9IGNodW5rc1tjdXJyZW50UGFnZSAtIDFdO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgIH0pLFxyXG4gICAgcm93Q291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2NvcmVib2FyZF9kYXRhLmxlbmd0aCAvIHRoaXMuaXRlbXNQZXJSb3cpO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYWdldXJsXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZWJvYXJkOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuZXhwb3J0IHsgU2NvcmVzaGVldCBhcyBkZWZhdWx0IH07XHJcblxyXG5sZXQgU2NvcmVzaGVldCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlQ2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDxkaXYgdi1pZj1cInJlc3VsdGRhdGFcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtdG9wXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4XCI+XHJcbiAgICAgICAgPGItaW1nIGNsYXNzPVwidGh1bWJuYWlsIGxvZ28gbWwtYXV0b1wiIDpzcmM9XCJsb2dvXCIgOmFsdD1cImV2ZW50X3RpdGxlXCIgLz5cclxuICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+U2NvcmVjYXJkcyA8aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0yIGNvbC0xMlwiPlxyXG4gICAgICA8IS0tIHBsYXllciBsaXN0IGhlcmUgLS0+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwiIHAtMiBtYi01IGJnLXdoaXRlIHJvdW5kZWRcIj5cclxuICAgICAgICAgIDxsaSA6a2V5PVwicGxheWVyLnBub1wiIHYtZm9yPVwicGxheWVyIGluIHBkYXRhXCIgY2xhc3M9XCJiZWJhc1wiPlxyXG4gICAgICAgICAgPHNwYW4+e3twbGF5ZXIucG5vfX08L3NwYW4+IDxiLWltZy1sYXp5IDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChwbGF5ZXIucG5vKVwiIHZhcmlhbnQ9XCJsaW5rXCI+e3twbGF5ZXIucGxheWVyfX08L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBjb2wtMTJcIj5cclxuICAgICAgPHRlbXBsYXRlIHYtaWY9XCJyZXN1bHRkYXRhXCI+XHJcbiAgICAgICAgPGg0IGNsYXNzPVwiZ3JlZW5cIj5TY29yZWNhcmQ6IDxiLWltZyA6YWx0PVwibVBsYXllci5wbGF5ZXJcIiBjbGFzcz1cIm14LTJcIiA6c3JjPVwibVBsYXllci5waG90b1wiIHN0eWxlPVwid2lkdGg6NjBweDsgaGVpZ2h0OjYwcHhcIj48L2ItaW1nPiB7e21QbGF5ZXIucGxheWVyfX08L2g0PlxyXG4gICAgICAgIDxiLXRhYmxlIHJlc3BvbnNpdmU9XCJtZFwiIHNtYWxsIGhvdmVyIGZvb3QtY2xvbmUgaGVhZC12YXJpYW50PVwibGlnaHRcIiBib3JkZXJlZCB0YWJsZS12YXJpYW50PVwibGlnaHRcIiA6ZmllbGRzPVwiZmllbGRzXCIgOml0ZW1zPVwic2NvcmVjYXJkXCIgaWQ9XCJzY29yZWNhcmRcIiBjbGFzcz1cImJlYmFzIHNoYWRvdyBwLTQgbXgtYXV0b1wiIHN0eWxlPVwid2lkdGg6OTAlOyB0ZXh0LWFsaWduOmNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZVwiPlxyXG4gICAgICAgIDwhLS0gQSBjdXN0b20gZm9ybWF0dGVkIGNvbHVtbiAtLT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwocm91bmQpPVwiZGF0YVwiPlxyXG4gICAgICAgICAge3tkYXRhLml0ZW0ucm91bmR9fSA8c3VwIHYtaWY9XCJkYXRhLml0ZW0uc3RhcnQgPT0neSdcIj4qPC9zdXA+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OmNlbGwob3Bwbyk9XCJkYXRhXCI+XHJcbiAgICAgICAgICA8c21hbGw+I3t7ZGF0YS5pdGVtLm9wcG9fbm99fTwvc21hbGw+PGItaW1nLWxhenkgOnRpdGxlPVwiZGF0YS5pdGVtLm9wcG9cIiA6YWx0PVwiZGF0YS5pdGVtLm9wcG9cIiA6c3JjPVwiZGF0YS5pdGVtLm9wcF9waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cImdldENhcmQoZGF0YS5pdGVtLm9wcG9fbm8pXCIgdmFyaWFudD1cImxpbmtcIj5cclxuICAgICAgICAgICAgICB7e2RhdGEuaXRlbS5vcHBvfGFiYnJ2fX1cclxuICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1zbG90OnRhYmxlLWNhcHRpb24+XHJcbiAgICAgICAgICBTY29yZWNhcmQ6ICN7e21QbGF5ZXIucG5vfX0ge3ttUGxheWVyLnBsYXllcn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8L2ItdGFibGU+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGxheWVyX25vOiB0aGlzLiRyb3V0ZS5wYXJhbXMucG5vLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBwaWNQcm9wczoge1xyXG4gICAgICAgIGJsb2NrOiBmYWxzZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICB3aWR0aDogJzMwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzMwcHgnLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtLCBteC0xJyxcclxuICAgICAgfSxcclxuICAgICAgZmllbGRzOiBbe2tleToncm91bmQnLGxhYmVsOidSZCcsc29ydGFibGU6dHJ1ZX0sIHtrZXk6ICdvcHBvJywgbGFiZWw6J09wcC4gTmFtZSd9LHtrZXk6J29wcG9fc2NvcmUnLGxhYmVsOidPcHAuIFNjb3JlJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidzY29yZScsc29ydGFibGU6dHJ1ZX0se2tleTonZGlmZicsc29ydGFibGU6dHJ1ZX0se2tleToncmVzdWx0Jyxzb3J0YWJsZTp0cnVlfSwge2tleTond2lucycsbGFiZWw6J1dvbicsc29ydGFibGU6dHJ1ZX0se2tleTonbG9zc2VzJyxsYWJlbDonTG9zdCcsc29ydGFibGU6dHJ1ZX0se2tleToncG9pbnRzJyxzb3J0YWJsZTp0cnVlfSx7a2V5OidtYXJnaW4nLHNvcnRhYmxlOnRydWUsbGFiZWw6J01hcid9LHtrZXk6J3Bvc2l0aW9uJyxsYWJlbDonUmFuaycsc29ydGFibGU6dHJ1ZX1dLFxyXG4gICAgICBwZGF0YToge30sXHJcbiAgICAgIHNjb3JlY2FyZDoge30sXHJcbiAgICAgIG1QbGF5ZXI6IHt9LFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gIH0sXHJcbiAgY3JlYXRlZCgpIHtcclxuICAgIHZhciBwID0gdGhpcy5zbHVnLnNwbGl0KCctJyk7XHJcbiAgICBwLnNoaWZ0KCk7XHJcbiAgICB0aGlzLnRvdXJuZXlfc2x1ZyA9IHAuam9pbignLScpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy50b3VybmV5X3NsdWcpO1xyXG4gICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX1JFU0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSBgUGxheWVyIFNjb3JlY2FyZHMgLSAke3RoaXMudG91cm5leV90aXRsZX1gO1xyXG4gIH0sXHJcbiAgd2F0Y2g6e1xyXG4gICAgcmVzdWx0ZGF0YToge1xyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICAgIGRlZXA6IHRydWUsXHJcbiAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICBpZiAobmV3VmFsKSB7XHJcbiAgICAgICAgICB0aGlzLnBkYXRhID0gXy5jaGFpbih0aGlzLnJlc3VsdGRhdGEpXHJcbiAgICAgICAgICAgIC5sYXN0KCkuc29ydEJ5KCdwbm8nKS52YWx1ZSgpO1xyXG4gICAgICAgICAgdGhpcy5nZXRDYXJkKHRoaXMucGxheWVyX25vKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRDYXJkOiBmdW5jdGlvbiAobikge1xyXG4gICAgICBsZXQgYyA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgbGV0IHMgPSBfLmNoYWluKGMpLm1hcChmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBfLmZpbHRlcih2LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSkubWFwKCBmdW5jdGlvbihpKXtcclxuICAgICAgICAgIGkuX2NlbGxWYXJpYW50cyA9IFtdO1xyXG4gICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdpbmZvJztcclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSd3aW4nKXtcclxuICAgICAgICAgICAgaS5fY2VsbFZhcmlhbnRzLnJlc3VsdCA9ICdzdWNjZXNzJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSdsb3NzJyl7XHJcbiAgICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnZGFuZ2VyJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKGkucmVzdWx0ID09PSdkcmF3Jyl7XHJcbiAgICAgICAgICAgIGkuX2NlbGxWYXJpYW50cy5yZXN1bHQgPSAnd2FybmluZyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSkuZmxhdHRlbkRlZXAoKS52YWx1ZSgpO1xyXG4gICAgICB0aGlzLm1QbGF5ZXIgPSBfLmZpcnN0KHMpO1xyXG4gICAgICB0aGlzLiRyb3V0ZXIucmVwbGFjZSh7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7IHBubzogbiB9IH0pO1xyXG4gICAgICB0aGlzLnBsYXllcl9ubyA9IG47XHJcbiAgICAgIGNvbnNvbGUubG9nKHMpO1xyXG4gICAgICB0aGlzLnNjb3JlY2FyZCA9IHM7XHJcbiAgfSxcclxuXHJcbn0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIGV2ZW50X2RhdGE6ICdFVkVOVFNUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdOU0YgTmV3cycsXHJcbiAgICAgICAgICBocmVmOiAnLydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIGV2ZW50X3NsdWc6IHRoaXMuc2x1Z1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnU2NvcmVjYXJkcycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhdGhcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIiwiIGxldCBMb1dpbnMgPSBWdWUuY29tcG9uZW50KCdsb3dpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIExvdyBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldExvd1Njb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJsb3d3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvd3dpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxvd3dpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRMb3dTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWluQnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpV2lucyA9VnVlLmNvbXBvbmVudCgnaGl3aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBIaWdoIFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImhpZ2h3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWdod2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlnaHdpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpTG9zcyA9IFZ1ZS5jb21wb25lbnQoJ2hpbG9zcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPCEtLSBIaWdoIExvc2luZyBTY29yZXMgLS0+XHJcbiAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCdsb3NzJylcIiA6ZmllbGRzPVwiaGlsb3NzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlsb3NzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWxvc3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ1dpbm5lcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IENvbWJvU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnY29tYm9zY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGljb21ibygpXCIgOmZpZWxkcz1cImhpY29tYm9fZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAge3tjYXB0aW9ufX1cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGljb21ib19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGljb21ib19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnY29tYm9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQ29tYmluZWQgU2NvcmUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnV2lubmluZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0xvc2luZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaWNvbWJvKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmNvbWJvX3Njb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2NvbWJvX3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ3RvdGFsc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxzY29yZV9maWVsZHMgPSBbXHJcbiAgICAvLyAgJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IFRvdGFsT3BwU2NvcmVzID1WdWUuY29tcG9uZW50KCdvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbG9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbG9wcHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3RvdGFsX29wcHNjb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1RvdGFsIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgQXZlU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnYXZlc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwiYXZlc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXZlc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmF2ZXNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgLy8naW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBBdmVPcHBTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICBob3ZlciByZXNwb25zaXZlIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9vcHBfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQXZlcmFnZSBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgTG9TcHJlYWQgPSBWdWUuY29tcG9uZW50KCdsb3NwcmVhZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImxvU3ByZWFkKClcIiA6ZmllbGRzPVwibG9zcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3NwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG9zcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBsb1NwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpU3ByZWFkID0gICBWdWUuY29tcG9uZW50KCdoaXNwcmVhZCcse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGlTcHJlYWQoKVwiIDpmaWVsZHM9XCJoaXNwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaXNwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlzcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaVNwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmRpZmY7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gfSk7XHJcbmV4cG9ydCB7SGlXaW5zLCBMb1dpbnMsSGlMb3NzLENvbWJvU2NvcmVzLFRvdGFsU2NvcmVzLFRvdGFsT3BwU2NvcmVzLEF2ZVNjb3JlcyxBdmVPcHBTY29yZXMsSGlTcHJlYWQsIExvU3ByZWFkfSIsImxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG5sZXQgdG9wUGVyZm9ybWVycyA9IFZ1ZS5jb21wb25lbnQoJ3RvcC1zdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICA8aDMgY2xhc3M9XCJiZWJhc1wiPnt7dGl0bGV9fVxyXG4gICAgICAgIDxzcGFuPjxpIGNsYXNzPVwiZmFzIGZhLW1lZGFsXCI+PC9pPjwvc3Bhbj5cclxuICAgICAgPC9oMz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMiBjb2wtc20tNCBjb2wtMTJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cIm10LTUgZC1mbGV4IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiBpZD1cInRvcC1idG4tZ3JvdXBcIj5cclxuICAgICAgICAgIDxiLWJ1dHRvbi1ncm91cCB2ZXJ0aWNhbD5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJUb3AgM1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ3RvcDMnKVwiXHJcbiAgICAgICAgICAgICAgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSd0b3AzJ1wiPlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyb3BoeSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+VG9wIDNcclxuICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJIaWdoZXN0IChHYW1lKSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCJcclxuICAgICAgICAgICAgICBAY2xpY2s9XCJzaG93UGljKCdoaWdhbWVzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlnYW1lcydcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1idWxsc2V5ZSBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBHYW1lXHJcbiAgICAgICAgICAgIDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiSGlnaGVzdCBBdmVyYWdlIFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIGFjdGl2ZS1jbGFzcz1cInN1Y2Nlc3NcIlxyXG4gICAgICAgICAgICAgIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdoaWF2ZXMnXCIgQGNsaWNrPVwic2hvd1BpYygnaGlhdmVzJylcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10aHVtYnMtdXAgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggQXZlIFNjb3JlPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJpbmZvXCIgdGl0bGU9XCJMb3dlc3QgQXZlcmFnZSBPcHBvbmVudCBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIlxyXG4gICAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2xvb3BwYXZlcycpXCIgYWN0aXZlLWNsYXNzPVwic3VjY2Vzc1wiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdsb29wcGF2ZXMnXCI+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYmVlciBtci0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkxvdyBPcHAgQXZlPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgPGItYnV0dG9uIHYtaWY9XCJyYXRpbmdfc3RhdHNcIiB2YXJpYW50PVwiaW5mb1wiIHRpdGxlPVwiSGlnaCBSYW5rIFBvaW50c1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ2hpcmF0ZScpXCJcclxuICAgICAgICAgICAgICBhY3RpdmUtY2xhc3M9XCJzdWNjZXNzXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpcmF0ZSdcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1ib2x0IG1yLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGkgUmFuayBQb2ludHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9iLWJ1dHRvbi1ncm91cD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgY29sLXNtLTggY29sLTEyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTQgY29sLTEyIGFuaW1hdGVkIGZhZGVJblJpZ2h0QmlnXCIgdi1mb3I9XCIoaXRlbSwgaW5kZXgpIGluIHN0YXRzXCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJwLTIgdGV4dC1jZW50ZXIgYmViYXMgYmctZGFyayB0ZXh0LXdoaXRlXCI+e3tpdGVtLnBsYXllcn19PC9oND5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGltZyA6c3JjPVwicGxheWVyc1tpdGVtLnBuby0xXS5waG90b1wiIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyBjbGFzcz1cImltZy1mbHVpZCByb3VuZGVkLWNpcmNsZVwiXHJcbiAgICAgICAgICAgICAgOmFsdD1cInBsYXllcnNbaXRlbS5wbm8tMV0ucG9zdF90aXRsZXxsb3dlcmNhc2VcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG1sLTVcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTEgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllcnNbaXRlbS5wbm8tMV0uY291bnRyeSB8IGxvd2VyY2FzZVwiXHJcbiAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTEgZmFcIlxyXG4gICAgICAgICAgICAgICAgOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyc1tpdGVtLnBuby0xXS5nZW5kZXIgPT0gJ20nLCAnZmEtZmVtYWxlJzogcGxheWVyc1tpdGVtLnBuby0xXS5nZW5kZXIgPT0gJ2YnfVwiXHJcbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGJnLWRhcmsgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ucG9pbnRzXCI+e3tpdGVtLnBvaW50c319PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ucmF0aW5nX2NoYW5nZVwiPjxzbWFsbCB2LWlmPVwiaXRlbS5yYXRpbmdfY2hhbmdlID49IDBcIj5HYWluZWQ8L3NtYWxsPiB7e2l0ZW0ucmF0aW5nX2NoYW5nZX19IHBvaW50cyA8c21hbGwgdi1pZj1cIml0ZW0ucmF0aW5nX2NoYW5nZSA8PSAwXCI+bG9zczwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgdi1pZj1cIml0ZW0ubWFyZ2luXCI+e3tpdGVtLm1hcmdpbnxhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIHRleHQtY2VudGVyIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnNjb3JlXCI+Um91bmRcclxuICAgICAgICAgICAgICAgIHt7aXRlbS5yb3VuZH19IHZzIHt7aXRlbS5vcHBvfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGJnLXN1Y2Nlc3MgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5wb3NpdGlvblwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnBvc2l0aW9ufX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLmF2ZV9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5hdmVfb3BwX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX29wcF9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5uZXdfcmF0aW5nXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ub2xkX3JhdGluZ319IC0ge3tpdGVtLm5ld19yYXRpbmd9fTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgcHJvZmlsZXMgOiBbXSxcclxuICAgICAgc3RhdHM6IFtdLFxyXG4gICAgICBjb21wdXRlZF9yYXRpbmdfaXRlbXM6IFtdLFxyXG4gICAgICBjdXJyZW50VmlldzogJydcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93UGljKCd0b3AzJyk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBzaG93UGljOiBmdW5jdGlvbiAodCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdFxyXG4gICAgICBsZXQgYXJyLHIscyA9IFtdO1xyXG4gICAgICBpZiAodCA9PSAnaGlhdmVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ2F2ZV9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZSA9ICdIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdsb29wcGF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX29wcF9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2VSaWdodChhcnIsIDMpLnJldmVyc2UoKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9vcHBfc2NvcmUnXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0xvd2VzdCBPcHBvbmVudCBBdmVyYWdlIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnaGlnYW1lcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmNvbXB1dGVTdGF0cygpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3Njb3JlJywncm91bmQnLCdvcHBvJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdIaWdoIEdhbWUgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICd0b3AzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ3BvaW50cycpO1xyXG4gICAgICAgIHMgPSBfLnNvcnRCeShhcnIsWydwb2ludHMnLCdtYXJnaW4nXSkucmV2ZXJzZSgpXHJcbiAgICAgICAgciA9IF8udGFrZShzLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3BvaW50cycsJ21hcmdpbicsJ3Bvc2l0aW9uJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdUb3AgMydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnaGlyYXRlJykge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUmF0aW5nRGF0YSgpO1xyXG4gICAgICAgIGFyciA9IHRoaXMuY29tcHV0ZWRfcmF0aW5nX2l0ZW1zO1xyXG5cclxuICAgICAgICBzID0gXy5zb3J0QnkoYXJyLCBbJ3JhdGluZ19jaGFuZ2UnLCduZXdfcmF0aW5nJ10pLnJldmVyc2UoKTtcclxuXHJcbiAgICAgICAgciA9IF8udGFrZShzLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ25ld19yYXRpbmcnLCAncmF0aW5nX2NoYW5nZScsICdvbGRfcmF0aW5nJ10pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS10b3AgcmFuay0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2cocik7XHJcblxyXG4gICAgICAgIHRoaXMudGl0bGU9J0hpZ2ggUmF0aW5nIFBvaW50IEdhaW5lcnMnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RhdHMgPSByO1xyXG4gICAgICAvLyB0aGlzLnByb2ZpbGVzID0gdGhpcy5wbGF5ZXJzW3IucG5vLTFdO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRTdGF0czogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICByZXR1cm4gXy5zb3J0QnkodGhpcy5maW5hbHN0YXRzLCBrZXkpLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICBjb21wdXRlU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlUmF0aW5nRGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0ZGF0YTtcclxuICAgICAgbGV0IGRhdGEgPSBfLmNoYWluKHJlc3VsdGRhdGEpLmxhc3QoKS5zb3J0QnkoJ3BubycpLnZhbHVlKCk7XHJcbiAgICAgIGxldCBpdGVtcyA9IF8uY2xvbmUodGhpcy5yYXRpbmdfc3RhdHMpO1xyXG4gICAgICB0aGlzLmNvbXB1dGVkX3JhdGluZ19pdGVtcyA9IF8ubWFwKGl0ZW1zLCBmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgIGxldCBuID0geC5wbm87XHJcbiAgICAgICAgbGV0IHAgPSBfLmZpbHRlcihkYXRhLCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgcmV0dXJuIG8ucG5vID09IG47XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgeC5waG90byA9IHBbMF0ucGhvdG87XHJcbiAgICAgICAgeC5wb3NpdGlvbiA9IHBbMF0ucG9zaXRpb247XHJcbiAgICAgICAgeC5wbGF5ZXIgPSB4Lm5hbWU7XHJcbiAgICAgICAgeC5yYXRpbmdfY2hhbmdlID0gcGFyc2VJbnQoeC5yYXRpbmdfY2hhbmdlKTtcclxuICAgICAgICByZXR1cm4geDtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGZpbmFsc3RhdHM6ICdGSU5BTF9ST1VORF9TVEFUUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgcmF0aW5nX3N0YXRzOiAnUkFUSU5HX1NUQVRTJyxcclxuICAgICAgb25nb2luZzogJ09OR09JTkdfVE9VUk5FWScsXHJcbiAgICB9KSxcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgdG9wUGVyZm9ybWVyczsiLCJleHBvcnQgeyBzdG9yZSBhcyBkZWZhdWx0IH07XHJcblxyXG5pbXBvcnQgYmFzZVVSTCBmcm9tICcuL2NvbmZpZy5qcydcclxuY29uc3Qgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XHJcbiAgc3RyaWN0OiBmYWxzZSxcclxuICBzdGF0ZToge1xyXG4gICAgdG91YXBpOiBbXSxcclxuICAgIHRvdWFjY2Vzc3RpbWU6ICcnLFxyXG4gICAgZGV0YWlsOiBbXSxcclxuICAgIGxhc3RkZXRhaWxhY2Nlc3M6ICcnLFxyXG4gICAgZXZlbnRfc3RhdHM6IFtdLFxyXG4gICAgcGxheWVyczogW10sXHJcbiAgICByZXN1bHRfZGF0YTogW10sXHJcbiAgICB0b3RhbF9wbGF5ZXJzOiBudWxsLFxyXG4gICAgZXJyb3I6ICcnLFxyXG4gICAgbG9hZGluZzogdHJ1ZSxcclxuICAgIG9uZ29pbmc6IGZhbHNlLFxyXG4gICAgY3VycmVudFBhZ2U6IG51bGwsXHJcbiAgICBXUHRvdGFsOiBudWxsLFxyXG4gICAgV1BwYWdlczogbnVsbCxcclxuICAgIGNhdGVnb3J5OiAnJyxcclxuICAgIHBhcmVudHNsdWc6ICcnLFxyXG4gICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgdG91cm5leV90aXRsZTogJycsXHJcbiAgICBsb2dvX3VybDogJycsXHJcbiAgICB0b3RhbF9yb3VuZHM6IG51bGwsXHJcbiAgICBmaW5hbF9yb3VuZF9zdGF0czogW10sXHJcbiAgICByYXRpbmdfc3RhdHM6IFtdLFxyXG4gICAgc2hvd3N0YXRzOiBmYWxzZSxcclxuICAgIHBsYXllcl9sYXN0X3JkX2RhdGE6IFtdLFxyXG4gICAgcGxheWVyZGF0YTogW10sXHJcbiAgICBwbGF5ZXI6IG51bGwsXHJcbiAgICBwbGF5ZXJfc3RhdHM6IHt9LFxyXG4gIH0sXHJcbiAgZ2V0dGVyczoge1xyXG4gICAgUExBWUVSX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJfc3RhdHMsXHJcbiAgICBMQVNUUkREQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJfbGFzdF9yZF9kYXRhLFxyXG4gICAgUExBWUVSREFUQTogc3RhdGUgPT4gc3RhdGUucGxheWVyZGF0YSxcclxuICAgIFBMQVlFUjogc3RhdGUgPT4gc3RhdGUucGxheWVyLFxyXG4gICAgU0hPV1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5zaG93c3RhdHMsXHJcbiAgICBUT1VBUEk6IHN0YXRlID0+IHN0YXRlLnRvdWFwaSxcclxuICAgIFRPVUFDQ0VTU1RJTUU6IHN0YXRlID0+IHN0YXRlLnRvdWFjY2Vzc3RpbWUsXHJcbiAgICBERVRBSUw6IHN0YXRlID0+IHN0YXRlLmRldGFpbCxcclxuICAgIExBU1RERVRBSUxBQ0NFU1M6IHN0YXRlID0+IHN0YXRlLmxhc3RkZXRhaWxhY2Nlc3MsXHJcbiAgICBFVkVOVFNUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5ldmVudF9zdGF0cyxcclxuICAgIFBMQVlFUlM6IHN0YXRlID0+IHN0YXRlLnBsYXllcnMsXHJcbiAgICBUT1RBTFBMQVlFUlM6IHN0YXRlID0+IHN0YXRlLnRvdGFsX3BsYXllcnMsXHJcbiAgICBSRVNVTFREQVRBOiBzdGF0ZSA9PiBzdGF0ZS5yZXN1bHRfZGF0YSxcclxuICAgIFJBVElOR19TVEFUUzogc3RhdGU9PiBzdGF0ZS5yYXRpbmdfc3RhdHMsXHJcbiAgICBFUlJPUjogc3RhdGUgPT4gc3RhdGUuZXJyb3IsXHJcbiAgICBMT0FESU5HOiBzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nLFxyXG4gICAgQ1VSUlBBR0U6IHN0YXRlID0+IHN0YXRlLmN1cnJlbnRQYWdlLFxyXG4gICAgV1BUT1RBTDogc3RhdGUgPT4gc3RhdGUuV1B0b3RhbCxcclxuICAgIFdQUEFHRVM6IHN0YXRlID0+IHN0YXRlLldQcGFnZXMsXHJcbiAgICBDQVRFR09SWTogc3RhdGUgPT4gc3RhdGUuY2F0ZWdvcnksXHJcbiAgICBUT1RBTF9ST1VORFM6IHN0YXRlID0+IHN0YXRlLnRvdGFsX3JvdW5kcyxcclxuICAgIEZJTkFMX1JPVU5EX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyxcclxuICAgIFBBUkVOVFNMVUc6IHN0YXRlID0+IHN0YXRlLnBhcmVudHNsdWcsXHJcbiAgICBFVkVOVF9USVRMRTogc3RhdGUgPT4gc3RhdGUuZXZlbnRfdGl0bGUsXHJcbiAgICBUT1VSTkVZX1RJVExFOiBzdGF0ZSA9PiBzdGF0ZS50b3VybmV5X3RpdGxlLFxyXG4gICAgT05HT0lOR19UT1VSTkVZOiBzdGF0ZSA9PiBzdGF0ZS5vbmdvaW5nLFxyXG4gICAgTE9HT19VUkw6IHN0YXRlID0+IHN0YXRlLmxvZ29fdXJsLFxyXG4gIH0sXHJcbiAgbXV0YXRpb25zOiB7XHJcbiAgICBTRVRfU0hPV1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuc2hvd3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRklOQUxfUkRfU1RBVFM6IChzdGF0ZSwgcmVzdWx0c3RhdHMpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHJlc3VsdHN0YXRzLmxlbmd0aDtcclxuICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyA9IF8ubGFzdChyZXN1bHRzdGF0cyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBTRVRfVE9VREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFwaSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UREVUQUlMOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZGV0YWlsID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFjY2Vzc3RpbWUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9ERVRBSUxfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxhc3RkZXRhaWxhY2Nlc3MgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9XUF9DT05TVEFOVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5XUHBhZ2VzID0gcGF5bG9hZFsneC13cC10b3RhbHBhZ2VzJ107XHJcbiAgICAgIHN0YXRlLldQdG90YWwgPSBwYXlsb2FkWyd4LXdwLXRvdGFsJ107XHJcbiAgICB9LFxyXG4gICAgU0VUX1BMQVlFUlM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgYSA9IHBheWxvYWQubWFwKGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGtleSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGtleVtpbmRleF1bJ3Bvc3RfdGl0bGUnXSk7XHJcbiAgICAgICAga2V5W2luZGV4XVsndG91X25vJ10gPSBpbmRleCArIDE7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3BsYXllcnMgPSBwYXlsb2FkLmxlbmd0aDtcclxuICAgICAgc3RhdGUucGxheWVycyA9IGE7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JBVElOR19TVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnJhdGluZ19zdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JFU1VMVDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBwID0gc3RhdGUucGxheWVycztcclxuICAgICAgbGV0IHIgPSBfLm1hcChwYXlsb2FkLCBmdW5jdGlvbiAoeikge1xyXG4gICAgICAgIHJldHVybiBfLm1hcCh6LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgbGV0IGkgPSBvLnBubyAtIDE7XHJcbiAgICAgICAgICBvLnBob3RvID0gcFtpXS5waG90bztcclxuICAgICAgICAgIG8uaWQgPSBwW2ldLmlkO1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5X2Z1bGwgPSBwW2ldLmNvdW50cnlfZnVsbDtcclxuICAgICAgICAgIG8uZ2VuZGVyID0gcFtpXS5nZW5kZXI7XHJcbiAgICAgICAgICBvLmlzX3RlYW0gPSBwW2ldLmlzX3RlYW07XHJcbiAgICAgICAgICBsZXQgeCA9IG8ub3Bwb19ubyAtIDE7XHJcbiAgICAgICAgICBvLm9wcF9waG90byA9IHBbeF0ucGhvdG87XHJcbiAgICAgICAgICBvLm9wcF9pZCA9IHBbeF0uaWQ7XHJcbiAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocik7XHJcbiAgICAgIHN0YXRlLnJlc3VsdF9kYXRhID0gcjtcclxuICAgIH0sXHJcbiAgICBTRVRfT05HT0lORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLm9uZ29pbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVFNUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DVVJSUEFHRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmN1cnJlbnRQYWdlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVJST1I6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5lcnJvciA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9UQUxfUk9VTkRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG90YWxfcm91bmRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ0FURUdPUlk6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jYXRlZ29yeSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVVJORVlfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VybmV5X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfUEFSRU5UU0xVRzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhcmVudHNsdWcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVF9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HT19VUkw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dvX3VybCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgLy9cclxuICAgIENPTVBVVEVfUExBWUVSX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHN0YXRlLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgICAgbGV0IGxhc3Ryb3VuZCA9IHN0YXRlLnJlc3VsdF9kYXRhW2xlbiAtIDFdO1xyXG4gICAgICBsZXQgcGxheWVyID0gKHN0YXRlLnBsYXllciA9IF8uZmlsdGVyKHN0YXRlLnBsYXllcnMsIHsgaWQ6IHBheWxvYWQgfSkpO1xyXG4gICAgICBsZXQgbmFtZSA9IF8ubWFwKHBsYXllciwgJ3Bvc3RfdGl0bGUnKSArICcnOyAvLyBjb252ZXJ0IHRvIHN0cmluZ1xyXG4gICAgICBsZXQgcGxheWVyX3RubyA9IHBhcnNlSW50KF8ubWFwKHBsYXllciwgJ3RvdV9ubycpKTtcclxuICAgICAgc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSA9IF8uZmluZChsYXN0cm91bmQsIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG5cclxuICAgICAgbGV0IHBkYXRhID0gKHN0YXRlLnBsYXllcmRhdGEgPSBfLmNoYWluKHN0YXRlLnJlc3VsdF9kYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCBzY29yZXMgPSBfLmZsYXR0ZW5EZWVwKF8ubWFwKG0sICdzY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBsZXQgYWxsT3BwU2NvcmVzID0gKHN0YXRlLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXMgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgbGV0IG9wcHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ29wcG9fc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gb3Bwc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLmFsbFJhbmtzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBIaVNjb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBwTG9TY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBMb1Njb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHMgPSBwSGlTY29yZVJvdW5kcy5qb2luKCk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcyA9IHBMb1Njb3JlUm91bmRzLmpvaW4oKTtcclxuXHJcbiAgICAgIGxldCBwUmJ5UiA9IF8ubWFwKHBkYXRhLCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uKGwpIHtcclxuICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgICAgICAgIGlmIChsLnJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ3dvbic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdBUic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ2RyZXcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ2xvc3QnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IHN0YXJ0aW5nID0gJ3JlcGx5aW5nJztcclxuICAgICAgICAgIGlmIChsLnN0YXJ0ID09ICd5Jykge1xyXG4gICAgICAgICAgICBzdGFydGluZyA9ICdzdGFydGluZyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAocmVzdWx0ID09ICdBUicpIHtcclxuICAgICAgICAgICAgbC5yZXBvcnQgPVxyXG4gICAgICAgICAgICAgICdJbiByb3VuZCAnICtcclxuICAgICAgICAgICAgICBsLnJvdW5kICtcclxuICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgIG5hbWUgK1xyXG4gICAgICAgICAgICAgICc8ZW0gdi1pZj1cImwuc3RhcnRcIj4sICgnICtcclxuICAgICAgICAgICAgICBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBpcyBwbGF5aW5nIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+LiBSZXN1bHRzIGFyZSBiZWluZyBhd2FpdGVkJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGwucmVwb3J0ID1cclxuICAgICAgICAgICAgICAnSW4gcm91bmQgJyArIGwucm91bmQgKyAnICcgK1xyXG4gICAgICAgICAgICAgIG5hbWUgKyAnPGVtIHYtaWY9XCJsLnN0YXJ0XCI+LCAoJyArIHN0YXJ0aW5nICtcclxuICAgICAgICAgICAgICAnKTwvZW0+IHBsYXllZCA8c3Ryb25nPicgKyBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gYW5kICcgKyByZXN1bHQgK1xyXG4gICAgICAgICAgICAgICcgPGVtPicgKyBsLnNjb3JlICsgJyAtICcgK1xyXG4gICAgICAgICAgICAgIGwub3Bwb19zY29yZSArICcsPC9lbT4gYSBkaWZmZXJlbmNlIG9mICcgK1xyXG4gICAgICAgICAgICAgIGwuZGlmZiArICcuIDxzcGFuIGNsYXNzPVwic3VtbWFyeVwiPjxlbT4nICtcclxuICAgICAgICAgICAgICBuYW1lICsgJzwvZW0+IGlzIHJhbmtlZCA8c3Ryb25nPicgKyBsLnBvc2l0aW9uICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IHdpdGggPHN0cm9uZz4nICsgbC5wb2ludHMgK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gcG9pbnRzIGFuZCBhIGN1bXVsYXRpdmUgc3ByZWFkIG9mICcgK1xyXG4gICAgICAgICAgICAgIGwubWFyZ2luICsgJyA8L3NwYW4+JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBSYnlSID0gXy5mbGF0dGVuRGVlcChwUmJ5Uik7XHJcblxyXG4gICAgICBsZXQgYWxsV2lucyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKF8uZmxhdHRlbkRlZXAocGRhdGEpLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ3dpbicgPT0gcC5yZXN1bHQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydFdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ3knXSkubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zID0gXy5maWx0ZXIoYWxsV2lucywgWydzdGFydCcsICduJ10pLmxlbmd0aDtcclxuICAgICAgbGV0IHN0YXJ0cyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKF8uZmxhdHRlbkRlZXAocGRhdGEpLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICBpZiAocC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydHMgPSBzdGFydHMubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbGllcyA9IHN0YXRlLnRvdGFsX3JvdW5kcyAtIHN0YXJ0cy5sZW5ndGg7XHJcblxyXG5cclxuICAgIH0sXHJcbiAgfSxcclxuICBhY3Rpb25zOiB7XHJcbiAgICBET19TVEFUUzogKGNvbnRleHQsIHBheWxvYWQpID0+IHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9TSE9XU1RBVFMnLCBwYXlsb2FkKTtcclxuICAgIH0sXHJcblxyXG4gICAgYXN5bmMgRkVUQ0hfQVBJIChjb250ZXh0LCBwYXlsb2FkKSAge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zXHJcbiAgICAgICAgLmdldCh1cmwsIHsgcGFyYW1zOiB7IHBhZ2U6IHBheWxvYWQgfSB9KVxyXG4gICAgICAgICB0cnkge1xyXG4gICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgICBjb25zb2xlLmxvZygnR2V0dGluZyBsaXN0cyBvZiB0b3VybmFtZW50cycpO1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhLm1hcChkYXRhID0+IHtcclxuICAgICAgICAgICAgLy8gRm9ybWF0IGFuZCBhc3NpZ24gVG91cm5hbWVudCBzdGFydCBkYXRlIGludG8gYSBsZXRpYWJsZVxyXG4gICAgICAgICAgICBsZXQgc3RhcnREYXRlID0gZGF0YS5zdGFydF9kYXRlO1xyXG4gICAgICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSBtb21lbnQobmV3IERhdGUoc3RhcnREYXRlKSkuZm9ybWF0KFxyXG4gICAgICAgICAgICAgICdkZGRkLCBNTU1NIERvIFlZWVknXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKG1vbWVudChoZWFkZXJzLmRhdGUpKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1vbWVudChoZWFkZXJzLmRhdGUpLCBcImZvbnQtc2l6ZTozMHB4O2NvbG9yOmdyZWVuO1wiKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTEFTVF9BQ0NFU1NfVElNRScsIGhlYWRlcnMuZGF0ZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VEQVRBJywgZGF0YSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NVUlJQQUdFJywgcGF5bG9hZCk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0RFVEFJTCAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgbGV0IHVybCA9IGAke2Jhc2VVUkx9dG91cm5hbWVudGA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pO1xyXG4gICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgZGF0YSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9EQVRBIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10X2RhdGFgO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHsgcGFyYW1zOiB7IHNsdWc6IHBheWxvYWQgfSB9KVxyXG4gICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICBsZXQgcGxheWVycyA9IGRhdGEucGxheWVycztcclxuICAgICAgICBsZXQgcmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YS5yZXN1bHRzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0ZFVENIIERBVEEgJHN0b3JlJylcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBsZXQgY2F0ZWdvcnkgPSBkYXRhLmV2ZW50X2NhdGVnb3J5WzBdLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBsZXQgbG9nbyA9IGRhdGEudG91cm5leVswXS5ldmVudF9sb2dvLmd1aWQ7XHJcbiAgICAgICAgbGV0IHRvdXJuZXlfdGl0bGUgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF90aXRsZTtcclxuICAgICAgICBsZXQgcGFyZW50X3NsdWcgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF9uYW1lO1xyXG4gICAgICAgIGxldCBldmVudF90aXRsZSA9IHRvdXJuZXlfdGl0bGUgKyAnICgnICsgY2F0ZWdvcnkgKyAnKSc7XHJcbiAgICAgICAgbGV0IHRvdGFsX3JvdW5kcyA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRTVEFUUycsIGRhdGEudG91cm5leSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9PTkdPSU5HJywgZGF0YS5vbmdvaW5nKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1BMQVlFUlMnLCBwbGF5ZXJzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JFU1VMVCcsIHJlc3VsdHMpO1xyXG4gICAgICAgIGxldCByYXRpbmdfc3RhdHMgPSBudWxsO1xyXG4gICAgICAgIGlmIChkYXRhLnN0YXRzX2pzb24pIHtcclxuICAgICAgICAgIHJhdGluZ19zdGF0cyA9IEpTT04ucGFyc2UoZGF0YS5zdGF0c19qc29uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SQVRJTkdfU1RBVFMnLCByYXRpbmdfc3RhdHMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRklOQUxfUkRfU1RBVFMnLCByZXN1bHRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NBVEVHT1JZJywgY2F0ZWdvcnkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HT19VUkwnLCBsb2dvKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVVJORVlfVElUTEUnLCB0b3VybmV5X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UX1RJVExFJywgZXZlbnRfdGl0bGUpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9UQUxfUk9VTkRTJywgdG90YWxfcm91bmRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1BBUkVOVFNMVUcnLCBwYXJlbnRfc2x1Zyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhdGNoIChlcnJvcilcclxuICAgICAge1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnJvci50b1N0cmluZygpKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gICAgRkVUQ0hfUkVTREFUQSAoY29udGV4dCwgcGF5bG9hZCkge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCB0cnVlKTtcclxuICAgICAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRfZGF0YWA7XHJcbiAgICAgICAgICBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSkudGhlbihyZXNwb25zZT0+e1xyXG4gICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgICAgbGV0IHBsYXllcnMgPSBkYXRhLnBsYXllcnM7XHJcbiAgICAgICAgICBsZXQgcmVzdWx0cyA9IEpTT04ucGFyc2UoZGF0YS5yZXN1bHRzKTtcclxuICAgICAgICAgIGxldCBjYXRlZ29yeSA9IGRhdGEuZXZlbnRfY2F0ZWdvcnlbMF0ubmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgbGV0IGxvZ28gPSBkYXRhLnRvdXJuZXlbMF0uZXZlbnRfbG9nby5ndWlkO1xyXG4gICAgICAgICAgbGV0IHRvdXJuZXlfdGl0bGUgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF90aXRsZTtcclxuICAgICAgICAgIGxldCBwYXJlbnRfc2x1ZyA9IGRhdGEudG91cm5leVswXS5wb3N0X25hbWU7XHJcbiAgICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgICAgbGV0IHRvdGFsX3JvdW5kcyA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVFNUQVRTJywgZGF0YS50b3VybmV5KTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1BMQVlFUlMnLCBwbGF5ZXJzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkVTVUxUJywgcmVzdWx0cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0NBVEVHT1JZJywgY2F0ZWdvcnkpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dPX1VSTCcsIGxvZ28pO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UX1RJVExFJywgZXZlbnRfdGl0bGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1RBTF9ST1VORFMnLCB0b3RhbF9yb3VuZHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT57XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG4vLyBleHBvcnQgZGVmYXVsdCBzdG9yZTtcclxuIl19
