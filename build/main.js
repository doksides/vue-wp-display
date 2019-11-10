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

},{"./pages/category.js":9,"./pages/detail.js":10,"./pages/list.js":11,"./pages/scoresheet.js":14,"./store.js":17,"@babel/runtime/helpers/interopRequireDefault":3}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorAlert = exports.LoadingAlert = void 0;
var LoadingAlert = Vue.component('loading', {
  template: "\n    <div class=\"mx-auto mt-5 d-block max-vw-75\">\n        <h4 class=\"display-4 bebas text-center text-secondary\">Loading..\n        <i class=\"fas fa-spinner fa-pulse\"></i>\n        <span class=\"sr-only\">Loading..</span></h4>\n    </div>"
});
exports.LoadingAlert = LoadingAlert;
var ErrorAlert = Vue.component('error', {
  template: "\n      <div class=\"alert alert-danger mt-5 mx-auto d-block max-vw-75\" role=\"alert\">\n          <h4 class=\"alert-heading text-center\">\n          <slot name=\"error\"></slot>\n          <span class=\"sr-only\">Error...</span>\n          </h4>\n          <div class=\"mx-auto text-center\">\n          <slot name=\"error_msg\"></slot>\n          </div>\n      </div>",
  data: function data() {
    return {};
  }
});
exports.ErrorAlert = ErrorAlert;

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

var _top = _interopRequireDefault(require("./top.js"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CateDetail = Vue.component('cate', {
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex\">\n              <b-img class=\"thumbnail logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n              <h2 class=\"text-left bebas\">{{ event_title }}\n              <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n              </h2>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <router-link :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:1}}\">\n                <b-button variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fas fa-clipboard\" aria-hidden=\"true\"></i> Scorecards</b-button>\n                </router-link>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><i class=\"fas fa-sticky-note\" aria-hidden=\"true\"></i> Results</b-button>\n                <b-button @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><i class=\"fas fa-sort-numeric-down    \"></i> Standings</b-button>\n                <b-button @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><i class=\"fas fa-chart-pie\"></i> Statistics</b-button>\n                <b-button  @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><i class=\"fas fa-chalkboard-teacher\"></i>\n                Scoreboard</b-button>\n                <b-button  @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><i class=\"fas fa-medal\"></i>\n                Top Performers</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-1 col-12 d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n        </div>\n\n        <template v-if=\"viewIndex==0\">\n          <allplayers :slug=\"slug\"></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-else-if=\"viewIndex==5\">\n        <scoreboard></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings v-if=\"viewIndex==1\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></pairings>\n                <results v-if=\"viewIndex==2\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></results>\n                <standings v-if=\"viewIndex==3\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
  components: {
    loading: _alerts.LoadingAlert,
    error: _alerts.ErrorAlert,
    allplayers: _playerlist.PlayerList,
    pairings: _playerlist.Pairings,
    results: _playerlist.Results,
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
      luckystiff: [],
      tuffluck: [],
      timer: ''
    };
  },
  created: function created() {
    console.log('Category mounted');
    var p = this.slug.split('-');
    p.shift();
    this.tourney_slug = p.join('-');
    this.fetchData();
  },
  watch: {
    viewIndex: {
      handler: function handler(val, oldVal) {
        if (val != 4) {
          this.getView(val);
        }
      },
      immediate: true
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

},{"./alerts.js":8,"./playerlist.js":12,"./scoreboard.js":13,"./stats.js":15,"./top.js":16,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],10:[function(require,module,exports){
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
  template: "\n  <div class=\"container-fluid\">\n    <template v-if=\"loading||error\">\n      <div class=\"row justify-content-center align-content-center align-items-center\">\n          <div v-if=\"loading\" class=\"col-12 justify-content-center align-self-center\">\n              <loading></loading>\n          </div>\n          <div v-else class=\"col-12 justify-content-center align-content-center align-self-center\">\n              <error>\n              <p slot=\"error\">{{error}}</p>\n              <p slot=\"error_msg\">{{error_msg}}</p>\n              </error>\n          </div>\n      </div>\n    </template>\n    <template v-else>\n        <div class=\"row\">\n            <div class=\"col-12 justify-content-center align-items-center\">\n                <h2 class=\"bebas text-center\">\n                    <i class=\"fa fa-trophy\"></i> Tournaments\n                </h2>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 col-lg-10 offset-lg-1\">\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                        :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n              <p class=\"text-muted\"> You are on page {{currentPage}} of {{WPpages}} pages; <span class=\"emphasize\">{{WPtotal}}</span> tournaments!</p>\n            </div>\n        </div>\n        <div class=\"row\">\n        <div  class=\"col-12 col-lg-10 offset-lg-1\" v-for=\"item in tourneys\" :key=\"item.id\">\n        <div class=\"d-flex flex-column flex-lg-row align-content-center align-items-center justify-content-lg-center justify-content-start tourney-list animated bounceInLeft\" >\n          <div class=\"mr-lg-5\">\n            <router-link :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n              <b-img fluid class=\"thumbnail\"\n                  :src=\"item.event_logo\" width=\"100\"  height=\"100\" :alt=\"item.event_logo_title\" />\n            </router-link>\n          </div>\n          <div class=\"mr-lg-auto\">\n            <h4 class=\"mb-1 display-5\">\n            <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                {{item.title}}\n            </router-link>\n            </h4>\n            <div class=\"text-center\">\n            <div class=\"d-inline p-1\">\n                <small><i class=\"fa fa-calendar\"></i>\n                    {{item.start_date}}\n                </small>\n            </div>\n          <div class=\"d-inline p-1\">\n              <small><i class=\"fa fa-map-marker\"></i>\n                  {{item.venue}}\n              </small>\n          </div>\n          <div class=\"d-inline p-1\">\n              <router-link v-if=\"item.slug\" :to=\"{ name: 'TourneyDetail', params: { slug: item.slug}}\">\n                  <small title=\"Browse tourney\"><i class=\"fa fa-link\"></i>\n                  </small>\n              </router-link>\n          </div>\n          <ul class=\"list-unstyled list-inline text-center category-list\">\n              <li class=\"list-inline-item mx-auto\"\n              v-for=\"category in item.tou_categories\">{{category.cat_name}}</li>\n          </ul>\n          </div>\n          </div>\n        </div>\n       </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-12 d-flex flex-column justify-content-lg-end\">\n          <p class=\"my-0 py-0\"><small class=\"text-muted\">You are on page {{currentPage}} of {{WPpages}} pages with <span class=\"emphasize\">{{WPtotal}}</span>\n          tournaments!</small></p>\n              <b-pagination align=\"center\" :total-rows=\"+WPtotal\" @change=\"fetchList\" v-model=\"currentPage\" :per-page=\"10\"\n                  :hide-ellipsis=\"false\" aria-label=\"Navigation\" />\n        </div>\n      </div>\n   </template>\n</div>\n",
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
  template: "\n  <div class=\"row justify-content-center align-items-center\" id=\"players-list\">\n    <template v-if=\"showStats\">\n        <playerstats :pstats=\"pStats\"></playerstats>\n    </template>\n    <template v-else>\n    <transition-group tag=\"div\" name=\"players-list\">\n    <div class=\"playerCols col-lg-2 col-sm-6 col-12 p-4 \" v-for=\"player in data\" :key=\"player.id\" >\n            <h4 class=\"mx-auto bebas\"><small>#{{player.pno}}</small>\n            {{player.player}}<span class=\"ml-2\" @click=\"sortPos()\" style=\"cursor: pointer; font-size:0.8em\"><i v-if=\"asc\" class=\"fa fa-sort-numeric-down\" aria-hidden=\"true\" title=\"Click to sort DESC by current rank\"></i><i v-else class=\"fa fa-sort-numeric-up\" aria-hidden=\"true\" title=\"Click to sort ASC by current rank\"></i></span><span v-if=\"sorted\" class=\"ml-3\" @click=\"restoreSort()\" style=\"cursor: pointer; font-size:0.8em\"><i class=\"fa fa-undo\" aria-hidden=\"true\" title=\"Click to reset list\"></i></span>\n            <span class=\"d-block mx-auto\"  style=\"font-size:small\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\" :title=\"player.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': player.gender == 'm',\n        'fa-female': player.gender == 'f',\n        'fa-users': player.is_team == 'yes' }\"\n                    aria-hidden=\"true\"></i>\n              <span style=\"color:tomato; font-size:1.4em\" class=\"ml-5\" v-if=\"sorted\">{{player.position}}</span>\n             </span>\n            </h4>\n            <div class=\"mx-auto text-center animated fadeIn\">\n              <b-img-lazy v-bind=\"imgProps\" :alt=\"player.player\" :src=\"player.photo\" :id=\"'popover-'+player.id\"></b-img-lazy>\n              <span class=\"d-block mt-2 mx-auto\">\n              <span @click=\"showPlayerStats(player.id)\" title=\"Show  stats\">\n              <i class=\"fas fa-chart-bar\" aria-hidden=\"true\"></i>\n              </span>\n              <span class=\"ml-4\" title=\"Show Scoresheet\">\n                  <router-link exact :to=\"{ name: 'Scoresheet', params: {  event_slug:slug, pno:player.pno}}\">\n                  <i class=\"fas fa-clipboard\" aria-hidden=\"true\"></i>\n                  </router-link>\n              </span>\n              </span>\n              <!---popover -->\n              <b-popover @show=\"getLastGames(player.pno)\" placement=\"bottom\"  :target=\"'popover-'+player.id\" triggers=\"hover\" boundary-padding=\"5\">\n              <div class=\"d-flex flex-row justify-content-center\">\n                <div class=\"d-flex flex-column flex-wrap align-content-between align-items-start mr-2 justify-content-around\">\n                  <span class=\"flex-grow-1 align-self-center\" style=\"font-size:1.5em;\">{{mstat.position}}</span>\n                  <span class=\"flex-shrink-1 d-inline-block text-muted\"><small>{{mstat.wins}}-{{mstat.draws}}-{{mstat.losses}}</small></span>\n                </div>\n                <div class=\"d-flex flex-column flex-wrap align-content-center\">\n                <span class=\"text-primary d-inline-block\" style=\"font-size:0.8em; text-decoration:underline\">Last Game: Round {{mstat.round}}</span>\n                    <span class=\"d-inline-block p-1 text-white sdata-res text-center\"\n                      v-bind:class=\"{'bg-warning': mstat.result === 'draw',\n                          'bg-info': mstat.result === 'awaiting',\n                          'bg-danger': mstat.result === 'loss',\n                          'bg-success': mstat.result === 'win' }\">\n                          {{mstat.score}}-{{mstat.oppo_score}} ({{mstat.result|firstchar}})\n                    </span>\n                    <div>\n                    <img :src=\"mstat.opp_photo\" :alt=\"mstat.oppo\" class=\"rounded-circle m-auto d-inline-block\" width=\"25\" height=\"25\">\n                    <span class=\"text-info d-inline-block\" style=\"font-size:0.9em\"><small>#{{mstat.oppo_no}} {{mstat.oppo|abbrv}}</small></span>\n                    </div>\n                </div>\n              </div>\n              </b-popover>\n          </div>\n         </div>\n         </transition-group>\n      </template>\n    </div>\n    ",
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
        width: '80px',
        height: '80px',
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
        r['_cellVariants']['lastGame'] = 'warning';

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

},{"../config.js":6,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],14:[function(require,module,exports){
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
  template: "\n  <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <template v-if=\"loading||error\">\n    <div class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    </template>\n    <template v-else>\n    <div class=\"row justify-content-center align-items-center\">\n      <div class=\"col-12 d-flex\">\n        <b-img class=\"thumbnail logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n        <h2 class=\"text-center bebas\">{{ event_title }}\n        <span class=\"text-center d-block\">Scorecards <i class=\"fas fa-clipboard\"></i></span>\n        </h2>\n      </div>\n    </div>\n    <div class=\"row justify-content-center\">\n      <div class=\"col-md-3 col-12\">\n      <!-- player list here -->\n        <ul class=\"shadow p-3 mb-5 bg-white rounded\">\n          <li :key=\"player.pno\" v-for=\"player in pdata\" class=\"bebas\">\n          <span>{{player.pno}}</span> <b-img-lazy :alt=\"player.player\" :src=\"player.photo\" v-bind=\"picProps\"></b-img-lazy>\n            <b-button @click=\"getCard(player.pno)\" variant=\"link\">{{player.player}}</b-button>\n          </li>\n        </ul>\n      </div>\n      <div class=\"col-md-9 col-12\">\n          <template v-if=\"resultdata\">\n          <h4 class=\"bebas\">#{{mPlayer.pno}}\n          <b-img :alt=\"mPlayer.player\" :src=\"mPlayer.photo\" style=\"width: 50px; height:50px\"></b-img>\n          {{mPlayer.player}}: ScoreCard</h4>\n          <table class=\"bebas table table-hover table-responsive-md\" style=\"width:95%; text-align:center; vertical-align: middle\">\n          <thead class=\"thead-dark bebas\">\n            <tr>\n              <th scope=\"col\">Rd</th>\n              <th scope=\"col\">Opp. Name</th>\n              <th scope=\"col\">Opp. Score</th>\n              <th scope=\"col\">Score</th>\n              <th scope=\"col\">Diff</th>\n              <th scope=\"col\">Result</th>\n              <th scope=\"col\">Won</th>\n              <th scope=\"col\">Lost</th>\n              <th scope=\"col\">Points</th>\n              <th scope=\"col\">Cum. Spread</th>\n              <th scope=\"col\">Rank</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr v-for=\"s in scorecard\">\n              <td>{{s.round}}<sup v-if=\"s.start =='y'\">*</sup></td>\n              <td style=\"text-align:left\"><small>#{{s.oppo_no}}</small><b-img-lazy :alt=\"s.oppo\" :src=\"s.opp_photo\" v-bind=\"picProps\"></b-img-lazy>\n              <b-button @click=\"getCard(s.oppo_no)\" variant=\"link\">\n              {{s.oppo|abbrv}}\n              </b-button>\n              </td>\n              <td>{{s.oppo_score}}</td>\n              <td>{{s.score}}</td>\n              <td>{{s.diff}}</td>\n              <td v-bind:class=\"{'table-warning': s.result === 'draw',\n              'table-info': s.result === 'awaiting',\n              'table-danger': s.result === 'loss',\n              'table-success': s.result === 'win' }\">{{s.result|firstchar}}</td>\n              <td>{{s.wins}}</td>\n              <td>{{s.losses}}</td>\n              <td>{{s.points}}</td>\n              <td>{{s.margin}}</td>\n              <td>{{s.position}}</td>\n            </tr>\n          </tbody>\n          </table>\n          </template>\n          <!-- scorecards here -->\n      </div>\n    </div>\n    </template>\n  </div>\n  ",
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
        blankColor: '#bbb',
        width: '25px',
        height: '25px',
        "class": 'shadow-sm, mx-1'
      },
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

      this.scorecard = _.chain(c).map(function (v) {
        return _.filter(v, function (o) {
          return o.pno == n;
        });
      }).flattenDeep().value();
      this.mPlayer = _.first(this.scorecard);
      this.$router.replace({
        name: 'Scoresheet',
        params: {
          pno: n
        }
      });
      this.player_no = n;
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

},{"./alerts.js":8,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-2 col-sm-4 col-12\">\n        <div class=\"mt-5 d-flex flex-column align-content-center align-items-center justify-content-center\">\n          <b-button variant=\"btn-outline-success\" title=\"Top 3\" class=\"m-2 btn-block\" @click=\"showPic('top3')\" :pressed=\"currentView=='top3'\">\n            <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>Top 3</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Game Scores\" class=\"m-2 btn-block\" @click=\"showPic('higames')\" :pressed=\"currentView=='higames'\">\n            <i class=\"fas fa-bullseye m-1\" aria-hidden=\"true\"></i>High Game</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Average Scores\" class=\"m-2 btn-block\" :pressed=\"currentView=='hiaves'\"\n            @click=\"showPic('hiaves')\">\n            <i class=\"fas fa-thumbs-up m-1\" aria-hidden=\"true\"></i>High Ave. Scores</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Lowest Average Opponent Scores\" class=\"m-2 btn-block\" @click=\"showPic('looppaves')\" :pressed=\"currentView=='looppaves'\">\n            <i class=\"fas fa-beer mr-1\" aria-hidden=\"true\"></i>Low Opp Ave</b-button>\n        </div>\n      </div>\n      <div class=\"col-lg-10 col-sm-8 col-12\">\n        <div class=\"row\">\n          <div class=\"col-12 justify-content-center align-content-center\">\n            <h3>{{title}}</h3>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-12 animated fadeInRightBig\" v-for=\"(item, index) in stats\">\n            <h4 class=\"p-2 text-center bebas bg-dark text-white\">{{item.player}}</h4>\n            <div class=\"d-flex flex-column justify-content-center align-items-center\">\n              <img :src=\"players[item.pno-1].photo\" width='120' height='120' class=\"img-fluid rounded-circle\"\n                :alt=\"players[item.pno-1].post_title|lowercase\">\n              <span class=\"d-block ml-5\">\n                <i class=\"mx-1 flag-icon\" :class=\"'flag-icon-'+players[item.pno-1].country | lowercase\"\n                  :title=\"players[item.pno-1].country_full\"></i>\n                <i class=\"mx-1 fa\"\n                  :class=\"{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}\"\n                  aria-hidden=\"true\">\n                </i>\n              </span>\n            </div>\n            <div class=\"d-flex flex-row justify-content-center align-content-center bg-dark text-white\">\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.points\">{{item.points}}</span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.margin\">{{item.margin|addplus}}</span>\n              <span class=\"mx-1 text-center display-5 d-inline-block align-self-center\" v-if=\"item.score\">Round {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class=\"d-flex justify-content-center align-items-center bg-success text-white\">\n              <div v-if=\"item.score\" class=\"display-4 yanone d-inline-flex\">{{item.score}}</div>\n              <div v-if=\"item.position\" class=\"display-4 yanone d-inline-flex\">{{item.position}}</div>\n              <div v-if=\"item.ave_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_score}}</div>\n              <div v-if=\"item.ave_opp_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_opp_score}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  ",
  data: function data() {
    return {
      title: '',
      profiles: [],
      stats: [],
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
    }
  },
  computed: _objectSpread({}, mapGetters({
    players: 'PLAYERS',
    total_rounds: 'TOTAL_ROUNDS',
    finalstats: 'FINAL_ROUND_STATS',
    resultdata: 'RESULTDATA',
    ongoing: 'ONGOING_TOURNEY'
  }))
});
var _default = topPerformers;
exports["default"] = _default;

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],17:[function(require,module,exports){
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
            l.report = 'In round ' + l.round + ' ' + name + '<em v-if="l.start">, (' + starting + ')</em> played <strong>' + l.oppo + '</strong> and ' + result + ' <em>' + l.score + ' - ' + l.oppo_score + '</em> a difference of ' + l.diff + '. <span class="summary"><em>' + name + '</em> is ranked <strong>' + l.position + '</strong> with <strong>' + l.points + '</strong> points and a cumulative spread of ' + l.margin + ' </span>';
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
      console.log('-----------Starts Count-------------------');
      console.log(starts.length);
      console.log('-----------Starts Win Count-------------------');
      console.log(state.player_stats.startWins);
      console.log('-----------Replies Count ---------------------');
      console.log(state.total_rounds - starts.length);
      console.log('-----------Reply Win Count ----------------------');
      console.log(state.player_stats.replyWins);
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
        var url, response, data, players, results, category, logo, tourney_title, parent_slug, event_title, total_rounds;
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
                console.log(results);
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
                context.commit('SET_FINAL_RD_STATS', results);
                context.commit('SET_CATEGORY', category);
                context.commit('SET_LOGO_URL', logo);
                context.commit('SET_TOURNEY_TITLE', tourney_title);
                context.commit('SET_EVENT_TITLE', event_title);
                context.commit('SET_TOTAL_ROUNDS', total_rounds);
                context.commit('SET_PARENTSLUG', parent_slug);
                context.commit('SET_LOADING', false);
                _context3.next = 35;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t0 = _context3["catch"](2);
                context.commit('SET_ERROR', _context3.t0.toString());
                context.commit('SET_LOADING', false);

              case 35:
                ;

              case 36:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 31]]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc2NvcmVzaGVldC5qcyIsInZ1ZS9wYWdlcy9zdGF0cy5qcyIsInZ1ZS9wYWdlcy90b3AuanMiLCJ2dWUvc3RvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LEVBQThCLEtBQTlCO0FBQ0QsT0ExQkM7QUEyQkw7QUF2SE07QUE5U2tCLENBQWYsQ0FBZCxDLENBeWFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwiZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5IGluIG9iaikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2RlZmluZVByb3BlcnR5OyIsImZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7XG4gICAgXCJkZWZhdWx0XCI6IG9ialxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQ7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBleHBvcnRzLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIGV4cG9ydHMubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgZXhwb3J0cy5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgZXhwb3J0cy5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAvLyBOb3RlOiBbXCJyZXR1cm5cIl0gbXVzdCBiZSB1c2VkIGZvciBFUzMgcGFyc2luZyBjb21wYXRpYmlsaXR5LlxuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl0pIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcblxuICAgICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAvLyBJZiBtYXliZUludm9rZURlbGVnYXRlKGNvbnRleHQpIGNoYW5nZWQgY29udGV4dC5tZXRob2QgZnJvbVxuICAgICAgICAgICAgLy8gXCJyZXR1cm5cIiB0byBcInRocm93XCIsIGxldCB0aGF0IG92ZXJyaWRlIHRoZSBUeXBlRXJyb3IgYmVsb3cuXG4gICAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIFwiVGhlIGl0ZXJhdG9yIGRvZXMgbm90IHByb3ZpZGUgYSAndGhyb3cnIG1ldGhvZFwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKG1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGNvbnRleHQuYXJnKTtcblxuICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuXG4gICAgaWYgKCEgaW5mbykge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXCJpdGVyYXRvciByZXN1bHQgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuXG4gICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgLy8gQXNzaWduIHRoZSByZXN1bHQgb2YgdGhlIGZpbmlzaGVkIGRlbGVnYXRlIHRvIHRoZSB0ZW1wb3JhcnlcbiAgICAgIC8vIHZhcmlhYmxlIHNwZWNpZmllZCBieSBkZWxlZ2F0ZS5yZXN1bHROYW1lIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0W2RlbGVnYXRlLnJlc3VsdE5hbWVdID0gaW5mby52YWx1ZTtcblxuICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBhdCB0aGUgZGVzaXJlZCBsb2NhdGlvbiAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcblxuICAgICAgLy8gSWYgY29udGV4dC5tZXRob2Qgd2FzIFwidGhyb3dcIiBidXQgdGhlIGRlbGVnYXRlIGhhbmRsZWQgdGhlXG4gICAgICAvLyBleGNlcHRpb24sIGxldCB0aGUgb3V0ZXIgZ2VuZXJhdG9yIHByb2NlZWQgbm9ybWFsbHkuIElmXG4gICAgICAvLyBjb250ZXh0Lm1ldGhvZCB3YXMgXCJuZXh0XCIsIGZvcmdldCBjb250ZXh0LmFyZyBzaW5jZSBpdCBoYXMgYmVlblxuICAgICAgLy8gXCJjb25zdW1lZFwiIGJ5IHRoZSBkZWxlZ2F0ZSBpdGVyYXRvci4gSWYgY29udGV4dC5tZXRob2Qgd2FzXG4gICAgICAvLyBcInJldHVyblwiLCBhbGxvdyB0aGUgb3JpZ2luYWwgLnJldHVybiBjYWxsIHRvIGNvbnRpbnVlIGluIHRoZVxuICAgICAgLy8gb3V0ZXIgZ2VuZXJhdG9yLlxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kICE9PSBcInJldHVyblwiKSB7XG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlLXlpZWxkIHRoZSByZXN1bHQgcmV0dXJuZWQgYnkgdGhlIGRlbGVnYXRlIG1ldGhvZC5cbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIC8vIFRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBpcyBmaW5pc2hlZCwgc28gZm9yZ2V0IGl0IGFuZCBjb250aW51ZSB3aXRoXG4gICAgLy8gdGhlIG91dGVyIGdlbmVyYXRvci5cbiAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgfVxuXG4gIC8vIERlZmluZSBHZW5lcmF0b3IucHJvdG90eXBlLntuZXh0LHRocm93LHJldHVybn0gaW4gdGVybXMgb2YgdGhlXG4gIC8vIHVuaWZpZWQgLl9pbnZva2UgaGVscGVyIG1ldGhvZC5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEdwKTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwiY29uc3QgYmFzZVVSTCA9ICcvd3AtanNvbi93cC92Mi8nO1xyXG5leHBvcnQge2Jhc2VVUkwgYXMgZGVmYXVsdH1cclxuXHJcbiIsImltcG9ydCBzdG9yZSBmcm9tICcuL3N0b3JlLmpzJztcclxuaW1wb3J0IHNjckxpc3QgZnJvbSAnLi9wYWdlcy9saXN0LmpzJztcclxuaW1wb3J0IHREZXRhaWwgZnJvbSAnLi9wYWdlcy9kZXRhaWwuanMnO1xyXG5pbXBvcnQgQ2F0ZURldGFpbCBmcm9tICcuL3BhZ2VzL2NhdGVnb3J5LmpzJztcclxuaW1wb3J0IHNDYXJkIGZyb20gJy4vcGFnZXMvc2NvcmVzaGVldC5qcyc7XHJcblxyXG5WdWUuZmlsdGVyKCdhYmJydicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIGlmICghdmFsdWUpIHJldHVybiAgJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBmaXJzdCA9IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIHZhciBuID0gdmFsdWUudHJpbSgpLnNwbGl0KFwiIFwiKTtcclxuICB2YXIgbGFzdCA9IG5bbi5sZW5ndGggLSAxXTtcclxuICByZXR1cm4gZmlyc3QgKyBcIi4gXCIgKyBsYXN0O1xyXG59KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2ZpcnN0Y2hhcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pO1xyXG5cclxuICBWdWUuZmlsdGVyKCdsb3dlcmNhc2UnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKVxyXG4gIH0pXHJcblxyXG4gIFZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICB2YXIgbiA9IE1hdGguZmxvb3IoTnVtYmVyKHZhbHVlKSlcclxuICAgIGlmIChuICE9PSBJbmZpbml0eSAmJiBTdHJpbmcobikgPT09IHZhbHVlICYmIG4gPiAwKSB7XHJcbiAgICAgIHJldHVybiAnKycgKyB2YWx1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfSlcclxuXHJcbiAgVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh2YWx1ZSksIG51bGwsIDIpXHJcbiAgfSlcclxuXHJcbiAgY29uc3Qgcm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgIGNvbXBvbmVudDogc2NyTGlzdCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ05TRiBUb3VybmFtZW50cyAtIFJlc3VsdHMgYW5kIFN0YXRpc3RpY3MnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzLzpzbHVnJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IHREZXRhaWwsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdUb3VybmFtZW50IERldGFpbHMnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcnLFxyXG4gICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgIGNvbXBvbmVudDogQ2F0ZURldGFpbCxcclxuICAgICAgcHJvcHM6IHRydWUsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcvOnBubycsXHJcbiAgICAgIG5hbWU6ICdTY29yZXNoZWV0JyxcclxuICAgICAgY29tcG9uZW50OiBzQ2FyZCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ1BsYXllciBTY29yZWNhcmRzJyB9XHJcbiAgICB9XHJcbiAgXTtcclxuXHJcbmNvbnN0IHJvdXRlciA9IG5ldyBWdWVSb3V0ZXIoe1xyXG4gIG1vZGU6ICdoaXN0b3J5JyxcclxuICByb3V0ZXM6IHJvdXRlcywgLy8gc2hvcnQgZm9yIGByb3V0ZXM6IHJvdXRlc2BcclxufSk7XHJcbnJvdXRlci5iZWZvcmVFYWNoKCh0bywgZnJvbSwgbmV4dCkgPT4ge1xyXG4gIGRvY3VtZW50LnRpdGxlID0gdG8ubWV0YS50aXRsZTtcclxuICBuZXh0KCk7XHJcbn0pO1xyXG5cclxubmV3IFZ1ZSh7XHJcbiAgZWw6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhcHAnKSxcclxuICByb3V0ZXIsXHJcbiAgc3RvcmVcclxufSlcclxuXHJcblxyXG4iLCJ2YXIgTG9hZGluZ0FsZXJ0ID0gVnVlLmNvbXBvbmVudCgnbG9hZGluZycse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byBtdC01IGQtYmxvY2sgbWF4LXZ3LTc1XCI+XHJcbiAgICAgICAgPGg0IGNsYXNzPVwiZGlzcGxheS00IGJlYmFzIHRleHQtY2VudGVyIHRleHQtc2Vjb25kYXJ5XCI+TG9hZGluZy4uXHJcbiAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1wdWxzZVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj5Mb2FkaW5nLi48L3NwYW4+PC9oND5cclxuICAgIDwvZGl2PmBcclxuIH0pO1xyXG5cclxudmFyIEVycm9yQWxlcnQgPVZ1ZS5jb21wb25lbnQoJ2Vycm9yJywge1xyXG4gICB0ZW1wbGF0ZTogYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIG10LTUgbXgtYXV0byBkLWJsb2NrIG1heC12dy03NVwiIHJvbGU9XCJhbGVydFwiPlxyXG4gICAgICAgICAgPGg0IGNsYXNzPVwiYWxlcnQtaGVhZGluZyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgPHNsb3QgbmFtZT1cImVycm9yXCI+PC9zbG90PlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+RXJyb3IuLi48L3NwYW4+XHJcbiAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm14LWF1dG8gdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxzbG90IG5hbWU9XCJlcnJvcl9tc2dcIj48L3Nsb3Q+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+YCxcclxuICAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgcmV0dXJuIHt9O1xyXG4gICB9LFxyXG4gfSk7XHJcblxyXG5leHBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9XHJcblxyXG4iLCJpbXBvcnQgeyBQYWlyaW5ncywgU3RhbmRpbmdzLCBQbGF5ZXJMaXN0LCBSZXN1bHRzfSBmcm9tICcuL3BsYXllcmxpc3QuanMnO1xyXG5pbXBvcnQge0xvYWRpbmdBbGVydCwgRXJyb3JBbGVydH0gZnJvbSAnLi9hbGVydHMuanMnO1xyXG5pbXBvcnQgeyBIaVdpbnMsIExvV2lucywgSGlMb3NzLCBDb21ib1Njb3JlcywgVG90YWxTY29yZXMsIFRvdGFsT3BwU2NvcmVzLCBBdmVTY29yZXMsIEF2ZU9wcFNjb3JlcywgSGlTcHJlYWQsIExvU3ByZWFkIH0gZnJvbSAnLi9zdGF0cy5qcyc7XHJcbmltcG9ydCBTY29yZWJvYXJkIGZyb20gJy4vc2NvcmVib2FyZC5qcyc7XHJcbmltcG9ydCB0b3BQZXJmb3JtZXJzIGZyb20gJy4vdG9wLmpzJztcclxuZXhwb3J0IHsgQ2F0ZURldGFpbCBhcyBkZWZhdWx0IH07XHJcbmxldCBDYXRlRGV0YWlsID0gVnVlLmNvbXBvbmVudCgnY2F0ZScsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPGRpdiB2LWlmPVwicmVzdWx0ZGF0YVwiIGNsYXNzPVwicm93IG5vLWd1dHRlcnMganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy10b3BcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XHJcbiAgICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiIGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cIiEoZXJyb3J8fGxvYWRpbmcpXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGQtZmxleFwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZyBjbGFzcz1cInRodW1ibmFpbCBsb2dvIG1sLWF1dG9cIiA6c3JjPVwibG9nb1wiIDphbHQ9XCJldmVudF90aXRsZVwiIC8+XHJcbiAgICAgICAgICAgICAgPGgyIGNsYXNzPVwidGV4dC1sZWZ0IGJlYmFzXCI+e3sgZXZlbnRfdGl0bGUgfX1cclxuICAgICAgICAgICAgICA8c3BhbiA6dGl0bGU9XCJ0b3RhbF9yb3VuZHMrICcgcm91bmRzLCAnICsgdG90YWxfcGxheWVycyArJyBwbGF5ZXJzJ1wiIHYtc2hvdz1cInRvdGFsX3JvdW5kc1wiIGNsYXNzPVwidGV4dC1jZW50ZXIgZC1ibG9ja1wiPnt7IHRvdGFsX3JvdW5kcyB9fSBHYW1lcyB7eyB0b3RhbF9wbGF5ZXJzfX0gPGkgY2xhc3M9XCJmYXMgZmEtdXNlcnNcIj48L2k+IDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MFwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0wXCI+PGkgY2xhc3M9XCJmYSBmYS11c2Vyc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUGxheWVyczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnU2NvcmVzaGVldCcsIHBhcmFtczogeyAgZXZlbnRfc2x1ZzpzbHVnLCBwbm86MX19XCI+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0wXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTBcIj48aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFNjb3JlY2FyZHM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MVwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0xXCI+IDxpIGNsYXNzPVwiZmEgZmEtdXNlci1wbHVzXCI+PC9pPiBQYWlyaW5nczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTJcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTJcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MlwiPjxpIGNsYXNzPVwiZmFzIGZhLXN0aWNreS1ub3RlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBSZXN1bHRzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9M1wiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09M1wiIDpwcmVzc2VkPVwidmlld0luZGV4PT0zXCI+PGkgY2xhc3M9XCJmYXMgZmEtc29ydC1udW1lcmljLWRvd24gICAgXCI+PC9pPiBTdGFuZGluZ3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD00XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT00XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTRcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFydC1waWVcIj48L2k+IFN0YXRpc3RpY3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uICBAY2xpY2s9XCJ2aWV3SW5kZXg9NVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIGFjdGl2ZS1jbGFzcz1cImN1cnJlbnRWaWV3XCIgOmRpc2FibGVkPVwidmlld0luZGV4PT01XCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTVcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFsa2JvYXJkLXRlYWNoZXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICBTY29yZWJvYXJkPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiAgQGNsaWNrPVwidmlld0luZGV4PTZcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NlwiIDpwcmVzc2VkPVwidmlld0luZGV4PT02XCI+PGkgY2xhc3M9XCJmYXMgZmEtbWVkYWxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICBUb3AgUGVyZm9ybWVyczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTEwIG9mZnNldC1tZC0xIGNvbC0xMiBkLWZsZXggZmxleC1jb2x1bW5cIj5cclxuICAgICAgICAgICAgICA8aDMgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhcyBwLTAgbS0wXCI+IHt7dGFiX2hlYWRpbmd9fVxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJ2aWV3SW5kZXggPjAgJiYgdmlld0luZGV4IDwgNFwiPlxyXG4gICAgICAgICAgICAgIHt7IGN1cnJlbnRSb3VuZCB9fVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2gzPlxyXG4gICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1BhZ2luYXRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwidG90YWxfcm91bmRzXCIgdi1tb2RlbD1cImN1cnJlbnRSb3VuZFwiIDpwZXItcGFnZT1cIjFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJ0cnVlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiBjaGFuZ2U9XCJyb3VuZENoYW5nZVwiPlxyXG4gICAgICAgICAgICAgICAgICA8L2ItcGFnaW5hdGlvbj5cclxuICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTBcIj5cclxuICAgICAgICAgIDxhbGxwbGF5ZXJzIDpzbHVnPVwic2x1Z1wiPjwvYWxscGxheWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT02XCI+XHJcbiAgICAgICAgICA8cGVyZm9ybWVycz48L3BlcmZvcm1lcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1lbHNlLWlmPVwidmlld0luZGV4PT01XCI+XHJcbiAgICAgICAgPHNjb3JlYm9hcmQ+PC9zY29yZWJvYXJkPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTRcIiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMCBjb2xcIj5cclxuICAgICAgICAgICAgICAgIDxiLXRhYnMgY29udGVudC1jbGFzcz1cIm10LTMgc3RhdHNUYWJzXCIgcGlsbHMgc21hbGwgbGF6eSBuby1mYWRlICB2LW1vZGVsPVwidGFiSW5kZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGl3aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaXdpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIExvc3Nlc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaWxvc3MgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGlsb3NzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG93aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sb3dpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJDb21iaW5lZCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbWJvc2NvcmVzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbWJvc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0b3RhbHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9zY29yZScpXCI+PC90b3RhbHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9vcHBzY29yZScpXCI+PC9vcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX3Njb3JlJylcIj48L2F2ZXNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX29wcHNjb3JlJylcIj48L2F2ZW9wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggU3ByZWFkcyBcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlzcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9oaXNwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBTcHJlYWRzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvbG9zcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgIDwvYi10YWJzPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTggb2Zmc2V0LW1kLTIgY29sLTEyXCI+XHJcbiAgICAgICAgICAgICAgICA8cGFpcmluZ3Mgdi1pZj1cInZpZXdJbmRleD09MVwiIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L3BhaXJpbmdzPlxyXG4gICAgICAgICAgICAgICAgPHJlc3VsdHMgdi1pZj1cInZpZXdJbmRleD09MlwiIDpjdXJyZW50Um91bmQ9XCJjdXJyZW50Um91bmRcIiA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj48L3Jlc3VsdHM+XHJcbiAgICAgICAgICAgICAgICA8c3RhbmRpbmdzIHYtaWY9XCJ2aWV3SW5kZXg9PTNcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9zdGFuZGluZ3M+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIGNvbXBvbmVudHM6IHtcclxuICAgIGxvYWRpbmc6IExvYWRpbmdBbGVydCxcclxuICAgIGVycm9yOiBFcnJvckFsZXJ0LFxyXG4gICAgYWxscGxheWVyczogUGxheWVyTGlzdCxcclxuICAgIHBhaXJpbmdzOiBQYWlyaW5ncyxcclxuICAgIHJlc3VsdHM6IFJlc3VsdHMsXHJcbiAgICBzdGFuZGluZ3M6IFN0YW5kaW5ncyxcclxuICAgIGhpd2luczogSGlXaW5zLFxyXG4gICAgaGlsb3NzOiBIaUxvc3MsXHJcbiAgICBsb3dpbjogTG9XaW5zLFxyXG4gICAgY29tYm9zY29yZXM6IENvbWJvU2NvcmVzLFxyXG4gICAgdG90YWxzY29yZXM6IFRvdGFsU2NvcmVzLFxyXG4gICAgb3Bwc2NvcmVzOiBUb3RhbE9wcFNjb3JlcyxcclxuICAgIGF2ZXNjb3JlczogQXZlU2NvcmVzLFxyXG4gICAgYXZlb3Bwc2NvcmVzOiBBdmVPcHBTY29yZXMsXHJcbiAgICBoaXNwcmVhZDogSGlTcHJlYWQsXHJcbiAgICBsb3NwcmVhZDogTG9TcHJlYWQsXHJcbiAgICAvLyAnbHVja3lzdGlmZi10YWJsZSc6IEx1Y2t5U3RpZmZUYWJsZSxcclxuICAgIC8vICd0dWZmbHVjay10YWJsZSc6IFR1ZmZMdWNrVGFibGVcclxuICAgIHNjb3JlYm9hcmQ6IFNjb3JlYm9hcmQsXHJcbiAgICBwZXJmb3JtZXJzOiB0b3BQZXJmb3JtZXJzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgdG91cm5leV9zbHVnOiAnJyxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBnYW1lZGF0YTogW10sXHJcbiAgICAgIHRhYkluZGV4OiAwLFxyXG4gICAgICB2aWV3SW5kZXg6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogMSxcclxuICAgICAgdGFiX2hlYWRpbmc6ICcnLFxyXG4gICAgICBjYXB0aW9uOiAnJyxcclxuICAgICAgc2hvd1BhZ2luYXRpb246IGZhbHNlLFxyXG4gICAgICBsdWNreXN0aWZmOiBbXSxcclxuICAgICAgdHVmZmx1Y2s6IFtdLFxyXG4gICAgICB0aW1lcjogJycsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2F0ZWdvcnkgbW91bnRlZCcpO1xyXG4gICAgdmFyIHAgPSB0aGlzLnNsdWcuc3BsaXQoJy0nKTtcclxuICAgIHAuc2hpZnQoKTtcclxuICAgIHRoaXMudG91cm5leV9zbHVnID0gcC5qb2luKCctJyk7XHJcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xyXG4gIH0sXHJcbiAgd2F0Y2g6IHtcclxuICAgIHZpZXdJbmRleDoge1xyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbih2YWwsIG9sZFZhbCkge1xyXG4gICAgICAgIGlmICh2YWwgIT0gNCkge1xyXG4gICAgICAgICAgdGhpcy5nZXRWaWV3KHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBpbW1lZGlhdGU6IHRydWUsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmVmb3JlVXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRoaXMuZXZlbnRfdGl0bGU7XHJcbiAgICBpZiAodGhpcy52aWV3SW5kZXggPT0gNCkge1xyXG4gICAgICB0aGlzLmdldFRhYnModGhpcy50YWJJbmRleCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VmlldzogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdSYW4gZ2V0VmlldyBmdW5jdGlvbiB2YWwtPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1BsYXllcnMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUGFpcmluZyBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnKlBsYXlzIGZpcnN0JztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdSZXN1bHRzIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSZXN1bHRzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTdGFuZGluZ3MgYWZ0ZXIgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1N0YW5kaW5ncyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICcnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIGdldFRhYnM6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFRhYnMgZnVuY3Rpb24tPiAnICsgdmFsKTtcclxuICAgICAgc3dpdGNoICh2YWwpIHtcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2ggTG9zaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93IFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaGVzdCBDb21iaW5lZCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmUgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBQbGF5ZXIgU2NvcmVzIFN0YXRpc3RpY3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1RvdGFsIE9wcG9uZW50IFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNjpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBQbGF5ZXIgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNzpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1JhbmtpbmcgYnkgQXZlcmFnZSBPcHBvbmVudCBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA4OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0hpZ2hlc3QgU3ByZWFkIHBlciByb3VuZCAnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgU3ByZWFkcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTG93ZXN0IFNwcmVhZHMgcGVyIHJvdW5kJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0x1Y2t5IFN0aWZmcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnTHVja3kgU3RpZmZzIChmcmVxdWVudCBsb3cgbWFyZ2luL3NwcmVhZCB3aW5uZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDExOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdUdWZmIEx1Y2snO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ1R1ZmYgTHVjayAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgbG9zZXJzKSc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdTZWxlY3QgYSBUYWInO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICAvLyByZXR1cm4gdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvdW5kQ2hhbmdlOiBmdW5jdGlvbihwYWdlKSB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHBhZ2UpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRSb3VuZCk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZTtcclxuICAgIH0sXHJcbiAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFN0YXRzOiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgbGV0IGxhc3RSZERhdGEgPSB0aGlzLnJlc3VsdGRhdGFbdGhpcy50b3RhbF9yb3VuZHMgLSAxXTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxhc3RSZERhdGEsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIHR1ZmZsdWNreTogZnVuY3Rpb24ocmVzdWx0ID0gJ3dpbicpIHtcclxuICAgICAgLy8gbWV0aG9kIHJ1bnMgYm90aCBsdWNreXN0aWZmIGFuZCB0dWZmbHVjayB0YWJsZXNcclxuICAgICAgbGV0IGRhdGEgPSB0aGlzLnJlc3VsdGRhdGE7IC8vSlNPTi5wYXJzZSh0aGlzLmV2ZW50X2RhdGEucmVzdWx0cyk7XHJcbiAgICAgIGxldCBwbGF5ZXJzID0gXy5tYXAodGhpcy5wbGF5ZXJzLCAncG9zdF90aXRsZScpO1xyXG4gICAgICBsZXQgbHNkYXRhID0gW107XHJcbiAgICAgIGxldCBoaWdoc2l4ID0gXy5jaGFpbihwbGF5ZXJzKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgbGV0IHJlcyA9IF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihsaXN0KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIF8uY2hhaW4obGlzdClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gZFsncGxheWVyJ10gPT09IG4gJiYgZFsncmVzdWx0J10gPT09IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZsYXR0ZW5EZWVwKClcclxuICAgICAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QocmVzLCA2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBfLnRha2VSaWdodChyZXMsIDYpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICByZXR1cm4gbi5sZW5ndGggPiA1O1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICBfLm1hcChoaWdoc2l4LCBmdW5jdGlvbihoKSB7XHJcbiAgICAgICAgbGV0IGxhc3RkYXRhID0gXy50YWtlUmlnaHQoZGF0YSk7XHJcbiAgICAgICAgbGV0IGRpZmYgPSBfLmNoYWluKGgpXHJcbiAgICAgICAgICAubWFwKCdkaWZmJylcclxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMobik7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgbGV0IG5hbWUgPSBoWzBdWydwbGF5ZXInXTtcclxuICAgICAgICBsZXQgc3VtID0gXy5yZWR1Y2UoXHJcbiAgICAgICAgICBkaWZmLFxyXG4gICAgICAgICAgZnVuY3Rpb24obWVtbywgbnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgbnVtO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIDBcclxuICAgICAgICApO1xyXG4gICAgICAgIGxldCBwbGF5ZXJfZGF0YSA9IF8uZmluZChsYXN0ZGF0YSwge1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBtYXIgPSBwbGF5ZXJfZGF0YVsnbWFyZ2luJ107XHJcbiAgICAgICAgbGV0IHdvbiA9IHBsYXllcl9kYXRhWydwb2ludHMnXTtcclxuICAgICAgICBsZXQgbG9zcyA9IHBsYXllcl9kYXRhWydyb3VuZCddIC0gd29uO1xyXG4gICAgICAgIC8vIHB1c2ggdmFsdWVzIGludG8gbHNkYXRhIGFycmF5XHJcbiAgICAgICAgbHNkYXRhLnB1c2goe1xyXG4gICAgICAgICAgcGxheWVyOiBuYW1lLFxyXG4gICAgICAgICAgc3ByZWFkOiBkaWZmLFxyXG4gICAgICAgICAgc3VtX3NwcmVhZDogc3VtLFxyXG4gICAgICAgICAgY3VtbXVsYXRpdmVfc3ByZWFkOiBtYXIsXHJcbiAgICAgICAgICB3b25fbG9zczogYCR7d29ufSAtICR7bG9zc31gLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uc29ydEJ5KGxzZGF0YSwgJ3N1bV9zcHJlYWQnKTtcclxuICAgIH0sXHJcbiAgICB0b05leHRSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCB4ID0gdGhpcy50b3RhbF9yb3VuZHM7XHJcbiAgICAgIGxldCBuID0gdGhpcy5jdXJyZW50Um91bmQgKyAxO1xyXG4gICAgICBpZiAobiA8PSB4KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBuO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9QcmV2UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kIC0gMTtcclxuICAgICAgaWYgKG4gPj0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvRmlyc3RSZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRSb3VuZCAhPSAxKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSAxO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdG9MYXN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZygnIGdvaW5nIHRvIGxhc3Qgcm91bmQnKVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gdGhpcy50b3RhbF9yb3VuZHMpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgZXZlbnRfZGF0YTogJ0VWRU5UU1RBVFMnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIC8vIHRleHQ6IF8uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KSxcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFdlIGFyZSBjdXJyZW50bHkgZXhwZXJpZW5jaW5nIG5ldHdvcmsgaXNzdWVzIGZldGNoaW5nIHRoaXMgcGFnZSAke1xyXG4gICAgICAgIHRoaXMucGF0aFxyXG4gICAgICB9IGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4vLyBleHBvcnQgZGVmYXVsdCBDYXRlRGV0YWlsOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0ICBiYXNlVVJMICBmcm9tICcuLi9jb25maWcuanMnO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5sZXQgdERldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ3RkZXRhaWwnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbm8tZ3V0dGVyc1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJyZWFkY3J1bWIgOml0ZW1zPVwiYnJlYWRjcnVtYnNcIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgdGV4dC1jZW50ZXIgZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtbGctY2VudGVyIGp1c3RpZnktY29udGVudC1zdGFydFwiPlxyXG4gICAgICAgICAgICA8Yi1pbWcgc2xvdD1cImFzaWRlXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIiBjbGFzcz1cImFsaWduLXNlbGYtY2VudGVyIG1yLTMgcm91bmRlZCBpbWctZmx1aWRcIlxyXG4gICAgICAgICAgICAgIDpzcmM9XCJ0b3VybmV5LmV2ZW50X2xvZ29cIiB3aWR0aD1cIjE1MFwiIGhlaWdodD1cIjE1MFwiIDphbHQ9XCJ0b3VybmV5LmV2ZW50X2xvZ29fdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJteC0xIGRpc3BsYXktNFwiPlxyXG4gICAgICAgICAgICAgIHt7dG91cm5leS50aXRsZX19XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLTUgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyXCIgaWQ9XCJldmVudC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnN0YXJ0X2RhdGVcIj48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnN0YXJ0X2RhdGV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiIHYtaWY9XCJ0b3VybmV5LnZlbnVlXCI+PGkgY2xhc3M9XCJmYSBmYS1tYXAtbWFya2VyXCI+PC9pPiB7e3RvdXJuZXkudmVudWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaWY9XCJ0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3JcIj48aSBjbGFzcz1cImZhIGZhLWxlZ2FsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAge3t0b3VybmV5LnRvdXJuYW1lbnRfZGlyZWN0b3J9fTwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxoNT5cclxuICAgICAgICAgICAgICBDYXRlZ29yaWVzIDxpIGNsYXNzPVwiZmEgZmEtbGlzdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5cclxuICAgICAgICAgICAgPC9oNT5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgPGxpIHYtZm9yPVwiKGNhdCwgYykgaW4gdG91cm5leS50b3VfY2F0ZWdvcmllc1wiIDprZXk9XCJjXCIgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cImNhdC5ldmVudF9pZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnQ2F0ZURldGFpbCcsIHBhcmFtczogeyBzbHVnOiB0b3VybmV5LnNsdWcgLCBldmVudF9zbHVnOmNhdC5ldmVudF9zbHVnfX1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPnt7Y2F0LmNhdF9uYW1lfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gIDwvZGl2PlxyXG4gICAgICAgYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHBhZ2V1cmw6IGAke2Jhc2VVUkx9dG91cm5hbWVudGAgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLnRvdXJuZXkudGl0bGU7XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgaWYgKHRoaXMudG91cm5leS5zbHVnICE9IHRoaXMuc2x1Zykge1xyXG4gICAgICAgIC8vIHJlc2V0IHRpdGxlIGJlY2F1c2Ugb2YgYnJlYWRjcnVtYnNcclxuICAgICAgICB0aGlzLnRvdXJuZXkudGl0bGUgPSAnJztcclxuICAgICAgfVxyXG4gICAgICBsZXQgZSA9IHRoaXMudG91bGlzdC5maW5kKGV2ZW50ID0+IGV2ZW50LnNsdWcgPT09IHRoaXMuc2x1Zyk7XHJcbiAgICAgIGlmIChlKSB7XHJcbiAgICAgICAgbGV0IG5vdyA9IG1vbWVudCgpO1xyXG4gICAgICAgIGNvbnN0IGEgPSBtb21lbnQodGhpcy5sYXN0X2FjY2Vzc190aW1lKTtcclxuICAgICAgICBjb25zdCB0aW1lX2VsYXBzZWQgPSBub3cuZGlmZihhLCAnc2Vjb25kcycpO1xyXG4gICAgICAgIGlmICh0aW1lX2VsYXBzZWQgPCAzMDApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tTWF0Y2ggRm91bmQgaW4gVG91cm5leSBMaXN0LS0tLS0tLS0tLScpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyh0aW1lX2VsYXBzZWQpO1xyXG4gICAgICAgICAgdGhpcy50b3VybmV5ID0gZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREVUQUlMJywgdGhpcy5zbHVnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgLy8gdG91cm5leTogJ0RFVEFJTCcsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGxhc3RfYWNjZXNzX3RpbWU6ICdUT1VBQ0NFU1NUSU1FJyxcclxuICAgICAgdG91bGlzdDogJ1RPVUFQSSdcclxuICAgIH0pLFxyXG4gICAgdG91cm5leToge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4kc3RvcmUuZ2V0dGVycy5ERVRBSUw7XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmNvbW1pdCgnU0VUX0VWRU5UREVUQUlMJywgbmV3VmFsKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5LnRpdGxlLFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3Vlcy4gUGxlYXNlIHJlZnJlc2ggdG8gdHJ5IGFnYWluIGA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4gZXhwb3J0IGRlZmF1bHQgdERldGFpbDtcclxuIiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbi8vIGxldCBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQ7XHJcbmltcG9ydCB7TG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0fSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmxldCBzY3JMaXN0ID0gVnVlLmNvbXBvbmVudCgnc2NyTGlzdCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgdi1lbHNlIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgICAgIDwvZXJyb3I+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG4gICAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxoMiBjbGFzcz1cImJlYmFzIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cm9waHlcIj48L2k+IFRvdXJuYW1lbnRzXHJcbiAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCI+XHJcbiAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwiK1dQdG90YWxcIiBAY2hhbmdlPVwiZmV0Y2hMaXN0XCIgdi1tb2RlbD1cImN1cnJlbnRQYWdlXCIgOnBlci1wYWdlPVwiMTBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiAvPlxyXG4gICAgICAgICAgICAgIDxwIGNsYXNzPVwidGV4dC1tdXRlZFwiPiBZb3UgYXJlIG9uIHBhZ2Uge3tjdXJyZW50UGFnZX19IG9mIHt7V1BwYWdlc319IHBhZ2VzOyA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPiB0b3VybmFtZW50cyE8L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2ICBjbGFzcz1cImNvbC0xMiBjb2wtbGctMTAgb2Zmc2V0LWxnLTFcIiB2LWZvcj1cIml0ZW0gaW4gdG91cm5leXNcIiA6a2V5PVwiaXRlbS5pZFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC1sZy1yb3cgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1sZy1jZW50ZXIganVzdGlmeS1jb250ZW50LXN0YXJ0IHRvdXJuZXktbGlzdCBhbmltYXRlZCBib3VuY2VJbkxlZnRcIiA+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibXItbGctNVwiPlxyXG4gICAgICAgICAgICA8cm91dGVyLWxpbmsgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZyBmbHVpZCBjbGFzcz1cInRodW1ibmFpbFwiXHJcbiAgICAgICAgICAgICAgICAgIDpzcmM9XCJpdGVtLmV2ZW50X2xvZ29cIiB3aWR0aD1cIjEwMFwiICBoZWlnaHQ9XCIxMDBcIiA6YWx0PVwiaXRlbS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLWF1dG9cIj5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwibWItMSBkaXNwbGF5LTVcIj5cclxuICAgICAgICAgICAgPHJvdXRlci1saW5rIHYtaWY9XCJpdGVtLnNsdWdcIiA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICB7e2l0ZW0udGl0bGV9fVxyXG4gICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgICAgPHNtYWxsPjxpIGNsYXNzPVwiZmEgZmEtY2FsZW5kYXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAge3tpdGVtLnN0YXJ0X2RhdGV9fVxyXG4gICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgPHNtYWxsPjxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAge3tpdGVtLnZlbnVlfX1cclxuICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1pbmxpbmUgcC0xXCI+XHJcbiAgICAgICAgICAgICAgPHJvdXRlci1saW5rIHYtaWY9XCJpdGVtLnNsdWdcIiA6dG89XCJ7IG5hbWU6ICdUb3VybmV5RGV0YWlsJywgcGFyYW1zOiB7IHNsdWc6IGl0ZW0uc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzbWFsbCB0aXRsZT1cIkJyb3dzZSB0b3VybmV5XCI+PGkgY2xhc3M9XCJmYSBmYS1saW5rXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3NtYWxsPlxyXG4gICAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtdW5zdHlsZWQgbGlzdC1pbmxpbmUgdGV4dC1jZW50ZXIgY2F0ZWdvcnktbGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW0gbXgtYXV0b1wiXHJcbiAgICAgICAgICAgICAgdi1mb3I9XCJjYXRlZ29yeSBpbiBpdGVtLnRvdV9jYXRlZ29yaWVzXCI+e3tjYXRlZ29yeS5jYXRfbmFtZX19PC9saT5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWxnLWVuZFwiPlxyXG4gICAgICAgICAgPHAgY2xhc3M9XCJteS0wIHB5LTBcIj48c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+WW91IGFyZSBvbiBwYWdlIHt7Y3VycmVudFBhZ2V9fSBvZiB7e1dQcGFnZXN9fSBwYWdlcyB3aXRoIDxzcGFuIGNsYXNzPVwiZW1waGFzaXplXCI+e3tXUHRvdGFsfX08L3NwYW4+XHJcbiAgICAgICAgICB0b3VybmFtZW50cyE8L3NtYWxsPjwvcD5cclxuICAgICAgICAgICAgICA8Yi1wYWdpbmF0aW9uIGFsaWduPVwiY2VudGVyXCIgOnRvdGFsLXJvd3M9XCIrV1B0b3RhbFwiIEBjaGFuZ2U9XCJmZXRjaExpc3RcIiB2LW1vZGVsPVwiY3VycmVudFBhZ2VcIiA6cGVyLXBhZ2U9XCIxMFwiXHJcbiAgICAgICAgICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwiZmFsc2VcIiBhcmlhLWxhYmVsPVwiTmF2aWdhdGlvblwiIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICB9O1xyXG4gICAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnTGlzdC5qcyBsb2FkZWQnKVxyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnU2NyYWJibGUgVG91cm5hbWVudHMgLSBOU0YnO1xyXG4gICAgdGhpcy5mZXRjaExpc3QodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBmZXRjaExpc3Q6IGZ1bmN0aW9uKHBhZ2VOdW0pIHtcclxuICAgICAgLy90aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFnZU51bSwge1xyXG4gICAgICAgIC8vIHRpbWVvdXQ6IDM2MDAwMDAgLy8xIGhvdXIgY2FjaGVcclxuICAgICAvLyB9KTtcclxuICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBwYWdlTnVtO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfQVBJJywgcGFnZU51bSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdkb25lIScpO1xyXG4gICAgfSxcclxuXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4ubWFwR2V0dGVycyh7XHJcbiAgICAgIHRvdXJuZXlzOiAnVE9VQVBJJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgV1B0b3RhbDogJ1dQVE9UQUwnLFxyXG4gICAgICBXUHBhZ2VzOiAnV1BQQUdFUycsXHJcbiAgICB9KSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgU29ycnkgd2UgYXJlIGN1cnJlbnRseSBoYXZpbmcgdHJvdWJsZSBmaW5kaW5nIHRoZSBsaXN0IG9mIHRvdXJuYW1lbnRzLmA7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4gZXhwb3J0IGRlZmF1bHQgc2NyTGlzdDsiLCJ2YXIgcGxheWVyX21peGVkX3NlcmllcyA9IFt7IG5hbWU6ICcnLCAgZGF0YTogW10gfV07XHJcbnZhciBwbGF5ZXJfcmFua19zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3JhZGlhbF9jaGFydF9zZXJpZXMgPSBbXSAgO1xyXG52YXIgcGxheWVyX3JhZGlhbF9jaGFydF9jb25maWcgPSB7XHJcbiAgcGxvdE9wdGlvbnM6IHtcclxuICAgIHJhZGlhbEJhcjoge1xyXG4gICAgICBob2xsb3c6IHsgc2l6ZTogJzUwJScsIH1cclxuICAgIH0sXHJcbiAgfSxcclxuICBjb2xvcnM6IFtdLFxyXG4gIGxhYmVsczogW10sXHJcbn07XHJcblxyXG52YXIgcGxheWVyX3JhbmtfY2hhcnRfY29uZmlnID0ge1xyXG4gIGNoYXJ0OiB7XHJcbiAgICBoZWlnaHQ6IDQwMCxcclxuICAgIHpvb206IHtcclxuICAgICAgZW5hYmxlZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBzaGFkb3c6IHtcclxuICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgY29sb3I6ICcjMDAwJyxcclxuICAgICAgdG9wOiAxOCxcclxuICAgICAgbGVmdDogNyxcclxuICAgICAgYmx1cjogMTAsXHJcbiAgICAgIG9wYWNpdHk6IDFcclxuICAgIH0sXHJcbiAgfSxcclxuICBjb2xvcnM6IFsnIzc3QjZFQScsICcjNTQ1NDU0J10sXHJcbiAgZGF0YUxhYmVsczoge1xyXG4gICAgZW5hYmxlZDogdHJ1ZVxyXG4gIH0sXHJcbiAgc3Ryb2tlOiB7XHJcbiAgICBjdXJ2ZTogJ3Ntb290aCcgLy8gc3RyYWlnaHRcclxuICB9LFxyXG4gIHRpdGxlOiB7XHJcbiAgICB0ZXh0OiAnJyxcclxuICAgIGFsaWduOiAnbGVmdCdcclxuICB9LFxyXG4gIGdyaWQ6IHtcclxuICAgIGJvcmRlckNvbG9yOiAnI2U3ZTdlNycsXHJcbiAgICByb3c6IHtcclxuICAgICAgY29sb3JzOiBbJyNmM2YzZjMnLCAndHJhbnNwYXJlbnQnXSwgLy8gdGFrZXMgYW4gYXJyYXkgd2hpY2ggd2lsbCBiZSByZXBlYXRlZCBvbiBjb2x1bW5zXHJcbiAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgfSxcclxuICB9LFxyXG4gIHhheGlzOiB7XHJcbiAgICBjYXRlZ29yaWVzOiBbXSxcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICdSb3VuZHMnXHJcbiAgICB9XHJcbiAgfSxcclxuICB5YXhpczoge1xyXG4gICAgdGl0bGU6IHtcclxuICAgICAgdGV4dDogJydcclxuICAgIH0sXHJcbiAgICBtaW46IG51bGwsXHJcbiAgICBtYXg6IG51bGxcclxuICB9LFxyXG4gIGxlZ2VuZDoge1xyXG4gICAgcG9zaXRpb246ICd0b3AnLFxyXG4gICAgaG9yaXpvbnRhbEFsaWduOiAncmlnaHQnLFxyXG4gICAgZmxvYXRpbmc6IHRydWUsXHJcbiAgICBvZmZzZXRZOiAtMjUsXHJcbiAgICBvZmZzZXRYOiAtNVxyXG4gIH1cclxufTtcclxuXHJcbnZhciBQbGF5ZXJTdGF0cyA9IFZ1ZS5jb21wb25lbnQoJ3BsYXllcnN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctOCBvZmZzZXQtbGctMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5MZWZ0QmlnXCIgaWQ9XCJwaGVhZGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIG10LTVcIj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7cGxheWVyTmFtZX19XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbXgtYXV0b1wiIHN0eWxlPVwiZm9udC1zaXplOnNtYWxsXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMyBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIlxyXG4gICAgICAgICAgICAgICAgICAgIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMyBmYVwiIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ20nLFxyXG4gICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ2YnLCdmYS11c2Vycyc6IHBsYXllci5pc190ZWFtID09ICd5ZXMnIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgIDxpbWcgd2lkdGg9XCIxMDBweFwiIGhlaWdodD1cIjEwMHB4XCIgY2xhc3M9XCJpbWctdGh1bWJuYWlsIGltZy1mbHVpZCBteC0zIGQtYmxvY2sgc2hhZG93LXNtXCJcclxuICAgICAgICAgICAgICAgIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlciB5YW5vbmUgbXgtM1wiPnt7cHN0YXRzLnBQb3NpdGlvbn19IHBvc2l0aW9uPC9oND5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj4gPCEtLSAjcGhlYWRlci0tPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1idG4gdi1iLXRvZ2dsZS5jb2xsYXBzZTEgY2xhc3M9XCJtLTFcIj5RdWljayBTdGF0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idG4gdi1iLXRvZ2dsZS5jb2xsYXBzZTIgY2xhc3M9XCJtLTFcIj5Sb3VuZCBieSBSb3VuZCA8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UzIGNsYXNzPVwibS0xXCI+Q2hhcnRzPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ1dHRvbiB0aXRsZT1cIkNsb3NlXCIgc2l6ZT1cInNtXCIgQGNsaWNrPVwiY2xvc2VDYXJkKClcIiBjbGFzcz1cIm0tMVwiIHZhcmlhbnQ9XCJvdXRsaW5lLWRhbmdlclwiIDpkaXNhYmxlZD1cIiFzaG93XCJcclxuICAgICAgICAgICAgOnByZXNzZWQuc3luYz1cInNob3dcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L2ItYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMVwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZsaXBJblhcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+UXVpY2sgU3RhdHM8L2Rpdj5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1ncm91cCBsaXN0LWdyb3VwLWZsdXNoIHN0YXRzXCI+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+UG9pbnRzOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFBvaW50c319IC8ge3t0b3RhbF9yb3VuZHN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlJhbms6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wUmFua319IDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkhpZ2hlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wSGlTY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBIaVNjb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkxvd2VzdCBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBMb1Njb3JlfX08L3NwYW4+IChyZCA8ZW0+e3twc3RhdHMucExvU2NvcmVSb3VuZHN9fTwvZW0+KVxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+QXZlIFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEF2ZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtXCI+QXZlIE9wcCBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmVPcHB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9iLWNhcmQ+XHJcbiAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICAgIDwhLS0tLSBSb3VuZCBCeSBSb3VuZCBSZXN1bHRzIC0tPlxyXG4gICAgICAgIDxiLWNvbGxhcHNlIGlkPVwiY29sbGFwc2UyXCI+XHJcbiAgICAgICAgICA8Yi1jYXJkIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgICAgICAgICAgPGg0PlJvdW5kIEJ5IFJvdW5kIFN1bW1hcnkgPC9oND5cclxuICAgICAgICAgICAgPHVsIGNsYXNzPVwibGlzdC1ncm91cCBsaXN0LWdyb3VwLWZsdXNoXCIgdi1mb3I9XCIocmVwb3J0LCBpKSBpbiBwc3RhdHMucFJieVJcIiA6a2V5PVwiaVwiPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1pZj1cInJlcG9ydC5yZXN1bHQ9PSd3aW4nXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLXN1Y2Nlc3NcIj5cclxuICAgICAgICAgICAgICAgIHt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtZWxzZS1pZj1cInJlcG9ydC5yZXN1bHQgPT0nZHJhdydcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLXdhcm5pbmdcIj57e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2xvc3MnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1kYW5nZXJcIj57e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2F3YWl0aW5nJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1pbmZvXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gbGlzdC1ncm91cC1pdGVtLWxpZ2h0XCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9iLWNhcmQ+XHJcbiAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICAgIDwhLS0gQ2hhcnRzIC0tPlxyXG4gICAgICAgIDxiLWNvbGxhcHNlIGlkPVwiY29sbGFwc2UzXCI+XHJcbiAgICAgICAgICA8Yi1jYXJkIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluRG93blwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgdGV4dC1jZW50ZXJcIj5TdGF0cyBDaGFydHM8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ21peGVkJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIj48aSBjbGFzcz1cImZhcyBmYS1maWxlLWNzdlwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBNaXhlZCBTY29yZXM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdyYW5rJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3JhbmsnXCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtbGluZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBSYW5rIHBlciBSZDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidXBkYXRlQ2hhcnQoJ3dpbnMnKVwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZSBtbC0xXCJcclxuICAgICAgICAgICAgICAgICAgOmRpc2FibGVkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nd2lucydcIj48aSBjbGFzcz1cImZhcyBmYS1iYWxhbmNlLXNjYWxlIGZhLXN0YWNrXCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFN0YXJ0cy9SZXBsaWVzIFdpbnMoJSk8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImNoYXJ0XCI+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J21peGVkJ1wiIHR5cGU9bGluZSBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRpb25zXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNNaXhlZFwiIC8+XHJcbiAgICAgICAgICAgICAgPGFwZXhjaGFydCB2LWlmPVwiY2hhcnRNb2RlbD09J3JhbmsnXCIgdHlwZT0nbGluZScgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0aW9uc1JhbmtcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc1JhbmtcIiAvPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiIHR5cGU9cmFkaWFsQmFyIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdFJhZGlhbFwiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzUmFkaWFsXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2ItY2FyZD5cclxuICAgICAgICA8L2ItY29sbGFwc2U+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBwcm9wczogWydwc3RhdHMnXSxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBhcGV4Y2hhcnQ6IFZ1ZUFwZXhDaGFydHMsXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwbGF5ZXI6ICcnLFxyXG4gICAgICBzaG93OiB0cnVlLFxyXG4gICAgICBwbGF5ZXJOYW1lOiAnJyxcclxuICAgICAgYWxsU2NvcmVzOiBbXSxcclxuICAgICAgYWxsT3BwU2NvcmVzOiBbXSxcclxuICAgICAgYWxsUmFua3M6IFtdLFxyXG4gICAgICB0b3RhbF9wbGF5ZXJzOiBudWxsLFxyXG4gICAgICBjaGFydE1vZGVsOiAncmFuaycsXHJcbiAgICAgIHNlcmllc01peGVkOiBwbGF5ZXJfbWl4ZWRfc2VyaWVzLFxyXG4gICAgICBzZXJpZXNSYW5rOiBwbGF5ZXJfcmFua19zZXJpZXMsXHJcbiAgICAgIHNlcmllc1JhZGlhbDogcGxheWVyX3JhZGlhbF9jaGFydF9zZXJpZXMsXHJcbiAgICAgIGNoYXJ0T3B0UmFkaWFsOiBwbGF5ZXJfcmFkaWFsX2NoYXJ0X2NvbmZpZyxcclxuICAgICAgY2hhcnRPcHRpb25zUmFuazogcGxheWVyX3JhbmtfY2hhcnRfY29uZmlnLFxyXG4gICAgICBjaGFydE9wdGlvbnM6IHtcclxuICAgICAgICBjaGFydDoge1xyXG4gICAgICAgICAgaGVpZ2h0OiA0MDAsXHJcbiAgICAgICAgICB6b29tOiB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2hhZG93OiB7XHJcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgICAgICAgIHRvcDogMTgsXHJcbiAgICAgICAgICAgIGxlZnQ6IDcsXHJcbiAgICAgICAgICAgIGJsdXI6IDEwLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2xvcnM6IFsnIzhGQkM4RicsICcjNTQ1NDU0J10sXHJcbiAgICAgICAgZGF0YUxhYmVsczoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3Ryb2tlOiB7XHJcbiAgICAgICAgICBjdXJ2ZTogJ3N0cmFpZ2h0JyAvLyBzbW9vdGhcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICB0ZXh0OiAnJyxcclxuICAgICAgICAgIGFsaWduOiAnbGVmdCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyaWQ6IHtcclxuICAgICAgICAgIGJvcmRlckNvbG9yOiAnI2U3ZTdlNycsXHJcbiAgICAgICAgICByb3c6IHtcclxuICAgICAgICAgICAgY29sb3JzOiBbJyNmM2YzZjMnLCAndHJhbnNwYXJlbnQnXSwgLy8gdGFrZXMgYW4gYXJyYXkgd2hpY2ggd2lsbCBiZSByZXBlYXRlZCBvbiBjb2x1bW5zXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHhheGlzOiB7XHJcbiAgICAgICAgICBjYXRlZ29yaWVzOiBbXSxcclxuICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHRleHQ6ICdSb3VuZHMnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB5YXhpczoge1xyXG4gICAgICAgICAgdGl0bGU6IHtcclxuICAgICAgICAgICAgdGV4dDogJydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtaW46IG51bGwsXHJcbiAgICAgICAgICBtYXg6IG51bGxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgcG9zaXRpb246ICd0b3AnLFxyXG4gICAgICAgICAgaG9yaXpvbnRhbEFsaWduOiAncmlnaHQnLFxyXG4gICAgICAgICAgZmxvYXRpbmc6IHRydWUsXHJcbiAgICAgICAgICBvZmZzZXRZOiAtMjUsXHJcbiAgICAgICAgICBvZmZzZXRYOiAtNVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5kb1Njcm9sbCgpO1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zZXJpZXNSYWRpYWwpXHJcbiAgICB0aGlzLnNob3cgPSB0aGlzLnNob3dTdGF0cztcclxuICAgIHRoaXMuYWxsU2NvcmVzID0gXy5mbGF0dGVuKHRoaXMucHN0YXRzLmFsbFNjb3Jlcyk7XHJcbiAgICB0aGlzLmFsbE9wcFNjb3JlcyA9IF8uZmxhdHRlbih0aGlzLnBzdGF0cy5hbGxPcHBTY29yZXMpO1xyXG4gICAgdGhpcy5hbGxSYW5rcyA9IF8uZmxhdHRlbih0aGlzLnBzdGF0cy5hbGxSYW5rcyk7XHJcbiAgICB0aGlzLnVwZGF0ZUNoYXJ0KHRoaXMuY2hhcnRNb2RlbCk7XHJcbiAgICB0aGlzLnRvdGFsX3BsYXllcnMgPSB0aGlzLnBsYXllcnMubGVuZ3RoO1xyXG4gICAgdGhpcy5wbGF5ZXIgPSB0aGlzLnBzdGF0cy5wbGF5ZXJbMF07XHJcbiAgICB0aGlzLnBsYXllck5hbWUgPSB0aGlzLnBsYXllci5wb3N0X3RpdGxlO1xyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveSgpIHtcclxuICAgIHRoaXMuY2xvc2VDYXJkKCk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcblxyXG4gICAgZG9TY3JvbGw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgdXNlciBzY3JvbGxzIHRoZSBwYWdlLCBleGVjdXRlIG15RnVuY3Rpb25cclxuICAgICAgd2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24oKSB7bXlGdW5jdGlvbigpfTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgaGVhZGVyXHJcbiAgICAgIHZhciBoZWFkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBoZWFkZXJcIik7XHJcblxyXG4gICAgICAvLyBHZXQgdGhlIG9mZnNldCBwb3NpdGlvbiBvZiB0aGUgbmF2YmFyXHJcbiAgICAgIHZhciBzdGlja3kgPSBoZWFkZXIub2Zmc2V0VG9wO1xyXG4gICAgICB2YXIgaCA9IGhlYWRlci5vZmZzZXRIZWlnaHQgKyA1MDtcclxuXHJcbiAgICAgIC8vIEFkZCB0aGUgc3RpY2t5IGNsYXNzIHRvIHRoZSBoZWFkZXIgd2hlbiB5b3UgcmVhY2ggaXRzIHNjcm9sbCBwb3NpdGlvbi4gUmVtb3ZlIFwic3RpY2t5XCIgd2hlbiB5b3UgbGVhdmUgdGhlIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICBmdW5jdGlvbiBteUZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPiAoc3RpY2t5ICsgaCkpIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZShcInN0aWNreVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgc2V0Q2hhcnRDYXRlZ29yaWVzOiBmdW5jdGlvbigpe1xyXG4gICAgICBsZXQgcm91bmRzID0gXy5yYW5nZSgxLCB0aGlzLnRvdGFsX3JvdW5kcyArIDEpO1xyXG4gICAgICBsZXQgcmRzID0gXy5tYXAocm91bmRzLCBmdW5jdGlvbihudW0peyByZXR1cm4gJ1JkICcrIG51bTsgfSk7XHJcbiAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnhheGlzLmNhdGVnb3JpZXMgPSByZHM7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlQ2hhcnQ6IGZ1bmN0aW9uICh0eXBlKSB7XHJcbiAgICAgIC8vY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS1VcGRhdGluZy4uLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgdGhpcy5jaGFydE1vZGVsID0gdHlwZTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMudGl0bGUuYWxpZ24gPSAnbGVmdCc7XHJcbiAgICAgIHZhciBmaXJzdE5hbWUgPSBfLnRyaW0oXy5zcGxpdCh0aGlzLnBsYXllck5hbWUsICcgJywgMilbMF0pO1xyXG4gICAgICBpZiAoJ3JhbmsnID09IHR5cGUpIHtcclxuICAgICAgICAvLyB0aGlzLiA9ICdiYXInO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay50aXRsZS50ZXh0ID1gUmFua2luZzogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsueWF4aXMubWluID0gMDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9uc1JhbmsueWF4aXMubWF4ID10aGlzLnRvdGFsX3BsYXllcnM7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYW5rID0gW3tcclxuICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX0gcmFuayB0aGlzIHJkYCxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuYWxsUmFua3NcclxuICAgICAgICB9XVxyXG4gICAgICB9XHJcbiAgICAgIGlmICgnbWl4ZWQnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLnNldENoYXJ0Q2F0ZWdvcmllcygpXHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMudGl0bGUudGV4dCA9IGBTY29yZXM6ICR7dGhpcy5wbGF5ZXJOYW1lfWA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWluID0gMTAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zLnlheGlzLm1heCA9IDkwMDtcclxuICAgICAgICB0aGlzLnNlcmllc01peGVkID0gW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiBgJHtmaXJzdE5hbWV9YCxcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5hbGxTY29yZXNcclxuICAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogJ09wcG9uZW50JyxcclxuICAgICAgICAgIGRhdGE6IHRoaXMuYWxsT3BwU2NvcmVzXHJcbiAgICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCd3aW5zJyA9PSB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5sYWJlbHM9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwuY29sb3JzID1bXTtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscy51bnNoaWZ0KCdTdGFydHM6ICUgV2lucycsJ1JlcGxpZXM6ICUgV2lucycpO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwuY29sb3JzLnVuc2hpZnQoJyM3Q0ZDMDAnLCAnI0JEQjc2QicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhcnRPcHRSYWRpYWwpO1xyXG4gICAgICAgIHZhciBzID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMuc3RhcnRXaW5zIC8gdGhpcy5wc3RhdHMuc3RhcnRzKSwxKTtcclxuICAgICAgICB2YXIgciA9IF8ucm91bmQoMTAwICogKHRoaXMucHN0YXRzLnJlcGx5V2lucyAvIHRoaXMucHN0YXRzLnJlcGxpZXMpLDEpO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzUmFkaWFsID0gW107XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwudW5zaGlmdChzLHIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2VyaWVzUmFkaWFsKVxyXG4gICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGNsb3NlQ2FyZDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLS1DbG9zaW5nIENhcmQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRE9fU1RBVFMnLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4uVnVleC5tYXBHZXR0ZXJzKHtcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGxheWVyczogJ1BMQVlFUlMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgfSksXHJcbiAgfSxcclxuXHJcbn0pO1xyXG5cclxudmFyIFBsYXllckxpc3QgPSBWdWUuY29tcG9uZW50KCdhbGxwbGF5ZXJzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiIGlkPVwicGxheWVycy1saXN0XCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dTdGF0c1wiPlxyXG4gICAgICAgIDxwbGF5ZXJzdGF0cyA6cHN0YXRzPVwicFN0YXRzXCI+PC9wbGF5ZXJzdGF0cz5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgPHRyYW5zaXRpb24tZ3JvdXAgdGFnPVwiZGl2XCIgbmFtZT1cInBsYXllcnMtbGlzdFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInBsYXllckNvbHMgY29sLWxnLTIgY29sLXNtLTYgY29sLTEyIHAtNCBcIiB2LWZvcj1cInBsYXllciBpbiBkYXRhXCIgOmtleT1cInBsYXllci5pZFwiID5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwibXgtYXV0byBiZWJhc1wiPjxzbWFsbD4je3twbGF5ZXIucG5vfX08L3NtYWxsPlxyXG4gICAgICAgICAgICB7e3BsYXllci5wbGF5ZXJ9fTxzcGFuIGNsYXNzPVwibWwtMlwiIEBjbGljaz1cInNvcnRQb3MoKVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXNpemU6MC44ZW1cIj48aSB2LWlmPVwiYXNjXCIgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHRpdGxlPVwiQ2xpY2sgdG8gc29ydCBERVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48aSB2LWVsc2UgY2xhc3M9XCJmYSBmYS1zb3J0LW51bWVyaWMtdXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIiB0aXRsZT1cIkNsaWNrIHRvIHNvcnQgQVNDIGJ5IGN1cnJlbnQgcmFua1wiPjwvaT48L3NwYW4+PHNwYW4gdi1pZj1cInNvcnRlZFwiIGNsYXNzPVwibWwtM1wiIEBjbGljaz1cInJlc3RvcmVTb3J0KClcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC1zaXplOjAuOGVtXCI+PGkgY2xhc3M9XCJmYSBmYS11bmRvXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgdGl0bGU9XCJDbGljayB0byByZXNldCBsaXN0XCI+PC9pPjwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiAgc3R5bGU9XCJmb250LXNpemU6c21hbGxcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJteC1hdXRvIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXIuY291bnRyeSB8IGxvd2VyY2FzZVwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwibWwtMiBmYVwiIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ20nLFxyXG4gICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJyxcclxuICAgICAgICAnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjb2xvcjp0b21hdG87IGZvbnQtc2l6ZToxLjRlbVwiIGNsYXNzPVwibWwtNVwiIHYtaWY9XCJzb3J0ZWRcIj57e3BsYXllci5wb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibXgtYXV0byB0ZXh0LWNlbnRlciBhbmltYXRlZCBmYWRlSW5cIj5cclxuICAgICAgICAgICAgICA8Yi1pbWctbGF6eSB2LWJpbmQ9XCJpbWdQcm9wc1wiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiIDppZD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayBtdC0yIG14LWF1dG9cIj5cclxuICAgICAgICAgICAgICA8c3BhbiBAY2xpY2s9XCJzaG93UGxheWVyU3RhdHMocGxheWVyLmlkKVwiIHRpdGxlPVwiU2hvdyAgc3RhdHNcIj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWwtNFwiIHRpdGxlPVwiU2hvdyBTY29yZXNoZWV0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxyb3V0ZXItbGluayBleGFjdCA6dG89XCJ7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7ICBldmVudF9zbHVnOnNsdWcsIHBubzpwbGF5ZXIucG5vfX1cIj5cclxuICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY2xpcGJvYXJkXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPCEtLS1wb3BvdmVyIC0tPlxyXG4gICAgICAgICAgICAgIDxiLXBvcG92ZXIgQHNob3c9XCJnZXRMYXN0R2FtZXMocGxheWVyLnBubylcIiBwbGFjZW1lbnQ9XCJib3R0b21cIiAgOnRhcmdldD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCIgdHJpZ2dlcnM9XCJob3ZlclwiIGJvdW5kYXJ5LXBhZGRpbmc9XCI1XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtd3JhcCBhbGlnbi1jb250ZW50LWJldHdlZW4gYWxpZ24taXRlbXMtc3RhcnQgbXItMiBqdXN0aWZ5LWNvbnRlbnQtYXJvdW5kXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmxleC1ncm93LTEgYWxpZ24tc2VsZi1jZW50ZXJcIiBzdHlsZT1cImZvbnQtc2l6ZToxLjVlbTtcIj57e21zdGF0LnBvc2l0aW9ufX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmxleC1zaHJpbmstMSBkLWlubGluZS1ibG9jayB0ZXh0LW11dGVkXCI+PHNtYWxsPnt7bXN0YXQud2luc319LXt7bXN0YXQuZHJhd3N9fS17e21zdGF0Lmxvc3Nlc319PC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gZmxleC13cmFwIGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRleHQtcHJpbWFyeSBkLWlubGluZS1ibG9ja1wiIHN0eWxlPVwiZm9udC1zaXplOjAuOGVtOyB0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lXCI+TGFzdCBHYW1lOiBSb3VuZCB7e21zdGF0LnJvdW5kfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgdi1iaW5kOmNsYXNzPVwieydiZy13YXJuaW5nJzogbXN0YXQucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBtc3RhdC5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWRhbmdlcic6IG1zdGF0LnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1zdWNjZXNzJzogbXN0YXQucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAge3ttc3RhdC5zY29yZX19LXt7bXN0YXQub3Bwb19zY29yZX19ICh7e21zdGF0LnJlc3VsdHxmaXJzdGNoYXJ9fSlcclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aW1nIDpzcmM9XCJtc3RhdC5vcHBfcGhvdG9cIiA6YWx0PVwibXN0YXQub3Bwb1wiIGNsYXNzPVwicm91bmRlZC1jaXJjbGUgbS1hdXRvIGQtaW5saW5lLWJsb2NrXCIgd2lkdGg9XCIyNVwiIGhlaWdodD1cIjI1XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUtYmxvY2tcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjllbVwiPjxzbWFsbD4je3ttc3RhdC5vcHBvX25vfX0ge3ttc3RhdC5vcHBvfGFiYnJ2fX08L3NtYWxsPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvYi1wb3BvdmVyPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICA8L3RyYW5zaXRpb24tZ3JvdXA+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgcGxheWVyc3RhdHM6IFBsYXllclN0YXRzLFxyXG4gIH0sXHJcbiAgcHJvcHM6IFsnc2x1ZyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBTdGF0czoge30sXHJcbiAgICAgIGltZ1Byb3BzOiB7XHJcbiAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgIGJsb2NrOiB0cnVlLFxyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICB3aWR0aDogJzgwcHgnLFxyXG4gICAgICAgIGhlaWdodDogJzgwcHgnLFxyXG4gICAgICAgIHN0eWxlOiAnY3Vyc29yOiBwb2ludGVyJyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGFGbGF0OiB7fSxcclxuICAgICAgbXN0YXQ6IHt9LFxyXG4gICAgICBkYXRhOiB7fSxcclxuICAgICAgc29ydGVkOiBmYWxzZSxcclxuICAgICAgYXNjOiB0cnVlXHJcbiAgICB9XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICB0aGlzLmRhdGFGbGF0ID0gXy5mbGF0dGVuRGVlcChfLmNsb25lKHJlc3VsdGRhdGEpKTtcclxuICAgIHRoaXMuZGF0YSA9IF8uY2hhaW4ocmVzdWx0ZGF0YSkubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLURBVEEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLmRhdGEpO1xyXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TGFzdEdhbWVzOiBmdW5jdGlvbiAodG91X25vKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRvdV9ubylcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMuZGF0YUZsYXQpO1xyXG4gICAgICBsZXQgcmVzID0gXy5jaGFpbihjKVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgIHJldHVybiB2LnBubyA9PT0gdG91X25vO1xyXG4gICAgICAgIH0pLnRha2VSaWdodCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubXN0YXQgPSBfLmZpcnN0KHJlcyk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubXN0YXQpXHJcbiAgICB9LFxyXG4gICAgc29ydFBvczogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IHRydWU7XHJcbiAgICAgIHRoaXMuYXNjID0gIXRoaXMuYXNjO1xyXG4gICAgICBjb25zb2xlLmxvZygnU29ydGluZy4uJyk7XHJcbiAgICAgIGxldCBzb3J0RGlyID0gJ2FzYyc7XHJcbiAgICAgIGlmIChmYWxzZSA9PSB0aGlzLmFzYykge1xyXG4gICAgICAgIHNvcnREaXIgPSAnZGVzYyc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRlZCA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdyYW5rJywgc29ydERpcik7XHJcbiAgICAgIGNvbnNvbGUubG9nKHNvcnRlZCk7XHJcbiAgICAgIHRoaXMuZGF0YSA9IHNvcnRlZDtcclxuICAgIH0sXHJcbiAgICByZXN0b3JlU29ydDogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnNvcnRlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmFzYyA9IHRydWU7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF8ub3JkZXJCeSh0aGlzLmRhdGEsICdwbm8nLCAnYXNjJyk7XHJcbiAgICB9LFxyXG4gICAgc2hvd1BsYXllclN0YXRzOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdDT01QVVRFX1BMQVlFUl9TVEFUUycsIGlkKTtcclxuICAgICAgdGhpcy5wU3RhdHMucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmVPcHAgPSB0aGlzLmxhc3RkYXRhLmF2ZV9vcHBfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmUgPSB0aGlzLmxhc3RkYXRhLmF2ZV9zY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucFJhbmsgPSB0aGlzLmxhc3RkYXRhLnJhbms7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb3NpdGlvbiA9IHRoaXMubGFzdGRhdGEucG9zaXRpb247XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb2ludHMgPSB0aGlzLmxhc3RkYXRhLnBvaW50cztcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9PcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsUmFua3MgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxSYW5rcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5hbGxPcHBTY29yZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYnlSID0gdGhpcy5wbGF5ZXJfc3RhdHMucFJieVI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0V2lucyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0V2lucztcclxuICAgICAgdGhpcy5wU3RhdHMuc3RhcnRzID0gdGhpcy5wbGF5ZXJfc3RhdHMuc3RhcnRzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBseVdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBseVdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnJlcGxpZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBsaWVzO1xyXG5cclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJyx0cnVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgICBsYXN0ZGF0YTogJ0xBU1RSRERBVEEnLFxyXG4gICAgICBwbGF5ZXJkYXRhOiAnUExBWUVSREFUQScsXHJcbiAgICAgIHBsYXllcjogJ1BMQVlFUicsXHJcbiAgICAgIHBsYXllcl9zdGF0czogJ1BMQVlFUl9TVEFUUydcclxuICAgIH0pLFxyXG5cclxuICB9XHJcbn0pO1xyXG5cclxuIHZhciBSZXN1bHRzID0gVnVlLmNvbXBvbmVudCgncmVzdWx0cycsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIGhvdmVyIHN0YWNrZWQ9XCJzbVwiIHN0cmlwZWQgZm9vdC1jbG9uZSA6ZmllbGRzPVwicmVzdWx0c19maWVsZHNcIiA6aXRlbXM9XCJyZXN1bHQoY3VycmVudFJvdW5kKVwiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVzdWx0c19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5yZXN1bHRzX2ZpZWxkcyA9IFtcclxuICAgICAgeyBrZXk6ICdyYW5rJywgbGFiZWw6ICcjJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICAvLyB7IGtleTogJ3Bvc2l0aW9uJyxsYWJlbDogJ1Bvc2l0aW9uJywnY2xhc3MnOid0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5zY29yZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ09wcG9uZW50JyB9LFxyXG4gICAgICAvLyB7IGtleTogJ29wcF9wb3NpdGlvbicsIGxhYmVsOiAnUG9zaXRpb24nLCdjbGFzcyc6ICd0ZXh0LWNlbnRlcid9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnb3Bwb19zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLm9wcG9fc2NvcmU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2RpZmYnLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnLSc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgcmVzdWx0OiBmdW5jdGlvbihyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcblxyXG4gICAgICBfLmZvckVhY2goZGF0YSwgZnVuY3Rpb24ocikge1xyXG4gICAgICAgIGxldCBvcHBfbm8gPSByWydvcHBvX25vJ107XHJcbiAgICAgICAgLy8gRmluZCB3aGVyZSB0aGUgb3Bwb25lbnQncyBjdXJyZW50IHBvc2l0aW9uIGFuZCBhZGQgdG8gY29sbGVjdGlvblxyXG4gICAgICAgIGxldCByb3cgPSBfLmZpbmQoZGF0YSwgeyBwbm86IG9wcF9ubyB9KTtcclxuICAgICAgICByWydvcHBfcG9zaXRpb24nXSA9IHJvdy5wb3NpdGlvbjtcclxuICAgICAgICAvLyBjaGVjayByZXN1bHQgKHdpbiwgbG9zcywgZHJhdylcclxuICAgICAgICBsZXQgcmVzdWx0ID0gci5yZXN1bHQ7XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLnNvcnRCeSgnbWFyZ2luJylcclxuICAgICAgICAuc29ydEJ5KCdwb2ludHMnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG52YXIgU3RhbmRpbmdzID0gVnVlLmNvbXBvbmVudCgnc3RhbmRpbmdzJyx7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIHJlc3BvbnNpdmUgc3RhY2tlZD1cInNtXCIgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInJlc3VsdChjdXJyZW50Um91bmQpXCIgOmZpZWxkcz1cInN0YW5kaW5nc19maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCIgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInJhbmtcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucmFua319XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicGxheWVyXCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLnZhbHVlLnBsYXllcn19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwid29uTG9zdFwiPjwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwibWFyZ2luXCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLnZhbHVlLm1hcmdpbn19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwibGFzdEdhbWVcIj5cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICBgLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YW5kaW5nc19maWVsZHM6IFtdLFxyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGNlbnRlcjogdHJ1ZSxcclxuICAgICAgICBibG9jazogdHJ1ZSxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICcyNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcyNXB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbScsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbW91bnRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnN0YW5kaW5nc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dpbi1EcmF3LUxvc3MnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLndpbnN9IC0gJHtpdGVtLmRyYXdzfSAtICR7aXRlbS5sb3NzZXN9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAncG9pbnRzJyxcclxuICAgICAgICBsYWJlbDogJ1BvaW50cycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uYXIgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30qYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2xhc3RHYW1lJyxcclxuICAgICAgICBsYWJlbDogJ0xhc3QgR2FtZScsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgaXRlbS5zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ucmVzdWx0ID09ICdhd2FpdGluZydcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYEF3YWl0aW5nIHJlc3VsdCBvZiBnYW1lICR7aXRlbS5yb3VuZH0gdnMgJHtpdGVtLm9wcG99YDtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gYGEgJHtpdGVtLnNjb3JlfS0ke2l0ZW0ub3Bwb19zY29yZX1cclxuICAgICAgICAgICAgJHtpdGVtLnJlc3VsdC50b1VwcGVyQ2FzZSgpfSB2cyAke2l0ZW0ub3Bwb30gYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdChyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcbiAgICAgIF8uZm9yRWFjaChkYXRhLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IG9wcF9ubyA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICAvLyBGaW5kIHdoZXJlIHRoZSBvcHBvbmVudCdzIGN1cnJlbnQgcG9zaXRpb24gYW5kIGFkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgbGV0IHJvdyA9IF8uZmluZChkYXRhLCB7IHBubzogb3BwX25vIH0pO1xyXG4gICAgICAgIHJbJ29wcF9wb3NpdGlvbiddID0gcm93Wydwb3NpdGlvbiddO1xyXG4gICAgICAgIC8vIGNoZWNrIHJlc3VsdCAod2luLCBsb3NzLCBkcmF3KVxyXG4gICAgICAgIGxldCByZXN1bHQgPSByWydyZXN1bHQnXTtcclxuXHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdhd2FpdGluZycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IFBhaXJpbmdzID1WdWUuY29tcG9uZW50KCdwYWlyaW5ncycsICB7XHJcbiAgdGVtcGxhdGU6IGBcclxuPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1zdHJpcGVkICBhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgPGNhcHRpb24+e3tjYXB0aW9ufX08L2NhcHRpb24+XHJcbiAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1kYXJrXCI+XHJcbiAgICAgICAgPHRyPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPiM8L3RoPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlBsYXllcjwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+T3Bwb25lbnQ8L3RoPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICA8L3RoZWFkPlxyXG4gICAgPHRib2R5PlxyXG4gICAgICAgIDx0ciB2LWZvcj1cIihwbGF5ZXIsaSkgaW4gcGFpcmluZyhjdXJyZW50Um91bmQpXCIgOmtleT1cImlcIj5cclxuICAgICAgICA8dGggc2NvcGU9XCJyb3dcIj57e2kgKyAxfX08L3RoPlxyXG4gICAgICAgIDx0ZCA6aWQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiPjxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wbGF5ZXJcIiA6c3JjPVwicGxheWVyLnBob3RvXCI+PC9iLWltZy1sYXp5PjxzdXAgdi1pZj1cInBsYXllci5zdGFydCA9PSd5J1wiPio8L3N1cD57e3BsYXllci5wbGF5ZXJ9fTwvdGQ+XHJcbiAgICAgICAgPHRkIDppZD1cIidwb3BvdmVyLScrcGxheWVyLm9wcF9pZFwiPjxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5vcHBvXCIgOnNyYz1cInBsYXllci5vcHBfcGhvdG9cIj48L2ItaW1nLWxhenk+PHN1cCAgdi1pZj1cInBsYXllci5zdGFydCA9PSduJ1wiPio8L3N1cD57e3BsYXllci5vcHBvfX08L3RkPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICA8L3Rib2R5PlxyXG4gIDwvdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpbWdQcm9wczoge1xyXG4gICAgICAgIHJvdW5kZWQ6ICdjaXJjbGUnLFxyXG4gICAgICAgIGZsdWlkOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rOiB0cnVlLFxyXG4gICAgICAgIGJsYW5rQ29sb3I6ICcjYmJiJyxcclxuICAgICAgICBzdHlsZTonbWFyZ2luLXJpZ2h0Oi41ZW0nLFxyXG4gICAgICAgIHdpZHRoOiAnMjVweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnMjVweCcsXHJcbiAgICAgICAgY2xhc3M6ICdzaGFkb3ctc20nLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLy8gZ2V0IHBhaXJpbmdcclxuICAgIHBhaXJpbmcocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IHJvdW5kX3JlcyA9IHRoaXMucmVzdWx0ZGF0YVtyb3VuZF07XHJcbiAgICAgIC8vIFNvcnQgYnkgcGxheWVyIG51bWJlcmluZyBpZiByb3VuZCAxIHRvIG9idGFpbiByb3VuZCAxIHBhaXJpbmdcclxuICAgICAgaWYgKHIgPT09IDEpIHtcclxuICAgICAgICByb3VuZF9yZXMgPSBfLnNvcnRCeShyb3VuZF9yZXMsICdwbm8nKTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgcGFpcmVkX3BsYXllcnMgPSBbXTtcclxuICAgICAgbGV0IHJwID0gXy5tYXAocm91bmRfcmVzLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IHJbJ3BubyddO1xyXG4gICAgICAgIGxldCBvcHBvbmVudCA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICBpZiAoXy5pbmNsdWRlcyhwYWlyZWRfcGxheWVycywgcGxheWVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgcGFpcmVkX3BsYXllcnMucHVzaChvcHBvbmVudCk7XHJcbiAgICAgICAgcmV0dXJuIHI7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gXy5jb21wYWN0KHJwKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQge1BhaXJpbmdzLCBTdGFuZGluZ3MsIFBsYXllckxpc3QsIFJlc3VsdHN9XHJcblxyXG4iLCJcclxuaW1wb3J0IGJhc2VVUkwgZnJvbSAnLi4vY29uZmlnLmpzJztcclxubGV0IFNjb3JlYm9hcmQgPSBWdWUuY29tcG9uZW50KCdzY29yZWJvYXJkJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cInJvdyBkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJlcnJvclwiIGNsYXNzPVwiY29sIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yXCI+e3tlcnJvcn19PC9wPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG4gIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgPGRpdiBjbGFzcz1cImNvbFwiIGlkPVwic2NvcmVib2FyZFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiIHYtZm9yPVwiaSBpbiByb3dDb3VudFwiIDprZXk9XCJpXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMyBjb2wtc20tNiBjb2wtMTIgXCIgdi1mb3I9XCJwbGF5ZXIgaW4gaXRlbUNvdW50SW5Sb3coaSlcIiA6a2V5PVwicGxheWVyLnJhbmtcIj5cclxuICAgICAgICA8Yi1tZWRpYSBjbGFzcz1cInBiLTAgbWItMSBtci0xXCIgdmVydGljYWwtYWxpZ249XCJjZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgc2xvdD1cImFzaWRlXCI+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgICA8Yi1pbWcgcm91bmRlZD1cImNpcmNsZVwiIDpzcmM9XCJwbGF5ZXIucGhvdG9cIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiA6YWx0PVwicGxheWVyLnBsYXllclwiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluXCIvPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cImp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29scz1cIjEyXCIgbWQ9XCJhdXRvXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsYWctaWNvblwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyLmNvdW50cnkgfCBsb3dlcmNhc2VcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY29sIGxnPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYVwiIHYtYmluZDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2ZhLWZlbWFsZSc6IHBsYXllci5nZW5kZXIgPT09ICdmJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdyBjbGFzcz1cInRleHQtY2VudGVyXCIgdi1pZj1cInBsYXllci50ZWFtXCI+XHJcbiAgICAgICAgICAgICAgPGItY29sPjxzcGFuPnt7cGxheWVyLnRlYW19fTwvc3Bhbj48L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgICA8Yi1yb3c+XHJcbiAgICAgICAgICAgICAgPGItY29sIGNsYXNzPVwidGV4dC13aGl0ZVwiIHYtYmluZDpjbGFzcz1cInsndGV4dC13YXJuaW5nJzogcGxheWVyLnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgJ3RleHQtaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAndGV4dC1zdWNjZXNzJzogcGxheWVyLnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgcG9zaXRpb24gIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAge3twbGF5ZXIucG9zaXRpb259fVxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1sb25nLWFycm93LXVwJzogcGxheWVyLnJhbmsgPCBwbGF5ZXIubGFzdHJhbmssJ2ZhLWxvbmctYXJyb3ctZG93bic6IHBsYXllci5yYW5rID4gcGxheWVyLmxhc3RyYW5rLFxyXG4gICAgICAgICAgICAgICAgICdmYS1hcnJvd3MtaCc6IHBsYXllci5yYW5rID09IHBsYXllci5sYXN0cmFuayB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICA8L2Itcm93PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8aDUgY2xhc3M9XCJtLTAgIGFuaW1hdGVkIGZhZGVJbkxlZnRcIj57e3BsYXllci5wbGF5ZXJ9fTwvaDU+XHJcbiAgICAgICAgICA8cCBjbGFzcz1cImNhcmQtdGV4dCBtdC0wXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgcG9pbnRzIHAtMVwiPnt7cGxheWVyLnBvaW50c319LXt7cGxheWVyLmxvc3Nlc319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIG1hclwiPnt7cGxheWVyLm1hcmdpbiB8IGFkZHBsdXN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBwMVwiPndhcyB7e3BsYXllci5sYXN0cG9zaXRpb259fTwvc3Bhbj5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgPGItY29sPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cImJnLWluZm8gZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIj57e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5yZXN1bHQgfCBmaXJzdGNoYXIgfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIG1sLTEgdGV4dC13aGl0ZSByZXN1bHRcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiBwbGF5ZXIucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICB7e3BsYXllci5yZXN1bHQgfCBmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwicGxheWVyLnJlc3VsdCA9PSdhd2FpdGluZycgXCIgY2xhc3M9XCJ0ZXh0LWluZm8gZC1pbmxpbmUgcC0xICBzZGF0YVwiPkF3YWl0aW5nXHJcbiAgICAgICAgICAgICAgICBSZXN1bHQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1lbHNlIGNsYXNzPVwiZC1pbmxpbmUgcC0xIHNkYXRhXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZGFuZ2VyJzogcGxheWVyLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+e3twbGF5ZXIuc2NvcmV9fVxyXG4gICAgICAgICAgICAgICAgLSB7e3BsYXllci5vcHBvX3Njb3JlfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIHAtMCBtbC0xIG9wcFwiPnZzIHt7cGxheWVyLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwicmVzXCIgdi1mb3I9XCJyZXMgaW4gcGxheWVyLnByZXZyZXN1bHRzXCIgOmtleT1cInJlcy5rZXlcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWlubGluZS1ibG9jayBwLTEgdGV4dC13aGl0ZSBzZGF0YS1yZXMgdGV4dC1jZW50ZXJcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2JnLXdhcm5pbmcnOiByZXMgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWluZm8nOiByZXMgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiByZXMgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLXN1Y2Nlc3MnOiByZXMgPT09ICd3aW4nIH1cIj57e3Jlc3xmaXJzdGNoYXJ9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYi1tZWRpYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuICAgIGAsXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpdGVtc1BlclJvdzogNCxcclxuICAgICAgcGVyX3BhZ2U6IDQwLFxyXG4gICAgICBwYXJlbnRfc2x1ZzogdGhpcy4kcm91dGUucGFyYW1zLnNsdWcsXHJcbiAgICAgIHBhZ2V1cmw6IGJhc2VVUkwgKyB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcmVsb2FkaW5nOiBmYWxzZSxcclxuICAgICAgY3VycmVudFBhZ2U6IDEsXHJcbiAgICAgIHBlcmlvZDogMC41LFxyXG4gICAgICB0aW1lcjogbnVsbCxcclxuICAgICAgc2NvcmVib2FyZF9kYXRhOiBbXSxcclxuICAgICAgcmVzcG9uc2VfZGF0YTogW10sXHJcbiAgICAgIC8vIHBsYXllcnM6IFtdLFxyXG4gICAgICAvLyB0b3RhbF9yb3VuZHM6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogbnVsbCxcclxuICAgICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgICBpc19saXZlX2dhbWU6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIHRoaXMuZmV0Y2hTY29yZWJvYXJkRGF0YSgpO1xyXG4gICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKFxyXG4gICAgICBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnJlbG9hZCgpO1xyXG4gICAgICB9LmJpbmQodGhpcyksXHJcbiAgICAgIHRoaXMucGVyaW9kICogNjAwMDBcclxuICAgICk7XHJcblxyXG4gIH0sXHJcbiAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5nZXRXaW5kb3dXaWR0aCk7XHJcbiAgICB0aGlzLmNhbmNlbEF1dG9VcGRhdGUoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgICBjYW5jZWxBdXRvVXBkYXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICAgIH0sXHJcbiAgICBmZXRjaFNjb3JlYm9hcmREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIHJlbG9hZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzX2xpdmVfZ2FtZSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGV0YWlscyh0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGl0ZW1Db3VudEluUm93OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5zY29yZWJvYXJkX2RhdGEuc2xpY2UoXHJcbiAgICAgICAgKGluZGV4IC0gMSkgKiB0aGlzLml0ZW1zUGVyUm93LFxyXG4gICAgICAgIGluZGV4ICogdGhpcy5pdGVtc1BlclJvd1xyXG4gICAgICApO1xyXG4gICAgfSxcclxuICAgIHByb2Nlc3NEZXRhaWxzOiBmdW5jdGlvbihjdXJyZW50UGFnZSkge1xyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnJlc3VsdF9kYXRhKVxyXG4gICAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAgIGxldCBpbml0aWFsUmREYXRhID0gXy5pbml0aWFsKF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgcHJldmlvdXNSZERhdGEgPSBfLmxhc3QoaW5pdGlhbFJkRGF0YSk7XHJcbiAgICAgIGxldCBsYXN0UmREID0gXy5sYXN0KF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgICBsZXQgbGFzdFJkRGF0YSA9IF8ubWFwKGxhc3RSZEQsIHBsYXllciA9PiB7XHJcbiAgICAgICAgbGV0IHggPSBwbGF5ZXIucG5vIC0gMTtcclxuICAgICAgICBwbGF5ZXIucGhvdG8gPSB0aGlzLnBsYXllcnNbeF0ucGhvdG87XHJcbiAgICAgICAgcGxheWVyLmdlbmRlciA9IHRoaXMucGxheWVyc1t4XS5nZW5kZXI7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnlfZnVsbCA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5X2Z1bGw7XHJcbiAgICAgICAgcGxheWVyLmNvdW50cnkgPSB0aGlzLnBsYXllcnNbeF0uY291bnRyeTtcclxuICAgICAgICAvLyBpZiAoXHJcbiAgICAgICAgLy8gICBwbGF5ZXIucmVzdWx0ID09ICdkcmF3JyAmJlxyXG4gICAgICAgIC8vICAgcGxheWVyLnNjb3JlID09IDAgJiZcclxuICAgICAgICAvLyAgIHBsYXllci5vcHBvX3Njb3JlID09IDBcclxuICAgICAgICAvLyApIHtcclxuICAgICAgICAvLyAgIHBsYXllci5yZXN1bHQgPSAnQVInO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAocHJldmlvdXNSZERhdGEpIHtcclxuICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gXy5maW5kKHByZXZpb3VzUmREYXRhLCB7XHJcbiAgICAgICAgICAgIHBsYXllcjogcGxheWVyLnBsYXllcixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcGxheWVyLmxhc3Rwb3NpdGlvbiA9IHBsYXllckRhdGFbJ3Bvc2l0aW9uJ107XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHJhbmsgPSBwbGF5ZXJEYXRhWydyYW5rJ107XHJcbiAgICAgICAgICAvLyBwcmV2aW91cyByb3VuZHMgcmVzdWx0c1xyXG4gICAgICAgICAgcGxheWVyLnByZXZyZXN1bHRzID0gXy5jaGFpbihpbml0aWFsUmREYXRhKVxyXG4gICAgICAgICAgICAuZmxhdHRlbkRlZXAoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdi5wbGF5ZXIgPT09IHBsYXllci5wbGF5ZXI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXAoJ3Jlc3VsdCcpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGxheWVyO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIHRoaXMudG90YWxfcm91bmRzID0gcmVzdWx0ZGF0YS5sZW5ndGg7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbGFzdFJkRGF0YVswXS5yb3VuZDtcclxuICAgICAgbGV0IGNodW5rcyA9IF8uY2h1bmsobGFzdFJkRGF0YSwgdGhpcy50b3RhbF9wbGF5ZXJzKTtcclxuICAgICAgLy8gdGhpcy5yZWxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICB0aGlzLnNjb3JlYm9hcmRfZGF0YSA9IGNodW5rc1tjdXJyZW50UGFnZSAtIDFdO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgIH0pLFxyXG4gICAgcm93Q291bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMuc2NvcmVib2FyZF9kYXRhLmxlbmd0aCAvIHRoaXMuaXRlbXNQZXJSb3cpO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMgZmV0Y2hpbmcgdGhpcyBwYWdlICR7XHJcbiAgICAgICAgdGhpcy5wYWdldXJsXHJcbiAgICAgIH0gYDtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTY29yZWJvYXJkOyIsImltcG9ydCB7IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydCB9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuZXhwb3J0IHsgU2NvcmVzaGVldCBhcyBkZWZhdWx0IH07XHJcblxyXG5sZXQgU2NvcmVzaGVldCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlQ2FyZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDxkaXYgdi1pZj1cInJlc3VsdGRhdGFcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtdG9wXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4XCI+XHJcbiAgICAgICAgPGItaW1nIGNsYXNzPVwidGh1bWJuYWlsIGxvZ28gbWwtYXV0b1wiIDpzcmM9XCJsb2dvXCIgOmFsdD1cImV2ZW50X3RpdGxlXCIgLz5cclxuICAgICAgICA8aDIgY2xhc3M9XCJ0ZXh0LWNlbnRlciBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LWNlbnRlciBkLWJsb2NrXCI+U2NvcmVjYXJkcyA8aSBjbGFzcz1cImZhcyBmYS1jbGlwYm9hcmRcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgIDwvaDI+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0zIGNvbC0xMlwiPlxyXG4gICAgICA8IS0tIHBsYXllciBsaXN0IGhlcmUgLS0+XHJcbiAgICAgICAgPHVsIGNsYXNzPVwic2hhZG93IHAtMyBtYi01IGJnLXdoaXRlIHJvdW5kZWRcIj5cclxuICAgICAgICAgIDxsaSA6a2V5PVwicGxheWVyLnBub1wiIHYtZm9yPVwicGxheWVyIGluIHBkYXRhXCIgY2xhc3M9XCJiZWJhc1wiPlxyXG4gICAgICAgICAgPHNwYW4+e3twbGF5ZXIucG5vfX08L3NwYW4+IDxiLWltZy1sYXp5IDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgOnNyYz1cInBsYXllci5waG90b1wiIHYtYmluZD1cInBpY1Byb3BzXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChwbGF5ZXIucG5vKVwiIHZhcmlhbnQ9XCJsaW5rXCI+e3twbGF5ZXIucGxheWVyfX08L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC05IGNvbC0xMlwiPlxyXG4gICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJyZXN1bHRkYXRhXCI+XHJcbiAgICAgICAgICA8aDQgY2xhc3M9XCJiZWJhc1wiPiN7e21QbGF5ZXIucG5vfX1cclxuICAgICAgICAgIDxiLWltZyA6YWx0PVwibVBsYXllci5wbGF5ZXJcIiA6c3JjPVwibVBsYXllci5waG90b1wiIHN0eWxlPVwid2lkdGg6IDUwcHg7IGhlaWdodDo1MHB4XCI+PC9iLWltZz5cclxuICAgICAgICAgIHt7bVBsYXllci5wbGF5ZXJ9fTogU2NvcmVDYXJkPC9oND5cclxuICAgICAgICAgIDx0YWJsZSBjbGFzcz1cImJlYmFzIHRhYmxlIHRhYmxlLWhvdmVyIHRhYmxlLXJlc3BvbnNpdmUtbWRcIiBzdHlsZT1cIndpZHRoOjk1JTsgdGV4dC1hbGlnbjpjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGVcIj5cclxuICAgICAgICAgIDx0aGVhZCBjbGFzcz1cInRoZWFkLWRhcmsgYmViYXNcIj5cclxuICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlJkPC90aD5cclxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5PcHAuIE5hbWU8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPk9wcC4gU2NvcmU8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlNjb3JlPC90aD5cclxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5EaWZmPC90aD5cclxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5SZXN1bHQ8L3RoPlxyXG4gICAgICAgICAgICAgIDx0aCBzY29wZT1cImNvbFwiPldvbjwvdGg+XHJcbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+TG9zdDwvdGg+XHJcbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+UG9pbnRzPC90aD5cclxuICAgICAgICAgICAgICA8dGggc2NvcGU9XCJjb2xcIj5DdW0uIFNwcmVhZDwvdGg+XHJcbiAgICAgICAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+UmFuazwvdGg+XHJcbiAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICA8dHIgdi1mb3I9XCJzIGluIHNjb3JlY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDx0ZD57e3Mucm91bmR9fTxzdXAgdi1pZj1cInMuc3RhcnQgPT0neSdcIj4qPC9zdXA+PC90ZD5cclxuICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOmxlZnRcIj48c21hbGw+I3t7cy5vcHBvX25vfX08L3NtYWxsPjxiLWltZy1sYXp5IDphbHQ9XCJzLm9wcG9cIiA6c3JjPVwicy5vcHBfcGhvdG9cIiB2LWJpbmQ9XCJwaWNQcm9wc1wiPjwvYi1pbWctbGF6eT5cclxuICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwiZ2V0Q2FyZChzLm9wcG9fbm8pXCIgdmFyaWFudD1cImxpbmtcIj5cclxuICAgICAgICAgICAgICB7e3Mub3Bwb3xhYmJydn19XHJcbiAgICAgICAgICAgICAgPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgIDx0ZD57e3Mub3Bwb19zY29yZX19PC90ZD5cclxuICAgICAgICAgICAgICA8dGQ+e3tzLnNjb3JlfX08L3RkPlxyXG4gICAgICAgICAgICAgIDx0ZD57e3MuZGlmZn19PC90ZD5cclxuICAgICAgICAgICAgICA8dGQgdi1iaW5kOmNsYXNzPVwieyd0YWJsZS13YXJuaW5nJzogcy5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAndGFibGUtaW5mbyc6IHMucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICd0YWJsZS1kYW5nZXInOiBzLnJlc3VsdCA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICd0YWJsZS1zdWNjZXNzJzogcy5yZXN1bHQgPT09ICd3aW4nIH1cIj57e3MucmVzdWx0fGZpcnN0Y2hhcn19PC90ZD5cclxuICAgICAgICAgICAgICA8dGQ+e3tzLndpbnN9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgPHRkPnt7cy5sb3NzZXN9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgPHRkPnt7cy5wb2ludHN9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgPHRkPnt7cy5tYXJnaW59fTwvdGQ+XHJcbiAgICAgICAgICAgICAgPHRkPnt7cy5wb3NpdGlvbn19PC90ZD5cclxuICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgIDwhLS0gc2NvcmVjYXJkcyBoZXJlIC0tPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIGRhdGEoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGxheWVyX25vOiB0aGlzLiRyb3V0ZS5wYXJhbXMucG5vLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICB0b3VybmV5X3NsdWc6ICcnLFxyXG4gICAgICBwaWNQcm9wczoge1xyXG4gICAgICAgIGJsb2NrOiBmYWxzZSxcclxuICAgICAgICByb3VuZGVkOiAnY2lyY2xlJyxcclxuICAgICAgICBmbHVpZDogdHJ1ZSxcclxuICAgICAgICBibGFuazogdHJ1ZSxcclxuICAgICAgICBibGFua0NvbG9yOiAnI2JiYicsXHJcbiAgICAgICAgd2lkdGg6ICcyNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcyNXB4JyxcclxuICAgICAgICBjbGFzczogJ3NoYWRvdy1zbSwgbXgtMScsXHJcbiAgICAgIH0sXHJcbiAgICAgIHBkYXRhOiB7fSxcclxuICAgICAgc2NvcmVjYXJkOiB7fSxcclxuICAgICAgbVBsYXllcjoge31cclxuICAgIH07XHJcbiAgfSxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICB9LFxyXG4gIGNyZWF0ZWQoKSB7XHJcbiAgICB2YXIgcCA9IHRoaXMuc2x1Zy5zcGxpdCgnLScpO1xyXG4gICAgcC5zaGlmdCgpO1xyXG4gICAgdGhpcy50b3VybmV5X3NsdWcgPSBwLmpvaW4oJy0nKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMudG91cm5leV9zbHVnKTtcclxuICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9SRVNEQVRBJywgdGhpcy5zbHVnKTtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gYFBsYXllciBTY29yZWNhcmRzIC0gJHt0aGlzLnRvdXJuZXlfdGl0bGV9YDtcclxuICB9LFxyXG4gIHdhdGNoOntcclxuICAgIHJlc3VsdGRhdGE6IHtcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICBoYW5kbGVyOiBmdW5jdGlvbiAobmV3VmFsKSB7XHJcbiAgICAgICAgaWYgKG5ld1ZhbCkge1xyXG4gICAgICAgICAgdGhpcy5wZGF0YSA9IF8uY2hhaW4odGhpcy5yZXN1bHRkYXRhKVxyXG4gICAgICAgICAgICAubGFzdCgpLnNvcnRCeSgncG5vJykudmFsdWUoKTtcclxuICAgICAgICAgIHRoaXMuZ2V0Q2FyZCh0aGlzLnBsYXllcl9ubyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0Q2FyZDogZnVuY3Rpb24gKG4pIHtcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHRoaXMuc2NvcmVjYXJkID0gXy5jaGFpbihjKS5tYXAoZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gXy5maWx0ZXIodiwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgIHJldHVybiBvLnBubyA9PSBuO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KS5mbGF0dGVuRGVlcCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubVBsYXllciA9IF8uZmlyc3QodGhpcy5zY29yZWNhcmQpO1xyXG4gICAgICB0aGlzLiRyb3V0ZXIucmVwbGFjZSh7IG5hbWU6ICdTY29yZXNoZWV0JywgcGFyYW1zOiB7IHBubzogbiB9IH0pO1xyXG4gICAgICB0aGlzLnBsYXllcl9ubyA9IG47XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIGV2ZW50X2RhdGE6ICdFVkVOVFNUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBjYXRlZ29yeTogJ0NBVEVHT1JZJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgcGFyZW50X3NsdWc6ICdQQVJFTlRTTFVHJyxcclxuICAgICAgZXZlbnRfdGl0bGU6ICdFVkVOVF9USVRMRScsXHJcbiAgICAgIHRvdXJuZXlfdGl0bGU6ICdUT1VSTkVZX1RJVExFJyxcclxuICAgICAgbG9nbzogJ0xPR09fVVJMJyxcclxuICAgIH0pLFxyXG4gICAgYnJlYWRjcnVtYnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdUb3VybmFtZW50cycsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leXNMaXN0JyxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLnRvdXJuZXlfdGl0bGUsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnVG91cm5leURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIHNsdWc6IHRoaXMudG91cm5leV9zbHVnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IGAke18uY2FwaXRhbGl6ZSh0aGlzLmNhdGVnb3J5KX0gLSBSZXN1bHRzIGFuZCBTdGF0c2AsXHJcbiAgICAgICAgICB0bzoge1xyXG4gICAgICAgICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgIGV2ZW50X3NsdWc6IHRoaXMuc2x1Z1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnU2NvcmVjYXJkcycsXHJcbiAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhdGhcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIiwiIGxldCBMb1dpbnMgPSBWdWUuY29tcG9uZW50KCdsb3dpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIExvdyBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldExvd1Njb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJsb3d3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvd3dpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxvd3dpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRMb3dTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWluQnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpV2lucyA9VnVlLmNvbXBvbmVudCgnaGl3aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBIaWdoIFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImhpZ2h3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWdod2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlnaHdpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpTG9zcyA9IFZ1ZS5jb21wb25lbnQoJ2hpbG9zcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPCEtLSBIaWdoIExvc2luZyBTY29yZXMgLS0+XHJcbiAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCdsb3NzJylcIiA6ZmllbGRzPVwiaGlsb3NzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlsb3NzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWxvc3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ1dpbm5lcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IENvbWJvU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnY29tYm9zY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGljb21ibygpXCIgOmZpZWxkcz1cImhpY29tYm9fZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAge3tjYXB0aW9ufX1cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGljb21ib19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGljb21ib19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnY29tYm9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQ29tYmluZWQgU2NvcmUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnV2lubmluZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0xvc2luZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaWNvbWJvKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmNvbWJvX3Njb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2NvbWJvX3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ3RvdGFsc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxzY29yZV9maWVsZHMgPSBbXHJcbiAgICAvLyAgJ2luZGV4JyxcclxuICAgICAgeyBrZXk6ICdwb3NpdGlvbicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd0b3RhbF9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdUb3RhbCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IFRvdGFsT3BwU2NvcmVzID1WdWUuY29tcG9uZW50KCdvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwidG90YWxvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgICAgICB7e2RhdGEuaW5kZXggKyAxfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0b3RhbG9wcHNjb3JlX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy50b3RhbG9wcHNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3RvdGFsX29wcHNjb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1RvdGFsIE9wcG9uZW50IFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbiBsZXQgQXZlU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnYXZlc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwic3RhdHNcIiA6ZmllbGRzPVwiYXZlc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYXZlc2NvcmVfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmF2ZXNjb3JlX2ZpZWxkcyA9IFtcclxuICAgICAgLy8naW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBBdmVPcHBTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICBob3ZlciByZXNwb25zaXZlIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAvLyAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9vcHBfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQXZlcmFnZSBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgTG9TcHJlYWQgPSBWdWUuY29tcG9uZW50KCdsb3NwcmVhZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImxvU3ByZWFkKClcIiA6ZmllbGRzPVwibG9zcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3NwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG9zcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBsb1NwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpU3ByZWFkID0gICBWdWUuY29tcG9uZW50KCdoaXNwcmVhZCcse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGlTcHJlYWQoKVwiIDpmaWVsZHM9XCJoaXNwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaXNwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlzcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaVNwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmRpZmY7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IHtIaVdpbnMsIExvV2lucyxIaUxvc3MsQ29tYm9TY29yZXMsVG90YWxTY29yZXMsVG90YWxPcHBTY29yZXMsQXZlU2NvcmVzLEF2ZU9wcFNjb3JlcyxIaVNwcmVhZCwgTG9TcHJlYWR9IiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbmxldCB0b3BQZXJmb3JtZXJzID0gVnVlLmNvbXBvbmVudCgndG9wLXN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMiBjb2wtc20tNCBjb2wtMTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibXQtNSBkLWZsZXggZmxleC1jb2x1bW4gYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiYnRuLW91dGxpbmUtc3VjY2Vzc1wiIHRpdGxlPVwiVG9wIDNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCd0b3AzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0ndG9wMydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Ub3AgMzwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkhpZ2hlc3QgR2FtZSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCdoaWdhbWVzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlnYW1lcydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYnVsbHNleWUgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggR2FtZTwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkhpZ2hlc3QgQXZlcmFnZSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlhdmVzJ1wiXHJcbiAgICAgICAgICAgIEBjbGljaz1cInNob3dQaWMoJ2hpYXZlcycpXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRodW1icy11cCBtLTFcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+SGlnaCBBdmUuIFNjb3JlczwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkxvd2VzdCBBdmVyYWdlIE9wcG9uZW50IFNjb3Jlc1wiIGNsYXNzPVwibS0yIGJ0bi1ibG9ja1wiIEBjbGljaz1cInNob3dQaWMoJ2xvb3BwYXZlcycpXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2xvb3BwYXZlcydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYmVlciBtci0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkxvdyBPcHAgQXZlPC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgY29sLXNtLTggY29sLTEyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxoMz57e3RpdGxlfX08L2gzPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00IGNvbC0xMiBhbmltYXRlZCBmYWRlSW5SaWdodEJpZ1wiIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBzdGF0c1wiPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJwLTIgdGV4dC1jZW50ZXIgYmViYXMgYmctZGFyayB0ZXh0LXdoaXRlXCI+e3tpdGVtLnBsYXllcn19PC9oND5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxpbWcgOnNyYz1cInBsYXllcnNbaXRlbS5wbm8tMV0ucGhvdG9cIiB3aWR0aD0nMTIwJyBoZWlnaHQ9JzEyMCcgY2xhc3M9XCJpbWctZmx1aWQgcm91bmRlZC1jaXJjbGVcIlxyXG4gICAgICAgICAgICAgICAgOmFsdD1cInBsYXllcnNbaXRlbS5wbm8tMV0ucG9zdF90aXRsZXxsb3dlcmNhc2VcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgbWwtNVwiPlxyXG4gICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJteC0xIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnkgfCBsb3dlcmNhc2VcIlxyXG4gICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLmNvdW50cnlfZnVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmYVwiXHJcbiAgICAgICAgICAgICAgICAgIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdtJywgJ2ZhLWZlbWFsZSc6IHBsYXllcnNbaXRlbS5wbm8tMV0uZ2VuZGVyID09ICdmJ31cIlxyXG4gICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYmctZGFyayB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnBvaW50c1wiPnt7aXRlbS5wb2ludHN9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm14LTEgZGlzcGxheS01IGQtaW5saW5lLWJsb2NrIGFsaWduLXNlbGYtY2VudGVyXCIgdi1pZj1cIml0ZW0ubWFyZ2luXCI+e3tpdGVtLm1hcmdpbnxhZGRwbHVzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIHRleHQtY2VudGVyIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLnNjb3JlXCI+Um91bmQge3tpdGVtLnJvdW5kfX0gdnMge3tpdGVtLm9wcG99fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgYmctc3VjY2VzcyB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnNjb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLnBvc2l0aW9uXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0ucG9zaXRpb259fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uYXZlX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9vcHBfc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5hdmVfb3BwX3Njb3JlfX08L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG4gIGRhdGE6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnJyxcclxuICAgICAgcHJvZmlsZXMgOiBbXSxcclxuICAgICAgc3RhdHM6IFtdLFxyXG4gICAgICBjdXJyZW50VmlldzogJydcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5zaG93UGljKCd0b3AzJyk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBzaG93UGljOiBmdW5jdGlvbiAodCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdFxyXG4gICAgICBsZXQgYXJyLHIscyA9IFtdO1xyXG4gICAgICBpZiAodCA9PSAnaGlhdmVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ2F2ZV9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9zY29yZSddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZSA9ICdIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICdsb29wcGF2ZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5nZXRTdGF0cygnYXZlX29wcF9zY29yZScpO1xyXG4gICAgICAgIHIgPSBfLnRha2VSaWdodChhcnIsIDMpLnJldmVyc2UoKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ2F2ZV9vcHBfc2NvcmUnXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGU9J0xvd2VzdCBPcHBvbmVudCBBdmVyYWdlIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnaGlnYW1lcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmNvbXB1dGVTdGF0cygpO1xyXG4gICAgICAgIHIgPSBfLnRha2UoYXJyLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3Njb3JlJywncm91bmQnLCdvcHBvJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdIaWdoIEdhbWUgU2NvcmVzJ1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0ID09ICd0b3AzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ3BvaW50cycpO1xyXG4gICAgICAgIHMgPSBfLnNvcnRCeShhcnIsWydwb2ludHMnLCdtYXJnaW4nXSkucmV2ZXJzZSgpXHJcbiAgICAgICAgciA9IF8udGFrZShzLCAzKS5tYXAoZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgIHJldHVybiBfLnBpY2socCwgWydwbGF5ZXInLCAncG5vJywgJ3BvaW50cycsJ21hcmdpbicsJ3Bvc2l0aW9uJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdUb3AgMydcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdGF0cyA9IHI7XHJcbiAgICAgIC8vIHRoaXMucHJvZmlsZXMgPSB0aGlzLnBsYXllcnNbci5wbm8tMV07XHJcblxyXG4gICAgfSxcclxuICAgIGdldFN0YXRzOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeSh0aGlzLmZpbmFsc3RhdHMsIGtleSkucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICAgIGNvbXB1dGVTdGF0czogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgLi4ubWFwR2V0dGVycyh7XHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcm91bmRzOiAnVE9UQUxfUk9VTkRTJyxcclxuICAgICAgZmluYWxzdGF0czogJ0ZJTkFMX1JPVU5EX1NUQVRTJyxcclxuICAgICAgcmVzdWx0ZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBvbmdvaW5nOiAnT05HT0lOR19UT1VSTkVZJyxcclxuICAgIH0pLFxyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCB0b3BQZXJmb3JtZXJzOyIsImV4cG9ydCB7IHN0b3JlIGFzIGRlZmF1bHQgfTtcclxuXHJcbmltcG9ydCBiYXNlVVJMIGZyb20gJy4vY29uZmlnLmpzJ1xyXG5jb25zdCBzdG9yZSA9IG5ldyBWdWV4LlN0b3JlKHtcclxuICBzdHJpY3Q6IGZhbHNlLFxyXG4gIHN0YXRlOiB7XHJcbiAgICB0b3VhcGk6IFtdLFxyXG4gICAgdG91YWNjZXNzdGltZTogJycsXHJcbiAgICBkZXRhaWw6IFtdLFxyXG4gICAgbGFzdGRldGFpbGFjY2VzczogJycsXHJcbiAgICBldmVudF9zdGF0czogW10sXHJcbiAgICBwbGF5ZXJzOiBbXSxcclxuICAgIHJlc3VsdF9kYXRhOiBbXSxcclxuICAgIHRvdGFsX3BsYXllcnM6IG51bGwsXHJcbiAgICBlcnJvcjogJycsXHJcbiAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgb25nb2luZzogZmFsc2UsXHJcbiAgICBjdXJyZW50UGFnZTogbnVsbCxcclxuICAgIFdQdG90YWw6IG51bGwsXHJcbiAgICBXUHBhZ2VzOiBudWxsLFxyXG4gICAgY2F0ZWdvcnk6ICcnLFxyXG4gICAgcGFyZW50c2x1ZzogJycsXHJcbiAgICBldmVudF90aXRsZTogJycsXHJcbiAgICB0b3VybmV5X3RpdGxlOiAnJyxcclxuICAgIGxvZ29fdXJsOiAnJyxcclxuICAgIHRvdGFsX3JvdW5kczogbnVsbCxcclxuICAgIGZpbmFsX3JvdW5kX3N0YXRzOiBbXSxcclxuICAgIHNob3dzdGF0czogZmFsc2UsXHJcbiAgICBwbGF5ZXJfbGFzdF9yZF9kYXRhOiBbXSxcclxuICAgIHBsYXllcmRhdGE6IFtdLFxyXG4gICAgcGxheWVyOiBudWxsLFxyXG4gICAgcGxheWVyX3N0YXRzOiB7fSxcclxuICB9LFxyXG4gIGdldHRlcnM6IHtcclxuICAgIFBMQVlFUl9TVEFUUzogc3RhdGUgPT4gc3RhdGUucGxheWVyX3N0YXRzLFxyXG4gICAgTEFTVFJEREFUQTogc3RhdGUgPT4gc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSxcclxuICAgIFBMQVlFUkRBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcmRhdGEsXHJcbiAgICBQTEFZRVI6IHN0YXRlID0+IHN0YXRlLnBsYXllcixcclxuICAgIFNIT1dTVEFUUzogc3RhdGUgPT4gc3RhdGUuc2hvd3N0YXRzLFxyXG4gICAgVE9VQVBJOiBzdGF0ZSA9PiBzdGF0ZS50b3VhcGksXHJcbiAgICBUT1VBQ0NFU1NUSU1FOiBzdGF0ZSA9PiBzdGF0ZS50b3VhY2Nlc3N0aW1lLFxyXG4gICAgREVUQUlMOiBzdGF0ZSA9PiBzdGF0ZS5kZXRhaWwsXHJcbiAgICBMQVNUREVUQUlMQUNDRVNTOiBzdGF0ZSA9PiBzdGF0ZS5sYXN0ZGV0YWlsYWNjZXNzLFxyXG4gICAgRVZFTlRTVEFUUzogc3RhdGUgPT4gc3RhdGUuZXZlbnRfc3RhdHMsXHJcbiAgICBQTEFZRVJTOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJzLFxyXG4gICAgVE9UQUxQTEFZRVJTOiBzdGF0ZSA9PiBzdGF0ZS50b3RhbF9wbGF5ZXJzLFxyXG4gICAgUkVTVUxUREFUQTogc3RhdGUgPT4gc3RhdGUucmVzdWx0X2RhdGEsXHJcbiAgICBFUlJPUjogc3RhdGUgPT4gc3RhdGUuZXJyb3IsXHJcbiAgICBMT0FESU5HOiBzdGF0ZSA9PiBzdGF0ZS5sb2FkaW5nLFxyXG4gICAgQ1VSUlBBR0U6IHN0YXRlID0+IHN0YXRlLmN1cnJlbnRQYWdlLFxyXG4gICAgV1BUT1RBTDogc3RhdGUgPT4gc3RhdGUuV1B0b3RhbCxcclxuICAgIFdQUEFHRVM6IHN0YXRlID0+IHN0YXRlLldQcGFnZXMsXHJcbiAgICBDQVRFR09SWTogc3RhdGUgPT4gc3RhdGUuY2F0ZWdvcnksXHJcbiAgICBUT1RBTF9ST1VORFM6IHN0YXRlID0+IHN0YXRlLnRvdGFsX3JvdW5kcyxcclxuICAgIEZJTkFMX1JPVU5EX1NUQVRTOiBzdGF0ZSA9PiBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyxcclxuICAgIFBBUkVOVFNMVUc6IHN0YXRlID0+IHN0YXRlLnBhcmVudHNsdWcsXHJcbiAgICBFVkVOVF9USVRMRTogc3RhdGUgPT4gc3RhdGUuZXZlbnRfdGl0bGUsXHJcbiAgICBUT1VSTkVZX1RJVExFOiBzdGF0ZSA9PiBzdGF0ZS50b3VybmV5X3RpdGxlLFxyXG4gICAgT05HT0lOR19UT1VSTkVZOiBzdGF0ZSA9PiBzdGF0ZS5vbmdvaW5nLFxyXG4gICAgTE9HT19VUkw6IHN0YXRlID0+IHN0YXRlLmxvZ29fdXJsLFxyXG4gIH0sXHJcbiAgbXV0YXRpb25zOiB7XHJcbiAgICBTRVRfU0hPV1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuc2hvd3N0YXRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRklOQUxfUkRfU1RBVFM6IChzdGF0ZSwgcmVzdWx0c3RhdHMpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHJlc3VsdHN0YXRzLmxlbmd0aDtcclxuICAgICAgaWYgKGxlbiA+IDEpIHtcclxuICAgICAgICBzdGF0ZS5maW5hbF9yb3VuZF9zdGF0cyA9IF8ubGFzdChyZXN1bHRzdGF0cyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBTRVRfVE9VREFUQTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFwaSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0VWRU5UREVUQUlMOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZGV0YWlsID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnRvdWFjY2Vzc3RpbWUgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9ERVRBSUxfTEFTVF9BQ0NFU1NfVElNRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmxhc3RkZXRhaWxhY2Nlc3MgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9XUF9DT05TVEFOVFM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5XUHBhZ2VzID0gcGF5bG9hZFsneC13cC10b3RhbHBhZ2VzJ107XHJcbiAgICAgIHN0YXRlLldQdG90YWwgPSBwYXlsb2FkWyd4LXdwLXRvdGFsJ107XHJcbiAgICB9LFxyXG4gICAgU0VUX1BMQVlFUlM6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgYSA9IHBheWxvYWQubWFwKGZ1bmN0aW9uKHZhbCwgaW5kZXgsIGtleSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGtleVtpbmRleF1bJ3Bvc3RfdGl0bGUnXSk7XHJcbiAgICAgICAga2V5W2luZGV4XVsndG91X25vJ10gPSBpbmRleCArIDE7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgfSk7XHJcbiAgICAgIHN0YXRlLnRvdGFsX3BsYXllcnMgPSBwYXlsb2FkLmxlbmd0aDtcclxuICAgICAgc3RhdGUucGxheWVycyA9IGE7XHJcbiAgICB9LFxyXG4gICAgU0VUX1JFU1VMVDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGxldCBwID0gc3RhdGUucGxheWVycztcclxuICAgICAgbGV0IHIgPSBfLm1hcChwYXlsb2FkLCBmdW5jdGlvbiAoeikge1xyXG4gICAgICAgIHJldHVybiBfLm1hcCh6LCBmdW5jdGlvbiAobykge1xyXG4gICAgICAgICAgbGV0IGkgPSBvLnBubyAtIDE7XHJcbiAgICAgICAgICBvLnBob3RvID0gcFtpXS5waG90bztcclxuICAgICAgICAgIG8uaWQgPSBwW2ldLmlkO1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5ID0gcFtpXS5jb3VudHJ5O1xyXG4gICAgICAgICAgby5jb3VudHJ5X2Z1bGwgPSBwW2ldLmNvdW50cnlfZnVsbDtcclxuICAgICAgICAgIG8uZ2VuZGVyID0gcFtpXS5nZW5kZXI7XHJcbiAgICAgICAgICBvLmlzX3RlYW0gPSBwW2ldLmlzX3RlYW07XHJcbiAgICAgICAgICBsZXQgeCA9IG8ub3Bwb19ubyAtIDE7XHJcbiAgICAgICAgICBvLm9wcF9waG90byA9IHBbeF0ucGhvdG87XHJcbiAgICAgICAgICBvLm9wcF9pZCA9IHBbeF0uaWQ7XHJcbiAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocik7XHJcbiAgICAgIHN0YXRlLnJlc3VsdF9kYXRhID0gcjtcclxuICAgIH0sXHJcbiAgICBTRVRfT05HT0lORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLm9uZ29pbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVFNUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DVVJSUEFHRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmN1cnJlbnRQYWdlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVJST1I6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5lcnJvciA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9UQUxfUk9VTkRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG90YWxfcm91bmRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ0FURUdPUlk6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jYXRlZ29yeSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVVJORVlfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VybmV5X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfUEFSRU5UU0xVRzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhcmVudHNsdWcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVF9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HT19VUkw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dvX3VybCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgLy9cclxuICAgIENPTVBVVEVfUExBWUVSX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHN0YXRlLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgICAgbGV0IGxhc3Ryb3VuZCA9IHN0YXRlLnJlc3VsdF9kYXRhW2xlbiAtIDFdO1xyXG4gICAgICBsZXQgcGxheWVyID0gKHN0YXRlLnBsYXllciA9IF8uZmlsdGVyKHN0YXRlLnBsYXllcnMsIHsgaWQ6IHBheWxvYWQgfSkpO1xyXG4gICAgICBsZXQgbmFtZSA9IF8ubWFwKHBsYXllciwgJ3Bvc3RfdGl0bGUnKSArICcnOyAvLyBjb252ZXJ0IHRvIHN0cmluZ1xyXG4gICAgICBsZXQgcGxheWVyX3RubyA9IHBhcnNlSW50KF8ubWFwKHBsYXllciwgJ3RvdV9ubycpKTtcclxuICAgICAgc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSA9IF8uZmluZChsYXN0cm91bmQsIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG5cclxuICAgICAgbGV0IHBkYXRhID0gKHN0YXRlLnBsYXllcmRhdGEgPSBfLmNoYWluKHN0YXRlLnJlc3VsdF9kYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCBzY29yZXMgPSBfLmZsYXR0ZW5EZWVwKF8ubWFwKG0sICdzY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBsZXQgYWxsT3BwU2NvcmVzID0gKHN0YXRlLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXMgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgbGV0IG9wcHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ29wcG9fc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gb3Bwc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLmFsbFJhbmtzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBIaVNjb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBwTG9TY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBMb1Njb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHMgPSBwSGlTY29yZVJvdW5kcy5qb2luKCk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcyA9IHBMb1Njb3JlUm91bmRzLmpvaW4oKTtcclxuXHJcbiAgICAgIGxldCBwUmJ5UiA9IF8ubWFwKHBkYXRhLCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uKGwpIHtcclxuICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgICAgICAgIGlmIChsLnJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ3dvbic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdBUic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnZHJhdycpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ2RyZXcnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ2xvc3QnO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IHN0YXJ0aW5nID0gJ3JlcGx5aW5nJztcclxuICAgICAgICAgIGlmIChsLnN0YXJ0ID09ICd5Jykge1xyXG4gICAgICAgICAgICBzdGFydGluZyA9ICdzdGFydGluZyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAocmVzdWx0ID09ICdBUicpIHtcclxuICAgICAgICAgICAgbC5yZXBvcnQgPVxyXG4gICAgICAgICAgICAgICdJbiByb3VuZCAnICtcclxuICAgICAgICAgICAgICBsLnJvdW5kICtcclxuICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgIG5hbWUgK1xyXG4gICAgICAgICAgICAgICc8ZW0gdi1pZj1cImwuc3RhcnRcIj4sICgnICtcclxuICAgICAgICAgICAgICBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBpcyBwbGF5aW5nIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+LiBSZXN1bHRzIGFyZSBiZWluZyBhd2FpdGVkJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGwucmVwb3J0ID1cclxuICAgICAgICAgICAgICAnSW4gcm91bmQgJyArXHJcbiAgICAgICAgICAgICAgbC5yb3VuZCArXHJcbiAgICAgICAgICAgICAgJyAnICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPGVtIHYtaWY9XCJsLnN0YXJ0XCI+LCAoJyArXHJcbiAgICAgICAgICAgICAgc3RhcnRpbmcgK1xyXG4gICAgICAgICAgICAgICcpPC9lbT4gcGxheWVkIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5vcHBvICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IGFuZCAnICtcclxuICAgICAgICAgICAgICByZXN1bHQgK1xyXG4gICAgICAgICAgICAgICcgPGVtPicgK1xyXG4gICAgICAgICAgICAgIGwuc2NvcmUgK1xyXG4gICAgICAgICAgICAgICcgLSAnICtcclxuICAgICAgICAgICAgICBsLm9wcG9fc2NvcmUgK1xyXG4gICAgICAgICAgICAgICc8L2VtPiBhIGRpZmZlcmVuY2Ugb2YgJyArXHJcbiAgICAgICAgICAgICAgbC5kaWZmICtcclxuICAgICAgICAgICAgICAnLiA8c3BhbiBjbGFzcz1cInN1bW1hcnlcIj48ZW0+JyArXHJcbiAgICAgICAgICAgICAgbmFtZSArXHJcbiAgICAgICAgICAgICAgJzwvZW0+IGlzIHJhbmtlZCA8c3Ryb25nPicgK1xyXG4gICAgICAgICAgICAgIGwucG9zaXRpb24gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gd2l0aCA8c3Ryb25nPicgK1xyXG4gICAgICAgICAgICAgIGwucG9pbnRzICtcclxuICAgICAgICAgICAgICAnPC9zdHJvbmc+IHBvaW50cyBhbmQgYSBjdW11bGF0aXZlIHNwcmVhZCBvZiAnICtcclxuICAgICAgICAgICAgICBsLm1hcmdpbiArXHJcbiAgICAgICAgICAgICAgJyA8L3NwYW4+JztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnBSYnlSID0gXy5mbGF0dGVuRGVlcChwUmJ5Uik7XHJcblxyXG4gICAgICBsZXQgYWxsV2lucyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKF8uZmxhdHRlbkRlZXAocGRhdGEpLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ3dpbicgPT0gcC5yZXN1bHQ7XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydFdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ3knXSkubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbHlXaW5zID0gXy5maWx0ZXIoYWxsV2lucywgWydzdGFydCcsICduJ10pLmxlbmd0aDtcclxuICAgICAgbGV0IHN0YXJ0cyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKF8uZmxhdHRlbkRlZXAocGRhdGEpLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgICAgICBpZiAocC5zdGFydCA9PSAneScpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydHMgPSBzdGFydHMubGVuZ3RoO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucmVwbGllcyA9IHN0YXRlLnRvdGFsX3JvdW5kcyAtIHN0YXJ0cy5sZW5ndGg7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1TdGFydHMgQ291bnQtLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YXJ0cy5sZW5ndGgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1TdGFydHMgV2luIENvdW50LS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzdGF0ZS5wbGF5ZXJfc3RhdHMuc3RhcnRXaW5zKTtcclxuICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tUmVwbGllcyBDb3VudCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgY29uc29sZS5sb2coc3RhdGUudG90YWxfcm91bmRzIC0gc3RhcnRzLmxlbmd0aCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVJlcGx5IFdpbiBDb3VudCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMpO1xyXG4gICAgfSxcclxuICB9LFxyXG4gIGFjdGlvbnM6IHtcclxuICAgIERPX1NUQVRTOiAoY29udGV4dCwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1NIT1dTVEFUUycsIHBheWxvYWQpO1xyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBGRVRDSF9BUEkgKGNvbnRleHQsIHBheWxvYWQpICB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10b3VybmFtZW50YDtcclxuICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3NcclxuICAgICAgICAuZ2V0KHVybCwgeyBwYXJhbXM6IHsgcGFnZTogcGF5bG9hZCB9IH0pXHJcbiAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgbGV0IGhlYWRlcnMgPSByZXNwb25zZS5oZWFkZXJzO1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKCdHZXR0aW5nIGxpc3RzIG9mIHRvdXJuYW1lbnRzJyk7XHJcbiAgICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGEubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAvLyBGb3JtYXQgYW5kIGFzc2lnbiBUb3VybmFtZW50IHN0YXJ0IGRhdGUgaW50byBhIGxldGlhYmxlXHJcbiAgICAgICAgICAgIGxldCBzdGFydERhdGUgPSBkYXRhLnN0YXJ0X2RhdGU7XHJcbiAgICAgICAgICAgIGRhdGEuc3RhcnRfZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShzdGFydERhdGUpKS5mb3JtYXQoXHJcbiAgICAgICAgICAgICAgJ2RkZGQsIE1NTU0gRG8gWVlZWSdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIC8vY29uc29sZS5sb2cobW9tZW50KGhlYWRlcnMuZGF0ZSkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCIlY1wiICsgbW9tZW50KGhlYWRlcnMuZGF0ZSksIFwiZm9udC1zaXplOjMwcHg7Y29sb3I6Z3JlZW47XCIpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MQVNUX0FDQ0VTU19USU1FJywgaGVhZGVycy5kYXRlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfV1BfQ09OU1RBTlRTJywgaGVhZGVycyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVURBVEEnLCBkYXRhKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfQ1VSUlBBR0UnLCBwYXlsb2FkKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnJvci50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgRkVUQ0hfREVUQUlMIChjb250ZXh0LCBwYXlsb2FkKSB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIHRydWUpO1xyXG4gICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10b3VybmFtZW50YDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQodXJsLCB7IHBhcmFtczogeyBzbHVnOiBwYXlsb2FkIH0gfSk7XHJcbiAgICAgICAgIGxldCBoZWFkZXJzID0gcmVzcG9uc2UuaGVhZGVycztcclxuICAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgICBsZXQgc3RhcnREYXRlID0gZGF0YS5zdGFydF9kYXRlO1xyXG4gICAgICAgICBkYXRhLnN0YXJ0X2RhdGUgPSBtb21lbnQobmV3IERhdGUoc3RhcnREYXRlKSkuZm9ybWF0KFxyXG4gICAgICAgICAgICdkZGRkLCBNTU1NIERvIFlZWVknKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9XUF9DT05TVEFOVFMnLCBoZWFkZXJzKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9ERVRBSUxfTEFTVF9BQ0NFU1NfVElNRScsIGhlYWRlcnMuZGF0ZSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRERVRBSUwnLCBkYXRhKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIGFzeW5jIEZFVENIX0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRfZGF0YWA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pXHJcbiAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gSlNPTi5wYXJzZShkYXRhLnJlc3VsdHMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdGRVRDSCBEQVRBICRzdG9yZScpXHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XHJcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gZGF0YS5ldmVudF9jYXRlZ29yeVswXS5uYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IGxvZ28gPSBkYXRhLnRvdXJuZXlbMF0uZXZlbnRfbG9nby5ndWlkO1xyXG4gICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgbGV0IHBhcmVudF9zbHVnID0gZGF0YS50b3VybmV5WzBdLnBvc3RfbmFtZTtcclxuICAgICAgICBsZXQgZXZlbnRfdGl0bGUgPSB0b3VybmV5X3RpdGxlICsgJyAoJyArIGNhdGVnb3J5ICsgJyknO1xyXG4gICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VWRU5UU1RBVFMnLCBkYXRhLnRvdXJuZXkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfT05HT0lORycsIGRhdGEub25nb2luZyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9SRVNVTFQnLCByZXN1bHRzKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0ZJTkFMX1JEX1NUQVRTJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPR09fVVJMJywgbG9nbyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1VSTkVZX1RJVExFJywgdG91cm5leV90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1RPVEFMX1JPVU5EUycsIHRvdGFsX3JvdW5kcyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QQVJFTlRTTFVHJywgcGFyZW50X3NsdWcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgICBjYXRjaCAoZXJyb3IpXHJcbiAgICAgIHtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0VSUk9SJywgZXJyb3IudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIEZFVENIX1JFU0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgICAgICBsZXQgdXJsID0gYCR7YmFzZVVSTH10X2RhdGFgO1xyXG4gICAgICAgICAgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pLnRoZW4ocmVzcG9uc2U9PntcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YVswXTtcclxuICAgICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgICAgbGV0IHJlc3VsdHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0cyk7XHJcbiAgICAgICAgICBsZXQgY2F0ZWdvcnkgPSBkYXRhLmV2ZW50X2NhdGVnb3J5WzBdLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgIGxldCBsb2dvID0gZGF0YS50b3VybmV5WzBdLmV2ZW50X2xvZ28uZ3VpZDtcclxuICAgICAgICAgIGxldCB0b3VybmV5X3RpdGxlID0gZGF0YS50b3VybmV5WzBdLnBvc3RfdGl0bGU7XHJcbiAgICAgICAgICBsZXQgcGFyZW50X3NsdWcgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF9uYW1lO1xyXG4gICAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICAgIGxldCB0b3RhbF9yb3VuZHMgPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRTVEFUUycsIGRhdGEudG91cm5leSk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9QTEFZRVJTJywgcGxheWVycyk7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1JFU1VMVCcsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DQVRFR09SWScsIGNhdGVnb3J5KTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9HT19VUkwnLCBsb2dvKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVF9USVRMRScsIGV2ZW50X3RpdGxlKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9UQUxfUk9VTkRTJywgdG90YWxfcm91bmRzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgICAgIH0pLmNhdGNoKGVycm9yID0+e1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuLy8gZXhwb3J0IGRlZmF1bHQgc3RvcmU7XHJcbiJdfQ==
