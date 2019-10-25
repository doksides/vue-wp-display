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
} // {
//   path: '/tourneys/:event_slug/board',
//   name: 'Scoreboard',
//   component: Scoreboard,
//   props: true,
//   meta: { title: 'Scoreboard' },
// },
];
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

},{"./pages/category.js":9,"./pages/detail.js":10,"./pages/list.js":11,"./store.js":16,"@babel/runtime/helpers/interopRequireDefault":3}],8:[function(require,module,exports){
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
  template: "\n    <div class=\"container-fluid\">\n    <div v-if=\"resultdata\" class=\"row no-gutters justify-content-center align-items-top\">\n        <div class=\"col-12\">\n            <b-breadcrumb :items=\"breadcrumbs\" />\n        </div>\n    </div>\n    <div v-if=\"loading||error\" class=\"row justify-content-center align-content-center align-items-center\">\n        <div v-if=\"loading\" class=\"col align-self-center\">\n            <loading></loading>\n        </div>\n        <div v-else class=\"col align-self-center\">\n          <error>\n          <p slot=\"error\">{{error}}</p>\n          <p slot=\"error_msg\">{{error_msg}}</p>\n          </error>\n        </div>\n    </div>\n    <template v-if=\"!(error||loading)\">\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex\">\n              <b-img class=\"thumbnail logo ml-auto\" :src=\"logo\" :alt=\"event_title\" />\n              <h2 class=\"text-left bebas\">{{ event_title }}\n              <span :title=\"total_rounds+ ' rounds, ' + total_players +' players'\" v-show=\"total_rounds\" class=\"text-center d-block\">{{ total_rounds }} Games   {{ total_players}} <i class=\"fas fa-users\"></i> </span>\n              </h2>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-12 d-flex justify-content-center align-items-center\">\n                <div class=\"text-center\">\n                <b-button @click=\"viewIndex=0\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==0\" :pressed=\"viewIndex==0\"><i class=\"fa fa-users\" aria-hidden=\"true\"></i> Players</b-button>\n                <b-button @click=\"viewIndex=1\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==1\" :pressed=\"viewIndex==1\"> <i class=\"fa fa-user-plus\"></i> Pairings</b-button>\n                <b-button @click=\"viewIndex=2\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==2\" :pressed=\"viewIndex==2\"><i class=\"fas fa-sticky-note\" aria-hidden=\"true\"></i> Results</b-button>\n                <b-button @click=\"viewIndex=3\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==3\" :pressed=\"viewIndex==3\"><i class=\"fas fa-sort-numeric-down    \"></i> Standings</b-button>\n                <b-button @click=\"viewIndex=4\" variant=\"link\" class=\"text-decoration-none\" :disabled=\"viewIndex==4\" :pressed=\"viewIndex==4\"><i class=\"fas fa-chart-pie\"></i> Statistics</b-button>\n                <b-button  @click=\"viewIndex=5\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==5\" :pressed=\"viewIndex==5\"><i class=\"fas fa-chalkboard-teacher\"></i>\n                Scoreboard</b-button>\n                <b-button  @click=\"viewIndex=6\" variant=\"link\" class=\"text-decoration-none\" active-class=\"currentView\" :disabled=\"viewIndex==6\" :pressed=\"viewIndex==6\"><i class=\"fas fa-medal\"></i>\n                Top Performers</b-button>\n                </div>\n            </div>\n        </div>\n        <div class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-1 col-12 d-flex flex-column\">\n              <h3 class=\"text-center bebas p-0 m-0\"> {{tab_heading}}\n              <span v-if=\"viewIndex >0 && viewIndex < 4\">\n              {{ currentRound }}\n              </span>\n              </h3>\n              <template v-if=\"showPagination\">\n                  <b-pagination align=\"center\" :total-rows=\"total_rounds\" v-model=\"currentRound\" :per-page=\"1\"\n                      :hide-ellipsis=\"true\" aria-label=\"Navigation\" change=\"roundChange\">\n                  </b-pagination>\n              </template>\n            </div>\n        </div>\n        <template v-if=\"viewIndex==0\">\n          <allplayers></allplayers>\n        </template>\n        <template v-if=\"viewIndex==6\">\n          <performers></performers>\n        </template>\n        <template v-else-if=\"viewIndex==5\">\n        <scoreboard></scoreboard>\n        </template>\n        <div v-else-if=\"viewIndex==4\" class=\"row d-flex justify-content-center align-items-center\">\n            <div class=\"col-md-10 offset-md-0 col\">\n                <b-tabs content-class=\"mt-3 statsTabs\" pills small lazy no-fade  v-model=\"tabIndex\">\n                    <b-tab title=\"High Wins\" lazy>\n                        <hiwins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiwins>\n                    </b-tab>\n                    <b-tab title=\"High Losses\" lazy>\n                        <hiloss :resultdata=\"resultdata\" :caption=\"caption\">\n                        </hiloss>\n                    </b-tab>\n                    <b-tab title=\"Low Wins\" lazy>\n                        <lowins  :resultdata=\"resultdata\" :caption=\"caption\">\n                        </lowins>\n                    </b-tab>\n                    <b-tab title=\"Combined Scores\">\n                        <comboscores :resultdata=\"resultdata\" :caption=\"caption\">\n                        </comboscores>\n                    </b-tab>\n                    <b-tab title=\"Total Scores\">\n                        <totalscores :caption=\"caption\" :stats=\"fetchStats('total_score')\"></totalscores>\n                    </b-tab>\n                    <b-tab title=\"Total Opp Scores\">\n                        <oppscores :caption=\"caption\" :stats=\"fetchStats('total_oppscore')\"></oppscores>\n                    </b-tab>\n                    <b-tab title=\"Ave Scores\">\n                        <avescores :caption=\"caption\" :stats=\"fetchStats('ave_score')\"></avescores>\n                    </b-tab>\n                    <b-tab title=\"Ave Opp Scores\">\n                        <aveoppscores :caption=\"caption\" :stats=\"fetchStats('ave_oppscore')\"></aveoppscores>\n                    </b-tab>\n                    <b-tab title=\"High Spreads \" lazy>\n                        <hispread :resultdata=\"resultdata\" :caption=\"caption\"></hispread>\n                    </b-tab>\n                    <b-tab title=\"Low Spreads\" lazy>\n                        <lospread :resultdata=\"resultdata\" :caption=\"caption\"></lospread>\n                    </b-tab>\n\n                </b-tabs>\n            </div>\n        </div>\n        <div v-else class=\"row justify-content-center align-items-center\">\n            <div class=\"col-md-8 offset-md-2 col-12\">\n                <pairings v-if=\"viewIndex==1\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></pairings>\n                <results v-if=\"viewIndex==2\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></results>\n                <standings v-if=\"viewIndex==3\" :currentRound=\"currentRound\" :resultdata=\"resultdata\" :caption=\"caption\"></standings>\n          </div>\n        </div>\n    </template>\n</div>\n",
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
      // parent_slug: this.$route.params.slug,
      slug: this.$route.params.event_slug,
      path: this.$route.path,
      // gameid: this.$route.query.id,
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
        console.log('*****viewIndex****');
        console.log(val);

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
        text: this.category,
        active: true
      }];
    },
    error_msg: function error_msg() {
      return "We are currently experiencing network issues fetching this page ".concat(this.path, " ");
    }
  })
}); // export default CateDetail;

exports["default"] = CateDetail;

},{"./alerts.js":8,"./playerlist.js":12,"./scoreboard.js":13,"./stats.js":14,"./top.js":15,"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],10:[function(require,module,exports){
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
  created: function created() {},
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
  template: "\n  <div class=\"row justify-content-center align-items-center\" id=\"players-list\">\n    <template v-if=\"showStats\">\n        <playerstats :pstats=\"pStats\"></playerstats>\n    </template>\n    <template v-else>\n    <div class=\"playerCols col-lg-2 col-sm-6 col-12 p-4 \" v-for=\"player in players\" :key=\"player.id\" >\n            <h4 class=\"mx-auto\"><b-badge>{{player.tou_no}}</b-badge>\n            {{player.post_title }}\n            <span class=\"d-block mx-auto\"  style=\"font-size:small\">\n            <i class=\"mx-auto flag-icon\" :class=\"'flag-icon-'+player.country | lowercase\" :title=\"player.country_full\"></i>\n            <i class=\"ml-2 fa\" :class=\"{'fa-male': player.gender == 'm',\n        'fa-female': player.gender == 'f',\n        'fa-users': player.is_team == 'yes' }\"\n                    aria-hidden=\"true\"></i>\n             </span>\n            </h4>\n            <div class=\"mx-auto text-center animated fadeIn\">\n              <b-img-lazy v-bind=\"imgProps\" :alt=\"player.post_title\" :src=\"player.photo\" :id=\"'popover-'+player.id\"></b-img-lazy>\n              <span class=\"d-block mx-auto\">\n              <span @click=\"showPlayerStats(player.id)\" title=\"Show player's stats\"><i class=\"fas fa-chart-bar\" aria-hidden=\"true\"></i></span>\n              </span>\n              <b-popover @show=\"getLastGames(player.tou_no)\" placement=\"bottom\"  :target=\"'popover-'+player.id\" triggers=\"hover\" boundary-padding=\"5\">\n              <div class=\"d-flex flex-row justify-content-center\">\n                <div class=\"d-flex flex-column flex-wrap align-content-between align-items-start mr-2 justify-content-around\">\n                  <span class=\"flex-grow-1 align-self-center\" style=\"font-size:1.5em;\">{{mstat.position}}</span>\n                  <span class=\"flex-shrink-1 d-inline-block text-muted\"><small>{{mstat.wins}}-{{mstat.draws}}-{{mstat.losses}}</small></span>\n                </div>\n                <div class=\"d-flex flex-column flex-wrap align-content-center\">\n                <span class=\"text-primary d-inline-block\" style=\"font-size:0.8em; text-decoration:underline\">Last Game: Round {{mstat.round}}</span>\n                    <span class=\"d-inline-block p-1 text-white sdata-res text-center\"\n                      v-bind:class=\"{'bg-warning': mstat.result === 'draw',\n                          'bg-info': mstat.result === 'awaiting',\n                          'bg-danger': mstat.result === 'loss',\n                          'bg-success': mstat.result === 'win' }\">\n                          {{mstat.score}}-{{mstat.oppo_score}} ({{mstat.result|firstchar}})\n                    </span>\n                    <div>\n                    <img :src=\"mstat.opp_photo\" :alt=\"mstat.oppo\" class=\"rounded-circle m-auto d-inline-block\" width=\"25\" height=\"25\">\n                    <span class=\"text-info d-inline-block\" style=\"font-size:0.9em\"><small>#{{mstat.oppo_no}} {{mstat.oppo|abbrv}}</small></span>\n                    </div>\n                </div>\n              </div>\n              </b-popover>\n          </div>\n       </div>\n      </template>\n    </div>\n    ",
  components: {
    playerstats: PlayerStats
  },
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
      mstat: {}
    };
  },
  mounted: function mounted() {
    var resultdata = this.result_data; //let initialRdData = _.initial(_.clone(resultdata));

    this.dataFlat = _.flattenDeep(_.clone(resultdata));
  },
  methods: {
    getLastGames: function getLastGames(tou_no) {
      console.log(tou_no);

      var c = _.clone(this.dataFlat); // let p = _.clone(this.players);
      // console.log(p)


      var res = _.chain(c).filter(function (v) {
        return v.pno === tou_no;
      }).takeRight().value();

      this.mstat = _.first(res);
      console.log(this.mstat);
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
  template: "\n    <b-table hover responsive striped foot-clone :fields=\"results_fields\" :items=\"result(currentRound)\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n    </b-table>\n    ",
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
  template: "\n    <b-table responsive hover striped foot-clone :items=\"result(currentRound)\" :fields=\"standings_fields\" head-variant=\"dark\" class=\"animated fadeInUp\">\n        <template slot=\"table-caption\">\n            {{caption}}\n        </template>\n        <template>\n            <template slot=\"rank\" slot-scope=\"data\">\n            {{data.value.rank}}\n            </template>\n            <template slot=\"player\" slot-scope=\"data\">\n            {{data.value.player}}\n            </template>\n            <template slot=\"wonLost\"></template>\n            <template slot=\"margin\" slot-scope=\"data\">\n            {{data.value.margin}}\n            </template>\n            <template slot=\"lastGame\">\n            </template>\n        </template>\n    </b-table>\n   ",
  props: ['caption', 'currentRound', 'resultdata'],
  data: function data() {
    return {
      standings_fields: []
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
  template: "\n<table class=\"table table-hover table-responsive table-striped  animated fadeInUp\">\n    <caption>{{caption}}</caption>\n    <thead class=\"thead-dark\">\n        <tr>\n        <th scope=\"col\">#</th>\n        <th scope=\"col\">Player</th>\n        <th scope=\"col\">Opponent</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr v-for=\"(player,i) in pairing(currentRound)\" :key=\"i\">\n        <th scope=\"row\">{{i + 1}}</th>\n        <td><sup v-if=\"player.start =='y'\">*</sup>{{player.player}}</td>\n        <td><sup v-if=\"player.start =='n'\">*</sup>{{player.oppo}}</td>\n        </tr>\n    </tbody>\n  </table>\n",
  props: ['caption', 'currentRound', 'resultdata'],
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
    this.totalscore_fields = ['index', {
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
    this.totaloppscore_fields = ['index', {
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
    this.avescore_fields = ['index', {
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
    this.aveoppscore_fields = ['index', {
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

},{}],15:[function(require,module,exports){
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
  template: "\n  <div class=\"col-lg-10 offset-lg-1 justify-content-center\">\n    <div class=\"row\">\n      <div class=\"col-lg-2 col-sm-4 col-12\">\n        <div class=\"mt-5 d-flex flex-column align-content-center align-items-center justify-content-center\">\n          <b-button variant=\"btn-outline-success\" title=\"Top 3\" class=\"m-2 btn-block\" @click=\"showPic('top3')\" :pressed=\"currentView=='top3'\">\n            <i class=\"fas fa-trophy m-1\" aria-hidden=\"true\"></i>Top 3</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Game Scores\" class=\"m-2 btn-block\" @click=\"showPic('higames')\" :pressed=\"currentView=='higames'\">\n            <i class=\"fas fa-bullseye m-1\" aria-hidden=\"true\"></i>High Games</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Highest Average Scores\" class=\"m-2 btn-block\" :pressed=\"currentView=='hiaves'\"\n            @click=\"showPic('hiaves')\">\n            <i class=\"fas fa-thumbs-up m-1\" aria-hidden=\"true\"></i>High Ave. Scores</b-button>\n          <b-button variant=\"btn-outline-success\" title=\"Lowest Average Opponent Scores\" class=\"m-2 btn-block\" @click=\"showPic('looppaves')\" :pressed=\"currentView=='looppaves'\">\n            <i class=\"fas fa-beer mr-1\" aria-hidden=\"true\"></i>Low Opp Ave</b-button>\n        </div>\n      </div>\n      <div class=\"col-lg-10 col-sm-8 col-12\">\n        <div class=\"row\">\n          <div class=\"col-12 justify-content-center align-content-center\">\n            <h3>{{title}}</h3>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col-sm-4 col-12 animated fadeInRightBig\" v-for=\"(item, index) in stats\">\n            <h4 class=\"p-2 text-center bebas bg-dark text-white\">{{item.player}}</h4>\n            <div class=\"d-flex flex-column justify-content-center align-items-center\">\n              <img :src=\"players[item.pno-1].photo\" width='120' height='120' class=\"img-fluid rounded-circle\"\n                :alt=\"players[item.pno-1].post_title|lowercase\">\n              <span class=\"d-block ml-5\">\n                <i class=\"mx-1 flag-icon\" :class=\"'flag-icon-'+players[item.pno-1].country | lowercase\"\n                  :title=\"players[item.pno-1].country_full\"></i>\n                <i class=\"mx-1 fa\"\n                  :class=\"{'fa-male': players[item.pno-1].gender == 'm', 'fa-female': players[item.pno-1].gender == 'f'}\"\n                  aria-hidden=\"true\">\n                </i>\n              </span>\n            </div>\n            <div class=\"d-flex flex-row justify-content-center align-content-center bg-dark text-white\">\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.points\">{{item.points}}</span>\n              <span class=\"mx-1 display-5 d-inline-block align-self-center\" v-if=\"item.margin\">{{item.margin|addplus}}</span>\n              <span class=\"mx-1 text-center display-5 d-inline-block align-self-center\" v-if=\"item.score\">Round {{item.round}} vs {{item.oppo}}</span>\n            </div>\n            <div class=\"d-flex justify-content-center align-items-center bg-success text-white\">\n              <div v-if=\"item.score\" class=\"display-4 yanone d-inline-flex\">{{item.score}}</div>\n              <div v-if=\"item.position\" class=\"display-4 yanone d-inline-flex\">{{item.position}}</div>\n              <div v-if=\"item.ave_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_score}}</div>\n              <div v-if=\"item.ave_opp_score\" class=\"display-4 yanone d-inline-flex\">{{item.ave_opp_score}}</div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  ",
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

},{"@babel/runtime/helpers/defineProperty":2,"@babel/runtime/helpers/interopRequireDefault":3}],16:[function(require,module,exports){
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
          var idx = o.oppo_no - 1;
          o.opp_photo = p[idx].photo;
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
                category = data.event_category[0].name;
                logo = data.tourney[0].event_logo.guid;
                tourney_title = data.tourney[0].post_title; // console.log(data.tourney[0]);

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
                _context3.next = 33;
                break;

              case 29:
                _context3.prev = 29;
                _context3.t0 = _context3["catch"](2);
                context.commit('SET_ERROR', _context3.t0.toString());
                context.commit('SET_LOADING', false);

              case 33:
                ;

              case 34:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 29]]);
      }))();
    }
  }
}); // export default store;

exports["default"] = store;

},{"./config.js":6,"@babel/runtime/helpers/asyncToGenerator":1,"@babel/runtime/helpers/interopRequireDefault":3,"@babel/runtime/regenerator":4}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9hc3luY1RvR2VuZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanMiLCJub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLmpzIiwidnVlL2NvbmZpZy5qcyIsInZ1ZS9tYWluLmpzIiwidnVlL3BhZ2VzL2FsZXJ0cy5qcyIsInZ1ZS9wYWdlcy9jYXRlZ29yeS5qcyIsInZ1ZS9wYWdlcy9kZXRhaWwuanMiLCJ2dWUvcGFnZXMvbGlzdC5qcyIsInZ1ZS9wYWdlcy9wbGF5ZXJsaXN0LmpzIiwidnVlL3BhZ2VzL3Njb3JlYm9hcmQuanMiLCJ2dWUvcGFnZXMvc3RhdHMuanMiLCJ2dWUvcGFnZXMvdG9wLmpzIiwidnVlL3N0b3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUE7QUFBQTtBQUFBO0FBaUNuQztBQXhGTTtBQXJTa0IsQ0FBZixDQUFkLEMsQ0FpWUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJmdW5jdGlvbiBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIGtleSwgYXJnKSB7XG4gIHRyeSB7XG4gICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVqZWN0KGVycm9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW5mby5kb25lKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKF9uZXh0LCBfdGhyb3cpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9hc3luY1RvR2VuZXJhdG9yKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgZ2VuID0gZm4uYXBwbHkoc2VsZiwgYXJncyk7XG5cbiAgICAgIGZ1bmN0aW9uIF9uZXh0KHZhbHVlKSB7XG4gICAgICAgIGFzeW5jR2VuZXJhdG9yU3RlcChnZW4sIHJlc29sdmUsIHJlamVjdCwgX25leHQsIF90aHJvdywgXCJuZXh0XCIsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gX3Rocm93KGVycikge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwidGhyb3dcIiwgZXJyKTtcbiAgICAgIH1cblxuICAgICAgX25leHQodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfYXN5bmNUb0dlbmVyYXRvcjsiLCJmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmpba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBfZGVmaW5lUHJvcGVydHk7IiwiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iLCJjb25zdCBiYXNlVVJMID0gJy93cC1qc29uL3dwL3YyLyc7XHJcbmV4cG9ydCB7YmFzZVVSTCBhcyBkZWZhdWx0fVxyXG5cclxuIiwiaW1wb3J0IHN0b3JlIGZyb20gJy4vc3RvcmUuanMnO1xyXG5pbXBvcnQgc2NyTGlzdCBmcm9tICcuL3BhZ2VzL2xpc3QuanMnO1xyXG5pbXBvcnQgdERldGFpbCBmcm9tICcuL3BhZ2VzL2RldGFpbC5qcyc7XHJcbmltcG9ydCBDYXRlRGV0YWlsIGZyb20gJy4vcGFnZXMvY2F0ZWdvcnkuanMnO1xyXG5cclxuVnVlLmZpbHRlcignYWJicnYnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICBpZiAoIXZhbHVlKSByZXR1cm4gJyc7XHJcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gIHZhciBmaXJzdCA9IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIHZhciBuID0gdmFsdWUudHJpbSgpLnNwbGl0KFwiIFwiKTtcclxuICB2YXIgbGFzdCA9IG5bbi5sZW5ndGggLSAxXTtcclxuICByZXR1cm4gZmlyc3QgKyBcIi4gXCIgKyBsYXN0O1xyXG59KTtcclxuXHJcblZ1ZS5maWx0ZXIoJ2ZpcnN0Y2hhcicsIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgaWYgKCF2YWx1ZSkgcmV0dXJuICcnO1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pO1xyXG5cclxuICBWdWUuZmlsdGVyKCdsb3dlcmNhc2UnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKVxyXG4gIH0pXHJcblxyXG4gIFZ1ZS5maWx0ZXIoJ2FkZHBsdXMnLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIGlmICghdmFsdWUpIHJldHVybiAnJ1xyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXHJcbiAgICB2YXIgbiA9IE1hdGguZmxvb3IoTnVtYmVyKHZhbHVlKSlcclxuICAgIGlmIChuICE9PSBJbmZpbml0eSAmJiBTdHJpbmcobikgPT09IHZhbHVlICYmIG4gPiAwKSB7XHJcbiAgICAgIHJldHVybiAnKycgKyB2YWx1ZVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlXHJcbiAgfSlcclxuXHJcbiAgVnVlLmZpbHRlcigncHJldHR5JywgZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZSh2YWx1ZSksIG51bGwsIDIpXHJcbiAgfSlcclxuXHJcbiAgY29uc3Qgcm91dGVzID0gW1xyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgIGNvbXBvbmVudDogc2NyTGlzdCxcclxuICAgICAgbWV0YTogeyB0aXRsZTogJ05TRiBUb3VybmFtZW50cyAtIFJlc3VsdHMgYW5kIFN0YXRpc3RpY3MnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnRzLzpzbHVnJyxcclxuICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICBjb21wb25lbnQ6IHREZXRhaWwsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdUb3VybmFtZW50IERldGFpbHMnIH0sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RvdXJuYW1lbnQvOmV2ZW50X3NsdWcnLFxyXG4gICAgICBuYW1lOiAnQ2F0ZURldGFpbCcsXHJcbiAgICAgIGNvbXBvbmVudDogQ2F0ZURldGFpbCxcclxuICAgICAgcHJvcHM6IHRydWUsXHJcbiAgICAgIG1ldGE6IHsgdGl0bGU6ICdSZXN1bHRzIGFuZCBTdGF0aXN0aWNzJyB9LFxyXG4gICAgfSxcclxuICAgIC8vIHtcclxuICAgIC8vICAgcGF0aDogJy90b3VybmV5cy86ZXZlbnRfc2x1Zy9ib2FyZCcsXHJcbiAgICAvLyAgIG5hbWU6ICdTY29yZWJvYXJkJyxcclxuICAgIC8vICAgY29tcG9uZW50OiBTY29yZWJvYXJkLFxyXG4gICAgLy8gICBwcm9wczogdHJ1ZSxcclxuICAgIC8vICAgbWV0YTogeyB0aXRsZTogJ1Njb3JlYm9hcmQnIH0sXHJcbiAgICAvLyB9LFxyXG4gIF07XHJcblxyXG5jb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHtcclxuICBtb2RlOiAnaGlzdG9yeScsXHJcbiAgcm91dGVzOiByb3V0ZXMsIC8vIHNob3J0IGZvciBgcm91dGVzOiByb3V0ZXNgXHJcbn0pO1xyXG5yb3V0ZXIuYmVmb3JlRWFjaCgodG8sIGZyb20sIG5leHQpID0+IHtcclxuICBkb2N1bWVudC50aXRsZSA9IHRvLm1ldGEudGl0bGU7XHJcbiAgbmV4dCgpO1xyXG59KTtcclxuXHJcbm5ldyBWdWUoe1xyXG4gIGVsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYXBwJyksXHJcbiAgcm91dGVyLFxyXG4gIHN0b3JlXHJcbn0pXHJcblxyXG5cclxuIiwidmFyIExvYWRpbmdBbGVydCA9IFZ1ZS5jb21wb25lbnQoJ2xvYWRpbmcnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cIm14LWF1dG8gbXQtNSBkLWJsb2NrIG1heC12dy03NVwiPlxyXG4gICAgICAgIDxoNCBjbGFzcz1cImRpc3BsYXktNCBiZWJhcyB0ZXh0LWNlbnRlciB0ZXh0LXNlY29uZGFyeVwiPkxvYWRpbmcuLlxyXG4gICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtcHVsc2VcIj48L2k+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCI+TG9hZGluZy4uPC9zcGFuPjwvaDQ+XHJcbiAgICA8L2Rpdj5gXHJcbiB9KTtcclxuXHJcbnZhciBFcnJvckFsZXJ0ID1WdWUuY29tcG9uZW50KCdlcnJvcicsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlciBtdC01IG14LWF1dG8gZC1ibG9jayBtYXgtdnctNzVcIiByb2xlPVwiYWxlcnRcIj5cclxuICAgICAgICAgIDxoNCBjbGFzcz1cImFsZXJ0LWhlYWRpbmcgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxzbG90IG5hbWU9XCJlcnJvclwiPjwvc2xvdD5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkVycm9yLi4uPC9zcGFuPlxyXG4gICAgICAgICAgPC9oND5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC1hdXRvIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8c2xvdCBuYW1lPVwiZXJyb3JfbXNnXCI+PC9zbG90PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PmAsXHJcbiAgIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgIHJldHVybiB7fTtcclxuICAgfSxcclxuIH0pO1xyXG5cclxuZXhwb3J0IHsgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0fVxyXG5cclxuIiwiaW1wb3J0IHsgUGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c30gZnJvbSAnLi9wbGF5ZXJsaXN0LmpzJztcclxuaW1wb3J0IHtMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnR9IGZyb20gJy4vYWxlcnRzLmpzJztcclxuaW1wb3J0IHsgSGlXaW5zLCBMb1dpbnMsIEhpTG9zcywgQ29tYm9TY29yZXMsIFRvdGFsU2NvcmVzLCBUb3RhbE9wcFNjb3JlcywgQXZlU2NvcmVzLCBBdmVPcHBTY29yZXMsIEhpU3ByZWFkLCBMb1NwcmVhZCB9IGZyb20gJy4vc3RhdHMuanMnO1xyXG5pbXBvcnQgU2NvcmVib2FyZCBmcm9tICcuL3Njb3JlYm9hcmQuanMnO1xyXG5pbXBvcnQgdG9wUGVyZm9ybWVycyBmcm9tICcuL3RvcC5qcyc7XHJcbmV4cG9ydCB7Q2F0ZURldGFpbCBhcyBkZWZhdWx0fVxyXG5sZXQgQ2F0ZURldGFpbCA9IFZ1ZS5jb21wb25lbnQoJ2NhdGUnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgIDxkaXYgdi1pZj1cInJlc3VsdGRhdGFcIiBjbGFzcz1cInJvdyBuby1ndXR0ZXJzIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtdG9wXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMlwiPlxyXG4gICAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbCBhbGlnbi1zZWxmLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8bG9hZGluZz48L2xvYWRpbmc+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxlcnJvcj5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgPC9lcnJvcj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCIhKGVycm9yfHxsb2FkaW5nKVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0xMiBkLWZsZXhcIj5cclxuICAgICAgICAgICAgICA8Yi1pbWcgY2xhc3M9XCJ0aHVtYm5haWwgbG9nbyBtbC1hdXRvXCIgOnNyYz1cImxvZ29cIiA6YWx0PVwiZXZlbnRfdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICAgIDxoMiBjbGFzcz1cInRleHQtbGVmdCBiZWJhc1wiPnt7IGV2ZW50X3RpdGxlIH19XHJcbiAgICAgICAgICAgICAgPHNwYW4gOnRpdGxlPVwidG90YWxfcm91bmRzKyAnIHJvdW5kcywgJyArIHRvdGFsX3BsYXllcnMgKycgcGxheWVycydcIiB2LXNob3c9XCJ0b3RhbF9yb3VuZHNcIiBjbGFzcz1cInRleHQtY2VudGVyIGQtYmxvY2tcIj57eyB0b3RhbF9yb3VuZHMgfX0gR2FtZXMgICB7eyB0b3RhbF9wbGF5ZXJzfX0gPGkgY2xhc3M9XCJmYXMgZmEtdXNlcnNcIj48L2k+IDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9MFwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09MFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT0wXCI+PGkgY2xhc3M9XCJmYSBmYS11c2Vyc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUGxheWVyczwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTFcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTFcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09MVwiPiA8aSBjbGFzcz1cImZhIGZhLXVzZXItcGx1c1wiPjwvaT4gUGFpcmluZ3M8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInZpZXdJbmRleD0yXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgOmRpc2FibGVkPVwidmlld0luZGV4PT0yXCIgOnByZXNzZWQ9XCJ2aWV3SW5kZXg9PTJcIj48aSBjbGFzcz1cImZhcyBmYS1zdGlja3ktbm90ZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUmVzdWx0czwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gQGNsaWNrPVwidmlld0luZGV4PTNcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTNcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09M1wiPjxpIGNsYXNzPVwiZmFzIGZhLXNvcnQtbnVtZXJpYy1kb3duICAgIFwiPjwvaT4gU3RhbmRpbmdzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ2aWV3SW5kZXg9NFwiIHZhcmlhbnQ9XCJsaW5rXCIgY2xhc3M9XCJ0ZXh0LWRlY29yYXRpb24tbm9uZVwiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NFwiIDpwcmVzc2VkPVwidmlld0luZGV4PT00XCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhcnQtcGllXCI+PC9pPiBTdGF0aXN0aWNzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiAgQGNsaWNrPVwidmlld0luZGV4PTVcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmVcIiBhY3RpdmUtY2xhc3M9XCJjdXJyZW50Vmlld1wiIDpkaXNhYmxlZD1cInZpZXdJbmRleD09NVwiIDpwcmVzc2VkPVwidmlld0luZGV4PT01XCI+PGkgY2xhc3M9XCJmYXMgZmEtY2hhbGtib2FyZC10ZWFjaGVyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgU2NvcmVib2FyZDwvYi1idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8Yi1idXR0b24gIEBjbGljaz1cInZpZXdJbmRleD02XCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lXCIgYWN0aXZlLWNsYXNzPVwiY3VycmVudFZpZXdcIiA6ZGlzYWJsZWQ9XCJ2aWV3SW5kZXg9PTZcIiA6cHJlc3NlZD1cInZpZXdJbmRleD09NlwiPjxpIGNsYXNzPVwiZmFzIGZhLW1lZGFsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgVG9wIFBlcmZvcm1lcnM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMSBjb2wtMTIgZC1mbGV4IGZsZXgtY29sdW1uXCI+XHJcbiAgICAgICAgICAgICAgPGgzIGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXMgcC0wIG0tMFwiPiB7e3RhYl9oZWFkaW5nfX1cclxuICAgICAgICAgICAgICA8c3BhbiB2LWlmPVwidmlld0luZGV4ID4wICYmIHZpZXdJbmRleCA8IDRcIj5cclxuICAgICAgICAgICAgICB7eyBjdXJyZW50Um91bmQgfX1cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1pZj1cInNob3dQYWdpbmF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cInRvdGFsX3JvdW5kc1wiIHYtbW9kZWw9XCJjdXJyZW50Um91bmRcIiA6cGVyLXBhZ2U9XCIxXCJcclxuICAgICAgICAgICAgICAgICAgICAgIDpoaWRlLWVsbGlwc2lzPVwidHJ1ZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgY2hhbmdlPVwicm91bmRDaGFuZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgPC9iLXBhZ2luYXRpb24+XHJcbiAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJ2aWV3SW5kZXg9PTBcIj5cclxuICAgICAgICAgIDxhbGxwbGF5ZXJzPjwvYWxscGxheWVycz5cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSB2LWlmPVwidmlld0luZGV4PT02XCI+XHJcbiAgICAgICAgICA8cGVyZm9ybWVycz48L3BlcmZvcm1lcnM+XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgdi1lbHNlLWlmPVwidmlld0luZGV4PT01XCI+XHJcbiAgICAgICAgPHNjb3JlYm9hcmQ+PC9zY29yZWJvYXJkPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UtaWY9XCJ2aWV3SW5kZXg9PTRcIiBjbGFzcz1cInJvdyBkLWZsZXgganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xMCBvZmZzZXQtbWQtMCBjb2xcIj5cclxuICAgICAgICAgICAgICAgIDxiLXRhYnMgY29udGVudC1jbGFzcz1cIm10LTMgc3RhdHNUYWJzXCIgcGlsbHMgc21hbGwgbGF6eSBuby1mYWRlICB2LW1vZGVsPVwidGFiSW5kZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGl3aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oaXdpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJIaWdoIExvc3Nlc1wiIGxhenk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoaWxvc3MgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGlsb3NzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiTG93IFdpbnNcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bG93aW5zICA6cmVzdWx0ZGF0YT1cInJlc3VsdGRhdGFcIiA6Y2FwdGlvbj1cImNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sb3dpbnM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJDb21iaW5lZCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGNvbWJvc2NvcmVzIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2NvbWJvc2NvcmVzPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvYi10YWI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGItdGFiIHRpdGxlPVwiVG90YWwgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0b3RhbHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9zY29yZScpXCI+PC90b3RhbHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIlRvdGFsIE9wcCBTY29yZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wcHNjb3JlcyA6Y2FwdGlvbj1cImNhcHRpb25cIiA6c3RhdHM9XCJmZXRjaFN0YXRzKCd0b3RhbF9vcHBzY29yZScpXCI+PC9vcHBzY29yZXM+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuICAgICAgICAgICAgICAgICAgICA8Yi10YWIgdGl0bGU9XCJBdmUgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX3Njb3JlJylcIj48L2F2ZXNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkF2ZSBPcHAgU2NvcmVzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxhdmVvcHBzY29yZXMgOmNhcHRpb249XCJjYXB0aW9uXCIgOnN0YXRzPVwiZmV0Y2hTdGF0cygnYXZlX29wcHNjb3JlJylcIj48L2F2ZW9wcHNjb3Jlcz5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkhpZ2ggU3ByZWFkcyBcIiBsYXp5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGlzcHJlYWQgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9oaXNwcmVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8L2ItdGFiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiLXRhYiB0aXRsZT1cIkxvdyBTcHJlYWRzXCIgbGF6eT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxvc3ByZWFkIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvbG9zcHJlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9iLXRhYj5cclxuXHJcbiAgICAgICAgICAgICAgICA8L2ItdGFicz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiB2LWVsc2UgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC04IG9mZnNldC1tZC0yIGNvbC0xMlwiPlxyXG4gICAgICAgICAgICAgICAgPHBhaXJpbmdzIHYtaWY9XCJ2aWV3SW5kZXg9PTFcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9wYWlyaW5ncz5cclxuICAgICAgICAgICAgICAgIDxyZXN1bHRzIHYtaWY9XCJ2aWV3SW5kZXg9PTJcIiA6Y3VycmVudFJvdW5kPVwiY3VycmVudFJvdW5kXCIgOnJlc3VsdGRhdGE9XCJyZXN1bHRkYXRhXCIgOmNhcHRpb249XCJjYXB0aW9uXCI+PC9yZXN1bHRzPlxyXG4gICAgICAgICAgICAgICAgPHN0YW5kaW5ncyB2LWlmPVwidmlld0luZGV4PT0zXCIgOmN1cnJlbnRSb3VuZD1cImN1cnJlbnRSb3VuZFwiIDpyZXN1bHRkYXRhPVwicmVzdWx0ZGF0YVwiIDpjYXB0aW9uPVwiY2FwdGlvblwiPjwvc3RhbmRpbmdzPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L3RlbXBsYXRlPlxyXG48L2Rpdj5cclxuYCxcclxuICBjb21wb25lbnRzOiB7XHJcbiAgICBsb2FkaW5nOiBMb2FkaW5nQWxlcnQsXHJcbiAgICBlcnJvcjogRXJyb3JBbGVydCxcclxuICAgIGFsbHBsYXllcnM6IFBsYXllckxpc3QsXHJcbiAgICBwYWlyaW5nczogUGFpcmluZ3MsXHJcbiAgICByZXN1bHRzOiBSZXN1bHRzLFxyXG4gICAgc3RhbmRpbmdzOiBTdGFuZGluZ3MsXHJcbiAgICBoaXdpbnM6IEhpV2lucyxcclxuICAgIGhpbG9zczogSGlMb3NzLFxyXG4gICAgbG93aW46IExvV2lucyxcclxuICAgIGNvbWJvc2NvcmVzOiBDb21ib1Njb3JlcyxcclxuICAgIHRvdGFsc2NvcmVzOiBUb3RhbFNjb3JlcyxcclxuICAgIG9wcHNjb3JlczogVG90YWxPcHBTY29yZXMsXHJcbiAgICBhdmVzY29yZXM6IEF2ZVNjb3JlcyxcclxuICAgIGF2ZW9wcHNjb3JlczogQXZlT3BwU2NvcmVzLFxyXG4gICAgaGlzcHJlYWQ6IEhpU3ByZWFkLFxyXG4gICAgbG9zcHJlYWQ6IExvU3ByZWFkLFxyXG4gICAgLy8gJ2x1Y2t5c3RpZmYtdGFibGUnOiBMdWNreVN0aWZmVGFibGUsXHJcbiAgICAvLyAndHVmZmx1Y2stdGFibGUnOiBUdWZmTHVja1RhYmxlXHJcbiAgICBzY29yZWJvYXJkOiBTY29yZWJvYXJkLFxyXG4gICAgcGVyZm9ybWVyczogdG9wUGVyZm9ybWVycyxcclxuICB9LFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgLy8gcGFyZW50X3NsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBzbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuZXZlbnRfc2x1ZyxcclxuICAgICAgcGF0aDogdGhpcy4kcm91dGUucGF0aCxcclxuICAgICAgLy8gZ2FtZWlkOiB0aGlzLiRyb3V0ZS5xdWVyeS5pZCxcclxuICAgICAgdG91cm5leV9zbHVnOiAnJyxcclxuICAgICAgaXNBY3RpdmU6IGZhbHNlLFxyXG4gICAgICBnYW1lZGF0YTogW10sXHJcbiAgICAgIHRhYkluZGV4OiAwLFxyXG4gICAgICB2aWV3SW5kZXg6IDAsXHJcbiAgICAgIGN1cnJlbnRSb3VuZDogMSxcclxuICAgICAgdGFiX2hlYWRpbmc6ICcnLFxyXG4gICAgICBjYXB0aW9uOiAnJyxcclxuICAgICAgc2hvd1BhZ2luYXRpb246IGZhbHNlLFxyXG4gICAgICBsdWNreXN0aWZmOiBbXSxcclxuICAgICAgdHVmZmx1Y2s6IFtdLFxyXG4gICAgICB0aW1lcjogJycsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnQ2F0ZWdvcnkgbW91bnRlZCcpO1xyXG4gICAgdmFyIHAgPSB0aGlzLnNsdWcuc3BsaXQoJy0nKTtcclxuICAgIHAuc2hpZnQoKTtcclxuICAgIHRoaXMudG91cm5leV9zbHVnID0gcC5qb2luKCctJyk7XHJcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xyXG4gIH0sXHJcblxyXG4gIHdhdGNoOiB7XHJcbiAgICB2aWV3SW5kZXg6IHtcclxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24odmFsLCBvbGRWYWwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnKioqKip2aWV3SW5kZXgqKioqJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsKTtcclxuICAgICAgICBpZiAodmFsICE9IDQpIHtcclxuICAgICAgICAgIHRoaXMuZ2V0Vmlldyh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJlZm9yZVVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aGlzLmV2ZW50X3RpdGxlO1xyXG4gICAgaWYgKHRoaXMudmlld0luZGV4ID09IDQpIHtcclxuICAgICAgdGhpcy5nZXRUYWJzKHRoaXMudGFiSW5kZXgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RBVEEnLCB0aGlzLnNsdWcpO1xyXG4gICAgfSxcclxuICAgIGdldFZpZXc6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmFuIGdldFZpZXcgZnVuY3Rpb24gdmFsLT4gJyArIHZhbCk7XHJcbiAgICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdQbGF5ZXJzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1BhaXJpbmcgUm91bmQgLSAnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJypQbGF5cyBmaXJzdCc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnUmVzdWx0cyBSb3VuZCAtICc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnUmVzdWx0cyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnU3RhbmRpbmdzIGFmdGVyIFJvdW5kIC0gJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdTdGFuZGluZ3MnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICBnZXRUYWJzOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1JhbiBnZXRUYWJzIGZ1bmN0aW9uLT4gJyArIHZhbCk7XHJcbiAgICAgIHN3aXRjaCAodmFsKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdIaWdoIFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoIFdpbm5pbmcgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaCBMb3NpbmcgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoIExvc2luZyBTY29yZXMnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMb3cgV2lubmluZyBTY29yZXMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0xvdyBXaW5uaW5nIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0hpZ2hlc3QgQ29tYmluZWQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoZXN0IENvbWJpbmVkIFNjb3JlIHBlciByb3VuZCc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ1RvdGFsIFNjb3Jlcyc7XHJcbiAgICAgICAgICB0aGlzLmNhcHRpb24gPSAnVG90YWwgUGxheWVyIFNjb3JlcyBTdGF0aXN0aWNzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVG90YWwgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUb3RhbCBPcHBvbmVudCBTY29yZXMgU3RhdGlzdGljcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0F2ZXJhZ2UgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYW5raW5nIGJ5IEF2ZXJhZ2UgUGxheWVyIFNjb3Jlcyc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDc6XHJcbiAgICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnRhYl9oZWFkaW5nID0gJ0F2ZXJhZ2UgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdSYW5raW5nIGJ5IEF2ZXJhZ2UgT3Bwb25lbnQgU2NvcmVzJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgODpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnSGlnaCBTcHJlYWRzJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdIaWdoZXN0IFNwcmVhZCBwZXIgcm91bmQgJztcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgOTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnTG93IFNwcmVhZHMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0xvd2VzdCBTcHJlYWRzIHBlciByb3VuZCc7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDEwOlxyXG4gICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy50YWJfaGVhZGluZyA9ICdMdWNreSBTdGlmZnMnO1xyXG4gICAgICAgICAgdGhpcy5jYXB0aW9uID0gJ0x1Y2t5IFN0aWZmcyAoZnJlcXVlbnQgbG93IG1hcmdpbi9zcHJlYWQgd2lubmVycyknO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxMTpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnVHVmZiBMdWNrJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICdUdWZmIEx1Y2sgKGZyZXF1ZW50IGxvdyBtYXJnaW4vc3ByZWFkIGxvc2VycyknO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHRoaXMuc2hvd1BhZ2luYXRpb24gPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMudGFiX2hlYWRpbmcgPSAnU2VsZWN0IGEgVGFiJztcclxuICAgICAgICAgIHRoaXMuY2FwdGlvbiA9ICcnO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgLy8gcmV0dXJuIHRydWVcclxuICAgIH0sXHJcbiAgICByb3VuZENoYW5nZTogZnVuY3Rpb24ocGFnZSkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhwYWdlKTtcclxuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jdXJyZW50Um91bmQpO1xyXG4gICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IHBhZ2U7XHJcbiAgICB9LFxyXG4gICAgY2FuY2VsQXV0b1VwZGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XHJcbiAgICB9LFxyXG4gICAgZmV0Y2hTdGF0czogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGxldCBsYXN0UmREYXRhID0gdGhpcy5yZXN1bHRkYXRhW3RoaXMudG90YWxfcm91bmRzIC0gMV07XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeShsYXN0UmREYXRhLCBrZXkpLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICB0dWZmbHVja3k6IGZ1bmN0aW9uKHJlc3VsdCA9ICd3aW4nKSB7XHJcbiAgICAgIC8vIG1ldGhvZCBydW5zIGJvdGggbHVja3lzdGlmZiBhbmQgdHVmZmx1Y2sgdGFibGVzXHJcbiAgICAgIGxldCBkYXRhID0gdGhpcy5yZXN1bHRkYXRhOyAvL0pTT04ucGFyc2UodGhpcy5ldmVudF9kYXRhLnJlc3VsdHMpO1xyXG4gICAgICBsZXQgcGxheWVycyA9IF8ubWFwKHRoaXMucGxheWVycywgJ3Bvc3RfdGl0bGUnKTtcclxuICAgICAgbGV0IGxzZGF0YSA9IFtdO1xyXG4gICAgICBsZXQgaGlnaHNpeCA9IF8uY2hhaW4ocGxheWVycylcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgIGxldCByZXMgPSBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obGlzdCkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBfLmNoYWluKGxpc3QpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGRbJ3BsYXllciddID09PSBuICYmIGRbJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mbGF0dGVuRGVlcCgpXHJcbiAgICAgICAgICAgIC5zb3J0QnkoJ2RpZmYnKVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHJlcywgNik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gXy50YWtlUmlnaHQocmVzLCA2KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgcmV0dXJuIG4ubGVuZ3RoID4gNTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgXy5tYXAoaGlnaHNpeCwgZnVuY3Rpb24oaCkge1xyXG4gICAgICAgIGxldCBsYXN0ZGF0YSA9IF8udGFrZVJpZ2h0KGRhdGEpO1xyXG4gICAgICAgIGxldCBkaWZmID0gXy5jaGFpbihoKVxyXG4gICAgICAgICAgLm1hcCgnZGlmZicpXHJcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG4pO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIGxldCBuYW1lID0gaFswXVsncGxheWVyJ107XHJcbiAgICAgICAgbGV0IHN1bSA9IF8ucmVkdWNlKFxyXG4gICAgICAgICAgZGlmZixcclxuICAgICAgICAgIGZ1bmN0aW9uKG1lbW8sIG51bSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWVtbyArIG51bTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICBsZXQgcGxheWVyX2RhdGEgPSBfLmZpbmQobGFzdGRhdGEsIHtcclxuICAgICAgICAgIHBsYXllcjogbmFtZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgbWFyID0gcGxheWVyX2RhdGFbJ21hcmdpbiddO1xyXG4gICAgICAgIGxldCB3b24gPSBwbGF5ZXJfZGF0YVsncG9pbnRzJ107XHJcbiAgICAgICAgbGV0IGxvc3MgPSBwbGF5ZXJfZGF0YVsncm91bmQnXSAtIHdvbjtcclxuICAgICAgICAvLyBwdXNoIHZhbHVlcyBpbnRvIGxzZGF0YSBhcnJheVxyXG4gICAgICAgIGxzZGF0YS5wdXNoKHtcclxuICAgICAgICAgIHBsYXllcjogbmFtZSxcclxuICAgICAgICAgIHNwcmVhZDogZGlmZixcclxuICAgICAgICAgIHN1bV9zcHJlYWQ6IHN1bSxcclxuICAgICAgICAgIGN1bW11bGF0aXZlX3NwcmVhZDogbWFyLFxyXG4gICAgICAgICAgd29uX2xvc3M6IGAke3dvbn0gLSAke2xvc3N9YCxcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLnNvcnRCeShsc2RhdGEsICdzdW1fc3ByZWFkJyk7XHJcbiAgICB9LFxyXG4gICAgdG9OZXh0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBsZXQgeCA9IHRoaXMudG90YWxfcm91bmRzO1xyXG4gICAgICBsZXQgbiA9IHRoaXMuY3VycmVudFJvdW5kICsgMTtcclxuICAgICAgaWYgKG4gPD0geCkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gbjtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvUHJldlJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgbGV0IG4gPSB0aGlzLmN1cnJlbnRSb3VuZCAtIDE7XHJcbiAgICAgIGlmIChuID49IDEpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRSb3VuZCA9IG47XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB0b0ZpcnN0UmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50Um91bmQgIT0gMSkge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gMTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvTGFzdFJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coJyBnb2luZyB0byBsYXN0IHJvdW5kJylcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFJvdW5kICE9IHRoaXMudG90YWxfcm91bmRzKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSB0aGlzLnRvdGFsX3JvdW5kcztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICByZXN1bHRkYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIGV2ZW50X2RhdGE6ICdFVkVOVFNUQVRTJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgY2F0ZWdvcnk6ICdDQVRFR09SWScsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIHBhcmVudF9zbHVnOiAnUEFSRU5UU0xVRycsXHJcbiAgICAgIGV2ZW50X3RpdGxlOiAnRVZFTlRfVElUTEUnLFxyXG4gICAgICB0b3VybmV5X3RpdGxlOiAnVE9VUk5FWV9USVRMRScsXHJcbiAgICAgIGxvZ286ICdMT0dPX1VSTCcsXHJcbiAgICB9KSxcclxuICAgIGJyZWFkY3J1bWJzOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnVG91cm5hbWVudHMnLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlzTGlzdCcsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogdGhpcy50b3VybmV5X3RpdGxlLFxyXG4gICAgICAgICAgdG86IHtcclxuICAgICAgICAgICAgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICBzbHVnOiB0aGlzLnRvdXJuZXlfc2x1ZyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiB0aGlzLmNhdGVnb3J5LFxyXG4gICAgICAgICAgYWN0aXZlOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhdGhcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuLy8gZXhwb3J0IGRlZmF1bHQgQ2F0ZURldGFpbDsiLCJpbXBvcnQgeyBMb2FkaW5nQWxlcnQsIEVycm9yQWxlcnQgfSBmcm9tICcuL2FsZXJ0cy5qcyc7XHJcbmltcG9ydCAgYmFzZVVSTCAgZnJvbSAnLi4vY29uZmlnLmpzJztcclxuLy8gbGV0IExvYWRpbmdBbGVydCwgRXJyb3JBbGVydDtcclxubGV0IHREZXRhaWwgPSBWdWUuY29tcG9uZW50KCd0ZGV0YWlsJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgPHRlbXBsYXRlIHYtaWY9XCJsb2FkaW5nfHxlcnJvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgPGRpdiB2LWlmPVwibG9hZGluZ1wiIGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgIDxsb2FkaW5nPjwvbG9hZGluZz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZXJyb3I+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgPHAgc2xvdD1cImVycm9yX21zZ1wiPnt7ZXJyb3JfbXNnfX08L3A+XHJcbiAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8Yi1icmVhZGNydW1iIDppdGVtcz1cImJyZWFkY3J1bWJzXCIgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicC01IHRleHQtY2VudGVyIGQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LWxnLXJvdyBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWxnLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cclxuICAgICAgICAgICAgPGItaW1nIHNsb3Q9XCJhc2lkZVwiIHZlcnRpY2FsLWFsaWduPVwiY2VudGVyXCIgY2xhc3M9XCJhbGlnbi1zZWxmLWNlbnRlciBtci0zIHJvdW5kZWQgaW1nLWZsdWlkXCJcclxuICAgICAgICAgICAgICA6c3JjPVwidG91cm5leS5ldmVudF9sb2dvXCIgd2lkdGg9XCIxNTBcIiBoZWlnaHQ9XCIxNTBcIiA6YWx0PVwidG91cm5leS5ldmVudF9sb2dvX3RpdGxlXCIgLz5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwibXgtMSBkaXNwbGF5LTRcIj5cclxuICAgICAgICAgICAgICB7e3RvdXJuZXkudGl0bGV9fVxyXG4gICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicC01IGQtZmxleCBmbGV4LWNvbHVtbiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LWlubGluZSB0ZXh0LWNlbnRlclwiIGlkPVwiZXZlbnQtZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW1cIiB2LWlmPVwidG91cm5leS5zdGFydF9kYXRlXCI+PGkgY2xhc3M9XCJmYSBmYS1jYWxlbmRhclwiPjwvaT5cclxuICAgICAgICAgICAgICAgIHt7dG91cm5leS5zdGFydF9kYXRlfX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtaW5saW5lLWl0ZW1cIiB2LWlmPVwidG91cm5leS52ZW51ZVwiPjxpIGNsYXNzPVwiZmEgZmEtbWFwLW1hcmtlclwiPjwvaT4ge3t0b3VybmV5LnZlbnVlfX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWlmPVwidG91cm5leS50b3VybmFtZW50X2RpcmVjdG9yXCI+PGkgY2xhc3M9XCJmYSBmYS1sZWdhbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgIHt7dG91cm5leS50b3VybmFtZW50X2RpcmVjdG9yfX08L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8aDU+XHJcbiAgICAgICAgICAgICAgQ2F0ZWdvcmllcyA8aSBjbGFzcz1cImZhIGZhLWxpc3RcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtaW5saW5lIHRleHQtY2VudGVyIGNhdGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWZvcj1cIihjYXQsIGMpIGluIHRvdXJuZXkudG91X2NhdGVnb3JpZXNcIiA6a2V5PVwiY1wiIGNsYXNzPVwibGlzdC1pbmxpbmUtaXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgPHRlbXBsYXRlIHYtaWY9XCJjYXQuZXZlbnRfaWRcIj5cclxuICAgICAgICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ0NhdGVEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogdG91cm5leS5zbHVnICwgZXZlbnRfc2x1ZzpjYXQuZXZlbnRfc2x1Z319XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3tjYXQuY2F0X25hbWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgICAgICA8dGVtcGxhdGUgdi1lbHNlPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj57e2NhdC5jYXRfbmFtZX19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICA8L2Rpdj5cclxuICAgICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5zbHVnLFxyXG4gICAgICBwYXRoOiB0aGlzLiRyb3V0ZS5wYXRoLFxyXG4gICAgICBwYWdldXJsOiBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgICsgdGhpcy4kcm91dGUucGF0aCxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVVcGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGhpcy50b3VybmV5LnRpdGxlO1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZmV0Y2hEYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgIGlmICh0aGlzLnRvdXJuZXkuc2x1ZyAhPSB0aGlzLnNsdWcpIHtcclxuICAgICAgICAvLyByZXNldCB0aXRsZSBiZWNhdXNlIG9mIGJyZWFkY3J1bWJzXHJcbiAgICAgICAgdGhpcy50b3VybmV5LnRpdGxlID0gJyc7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGUgPSB0aGlzLnRvdWxpc3QuZmluZChldmVudCA9PiBldmVudC5zbHVnID09PSB0aGlzLnNsdWcpO1xyXG4gICAgICBpZiAoZSkge1xyXG4gICAgICAgIGxldCBub3cgPSBtb21lbnQoKTtcclxuICAgICAgICBjb25zdCBhID0gbW9tZW50KHRoaXMubGFzdF9hY2Nlc3NfdGltZSk7XHJcbiAgICAgICAgY29uc3QgdGltZV9lbGFwc2VkID0gbm93LmRpZmYoYSwgJ3NlY29uZHMnKTtcclxuICAgICAgICBpZiAodGltZV9lbGFwc2VkIDwgMzAwKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLU1hdGNoIEZvdW5kIGluIFRvdXJuZXkgTGlzdC0tLS0tLS0tLS0nKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGltZV9lbGFwc2VkKTtcclxuICAgICAgICAgIHRoaXMudG91cm5leSA9IGU7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0RFVEFJTCcsIHRoaXMuc2x1Zyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdGRVRDSF9ERVRBSUwnLCB0aGlzLnNsdWcpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIC8vIHRvdXJuZXk6ICdERVRBSUwnLFxyXG4gICAgICBlcnJvcjogJ0VSUk9SJyxcclxuICAgICAgbG9hZGluZzogJ0xPQURJTkcnLFxyXG4gICAgICBsYXN0X2FjY2Vzc190aW1lOiAnVE9VQUNDRVNTVElNRScsXHJcbiAgICAgIHRvdWxpc3Q6ICdUT1VBUEknXHJcbiAgICB9KSxcclxuICAgIHRvdXJuZXk6IHtcclxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHN0b3JlLmdldHRlcnMuREVUQUlMO1xyXG4gICAgICB9LFxyXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcclxuICAgICAgICB0aGlzLiRzdG9yZS5jb21taXQoJ1NFVF9FVkVOVERFVEFJTCcsIG5ld1ZhbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBicmVhZGNydW1iczogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1RvdXJuYW1lbnRzJyxcclxuICAgICAgICAgIHRvOiB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdUb3VybmV5c0xpc3QnLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IHRoaXMudG91cm5leS50aXRsZSxcclxuICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICAgIGVycm9yX21zZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBgV2UgYXJlIGN1cnJlbnRseSBleHBlcmllbmNpbmcgbmV0d29yayBpc3N1ZXMuIFBsZWFzZSByZWZyZXNoIHRvIHRyeSBhZ2FpbiBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHREZXRhaWw7XHJcbiIsImxldCBtYXBHZXR0ZXJzID0gVnVleC5tYXBHZXR0ZXJzO1xyXG4vLyBsZXQgTG9hZGluZ0FsZXJ0LCBFcnJvckFsZXJ0O1xyXG5pbXBvcnQge0xvYWRpbmdBbGVydCwgRXJyb3JBbGVydH0gZnJvbSAnLi9hbGVydHMuanMnO1xyXG5sZXQgc2NyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ3Njckxpc3QnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XHJcbiAgICA8dGVtcGxhdGUgdi1pZj1cImxvYWRpbmd8fGVycm9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgdi1pZj1cImxvYWRpbmdcIiBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IHYtZWxzZSBjbGFzcz1cImNvbC0xMiBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLXNlbGYtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvclwiPnt7ZXJyb3J9fTwvcD5cclxuICAgICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JfbXNnXCI+e3tlcnJvcl9tc2d9fTwvcD5cclxuICAgICAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aDIgY2xhc3M9XCJiZWJhcyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJvcGh5XCI+PC9pPiBUb3VybmFtZW50c1xyXG4gICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyIGNvbC1sZy0xMCBvZmZzZXQtbGctMVwiPlxyXG4gICAgICAgICAgICAgIDxiLXBhZ2luYXRpb24gYWxpZ249XCJjZW50ZXJcIiA6dG90YWwtcm93cz1cIitXUHRvdGFsXCIgQGNoYW5nZT1cImZldGNoTGlzdFwiIHYtbW9kZWw9XCJjdXJyZW50UGFnZVwiIDpwZXItcGFnZT1cIjEwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgOmhpZGUtZWxsaXBzaXM9XCJmYWxzZVwiIGFyaWEtbGFiZWw9XCJOYXZpZ2F0aW9uXCIgLz5cclxuICAgICAgICAgICAgICA8cCBjbGFzcz1cInRleHQtbXV0ZWRcIj4gWW91IGFyZSBvbiBwYWdlIHt7Y3VycmVudFBhZ2V9fSBvZiB7e1dQcGFnZXN9fSBwYWdlczsgPHNwYW4gY2xhc3M9XCJlbXBoYXNpemVcIj57e1dQdG90YWx9fTwvc3Bhbj4gdG91cm5hbWVudHMhPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiAgY2xhc3M9XCJjb2wtMTIgY29sLWxnLTEwIG9mZnNldC1sZy0xXCIgdi1mb3I9XCJpdGVtIGluIHRvdXJuZXlzXCIgOmtleT1cIml0ZW0uaWRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtbGctcm93IGFsaWduLWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtbGctY2VudGVyIGp1c3RpZnktY29udGVudC1zdGFydCB0b3VybmV5LWxpc3QgYW5pbWF0ZWQgYm91bmNlSW5MZWZ0XCIgPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1yLWxnLTVcIj5cclxuICAgICAgICAgICAgPHJvdXRlci1saW5rIDp0bz1cInsgbmFtZTogJ1RvdXJuZXlEZXRhaWwnLCBwYXJhbXM6IHsgc2x1ZzogaXRlbS5zbHVnfX1cIj5cclxuICAgICAgICAgICAgICA8Yi1pbWcgZmx1aWQgY2xhc3M9XCJ0aHVtYm5haWxcIlxyXG4gICAgICAgICAgICAgICAgICA6c3JjPVwiaXRlbS5ldmVudF9sb2dvXCIgd2lkdGg9XCIxMDBcIiAgaGVpZ2h0PVwiMTAwXCIgOmFsdD1cIml0ZW0uZXZlbnRfbG9nb190aXRsZVwiIC8+XHJcbiAgICAgICAgICAgIDwvcm91dGVyLWxpbms+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtci1sZy1hdXRvXCI+XHJcbiAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1iLTEgZGlzcGxheS01XCI+XHJcbiAgICAgICAgICAgIDxyb3V0ZXItbGluayB2LWlmPVwiaXRlbS5zbHVnXCIgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgICAgICAge3tpdGVtLnRpdGxlfX1cclxuICAgICAgICAgICAgPC9yb3V0ZXItbGluaz5cclxuICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWlubGluZSBwLTFcIj5cclxuICAgICAgICAgICAgICAgIDxzbWFsbD48aSBjbGFzcz1cImZhIGZhLWNhbGVuZGFyXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIHt7aXRlbS5zdGFydF9kYXRlfX1cclxuICAgICAgICAgICAgICAgIDwvc21hbGw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgIDxzbWFsbD48aSBjbGFzcz1cImZhIGZhLW1hcC1tYXJrZXJcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIHt7aXRlbS52ZW51ZX19XHJcbiAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtaW5saW5lIHAtMVwiPlxyXG4gICAgICAgICAgICAgIDxyb3V0ZXItbGluayB2LWlmPVwiaXRlbS5zbHVnXCIgOnRvPVwieyBuYW1lOiAnVG91cm5leURldGFpbCcsIHBhcmFtczogeyBzbHVnOiBpdGVtLnNsdWd9fVwiPlxyXG4gICAgICAgICAgICAgICAgICA8c21hbGwgdGl0bGU9XCJCcm93c2UgdG91cm5leVwiPjxpIGNsYXNzPVwiZmEgZmEtbGlua1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgPC9zbWFsbD5cclxuICAgICAgICAgICAgICA8L3JvdXRlci1saW5rPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8dWwgY2xhc3M9XCJsaXN0LXVuc3R5bGVkIGxpc3QtaW5saW5lIHRleHQtY2VudGVyIGNhdGVnb3J5LWxpc3RcIj5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWlubGluZS1pdGVtIG14LWF1dG9cIlxyXG4gICAgICAgICAgICAgIHYtZm9yPVwiY2F0ZWdvcnkgaW4gaXRlbS50b3VfY2F0ZWdvcmllc1wiPnt7Y2F0ZWdvcnkuY2F0X25hbWV9fTwvbGk+XHJcbiAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIgZC1mbGV4IGZsZXgtY29sdW1uIGp1c3RpZnktY29udGVudC1sZy1lbmRcIj5cclxuICAgICAgICAgIDxwIGNsYXNzPVwibXktMCBweS0wXCI+PHNtYWxsIGNsYXNzPVwidGV4dC1tdXRlZFwiPllvdSBhcmUgb24gcGFnZSB7e2N1cnJlbnRQYWdlfX0gb2Yge3tXUHBhZ2VzfX0gcGFnZXMgd2l0aCA8c3BhbiBjbGFzcz1cImVtcGhhc2l6ZVwiPnt7V1B0b3RhbH19PC9zcGFuPlxyXG4gICAgICAgICAgdG91cm5hbWVudHMhPC9zbWFsbD48L3A+XHJcbiAgICAgICAgICAgICAgPGItcGFnaW5hdGlvbiBhbGlnbj1cImNlbnRlclwiIDp0b3RhbC1yb3dzPVwiK1dQdG90YWxcIiBAY2hhbmdlPVwiZmV0Y2hMaXN0XCIgdi1tb2RlbD1cImN1cnJlbnRQYWdlXCIgOnBlci1wYWdlPVwiMTBcIlxyXG4gICAgICAgICAgICAgICAgICA6aGlkZS1lbGxpcHNpcz1cImZhbHNlXCIgYXJpYS1sYWJlbD1cIk5hdmlnYXRpb25cIiAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgPC90ZW1wbGF0ZT5cclxuPC9kaXY+XHJcbmAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgbG9hZGluZzogTG9hZGluZ0FsZXJ0LFxyXG4gICAgZXJyb3I6IEVycm9yQWxlcnQsXHJcbiAgfSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhdGg6IHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIGN1cnJlbnRQYWdlOiAxLFxyXG4gICAgfTtcclxuICAgIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2coJ0xpc3QuanMgbG9hZGVkJylcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ1NjcmFiYmxlIFRvdXJuYW1lbnRzIC0gTlNGJztcclxuICAgIHRoaXMuZmV0Y2hMaXN0KHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZmV0Y2hMaXN0OiBmdW5jdGlvbihwYWdlTnVtKSB7XHJcbiAgICAgIC8vdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0FQSScsIHBhZ2VOdW0sIHtcclxuICAgICAgICAvLyB0aW1lb3V0OiAzNjAwMDAwIC8vMSBob3VyIGNhY2hlXHJcbiAgICAgLy8gfSk7XHJcbiAgICAgIHRoaXMuY3VycmVudFJvdW5kID0gcGFnZU51bTtcclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0ZFVENIX0FQSScsIHBhZ2VOdW0pO1xyXG4gICAgICBjb25zb2xlLmxvZygnZG9uZSEnKTtcclxuICAgIH0sXHJcblxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICB0b3VybmV5czogJ1RPVUFQSScsXHJcbiAgICAgIGVycm9yOiAnRVJST1InLFxyXG4gICAgICBsb2FkaW5nOiAnTE9BRElORycsXHJcbiAgICAgIFdQdG90YWw6ICdXUFRPVEFMJyxcclxuICAgICAgV1BwYWdlczogJ1dQUEFHRVMnLFxyXG4gICAgfSksXHJcbiAgICBlcnJvcl9tc2c6IGZ1bmN0aW9uKCkge1xyXG4gICAgICByZXR1cm4gYFNvcnJ5IHdlIGFyZSBjdXJyZW50bHkgaGF2aW5nIHRyb3VibGUgZmluZGluZyB0aGUgbGlzdCBvZiB0b3VybmFtZW50cy5gO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIGV4cG9ydCBkZWZhdWx0IHNjckxpc3Q7IiwidmFyIHBsYXllcl9taXhlZF9zZXJpZXMgPSBbeyBuYW1lOiAnJywgIGRhdGE6IFtdIH1dO1xyXG52YXIgcGxheWVyX3Jhbmtfc2VyaWVzID0gW3sgbmFtZTogJycsICBkYXRhOiBbXSB9XTtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzID0gW10gIDtcclxudmFyIHBsYXllcl9yYWRpYWxfY2hhcnRfY29uZmlnID0ge1xyXG4gIHBsb3RPcHRpb25zOiB7XHJcbiAgICByYWRpYWxCYXI6IHtcclxuICAgICAgaG9sbG93OiB7IHNpemU6ICc1MCUnLCB9XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbXSxcclxuICBsYWJlbHM6IFtdLFxyXG59O1xyXG5cclxudmFyIHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyA9IHtcclxuICBjaGFydDoge1xyXG4gICAgaGVpZ2h0OiA0MDAsXHJcbiAgICB6b29tOiB7XHJcbiAgICAgIGVuYWJsZWQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAgc2hhZG93OiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGNvbG9yOiAnIzAwMCcsXHJcbiAgICAgIHRvcDogMTgsXHJcbiAgICAgIGxlZnQ6IDcsXHJcbiAgICAgIGJsdXI6IDEwLFxyXG4gICAgICBvcGFjaXR5OiAxXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29sb3JzOiBbJyM3N0I2RUEnLCAnIzU0NTQ1NCddLFxyXG4gIGRhdGFMYWJlbHM6IHtcclxuICAgIGVuYWJsZWQ6IHRydWVcclxuICB9LFxyXG4gIHN0cm9rZToge1xyXG4gICAgY3VydmU6ICdzbW9vdGgnIC8vIHN0cmFpZ2h0XHJcbiAgfSxcclxuICB0aXRsZToge1xyXG4gICAgdGV4dDogJycsXHJcbiAgICBhbGlnbjogJ2xlZnQnXHJcbiAgfSxcclxuICBncmlkOiB7XHJcbiAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgcm93OiB7XHJcbiAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICBvcGFjaXR5OiAwLjVcclxuICAgIH0sXHJcbiAgfSxcclxuICB4YXhpczoge1xyXG4gICAgY2F0ZWdvcmllczogW10sXHJcbiAgICB0aXRsZToge1xyXG4gICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgeWF4aXM6IHtcclxuICAgIHRpdGxlOiB7XHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgbWluOiBudWxsLFxyXG4gICAgbWF4OiBudWxsXHJcbiAgfSxcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgb2Zmc2V0WDogLTVcclxuICB9XHJcbn07XHJcblxyXG52YXIgUGxheWVyU3RhdHMgPSBWdWUuY29tcG9uZW50KCdwbGF5ZXJzdGF0cycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gIDxkaXYgY2xhc3M9XCJjb2wtbGctMTAgb2Zmc2V0LWxnLTEganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTggb2Zmc2V0LWxnLTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluTGVmdEJpZ1wiIGlkPVwicGhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBtdC01XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgYmViYXNcIj57e3BsYXllck5hbWV9fVxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiBzdHlsZT1cImZvbnQtc2l6ZTpzbWFsbFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmxhZy1pY29uXCIgOmNsYXNzPVwiJ2ZsYWctaWNvbi0nK3BsYXllci5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgICA6dGl0bGU9XCJwbGF5ZXIuY291bnRyeV9mdWxsXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTMgZmFcIiA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdtJyxcclxuICAgICAgICAgICAgICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJywnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICA8aW1nIHdpZHRoPVwiMTAwcHhcIiBoZWlnaHQ9XCIxMDBweFwiIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBpbWctZmx1aWQgbXgtMyBkLWJsb2NrIHNoYWRvdy1zbVwiXHJcbiAgICAgICAgICAgICAgICA6c3JjPVwicGxheWVyLnBob3RvXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGg0IGNsYXNzPVwidGV4dC1jZW50ZXIgeWFub25lIG14LTNcIj57e3BzdGF0cy5wUG9zaXRpb259fSBwb3NpdGlvbjwvaDQ+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+IDwhLS0gI3BoZWFkZXItLT5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIgYWxpZ24tY29udGVudC1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UxIGNsYXNzPVwibS0xXCI+UXVpY2sgU3RhdHM8L2ItYnRuPlxyXG4gICAgICAgICAgPGItYnRuIHYtYi10b2dnbGUuY29sbGFwc2UyIGNsYXNzPVwibS0xXCI+Um91bmQgYnkgUm91bmQgPC9iLWJ0bj5cclxuICAgICAgICAgIDxiLWJ0biB2LWItdG9nZ2xlLmNvbGxhcHNlMyBjbGFzcz1cIm0tMVwiPkNoYXJ0czwvYi1idG4+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdGl0bGU9XCJDbG9zZVwiIHNpemU9XCJzbVwiIEBjbGljaz1cImNsb3NlQ2FyZCgpXCIgY2xhc3M9XCJtLTFcIiB2YXJpYW50PVwib3V0bGluZS1kYW5nZXJcIiA6ZGlzYWJsZWQ9XCIhc2hvd1wiXHJcbiAgICAgICAgICAgIDpwcmVzc2VkLnN5bmM9XCJzaG93XCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9iLWJ1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IG9mZnNldC1sZy0yXCI+XHJcbiAgICAgICAgPGItY29sbGFwc2UgaWQ9XCJjb2xsYXBzZTFcIj5cclxuICAgICAgICAgIDxiLWNhcmQgY2xhc3M9XCJhbmltYXRlZCBmbGlwSW5YXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciB0ZXh0LWNlbnRlclwiPlF1aWNrIFN0YXRzPC9kaXY+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaCBzdGF0c1wiPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPlBvaW50czpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBQb2ludHN9fSAvIHt7dG90YWxfcm91bmRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5SYW5rOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucFJhbmt9fSA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5IaWdoZXN0IFNjb3JlOlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3twc3RhdHMucEhpU2NvcmV9fTwvc3Bhbj4gKHJkIDxlbT57e3BzdGF0cy5wSGlTY29yZVJvdW5kc319PC9lbT4pXHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIj5Mb3dlc3QgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wTG9TY29yZX19PC9zcGFuPiAocmQgPGVtPnt7cHN0YXRzLnBMb1Njb3JlUm91bmRzfX08L2VtPilcclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBTY29yZTpcclxuICAgICAgICAgICAgICAgIDxzcGFuPnt7cHN0YXRzLnBBdmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiPkF2ZSBPcHAgU2NvcmU6XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57e3BzdGF0cy5wQXZlT3BwfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tLS0gUm91bmQgQnkgUm91bmQgUmVzdWx0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlMlwiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgIDxoND5Sb3VuZCBCeSBSb3VuZCBTdW1tYXJ5IDwvaDQ+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtZ3JvdXAgbGlzdC1ncm91cC1mbHVzaFwiIHYtZm9yPVwiKHJlcG9ydCwgaSkgaW4gcHN0YXRzLnBSYnlSXCIgOmtleT1cImlcIj5cclxuICAgICAgICAgICAgICA8bGkgdi1odG1sPVwicmVwb3J0LnJlcG9ydFwiIHYtaWY9XCJyZXBvcnQucmVzdWx0PT0nd2luJ1wiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgICAgICB7e3JlcG9ydC5yZXBvcnR9fTwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpIHYtaHRtbD1cInJlcG9ydC5yZXBvcnRcIiB2LWVsc2UtaWY9XCJyZXBvcnQucmVzdWx0ID09J2RyYXcnXCJcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS13YXJuaW5nXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdsb3NzJ1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0tZGFuZ2VyXCI+e3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlLWlmPVwicmVwb3J0LnJlc3VsdCA9PSdhd2FpdGluZydcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBsaXN0LWdyb3VwLWl0ZW0taW5mb1wiPlxyXG4gICAgICAgICAgICAgICAge3tyZXBvcnQucmVwb3J0fX08L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSB2LWh0bWw9XCJyZXBvcnQucmVwb3J0XCIgdi1lbHNlIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGxpc3QtZ3JvdXAtaXRlbS1saWdodFwiPnt7cmVwb3J0LnJlcG9ydH19PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgIDwvYi1jYXJkPlxyXG4gICAgICAgIDwvYi1jb2xsYXBzZT5cclxuICAgICAgICA8IS0tIENoYXJ0cyAtLT5cclxuICAgICAgICA8Yi1jb2xsYXBzZSBpZD1cImNvbGxhcHNlM1wiPlxyXG4gICAgICAgICAgPGItY2FyZCBjbGFzcz1cImFuaW1hdGVkIGZhZGVJbkRvd25cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHRleHQtY2VudGVyXCI+U3RhdHMgQ2hhcnRzPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCdtaXhlZCcpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCIgOnByZXNzZWQ9XCJjaGFydE1vZGVsPT0nbWl4ZWQnXCI+PGkgY2xhc3M9XCJmYXMgZmEtZmlsZS1jc3ZcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gTWl4ZWQgU2NvcmVzPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxiLWJ1dHRvbiBAY2xpY2s9XCJ1cGRhdGVDaGFydCgncmFuaycpXCIgdmFyaWFudD1cImxpbmtcIiBjbGFzcz1cInRleHQtZGVjb3JhdGlvbi1ub25lIG1sLTFcIlxyXG4gICAgICAgICAgICAgICAgICA6ZGlzYWJsZWQ9XCJjaGFydE1vZGVsPT0ncmFuaydcIiA6cHJlc3NlZD1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiPjxpIGNsYXNzPVwiZmFzIGZhLWNoYXJ0LWxpbmVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gUmFuayBwZXIgUmQ8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGItYnV0dG9uIEBjbGljaz1cInVwZGF0ZUNoYXJ0KCd3aW5zJylcIiB2YXJpYW50PVwibGlua1wiIGNsYXNzPVwidGV4dC1kZWNvcmF0aW9uLW5vbmUgbWwtMVwiXHJcbiAgICAgICAgICAgICAgICAgIDpkaXNhYmxlZD1cImNoYXJ0TW9kZWw9PSd3aW5zJ1wiIDpwcmVzc2VkPVwiY2hhcnRNb2RlbD09J3dpbnMnXCI+PGkgY2xhc3M9XCJmYXMgZmEtYmFsYW5jZS1zY2FsZSBmYS1zdGFja1wiXHJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBTdGFydHMvUmVwbGllcyBXaW5zKCUpPC9iLWJ1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjaGFydFwiPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdtaXhlZCdcIiB0eXBlPWxpbmUgaGVpZ2h0PTQwMCA6b3B0aW9ucz1cImNoYXJ0T3B0aW9uc1wiXHJcbiAgICAgICAgICAgICAgICA6c2VyaWVzPVwic2VyaWVzTWl4ZWRcIiAvPlxyXG4gICAgICAgICAgICAgIDxhcGV4Y2hhcnQgdi1pZj1cImNoYXJ0TW9kZWw9PSdyYW5rJ1wiIHR5cGU9J2xpbmUnIGhlaWdodD00MDAgOm9wdGlvbnM9XCJjaGFydE9wdGlvbnNSYW5rXCJcclxuICAgICAgICAgICAgICAgIDpzZXJpZXM9XCJzZXJpZXNSYW5rXCIgLz5cclxuICAgICAgICAgICAgICA8YXBleGNoYXJ0IHYtaWY9XCJjaGFydE1vZGVsPT0nd2lucydcIiB0eXBlPXJhZGlhbEJhciBoZWlnaHQ9NDAwIDpvcHRpb25zPVwiY2hhcnRPcHRSYWRpYWxcIlxyXG4gICAgICAgICAgICAgICAgOnNlcmllcz1cInNlcmllc1JhZGlhbFwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9iLWNhcmQ+XHJcbiAgICAgICAgPC9iLWNvbGxhcHNlPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGAsXHJcbiAgcHJvcHM6IFsncHN0YXRzJ10sXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgYXBleGNoYXJ0OiBWdWVBcGV4Q2hhcnRzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcGxheWVyOiAnJyxcclxuICAgICAgc2hvdzogdHJ1ZSxcclxuICAgICAgcGxheWVyTmFtZTogJycsXHJcbiAgICAgIGFsbFNjb3JlczogW10sXHJcbiAgICAgIGFsbE9wcFNjb3JlczogW10sXHJcbiAgICAgIGFsbFJhbmtzOiBbXSxcclxuICAgICAgdG90YWxfcGxheWVyczogbnVsbCxcclxuICAgICAgY2hhcnRNb2RlbDogJ3JhbmsnLFxyXG4gICAgICBzZXJpZXNNaXhlZDogcGxheWVyX21peGVkX3NlcmllcyxcclxuICAgICAgc2VyaWVzUmFuazogcGxheWVyX3Jhbmtfc2VyaWVzLFxyXG4gICAgICBzZXJpZXNSYWRpYWw6IHBsYXllcl9yYWRpYWxfY2hhcnRfc2VyaWVzLFxyXG4gICAgICBjaGFydE9wdFJhZGlhbDogcGxheWVyX3JhZGlhbF9jaGFydF9jb25maWcsXHJcbiAgICAgIGNoYXJ0T3B0aW9uc1Jhbms6IHBsYXllcl9yYW5rX2NoYXJ0X2NvbmZpZyxcclxuICAgICAgY2hhcnRPcHRpb25zOiB7XHJcbiAgICAgICAgY2hhcnQ6IHtcclxuICAgICAgICAgIGhlaWdodDogNDAwLFxyXG4gICAgICAgICAgem9vbToge1xyXG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNoYWRvdzoge1xyXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAnLFxyXG4gICAgICAgICAgICB0b3A6IDE4LFxyXG4gICAgICAgICAgICBsZWZ0OiA3LFxyXG4gICAgICAgICAgICBibHVyOiAxMCxcclxuICAgICAgICAgICAgb3BhY2l0eTogMC41XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY29sb3JzOiBbJyM4RkJDOEYnLCAnIzU0NTQ1NCddLFxyXG4gICAgICAgIGRhdGFMYWJlbHM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0cm9rZToge1xyXG4gICAgICAgICAgY3VydmU6ICdzdHJhaWdodCcgLy8gc21vb3RoXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgdGV4dDogJycsXHJcbiAgICAgICAgICBhbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmlkOiB7XHJcbiAgICAgICAgICBib3JkZXJDb2xvcjogJyNlN2U3ZTcnLFxyXG4gICAgICAgICAgcm93OiB7XHJcbiAgICAgICAgICAgIGNvbG9yczogWycjZjNmM2YzJywgJ3RyYW5zcGFyZW50J10sIC8vIHRha2VzIGFuIGFycmF5IHdoaWNoIHdpbGwgYmUgcmVwZWF0ZWQgb24gY29sdW1uc1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB4YXhpczoge1xyXG4gICAgICAgICAgY2F0ZWdvcmllczogW10sXHJcbiAgICAgICAgICB0aXRsZToge1xyXG4gICAgICAgICAgICB0ZXh0OiAnUm91bmRzJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeWF4aXM6IHtcclxuICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgIHRleHQ6ICcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbWluOiBudWxsLFxyXG4gICAgICAgICAgbWF4OiBudWxsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsZWdlbmQ6IHtcclxuICAgICAgICAgIHBvc2l0aW9uOiAndG9wJyxcclxuICAgICAgICAgIGhvcml6b250YWxBbGlnbjogJ3JpZ2h0JyxcclxuICAgICAgICAgIGZsb2F0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgb2Zmc2V0WTogLTI1LFxyXG4gICAgICAgICAgb2Zmc2V0WDogLTVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG1vdW50ZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZG9TY3JvbGwoKTtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc2VyaWVzUmFkaWFsKVxyXG4gICAgdGhpcy5zaG93ID0gdGhpcy5zaG93U3RhdHM7XHJcbiAgICB0aGlzLmFsbFNjb3JlcyA9IF8uZmxhdHRlbih0aGlzLnBzdGF0cy5hbGxTY29yZXMpO1xyXG4gICAgdGhpcy5hbGxPcHBTY29yZXMgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsT3BwU2NvcmVzKTtcclxuICAgIHRoaXMuYWxsUmFua3MgPSBfLmZsYXR0ZW4odGhpcy5wc3RhdHMuYWxsUmFua3MpO1xyXG4gICAgdGhpcy51cGRhdGVDaGFydCh0aGlzLmNoYXJ0TW9kZWwpO1xyXG4gICAgdGhpcy50b3RhbF9wbGF5ZXJzID0gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcclxuICAgIHRoaXMucGxheWVyID0gdGhpcy5wc3RhdHMucGxheWVyWzBdO1xyXG4gICAgdGhpcy5wbGF5ZXJOYW1lID0gdGhpcy5wbGF5ZXIucG9zdF90aXRsZTtcclxuICB9LFxyXG4gIGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95KCkge1xyXG4gICAgdGhpcy5jbG9zZUNhcmQoKTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuXHJcbiAgICBkb1Njcm9sbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSB1c2VyIHNjcm9sbHMgdGhlIHBhZ2UsIGV4ZWN1dGUgbXlGdW5jdGlvblxyXG4gICAgICB3aW5kb3cub25zY3JvbGwgPSBmdW5jdGlvbigpIHtteUZ1bmN0aW9uKCl9O1xyXG5cclxuICAgICAgLy8gR2V0IHRoZSBoZWFkZXJcclxuICAgICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhlYWRlclwiKTtcclxuXHJcbiAgICAgIC8vIEdldCB0aGUgb2Zmc2V0IHBvc2l0aW9uIG9mIHRoZSBuYXZiYXJcclxuICAgICAgdmFyIHN0aWNreSA9IGhlYWRlci5vZmZzZXRUb3A7XHJcbiAgICAgIHZhciBoID0gaGVhZGVyLm9mZnNldEhlaWdodCArIDUwO1xyXG5cclxuICAgICAgLy8gQWRkIHRoZSBzdGlja3kgY2xhc3MgdG8gdGhlIGhlYWRlciB3aGVuIHlvdSByZWFjaCBpdHMgc2Nyb2xsIHBvc2l0aW9uLiBSZW1vdmUgXCJzdGlja3lcIiB3aGVuIHlvdSBsZWF2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgIGZ1bmN0aW9uIG15RnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5wYWdlWU9mZnNldCA+IChzdGlja3kgKyBoKSkge1xyXG4gICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoXCJzdGlja3lcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKFwic3RpY2t5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBzZXRDaGFydENhdGVnb3JpZXM6IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCByb3VuZHMgPSBfLnJhbmdlKDEsIHRoaXMudG90YWxfcm91bmRzICsgMSk7XHJcbiAgICAgIGxldCByZHMgPSBfLm1hcChyb3VuZHMsIGZ1bmN0aW9uKG51bSl7IHJldHVybiAnUmQgJysgbnVtOyB9KTtcclxuICAgICAgdGhpcy5jaGFydE9wdGlvbnMueGF4aXMuY2F0ZWdvcmllcyA9IHJkcztcclxuICAgIH0sXHJcbiAgICB1cGRhdGVDaGFydDogZnVuY3Rpb24gKHR5cGUpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLVVwZGF0aW5nLi4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICB0aGlzLmNoYXJ0TW9kZWwgPSB0eXBlO1xyXG4gICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS5hbGlnbiA9ICdsZWZ0JztcclxuICAgICAgdmFyIGZpcnN0TmFtZSA9IF8udHJpbShfLnNwbGl0KHRoaXMucGxheWVyTmFtZSwgJyAnLCAyKVswXSk7XHJcbiAgICAgIGlmICgncmFuaycgPT0gdHlwZSkge1xyXG4gICAgICAgIC8vIHRoaXMuID0gJ2Jhcic7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnNSYW5rLnRpdGxlLnRleHQgPWBSYW5raW5nOiAke3RoaXMucGxheWVyTmFtZX1gO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5taW4gPSAwO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRpb25zUmFuay55YXhpcy5tYXggPXRoaXMudG90YWxfcGxheWVycztcclxuICAgICAgICB0aGlzLnNlcmllc1JhbmsgPSBbe1xyXG4gICAgICAgICAgbmFtZTogYCR7Zmlyc3ROYW1lfSByYW5rIHRoaXMgcmRgLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxSYW5rc1xyXG4gICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgaWYgKCdtaXhlZCcgPT0gdHlwZSkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2hhcnRDYXRlZ29yaWVzKClcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy50aXRsZS50ZXh0ID0gYFNjb3JlczogJHt0aGlzLnBsYXllck5hbWV9YDtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0aW9ucy55YXhpcy5taW4gPSAxMDA7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdGlvbnMueWF4aXMubWF4ID0gOTAwO1xyXG4gICAgICAgIHRoaXMuc2VyaWVzTWl4ZWQgPSBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6IGAke2ZpcnN0TmFtZX1gLFxyXG4gICAgICAgICAgICBkYXRhOiB0aGlzLmFsbFNjb3Jlc1xyXG4gICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnT3Bwb25lbnQnLFxyXG4gICAgICAgICAgZGF0YTogdGhpcy5hbGxPcHBTY29yZXNcclxuICAgICAgICAgfV1cclxuICAgICAgfVxyXG4gICAgICBpZiAoJ3dpbnMnID09IHR5cGUpIHtcclxuICAgICAgICB0aGlzLmNoYXJ0T3B0UmFkaWFsLmxhYmVscz0gW107XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMgPVtdO1xyXG4gICAgICAgIHRoaXMuY2hhcnRPcHRSYWRpYWwubGFiZWxzLnVuc2hpZnQoJ1N0YXJ0czogJSBXaW5zJywnUmVwbGllczogJSBXaW5zJyk7XHJcbiAgICAgICAgdGhpcy5jaGFydE9wdFJhZGlhbC5jb2xvcnMudW5zaGlmdCgnIzdDRkMwMCcsICcjQkRCNzZCJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jaGFydE9wdFJhZGlhbCk7XHJcbiAgICAgICAgdmFyIHMgPSBfLnJvdW5kKDEwMCAqICh0aGlzLnBzdGF0cy5zdGFydFdpbnMgLyB0aGlzLnBzdGF0cy5zdGFydHMpLDEpO1xyXG4gICAgICAgIHZhciByID0gXy5yb3VuZCgxMDAgKiAodGhpcy5wc3RhdHMucmVwbHlXaW5zIC8gdGhpcy5wc3RhdHMucmVwbGllcyksMSk7XHJcbiAgICAgICAgdGhpcy5zZXJpZXNSYWRpYWwgPSBbXTtcclxuICAgICAgICB0aGlzLnNlcmllc1JhZGlhbC51bnNoaWZ0KHMscik7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zZXJpZXNSYWRpYWwpXHJcbiAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgY2xvc2VDYXJkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnLS0tLS0tLS0tLUNsb3NpbmcgQ2FyZC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIHRoaXMuJHN0b3JlLmRpc3BhdGNoKCdET19TVEFUUycsIGZhbHNlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHNob3dTdGF0czogJ1NIT1dTVEFUUycsXHJcbiAgICB9KSxcclxuICB9LFxyXG5cclxufSk7XHJcblxyXG52YXIgUGxheWVyTGlzdCA9IFZ1ZS5jb21wb25lbnQoJ2FsbHBsYXllcnMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCIgaWQ9XCJwbGF5ZXJzLWxpc3RcIj5cclxuICAgIDx0ZW1wbGF0ZSB2LWlmPVwic2hvd1N0YXRzXCI+XHJcbiAgICAgICAgPHBsYXllcnN0YXRzIDpwc3RhdHM9XCJwU3RhdHNcIj48L3BsYXllcnN0YXRzPlxyXG4gICAgPC90ZW1wbGF0ZT5cclxuICAgIDx0ZW1wbGF0ZSB2LWVsc2U+XHJcbiAgICA8ZGl2IGNsYXNzPVwicGxheWVyQ29scyBjb2wtbGctMiBjb2wtc20tNiBjb2wtMTIgcC00IFwiIHYtZm9yPVwicGxheWVyIGluIHBsYXllcnNcIiA6a2V5PVwicGxheWVyLmlkXCIgPlxyXG4gICAgICAgICAgICA8aDQgY2xhc3M9XCJteC1hdXRvXCI+PGItYmFkZ2U+e3twbGF5ZXIudG91X25vfX08L2ItYmFkZ2U+XHJcbiAgICAgICAgICAgIHt7cGxheWVyLnBvc3RfdGl0bGUgfX1cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG14LWF1dG9cIiAgc3R5bGU9XCJmb250LXNpemU6c21hbGxcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJteC1hdXRvIGZsYWctaWNvblwiIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXIuY291bnRyeSB8IGxvd2VyY2FzZVwiIDp0aXRsZT1cInBsYXllci5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwibWwtMiBmYVwiIDpjbGFzcz1cInsnZmEtbWFsZSc6IHBsYXllci5nZW5kZXIgPT0gJ20nLFxyXG4gICAgICAgICdmYS1mZW1hbGUnOiBwbGF5ZXIuZ2VuZGVyID09ICdmJyxcclxuICAgICAgICAnZmEtdXNlcnMnOiBwbGF5ZXIuaXNfdGVhbSA9PSAneWVzJyB9XCJcclxuICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJteC1hdXRvIHRleHQtY2VudGVyIGFuaW1hdGVkIGZhZGVJblwiPlxyXG4gICAgICAgICAgICAgIDxiLWltZy1sYXp5IHYtYmluZD1cImltZ1Byb3BzXCIgOmFsdD1cInBsYXllci5wb3N0X3RpdGxlXCIgOnNyYz1cInBsYXllci5waG90b1wiIDppZD1cIidwb3BvdmVyLScrcGxheWVyLmlkXCI+PC9iLWltZy1sYXp5PlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1ibG9jayBteC1hdXRvXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gQGNsaWNrPVwic2hvd1BsYXllclN0YXRzKHBsYXllci5pZClcIiB0aXRsZT1cIlNob3cgcGxheWVyJ3Mgc3RhdHNcIj48aSBjbGFzcz1cImZhcyBmYS1jaGFydC1iYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8Yi1wb3BvdmVyIEBzaG93PVwiZ2V0TGFzdEdhbWVzKHBsYXllci50b3Vfbm8pXCIgcGxhY2VtZW50PVwiYm90dG9tXCIgIDp0YXJnZXQ9XCIncG9wb3Zlci0nK3BsYXllci5pZFwiIHRyaWdnZXJzPVwiaG92ZXJcIiBib3VuZGFyeS1wYWRkaW5nPVwiNVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBmbGV4LXdyYXAgYWxpZ24tY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLXN0YXJ0IG1yLTIganVzdGlmeS1jb250ZW50LWFyb3VuZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtZ3Jvdy0xIGFsaWduLXNlbGYtY2VudGVyXCIgc3R5bGU9XCJmb250LXNpemU6MS41ZW07XCI+e3ttc3RhdC5wb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImZsZXgtc2hyaW5rLTEgZC1pbmxpbmUtYmxvY2sgdGV4dC1tdXRlZFwiPjxzbWFsbD57e21zdGF0LndpbnN9fS17e21zdGF0LmRyYXdzfX0te3ttc3RhdC5sb3NzZXN9fTwvc21hbGw+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtY29sdW1uIGZsZXgtd3JhcCBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LXByaW1hcnkgZC1pbmxpbmUtYmxvY2tcIiBzdHlsZT1cImZvbnQtc2l6ZTowLjhlbTsgdGV4dC1kZWNvcmF0aW9uOnVuZGVybGluZVwiPkxhc3QgR2FtZTogUm91bmQge3ttc3RhdC5yb3VuZH19PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0xIHRleHQtd2hpdGUgc2RhdGEtcmVzIHRleHQtY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IG1zdGF0LnJlc3VsdCA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1pbmZvJzogbXN0YXQucmVzdWx0ID09PSAnYXdhaXRpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBtc3RhdC5yZXN1bHQgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IG1zdGF0LnJlc3VsdCA9PT0gJ3dpbicgfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt7bXN0YXQuc2NvcmV9fS17e21zdGF0Lm9wcG9fc2NvcmV9fSAoe3ttc3RhdC5yZXN1bHR8Zmlyc3RjaGFyfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGltZyA6c3JjPVwibXN0YXQub3BwX3Bob3RvXCIgOmFsdD1cIm1zdGF0Lm9wcG9cIiBjbGFzcz1cInJvdW5kZWQtY2lyY2xlIG0tYXV0byBkLWlubGluZS1ibG9ja1wiIHdpZHRoPVwiMjVcIiBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1pbmZvIGQtaW5saW5lLWJsb2NrXCIgc3R5bGU9XCJmb250LXNpemU6MC45ZW1cIj48c21hbGw+I3t7bXN0YXQub3Bwb19ub319IHt7bXN0YXQub3Bwb3xhYmJydn19PC9zbWFsbD48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2ItcG9wb3Zlcj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgPC9kaXY+XHJcbiAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgY29tcG9uZW50czoge1xyXG4gICAgcGxheWVyc3RhdHM6IFBsYXllclN0YXRzLFxyXG4gIH0sXHJcbiAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcFN0YXRzOiB7fSxcclxuICAgICAgaW1nUHJvcHM6IHtcclxuICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgYmxvY2s6IHRydWUsXHJcbiAgICAgICAgcm91bmRlZDogJ2NpcmNsZScsXHJcbiAgICAgICAgZmx1aWQ6IHRydWUsXHJcbiAgICAgICAgYmxhbms6IHRydWUsXHJcbiAgICAgICAgYmxhbmtDb2xvcjogJyNiYmInLFxyXG4gICAgICAgIHdpZHRoOiAnODBweCcsXHJcbiAgICAgICAgaGVpZ2h0OiAnODBweCcsXHJcbiAgICAgICAgc3R5bGU6ICdjdXJzb3I6IHBvaW50ZXInLFxyXG4gICAgICAgIGNsYXNzOiAnc2hhZG93LXNtJyxcclxuICAgICAgfSxcclxuICAgICAgZGF0YUZsYXQ6IHt9LFxyXG4gICAgICBtc3RhdDoge31cclxuICAgIH1cclxuICB9LFxyXG4gIG1vdW50ZWQoKSB7XHJcbiAgICBsZXQgcmVzdWx0ZGF0YSA9IHRoaXMucmVzdWx0X2RhdGE7XHJcbiAgICAvL2xldCBpbml0aWFsUmREYXRhID0gXy5pbml0aWFsKF8uY2xvbmUocmVzdWx0ZGF0YSkpO1xyXG4gICAgdGhpcy5kYXRhRmxhdCA9IF8uZmxhdHRlbkRlZXAoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgfSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgZ2V0TGFzdEdhbWVzOiBmdW5jdGlvbiAodG91X25vKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRvdV9ubylcclxuICAgICAgbGV0IGMgPSBfLmNsb25lKHRoaXMuZGF0YUZsYXQpO1xyXG4gICAgICAvLyBsZXQgcCA9IF8uY2xvbmUodGhpcy5wbGF5ZXJzKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocClcclxuICAgICAgICBsZXQgcmVzID0gXy5jaGFpbihjKVxyXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgIHJldHVybiB2LnBubyA9PT0gdG91X25vO1xyXG4gICAgICAgIH0pLnRha2VSaWdodCgpLnZhbHVlKCk7XHJcbiAgICAgIHRoaXMubXN0YXQgPSBfLmZpcnN0KHJlcyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubXN0YXQpXHJcbiAgICB9LFxyXG4gICAgc2hvd1BsYXllclN0YXRzOiBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgdGhpcy4kc3RvcmUuY29tbWl0KCdDT01QVVRFX1BMQVlFUl9TVEFUUycsIGlkKTtcclxuICAgICAgdGhpcy5wU3RhdHMucGxheWVyID0gdGhpcy5wbGF5ZXI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmVPcHAgPSB0aGlzLmxhc3RkYXRhLmF2ZV9vcHBfc2NvcmU7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBBdmUgPSB0aGlzLmxhc3RkYXRhLmF2ZV9zY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucFJhbmsgPSB0aGlzLmxhc3RkYXRhLnJhbms7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb3NpdGlvbiA9IHRoaXMubGFzdGRhdGEucG9zaXRpb247XHJcbiAgICAgIHRoaXMucFN0YXRzLnBQb2ludHMgPSB0aGlzLmxhc3RkYXRhLnBvaW50cztcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucExvT3BwU2NvcmUgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9PcHBTY29yZTtcclxuICAgICAgdGhpcy5wU3RhdHMucEhpU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wSGlTY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMucExvU2NvcmVSb3VuZHMgPSB0aGlzLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsUmFua3MgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxSYW5rcztcclxuICAgICAgdGhpcy5wU3RhdHMuYWxsU2NvcmVzID0gdGhpcy5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5hbGxPcHBTY29yZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnBSYnlSID0gdGhpcy5wbGF5ZXJfc3RhdHMucFJieVI7XHJcbiAgICAgIHRoaXMucFN0YXRzLnN0YXJ0V2lucyA9IHRoaXMucGxheWVyX3N0YXRzLnN0YXJ0V2lucztcclxuICAgICAgdGhpcy5wU3RhdHMuc3RhcnRzID0gdGhpcy5wbGF5ZXJfc3RhdHMuc3RhcnRzO1xyXG4gICAgICB0aGlzLnBTdGF0cy5yZXBseVdpbnMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBseVdpbnM7XHJcbiAgICAgIHRoaXMucFN0YXRzLnJlcGxpZXMgPSB0aGlzLnBsYXllcl9zdGF0cy5yZXBsaWVzO1xyXG5cclxuICAgICAgdGhpcy4kc3RvcmUuZGlzcGF0Y2goJ0RPX1NUQVRTJyx0cnVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNvbXB1dGVkOiB7XHJcbiAgICAuLi5WdWV4Lm1hcEdldHRlcnMoe1xyXG4gICAgICByZXN1bHRfZGF0YTogJ1JFU1VMVERBVEEnLFxyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3BsYXllcnM6ICdUT1RBTFBMQVlFUlMnLFxyXG4gICAgICB0b3RhbF9yb3VuZHM6ICdUT1RBTF9ST1VORFMnLFxyXG4gICAgICBzaG93U3RhdHM6ICdTSE9XU1RBVFMnLFxyXG4gICAgICBsYXN0ZGF0YTogJ0xBU1RSRERBVEEnLFxyXG4gICAgICBwbGF5ZXJkYXRhOiAnUExBWUVSREFUQScsXHJcbiAgICAgIHBsYXllcjogJ1BMQVlFUicsXHJcbiAgICAgIHBsYXllcl9zdGF0czogJ1BMQVlFUl9TVEFUUydcclxuICAgIH0pLFxyXG5cclxuICB9XHJcbn0pO1xyXG5cclxuIHZhciBSZXN1bHRzID0gVnVlLmNvbXBvbmVudCgncmVzdWx0cycsIHtcclxuICAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlIGhvdmVyIHJlc3BvbnNpdmUgc3RyaXBlZCBmb290LWNsb25lIDpmaWVsZHM9XCJyZXN1bHRzX2ZpZWxkc1wiIDppdGVtcz1cInJlc3VsdChjdXJyZW50Um91bmQpXCIgaGVhZC12YXJpYW50PVwiZGFya1wiIGNsYXNzPVwiYW5pbWF0ZWQgZmFkZUluVXBcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ2N1cnJlbnRSb3VuZCcsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHRzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgY3JlYXRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJlc3VsdHNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JhbmsnLCBsYWJlbDogJyMnLCBjbGFzczogJ3RleHQtY2VudGVyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIC8vIHsga2V5OiAncG9zaXRpb24nLGxhYmVsOiAnUG9zaXRpb24nLCdjbGFzcyc6J3RleHQtY2VudGVyJ30sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdzY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmIGl0ZW0uc2NvcmUgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ0FSJztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnNjb3JlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAnb3BwbycsIGxhYmVsOiAnT3Bwb25lbnQnIH0sXHJcbiAgICAgIC8vIHsga2V5OiAnb3BwX3Bvc2l0aW9uJywgbGFiZWw6ICdQb3NpdGlvbicsJ2NsYXNzJzogJ3RleHQtY2VudGVyJ30sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ1Njb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBpZiAoaXRlbS5vcHBvX3Njb3JlID09IDAgJiYgaXRlbS5zY29yZSA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnQVInO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0ub3Bwb19zY29yZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnZGlmZicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChpdGVtLm9wcG9fc2NvcmUgPT0gMCAmJiBpdGVtLnNjb3JlID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICctJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICByZXN1bHQ6IGZ1bmN0aW9uKHIpIHtcclxuICAgICAgbGV0IHJvdW5kID0gciAtIDE7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGFbcm91bmRdKTtcclxuXHJcbiAgICAgIF8uZm9yRWFjaChkYXRhLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IG9wcF9ubyA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICAvLyBGaW5kIHdoZXJlIHRoZSBvcHBvbmVudCdzIGN1cnJlbnQgcG9zaXRpb24gYW5kIGFkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgbGV0IHJvdyA9IF8uZmluZChkYXRhLCB7IHBubzogb3BwX25vIH0pO1xyXG4gICAgICAgIHJbJ29wcF9wb3NpdGlvbiddID0gcm93LnBvc2l0aW9uO1xyXG4gICAgICAgIC8vIGNoZWNrIHJlc3VsdCAod2luLCBsb3NzLCBkcmF3KVxyXG4gICAgICAgIGxldCByZXN1bHQgPSByLnJlc3VsdDtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ10gPSBbXTtcclxuICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdzdWNjZXNzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2xvc3MnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnZGFuZ2VyJztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbnZhciBTdGFuZGluZ3MgPSBWdWUuY29tcG9uZW50KCdzdGFuZGluZ3MnLHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwicmVzdWx0KGN1cnJlbnRSb3VuZClcIiA6ZmllbGRzPVwic3RhbmRpbmdzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIiBjbGFzcz1cImFuaW1hdGVkIGZhZGVJblVwXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwicmFua1wiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS52YWx1ZS5yYW5rfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJwbGF5ZXJcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUucGxheWVyfX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ3b25Mb3N0XCI+PC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJtYXJnaW5cIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICB7e2RhdGEudmFsdWUubWFyZ2lufX1cclxuICAgICAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJsYXN0R2FtZVwiPlxyXG4gICAgICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbiAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdjdXJyZW50Um91bmQnLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhbmRpbmdzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbW91bnRlZDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnN0YW5kaW5nc19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncmFuaycsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dpbi1EcmF3LUxvc3MnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLndpbnN9IC0gJHtpdGVtLmRyYXdzfSAtICR7aXRlbS5sb3NzZXN9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAncG9pbnRzJyxcclxuICAgICAgICBsYWJlbDogJ1BvaW50cycsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uYXIgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30qYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2xhc3RHYW1lJyxcclxuICAgICAgICBsYWJlbDogJ0xhc3QgR2FtZScsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgaXRlbS5zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ub3Bwb19zY29yZSA9PSAwICYmXHJcbiAgICAgICAgICAgIGl0ZW0ucmVzdWx0ID09ICdhd2FpdGluZydcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYEF3YWl0aW5nIHJlc3VsdCBvZiBnYW1lICR7aXRlbS5yb3VuZH0gdnMgJHtpdGVtLm9wcG99YDtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gYGEgJHtpdGVtLnNjb3JlfS0ke2l0ZW0ub3Bwb19zY29yZX1cclxuICAgICAgICAgICAgJHtpdGVtLnJlc3VsdC50b1VwcGVyQ2FzZSgpfSB2cyAke2l0ZW0ub3Bwb30gYDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIHJlc3VsdChyKSB7XHJcbiAgICAgIGxldCByb3VuZCA9IHIgLSAxO1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhW3JvdW5kXSk7XHJcbiAgICAgIF8uZm9yRWFjaChkYXRhLCBmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgbGV0IG9wcF9ubyA9IHJbJ29wcG9fbm8nXTtcclxuICAgICAgICAvLyBGaW5kIHdoZXJlIHRoZSBvcHBvbmVudCdzIGN1cnJlbnQgcG9zaXRpb24gYW5kIGFkZCB0byBjb2xsZWN0aW9uXHJcbiAgICAgICAgbGV0IHJvdyA9IF8uZmluZChkYXRhLCB7IHBubzogb3BwX25vIH0pO1xyXG4gICAgICAgIHJbJ29wcF9wb3NpdGlvbiddID0gcm93Wydwb3NpdGlvbiddO1xyXG4gICAgICAgIC8vIGNoZWNrIHJlc3VsdCAod2luLCBsb3NzLCBkcmF3KVxyXG4gICAgICAgIGxldCByZXN1bHQgPSByWydyZXN1bHQnXTtcclxuXHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddID0gW107XHJcbiAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ3dhcm5pbmcnO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICd3aW4nKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnc3VjY2Vzcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdsb3NzJykge1xyXG4gICAgICAgICAgclsnX2NlbGxWYXJpYW50cyddWydsYXN0R2FtZSddID0gJ2Rhbmdlcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPT09ICdhd2FpdGluZycpIHtcclxuICAgICAgICAgIHJbJ19jZWxsVmFyaWFudHMnXVsnbGFzdEdhbWUnXSA9ICdpbmZvJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ2RyYXcnKSB7XHJcbiAgICAgICAgICByWydfY2VsbFZhcmlhbnRzJ11bJ2xhc3RHYW1lJ10gPSAnd2FybmluZyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAuc29ydEJ5KCdtYXJnaW4nKVxyXG4gICAgICAgIC5zb3J0QnkoJ3BvaW50cycpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmNvbnN0IFBhaXJpbmdzID1WdWUuY29tcG9uZW50KCdwYWlyaW5ncycsICB7XHJcbiAgdGVtcGxhdGU6IGBcclxuPHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXIgdGFibGUtcmVzcG9uc2l2ZSB0YWJsZS1zdHJpcGVkICBhbmltYXRlZCBmYWRlSW5VcFwiPlxyXG4gICAgPGNhcHRpb24+e3tjYXB0aW9ufX08L2NhcHRpb24+XHJcbiAgICA8dGhlYWQgY2xhc3M9XCJ0aGVhZC1kYXJrXCI+XHJcbiAgICAgICAgPHRyPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPiM8L3RoPlxyXG4gICAgICAgIDx0aCBzY29wZT1cImNvbFwiPlBsYXllcjwvdGg+XHJcbiAgICAgICAgPHRoIHNjb3BlPVwiY29sXCI+T3Bwb25lbnQ8L3RoPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICA8L3RoZWFkPlxyXG4gICAgPHRib2R5PlxyXG4gICAgICAgIDx0ciB2LWZvcj1cIihwbGF5ZXIsaSkgaW4gcGFpcmluZyhjdXJyZW50Um91bmQpXCIgOmtleT1cImlcIj5cclxuICAgICAgICA8dGggc2NvcGU9XCJyb3dcIj57e2kgKyAxfX08L3RoPlxyXG4gICAgICAgIDx0ZD48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0neSdcIj4qPC9zdXA+e3twbGF5ZXIucGxheWVyfX08L3RkPlxyXG4gICAgICAgIDx0ZD48c3VwIHYtaWY9XCJwbGF5ZXIuc3RhcnQgPT0nbidcIj4qPC9zdXA+e3twbGF5ZXIub3Bwb319PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgPC90Ym9keT5cclxuICA8L3RhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAnY3VycmVudFJvdW5kJywgJ3Jlc3VsdGRhdGEnXSxcclxuXHJcbiAgbWV0aG9kczoge1xyXG4gICAgLy8gZ2V0IHBhaXJpbmdcclxuICAgIHBhaXJpbmcocikge1xyXG4gICAgICBsZXQgcm91bmQgPSByIC0gMTtcclxuICAgICAgbGV0IHJvdW5kX3JlcyA9IHRoaXMucmVzdWx0ZGF0YVtyb3VuZF07XHJcbiAgICAgIC8vIFNvcnQgYnkgcGxheWVyIG51bWJlcmluZyBpZiByb3VuZCAxIHRvIG9idGFpbiByb3VuZCAxIHBhaXJpbmdcclxuICAgICAgaWYgKHIgPT09IDEpIHtcclxuICAgICAgICByb3VuZF9yZXMgPSBfLnNvcnRCeShyb3VuZF9yZXMsICdwbm8nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHBhaXJlZF9wbGF5ZXJzID0gW107XHJcblxyXG4gICAgICBsZXQgcnAgPSBfLm1hcChyb3VuZF9yZXMsIGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gclsncG5vJ107XHJcbiAgICAgICAgbGV0IG9wcG9uZW50ID0gclsnb3Bwb19ubyddO1xyXG4gICAgICAgIGlmIChfLmluY2x1ZGVzKHBhaXJlZF9wbGF5ZXJzLCBwbGF5ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhaXJlZF9wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwYWlyZWRfcGxheWVycy5wdXNoKG9wcG9uZW50KTtcclxuICAgICAgICByZXR1cm4gcjtcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBfLmNvbXBhY3QocnApO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7UGFpcmluZ3MsIFN0YW5kaW5ncywgUGxheWVyTGlzdCwgUmVzdWx0c31cclxuXHJcbiIsIlxyXG5pbXBvcnQgYmFzZVVSTCBmcm9tICcuLi9jb25maWcuanMnO1xyXG5sZXQgU2NvcmVib2FyZCA9IFZ1ZS5jb21wb25lbnQoJ3Njb3JlYm9hcmQnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwicm93IGQtZmxleCBhbGlnbi1pdGVtcy1jZW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gIDx0ZW1wbGF0ZSB2LWlmPVwibG9hZGluZ3x8ZXJyb3JcIj5cclxuICAgICAgICA8ZGl2IHYtaWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGxvYWRpbmc+PC9sb2FkaW5nPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgdi1pZj1cImVycm9yXCIgY2xhc3M9XCJjb2wgYWxpZ24tc2VsZi1jZW50ZXJcIj5cclxuICAgICAgICAgICAgPGVycm9yPlxyXG4gICAgICAgICAgICA8cCBzbG90PVwiZXJyb3JcIj57e2Vycm9yfX08L3A+XHJcbiAgICAgICAgICAgIDxwIHNsb3Q9XCJlcnJvcl9tc2dcIj57e2Vycm9yX21zZ319PC9wPlxyXG4gICAgICAgICAgICA8L2Vycm9yPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gIDwvdGVtcGxhdGU+XHJcbiAgPHRlbXBsYXRlIHYtZWxzZT5cclxuICA8ZGl2IGNsYXNzPVwiY29sXCIgaWQ9XCJzY29yZWJvYXJkXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IG5vLWd1dHRlcnMgZC1mbGV4IGFsaWduLWl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCIgdi1mb3I9XCJpIGluIHJvd0NvdW50XCIgOmtleT1cImlcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1zbS02IGNvbC0xMiBcIiB2LWZvcj1cInBsYXllciBpbiBpdGVtQ291bnRJblJvdyhpKVwiIDprZXk9XCJwbGF5ZXIucmFua1wiPlxyXG4gICAgICAgIDxiLW1lZGlhIGNsYXNzPVwicGItMCBtYi0xIG1yLTFcIiB2ZXJ0aWNhbC1hbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdiBzbG90PVwiYXNpZGVcIj5cclxuICAgICAgICAgICAgPGItcm93IGNsYXNzPVwianVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgICAgICAgIDxiLWltZyByb3VuZGVkPVwiY2lyY2xlXCIgOnNyYz1cInBsYXllci5waG90b1wiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIDphbHQ9XCJwbGF5ZXIucGxheWVyXCIgY2xhc3M9XCJhbmltYXRlZCBmYWRlSW5cIi8+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgICAgPGItcm93IGNsYXNzPVwianVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxiLWNvbCBjb2xzPVwiMTJcIiBtZD1cImF1dG9cIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmxhZy1pY29uXCIgOnRpdGxlPVwicGxheWVyLmNvdW50cnlfZnVsbFwiXHJcbiAgICAgICAgICAgICAgICAgIDpjbGFzcz1cIidmbGFnLWljb24tJytwbGF5ZXIuY291bnRyeSB8IGxvd2VyY2FzZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgICAgIDxiLWNvbCBjb2wgbGc9XCIyXCI+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhXCIgdi1iaW5kOmNsYXNzPVwieydmYS1tYWxlJzogcGxheWVyLmdlbmRlciA9PT0gJ20nLFxyXG4gICAgICAgICAgICAgICAgICAgICAnZmEtZmVtYWxlJzogcGxheWVyLmdlbmRlciA9PT0gJ2YnIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgPC9iLWNvbD5cclxuICAgICAgICAgICAgPC9iLXJvdz5cclxuICAgICAgICAgICAgPGItcm93IGNsYXNzPVwidGV4dC1jZW50ZXJcIiB2LWlmPVwicGxheWVyLnRlYW1cIj5cclxuICAgICAgICAgICAgICA8Yi1jb2w+PHNwYW4+e3twbGF5ZXIudGVhbX19PC9zcGFuPjwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICAgIDxiLXJvdz5cclxuICAgICAgICAgICAgICA8Yi1jb2wgY2xhc3M9XCJ0ZXh0LXdoaXRlXCIgdi1iaW5kOmNsYXNzPVwieyd0ZXh0LXdhcm5pbmcnOiBwbGF5ZXIucmVzdWx0ID09PSAnZHJhdycsXHJcbiAgICAgICAgICAgICAndGV4dC1pbmZvJzogcGxheWVyLnJlc3VsdCA9PT0gJ2F3YWl0aW5nJyxcclxuICAgICAgICAgICAgICd0ZXh0LWRhbmdlcic6IHBsYXllci5yZXN1bHQgPT09ICdsb3NzJyxcclxuICAgICAgICAgICAgICd0ZXh0LXN1Y2Nlc3MnOiBwbGF5ZXIucmVzdWx0ID09PSAnd2luJyB9XCI+XHJcbiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJ0ZXh0LWNlbnRlciBwb3NpdGlvbiAgbXQtMVwiPlxyXG4gICAgICAgICAgICAgICAgICB7e3BsYXllci5wb3NpdGlvbn19XHJcbiAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J2ZhLWxvbmctYXJyb3ctdXAnOiBwbGF5ZXIucmFuayA8IHBsYXllci5sYXN0cmFuaywnZmEtbG9uZy1hcnJvdy1kb3duJzogcGxheWVyLnJhbmsgPiBwbGF5ZXIubGFzdHJhbmssXHJcbiAgICAgICAgICAgICAgICAgJ2ZhLWFycm93cy1oJzogcGxheWVyLnJhbmsgPT0gcGxheWVyLmxhc3RyYW5rIH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICA8L2g0PlxyXG4gICAgICAgICAgICAgIDwvYi1jb2w+XHJcbiAgICAgICAgICAgIDwvYi1yb3c+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxoNSBjbGFzcz1cIm0tMCAgYW5pbWF0ZWQgZmFkZUluTGVmdFwiPnt7cGxheWVyLnBsYXllcn19PC9oNT5cclxuICAgICAgICAgIDxwIGNsYXNzPVwiY2FyZC10ZXh0IG10LTBcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzZGF0YSBwb2ludHMgcC0xXCI+e3twbGF5ZXIucG9pbnRzfX0te3twbGF5ZXIubG9zc2VzfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic2RhdGEgbWFyXCI+e3twbGF5ZXIubWFyZ2luIHwgYWRkcGx1c319PC9zcGFuPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNkYXRhIHAxXCI+d2FzIHt7cGxheWVyLmxhc3Rwb3NpdGlvbn19PC9zcGFuPlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICA8Yi1jb2w+XHJcbiAgICAgICAgICAgICAgPHNwYW4gdi1pZj1cInBsYXllci5yZXN1bHQgPT0nYXdhaXRpbmcnIFwiIGNsYXNzPVwiYmctaW5mbyBkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiPnt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhciB9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgbWwtMSB0ZXh0LXdoaXRlIHJlc3VsdFwiIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICdiZy1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IHBsYXllci5yZXN1bHQgPT09ICdhd2FpdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj5cclxuICAgICAgICAgICAgICAgIHt7cGxheWVyLnJlc3VsdCB8IGZpcnN0Y2hhcn19PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHYtaWY9XCJwbGF5ZXIucmVzdWx0ID09J2F3YWl0aW5nJyBcIiBjbGFzcz1cInRleHQtaW5mbyBkLWlubGluZSBwLTEgIHNkYXRhXCI+QXdhaXRpbmdcclxuICAgICAgICAgICAgICAgIFJlc3VsdDwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiB2LWVsc2UgY2xhc3M9XCJkLWlubGluZSBwLTEgc2RhdGFcIiB2LWJpbmQ6Y2xhc3M9XCJ7J3RleHQtd2FybmluZyc6IHBsYXllci5yZXN1bHQgPT09ICdkcmF3JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAndGV4dC1kYW5nZXInOiBwbGF5ZXIucmVzdWx0ID09PSAnbG9zcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtc3VjY2Vzcyc6IHBsYXllci5yZXN1bHQgPT09ICd3aW4nIH1cIj57e3BsYXllci5zY29yZX19XHJcbiAgICAgICAgICAgICAgICAtIHt7cGxheWVyLm9wcG9fc2NvcmV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtYmxvY2sgcC0wIG1sLTEgb3BwXCI+dnMge3twbGF5ZXIub3Bwb319PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGFsaWduLWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxiLWNvbD5cclxuICAgICAgICAgICAgICA8c3BhbiA6dGl0bGU9XCJyZXNcIiB2LWZvcj1cInJlcyBpbiBwbGF5ZXIucHJldnJlc3VsdHNcIiA6a2V5PVwicmVzLmtleVwiXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMSB0ZXh0LXdoaXRlIHNkYXRhLXJlcyB0ZXh0LWNlbnRlclwiIHYtYmluZDpjbGFzcz1cInsnYmctd2FybmluZyc6IHJlcyA9PT0gJ2RyYXcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAnYmctaW5mbyc6IHJlcyA9PT0gJ2F3YWl0aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgJ2JnLWRhbmdlcic6IHJlcyA9PT0gJ2xvc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAnYmctc3VjY2Vzcyc6IHJlcyA9PT0gJ3dpbicgfVwiPnt7cmVzfGZpcnN0Y2hhcn19PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2ItY29sPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9iLW1lZGlhPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDwvdGVtcGxhdGU+XHJcbjwvZGl2PlxyXG4gICAgYCxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGl0ZW1zUGVyUm93OiA0LFxyXG4gICAgICBwZXJfcGFnZTogNDAsXHJcbiAgICAgIHBhcmVudF9zbHVnOiB0aGlzLiRyb3V0ZS5wYXJhbXMuc2x1ZyxcclxuICAgICAgcGFnZXVybDogYmFzZVVSTCArIHRoaXMuJHJvdXRlLnBhdGgsXHJcbiAgICAgIHNsdWc6IHRoaXMuJHJvdXRlLnBhcmFtcy5ldmVudF9zbHVnLFxyXG4gICAgICByZWxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICBjdXJyZW50UGFnZTogMSxcclxuICAgICAgcGVyaW9kOiAwLjUsXHJcbiAgICAgIHRpbWVyOiBudWxsLFxyXG4gICAgICBzY29yZWJvYXJkX2RhdGE6IFtdLFxyXG4gICAgICByZXNwb25zZV9kYXRhOiBbXSxcclxuICAgICAgLy8gcGxheWVyczogW10sXHJcbiAgICAgIC8vIHRvdGFsX3JvdW5kczogMCxcclxuICAgICAgY3VycmVudFJvdW5kOiBudWxsLFxyXG4gICAgICBldmVudF90aXRsZTogJycsXHJcbiAgICAgIGlzX2xpdmVfZ2FtZTogdHJ1ZSxcclxuICAgIH07XHJcbiAgfSxcclxuXHJcbiAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gdGhpcy5mZXRjaFNjb3JlYm9hcmREYXRhKCk7XHJcbiAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpXHJcbiAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoXHJcbiAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMucmVsb2FkKCk7XHJcbiAgICAgIH0uYmluZCh0aGlzKSxcclxuICAgICAgdGhpcy5wZXJpb2QgKiA2MDAwMFxyXG4gICAgKTtcclxuXHJcbiAgfSxcclxuICBiZWZvcmVEZXN0cm95OiBmdW5jdGlvbigpIHtcclxuICAgIC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmdldFdpbmRvd1dpZHRoKTtcclxuICAgIHRoaXMuY2FuY2VsQXV0b1VwZGF0ZSgpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgIGNhbmNlbEF1dG9VcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG4gICAgfSxcclxuICAgIGZldGNoU2NvcmVib2FyZERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB0aGlzLiRzdG9yZS5kaXNwYXRjaCgnRkVUQ0hfREFUQScsIHRoaXMuc2x1Zyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2x1Zyk7XHJcbiAgICB9LFxyXG4gICAgcmVsb2FkOiBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHRoaXMuaXNfbGl2ZV9nYW1lID09IHRydWUpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEZXRhaWxzKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgaXRlbUNvdW50SW5Sb3c6IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNjb3JlYm9hcmRfZGF0YS5zbGljZShcclxuICAgICAgICAoaW5kZXggLSAxKSAqIHRoaXMuaXRlbXNQZXJSb3csXHJcbiAgICAgICAgaW5kZXggKiB0aGlzLml0ZW1zUGVyUm93XHJcbiAgICAgICk7XHJcbiAgICB9LFxyXG4gICAgcHJvY2Vzc0RldGFpbHM6IGZ1bmN0aW9uKGN1cnJlbnRQYWdlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMucmVzdWx0X2RhdGEpXHJcbiAgICAgIGxldCByZXN1bHRkYXRhID0gdGhpcy5yZXN1bHRfZGF0YTtcclxuICAgICAgbGV0IGluaXRpYWxSZERhdGEgPSBfLmluaXRpYWwoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICAgIGxldCBwcmV2aW91c1JkRGF0YSA9IF8ubGFzdChpbml0aWFsUmREYXRhKTtcclxuICAgICAgbGV0IGxhc3RSZEQgPSBfLmxhc3QoXy5jbG9uZShyZXN1bHRkYXRhKSk7XHJcbiAgICAgIGxldCBsYXN0UmREYXRhID0gXy5tYXAobGFzdFJkRCwgcGxheWVyID0+IHtcclxuICAgICAgICBsZXQgeCA9IHBsYXllci5wbm8gLSAxO1xyXG4gICAgICAgIHBsYXllci5waG90byA9IHRoaXMucGxheWVyc1t4XS5waG90bztcclxuICAgICAgICBwbGF5ZXIuZ2VuZGVyID0gdGhpcy5wbGF5ZXJzW3hdLmdlbmRlcjtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeV9mdWxsID0gdGhpcy5wbGF5ZXJzW3hdLmNvdW50cnlfZnVsbDtcclxuICAgICAgICBwbGF5ZXIuY291bnRyeSA9IHRoaXMucGxheWVyc1t4XS5jb3VudHJ5O1xyXG4gICAgICAgIC8vIGlmIChcclxuICAgICAgICAvLyAgIHBsYXllci5yZXN1bHQgPT0gJ2RyYXcnICYmXHJcbiAgICAgICAgLy8gICBwbGF5ZXIuc2NvcmUgPT0gMCAmJlxyXG4gICAgICAgIC8vICAgcGxheWVyLm9wcG9fc2NvcmUgPT0gMFxyXG4gICAgICAgIC8vICkge1xyXG4gICAgICAgIC8vICAgcGxheWVyLnJlc3VsdCA9ICdBUic7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGlmIChwcmV2aW91c1JkRGF0YSkge1xyXG4gICAgICAgICAgbGV0IHBsYXllckRhdGEgPSBfLmZpbmQocHJldmlvdXNSZERhdGEsIHtcclxuICAgICAgICAgICAgcGxheWVyOiBwbGF5ZXIucGxheWVyLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwbGF5ZXIubGFzdHBvc2l0aW9uID0gcGxheWVyRGF0YVsncG9zaXRpb24nXTtcclxuICAgICAgICAgIHBsYXllci5sYXN0cmFuayA9IHBsYXllckRhdGFbJ3JhbmsnXTtcclxuICAgICAgICAgIC8vIHByZXZpb3VzIHJvdW5kcyByZXN1bHRzXHJcbiAgICAgICAgICBwbGF5ZXIucHJldnJlc3VsdHMgPSBfLmNoYWluKGluaXRpYWxSZERhdGEpXHJcbiAgICAgICAgICAgIC5mbGF0dGVuRGVlcCgpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICAgIHJldHVybiB2LnBsYXllciA9PT0gcGxheWVyLnBsYXllcjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm1hcCgncmVzdWx0JylcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gdGhpcy50b3RhbF9yb3VuZHMgPSByZXN1bHRkYXRhLmxlbmd0aDtcclxuICAgICAgdGhpcy5jdXJyZW50Um91bmQgPSBsYXN0UmREYXRhWzBdLnJvdW5kO1xyXG4gICAgICBsZXQgY2h1bmtzID0gXy5jaHVuayhsYXN0UmREYXRhLCB0aGlzLnRvdGFsX3BsYXllcnMpO1xyXG4gICAgICAvLyB0aGlzLnJlbG9hZGluZyA9IGZhbHNlXHJcbiAgICAgIHRoaXMuc2NvcmVib2FyZF9kYXRhID0gY2h1bmtzW2N1cnJlbnRQYWdlIC0gMV07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLlZ1ZXgubWFwR2V0dGVycyh7XHJcbiAgICAgIHJlc3VsdF9kYXRhOiAnUkVTVUxUREFUQScsXHJcbiAgICAgIHBsYXllcnM6ICdQTEFZRVJTJyxcclxuICAgICAgdG90YWxfcGxheWVyczogJ1RPVEFMUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGxvYWRpbmc6ICdMT0FESU5HJyxcclxuICAgICAgZXJyb3I6ICdFUlJPUicsXHJcbiAgICAgIGNhdGVnb3J5OiAnQ0FURUdPUlknLFxyXG4gICAgfSksXHJcbiAgICByb3dDb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5zY29yZWJvYXJkX2RhdGEubGVuZ3RoIC8gdGhpcy5pdGVtc1BlclJvdyk7XHJcbiAgICB9LFxyXG4gICAgZXJyb3JfbXNnOiBmdW5jdGlvbigpIHtcclxuICAgICAgcmV0dXJuIGBXZSBhcmUgY3VycmVudGx5IGV4cGVyaWVuY2luZyBuZXR3b3JrIGlzc3VlcyBmZXRjaGluZyB0aGlzIHBhZ2UgJHtcclxuICAgICAgICB0aGlzLnBhZ2V1cmxcclxuICAgICAgfSBgO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNjb3JlYm9hcmQ7IiwiIGxldCBMb1dpbnMgPSBWdWUuY29tcG9uZW50KCdsb3dpbnMnLCB7XHJcbiAgdGVtcGxhdGU6IGA8IS0tIExvdyBXaW5uaW5nIFNjb3JlcyAtLT5cclxuICAgIDxiLXRhYmxlIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldExvd1Njb3JlKCd3aW4nKVwiIDpmaWVsZHM9XCJsb3d3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG4gICAgYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3Jlc3VsdGRhdGEnXSxcclxuICBkYXRhOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvd3dpbnNfZmllbGRzOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBiZWZvcmVNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLmxvd3dpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRMb3dTY29yZTogZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWluQnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpV2lucyA9VnVlLmNvbXBvbmVudCgnaGl3aW5zJywge1xyXG4gIHRlbXBsYXRlOiBgPCEtLSBIaWdoIFdpbm5pbmcgU2NvcmVzIC0tPlxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImdldEhpU2NvcmUoJ3dpbicpXCIgOmZpZWxkcz1cImhpZ2h3aW5zX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaWdod2luc19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlnaHdpbnNfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnV2lubmluZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvJywgbGFiZWw6ICdMb3NlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXhCeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuc2NvcmU7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnc2NvcmUnKVxyXG4gICAgICAgIC52YWx1ZSgpXHJcbiAgICAgICAgLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpTG9zcyA9IFZ1ZS5jb21wb25lbnQoJ2hpbG9zcycsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPCEtLSBIaWdoIExvc2luZyBTY29yZXMgLS0+XHJcbiAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJnZXRIaVNjb3JlKCdsb3NzJylcIiA6ZmllbGRzPVwiaGlsb3NzX2ZpZWxkc1wiIGhlYWQtdmFyaWFudD1cImRhcmtcIj5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAge3tjYXB0aW9ufX1cclxuICAgICAgICA8L3RlbXBsYXRlPlxyXG4gICAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGlsb3NzX2ZpZWxkczogW10sXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgYmVmb3JlTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5oaWxvc3NfZmllbGRzID0gW1xyXG4gICAgICB7IGtleTogJ3JvdW5kJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdzY29yZScsIGxhYmVsOiAnTG9zaW5nIFNjb3JlJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAgeyBrZXk6ICdvcHBvX3Njb3JlJywgbGFiZWw6ICdXaW5uaW5nIFNjb3JlJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ1dpbm5lcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBnZXRIaVNjb3JlOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBfLmNsb25lKHRoaXMucmVzdWx0ZGF0YSk7XHJcbiAgICAgIHJldHVybiBfLmNoYWluKGRhdGEpXHJcbiAgICAgICAgLm1hcChmdW5jdGlvbihyKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5jaGFpbihyKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gbTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG5bJ3Jlc3VsdCddID09PSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxubGV0IENvbWJvU2NvcmVzID0gVnVlLmNvbXBvbmVudCgnY29tYm9zY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGljb21ibygpXCIgOmZpZWxkcz1cImhpY29tYm9fZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAge3tjYXB0aW9ufX1cclxuICAgIDwvdGVtcGxhdGU+XHJcbiAgPC9iLXRhYmxlPlxyXG5gLFxyXG4gIHByb3BzOiBbJ2NhcHRpb24nLCAncmVzdWx0ZGF0YSddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaGljb21ib19maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGljb21ib19maWVsZHMgPSBbXHJcbiAgICAgIHsga2V5OiAncm91bmQnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnY29tYm9fc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQ29tYmluZWQgU2NvcmUnLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnV2lubmluZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdvcHBvX3Njb3JlJyxcclxuICAgICAgICBsYWJlbDogJ0xvc2luZyBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaWNvbWJvKCkge1xyXG4gICAgICBsZXQgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmNvbWJvX3Njb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ2NvbWJvX3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbFNjb3JlcyA9IFZ1ZS5jb21wb25lbnQoJ3RvdGFsc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJpbmRleFwiIHNsb3Qtc2NvcGU9XCJkYXRhXCI+XHJcbiAgICAgICAgICAgIHt7ZGF0YS5pbmRleCArIDF9fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAndG90YWxfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnVG90YWwgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBUb3RhbE9wcFNjb3JlcyA9VnVlLmNvbXBvbmVudCgnb3Bwc2NvcmVzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cInN0YXRzXCIgOmZpZWxkcz1cInRvdGFsb3Bwc2NvcmVfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgICAgICA8dGVtcGxhdGUgc2xvdD1cInRhYmxlLWNhcHRpb25cIj5cclxuICAgICAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwiaW5kZXhcIiBzbG90LXNjb3BlPVwiZGF0YVwiPlxyXG4gICAgICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdzdGF0cyddLFxyXG4gIGRhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG90YWxvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMudG90YWxvcHBzY29yZV9maWVsZHMgPSBbXHJcbiAgICAgICdpbmRleCcsXHJcbiAgICAgIHsga2V5OiAncG9zaXRpb24nLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAndG90YWxfb3Bwc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnVG90YWwgT3Bwb25lbnQgU2NvcmUnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIHNvcnRhYmxlOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgICB7IGtleTogJ3BsYXllcicsIGxhYmVsOiAnUGxheWVyJywgY2xhc3M6ICd0ZXh0LWNlbnRlcicgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ3dvbkxvc3QnLFxyXG4gICAgICAgIGxhYmVsOiAnV29uLUxvc3QnLFxyXG4gICAgICAgIHNvcnRhYmxlOiBmYWxzZSxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwga2V5LCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBsZXQgbG9zcyA9IGl0ZW0ucm91bmQgLSBpdGVtLnBvaW50cztcclxuICAgICAgICAgIHJldHVybiBgJHtpdGVtLnBvaW50c30gLSAke2xvc3N9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnbWFyZ2luJyxcclxuICAgICAgICBsYWJlbDogJ1NwcmVhZCcsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiB2YWx1ZSA9PiB7XHJcbiAgICAgICAgICBpZiAodmFsdWUgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgKyR7dmFsdWV9YDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuIGxldCBBdmVTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICByZXNwb25zaXZlIGhvdmVyIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9zY29yZScsXHJcbiAgICAgICAgbGFiZWw6ICdBdmVyYWdlIFNjb3JlJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgeyBrZXk6ICdwbGF5ZXInLCBsYWJlbDogJ1BsYXllcicsIGNsYXNzOiAndGV4dC1jZW50ZXInIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICd3b25Mb3N0JyxcclxuICAgICAgICBsYWJlbDogJ1dvbi1Mb3N0JyxcclxuICAgICAgICBzb3J0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIGtleSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgbGV0IGxvc3MgPSBpdGVtLnJvdW5kIC0gaXRlbS5wb2ludHM7XHJcbiAgICAgICAgICByZXR1cm4gYCR7aXRlbS5wb2ludHN9IC0gJHtsb3NzfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ21hcmdpbicsXHJcbiAgICAgICAgbGFiZWw6ICdTcHJlYWQnLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogdmFsdWUgPT4ge1xyXG4gICAgICAgICAgaWYgKHZhbHVlID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYCske3ZhbHVlfWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYCR7dmFsdWV9YDtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmxldCBBdmVPcHBTY29yZXMgPSBWdWUuY29tcG9uZW50KCdhdmVvcHBzY29yZXMnLCB7XHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxiLXRhYmxlICBob3ZlciByZXNwb25zaXZlIHN0cmlwZWQgZm9vdC1jbG9uZSA6aXRlbXM9XCJzdGF0c1wiIDpmaWVsZHM9XCJhdmVvcHBzY29yZV9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgICAgICA8dGVtcGxhdGUgc2xvdD1cImluZGV4XCIgc2xvdC1zY29wZT1cImRhdGFcIj5cclxuICAgICAgICAgICAge3tkYXRhLmluZGV4ICsgMX19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuYCxcclxuICBwcm9wczogWydjYXB0aW9uJywgJ3N0YXRzJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBhdmVvcHBzY29yZV9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuYXZlb3Bwc2NvcmVfZmllbGRzID0gW1xyXG4gICAgICAnaW5kZXgnLFxyXG4gICAgICB7IGtleTogJ3Bvc2l0aW9uJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgICAge1xyXG4gICAgICAgIGtleTogJ2F2ZV9vcHBfc2NvcmUnLFxyXG4gICAgICAgIGxhYmVsOiAnQXZlcmFnZSBPcHBvbmVudCBTY29yZScsXHJcbiAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdQbGF5ZXInLCBjbGFzczogJ3RleHQtY2VudGVyJyB9LFxyXG4gICAgICB7XHJcbiAgICAgICAga2V5OiAnd29uTG9zdCcsXHJcbiAgICAgICAgbGFiZWw6ICdXb24tTG9zdCcsXHJcbiAgICAgICAgc29ydGFibGU6IGZhbHNlLFxyXG4gICAgICAgIGNsYXNzOiAndGV4dC1jZW50ZXInLFxyXG4gICAgICAgIGZvcm1hdHRlcjogKHZhbHVlLCBrZXksIGl0ZW0pID0+IHtcclxuICAgICAgICAgIGxldCBsb3NzID0gaXRlbS5yb3VuZCAtIGl0ZW0ucG9pbnRzO1xyXG4gICAgICAgICAgcmV0dXJuIGAke2l0ZW0ucG9pbnRzfSAtICR7bG9zc31gO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBrZXk6ICdtYXJnaW4nLFxyXG4gICAgICAgIGxhYmVsOiAnU3ByZWFkJyxcclxuICAgICAgICBjbGFzczogJ3RleHQtY2VudGVyJyxcclxuICAgICAgICBmb3JtYXR0ZXI6IHZhbHVlID0+IHtcclxuICAgICAgICAgIGlmICh2YWx1ZSA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGArJHt2YWx1ZX1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgfSxcclxufSk7XHJcblxyXG5sZXQgTG9TcHJlYWQgPSBWdWUuY29tcG9uZW50KCdsb3NwcmVhZCcsIHtcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGItdGFibGUgIHJlc3BvbnNpdmUgaG92ZXIgc3RyaXBlZCBmb290LWNsb25lIDppdGVtcz1cImxvU3ByZWFkKClcIiA6ZmllbGRzPVwibG9zcHJlYWRfZmllbGRzXCIgaGVhZC12YXJpYW50PVwiZGFya1wiPlxyXG4gICAgICAgIDx0ZW1wbGF0ZSBzbG90PVwidGFibGUtY2FwdGlvblwiPlxyXG4gICAgICAgICAgICB7e2NhcHRpb259fVxyXG4gICAgICAgIDwvdGVtcGxhdGU+XHJcbiAgICA8L2ItdGFibGU+XHJcbmAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb3NwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMubG9zcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBsb1NwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5taW5CeShmdW5jdGlvbih3KSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHcuZGlmZjtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc29ydEJ5KCdkaWZmJylcclxuICAgICAgICAudmFsdWUoKTtcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcblxyXG4gbGV0IEhpU3ByZWFkID0gICBWdWUuY29tcG9uZW50KCdoaXNwcmVhZCcse1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8Yi10YWJsZSAgcmVzcG9uc2l2ZSBob3ZlciBzdHJpcGVkIGZvb3QtY2xvbmUgOml0ZW1zPVwiaGlTcHJlYWQoKVwiIDpmaWVsZHM9XCJoaXNwcmVhZF9maWVsZHNcIiBoZWFkLXZhcmlhbnQ9XCJkYXJrXCI+XHJcbiAgICAgICAgPHRlbXBsYXRlIHNsb3Q9XCJ0YWJsZS1jYXB0aW9uXCI+XHJcbiAgICAgICAgICAgIHt7Y2FwdGlvbn19XHJcbiAgICAgICAgPC90ZW1wbGF0ZT5cclxuICAgIDwvYi10YWJsZT5cclxuICAgIGAsXHJcbiAgcHJvcHM6IFsnY2FwdGlvbicsICdyZXN1bHRkYXRhJ10sXHJcbiAgZGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoaXNwcmVhZF9maWVsZHM6IFtdLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIGJlZm9yZU1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuaGlzcHJlYWRfZmllbGRzID0gW1xyXG4gICAgICAncm91bmQnLFxyXG4gICAgICB7IGtleTogJ2RpZmYnLCBsYWJlbDogJ1NwcmVhZCcsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAnc2NvcmUnLCBsYWJlbDogJ1dpbm5pbmcgU2NvcmUnLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG9fc2NvcmUnLCBsYWJlbDogJ0xvc2luZyBTY29yZScsIHNvcnRhYmxlOiB0cnVlIH0sXHJcbiAgICAgIHsga2V5OiAncGxheWVyJywgbGFiZWw6ICdXaW5uZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxyXG4gICAgICB7IGtleTogJ29wcG8nLCBsYWJlbDogJ0xvc2VyJywgc29ydGFibGU6IHRydWUgfSxcclxuICAgIF07XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBoaVNwcmVhZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIGxldCBkYXRhID0gXy5jbG9uZSh0aGlzLnJlc3VsdGRhdGEpO1xyXG4gICAgICByZXR1cm4gXy5jaGFpbihkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24ocikge1xyXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4ocilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbihtKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIG07XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24obikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuWydyZXN1bHQnXSA9PT0gJ3dpbic7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tYXgoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LmRpZmY7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnNvcnRCeSgnZGlmZicpXHJcbiAgICAgICAgLnZhbHVlKClcclxuICAgICAgICAucmV2ZXJzZSgpO1xyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IHtIaVdpbnMsIExvV2lucyxIaUxvc3MsQ29tYm9TY29yZXMsVG90YWxTY29yZXMsVG90YWxPcHBTY29yZXMsQXZlU2NvcmVzLEF2ZU9wcFNjb3JlcyxIaVNwcmVhZCwgTG9TcHJlYWR9IiwibGV0IG1hcEdldHRlcnMgPSBWdWV4Lm1hcEdldHRlcnM7XHJcbmxldCB0b3BQZXJmb3JtZXJzID0gVnVlLmNvbXBvbmVudCgndG9wLXN0YXRzJywge1xyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGRpdiBjbGFzcz1cImNvbC1sZy0xMCBvZmZzZXQtbGctMSBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctMiBjb2wtc20tNCBjb2wtMTJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibXQtNSBkLWZsZXggZmxleC1jb2x1bW4gYWxpZ24tY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGp1c3RpZnktY29udGVudC1jZW50ZXJcIj5cclxuICAgICAgICAgIDxiLWJ1dHRvbiB2YXJpYW50PVwiYnRuLW91dGxpbmUtc3VjY2Vzc1wiIHRpdGxlPVwiVG9wIDNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCd0b3AzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0ndG9wMydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdHJvcGh5IG0tMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Ub3AgMzwvYi1idXR0b24+XHJcbiAgICAgICAgICA8Yi1idXR0b24gdmFyaWFudD1cImJ0bi1vdXRsaW5lLXN1Y2Nlc3NcIiB0aXRsZT1cIkhpZ2hlc3QgR2FtZSBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCdoaWdhbWVzJylcIiA6cHJlc3NlZD1cImN1cnJlbnRWaWV3PT0naGlnYW1lcydcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtYnVsbHNleWUgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggR2FtZXM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJidG4tb3V0bGluZS1zdWNjZXNzXCIgdGl0bGU9XCJIaWdoZXN0IEF2ZXJhZ2UgU2NvcmVzXCIgY2xhc3M9XCJtLTIgYnRuLWJsb2NrXCIgOnByZXNzZWQ9XCJjdXJyZW50Vmlldz09J2hpYXZlcydcIlxyXG4gICAgICAgICAgICBAY2xpY2s9XCJzaG93UGljKCdoaWF2ZXMnKVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS10aHVtYnMtdXAgbS0xXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPkhpZ2ggQXZlLiBTY29yZXM8L2ItYnV0dG9uPlxyXG4gICAgICAgICAgPGItYnV0dG9uIHZhcmlhbnQ9XCJidG4tb3V0bGluZS1zdWNjZXNzXCIgdGl0bGU9XCJMb3dlc3QgQXZlcmFnZSBPcHBvbmVudCBTY29yZXNcIiBjbGFzcz1cIm0tMiBidG4tYmxvY2tcIiBAY2xpY2s9XCJzaG93UGljKCdsb29wcGF2ZXMnKVwiIDpwcmVzc2VkPVwiY3VycmVudFZpZXc9PSdsb29wcGF2ZXMnXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWJlZXIgbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT5Mb3cgT3BwIEF2ZTwvYi1idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEwIGNvbC1zbS04IGNvbC0xMlwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1jb250ZW50LWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8aDM+e3t0aXRsZX19PC9oMz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBjb2wtMTIgYW5pbWF0ZWQgZmFkZUluUmlnaHRCaWdcIiB2LWZvcj1cIihpdGVtLCBpbmRleCkgaW4gc3RhdHNcIj5cclxuICAgICAgICAgICAgPGg0IGNsYXNzPVwicC0yIHRleHQtY2VudGVyIGJlYmFzIGJnLWRhcmsgdGV4dC13aGl0ZVwiPnt7aXRlbS5wbGF5ZXJ9fTwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4ganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICA8aW1nIDpzcmM9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLnBob3RvXCIgd2lkdGg9JzEyMCcgaGVpZ2h0PScxMjAnIGNsYXNzPVwiaW1nLWZsdWlkIHJvdW5kZWQtY2lyY2xlXCJcclxuICAgICAgICAgICAgICAgIDphbHQ9XCJwbGF5ZXJzW2l0ZW0ucG5vLTFdLnBvc3RfdGl0bGV8bG93ZXJjYXNlXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWJsb2NrIG1sLTVcIj5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwibXgtMSBmbGFnLWljb25cIiA6Y2xhc3M9XCInZmxhZy1pY29uLScrcGxheWVyc1tpdGVtLnBuby0xXS5jb3VudHJ5IHwgbG93ZXJjYXNlXCJcclxuICAgICAgICAgICAgICAgICAgOnRpdGxlPVwicGxheWVyc1tpdGVtLnBuby0xXS5jb3VudHJ5X2Z1bGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzcz1cIm14LTEgZmFcIlxyXG4gICAgICAgICAgICAgICAgICA6Y2xhc3M9XCJ7J2ZhLW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnbScsICdmYS1mZW1hbGUnOiBwbGF5ZXJzW2l0ZW0ucG5vLTFdLmdlbmRlciA9PSAnZid9XCJcclxuICAgICAgICAgICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWNvbnRlbnQtY2VudGVyIGJnLWRhcmsgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIiB2LWlmPVwiaXRlbS5wb2ludHNcIj57e2l0ZW0ucG9pbnRzfX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJteC0xIGRpc3BsYXktNSBkLWlubGluZS1ibG9jayBhbGlnbi1zZWxmLWNlbnRlclwiIHYtaWY9XCJpdGVtLm1hcmdpblwiPnt7aXRlbS5tYXJnaW58YWRkcGx1c319PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXgtMSB0ZXh0LWNlbnRlciBkaXNwbGF5LTUgZC1pbmxpbmUtYmxvY2sgYWxpZ24tc2VsZi1jZW50ZXJcIiB2LWlmPVwiaXRlbS5zY29yZVwiPlJvdW5kIHt7aXRlbS5yb3VuZH19IHZzIHt7aXRlbS5vcHBvfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZC1mbGV4IGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGJnLXN1Y2Nlc3MgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgdi1pZj1cIml0ZW0uc2NvcmVcIiBjbGFzcz1cImRpc3BsYXktNCB5YW5vbmUgZC1pbmxpbmUtZmxleFwiPnt7aXRlbS5zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5wb3NpdGlvblwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLnBvc2l0aW9ufX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IHYtaWY9XCJpdGVtLmF2ZV9zY29yZVwiIGNsYXNzPVwiZGlzcGxheS00IHlhbm9uZSBkLWlubGluZS1mbGV4XCI+e3tpdGVtLmF2ZV9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiB2LWlmPVwiaXRlbS5hdmVfb3BwX3Njb3JlXCIgY2xhc3M9XCJkaXNwbGF5LTQgeWFub25lIGQtaW5saW5lLWZsZXhcIj57e2l0ZW0uYXZlX29wcF9zY29yZX19PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgYCxcclxuICBkYXRhOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogJycsXHJcbiAgICAgIHByb2ZpbGVzIDogW10sXHJcbiAgICAgIHN0YXRzOiBbXSxcclxuICAgICAgY3VycmVudFZpZXc6ICcnXHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2hvd1BpYygndG9wMycpO1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgc2hvd1BpYzogZnVuY3Rpb24gKHQpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHRcclxuICAgICAgbGV0IGFycixyLHMgPSBbXTtcclxuICAgICAgaWYgKHQgPT0gJ2hpYXZlcycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdhdmVfc2NvcmUnKTtcclxuICAgICAgICByID0gXy50YWtlKGFyciwgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdhdmVfc2NvcmUnXSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMudGl0bGUgPSAnSGlnaGVzdCBBdmVyYWdlIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAnbG9vcHBhdmVzJykge1xyXG4gICAgICAgIGFyciA9IHRoaXMuZ2V0U3RhdHMoJ2F2ZV9vcHBfc2NvcmUnKTtcclxuICAgICAgICByID0gXy50YWtlUmlnaHQoYXJyLCAzKS5yZXZlcnNlKCkubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdhdmVfb3BwX3Njb3JlJ10pXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnRpdGxlPSdMb3dlc3QgT3Bwb25lbnQgQXZlcmFnZSBTY29yZXMnXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHQgPT0gJ2hpZ2FtZXMnKSB7XHJcbiAgICAgICAgYXJyID0gdGhpcy5jb21wdXRlU3RhdHMoKTtcclxuICAgICAgICByID0gXy50YWtlKGFyciwgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdzY29yZScsJ3JvdW5kJywnb3BwbyddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nSGlnaCBHYW1lIFNjb3JlcydcclxuICAgICAgfVxyXG4gICAgICBpZiAodCA9PSAndG9wMycpIHtcclxuICAgICAgICBhcnIgPSB0aGlzLmdldFN0YXRzKCdwb2ludHMnKTtcclxuICAgICAgICBzID0gXy5zb3J0QnkoYXJyLFsncG9pbnRzJywnbWFyZ2luJ10pLnJldmVyc2UoKVxyXG4gICAgICAgIHIgPSBfLnRha2UocywgMykubWFwKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICByZXR1cm4gXy5waWNrKHAsIFsncGxheWVyJywgJ3BubycsICdwb2ludHMnLCdtYXJnaW4nLCdwb3NpdGlvbiddKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy50aXRsZT0nVG9wIDMnXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RhdHMgPSByO1xyXG4gICAgICAvLyB0aGlzLnByb2ZpbGVzID0gdGhpcy5wbGF5ZXJzW3IucG5vLTFdO1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRTdGF0czogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICByZXR1cm4gXy5zb3J0QnkodGhpcy5maW5hbHN0YXRzLCBrZXkpLnJldmVyc2UoKTtcclxuICAgIH0sXHJcbiAgICBjb21wdXRlU3RhdHM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0YSA9IF8uY2xvbmUodGhpcy5yZXN1bHRkYXRhKTtcclxuICAgICAgcmV0dXJuIF8uY2hhaW4oZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKHIpIHtcclxuICAgICAgICAgIHJldHVybiBfLmNoYWluKHIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcclxuICAgICAgICAgICAgICByZXR1cm4gblsncmVzdWx0J10gPT09ICd3aW4nO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWF4QnkoZnVuY3Rpb24odykge1xyXG4gICAgICAgICAgICAgIHJldHVybiB3LnNjb3JlO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zb3J0QnkoJ3Njb3JlJylcclxuICAgICAgICAudmFsdWUoKVxyXG4gICAgICAgIC5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIC4uLm1hcEdldHRlcnMoe1xyXG4gICAgICBwbGF5ZXJzOiAnUExBWUVSUycsXHJcbiAgICAgIHRvdGFsX3JvdW5kczogJ1RPVEFMX1JPVU5EUycsXHJcbiAgICAgIGZpbmFsc3RhdHM6ICdGSU5BTF9ST1VORF9TVEFUUycsXHJcbiAgICAgIHJlc3VsdGRhdGE6ICdSRVNVTFREQVRBJyxcclxuICAgICAgb25nb2luZzogJ09OR09JTkdfVE9VUk5FWScsXHJcbiAgICB9KSxcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgdG9wUGVyZm9ybWVyczsiLCJleHBvcnQgeyBzdG9yZSBhcyBkZWZhdWx0IH07XHJcblxyXG5pbXBvcnQgYmFzZVVSTCBmcm9tICcuL2NvbmZpZy5qcydcclxuY29uc3Qgc3RvcmUgPSBuZXcgVnVleC5TdG9yZSh7XHJcbiAgc3RyaWN0OiBmYWxzZSxcclxuICBzdGF0ZToge1xyXG4gICAgdG91YXBpOiBbXSxcclxuICAgIHRvdWFjY2Vzc3RpbWU6ICcnLFxyXG4gICAgZGV0YWlsOiBbXSxcclxuICAgIGxhc3RkZXRhaWxhY2Nlc3M6ICcnLFxyXG4gICAgZXZlbnRfc3RhdHM6IFtdLFxyXG4gICAgcGxheWVyczogW10sXHJcbiAgICByZXN1bHRfZGF0YTogW10sXHJcbiAgICB0b3RhbF9wbGF5ZXJzOiBudWxsLFxyXG4gICAgZXJyb3I6ICcnLFxyXG4gICAgbG9hZGluZzogdHJ1ZSxcclxuICAgIG9uZ29pbmc6IGZhbHNlLFxyXG4gICAgY3VycmVudFBhZ2U6IG51bGwsXHJcbiAgICBXUHRvdGFsOiBudWxsLFxyXG4gICAgV1BwYWdlczogbnVsbCxcclxuICAgIGNhdGVnb3J5OiAnJyxcclxuICAgIHBhcmVudHNsdWc6ICcnLFxyXG4gICAgZXZlbnRfdGl0bGU6ICcnLFxyXG4gICAgdG91cm5leV90aXRsZTogJycsXHJcbiAgICBsb2dvX3VybDogJycsXHJcbiAgICB0b3RhbF9yb3VuZHM6IG51bGwsXHJcbiAgICBmaW5hbF9yb3VuZF9zdGF0czogW10sXHJcbiAgICBzaG93c3RhdHM6IGZhbHNlLFxyXG4gICAgcGxheWVyX2xhc3RfcmRfZGF0YTogW10sXHJcbiAgICBwbGF5ZXJkYXRhOiBbXSxcclxuICAgIHBsYXllcjogbnVsbCxcclxuICAgIHBsYXllcl9zdGF0czoge30sXHJcbiAgfSxcclxuICBnZXR0ZXJzOiB7XHJcbiAgICBQTEFZRVJfU1RBVFM6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9zdGF0cyxcclxuICAgIExBU1RSRERBVEE6IHN0YXRlID0+IHN0YXRlLnBsYXllcl9sYXN0X3JkX2RhdGEsXHJcbiAgICBQTEFZRVJEQVRBOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXJkYXRhLFxyXG4gICAgUExBWUVSOiBzdGF0ZSA9PiBzdGF0ZS5wbGF5ZXIsXHJcbiAgICBTSE9XU1RBVFM6IHN0YXRlID0+IHN0YXRlLnNob3dzdGF0cyxcclxuICAgIFRPVUFQSTogc3RhdGUgPT4gc3RhdGUudG91YXBpLFxyXG4gICAgVE9VQUNDRVNTVElNRTogc3RhdGUgPT4gc3RhdGUudG91YWNjZXNzdGltZSxcclxuICAgIERFVEFJTDogc3RhdGUgPT4gc3RhdGUuZGV0YWlsLFxyXG4gICAgTEFTVERFVEFJTEFDQ0VTUzogc3RhdGUgPT4gc3RhdGUubGFzdGRldGFpbGFjY2VzcyxcclxuICAgIEVWRU5UU1RBVFM6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3N0YXRzLFxyXG4gICAgUExBWUVSUzogc3RhdGUgPT4gc3RhdGUucGxheWVycyxcclxuICAgIFRPVEFMUExBWUVSUzogc3RhdGUgPT4gc3RhdGUudG90YWxfcGxheWVycyxcclxuICAgIFJFU1VMVERBVEE6IHN0YXRlID0+IHN0YXRlLnJlc3VsdF9kYXRhLFxyXG4gICAgRVJST1I6IHN0YXRlID0+IHN0YXRlLmVycm9yLFxyXG4gICAgTE9BRElORzogc3RhdGUgPT4gc3RhdGUubG9hZGluZyxcclxuICAgIENVUlJQQUdFOiBzdGF0ZSA9PiBzdGF0ZS5jdXJyZW50UGFnZSxcclxuICAgIFdQVE9UQUw6IHN0YXRlID0+IHN0YXRlLldQdG90YWwsXHJcbiAgICBXUFBBR0VTOiBzdGF0ZSA9PiBzdGF0ZS5XUHBhZ2VzLFxyXG4gICAgQ0FURUdPUlk6IHN0YXRlID0+IHN0YXRlLmNhdGVnb3J5LFxyXG4gICAgVE9UQUxfUk9VTkRTOiBzdGF0ZSA9PiBzdGF0ZS50b3RhbF9yb3VuZHMsXHJcbiAgICBGSU5BTF9ST1VORF9TVEFUUzogc3RhdGUgPT4gc3RhdGUuZmluYWxfcm91bmRfc3RhdHMsXHJcbiAgICBQQVJFTlRTTFVHOiBzdGF0ZSA9PiBzdGF0ZS5wYXJlbnRzbHVnLFxyXG4gICAgRVZFTlRfVElUTEU6IHN0YXRlID0+IHN0YXRlLmV2ZW50X3RpdGxlLFxyXG4gICAgVE9VUk5FWV9USVRMRTogc3RhdGUgPT4gc3RhdGUudG91cm5leV90aXRsZSxcclxuICAgIE9OR09JTkdfVE9VUk5FWTogc3RhdGUgPT4gc3RhdGUub25nb2luZyxcclxuICAgIExPR09fVVJMOiBzdGF0ZSA9PiBzdGF0ZS5sb2dvX3VybCxcclxuICB9LFxyXG4gIG11dGF0aW9uczoge1xyXG4gICAgU0VUX1NIT1dTVEFUUzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnNob3dzdGF0cyA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0ZJTkFMX1JEX1NUQVRTOiAoc3RhdGUsIHJlc3VsdHN0YXRzKSA9PiB7XHJcbiAgICAgIGxldCBsZW4gPSByZXN1bHRzdGF0cy5sZW5ndGg7XHJcbiAgICAgIGlmIChsZW4gPiAxKSB7XHJcbiAgICAgICAgc3RhdGUuZmluYWxfcm91bmRfc3RhdHMgPSBfLmxhc3QocmVzdWx0c3RhdHMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVURBVEE6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhcGkgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVERFVEFJTDogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmRldGFpbCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VhY2Nlc3N0aW1lID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfREVUQUlMX0xBU1RfQUNDRVNTX1RJTUU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sYXN0ZGV0YWlsYWNjZXNzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfV1BfQ09OU1RBTlRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuV1BwYWdlcyA9IHBheWxvYWRbJ3gtd3AtdG90YWxwYWdlcyddO1xyXG4gICAgICBzdGF0ZS5XUHRvdGFsID0gcGF5bG9hZFsneC13cC10b3RhbCddO1xyXG4gICAgfSxcclxuICAgIFNFVF9QTEFZRVJTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGEgPSBwYXlsb2FkLm1hcChmdW5jdGlvbih2YWwsIGluZGV4LCBrZXkpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhrZXlbaW5kZXhdWydwb3N0X3RpdGxlJ10pO1xyXG4gICAgICAgIGtleVtpbmRleF1bJ3RvdV9ubyddID0gaW5kZXggKyAxO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS50b3RhbF9wbGF5ZXJzID0gcGF5bG9hZC5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcnMgPSBhO1xyXG4gICAgfSxcclxuICAgIFNFVF9SRVNVTFQ6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBsZXQgcCA9IHN0YXRlLnBsYXllcnM7XHJcbiAgICAgIGxldCByID0gXy5tYXAocGF5bG9hZCwgZnVuY3Rpb24gKHopIHtcclxuICAgICAgICByZXR1cm4gXy5tYXAoeiwgZnVuY3Rpb24gKG8pIHtcclxuICAgICAgICAgICBsZXQgaSA9IG8ucG5vIC0gMTtcclxuICAgICAgICAgICBvLnBob3RvID0gcFtpXS5waG90bztcclxuICAgICAgICAgICBsZXQgaWR4ID0gby5vcHBvX25vIC0gMTtcclxuICAgICAgICAgICBvLm9wcF9waG90byA9IHBbaWR4XS5waG90bztcclxuICAgICAgICAgICByZXR1cm4gbztcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgICAgLy8gY29uc29sZS5sb2cocik7XHJcbiAgICAgIHN0YXRlLnJlc3VsdF9kYXRhID0gcjtcclxuICAgIH0sXHJcbiAgICBTRVRfT05HT0lORzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLm9uZ29pbmcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVFNUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUuZXZlbnRfc3RhdHMgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9DVVJSUEFHRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmN1cnJlbnRQYWdlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfRVJST1I6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5lcnJvciA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX0xPQURJTkc6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfVE9UQUxfUk9VTkRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgc3RhdGUudG90YWxfcm91bmRzID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfQ0FURUdPUlk6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5jYXRlZ29yeSA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgU0VUX1RPVVJORVlfVElUTEU6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS50b3VybmV5X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfUEFSRU5UU0xVRzogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhcmVudHNsdWcgPSBwYXlsb2FkO1xyXG4gICAgfSxcclxuICAgIFNFVF9FVkVOVF9USVRMRTogKHN0YXRlLCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIHN0YXRlLmV2ZW50X3RpdGxlID0gcGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBTRVRfTE9HT19VUkw6IChzdGF0ZSwgcGF5bG9hZCkgPT4ge1xyXG4gICAgICBzdGF0ZS5sb2dvX3VybCA9IHBheWxvYWQ7XHJcbiAgICB9LFxyXG4gICAgLy9cclxuICAgIENPTVBVVEVfUExBWUVSX1NUQVRTOiAoc3RhdGUsIHBheWxvYWQpID0+IHtcclxuICAgICAgbGV0IGxlbiA9IHN0YXRlLnJlc3VsdF9kYXRhLmxlbmd0aDtcclxuICAgICAgbGV0IGxhc3Ryb3VuZCA9IHN0YXRlLnJlc3VsdF9kYXRhW2xlbiAtIDFdO1xyXG4gICAgICBsZXQgcGxheWVyID0gKHN0YXRlLnBsYXllciA9IF8uZmlsdGVyKHN0YXRlLnBsYXllcnMsIHsgaWQ6IHBheWxvYWQgfSkpO1xyXG4gICAgICBsZXQgbmFtZSA9IF8ubWFwKHBsYXllciwgJ3Bvc3RfdGl0bGUnKSArICcnOyAvLyBjb252ZXJ0IHRvIHN0cmluZ1xyXG4gICAgICBsZXQgcGxheWVyX3RubyA9IHBhcnNlSW50KF8ubWFwKHBsYXllciwgJ3RvdV9ubycpKTtcclxuICAgICAgc3RhdGUucGxheWVyX2xhc3RfcmRfZGF0YSA9IF8uZmluZChsYXN0cm91bmQsIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG5cclxuICAgICAgbGV0IHBkYXRhID0gKHN0YXRlLnBsYXllcmRhdGEgPSBfLmNoYWluKHN0YXRlLnJlc3VsdF9kYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgcmV0dXJuIF8uZmlsdGVyKG0sIHsgcG5vOiBwbGF5ZXJfdG5vIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgbGV0IGFsbFNjb3JlcyA9IChzdGF0ZS5wbGF5ZXJfc3RhdHMuYWxsU2NvcmVzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCBzY29yZXMgPSBfLmZsYXR0ZW5EZWVwKF8ubWFwKG0sICdzY29yZScpKTtcclxuICAgICAgICAgIHJldHVybiBzY29yZXM7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudmFsdWUoKSk7XHJcblxyXG4gICAgICBsZXQgYWxsT3BwU2NvcmVzID0gKHN0YXRlLnBsYXllcl9zdGF0cy5hbGxPcHBTY29yZXMgPSBfLmNoYWluKHBkYXRhKVxyXG4gICAgICAgIC5tYXAoZnVuY3Rpb24obSkge1xyXG4gICAgICAgICAgbGV0IG9wcHNjb3JlcyA9IF8uZmxhdHRlbkRlZXAoXy5tYXAobSwgJ29wcG9fc2NvcmUnKSk7XHJcbiAgICAgICAgICByZXR1cm4gb3Bwc2NvcmVzO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnZhbHVlKCkpO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLmFsbFJhbmtzID0gXy5jaGFpbihwZGF0YSlcclxuICAgICAgICAubWFwKGZ1bmN0aW9uKG0pIHtcclxuICAgICAgICAgIGxldCByID0gXy5mbGF0dGVuRGVlcChfLm1hcChtLCAncG9zaXRpb24nKSk7XHJcbiAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgbGV0IHBIaVNjb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wSGlTY29yZSA9IF8ubWF4QnkoYWxsU2NvcmVzKSArICcnKTtcclxuICAgICAgbGV0IHBMb1Njb3JlID0gKHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZSA9IF8ubWluQnkoYWxsU2NvcmVzKSArICcnKTtcclxuXHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wSGlPcHBTY29yZSA9IF8ubWF4QnkoYWxsT3BwU2NvcmVzKSArICcnO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucExvT3BwU2NvcmUgPSBfLm1pbkJ5KGFsbE9wcFNjb3JlcykgKyAnJztcclxuXHJcbiAgICAgIGxldCBwSGlTY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBIaVNjb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcbiAgICAgIGxldCBwTG9TY29yZVJvdW5kcyA9IF8ubWFwKFxyXG4gICAgICAgIF8uZmlsdGVyKFxyXG4gICAgICAgICAgXy5mbGF0dGVuRGVlcChwZGF0YSksXHJcbiAgICAgICAgICBmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNjb3JlID09IHBhcnNlSW50KHBMb1Njb3JlKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKSxcclxuICAgICAgICAncm91bmQnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucEhpU2NvcmVSb3VuZHMgPSBwSGlTY29yZVJvdW5kcy5qb2luKCk7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5wTG9TY29yZVJvdW5kcyA9IHBMb1Njb3JlUm91bmRzLmpvaW4oKTtcclxuXHJcbiAgICAgIGxldCBwUmJ5UiA9IF8ubWFwKHBkYXRhLCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHQsIGZ1bmN0aW9uKGwpIHtcclxuICAgICAgICAgIGxldCByZXN1bHQgPSAnJztcclxuICAgICAgICAgIGlmIChsLnJlc3VsdCA9PT0gJ3dpbicpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gJ3dvbic7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGwucmVzdWx0ID09PSAnYXdhaXRpbmcnKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9ICdBUic7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAnbG9zdCc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgc3RhcnRpbmcgPSAncmVwbHlpbmcnO1xyXG4gICAgICAgICAgaWYgKGwuc3RhcnQgPT0gJ3knKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0aW5nID0gJ3N0YXJ0aW5nJztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChyZXN1bHQgPT0gJ0FSJykge1xyXG4gICAgICAgICAgICBsLnJlcG9ydCA9XHJcbiAgICAgICAgICAgICAgJ0luIHJvdW5kICcgK1xyXG4gICAgICAgICAgICAgIGwucm91bmQgK1xyXG4gICAgICAgICAgICAgICcgJyArXHJcbiAgICAgICAgICAgICAgbmFtZSArXHJcbiAgICAgICAgICAgICAgJzxlbSB2LWlmPVwibC5zdGFydFwiPiwgKCcgK1xyXG4gICAgICAgICAgICAgIHN0YXJ0aW5nICtcclxuICAgICAgICAgICAgICAnKTwvZW0+IGlzIHBsYXlpbmcgPHN0cm9uZz4nICtcclxuICAgICAgICAgICAgICBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4uIFJlc3VsdHMgYXJlIGJlaW5nIGF3YWl0ZWQnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbC5yZXBvcnQgPVxyXG4gICAgICAgICAgICAgICdJbiByb3VuZCAnICtcclxuICAgICAgICAgICAgICBsLnJvdW5kICtcclxuICAgICAgICAgICAgICAnICcgK1xyXG4gICAgICAgICAgICAgIG5hbWUgK1xyXG4gICAgICAgICAgICAgICc8ZW0gdi1pZj1cImwuc3RhcnRcIj4sICgnICtcclxuICAgICAgICAgICAgICBzdGFydGluZyArXHJcbiAgICAgICAgICAgICAgJyk8L2VtPiBwbGF5ZWQgPHN0cm9uZz4nICtcclxuICAgICAgICAgICAgICBsLm9wcG8gK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gYW5kICcgK1xyXG4gICAgICAgICAgICAgIHJlc3VsdCArXHJcbiAgICAgICAgICAgICAgJyA8ZW0+JyArXHJcbiAgICAgICAgICAgICAgbC5zY29yZSArXHJcbiAgICAgICAgICAgICAgJyAtICcgK1xyXG4gICAgICAgICAgICAgIGwub3Bwb19zY29yZSArXHJcbiAgICAgICAgICAgICAgJzwvZW0+IGEgZGlmZmVyZW5jZSBvZiAnICtcclxuICAgICAgICAgICAgICBsLmRpZmYgK1xyXG4gICAgICAgICAgICAgICcuIDxzcGFuIGNsYXNzPVwic3VtbWFyeVwiPjxlbT4nICtcclxuICAgICAgICAgICAgICBuYW1lICtcclxuICAgICAgICAgICAgICAnPC9lbT4gaXMgcmFua2VkIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgJzwvc3Ryb25nPiB3aXRoIDxzdHJvbmc+JyArXHJcbiAgICAgICAgICAgICAgbC5wb2ludHMgK1xyXG4gICAgICAgICAgICAgICc8L3N0cm9uZz4gcG9pbnRzIGFuZCBhIGN1bXVsYXRpdmUgc3ByZWFkIG9mICcgK1xyXG4gICAgICAgICAgICAgIGwubWFyZ2luICtcclxuICAgICAgICAgICAgICAnIDwvc3Bhbj4nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBzdGF0ZS5wbGF5ZXJfc3RhdHMucFJieVIgPSBfLmZsYXR0ZW5EZWVwKHBSYnlSKTtcclxuXHJcbiAgICAgIGxldCBhbGxXaW5zID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgIHJldHVybiAnd2luJyA9PSBwLnJlc3VsdDtcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0V2lucyA9IF8uZmlsdGVyKGFsbFdpbnMsIFsnc3RhcnQnLCAneSddKS5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBseVdpbnMgPSBfLmZpbHRlcihhbGxXaW5zLCBbJ3N0YXJ0JywgJ24nXSkubGVuZ3RoO1xyXG4gICAgICBsZXQgc3RhcnRzID0gXy5tYXAoXHJcbiAgICAgICAgXy5maWx0ZXIoXy5mbGF0dGVuRGVlcChwZGF0YSksIGZ1bmN0aW9uKHApIHtcclxuICAgICAgICAgIGlmIChwLnN0YXJ0ID09ICd5Jykge1xyXG4gICAgICAgICAgICByZXR1cm4gcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgc3RhdGUucGxheWVyX3N0YXRzLnN0YXJ0cyA9IHN0YXJ0cy5sZW5ndGg7XHJcbiAgICAgIHN0YXRlLnBsYXllcl9zdGF0cy5yZXBsaWVzID0gc3RhdGUudG90YWxfcm91bmRzIC0gc3RhcnRzLmxlbmd0aDtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVN0YXJ0cyBDb3VudC0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgY29uc29sZS5sb2coc3RhcnRzLmxlbmd0aCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVN0YXJ0cyBXaW4gQ291bnQtLS0tLS0tLS0tLS0tLS0tLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlLnBsYXllcl9zdGF0cy5zdGFydFdpbnMpO1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1SZXBsaWVzIENvdW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xyXG4gICAgICBjb25zb2xlLmxvZyhzdGF0ZS50b3RhbF9yb3VuZHMgLSBzdGFydHMubGVuZ3RoKTtcclxuICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tUmVwbHkgV2luIENvdW50IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcclxuICAgICAgY29uc29sZS5sb2coc3RhdGUucGxheWVyX3N0YXRzLnJlcGx5V2lucyk7XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYWN0aW9uczoge1xyXG4gICAgRE9fU1RBVFM6IChjb250ZXh0LCBwYXlsb2FkKSA9PiB7XHJcbiAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfU0hPV1NUQVRTJywgcGF5bG9hZCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIEZFVENIX0FQSSAoY29udGV4dCwgcGF5bG9hZCkgIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBheGlvc1xyXG4gICAgICAgIC5nZXQodXJsLCB7IHBhcmFtczogeyBwYWdlOiBwYXlsb2FkIH0gfSlcclxuICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICBsZXQgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coJ0dldHRpbmcgbGlzdHMgb2YgdG91cm5hbWVudHMnKTtcclxuICAgICAgICAgIGxldCBkYXRhID0gcmVzcG9uc2UuZGF0YS5tYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIC8vIEZvcm1hdCBhbmQgYXNzaWduIFRvdXJuYW1lbnQgc3RhcnQgZGF0ZSBpbnRvIGEgbGV0aWFibGVcclxuICAgICAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IGRhdGEuc3RhcnRfZGF0ZTtcclxuICAgICAgICAgICAgZGF0YS5zdGFydF9kYXRlID0gbW9tZW50KG5ldyBEYXRlKHN0YXJ0RGF0ZSkpLmZvcm1hdChcclxuICAgICAgICAgICAgICAnZGRkZCwgTU1NTSBEbyBZWVlZJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhtb21lbnQoaGVhZGVycy5kYXRlKSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIiVjXCIgKyBtb21lbnQoaGVhZGVycy5kYXRlKSwgXCJmb250LXNpemU6MzBweDtjb2xvcjpncmVlbjtcIik7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xBU1RfQUNDRVNTX1RJTUUnLCBoZWFkZXJzLmRhdGUpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9XUF9DT05TVEFOVFMnLCBoZWFkZXJzKTtcclxuICAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VREFUQScsIGRhdGEpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9DVVJSUEFHRScsIHBheWxvYWQpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaChlcnJvcikge1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgZmFsc2UpO1xyXG4gICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBhc3luYyBGRVRDSF9ERVRBSUwgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRvdXJuYW1lbnRgO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldCh1cmwsIHsgcGFyYW1zOiB7IHNsdWc6IHBheWxvYWQgfSB9KTtcclxuICAgICAgICAgbGV0IGhlYWRlcnMgPSByZXNwb25zZS5oZWFkZXJzO1xyXG4gICAgICAgICBsZXQgZGF0YSA9IHJlc3BvbnNlLmRhdGFbMF07XHJcbiAgICAgICAgIGxldCBzdGFydERhdGUgPSBkYXRhLnN0YXJ0X2RhdGU7XHJcbiAgICAgICAgIGRhdGEuc3RhcnRfZGF0ZSA9IG1vbWVudChuZXcgRGF0ZShzdGFydERhdGUpKS5mb3JtYXQoXHJcbiAgICAgICAgICAgJ2RkZGQsIE1NTU0gRG8gWVlZWScpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX1dQX0NPTlNUQU5UUycsIGhlYWRlcnMpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0RFVEFJTF9MQVNUX0FDQ0VTU19USU1FJywgaGVhZGVycy5kYXRlKTtcclxuICAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVERFVEFJTCcsIGRhdGEpO1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVJST1InLCBlcnJvci50b1N0cmluZygpKTtcclxuICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIEZFVENIX0RBVEEgKGNvbnRleHQsIHBheWxvYWQpIHtcclxuICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0FESU5HJywgdHJ1ZSk7XHJcbiAgICAgIGxldCB1cmwgPSBgJHtiYXNlVVJMfXRfZGF0YWA7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KHVybCwgeyBwYXJhbXM6IHsgc2x1ZzogcGF5bG9hZCB9IH0pXHJcbiAgICAgICAgbGV0IGRhdGEgPSByZXNwb25zZS5kYXRhWzBdO1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZGF0YS5wbGF5ZXJzO1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gSlNPTi5wYXJzZShkYXRhLnJlc3VsdHMpO1xyXG4gICAgICAgIGxldCBjYXRlZ29yeSA9IGRhdGEuZXZlbnRfY2F0ZWdvcnlbMF0ubmFtZTtcclxuICAgICAgICBsZXQgbG9nbyA9IGRhdGEudG91cm5leVswXS5ldmVudF9sb2dvLmd1aWQ7XHJcbiAgICAgICAgbGV0IHRvdXJuZXlfdGl0bGUgPSBkYXRhLnRvdXJuZXlbMF0ucG9zdF90aXRsZTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhLnRvdXJuZXlbMF0pO1xyXG4gICAgICAgIGxldCBwYXJlbnRfc2x1ZyA9IGRhdGEudG91cm5leVswXS5wb3N0X25hbWU7XHJcbiAgICAgICAgbGV0IGV2ZW50X3RpdGxlID0gdG91cm5leV90aXRsZSArICcgKCcgKyBjYXRlZ29yeSArICcpJztcclxuICAgICAgICBsZXQgdG90YWxfcm91bmRzID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FVkVOVFNUQVRTJywgZGF0YS50b3VybmV5KTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX09OR09JTkcnLCBkYXRhLm9uZ29pbmcpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUExBWUVSUycsIHBsYXllcnMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUkVTVUxUJywgcmVzdWx0cyk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9GSU5BTF9SRF9TVEFUUycsIHJlc3VsdHMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfQ0FURUdPUlknLCBjYXRlZ29yeSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9MT0dPX1VSTCcsIGxvZ28pO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfVE9VUk5FWV9USVRMRScsIHRvdXJuZXlfdGl0bGUpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfRVZFTlRfVElUTEUnLCBldmVudF90aXRsZSk7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9UT1RBTF9ST1VORFMnLCB0b3RhbF9yb3VuZHMpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfUEFSRU5UU0xVRycsIHBhcmVudF9zbHVnKTtcclxuICAgICAgICBjb250ZXh0LmNvbW1pdCgnU0VUX0xPQURJTkcnLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2ggKGVycm9yKVxyXG4gICAgICB7XHJcbiAgICAgICAgY29udGV4dC5jb21taXQoJ1NFVF9FUlJPUicsIGVycm9yLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNvbnRleHQuY29tbWl0KCdTRVRfTE9BRElORycsIGZhbHNlKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbi8vIGV4cG9ydCBkZWZhdWx0IHN0b3JlO1xyXG4iXX0=
