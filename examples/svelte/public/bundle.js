
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
	'use strict';

	function noop() {}

	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function validate_store(store, name) {
		if (!store || typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(component, store, callback) {
		const unsub = store.subscribe(callback);

		component.$$.on_destroy.push(unsub.unsubscribe
			? () => unsub.unsubscribe()
			: unsub);
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function element(name) {
		return document.createElement(name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = {};
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error(`'target' is a required option`);
			}

			super();
		}

		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn(`Component was already destroyed`); // eslint-disable-line no-console
			};
		}
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	/* global Reflect, Promise */

	var extendStatics = function(d, b) {
	    extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return extendStatics(d, b);
	};

	function __extends(d, b) {
	    extendStatics(d, b);
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
	            t[p[i]] = s[p[i]];
	    return t;
	}

	function __decorate(decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	}

	function __metadata(metadataKey, metadataValue) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
	}

	function __values(o) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
	    if (m) return m.call(o);
	    return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isFunction(x) {
	    return typeof x === 'function';
	}
	//# sourceMappingURL=isFunction.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var _enable_super_gross_mode_that_will_cause_bad_things = false;
	var config = {
	    Promise: undefined,
	    set useDeprecatedSynchronousErrorHandling(value) {
	        if (value) {
	            var error = /*@__PURE__*/ new Error();
	            /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
	        }
	        _enable_super_gross_mode_that_will_cause_bad_things = value;
	    },
	    get useDeprecatedSynchronousErrorHandling() {
	        return _enable_super_gross_mode_that_will_cause_bad_things;
	    },
	};
	//# sourceMappingURL=config.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function hostReportError(err) {
	    setTimeout(function () { throw err; }, 0);
	}
	//# sourceMappingURL=hostReportError.js.map

	/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
	var empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) {
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            throw err;
	        }
	        else {
	            hostReportError(err);
	        }
	    },
	    complete: function () { }
	};
	//# sourceMappingURL=Observer.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
	//# sourceMappingURL=isArray.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isObject(x) {
	    return x !== null && typeof x === 'object';
	}
	//# sourceMappingURL=isObject.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function UnsubscriptionErrorImpl(errors) {
	    Error.call(this);
	    this.message = errors ?
	        errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
	    this.name = 'UnsubscriptionError';
	    this.errors = errors;
	    return this;
	}
	UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
	var UnsubscriptionError = UnsubscriptionErrorImpl;
	//# sourceMappingURL=UnsubscriptionError.js.map

	/** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
	var Subscription = /*@__PURE__*/ (function () {
	    function Subscription(unsubscribe) {
	        this.closed = false;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    Subscription.prototype.unsubscribe = function () {
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (_parentOrParents instanceof Subscription) {
	            _parentOrParents.remove(this);
	        }
	        else if (_parentOrParents !== null) {
	            for (var index = 0; index < _parentOrParents.length; ++index) {
	                var parent_1 = _parentOrParents[index];
	                parent_1.remove(this);
	            }
	        }
	        if (isFunction(_unsubscribe)) {
	            try {
	                _unsubscribe.call(this);
	            }
	            catch (e) {
	                errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
	            }
	        }
	        if (isArray(_subscriptions)) {
	            var index = -1;
	            var len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject(sub)) {
	                    try {
	                        sub.unsubscribe();
	                    }
	                    catch (e) {
	                        errors = errors || [];
	                        if (e instanceof UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
	                        }
	                        else {
	                            errors.push(e);
	                        }
	                    }
	                }
	            }
	        }
	        if (errors) {
	            throw new UnsubscriptionError(errors);
	        }
	    };
	    Subscription.prototype.add = function (teardown) {
	        var subscription = teardown;
	        if (!teardown) {
	            return Subscription.EMPTY;
	        }
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (!(subscription instanceof Subscription)) {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default: {
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	            }
	        }
	        var _parentOrParents = subscription._parentOrParents;
	        if (_parentOrParents === null) {
	            subscription._parentOrParents = this;
	        }
	        else if (_parentOrParents instanceof Subscription) {
	            if (_parentOrParents === this) {
	                return subscription;
	            }
	            subscription._parentOrParents = [_parentOrParents, this];
	        }
	        else if (_parentOrParents.indexOf(this) === -1) {
	            _parentOrParents.push(this);
	        }
	        else {
	            return subscription;
	        }
	        var subscriptions = this._subscriptions;
	        if (subscriptions === null) {
	            this._subscriptions = [subscription];
	        }
	        else {
	            subscriptions.push(subscription);
	        }
	        return subscription;
	    };
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
	}
	//# sourceMappingURL=Subscription.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var rxSubscriber = typeof Symbol === 'function'
	    ? /*@__PURE__*/ Symbol('rxSubscriber')
	    : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
	//# sourceMappingURL=rxSubscriber.js.map

	/** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
	var Subscriber = /*@__PURE__*/ (function (_super) {
	    __extends(Subscriber, _super);
	    function Subscriber(destinationOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this.syncErrorValue = null;
	        _this.syncErrorThrown = false;
	        _this.syncErrorThrowable = false;
	        _this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                _this.destination = empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    _this.destination = empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
	                        _this.destination = destinationOrNext;
	                        destinationOrNext.add(_this);
	                    }
	                    else {
	                        _this.syncErrorThrowable = true;
	                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                _this.syncErrorThrowable = true;
	                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
	                break;
	        }
	        return _this;
	    }
	    Subscriber.prototype[rxSubscriber] = function () { return this; };
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _parentOrParents = this._parentOrParents;
	        this._parentOrParents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parentOrParents = _parentOrParents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription));
	var SafeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = _this;
	        if (isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction(context.unsubscribe)) {
	                    _this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = _this.unsubscribe.bind(_this);
	            }
	        }
	        _this._context = context;
	        _this._next = next;
	        _this._error = error;
	        _this._complete = complete;
	        return _this;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
	            if (this._error) {
	                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                if (useDeprecatedSynchronousErrorHandling) {
	                    throw err;
	                }
	                hostReportError(err);
	            }
	            else {
	                if (useDeprecatedSynchronousErrorHandling) {
	                    _parentSubscriber.syncErrorValue = err;
	                    _parentSubscriber.syncErrorThrown = true;
	                }
	                else {
	                    hostReportError(err);
	                }
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        var _this = this;
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                var wrappedComplete = function () { return _this._complete.call(_this._context); };
	                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(wrappedComplete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                throw err;
	            }
	            else {
	                hostReportError(err);
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        if (!config.useDeprecatedSynchronousErrorHandling) {
	            throw new Error('bad call');
	        }
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            else {
	                hostReportError(err);
	                return true;
	            }
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));
	//# sourceMappingURL=Subscriber.js.map

	/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
	function canReportError(observer) {
	    while (observer) {
	        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
	        if (closed_1 || isStopped) {
	            return false;
	        }
	        else if (destination && destination instanceof Subscriber) {
	            observer = destination;
	        }
	        else {
	            observer = null;
	        }
	    }
	    return true;
	}
	//# sourceMappingURL=canReportError.js.map

	/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber]) {
	            return nextOrObserver[rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber(empty);
	    }
	    return new Subscriber(nextOrObserver, error, complete);
	}
	//# sourceMappingURL=toSubscriber.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
	//# sourceMappingURL=observable.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function noop$1() { }
	//# sourceMappingURL=noop.js.map

	/** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
	function pipeFromArray(fns) {
	    if (!fns) {
	        return noop$1;
	    }
	    if (fns.length === 1) {
	        return fns[0];
	    }
	    return function piped(input) {
	        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
	    };
	}
	//# sourceMappingURL=pipe.js.map

	/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
	var Observable = /*@__PURE__*/ (function () {
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            sink.add(operator.call(sink, this.source));
	        }
	        else {
	            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
	                this._subscribe(sink) :
	                this._trySubscribe(sink));
	        }
	        if (config.useDeprecatedSynchronousErrorHandling) {
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            if (config.useDeprecatedSynchronousErrorHandling) {
	                sink.syncErrorThrown = true;
	                sink.syncErrorValue = err;
	            }
	            if (canReportError(sink)) {
	                sink.error(err);
	            }
	            else {
	                console.warn(err);
	            }
	        }
	    };
	    Observable.prototype.forEach = function (next, promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                try {
	                    next(value);
	                }
	                catch (err) {
	                    reject(err);
	                    if (subscription) {
	                        subscription.unsubscribe();
	                    }
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        return source && source.subscribe(subscriber);
	    };
	    Observable.prototype[observable] = function () {
	        return this;
	    };
	    Observable.prototype.pipe = function () {
	        var operations = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            operations[_i] = arguments[_i];
	        }
	        if (operations.length === 0) {
	            return this;
	        }
	        return pipeFromArray(operations)(this);
	    };
	    Observable.prototype.toPromise = function (promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var value;
	            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
	        });
	    };
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	function getPromiseCtor(promiseCtor) {
	    if (!promiseCtor) {
	        promiseCtor = Promise;
	    }
	    if (!promiseCtor) {
	        throw new Error('no Promise impl found');
	    }
	    return promiseCtor;
	}
	//# sourceMappingURL=Observable.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function ObjectUnsubscribedErrorImpl() {
	    Error.call(this);
	    this.message = 'object unsubscribed';
	    this.name = 'ObjectUnsubscribedError';
	    return this;
	}
	ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
	var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

	/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
	var SubjectSubscription = /*@__PURE__*/ (function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, subscriber) {
	        var _this = _super.call(this) || this;
	        _this.subject = subject;
	        _this.subscriber = subscriber;
	        _this.closed = false;
	        return _this;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.closed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.subscriber);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription));
	//# sourceMappingURL=SubjectSubscription.js.map

	/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
	var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SubjectSubscriber, _super);
	    function SubjectSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        return _this;
	    }
	    return SubjectSubscriber;
	}(Subscriber));
	var Subject = /*@__PURE__*/ (function (_super) {
	    __extends(Subject, _super);
	    function Subject() {
	        var _this = _super.call(this) || this;
	        _this.observers = [];
	        _this.closed = false;
	        _this.isStopped = false;
	        _this.hasError = false;
	        _this.thrownError = null;
	        return _this;
	    }
	    Subject.prototype[rxSubscriber] = function () {
	        return new SubjectSubscriber(this);
	    };
	    Subject.prototype.lift = function (operator) {
	        var subject = new AnonymousSubject(this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.next = function (value) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        if (!this.isStopped) {
	            var observers = this.observers;
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].next(value);
	            }
	        }
	    };
	    Subject.prototype.error = function (err) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        this.hasError = true;
	        this.thrownError = err;
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].error(err);
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.complete = function () {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].complete();
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.unsubscribe = function () {
	        this.isStopped = true;
	        this.closed = true;
	        this.observers = null;
	    };
	    Subject.prototype._trySubscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else {
	            return _super.prototype._trySubscribe.call(this, subscriber);
	        }
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	            return Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            return new SubjectSubscription(this, subscriber);
	        }
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new Observable();
	        observable.source = this;
	        return observable;
	    };
	    Subject.create = function (destination, source) {
	        return new AnonymousSubject(destination, source);
	    };
	    return Subject;
	}(Observable));
	var AnonymousSubject = /*@__PURE__*/ (function (_super) {
	    __extends(AnonymousSubject, _super);
	    function AnonymousSubject(destination, source) {
	        var _this = _super.call(this) || this;
	        _this.destination = destination;
	        _this.source = source;
	        return _this;
	    }
	    AnonymousSubject.prototype.next = function (value) {
	        var destination = this.destination;
	        if (destination && destination.next) {
	            destination.next(value);
	        }
	    };
	    AnonymousSubject.prototype.error = function (err) {
	        var destination = this.destination;
	        if (destination && destination.error) {
	            this.destination.error(err);
	        }
	    };
	    AnonymousSubject.prototype.complete = function () {
	        var destination = this.destination;
	        if (destination && destination.complete) {
	            this.destination.complete();
	        }
	    };
	    AnonymousSubject.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        if (source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            return Subscription.EMPTY;
	        }
	    };
	    return AnonymousSubject;
	}(Subject));
	//# sourceMappingURL=Subject.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function refCount() {
	    return function refCountOperatorFunction(source) {
	        return source.lift(new RefCountOperator(source));
	    };
	}
	var RefCountOperator = /*@__PURE__*/ (function () {
	    function RefCountOperator(connectable) {
	        this.connectable = connectable;
	    }
	    RefCountOperator.prototype.call = function (subscriber, source) {
	        var connectable = this.connectable;
	        connectable._refCount++;
	        var refCounter = new RefCountSubscriber(subscriber, connectable);
	        var subscription = source.subscribe(refCounter);
	        if (!refCounter.closed) {
	            refCounter.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountOperator;
	}());
	var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (!connectable) {
	            this.connection = null;
	            return;
	        }
	        this.connectable = null;
	        var refCount = connectable._refCount;
	        if (refCount <= 0) {
	            this.connection = null;
	            return;
	        }
	        connectable._refCount = refCount - 1;
	        if (refCount > 1) {
	            this.connection = null;
	            return;
	        }
	        var connection = this.connection;
	        var sharedConnection = connectable._connection;
	        this.connection = null;
	        if (sharedConnection && (!connection || sharedConnection === connection)) {
	            sharedConnection.unsubscribe();
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber));
	//# sourceMappingURL=refCount.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
	var ConnectableObservable = /*@__PURE__*/ (function (_super) {
	    __extends(ConnectableObservable, _super);
	    function ConnectableObservable(source, subjectFactory) {
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.subjectFactory = subjectFactory;
	        _this._refCount = 0;
	        _this._isComplete = false;
	        return _this;
	    }
	    ConnectableObservable.prototype._subscribe = function (subscriber) {
	        return this.getSubject().subscribe(subscriber);
	    };
	    ConnectableObservable.prototype.getSubject = function () {
	        var subject = this._subject;
	        if (!subject || subject.isStopped) {
	            this._subject = this.subjectFactory();
	        }
	        return this._subject;
	    };
	    ConnectableObservable.prototype.connect = function () {
	        var connection = this._connection;
	        if (!connection) {
	            this._isComplete = false;
	            connection = this._connection = new Subscription();
	            connection.add(this.source
	                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
	            if (connection.closed) {
	                this._connection = null;
	                connection = Subscription.EMPTY;
	            }
	        }
	        return connection;
	    };
	    ConnectableObservable.prototype.refCount = function () {
	        return refCount()(this);
	    };
	    return ConnectableObservable;
	}(Observable));
	var connectableProto = ConnectableObservable.prototype;
	var connectableObservableDescriptor = {
	    operator: { value: null },
	    _refCount: { value: 0, writable: true },
	    _subject: { value: null, writable: true },
	    _connection: { value: null, writable: true },
	    _subscribe: { value: connectableProto._subscribe },
	    _isComplete: { value: connectableProto._isComplete, writable: true },
	    getSubject: { value: connectableProto.getSubject },
	    connect: { value: connectableProto.connect },
	    refCount: { value: connectableProto.refCount }
	};
	var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ConnectableSubscriber, _super);
	    function ConnectableSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    ConnectableSubscriber.prototype._error = function (err) {
	        this._unsubscribe();
	        _super.prototype._error.call(this, err);
	    };
	    ConnectableSubscriber.prototype._complete = function () {
	        this.connectable._isComplete = true;
	        this._unsubscribe();
	        _super.prototype._complete.call(this);
	    };
	    ConnectableSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (connectable) {
	            this.connectable = null;
	            var connection = connectable._connection;
	            connectable._refCount = 0;
	            connectable._subject = null;
	            connectable._connection = null;
	            if (connection) {
	                connection.unsubscribe();
	            }
	        }
	    };
	    return ConnectableSubscriber;
	}(SubjectSubscriber));
	//# sourceMappingURL=ConnectableObservable.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
	//# sourceMappingURL=groupBy.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
	var BehaviorSubject = /*@__PURE__*/ (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        var _this = _super.call(this) || this;
	        _this._value = _value;
	        return _this;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.closed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasError) {
	            throw this.thrownError;
	        }
	        else if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else {
	            return this._value;
	        }
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, this._value = value);
	    };
	    return BehaviorSubject;
	}(Subject));
	//# sourceMappingURL=BehaviorSubject.js.map

	/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
	var Action = /*@__PURE__*/ (function (_super) {
	    __extends(Action, _super);
	    function Action(scheduler, work) {
	        return _super.call(this) || this;
	    }
	    Action.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return this;
	    };
	    return Action;
	}(Subscription));
	//# sourceMappingURL=Action.js.map

	/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
	var AsyncAction = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncAction, _super);
	    function AsyncAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.pending = false;
	        return _this;
	    }
	    AsyncAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (this.closed) {
	            return this;
	        }
	        this.state = state;
	        var id = this.id;
	        var scheduler = this.scheduler;
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, delay);
	        }
	        this.pending = true;
	        this.delay = delay;
	        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
	        return this;
	    };
	    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return setInterval(scheduler.flush.bind(scheduler, this), delay);
	    };
	    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay !== null && this.delay === delay && this.pending === false) {
	            return id;
	        }
	        clearInterval(id);
	        return undefined;
	    };
	    AsyncAction.prototype.execute = function (state, delay) {
	        if (this.closed) {
	            return new Error('executing a cancelled action');
	        }
	        this.pending = false;
	        var error = this._execute(state, delay);
	        if (error) {
	            return error;
	        }
	        else if (this.pending === false && this.id != null) {
	            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	        }
	    };
	    AsyncAction.prototype._execute = function (state, delay) {
	        var errored = false;
	        var errorValue = undefined;
	        try {
	            this.work(state);
	        }
	        catch (e) {
	            errored = true;
	            errorValue = !!e && e || new Error(e);
	        }
	        if (errored) {
	            this.unsubscribe();
	            return errorValue;
	        }
	    };
	    AsyncAction.prototype._unsubscribe = function () {
	        var id = this.id;
	        var scheduler = this.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        this.work = null;
	        this.state = null;
	        this.pending = false;
	        this.scheduler = null;
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, null);
	        }
	        this.delay = null;
	    };
	    return AsyncAction;
	}(Action));
	//# sourceMappingURL=AsyncAction.js.map

	/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
	var QueueAction = /*@__PURE__*/ (function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    QueueAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (delay > 0) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        this.scheduler.flush(this);
	        return this;
	    };
	    QueueAction.prototype.execute = function (state, delay) {
	        return (delay > 0 || this.closed) ?
	            _super.prototype.execute.call(this, state, delay) :
	            this._execute(state, delay);
	    };
	    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        return scheduler.flush(this);
	    };
	    return QueueAction;
	}(AsyncAction));
	//# sourceMappingURL=QueueAction.js.map

	var Scheduler = /*@__PURE__*/ (function () {
	    function Scheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        this.SchedulerAction = SchedulerAction;
	        this.now = now;
	    }
	    Scheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        return new this.SchedulerAction(this, work).schedule(state, delay);
	    };
	    Scheduler.now = function () { return Date.now(); };
	    return Scheduler;
	}());
	//# sourceMappingURL=Scheduler.js.map

	/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
	var AsyncScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler(SchedulerAction, now) {
	        if (now === void 0) {
	            now = Scheduler.now;
	        }
	        var _this = _super.call(this, SchedulerAction, function () {
	            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
	                return AsyncScheduler.delegate.now();
	            }
	            else {
	                return now();
	            }
	        }) || this;
	        _this.actions = [];
	        _this.active = false;
	        _this.scheduled = undefined;
	        return _this;
	    }
	    AsyncScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
	            return AsyncScheduler.delegate.schedule(work, delay, state);
	        }
	        else {
	            return _super.prototype.schedule.call(this, work, delay, state);
	        }
	    };
	    AsyncScheduler.prototype.flush = function (action) {
	        var actions = this.actions;
	        if (this.active) {
	            actions.push(action);
	            return;
	        }
	        var error;
	        this.active = true;
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (action = actions.shift());
	        this.active = false;
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsyncScheduler;
	}(Scheduler));
	//# sourceMappingURL=AsyncScheduler.js.map

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	var QueueScheduler = /*@__PURE__*/ (function (_super) {
	    __extends(QueueScheduler, _super);
	    function QueueScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    return QueueScheduler;
	}(AsyncScheduler));
	//# sourceMappingURL=QueueScheduler.js.map

	/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
	var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);
	//# sourceMappingURL=queue.js.map

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
	function empty$1(scheduler) {
	    return scheduler ? emptyScheduled(scheduler) : EMPTY;
	}
	function emptyScheduled(scheduler) {
	    return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
	}
	//# sourceMappingURL=empty.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	//# sourceMappingURL=isScheduler.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var subscribeToArray = function (array) {
	    return function (subscriber) {
	        for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
	            subscriber.next(array[i]);
	        }
	        subscriber.complete();
	    };
	};
	//# sourceMappingURL=subscribeToArray.js.map

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
	function scheduleArray(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        var i = 0;
	        sub.add(scheduler.schedule(function () {
	            if (i === input.length) {
	                subscriber.complete();
	                return;
	            }
	            subscriber.next(input[i++]);
	            if (!subscriber.closed) {
	                sub.add(this.schedule());
	            }
	        }));
	        return sub;
	    });
	}
	//# sourceMappingURL=scheduleArray.js.map

	/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
	function fromArray(input, scheduler) {
	    if (!scheduler) {
	        return new Observable(subscribeToArray(input));
	    }
	    else {
	        return scheduleArray(input, scheduler);
	    }
	}
	//# sourceMappingURL=fromArray.js.map

	/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */
	function of() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    var scheduler = args[args.length - 1];
	    if (isScheduler(scheduler)) {
	        args.pop();
	        return scheduleArray(args, scheduler);
	    }
	    else {
	        return fromArray(args);
	    }
	}
	//# sourceMappingURL=of.js.map

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	function throwError(error, scheduler) {
	    if (!scheduler) {
	        return new Observable(function (subscriber) { return subscriber.error(error); });
	    }
	    else {
	        return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
	    }
	}
	function dispatch(_a) {
	    var error = _a.error, subscriber = _a.subscriber;
	    subscriber.error(error);
	}
	//# sourceMappingURL=throwError.js.map

	/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
	var Notification = /*@__PURE__*/ (function () {
	    function Notification(kind, value, error) {
	        this.kind = kind;
	        this.value = value;
	        this.error = error;
	        this.hasValue = kind === 'N';
	    }
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.error);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.error);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        }
	        else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return of(this.value);
	            case 'E':
	                return throwError(this.error);
	            case 'C':
	                return empty$1();
	        }
	        throw new Error('unexpected notification kind value');
	    };
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return Notification.undefinedValueNotification;
	    };
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    Notification.createComplete = function () {
	        return Notification.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}());
	//# sourceMappingURL=Notification.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
	var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(ObserveOnSubscriber, _super);
	    function ObserveOnSubscriber(destination, scheduler, delay) {
	        if (delay === void 0) {
	            delay = 0;
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.scheduler = scheduler;
	        _this.delay = delay;
	        return _this;
	    }
	    ObserveOnSubscriber.dispatch = function (arg) {
	        var notification = arg.notification, destination = arg.destination;
	        notification.observe(destination);
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
	        var destination = this.destination;
	        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
	    };
	    ObserveOnSubscriber.prototype._next = function (value) {
	        this.scheduleMessage(Notification.createNext(value));
	    };
	    ObserveOnSubscriber.prototype._error = function (err) {
	        this.scheduleMessage(Notification.createError(err));
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype._complete = function () {
	        this.scheduleMessage(Notification.createComplete());
	        this.unsubscribe();
	    };
	    return ObserveOnSubscriber;
	}(Subscriber));
	var ObserveOnMessage = /*@__PURE__*/ (function () {
	    function ObserveOnMessage(notification, destination) {
	        this.notification = notification;
	        this.destination = destination;
	    }
	    return ObserveOnMessage;
	}());
	//# sourceMappingURL=observeOn.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
	var ReplaySubject = /*@__PURE__*/ (function (_super) {
	    __extends(ReplaySubject, _super);
	    function ReplaySubject(bufferSize, windowTime, scheduler) {
	        if (bufferSize === void 0) {
	            bufferSize = Number.POSITIVE_INFINITY;
	        }
	        if (windowTime === void 0) {
	            windowTime = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this) || this;
	        _this.scheduler = scheduler;
	        _this._events = [];
	        _this._infiniteTimeWindow = false;
	        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
	        _this._windowTime = windowTime < 1 ? 1 : windowTime;
	        if (windowTime === Number.POSITIVE_INFINITY) {
	            _this._infiniteTimeWindow = true;
	            _this.next = _this.nextInfiniteTimeWindow;
	        }
	        else {
	            _this.next = _this.nextTimeWindow;
	        }
	        return _this;
	    }
	    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
	        var _events = this._events;
	        _events.push(value);
	        if (_events.length > this._bufferSize) {
	            _events.shift();
	        }
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype.nextTimeWindow = function (value) {
	        this._events.push(new ReplayEvent(this._getNow(), value));
	        this._trimBufferThenGetEvents();
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype._subscribe = function (subscriber) {
	        var _infiniteTimeWindow = this._infiniteTimeWindow;
	        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
	        var scheduler = this.scheduler;
	        var len = _events.length;
	        var subscription;
	        if (this.closed) {
	            throw new ObjectUnsubscribedError();
	        }
	        else if (this.isStopped || this.hasError) {
	            subscription = Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            subscription = new SubjectSubscription(this, subscriber);
	        }
	        if (scheduler) {
	            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
	        }
	        if (_infiniteTimeWindow) {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i]);
	            }
	        }
	        else {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i].value);
	            }
	        }
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	        }
	        return subscription;
	    };
	    ReplaySubject.prototype._getNow = function () {
	        return (this.scheduler || queue).now();
	    };
	    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
	        var now = this._getNow();
	        var _bufferSize = this._bufferSize;
	        var _windowTime = this._windowTime;
	        var _events = this._events;
	        var eventsCount = _events.length;
	        var spliceCount = 0;
	        while (spliceCount < eventsCount) {
	            if ((now - _events[spliceCount].time) < _windowTime) {
	                break;
	            }
	            spliceCount++;
	        }
	        if (eventsCount > _bufferSize) {
	            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
	        }
	        if (spliceCount > 0) {
	            _events.splice(0, spliceCount);
	        }
	        return _events;
	    };
	    return ReplaySubject;
	}(Subject));
	var ReplayEvent = /*@__PURE__*/ (function () {
	    function ReplayEvent(time, value) {
	        this.time = time;
	        this.value = value;
	    }
	    return ReplayEvent;
	}());
	//# sourceMappingURL=ReplaySubject.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
	//# sourceMappingURL=AsyncSubject.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=Immediate.js.map

	/** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
	//# sourceMappingURL=AsapAction.js.map

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=AsapScheduler.js.map

	/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=asap.js.map

	/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
	var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);
	//# sourceMappingURL=async.js.map

	/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
	//# sourceMappingURL=AnimationFrameAction.js.map

	/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=AnimationFrameScheduler.js.map

	/** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=animationFrame.js.map

	/** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=VirtualTimeScheduler.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function identity(x) {
	    return x;
	}
	//# sourceMappingURL=identity.js.map

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	function isObservable(obj) {
	    return !!obj && (obj instanceof Observable || (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'));
	}
	//# sourceMappingURL=isObservable.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function ArgumentOutOfRangeErrorImpl() {
	    Error.call(this);
	    this.message = 'argument out of range';
	    this.name = 'ArgumentOutOfRangeError';
	    return this;
	}
	ArgumentOutOfRangeErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
	var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
	//# sourceMappingURL=ArgumentOutOfRangeError.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=EmptyError.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=TimeoutError.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function map(project, thisArg) {
	    return function mapOperation(source) {
	        if (typeof project !== 'function') {
	            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	        }
	        return source.lift(new MapOperator(project, thisArg));
	    };
	}
	var MapOperator = /*@__PURE__*/ (function () {
	    function MapOperator(project, thisArg) {
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	    MapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	    };
	    return MapOperator;
	}());
	var MapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MapSubscriber, _super);
	    function MapSubscriber(destination, project, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.count = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    MapSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.project.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return MapSubscriber;
	}(Subscriber));
	//# sourceMappingURL=map.js.map

	/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=bindCallback.js.map

	/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */
	//# sourceMappingURL=bindNodeCallback.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var OuterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber));
	//# sourceMappingURL=OuterSubscriber.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	var InnerSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.outerValue = outerValue;
	        _this.outerIndex = outerIndex;
	        _this.index = 0;
	        return _this;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber));
	//# sourceMappingURL=InnerSubscriber.js.map

	/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
	var subscribeToPromise = function (promise) {
	    return function (subscriber) {
	        promise.then(function (value) {
	            if (!subscriber.closed) {
	                subscriber.next(value);
	                subscriber.complete();
	            }
	        }, function (err) { return subscriber.error(err); })
	            .then(null, hostReportError);
	        return subscriber;
	    };
	};
	//# sourceMappingURL=subscribeToPromise.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function getSymbolIterator() {
	    if (typeof Symbol !== 'function' || !Symbol.iterator) {
	        return '@@iterator';
	    }
	    return Symbol.iterator;
	}
	var iterator = /*@__PURE__*/ getSymbolIterator();
	//# sourceMappingURL=iterator.js.map

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
	var subscribeToIterable = function (iterable) {
	    return function (subscriber) {
	        var iterator$1 = iterable[iterator]();
	        do {
	            var item = iterator$1.next();
	            if (item.done) {
	                subscriber.complete();
	                break;
	            }
	            subscriber.next(item.value);
	            if (subscriber.closed) {
	                break;
	            }
	        } while (true);
	        if (typeof iterator$1.return === 'function') {
	            subscriber.add(function () {
	                if (iterator$1.return) {
	                    iterator$1.return();
	                }
	            });
	        }
	        return subscriber;
	    };
	};
	//# sourceMappingURL=subscribeToIterable.js.map

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
	var subscribeToObservable = function (obj) {
	    return function (subscriber) {
	        var obs = obj[observable]();
	        if (typeof obs.subscribe !== 'function') {
	            throw new TypeError('Provided object does not correctly implement Symbol.observable');
	        }
	        else {
	            return obs.subscribe(subscriber);
	        }
	    };
	};
	//# sourceMappingURL=subscribeToObservable.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
	//# sourceMappingURL=isArrayLike.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isPromise(value) {
	    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	//# sourceMappingURL=isPromise.js.map

	/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
	var subscribeTo = function (result) {
	    if (!!result && typeof result[observable] === 'function') {
	        return subscribeToObservable(result);
	    }
	    else if (isArrayLike(result)) {
	        return subscribeToArray(result);
	    }
	    else if (isPromise(result)) {
	        return subscribeToPromise(result);
	    }
	    else if (!!result && typeof result[iterator] === 'function') {
	        return subscribeToIterable(result);
	    }
	    else {
	        var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
	        var msg = "You provided " + value + " where a stream was expected."
	            + ' You can provide an Observable, Promise, Array, or Iterable.';
	        throw new TypeError(msg);
	    }
	};
	//# sourceMappingURL=subscribeTo.js.map

	/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
	    if (destination === void 0) {
	        destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
	    }
	    if (destination.closed) {
	        return undefined;
	    }
	    if (result instanceof Observable) {
	        return result.subscribe(destination);
	    }
	    return subscribeTo(result)(destination);
	}
	//# sourceMappingURL=subscribeToResult.js.map

	/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
	var NONE = {};
	function combineLatest() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var resultSelector = null;
	    var scheduler = null;
	    if (isScheduler(observables[observables.length - 1])) {
	        scheduler = observables.pop();
	    }
	    if (typeof observables[observables.length - 1] === 'function') {
	        resultSelector = observables.pop();
	    }
	    if (observables.length === 1 && isArray(observables[0])) {
	        observables = observables[0];
	    }
	    return fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
	}
	var CombineLatestOperator = /*@__PURE__*/ (function () {
	    function CombineLatestOperator(resultSelector) {
	        this.resultSelector = resultSelector;
	    }
	    CombineLatestOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
	    };
	    return CombineLatestOperator;
	}());
	var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(CombineLatestSubscriber, _super);
	    function CombineLatestSubscriber(destination, resultSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.resultSelector = resultSelector;
	        _this.active = 0;
	        _this.values = [];
	        _this.observables = [];
	        return _this;
	    }
	    CombineLatestSubscriber.prototype._next = function (observable) {
	        this.values.push(NONE);
	        this.observables.push(observable);
	    };
	    CombineLatestSubscriber.prototype._complete = function () {
	        var observables = this.observables;
	        var len = observables.length;
	        if (len === 0) {
	            this.destination.complete();
	        }
	        else {
	            this.active = len;
	            this.toRespond = len;
	            for (var i = 0; i < len; i++) {
	                var observable = observables[i];
	                this.add(subscribeToResult(this, observable, observable, i));
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
	        if ((this.active -= 1) === 0) {
	            this.destination.complete();
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var values = this.values;
	        var oldVal = values[outerIndex];
	        var toRespond = !this.toRespond
	            ? 0
	            : oldVal === NONE ? --this.toRespond : this.toRespond;
	        values[outerIndex] = innerValue;
	        if (toRespond === 0) {
	            if (this.resultSelector) {
	                this._tryResultSelector(values);
	            }
	            else {
	                this.destination.next(values.slice());
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
	        var result;
	        try {
	            result = this.resultSelector.apply(this, values);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return CombineLatestSubscriber;
	}(OuterSubscriber));
	//# sourceMappingURL=combineLatest.js.map

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
	function scheduleObservable(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        sub.add(scheduler.schedule(function () {
	            var observable$1 = input[observable]();
	            sub.add(observable$1.subscribe({
	                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
	                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
	                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
	            }));
	        }));
	        return sub;
	    });
	}
	//# sourceMappingURL=scheduleObservable.js.map

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
	function schedulePromise(input, scheduler) {
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        sub.add(scheduler.schedule(function () {
	            return input.then(function (value) {
	                sub.add(scheduler.schedule(function () {
	                    subscriber.next(value);
	                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
	                }));
	            }, function (err) {
	                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
	            });
	        }));
	        return sub;
	    });
	}
	//# sourceMappingURL=schedulePromise.js.map

	/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
	function scheduleIterable(input, scheduler) {
	    if (!input) {
	        throw new Error('Iterable cannot be null');
	    }
	    return new Observable(function (subscriber) {
	        var sub = new Subscription();
	        var iterator$1;
	        sub.add(function () {
	            if (iterator$1 && typeof iterator$1.return === 'function') {
	                iterator$1.return();
	            }
	        });
	        sub.add(scheduler.schedule(function () {
	            iterator$1 = input[iterator]();
	            sub.add(scheduler.schedule(function () {
	                if (subscriber.closed) {
	                    return;
	                }
	                var value;
	                var done;
	                try {
	                    var result = iterator$1.next();
	                    value = result.value;
	                    done = result.done;
	                }
	                catch (err) {
	                    subscriber.error(err);
	                    return;
	                }
	                if (done) {
	                    subscriber.complete();
	                }
	                else {
	                    subscriber.next(value);
	                    this.schedule();
	                }
	            }));
	        }));
	        return sub;
	    });
	}
	//# sourceMappingURL=scheduleIterable.js.map

	/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
	function isInteropObservable(input) {
	    return input && typeof input[observable] === 'function';
	}
	//# sourceMappingURL=isInteropObservable.js.map

	/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
	function isIterable(input) {
	    return input && typeof input[iterator] === 'function';
	}
	//# sourceMappingURL=isIterable.js.map

	/** PURE_IMPORTS_START _scheduleObservable,_schedulePromise,_scheduleArray,_scheduleIterable,_util_isInteropObservable,_util_isPromise,_util_isArrayLike,_util_isIterable PURE_IMPORTS_END */
	function scheduled(input, scheduler) {
	    if (input != null) {
	        if (isInteropObservable(input)) {
	            return scheduleObservable(input, scheduler);
	        }
	        else if (isPromise(input)) {
	            return schedulePromise(input, scheduler);
	        }
	        else if (isArrayLike(input)) {
	            return scheduleArray(input, scheduler);
	        }
	        else if (isIterable(input) || typeof input === 'string') {
	            return scheduleIterable(input, scheduler);
	        }
	    }
	    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
	}
	//# sourceMappingURL=scheduled.js.map

	/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
	function from(input, scheduler) {
	    if (!scheduler) {
	        if (input instanceof Observable) {
	            return input;
	        }
	        return new Observable(subscribeTo(input));
	    }
	    else {
	        return scheduled(input, scheduler);
	    }
	}
	//# sourceMappingURL=from.js.map

	/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
	function mergeMap(project, resultSelector, concurrent) {
	    if (concurrent === void 0) {
	        concurrent = Number.POSITIVE_INFINITY;
	    }
	    if (typeof resultSelector === 'function') {
	        return function (source) { return source.pipe(mergeMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
	    }
	    else if (typeof resultSelector === 'number') {
	        concurrent = resultSelector;
	    }
	    return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
	}
	var MergeMapOperator = /*@__PURE__*/ (function () {
	    function MergeMapOperator(project, concurrent) {
	        if (concurrent === void 0) {
	            concurrent = Number.POSITIVE_INFINITY;
	        }
	        this.project = project;
	        this.concurrent = concurrent;
	    }
	    MergeMapOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
	    };
	    return MergeMapOperator;
	}());
	var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(MergeMapSubscriber, _super);
	    function MergeMapSubscriber(destination, project, concurrent) {
	        if (concurrent === void 0) {
	            concurrent = Number.POSITIVE_INFINITY;
	        }
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeMapSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            this._tryNext(value);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeMapSubscriber.prototype._tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.active++;
	        this._innerSub(result, value, index);
	    };
	    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
	        var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        subscribeToResult(this, ish, value, index, innerSubscriber);
	    };
	    MergeMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeMapSubscriber;
	}(OuterSubscriber));
	//# sourceMappingURL=mergeMap.js.map

	/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
	function mergeAll(concurrent) {
	    if (concurrent === void 0) {
	        concurrent = Number.POSITIVE_INFINITY;
	    }
	    return mergeMap(identity, concurrent);
	}
	//# sourceMappingURL=mergeAll.js.map

	/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */
	//# sourceMappingURL=concatAll.js.map

	/** PURE_IMPORTS_START _of,_operators_concatAll PURE_IMPORTS_END */
	//# sourceMappingURL=concat.js.map

	/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
	//# sourceMappingURL=defer.js.map

	/** PURE_IMPORTS_START _Observable,_util_isArray,_operators_map,_util_isObject,_from PURE_IMPORTS_END */
	//# sourceMappingURL=forkJoin.js.map

	/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
	//# sourceMappingURL=fromEvent.js.map

	/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
	//# sourceMappingURL=fromEventPattern.js.map

	/** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=generate.js.map

	/** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */
	//# sourceMappingURL=iif.js.map

	/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
	function isNumeric(val) {
	    return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
	}
	//# sourceMappingURL=isNumeric.js.map

	/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */
	//# sourceMappingURL=interval.js.map

	/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	    var last = observables[observables.length - 1];
	    if (isScheduler(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    }
	    else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable) {
	        return observables[0];
	    }
	    return mergeAll(concurrent)(fromArray(observables, scheduler));
	}
	//# sourceMappingURL=merge.js.map

	/** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
	//# sourceMappingURL=never.js.map

	/** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */
	//# sourceMappingURL=onErrorResumeNext.js.map

	/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
	//# sourceMappingURL=pairs.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=not.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function filter(predicate, thisArg) {
	    return function filterOperatorFunction(source) {
	        return source.lift(new FilterOperator(predicate, thisArg));
	    };
	}
	var FilterOperator = /*@__PURE__*/ (function () {
	    function FilterOperator(predicate, thisArg) {
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	    }
	    FilterOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	    };
	    return FilterOperator;
	}());
	var FilterSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, predicate, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.count = 0;
	        return _this;
	    }
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber));
	//# sourceMappingURL=filter.js.map

	/** PURE_IMPORTS_START _util_not,_util_subscribeTo,_operators_filter,_Observable PURE_IMPORTS_END */
	//# sourceMappingURL=partition.js.map

	/** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=race.js.map

	/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
	//# sourceMappingURL=range.js.map

	/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
	function timer(dueTime, periodOrScheduler, scheduler) {
	    if (dueTime === void 0) {
	        dueTime = 0;
	    }
	    var period = -1;
	    if (isNumeric(periodOrScheduler)) {
	        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
	    }
	    else if (isScheduler(periodOrScheduler)) {
	        scheduler = periodOrScheduler;
	    }
	    if (!isScheduler(scheduler)) {
	        scheduler = async;
	    }
	    return new Observable(function (subscriber) {
	        var due = isNumeric(dueTime)
	            ? dueTime
	            : (+dueTime - scheduler.now());
	        return scheduler.schedule(dispatch$1, due, {
	            index: 0, period: period, subscriber: subscriber
	        });
	    });
	}
	function dispatch$1(state) {
	    var index = state.index, period = state.period, subscriber = state.subscriber;
	    subscriber.next(index);
	    if (subscriber.closed) {
	        return;
	    }
	    else if (period === -1) {
	        return subscriber.complete();
	    }
	    state.index = index + 1;
	    this.schedule(state, period);
	}
	//# sourceMappingURL=timer.js.map

	/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
	//# sourceMappingURL=using.js.map

	/** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
	//# sourceMappingURL=zip.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=index.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	function audit(durationSelector) {
	    return function auditOperatorFunction(source) {
	        return source.lift(new AuditOperator(durationSelector));
	    };
	}
	var AuditOperator = /*@__PURE__*/ (function () {
	    function AuditOperator(durationSelector) {
	        this.durationSelector = durationSelector;
	    }
	    AuditOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
	    };
	    return AuditOperator;
	}());
	var AuditSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(AuditSubscriber, _super);
	    function AuditSubscriber(destination, durationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.durationSelector = durationSelector;
	        _this.hasValue = false;
	        return _this;
	    }
	    AuditSubscriber.prototype._next = function (value) {
	        this.value = value;
	        this.hasValue = true;
	        if (!this.throttled) {
	            var duration = void 0;
	            try {
	                var durationSelector = this.durationSelector;
	                duration = durationSelector(value);
	            }
	            catch (err) {
	                return this.destination.error(err);
	            }
	            var innerSubscription = subscribeToResult(this, duration);
	            if (!innerSubscription || innerSubscription.closed) {
	                this.clearThrottle();
	            }
	            else {
	                this.add(this.throttled = innerSubscription);
	            }
	        }
	    };
	    AuditSubscriber.prototype.clearThrottle = function () {
	        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
	        if (throttled) {
	            this.remove(throttled);
	            this.throttled = null;
	            throttled.unsubscribe();
	        }
	        if (hasValue) {
	            this.value = null;
	            this.hasValue = false;
	            this.destination.next(value);
	        }
	    };
	    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
	        this.clearThrottle();
	    };
	    AuditSubscriber.prototype.notifyComplete = function () {
	        this.clearThrottle();
	    };
	    return AuditSubscriber;
	}(OuterSubscriber));
	//# sourceMappingURL=audit.js.map

	/** PURE_IMPORTS_START _scheduler_async,_audit,_observable_timer PURE_IMPORTS_END */
	function auditTime(duration, scheduler) {
	    if (scheduler === void 0) {
	        scheduler = async;
	    }
	    return audit(function () { return timer(duration, scheduler); });
	}
	//# sourceMappingURL=auditTime.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=buffer.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=bufferCount.js.map

	/** PURE_IMPORTS_START tslib,_scheduler_async,_Subscriber,_util_isScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=bufferTime.js.map

	/** PURE_IMPORTS_START tslib,_Subscription,_util_subscribeToResult,_OuterSubscriber PURE_IMPORTS_END */
	//# sourceMappingURL=bufferToggle.js.map

	/** PURE_IMPORTS_START tslib,_Subscription,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=bufferWhen.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=catchError.js.map

	/** PURE_IMPORTS_START _observable_combineLatest PURE_IMPORTS_END */
	//# sourceMappingURL=combineAll.js.map

	/** PURE_IMPORTS_START _util_isArray,_observable_combineLatest,_observable_from PURE_IMPORTS_END */
	//# sourceMappingURL=combineLatest.js.map

	/** PURE_IMPORTS_START _observable_concat PURE_IMPORTS_END */
	//# sourceMappingURL=concat.js.map

	/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */
	//# sourceMappingURL=concatMap.js.map

	/** PURE_IMPORTS_START _concatMap PURE_IMPORTS_END */
	//# sourceMappingURL=concatMapTo.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=count.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=debounce.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
	function debounceTime(dueTime, scheduler) {
	    if (scheduler === void 0) {
	        scheduler = async;
	    }
	    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
	}
	var DebounceTimeOperator = /*@__PURE__*/ (function () {
	    function DebounceTimeOperator(dueTime, scheduler) {
	        this.dueTime = dueTime;
	        this.scheduler = scheduler;
	    }
	    DebounceTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
	    };
	    return DebounceTimeOperator;
	}());
	var DebounceTimeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DebounceTimeSubscriber, _super);
	    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.dueTime = dueTime;
	        _this.scheduler = scheduler;
	        _this.debouncedSubscription = null;
	        _this.lastValue = null;
	        _this.hasValue = false;
	        return _this;
	    }
	    DebounceTimeSubscriber.prototype._next = function (value) {
	        this.clearDebounce();
	        this.lastValue = value;
	        this.hasValue = true;
	        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
	    };
	    DebounceTimeSubscriber.prototype._complete = function () {
	        this.debouncedNext();
	        this.destination.complete();
	    };
	    DebounceTimeSubscriber.prototype.debouncedNext = function () {
	        this.clearDebounce();
	        if (this.hasValue) {
	            var lastValue = this.lastValue;
	            this.lastValue = null;
	            this.hasValue = false;
	            this.destination.next(lastValue);
	        }
	    };
	    DebounceTimeSubscriber.prototype.clearDebounce = function () {
	        var debouncedSubscription = this.debouncedSubscription;
	        if (debouncedSubscription !== null) {
	            this.remove(debouncedSubscription);
	            debouncedSubscription.unsubscribe();
	            this.debouncedSubscription = null;
	        }
	    };
	    return DebounceTimeSubscriber;
	}(Subscriber));
	function dispatchNext(subscriber) {
	    subscriber.debouncedNext();
	}
	//# sourceMappingURL=debounceTime.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=defaultIfEmpty.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	function isDate(value) {
	    return value instanceof Date && !isNaN(+value);
	}
	//# sourceMappingURL=isDate.js.map

	/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_Subscriber,_Notification PURE_IMPORTS_END */
	function delay(delay, scheduler) {
	    if (scheduler === void 0) {
	        scheduler = async;
	    }
	    var absoluteDelay = isDate(delay);
	    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
	    return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
	}
	var DelayOperator = /*@__PURE__*/ (function () {
	    function DelayOperator(delay, scheduler) {
	        this.delay = delay;
	        this.scheduler = scheduler;
	    }
	    DelayOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
	    };
	    return DelayOperator;
	}());
	var DelaySubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DelaySubscriber, _super);
	    function DelaySubscriber(destination, delay, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.delay = delay;
	        _this.scheduler = scheduler;
	        _this.queue = [];
	        _this.active = false;
	        _this.errored = false;
	        return _this;
	    }
	    DelaySubscriber.dispatch = function (state) {
	        var source = state.source;
	        var queue = source.queue;
	        var scheduler = state.scheduler;
	        var destination = state.destination;
	        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
	            queue.shift().notification.observe(destination);
	        }
	        if (queue.length > 0) {
	            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
	            this.schedule(state, delay_1);
	        }
	        else {
	            this.unsubscribe();
	            source.active = false;
	        }
	    };
	    DelaySubscriber.prototype._schedule = function (scheduler) {
	        this.active = true;
	        var destination = this.destination;
	        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
	            source: this, destination: this.destination, scheduler: scheduler
	        }));
	    };
	    DelaySubscriber.prototype.scheduleNotification = function (notification) {
	        if (this.errored === true) {
	            return;
	        }
	        var scheduler = this.scheduler;
	        var message = new DelayMessage(scheduler.now() + this.delay, notification);
	        this.queue.push(message);
	        if (this.active === false) {
	            this._schedule(scheduler);
	        }
	    };
	    DelaySubscriber.prototype._next = function (value) {
	        this.scheduleNotification(Notification.createNext(value));
	    };
	    DelaySubscriber.prototype._error = function (err) {
	        this.errored = true;
	        this.queue = [];
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    DelaySubscriber.prototype._complete = function () {
	        this.scheduleNotification(Notification.createComplete());
	        this.unsubscribe();
	    };
	    return DelaySubscriber;
	}(Subscriber));
	var DelayMessage = /*@__PURE__*/ (function () {
	    function DelayMessage(time, notification) {
	        this.time = time;
	        this.notification = notification;
	    }
	    return DelayMessage;
	}());
	//# sourceMappingURL=delay.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Observable,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=delayWhen.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=dematerialize.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=distinct.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function distinctUntilChanged(compare, keySelector) {
	    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
	}
	var DistinctUntilChangedOperator = /*@__PURE__*/ (function () {
	    function DistinctUntilChangedOperator(compare, keySelector) {
	        this.compare = compare;
	        this.keySelector = keySelector;
	    }
	    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
	    };
	    return DistinctUntilChangedOperator;
	}());
	var DistinctUntilChangedSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(DistinctUntilChangedSubscriber, _super);
	    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.hasKey = false;
	        if (typeof compare === 'function') {
	            _this.compare = compare;
	        }
	        return _this;
	    }
	    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
	        return x === y;
	    };
	    DistinctUntilChangedSubscriber.prototype._next = function (value) {
	        var key;
	        try {
	            var keySelector = this.keySelector;
	            key = keySelector ? keySelector(value) : value;
	        }
	        catch (err) {
	            return this.destination.error(err);
	        }
	        var result = false;
	        if (this.hasKey) {
	            try {
	                var compare = this.compare;
	                result = compare(this.key, key);
	            }
	            catch (err) {
	                return this.destination.error(err);
	            }
	        }
	        else {
	            this.hasKey = true;
	        }
	        if (!result) {
	            this.key = key;
	            this.destination.next(value);
	        }
	    };
	    return DistinctUntilChangedSubscriber;
	}(Subscriber));
	//# sourceMappingURL=distinctUntilChanged.js.map

	/** PURE_IMPORTS_START _distinctUntilChanged PURE_IMPORTS_END */
	//# sourceMappingURL=distinctUntilKeyChanged.js.map

	/** PURE_IMPORTS_START tslib,_util_EmptyError,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=throwIfEmpty.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
	function take(count) {
	    return function (source) {
	        if (count === 0) {
	            return empty$1();
	        }
	        else {
	            return source.lift(new TakeOperator(count));
	        }
	    };
	}
	var TakeOperator = /*@__PURE__*/ (function () {
	    function TakeOperator(total) {
	        this.total = total;
	        if (this.total < 0) {
	            throw new ArgumentOutOfRangeError;
	        }
	    }
	    TakeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TakeSubscriber(subscriber, this.total));
	    };
	    return TakeOperator;
	}());
	var TakeSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(TakeSubscriber, _super);
	    function TakeSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    TakeSubscriber.prototype._next = function (value) {
	        var total = this.total;
	        var count = ++this.count;
	        if (count <= total) {
	            this.destination.next(value);
	            if (count === total) {
	                this.destination.complete();
	                this.unsubscribe();
	            }
	        }
	    };
	    return TakeSubscriber;
	}(Subscriber));
	//# sourceMappingURL=take.js.map

	/** PURE_IMPORTS_START _util_ArgumentOutOfRangeError,_filter,_throwIfEmpty,_defaultIfEmpty,_take PURE_IMPORTS_END */
	//# sourceMappingURL=elementAt.js.map

	/** PURE_IMPORTS_START _observable_concat,_observable_of PURE_IMPORTS_END */
	//# sourceMappingURL=endWith.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=every.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=exhaust.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
	//# sourceMappingURL=exhaustMap.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=expand.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */
	//# sourceMappingURL=finalize.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=find.js.map

	/** PURE_IMPORTS_START _operators_find PURE_IMPORTS_END */
	//# sourceMappingURL=findIndex.js.map

	/** PURE_IMPORTS_START _util_EmptyError,_filter,_take,_defaultIfEmpty,_throwIfEmpty,_util_identity PURE_IMPORTS_END */
	//# sourceMappingURL=first.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=ignoreElements.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=isEmpty.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError,_observable_empty PURE_IMPORTS_END */
	//# sourceMappingURL=takeLast.js.map

	/** PURE_IMPORTS_START _util_EmptyError,_filter,_takeLast,_throwIfEmpty,_defaultIfEmpty,_util_identity PURE_IMPORTS_END */
	//# sourceMappingURL=last.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=mapTo.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
	//# sourceMappingURL=materialize.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=scan.js.map

	/** PURE_IMPORTS_START _scan,_takeLast,_defaultIfEmpty,_util_pipe PURE_IMPORTS_END */
	//# sourceMappingURL=reduce.js.map

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
	//# sourceMappingURL=max.js.map

	/** PURE_IMPORTS_START _observable_merge PURE_IMPORTS_END */
	//# sourceMappingURL=merge.js.map

	/** PURE_IMPORTS_START _mergeMap PURE_IMPORTS_END */
	//# sourceMappingURL=mergeMapTo.js.map

	/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber PURE_IMPORTS_END */
	//# sourceMappingURL=mergeScan.js.map

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
	//# sourceMappingURL=min.js.map

	/** PURE_IMPORTS_START _observable_ConnectableObservable PURE_IMPORTS_END */
	//# sourceMappingURL=multicast.js.map

	/** PURE_IMPORTS_START tslib,_observable_from,_util_isArray,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=onErrorResumeNext.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function pairwise() {
	    return function (source) { return source.lift(new PairwiseOperator()); };
	}
	var PairwiseOperator = /*@__PURE__*/ (function () {
	    function PairwiseOperator() {
	    }
	    PairwiseOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new PairwiseSubscriber(subscriber));
	    };
	    return PairwiseOperator;
	}());
	var PairwiseSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(PairwiseSubscriber, _super);
	    function PairwiseSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasPrev = false;
	        return _this;
	    }
	    PairwiseSubscriber.prototype._next = function (value) {
	        var pair;
	        if (this.hasPrev) {
	            pair = [this.prev, value];
	        }
	        else {
	            this.hasPrev = true;
	        }
	        this.prev = value;
	        if (pair) {
	            this.destination.next(pair);
	        }
	    };
	    return PairwiseSubscriber;
	}(Subscriber));
	//# sourceMappingURL=pairwise.js.map

	/** PURE_IMPORTS_START _util_not,_filter PURE_IMPORTS_END */
	//# sourceMappingURL=partition.js.map

	/** PURE_IMPORTS_START _map PURE_IMPORTS_END */
	//# sourceMappingURL=pluck.js.map

	/** PURE_IMPORTS_START _Subject,_multicast PURE_IMPORTS_END */
	//# sourceMappingURL=publish.js.map

	/** PURE_IMPORTS_START _BehaviorSubject,_multicast PURE_IMPORTS_END */
	//# sourceMappingURL=publishBehavior.js.map

	/** PURE_IMPORTS_START _AsyncSubject,_multicast PURE_IMPORTS_END */
	//# sourceMappingURL=publishLast.js.map

	/** PURE_IMPORTS_START _ReplaySubject,_multicast PURE_IMPORTS_END */
	//# sourceMappingURL=publishReplay.js.map

	/** PURE_IMPORTS_START _util_isArray,_observable_race PURE_IMPORTS_END */
	//# sourceMappingURL=race.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_observable_empty PURE_IMPORTS_END */
	//# sourceMappingURL=repeat.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=repeatWhen.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=retry.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=retryWhen.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=sample.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async PURE_IMPORTS_END */
	//# sourceMappingURL=sampleTime.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=sequenceEqual.js.map

	/** PURE_IMPORTS_START _multicast,_refCount,_Subject PURE_IMPORTS_END */
	//# sourceMappingURL=share.js.map

	/** PURE_IMPORTS_START _ReplaySubject PURE_IMPORTS_END */
	//# sourceMappingURL=shareReplay.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_EmptyError PURE_IMPORTS_END */
	//# sourceMappingURL=single.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	function skip(count) {
	    return function (source) { return source.lift(new SkipOperator(count)); };
	}
	var SkipOperator = /*@__PURE__*/ (function () {
	    function SkipOperator(total) {
	        this.total = total;
	    }
	    SkipOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SkipSubscriber(subscriber, this.total));
	    };
	    return SkipOperator;
	}());
	var SkipSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SkipSubscriber, _super);
	    function SkipSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    SkipSubscriber.prototype._next = function (x) {
	        if (++this.count > this.total) {
	            this.destination.next(x);
	        }
	    };
	    return SkipSubscriber;
	}(Subscriber));
	//# sourceMappingURL=skip.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_ArgumentOutOfRangeError PURE_IMPORTS_END */
	//# sourceMappingURL=skipLast.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=skipUntil.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=skipWhile.js.map

	/** PURE_IMPORTS_START _observable_concat,_util_isScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=startWith.js.map

	/** PURE_IMPORTS_START tslib,_Observable,_scheduler_asap,_util_isNumeric PURE_IMPORTS_END */
	//# sourceMappingURL=SubscribeOnObservable.js.map

	/** PURE_IMPORTS_START _observable_SubscribeOnObservable PURE_IMPORTS_END */
	//# sourceMappingURL=subscribeOn.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult,_map,_observable_from PURE_IMPORTS_END */
	function switchMap(project, resultSelector) {
	    if (typeof resultSelector === 'function') {
	        return function (source) { return source.pipe(switchMap(function (a, i) { return from(project(a, i)).pipe(map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
	    }
	    return function (source) { return source.lift(new SwitchMapOperator(project)); };
	}
	var SwitchMapOperator = /*@__PURE__*/ (function () {
	    function SwitchMapOperator(project) {
	        this.project = project;
	    }
	    SwitchMapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
	    };
	    return SwitchMapOperator;
	}());
	var SwitchMapSubscriber = /*@__PURE__*/ (function (_super) {
	    __extends(SwitchMapSubscriber, _super);
	    function SwitchMapSubscriber(destination, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.index = 0;
	        return _this;
	    }
	    SwitchMapSubscriber.prototype._next = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (error) {
	            this.destination.error(error);
	            return;
	        }
	        this._innerSub(result, value, index);
	    };
	    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
	        var innerSubscription = this.innerSubscription;
	        if (innerSubscription) {
	            innerSubscription.unsubscribe();
	        }
	        var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        this.innerSubscription = subscribeToResult(this, result, value, index, innerSubscriber);
	    };
	    SwitchMapSubscriber.prototype._complete = function () {
	        var innerSubscription = this.innerSubscription;
	        if (!innerSubscription || innerSubscription.closed) {
	            _super.prototype._complete.call(this);
	        }
	        this.unsubscribe();
	    };
	    SwitchMapSubscriber.prototype._unsubscribe = function () {
	        this.innerSubscription = null;
	    };
	    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var destination = this.destination;
	        destination.remove(innerSub);
	        this.innerSubscription = null;
	        if (this.isStopped) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    return SwitchMapSubscriber;
	}(OuterSubscriber));
	//# sourceMappingURL=switchMap.js.map

	/** PURE_IMPORTS_START _switchMap,_util_identity PURE_IMPORTS_END */
	//# sourceMappingURL=switchAll.js.map

	/** PURE_IMPORTS_START _switchMap PURE_IMPORTS_END */
	//# sourceMappingURL=switchMapTo.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=takeUntil.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
	//# sourceMappingURL=takeWhile.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */
	//# sourceMappingURL=tap.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=throttle.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_scheduler_async,_throttle PURE_IMPORTS_END */
	//# sourceMappingURL=throttleTime.js.map

	/** PURE_IMPORTS_START _scheduler_async,_scan,_observable_defer,_map PURE_IMPORTS_END */
	//# sourceMappingURL=timeInterval.js.map

	/** PURE_IMPORTS_START tslib,_scheduler_async,_util_isDate,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=timeoutWith.js.map

	/** PURE_IMPORTS_START _scheduler_async,_util_TimeoutError,_timeoutWith,_observable_throwError PURE_IMPORTS_END */
	//# sourceMappingURL=timeout.js.map

	/** PURE_IMPORTS_START _scheduler_async,_map PURE_IMPORTS_END */
	//# sourceMappingURL=timestamp.js.map

	/** PURE_IMPORTS_START _reduce PURE_IMPORTS_END */
	//# sourceMappingURL=toArray.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=window.js.map

	/** PURE_IMPORTS_START tslib,_Subscriber,_Subject PURE_IMPORTS_END */
	//# sourceMappingURL=windowCount.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_scheduler_async,_Subscriber,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
	//# sourceMappingURL=windowTime.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_Subscription,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=windowToggle.js.map

	/** PURE_IMPORTS_START tslib,_Subject,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=windowWhen.js.map

	/** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
	//# sourceMappingURL=withLatestFrom.js.map

	/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */
	//# sourceMappingURL=zip.js.map

	/** PURE_IMPORTS_START _observable_zip PURE_IMPORTS_END */
	//# sourceMappingURL=zipAll.js.map

	/** PURE_IMPORTS_START  PURE_IMPORTS_END */
	//# sourceMappingURL=index.js.map

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template T
	 * @param {?} value
	 * @return {?}
	 */
	function isArray$1(value) {
	    return Array.isArray(value);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template T
	 * @param {?} arr
	 * @return {?}
	 */
	function isEmpty(arr) {
	    if (isArray$1(arr)) {
	        return arr.length === 0;
	    }
	    return false;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template E
	 * @param {?} entities
	 * @param {?} idKey
	 * @param {?} preAddEntity
	 * @return {?}
	 */
	function toEntitiesObject(entities, idKey, preAddEntity) {
	    var e_1, _a;
	    /** @type {?} */
	    var acc = {
	        entities: {},
	        ids: []
	    };
	    try {
	        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
	            var entity = entities_1_1.value;
	            // evaluate the middleware first to support dynamic ids
	            /** @type {?} */
	            var current = preAddEntity(entity);
	            acc.entities[current[idKey]] = current;
	            acc.ids.push(current[idKey]);
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    return acc;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template E
	 * @param {?} entities
	 * @param {?} id
	 * @return {?}
	 */
	function hasEntity(entities, id) {
	    return entities.hasOwnProperty(id);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template E
	 * @param {?} state
	 * @return {?}
	 */
	function hasActiveState(state) {
	    return state.hasOwnProperty('active');
	}
	// @internal
	/**
	 * @param {?} active
	 * @return {?}
	 */
	function isMultiActiveState(active) {
	    return isArray$1(active);
	}
	// @internal
	/**
	 * @template E
	 * @param {?} __0
	 * @return {?}
	 */
	function resolveActiveEntity(_a) {
	    var active = _a.active, ids = _a.ids, entities = _a.entities;
	    if (isMultiActiveState(active)) {
	        return getExitingActives(active, ids);
	    }
	    if (hasEntity(entities, active) === false) {
	        return null;
	    }
	    return active;
	}
	// @internal
	/**
	 * @param {?} currentActivesIds
	 * @param {?} newIds
	 * @return {?}
	 */
	function getExitingActives(currentActivesIds, newIds) {
	    /** @type {?} */
	    var filtered = currentActivesIds.filter((/**
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) { return newIds.indexOf(id) > -1; }));
	    /** Return the same reference if nothing has changed */
	    if (filtered.length === currentActivesIds.length) {
	        return currentActivesIds;
	    }
	    return filtered;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template Entity
	 * @param {?} state
	 * @return {?}
	 */
	function isEntityState(state) {
	    return state.entities && state.ids;
	}
	// @internal
	/**
	 * @template E
	 * @param {?} entities
	 * @param {?} preAddEntity
	 * @return {?}
	 */
	function applyMiddleware(entities, preAddEntity) {
	    var e_1, _a;
	    /** @type {?} */
	    var mapped = {};
	    try {
	        for (var _b = __values(Object.keys(entities)), _c = _b.next(); !_c.done; _c = _b.next()) {
	            var id = _c.value;
	            mapped[id] = preAddEntity(entities[id]);
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    return mapped;
	}
	// @internal
	/**
	 * @template S, E
	 * @param {?} __0
	 * @return {?}
	 */
	function setEntities(_a) {
	    var state = _a.state, entities = _a.entities, idKey = _a.idKey, preAddEntity = _a.preAddEntity, isNativePreAdd = _a.isNativePreAdd;
	    /** @type {?} */
	    var newEntities;
	    /** @type {?} */
	    var newIds;
	    if (isArray$1(entities)) {
	        /** @type {?} */
	        var resolve = toEntitiesObject(entities, idKey, preAddEntity);
	        newEntities = resolve.entities;
	        newIds = resolve.ids;
	    }
	    else if (isEntityState(entities)) {
	        newEntities = isNativePreAdd ? entities.entities : applyMiddleware(entities.entities, preAddEntity);
	        newIds = entities.ids;
	    }
	    else {
	        // it's an object
	        newEntities = isNativePreAdd ? entities : applyMiddleware(entities, preAddEntity);
	        newIds = Object.keys(newEntities).map((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return (isNaN((/** @type {?} */ (id))) ? id : Number(id)); }));
	    }
	    /** @type {?} */
	    var newState = __assign({}, state, { entities: newEntities, ids: newIds, loading: false });
	    if (hasActiveState(state)) {
	        newState.active = resolveActiveEntity((/** @type {?} */ (newState)));
	    }
	    return newState;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	var 
	// @internal
	AkitaError = /** @class */ (function (_super) {
	    __extends(AkitaError, _super);
	    function AkitaError(message) {
	        return _super.call(this, message) || this;
	    }
	    return AkitaError;
	}(Error));
	// @internal
	/**
	 * @param {?} name
	 * @param {?} className
	 * @return {?}
	 */
	function assertStoreHasName(name, className) {
	    if (!name) {
	        console.error("@StoreConfig({ name }) is missing in " + className);
	    }
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @param {?} storeName
	 * @param {?=} initialState
	 * @return {?}
	 */
	function newStateAction(storeName, initialState) {
	    if (initialState === void 0) { initialState = false; }
	    return {
	        type: 2 /* NEW_STATE */,
	        payload: {
	            name: storeName,
	            initialState: initialState
	        }
	    };
	}
	/** @type {?} */
	var currentAction = {
	    type: null,
	    entityIds: null,
	    skip: false
	};
	/** @type {?} */
	var customActionActive = false;
	/**
	 * @return {?}
	 */
	function resetCustomAction() {
	    customActionActive = false;
	}
	// public API for custom actions. Custom action always wins
	/**
	 * @param {?} type
	 * @param {?=} entityIds
	 * @return {?}
	 */
	function logAction(type, entityIds) {
	    setAction(type, entityIds);
	    customActionActive = true;
	}
	/**
	 * @param {?} type
	 * @param {?=} entityIds
	 * @return {?}
	 */
	function setAction(type, entityIds) {
	    if (customActionActive === false) {
	        currentAction.type = type;
	        currentAction.entityIds = entityIds;
	    }
	}
	/**
	 * @param {?=} skip
	 * @return {?}
	 */
	function setSkipAction(skip$$1) {
	    if (skip$$1 === void 0) { skip$$1 = true; }
	    currentAction.skip = skip$$1;
	}
	/**
	 * @param {?} action
	 * @param {?=} entityIds
	 * @return {?}
	 */
	function action(action, entityIds) {
	    return (/**
	     * @param {?} target
	     * @param {?} propertyKey
	     * @param {?} descriptor
	     * @return {?}
	     */
	    function (target, propertyKey, descriptor) {
	        /** @type {?} */
	        var originalMethod = descriptor.value;
	        descriptor.value = (/**
	         * @param {...?} args
	         * @return {?}
	         */
	        function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            logAction(action, entityIds);
	            return originalMethod.apply(this, args);
	        });
	        return descriptor;
	    });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/** @type {?} */
	var transactionFinished = new Subject();
	// @internal
	/** @type {?} */
	var transactionFinished$ = transactionFinished.asObservable();
	// @internal
	/** @type {?} */
	var transactionInProcess = new BehaviorSubject(false);
	// @internal
	/** @type {?} */
	var transactionInProcess$ = transactionInProcess.asObservable();
	// @internal
	/** @type {?} */
	var transactionManager = {
	    activeTransactions: 0,
	    batchTransaction: null
	};
	// @internal
	/**
	 * @return {?}
	 */
	function startBatch() {
	    if (!isTransactionInProcess()) {
	        transactionManager.batchTransaction = new Subject();
	    }
	    transactionManager.activeTransactions++;
	    transactionInProcess.next(true);
	}
	// @internal
	/**
	 * @return {?}
	 */
	function endBatch() {
	    if (--transactionManager.activeTransactions === 0) {
	        transactionManager.batchTransaction.next(true);
	        transactionManager.batchTransaction.complete();
	        transactionInProcess.next(false);
	        transactionFinished.next(true);
	    }
	}
	// @internal
	/**
	 * @return {?}
	 */
	function isTransactionInProcess() {
	    return transactionManager.activeTransactions > 0;
	}
	// @internal
	/**
	 * @return {?}
	 */
	function commit() {
	    return transactionManager.batchTransaction ? transactionManager.batchTransaction.asObservable() : of(true);
	}
	/**
	 *  A logical transaction.
	 *  Use this transaction to optimize the dispatch of all the stores.
	 *  The following code will update the store, BUT  emits only once
	 *
	 * \@example
	 *  applyTransaction(() => {
	 *    this.todosStore.add(new Todo(1, title));
	 *    this.todosStore.add(new Todo(2, title));
	 *  });
	 *
	 * @template T
	 * @param {?} action
	 * @param {?=} thisArg
	 * @return {?}
	 */
	function applyTransaction(action$$1, thisArg) {
	    if (thisArg === void 0) { thisArg = undefined; }
	    startBatch();
	    try {
	        return action$$1.apply(thisArg);
	    }
	    finally {
	        logAction('@Transaction');
	        endBatch();
	    }
	}
	/**
	 *  A logical transaction.
	 *  Use this transaction to optimize the dispatch of all the stores.
	 *
	 *  The following code will update the store, BUT  emits only once.
	 *
	 * \@example
	 * \@transaction
	 *  addTodos() {
	 *    this.todosStore.add(new Todo(1, title));
	 *    this.todosStore.add(new Todo(2, title));
	 *  }
	 *
	 *
	 * @return {?}
	 */
	function transaction() {
	    return (/**
	     * @param {?} target
	     * @param {?} propertyKey
	     * @param {?} descriptor
	     * @return {?}
	     */
	    function (target, propertyKey, descriptor) {
	        /** @type {?} */
	        var originalMethod = descriptor.value;
	        descriptor.value = (/**
	         * @param {...?} args
	         * @return {?}
	         */
	        function () {
	            var _this = this;
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            return applyTransaction((/**
	             * @return {?}
	             */
	            function () {
	                return originalMethod.apply(_this, args);
	            }), this);
	        });
	        return descriptor;
	    });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} o
	 * @return {?}
	 */
	function deepFreeze(o) {
	    Object.freeze(o);
	    /** @type {?} */
	    var oIsFunction = typeof o === 'function';
	    /** @type {?} */
	    var hasOwnProp = Object.prototype.hasOwnProperty;
	    Object.getOwnPropertyNames(o).forEach((/**
	     * @param {?} prop
	     * @return {?}
	     */
	    function (prop) {
	        if (hasOwnProp.call(o, prop) &&
	            (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
	            o[prop] !== null &&
	            (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
	            !Object.isFrozen(o[prop])) {
	            deepFreeze(o[prop]);
	        }
	    }));
	    return o;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var configKey = 'akitaConfig';

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var CONFIG = {
	    resettable: false
	};
	// @internal
	/**
	 * @return {?}
	 */
	function getAkitaConfig() {
	    return CONFIG;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function toBoolean(value) {
	    return value != null && "" + value !== 'false';
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function isPlainObject(value) {
	    return toBoolean(value) && value.constructor.name === 'Object';
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function isFunction$1(value) {
	    return typeof value === 'function';
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/** @type {?} */
	var rootDispatcher = new ReplaySubject();

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/** @type {?} */
	var __stores__ = {};

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var isBrowser = typeof window !== 'undefined';
	/** @type {?} */
	var isNativeScript = typeof global !== 'undefined' && typeof ((/** @type {?} */ (global))).__runtimeVersion !== 'undefined';
	// @internal
	/** @type {?} */
	var isNotBrowser = !isBrowser && !isNativeScript;

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var __DEV__ = true;
	// @internal
	/**
	 * @return {?}
	 */
	function isDev() {
	    return __DEV__;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var DEFAULT_ID_KEY = 'id';

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 *
	 * Store for managing any type of data
	 *
	 * \@example
	 *
	 * export interface SessionState {
	 *   token: string;
	 *   userDetails: UserDetails
	 * }
	 *
	 * export function createInitialState(): SessionState {
	 *  return {
	 *    token: '',
	 *    userDetails: null
	 *  };
	 * }
	 *
	 * \@StoreConfig({ name: 'session' })
	 * export class SessionStore extends Store<SessionState> {
	 *   constructor() {
	 *    super(createInitialState());
	 *   }
	 * }
	 * @template S
	 */
	var  /**
	 *
	 * Store for managing any type of data
	 *
	 * \@example
	 *
	 * export interface SessionState {
	 *   token: string;
	 *   userDetails: UserDetails
	 * }
	 *
	 * export function createInitialState(): SessionState {
	 *  return {
	 *    token: '',
	 *    userDetails: null
	 *  };
	 * }
	 *
	 * \@StoreConfig({ name: 'session' })
	 * export class SessionStore extends Store<SessionState> {
	 *   constructor() {
	 *    super(createInitialState());
	 *   }
	 * }
	 * @template S
	 */
	Store = /** @class */ (function () {
	    function Store(initialState, options) {
	        if (options === void 0) { options = {}; }
	        this.options = options;
	        this.inTransaction = false;
	        this.cache = {
	            active: new BehaviorSubject(false),
	            ttl: null
	        };
	        this.onInit((/** @type {?} */ (initialState)));
	    }
	    /**
	     *  Set the loading state
	     *
	     *  @example
	     *
	     *  store.setLoading(true)
	     *
	     */
	    /**
	     *  Set the loading state
	     *
	     * \@example
	     *
	     *  store.setLoading(true)
	     *
	     * @param {?=} loading
	     * @return {?}
	     */
	    Store.prototype.setLoading = /**
	     *  Set the loading state
	     *
	     * \@example
	     *
	     *  store.setLoading(true)
	     *
	     * @param {?=} loading
	     * @return {?}
	     */
	    function (loading) {
	        if (loading === void 0) { loading = false; }
	        if (loading !== ((/** @type {?} */ (this._value()))).loading) {
	            isDev() && setAction('Set Loading');
	            this._setState((/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) { return ((/** @type {?} */ (__assign({}, state, { loading: loading })))); }));
	        }
	    };
	    /**
	     *
	     * Set whether the data is cached
	     *
	     * @example
	     *
	     * store.setHasCache(true)
	     * store.setHasCache(false)
	     *
	     */
	    /**
	     *
	     * Set whether the data is cached
	     *
	     * \@example
	     *
	     * store.setHasCache(true)
	     * store.setHasCache(false)
	     *
	     * @param {?} hasCache
	     * @return {?}
	     */
	    Store.prototype.setHasCache = /**
	     *
	     * Set whether the data is cached
	     *
	     * \@example
	     *
	     * store.setHasCache(true)
	     * store.setHasCache(false)
	     *
	     * @param {?} hasCache
	     * @return {?}
	     */
	    function (hasCache) {
	        if (hasCache !== this.cache.active.value) {
	            this.cache.active.next(hasCache);
	        }
	    };
	    /**
	     *  Set the error state
	     *
	     *  @example
	     *
	     *  store.setError({text: 'unable to load data' })
	     *
	     */
	    /**
	     *  Set the error state
	     *
	     * \@example
	     *
	     *  store.setError({text: 'unable to load data' })
	     *
	     * @template T
	     * @param {?} error
	     * @return {?}
	     */
	    Store.prototype.setError = /**
	     *  Set the error state
	     *
	     * \@example
	     *
	     *  store.setError({text: 'unable to load data' })
	     *
	     * @template T
	     * @param {?} error
	     * @return {?}
	     */
	    function (error) {
	        if (error !== ((/** @type {?} */ (this._value()))).error) {
	            isDev() && setAction('Set Error');
	            this._setState((/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) { return ((/** @type {?} */ (__assign({}, state, { error: error })))); }));
	        }
	    };
	    // @internal
	    // @internal
	    /**
	     * @template R
	     * @param {?} project
	     * @return {?}
	     */
	    Store.prototype._select = 
	    // @internal
	    /**
	     * @template R
	     * @param {?} project
	     * @return {?}
	     */
	    function (project) {
	        return this.store.asObservable().pipe(map(project), distinctUntilChanged());
	    };
	    // @internal
	    // @internal
	    /**
	     * @return {?}
	     */
	    Store.prototype._value = 
	    // @internal
	    /**
	     * @return {?}
	     */
	    function () {
	        return this.storeValue;
	    };
	    // @internal
	    // @internal
	    /**
	     * @return {?}
	     */
	    Store.prototype._cache = 
	    // @internal
	    /**
	     * @return {?}
	     */
	    function () {
	        return this.cache.active;
	    };
	    Object.defineProperty(Store.prototype, "config", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.constructor[configKey] || {};
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Store.prototype, "storeName", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.config.storeName || this.options.storeName || this.options.name;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Store.prototype, "idKey", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.config.idKey || this.options.idKey || DEFAULT_ID_KEY;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Store.prototype, "deepFreeze", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.config.deepFreezeFn || this.options.deepFreezeFn || deepFreeze;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Store.prototype, "cacheConfig", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.config.cache || this.options.cache;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // @internal
	    // @internal
	    /**
	     * @param {?} newStateFn
	     * @param {?=} _dispatchAction
	     * @return {?}
	     */
	    Store.prototype._setState = 
	    // @internal
	    /**
	     * @param {?} newStateFn
	     * @param {?=} _dispatchAction
	     * @return {?}
	     */
	    function (newStateFn, _dispatchAction) {
	        if (_dispatchAction === void 0) { _dispatchAction = true; }
	        this.storeValue = __DEV__ ? this.deepFreeze(newStateFn(this._value())) : newStateFn(this._value());
	        if (!this.store) {
	            this.store = new BehaviorSubject(this.storeValue);
	            rootDispatcher.next(newStateAction(this.storeName, true));
	            return;
	        }
	        if (isTransactionInProcess()) {
	            this.handleTransaction();
	            return;
	        }
	        this.dispatch(this.storeValue, _dispatchAction);
	    };
	    /**
	     *
	     * Reset the current store back to the initial value
	     *
	     * @example
	     *
	     * store.reset()
	     *
	     */
	    /**
	     *
	     * Reset the current store back to the initial value
	     *
	     * \@example
	     *
	     * store.reset()
	     *
	     * @return {?}
	     */
	    Store.prototype.reset = /**
	     *
	     * Reset the current store back to the initial value
	     *
	     * \@example
	     *
	     * store.reset()
	     *
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        if (this.isResettable()) {
	            isDev() && setAction('Reset');
	            this._setState((/**
	             * @return {?}
	             */
	            function () { return Object.assign({}, _this._initialState); }));
	            this.setHasCache(false);
	        }
	        else {
	            isDev() && console.warn("You need to enable the reset functionality");
	        }
	    };
	    /**
	     * @param {?} stateOrCallback
	     * @return {?}
	     */
	    Store.prototype.update = /**
	     * @param {?} stateOrCallback
	     * @return {?}
	     */
	    function (stateOrCallback) {
	        var _this = this;
	        isDev() && setAction('Update');
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            /** @type {?} */
	            var newState = isFunction$1(stateOrCallback) ? stateOrCallback(state) : stateOrCallback;
	            /** @type {?} */
	            var merged = _this.akitaPreUpdate(state, (/** @type {?} */ (__assign({}, state, newState))));
	            return isPlainObject(state) ? merged : new ((/** @type {?} */ (state))).constructor(merged);
	        }));
	    };
	    /**
	     * @param {?} newOptions
	     * @return {?}
	     */
	    Store.prototype.updateStoreConfig = /**
	     * @param {?} newOptions
	     * @return {?}
	     */
	    function (newOptions) {
	        this.options = __assign({}, this.options, newOptions);
	    };
	    // @internal
	    // @internal
	    /**
	     * @param {?} _
	     * @param {?} nextState
	     * @return {?}
	     */
	    Store.prototype.akitaPreUpdate = 
	    // @internal
	    /**
	     * @param {?} _
	     * @param {?} nextState
	     * @return {?}
	     */
	    function (_, nextState) {
	        return nextState;
	    };
	    /**
	     * @return {?}
	     */
	    Store.prototype.ngOnDestroy = /**
	     * @return {?}
	     */
	    function () {
	        this.destroy();
	    };
	    /**
	     *
	     * Destroy the store
	     *
	     * @example
	     *
	     * store.destroy()
	     *
	     */
	    /**
	     *
	     * Destroy the store
	     *
	     * \@example
	     *
	     * store.destroy()
	     *
	     * @return {?}
	     */
	    Store.prototype.destroy = /**
	     *
	     * Destroy the store
	     *
	     * \@example
	     *
	     * store.destroy()
	     *
	     * @return {?}
	     */
	    function () {
	        if (isNotBrowser)
	            return;
	        if (!((/** @type {?} */ (window))).hmrEnabled && this === __stores__[this.storeName]) {
	            delete __stores__[this.storeName];
	            rootDispatcher.next({
	                type: 1 /* DELETE_STORE */,
	                payload: { storeName: this.storeName }
	            });
	            this.setHasCache(false);
	            this.cache.active.complete();
	        }
	    };
	    /**
	     * @private
	     * @param {?} initialState
	     * @return {?}
	     */
	    Store.prototype.onInit = /**
	     * @private
	     * @param {?} initialState
	     * @return {?}
	     */
	    function (initialState) {
	        isDev() && setAction('@@INIT');
	        __stores__[this.storeName] = this;
	        this._setState((/**
	         * @return {?}
	         */
	        function () { return initialState; }));
	        rootDispatcher.next({
	            type: 0 /* NEW_STORE */,
	            payload: { store: this }
	        });
	        if (this.isResettable()) {
	            this._initialState = initialState;
	        }
	        isDev() && assertStoreHasName(this.storeName, this.constructor.name);
	    };
	    /**
	     * @private
	     * @param {?} state
	     * @param {?=} _dispatchAction
	     * @return {?}
	     */
	    Store.prototype.dispatch = /**
	     * @private
	     * @param {?} state
	     * @param {?=} _dispatchAction
	     * @return {?}
	     */
	    function (state, _dispatchAction) {
	        if (_dispatchAction === void 0) { _dispatchAction = true; }
	        this.store.next(state);
	        if (_dispatchAction) {
	            rootDispatcher.next(newStateAction(this.storeName));
	            resetCustomAction();
	        }
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    Store.prototype.watchTransaction = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        commit().subscribe((/**
	         * @return {?}
	         */
	        function () {
	            _this.inTransaction = false;
	            _this.dispatch(_this._value());
	        }));
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    Store.prototype.isResettable = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        /** @type {?} */
	        var localReset = this.config && this.config.resettable;
	        if (localReset === false) {
	            return false;
	        }
	        return localReset || getAkitaConfig().resettable;
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    Store.prototype.handleTransaction = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        if (!this.inTransaction) {
	            this.watchTransaction();
	            this.inTransaction = true;
	        }
	    };
	    return Store;
	}());

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} v
	 * @return {?}
	 */
	function isNil(v) {
	    return v === null || v === undefined;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function isObject$1(value) {
	    /** @type {?} */
	    var type = typeof value;
	    return value != null && (type == 'object' || type == 'function');
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} idOrOptions
	 * @param {?} ids
	 * @param {?} currentActive
	 * @return {?}
	 */
	function getActiveEntities(idOrOptions, ids, currentActive) {
	    /** @type {?} */
	    var result;
	    if (isArray$1(idOrOptions)) {
	        result = idOrOptions;
	    }
	    else {
	        if (isObject$1(idOrOptions)) {
	            if (isNil(currentActive))
	                return;
	            ((/** @type {?} */ (idOrOptions))) = Object.assign({ wrap: true }, idOrOptions);
	            /** @type {?} */
	            var currentIdIndex = ids.indexOf((/** @type {?} */ (currentActive)));
	            if (((/** @type {?} */ (idOrOptions))).prev) {
	                /** @type {?} */
	                var isFirst = currentIdIndex === 0;
	                if (isFirst && !((/** @type {?} */ (idOrOptions))).wrap)
	                    return;
	                result = isFirst ? ids[ids.length - 1] : ((/** @type {?} */ (ids[currentIdIndex - 1])));
	            }
	            else if (((/** @type {?} */ (idOrOptions))).next) {
	                /** @type {?} */
	                var isLast = ids.length === currentIdIndex + 1;
	                if (isLast && !((/** @type {?} */ (idOrOptions))).wrap)
	                    return;
	                result = isLast ? ids[0] : ((/** @type {?} */ (ids[currentIdIndex + 1])));
	            }
	        }
	        else {
	            if (idOrOptions === currentActive)
	                return;
	            result = (/** @type {?} */ (idOrOptions));
	        }
	    }
	    return result;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template S, E
	 * @param {?} __0
	 * @return {?}
	 */
	function addEntities(_a) {
	    var state = _a.state, entities = _a.entities, idKey = _a.idKey, _b = _a.options, options = _b === void 0 ? {} : _b, preAddEntity = _a.preAddEntity;
	    var e_1, _c;
	    /** @type {?} */
	    var newEntities = {};
	    /** @type {?} */
	    var newIds = [];
	    /** @type {?} */
	    var hasNewEntities = false;
	    try {
	        for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
	            var entity = entities_1_1.value;
	            if (hasEntity(state.entities, entity[idKey]) === false) {
	                // evaluate the middleware first to support dynamic ids
	                /** @type {?} */
	                var current = preAddEntity(entity);
	                /** @type {?} */
	                var entityId = current[idKey];
	                newEntities[entityId] = current;
	                if (options.prepend)
	                    newIds.unshift(entityId);
	                else
	                    newIds.push(entityId);
	                hasNewEntities = true;
	            }
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (entities_1_1 && !entities_1_1.done && (_c = entities_1.return)) _c.call(entities_1);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    return hasNewEntities
	        ? {
	            newState: __assign({}, state, { entities: __assign({}, state.entities, newEntities), ids: options.prepend ? __spread(newIds, state.ids) : __spread(state.ids, newIds) }),
	            newIds: newIds
	        }
	        : null;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template T
	 * @param {?} value
	 * @return {?}
	 */
	function coerceArray(value) {
	    if (isNil(value)) {
	        return [];
	    }
	    return Array.isArray(value) ? value : [value];
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template S, E
	 * @param {?} __0
	 * @return {?}
	 */
	function removeEntities(_a) {
	    var state = _a.state, ids = _a.ids;
	    var e_1, _b;
	    if (isNil(ids))
	        return removeAllEntities(state);
	    /** @type {?} */
	    var entities = state.entities;
	    /** @type {?} */
	    var newEntities = {};
	    try {
	        for (var _c = __values(state.ids), _d = _c.next(); !_d.done; _d = _c.next()) {
	            var id = _d.value;
	            if (ids.includes(id) === false) {
	                newEntities[id] = entities[id];
	            }
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    /** @type {?} */
	    var newState = __assign({}, state, { entities: newEntities, ids: state.ids.filter((/**
	         * @param {?} current
	         * @return {?}
	         */
	        function (current) { return ids.includes(current) === false; })) });
	    if (hasActiveState(state)) {
	        newState.active = resolveActiveEntity(newState);
	    }
	    return newState;
	}
	// @internal
	/**
	 * @template S
	 * @param {?} state
	 * @return {?}
	 */
	function removeAllEntities(state) {
	    return __assign({}, state, { entities: {}, ids: [], active: isMultiActiveState(state.active) ? [] : null });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/** @type {?} */
	var getInitialEntitiesState = (/**
	 * @return {?}
	 */
	function () {
	    return ((/** @type {?} */ ({
	        entities: {},
	        ids: [],
	        loading: true,
	        error: null
	    })));
	});

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} val
	 * @return {?}
	 */
	function isDefined(val) {
	    return isNil(val) === false;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template S, E
	 * @param {?} __0
	 * @return {?}
	 */
	function updateEntities(_a) {
	    var state = _a.state, ids = _a.ids, idKey = _a.idKey, newStateOrFn = _a.newStateOrFn, preUpdateEntity = _a.preUpdateEntity;
	    var e_1, _b;
	    /** @type {?} */
	    var updatedEntities = {};
	    /** @type {?} */
	    var isUpdatingIdKey = false;
	    /** @type {?} */
	    var idToUpdate;
	    try {
	        for (var ids_1 = __values(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
	            var id = ids_1_1.value;
	            // if the entity doesn't exist don't do anything
	            if (hasEntity(state.entities, id) === false) {
	                continue;
	            }
	            /** @type {?} */
	            var oldEntity = state.entities[id];
	            /** @type {?} */
	            var newState = isFunction$1(newStateOrFn) ? newStateOrFn(oldEntity) : newStateOrFn;
	            /** @type {?} */
	            var isIdChanged = newState.hasOwnProperty(idKey) && newState[idKey] !== oldEntity[idKey];
	            /** @type {?} */
	            var newEntity = void 0;
	            idToUpdate = id;
	            if (isIdChanged) {
	                isUpdatingIdKey = true;
	                idToUpdate = newState[idKey];
	            }
	            /** @type {?} */
	            var merged = __assign({}, oldEntity, newState);
	            if (isPlainObject(oldEntity)) {
	                newEntity = merged;
	            }
	            else {
	                /**
	                 * In case that new state is class of it's own, there's
	                 * a possibility that it will be different than the old
	                 * class.
	                 * For example, Old state is an instance of animal class
	                 * and new state is instance of person class.
	                 * To avoid run over new person class with the old animal
	                 * class we check if the new state is a class of it's own.
	                 * If so, use it. Otherwise, use the old state class
	                 */
	                if (isPlainObject(newState)) {
	                    newEntity = new ((/** @type {?} */ (oldEntity))).constructor(merged);
	                }
	                else {
	                    newEntity = new ((/** @type {?} */ (newState))).constructor(merged);
	                }
	            }
	            updatedEntities[idToUpdate] = preUpdateEntity(oldEntity, newEntity);
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (ids_1_1 && !ids_1_1.done && (_b = ids_1.return)) _b.call(ids_1);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    /** @type {?} */
	    var updatedIds = state.ids;
	    /** @type {?} */
	    var stateEntities = state.entities;
	    if (isUpdatingIdKey) {
	        var _c = __read(ids, 1), id_1 = _c[0];
	        var _d = state.entities, _e = id_1, deletedEntity = _d[_e], rest = __rest(_d, [typeof _e === "symbol" ? _e : _e + ""]);
	        stateEntities = rest;
	        updatedIds = state.ids.map((/**
	         * @param {?} current
	         * @return {?}
	         */
	        function (current) { return (current === id_1 ? idToUpdate : current); }));
	    }
	    return __assign({}, state, { entities: __assign({}, stateEntities, updatedEntities), ids: updatedIds });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function isUndefined(value) {
	    return value === undefined;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @enum {number} */
	var EntityActions = {
	    Set: 0,
	    Add: 1,
	    Update: 2,
	    Remove: 3,
	};
	EntityActions[EntityActions.Set] = 'Set';
	EntityActions[EntityActions.Add] = 'Add';
	EntityActions[EntityActions.Update] = 'Update';
	EntityActions[EntityActions.Remove] = 'Remove';

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 *
	 * Store for managing a collection of entities
	 *
	 * \@example
	 *
	 * export interface WidgetsState extends EntityState<Widget> { }
	 *
	 * \@StoreConfig({ name: 'widgets' })
	 *  export class WidgetsStore extends EntityStore<WidgetsState, Widget> {
	 *   constructor() {
	 *     super();
	 *   }
	 * }
	 *
	 *
	 * @template S, E, EntityID
	 */
	var EntityStore = /** @class */ (function (_super) {
	    __extends(EntityStore, _super);
	    function EntityStore(initialState, options) {
	        if (initialState === void 0) { initialState = {}; }
	        if (options === void 0) { options = {}; }
	        var _this = _super.call(this, __assign({}, getInitialEntitiesState(), initialState), options) || this;
	        _this.options = options;
	        _this.updatedEntityIds = new BehaviorSubject([]);
	        _this.entityActions = new Subject();
	        return _this;
	    }
	    Object.defineProperty(EntityStore.prototype, "updatedEntityIds$", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.updatedEntityIds.asObservable();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(EntityStore.prototype, "selectEntityAction$", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.entityActions.asObservable();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     *
	     * Replace current collection with provided collection
	     *
	     * @example
	     *
	     * this.store.set([Entity, Entity])
	     * this.store.set({ids: [], entities: {}})
	     * this.store.set({ 1: {}, 2: {}})
	     *
	     */
	    /**
	     *
	     * Replace current collection with provided collection
	     *
	     * \@example
	     *
	     * this.store.set([Entity, Entity])
	     * this.store.set({ids: [], entities: {}})
	     * this.store.set({ 1: {}, 2: {}})
	     *
	     * @param {?} entities
	     * @return {?}
	     */
	    EntityStore.prototype.set = /**
	     *
	     * Replace current collection with provided collection
	     *
	     * \@example
	     *
	     * this.store.set([Entity, Entity])
	     * this.store.set({ids: [], entities: {}})
	     * this.store.set({ 1: {}, 2: {}})
	     *
	     * @param {?} entities
	     * @return {?}
	     */
	    function (entities) {
	        var _this = this;
	        if (isNil(entities))
	            return;
	        isDev() && setAction('Set Entity');
	        /** @type {?} */
	        var isNativePreAdd = this.akitaPreAddEntity === EntityStore.prototype.akitaPreAddEntity;
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            return setEntities({
	                state: state,
	                entities: entities,
	                idKey: _this.idKey,
	                preAddEntity: _this.akitaPreAddEntity,
	                isNativePreAdd: isNativePreAdd
	            });
	        }));
	        this.updateCache();
	        if (this.hasInitialUIState()) {
	            this.handleUICreation();
	        }
	        this.entityActions.next({ type: EntityActions.Set, ids: this.ids });
	    };
	    /**
	     * Add entities
	     *
	     * @example
	     *
	     * this.store.add([Entity, Entity])
	     * this.store.add(Entity)
	     * this.store.add(Entity, { prepend: true })
	     *
	     * this.store.add(Entity, { loading: false })
	     */
	    /**
	     * Add entities
	     *
	     * \@example
	     *
	     * this.store.add([Entity, Entity])
	     * this.store.add(Entity)
	     * this.store.add(Entity, { prepend: true })
	     *
	     * this.store.add(Entity, { loading: false })
	     * @param {?} entities
	     * @param {?=} options
	     * @return {?}
	     */
	    EntityStore.prototype.add = /**
	     * Add entities
	     *
	     * \@example
	     *
	     * this.store.add([Entity, Entity])
	     * this.store.add(Entity)
	     * this.store.add(Entity, { prepend: true })
	     *
	     * this.store.add(Entity, { loading: false })
	     * @param {?} entities
	     * @param {?=} options
	     * @return {?}
	     */
	    function (entities, options) {
	        if (options === void 0) { options = { loading: false }; }
	        /** @type {?} */
	        var collection = coerceArray(entities);
	        if (isEmpty(collection))
	            return;
	        isDev() && setAction('Add Entity');
	        /** @type {?} */
	        var data = addEntities({
	            state: this._value(),
	            preAddEntity: this.akitaPreAddEntity,
	            entities: collection,
	            idKey: this.idKey,
	            options: options
	        });
	        if (data) {
	            this._setState((/**
	             * @return {?}
	             */
	            function () { return (__assign({}, data.newState, { loading: options.loading })); }));
	            if (this.hasInitialUIState()) {
	                this.handleUICreation(true);
	            }
	            this.entityActions.next({ type: EntityActions.Add, ids: data.newIds });
	        }
	    };
	    /**
	     * @param {?} idsOrFnOrState
	     * @param {?=} newStateOrFn
	     * @return {?}
	     */
	    EntityStore.prototype.update = /**
	     * @param {?} idsOrFnOrState
	     * @param {?=} newStateOrFn
	     * @return {?}
	     */
	    function (idsOrFnOrState, newStateOrFn) {
	        var _this = this;
	        if (isUndefined(newStateOrFn)) {
	            _super.prototype.update.call(this, (/** @type {?} */ (idsOrFnOrState)));
	            return;
	        }
	        /** @type {?} */
	        var ids = [];
	        if (isFunction$1(idsOrFnOrState)) {
	            // We need to filter according the predicate function
	            ids = this.ids.filter((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) { return ((/** @type {?} */ (idsOrFnOrState)))(_this.entities[id]); }));
	        }
	        else {
	            // If it's nil we want all of them
	            ids = isNil(idsOrFnOrState) ? this.ids : coerceArray(idsOrFnOrState);
	        }
	        if (isEmpty(ids))
	            return;
	        isDev() && setAction('Update Entity', ids);
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            return updateEntities({
	                idKey: _this.idKey,
	                ids: ids,
	                preUpdateEntity: _this.akitaPreUpdateEntity,
	                state: state,
	                newStateOrFn: newStateOrFn
	            });
	        }));
	        this.updatedEntityIds.next(ids);
	        this.entityActions.next({ type: EntityActions.Update, ids: ids });
	    };
	    /**
	     *
	     * Create or update
	     *
	     * @example
	     *
	     * store.upsert(1, { active: true })
	     * store.upsert([2, 3], { active: true })
	     * store.upsert([2, 3], entity => ({ isOpen: !entity.isOpen}))
	     *
	     */
	    /**
	     *
	     * Create or update
	     *
	     * \@example
	     *
	     * store.upsert(1, { active: true })
	     * store.upsert([2, 3], { active: true })
	     * store.upsert([2, 3], entity => ({ isOpen: !entity.isOpen}))
	     *
	     * @param {?} ids
	     * @param {?} newState
	     * @param {?=} options
	     * @return {?}
	     */
	    EntityStore.prototype.upsert = /**
	     *
	     * Create or update
	     *
	     * \@example
	     *
	     * store.upsert(1, { active: true })
	     * store.upsert([2, 3], { active: true })
	     * store.upsert([2, 3], entity => ({ isOpen: !entity.isOpen}))
	     *
	     * @param {?} ids
	     * @param {?} newState
	     * @param {?=} options
	     * @return {?}
	     */
	    function (ids, newState, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        /** @type {?} */
	        var toArray = coerceArray(ids);
	        /** @type {?} */
	        var predicate = (/**
	         * @param {?} isUpdate
	         * @return {?}
	         */
	        function (isUpdate) { return (/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return hasEntity(_this.entities, id) === isUpdate; }); });
	        /** @type {?} */
	        var isClassBased = isFunction$1(options.baseClass);
	        /** @type {?} */
	        var updateIds = toArray.filter(predicate(true));
	        /** @type {?} */
	        var newEntities = toArray.filter(predicate(false)).map((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) {
	            var _a;
	            /** @type {?} */
	            var entity = isFunction$1(newState) ? newState((/** @type {?} */ ({}))) : newState;
	            /** @type {?} */
	            var withId = __assign({}, ((/** @type {?} */ (entity))), (_a = {}, _a[_this.idKey] = id, _a));
	            if (isClassBased) {
	                return new options.baseClass(withId);
	            }
	            return withId;
	        }));
	        // it can be any of the three types
	        this.update((/** @type {?} */ (updateIds)), (/** @type {?} */ (newState)));
	        this.add(newEntities);
	        isDev() && logAction('Upsert Entity');
	    };
	    /**
	     *
	     * Upsert entity collection (idKey must be present)
	     *
	     * @example
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }]);
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
	     *
	     */
	    /**
	     *
	     * Upsert entity collection (idKey must be present)
	     *
	     * \@example
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }]);
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
	     *
	     * @param {?} entities
	     * @param {?=} options
	     * @return {?}
	     */
	    EntityStore.prototype.upsertMany = /**
	     *
	     * Upsert entity collection (idKey must be present)
	     *
	     * \@example
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }]);
	     *
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { loading: true  });
	     * store.upsertMany([ { id: 1 }, { id: 2 }], { baseClass: Todo  });
	     *
	     * @param {?} entities
	     * @param {?=} options
	     * @return {?}
	     */
	    function (entities, options) {
	        if (options === void 0) { options = {}; }
	        var e_1, _a;
	        /** @type {?} */
	        var addedIds = [];
	        /** @type {?} */
	        var updatedIds = [];
	        /** @type {?} */
	        var updatedEntities = {};
	        try {
	            // Update the state directly to optimize performance
	            for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
	                var entity = entities_1_1.value;
	                /** @type {?} */
	                var id = entity[this.idKey];
	                if (hasEntity(this.entities, id)) {
	                    updatedEntities[id] = __assign({}, this._value().entities[id], entity);
	                    updatedIds.push(id);
	                }
	                else {
	                    /** @type {?} */
	                    var newEntity = options.baseClass ? new options.baseClass(entity) : entity;
	                    addedIds.push(id);
	                    updatedEntities[id] = newEntity;
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        isDev() && logAction('Upsert Many');
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return (__assign({}, state, { ids: addedIds.length ? __spread(state.ids, addedIds) : state.ids, entities: __assign({}, state.entities, updatedEntities), loading: !!options.loading })); }));
	        updatedIds.length && this.updatedEntityIds.next(updatedIds);
	        updatedIds.length && this.entityActions.next({ type: EntityActions.Update, ids: updatedIds });
	        addedIds.length && this.entityActions.next({ type: EntityActions.Add, ids: addedIds });
	    };
	    /**
	     * @param {?=} idsOrFn
	     * @return {?}
	     */
	    EntityStore.prototype.remove = /**
	     * @param {?=} idsOrFn
	     * @return {?}
	     */
	    function (idsOrFn) {
	        var _this = this;
	        if (isEmpty(this.ids))
	            return;
	        /** @type {?} */
	        var idPassed = isDefined(idsOrFn);
	        // null means remove all
	        /** @type {?} */
	        var ids = [];
	        if (isFunction$1(idsOrFn)) {
	            ids = this.ids.filter((/**
	             * @param {?} entityId
	             * @return {?}
	             */
	            function (entityId) { return idsOrFn(_this.entities[entityId]); }));
	        }
	        else {
	            ids = idPassed ? coerceArray(idsOrFn) : null;
	        }
	        if (isEmpty(ids))
	            return;
	        isDev() && setAction('Remove Entity', ids);
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return removeEntities({ state: state, ids: ids }); }));
	        if (ids === null) {
	            this.setHasCache(false);
	        }
	        this.handleUIRemove(ids);
	        this.entityActions.next({ type: EntityActions.Remove, ids: ids });
	    };
	    /**
	     *
	     * Update the active entity
	     *
	     * @example
	     *
	     * this.store.updateActive({ completed: true })
	     * this.store.updateActive(active => {
	     *   return {
	     *     config: {
	     *      ..active.config,
	     *      date
	     *     }
	     *   }
	     * })
	     */
	    /**
	     *
	     * Update the active entity
	     *
	     * \@example
	     *
	     * this.store.updateActive({ completed: true })
	     * this.store.updateActive(active => {
	     *   return {
	     *     config: {
	     *      ..active.config,
	     *      date
	     *     }
	     *   }
	     * })
	     * @param {?} newStateOrCallback
	     * @return {?}
	     */
	    EntityStore.prototype.updateActive = /**
	     *
	     * Update the active entity
	     *
	     * \@example
	     *
	     * this.store.updateActive({ completed: true })
	     * this.store.updateActive(active => {
	     *   return {
	     *     config: {
	     *      ..active.config,
	     *      date
	     *     }
	     *   }
	     * })
	     * @param {?} newStateOrCallback
	     * @return {?}
	     */
	    function (newStateOrCallback) {
	        /** @type {?} */
	        var ids = coerceArray(this.active);
	        isDev() && setAction('Update Active', ids);
	        this.update(ids, (/** @type {?} */ (newStateOrCallback)));
	    };
	    /**
	     * @param {?} idOrOptions
	     * @return {?}
	     */
	    EntityStore.prototype.setActive = /**
	     * @param {?} idOrOptions
	     * @return {?}
	     */
	    function (idOrOptions) {
	        /** @type {?} */
	        var active = getActiveEntities(idOrOptions, this.ids, this.active);
	        if (active === undefined) {
	            return;
	        }
	        isDev() && setAction('Set Active', active);
	        this._setActive(active);
	    };
	    /**
	     * Add active entities
	     *
	     * @example
	     *
	     * store.addActive(2);
	     * store.addActive([3, 4, 5]);
	     */
	    /**
	     * Add active entities
	     *
	     * \@example
	     *
	     * store.addActive(2);
	     * store.addActive([3, 4, 5]);
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    EntityStore.prototype.addActive = /**
	     * Add active entities
	     *
	     * \@example
	     *
	     * store.addActive(2);
	     * store.addActive([3, 4, 5]);
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    function (ids) {
	        var _this = this;
	        /** @type {?} */
	        var toArray = coerceArray(ids);
	        if (isEmpty(toArray))
	            return;
	        /** @type {?} */
	        var everyExist = toArray.every((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return _this.active.indexOf(id) > -1; }));
	        if (everyExist)
	            return;
	        isDev() && setAction('Add Active', ids);
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            /**
	             * Protect against case that one of the items in the array exist
	             * @type {?}
	             */
	            var uniques = Array.from(new Set(__spread(((/** @type {?} */ (state.active))), toArray)));
	            return __assign({}, state, { active: uniques });
	        }));
	    };
	    /**
	     * Remove active entities
	     *
	     * @example
	     *
	     * store.removeActive(2)
	     * store.removeActive([3, 4, 5])
	     */
	    /**
	     * Remove active entities
	     *
	     * \@example
	     *
	     * store.removeActive(2)
	     * store.removeActive([3, 4, 5])
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    EntityStore.prototype.removeActive = /**
	     * Remove active entities
	     *
	     * \@example
	     *
	     * store.removeActive(2)
	     * store.removeActive([3, 4, 5])
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    function (ids) {
	        var _this = this;
	        /** @type {?} */
	        var toArray = coerceArray(ids);
	        if (isEmpty(toArray))
	            return;
	        /** @type {?} */
	        var someExist = toArray.some((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return _this.active.indexOf(id) > -1; }));
	        if (!someExist)
	            return;
	        isDev() && setAction('Remove Active', ids);
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            return __assign({}, state, { active: state.active.filter((/**
	                 * @param {?} currentId
	                 * @return {?}
	                 */
	                function (currentId) { return toArray.indexOf(currentId) === -1; })) });
	        }));
	    };
	    /**
	     * Toggle active entities
	     *
	     * @example
	     *
	     * store.toggle(2)
	     * store.toggle([3, 4, 5])
	     */
	    /**
	     * Toggle active entities
	     *
	     * \@example
	     *
	     * store.toggle(2)
	     * store.toggle([3, 4, 5])
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    EntityStore.prototype.toggleActive = /**
	     * Toggle active entities
	     *
	     * \@example
	     *
	     * store.toggle(2)
	     * store.toggle([3, 4, 5])
	     * @template T
	     * @param {?} ids
	     * @return {?}
	     */
	    function (ids) {
	        var _this = this;
	        /** @type {?} */
	        var toArray = coerceArray(ids);
	        /** @type {?} */
	        var filterExists = (/**
	         * @param {?} remove
	         * @return {?}
	         */
	        function (remove) { return (/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return _this.active.includes(id) === remove; }); });
	        /** @type {?} */
	        var remove = toArray.filter(filterExists(true));
	        /** @type {?} */
	        var add = toArray.filter(filterExists(false));
	        this.removeActive(remove);
	        this.addActive(add);
	        isDev() && logAction('Toggle Active');
	    };
	    /**
	     *
	     * Create sub UI store for managing Entity's UI state
	     *
	     * @example
	     *
	     * export type ProductUI = {
	     *   isLoading: boolean;
	     *   isOpen: boolean
	     * }
	     *
	     * interface ProductsUIState extends EntityState<ProductUI> {}
	     *
	     * export class ProductsStore EntityStore<ProductsState, Product> {
	     *   ui: EntityUIStore<ProductsUIState, ProductUI>;
	     *
	     *   constructor() {
	     *     super();
	     *     this.createUIStore();
	     *   }
	     *
	     * }
	     */
	    /**
	     *
	     * Create sub UI store for managing Entity's UI state
	     *
	     * \@example
	     *
	     * export type ProductUI = {
	     *   isLoading: boolean;
	     *   isOpen: boolean
	     * }
	     *
	     * interface ProductsUIState extends EntityState<ProductUI> {}
	     *
	     * export class ProductsStore EntityStore<ProductsState, Product> {
	     *   ui: EntityUIStore<ProductsUIState, ProductUI>;
	     *
	     *   constructor() {
	     *     super();
	     *     this.createUIStore();
	     *   }
	     *
	     * }
	     * @param {?=} initialState
	     * @param {?=} storeConfig
	     * @return {?}
	     */
	    EntityStore.prototype.createUIStore = /**
	     *
	     * Create sub UI store for managing Entity's UI state
	     *
	     * \@example
	     *
	     * export type ProductUI = {
	     *   isLoading: boolean;
	     *   isOpen: boolean
	     * }
	     *
	     * interface ProductsUIState extends EntityState<ProductUI> {}
	     *
	     * export class ProductsStore EntityStore<ProductsState, Product> {
	     *   ui: EntityUIStore<ProductsUIState, ProductUI>;
	     *
	     *   constructor() {
	     *     super();
	     *     this.createUIStore();
	     *   }
	     *
	     * }
	     * @param {?=} initialState
	     * @param {?=} storeConfig
	     * @return {?}
	     */
	    function (initialState, storeConfig) {
	        if (initialState === void 0) { initialState = {}; }
	        if (storeConfig === void 0) { storeConfig = {}; }
	        /** @type {?} */
	        var defaults = { name: "UI/" + this.storeName, idKey: this.idKey };
	        this.ui = new EntityUIStore(initialState, __assign({}, defaults, storeConfig));
	        return this.ui;
	    };
	    // @internal
	    // @internal
	    /**
	     * @return {?}
	     */
	    EntityStore.prototype.destroy = 
	    // @internal
	    /**
	     * @return {?}
	     */
	    function () {
	        _super.prototype.destroy.call(this);
	        if (this.ui instanceof EntityStore) {
	            this.ui.destroy();
	        }
	        this.updatedEntityIds.complete();
	        this.entityActions.complete();
	    };
	    // @internal
	    // @internal
	    /**
	     * @param {?} _
	     * @param {?} nextEntity
	     * @return {?}
	     */
	    EntityStore.prototype.akitaPreUpdateEntity = 
	    // @internal
	    /**
	     * @param {?} _
	     * @param {?} nextEntity
	     * @return {?}
	     */
	    function (_, nextEntity) {
	        return nextEntity;
	    };
	    // @internal
	    // @internal
	    /**
	     * @param {?} newEntity
	     * @return {?}
	     */
	    EntityStore.prototype.akitaPreAddEntity = 
	    // @internal
	    /**
	     * @param {?} newEntity
	     * @return {?}
	     */
	    function (newEntity) {
	        return newEntity;
	    };
	    Object.defineProperty(EntityStore.prototype, "ids", {
	        get: /**
	         * @private
	         * @return {?}
	         */
	        function () {
	            return this._value().ids;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(EntityStore.prototype, "entities", {
	        get: /**
	         * @private
	         * @return {?}
	         */
	        function () {
	            return this._value().entities;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(EntityStore.prototype, "active", {
	        get: /**
	         * @private
	         * @return {?}
	         */
	        function () {
	            return this._value().active;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * @private
	     * @param {?} ids
	     * @return {?}
	     */
	    EntityStore.prototype._setActive = /**
	     * @private
	     * @param {?} ids
	     * @return {?}
	     */
	    function (ids) {
	        this._setState((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) {
	            return __assign({}, state, { active: ids });
	        }));
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    EntityStore.prototype.updateCache = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        this.setHasCache(true);
	        /** @type {?} */
	        var ttlConfig = this.cacheConfig && this.cacheConfig.ttl;
	        if (ttlConfig) {
	            if (this.cache.ttl !== null) {
	                clearTimeout(this.cache.ttl);
	            }
	            this.cache.ttl = (/** @type {?} */ (setTimeout((/**
	             * @return {?}
	             */
	            function () { return _this.setHasCache(false); }), ttlConfig)));
	        }
	    };
	    /**
	     * @private
	     * @param {?=} add
	     * @return {?}
	     */
	    EntityStore.prototype.handleUICreation = /**
	     * @private
	     * @param {?=} add
	     * @return {?}
	     */
	    function (add) {
	        var _this = this;
	        if (add === void 0) { add = false; }
	        /** @type {?} */
	        var ids = this.ids;
	        /** @type {?} */
	        var isFunc = isFunction$1(this.ui._akitaCreateEntityFn);
	        /** @type {?} */
	        var uiEntities;
	        /** @type {?} */
	        var createFn = (/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) {
	            var _a;
	            /** @type {?} */
	            var current = _this.entities[id];
	            /** @type {?} */
	            var ui = isFunc ? _this.ui._akitaCreateEntityFn(current) : _this.ui._akitaCreateEntityFn;
	            return __assign((_a = {}, _a[_this.idKey] = current[_this.idKey], _a), ui);
	        });
	        if (add) {
	            uiEntities = this.ids.filter((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) { return isUndefined(_this.ui.entities[id]); })).map(createFn);
	        }
	        else {
	            uiEntities = ids.map(createFn);
	        }
	        add ? this.ui.add(uiEntities) : this.ui.set(uiEntities);
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    EntityStore.prototype.hasInitialUIState = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        return this.hasUIStore() && isUndefined(this.ui._akitaCreateEntityFn) === false;
	    };
	    /**
	     * @private
	     * @param {?} ids
	     * @return {?}
	     */
	    EntityStore.prototype.handleUIRemove = /**
	     * @private
	     * @param {?} ids
	     * @return {?}
	     */
	    function (ids) {
	        if (this.hasUIStore()) {
	            this.ui.remove(ids);
	        }
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    EntityStore.prototype.hasUIStore = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        return this.ui instanceof EntityUIStore;
	    };
	    var _a;
	    __decorate([
	        transaction(),
	        __metadata("design:type", Function),
	        __metadata("design:paramtypes", [Object, Object, Object]),
	        __metadata("design:returntype", void 0)
	    ], EntityStore.prototype, "upsert", null);
	    __decorate([
	        transaction(),
	        __metadata("design:type", Function),
	        __metadata("design:paramtypes", [typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object]),
	        __metadata("design:returntype", void 0)
	    ], EntityStore.prototype, "toggleActive", null);
	    return EntityStore;
	}(Store));
	// @internal
	/**
	 * @template UIState, EntityUI
	 */
	var  
	// @internal
	/**
	 * @template UIState, EntityUI
	 */
	EntityUIStore = /** @class */ (function (_super) {
	    __extends(EntityUIStore, _super);
	    function EntityUIStore(initialState, storeConfig) {
	        if (initialState === void 0) { initialState = {}; }
	        if (storeConfig === void 0) { storeConfig = {}; }
	        return _super.call(this, initialState, storeConfig) || this;
	    }
	    /**
	     *
	     * Set the initial UI entity state. This function will determine the entity's
	     * initial state when we call `set()` or `add()`.
	     *
	     * @example
	     *
	     * constructor() {
	     *   super();
	     *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
	     *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
	     * }
	     *
	     */
	    /**
	     *
	     * Set the initial UI entity state. This function will determine the entity's
	     * initial state when we call `set()` or `add()`.
	     *
	     * \@example
	     *
	     * constructor() {
	     *   super();
	     *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
	     *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
	     * }
	     *
	     * @template EntityUI, Entity
	     * @param {?} createFn
	     * @return {?}
	     */
	    EntityUIStore.prototype.setInitialEntityState = /**
	     *
	     * Set the initial UI entity state. This function will determine the entity's
	     * initial state when we call `set()` or `add()`.
	     *
	     * \@example
	     *
	     * constructor() {
	     *   super();
	     *   this.createUIStore().setInitialEntityState(entity => ({ isLoading: false, isOpen: true }));
	     *   this.createUIStore().setInitialEntityState({ isLoading: false, isOpen: true });
	     * }
	     *
	     * @template EntityUI, Entity
	     * @param {?} createFn
	     * @return {?}
	     */
	    function (createFn) {
	        this._akitaCreateEntityFn = createFn;
	    };
	    return EntityUIStore;
	}(EntityStore));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var queryConfigKey = 'akitaQueryConfig';

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function isString(value) {
	    return typeof value === 'string';
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @template S
	 */
	var  /**
	 * @template S
	 */
	Query = /** @class */ (function () {
	    function Query(store) {
	        this.store = store;
	        this.__store__ = store;
	    }
	    /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    Query.prototype.select = /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    function (project) {
	        /** @type {?} */
	        var mapFn;
	        if (isFunction$1(project)) {
	            mapFn = project;
	        }
	        else if (isString(project)) {
	            mapFn = (/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) { return state[project]; });
	        }
	        else {
	            mapFn = (/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) { return state; });
	        }
	        return this.store._select(mapFn);
	    };
	    /**
	     * Select the loading state
	     *
	     * @example
	     *
	     * this.query.selectLoading().subscribe(isLoading => {})
	     */
	    /**
	     * Select the loading state
	     *
	     * \@example
	     *
	     * this.query.selectLoading().subscribe(isLoading => {})
	     * @return {?}
	     */
	    Query.prototype.selectLoading = /**
	     * Select the loading state
	     *
	     * \@example
	     *
	     * this.query.selectLoading().subscribe(isLoading => {})
	     * @return {?}
	     */
	    function () {
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return ((/** @type {?} */ (state))).loading; }));
	    };
	    /**
	     * Select the error state
	     *
	     * @example
	     *
	     * this.query.selectError().subscribe(error => {})
	     */
	    /**
	     * Select the error state
	     *
	     * \@example
	     *
	     * this.query.selectError().subscribe(error => {})
	     * @template E
	     * @return {?}
	     */
	    Query.prototype.selectError = /**
	     * Select the error state
	     *
	     * \@example
	     *
	     * this.query.selectError().subscribe(error => {})
	     * @template E
	     * @return {?}
	     */
	    function () {
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return ((/** @type {?} */ (state))).error; }));
	    };
	    /**
	     * Get the store's value
	     *
	     * @example
	     *
	     * this.query.getValue()
	     *
	     */
	    /**
	     * Get the store's value
	     *
	     * \@example
	     *
	     * this.query.getValue()
	     *
	     * @return {?}
	     */
	    Query.prototype.getValue = /**
	     * Get the store's value
	     *
	     * \@example
	     *
	     * this.query.getValue()
	     *
	     * @return {?}
	     */
	    function () {
	        return this.store._value();
	    };
	    /**
	     * Select the cache state
	     *
	     * @example
	     *
	     * this.query.selectHasCache().pipe(
	     *   switchMap(hasCache => {
	     *     return hasCache ? of() : http().pipe(res => store.set(res))
	     *   })
	     * )
	     */
	    /**
	     * Select the cache state
	     *
	     * \@example
	     *
	     * this.query.selectHasCache().pipe(
	     *   switchMap(hasCache => {
	     *     return hasCache ? of() : http().pipe(res => store.set(res))
	     *   })
	     * )
	     * @return {?}
	     */
	    Query.prototype.selectHasCache = /**
	     * Select the cache state
	     *
	     * \@example
	     *
	     * this.query.selectHasCache().pipe(
	     *   switchMap(hasCache => {
	     *     return hasCache ? of() : http().pipe(res => store.set(res))
	     *   })
	     * )
	     * @return {?}
	     */
	    function () {
	        return this.store._cache().asObservable();
	    };
	    /**
	     * Whether we've cached data
	     *
	     * @example
	     *
	     * this.query.getHasCache()
	     *
	     */
	    /**
	     * Whether we've cached data
	     *
	     * \@example
	     *
	     * this.query.getHasCache()
	     *
	     * @return {?}
	     */
	    Query.prototype.getHasCache = /**
	     * Whether we've cached data
	     *
	     * \@example
	     *
	     * this.query.getHasCache()
	     *
	     * @return {?}
	     */
	    function () {
	        return this.store._cache().value;
	    };
	    Object.defineProperty(Query.prototype, "config", {
	        // @internal
	        get: 
	        // @internal
	        /**
	         * @return {?}
	         */
	        function () {
	            return this.constructor[queryConfigKey];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Query;
	}());

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} options
	 * @param {?} config
	 * @return {?}
	 */
	function sortByOptions(options, config) {
	    options.sortBy = options.sortBy || (config && config.sortBy);
	    options.sortByOrder = options.sortByOrder || (config && config.sortByOrder);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @enum {string} */
	var Order = {
	    ASC: 'asc',
	    DESC: 'desc',
	};
	// @internal
	/**
	 * @param {?} key
	 * @param {?=} order
	 * @return {?}
	 */
	function compareValues(key, order) {
	    if (order === void 0) { order = Order.ASC; }
	    return (/**
	     * @param {?} a
	     * @param {?} b
	     * @return {?}
	     */
	    function (a, b) {
	        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
	            return 0;
	        }
	        /** @type {?} */
	        var varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
	        /** @type {?} */
	        var varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
	        /** @type {?} */
	        var comparison = 0;
	        if (varA > varB) {
	            comparison = 1;
	        }
	        else if (varA < varB) {
	            comparison = -1;
	        }
	        return order == Order.DESC ? comparison * -1 : comparison;
	    });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template E, S
	 * @param {?} state
	 * @param {?} options
	 * @return {?}
	 */
	function entitiesToArray(state, options) {
	    /** @type {?} */
	    var arr = [];
	    var ids = state.ids, entities = state.entities;
	    var filterBy = options.filterBy, limitTo = options.limitTo, sortBy = options.sortBy, sortByOrder = options.sortByOrder;
	    var _loop_1 = function (i) {
	        /** @type {?} */
	        var entity = entities[ids[i]];
	        if (!filterBy) {
	            arr.push(entity);
	            return "continue";
	        }
	        /** @type {?} */
	        var toArray = coerceArray(filterBy);
	        /** @type {?} */
	        var allPass = toArray.every((/**
	         * @param {?} fn
	         * @return {?}
	         */
	        function (fn) { return fn(entity, i); }));
	        if (allPass) {
	            arr.push(entity);
	        }
	    };
	    for (var i = 0; i < ids.length; i++) {
	        _loop_1(i);
	    }
	    if (sortBy) {
	        /** @type {?} */
	        var _sortBy_1 = isFunction$1(sortBy) ? sortBy : compareValues(sortBy, sortByOrder);
	        arr = arr.sort((/**
	         * @param {?} a
	         * @param {?} b
	         * @return {?}
	         */
	        function (a, b) { return _sortBy_1(a, b, state); }));
	    }
	    /** @type {?} */
	    var length = Math.min(limitTo || arr.length, arr.length);
	    return length === arr.length ? arr : arr.slice(0, length);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @template S, E
	 * @param {?} state
	 * @param {?} options
	 * @return {?}
	 */
	function entitiesToMap(state, options) {
	    /** @type {?} */
	    var map$$1 = {};
	    var filterBy = options.filterBy, limitTo = options.limitTo;
	    var ids = state.ids, entities = state.entities;
	    if (!filterBy && !limitTo) {
	        return entities;
	    }
	    /** @type {?} */
	    var hasLimit = isNil(limitTo) === false;
	    if (filterBy && hasLimit) {
	        /** @type {?} */
	        var count = 0;
	        var _loop_1 = function (i, length_1) {
	            if (count === limitTo)
	                return "break";
	            /** @type {?} */
	            var id = ids[i];
	            /** @type {?} */
	            var entity = entities[id];
	            /** @type {?} */
	            var allPass = coerceArray(filterBy).every((/**
	             * @param {?} fn
	             * @return {?}
	             */
	            function (fn) { return fn(entity, i); }));
	            if (allPass) {
	                map$$1[id] = entity;
	                count++;
	            }
	        };
	        for (var i = 0, length_1 = ids.length; i < length_1; i++) {
	            var state_1 = _loop_1(i, length_1);
	            if (state_1 === "break")
	                break;
	        }
	    }
	    else {
	        /** @type {?} */
	        var finalLength = Math.min(limitTo || ids.length, ids.length);
	        var _loop_2 = function (i) {
	            /** @type {?} */
	            var id = ids[i];
	            /** @type {?} */
	            var entity = entities[id];
	            if (!filterBy) {
	                map$$1[id] = entity;
	                return "continue";
	            }
	            /** @type {?} */
	            var allPass = coerceArray(filterBy).every((/**
	             * @param {?} fn
	             * @return {?}
	             */
	            function (fn) { return fn(entity, i); }));
	            if (allPass) {
	                map$$1[id] = entity;
	            }
	        };
	        for (var i = 0; i < finalLength; i++) {
	            _loop_2(i);
	        }
	    }
	    return map$$1;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} id
	 * @param {?} project
	 * @return {?}
	 */
	function getEntity(id, project) {
	    return (/**
	     * @param {?} entities
	     * @return {?}
	     */
	    function (entities) {
	        /** @type {?} */
	        var entity = entities[id];
	        if (isUndefined(entity)) {
	            return undefined;
	        }
	        if (!project) {
	            return entity;
	        }
	        if (isString(project)) {
	            return entity[project];
	        }
	        return ((/** @type {?} */ (project)))(entity);
	    });
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 *
	 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
	 *
	 *  class WidgetsQuery extends QueryEntity<WidgetsState, Widget> {
	 *     constructor(protected store: WidgetsStore) {
	 *       super(store);
	 *     }
	 *  }
	 *
	 *
	 *
	 * @template S, E, EntityID
	 */
	var  /**
	 *
	 *  The Entity Query is similar to the general Query, with additional functionality tailored for EntityStores.
	 *
	 *  class WidgetsQuery extends QueryEntity<WidgetsState, Widget> {
	 *     constructor(protected store: WidgetsStore) {
	 *       super(store);
	 *     }
	 *  }
	 *
	 *
	 *
	 * @template S, E, EntityID
	 */
	QueryEntity = /** @class */ (function (_super) {
	    __extends(QueryEntity, _super);
	    function QueryEntity(store) {
	        var _this = _super.call(this, store) || this;
	        _this.__store__ = store;
	        return _this;
	    }
	    /**
	     * @param {?=} options
	     * @return {?}
	     */
	    QueryEntity.prototype.selectAll = /**
	     * @param {?=} options
	     * @return {?}
	     */
	    function (options) {
	        var _this = this;
	        if (options === void 0) { options = {
	            asObject: false
	        }; }
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state.entities; })).pipe(map((/**
	         * @return {?}
	         */
	        function () { return _this.getAll(options); })));
	    };
	    /**
	     * @param {?=} options
	     * @return {?}
	     */
	    QueryEntity.prototype.getAll = /**
	     * @param {?=} options
	     * @return {?}
	     */
	    function (options) {
	        if (options === void 0) { options = { asObject: false, filterBy: undefined, limitTo: undefined }; }
	        if (options.asObject) {
	            return entitiesToMap(this.getValue(), options);
	        }
	        sortByOptions(options, this.config);
	        return entitiesToArray(this.getValue(), options);
	    };
	    /**
	     * @template R
	     * @param {?} ids
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectMany = /**
	     * @template R
	     * @param {?} ids
	     * @param {?=} project
	     * @return {?}
	     */
	    function (ids, project) {
	        var _this = this;
	        if (!ids || !ids.length)
	            return of([]);
	        /** @type {?} */
	        var entities = ids.map((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return _this.selectEntity(id, project); }));
	        return combineLatest(entities).pipe(map((/**
	         * @param {?} v
	         * @return {?}
	         */
	        function (v) { return v.filter(Boolean); })), auditTime(0));
	    };
	    /**
	     * @template R
	     * @param {?} id
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectEntity = /**
	     * @template R
	     * @param {?} id
	     * @param {?=} project
	     * @return {?}
	     */
	    function (id, project) {
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state.entities; })).pipe(map(getEntity(id, project)), distinctUntilChanged());
	    };
	    /**
	     * Get an entity by id
	     *
	     * @example
	     *
	     * this.query.getEntity(1);
	     */
	    /**
	     * Get an entity by id
	     *
	     * \@example
	     *
	     * this.query.getEntity(1);
	     * @param {?} id
	     * @return {?}
	     */
	    QueryEntity.prototype.getEntity = /**
	     * Get an entity by id
	     *
	     * \@example
	     *
	     * this.query.getEntity(1);
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        return this.getValue().entities[(/** @type {?} */ (id))];
	    };
	    /**
	     * Select the active entity's id
	     *
	     * @example
	     *
	     * this.query.selectActiveId()
	     */
	    /**
	     * Select the active entity's id
	     *
	     * \@example
	     *
	     * this.query.selectActiveId()
	     * @return {?}
	     */
	    QueryEntity.prototype.selectActiveId = /**
	     * Select the active entity's id
	     *
	     * \@example
	     *
	     * this.query.selectActiveId()
	     * @return {?}
	     */
	    function () {
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return ((/** @type {?} */ (state))).active; }));
	    };
	    /**
	     * Get the active id
	     *
	     * @example
	     *
	     * this.query.getActiveId()
	     */
	    /**
	     * Get the active id
	     *
	     * \@example
	     *
	     * this.query.getActiveId()
	     * @return {?}
	     */
	    QueryEntity.prototype.getActiveId = /**
	     * Get the active id
	     *
	     * \@example
	     *
	     * this.query.getActiveId()
	     * @return {?}
	     */
	    function () {
	        return this.getValue().active;
	    };
	    /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectActive = /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    function (project) {
	        var _this = this;
	        if (isArray$1(this.getActive())) {
	            return this.selectActiveId().pipe(switchMap((/**
	             * @param {?} ids
	             * @return {?}
	             */
	            function (ids) { return _this.selectMany(ids, project); })));
	        }
	        return this.selectActiveId().pipe(switchMap((/**
	         * @param {?} ids
	         * @return {?}
	         */
	        function (ids) { return _this.selectEntity(ids, project); })));
	    };
	    /**
	     * @return {?}
	     */
	    QueryEntity.prototype.getActive = /**
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        /** @type {?} */
	        var activeId = this.getActiveId();
	        if (isArray$1(activeId)) {
	            return activeId.map((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) { return _this.getValue().entities[(/** @type {?} */ (id))]; }));
	        }
	        return toBoolean(activeId) ? this.getEntity(activeId) : undefined;
	    };
	    /**
	     * Select the store's entity collection length
	     *
	     * @example
	     *
	     * this.query.selectCount()
	     * this.query.selectCount(entity => entity.completed)
	     */
	    /**
	     * Select the store's entity collection length
	     *
	     * \@example
	     *
	     * this.query.selectCount()
	     * this.query.selectCount(entity => entity.completed)
	     * @param {?=} predicate
	     * @return {?}
	     */
	    QueryEntity.prototype.selectCount = /**
	     * Select the store's entity collection length
	     *
	     * \@example
	     *
	     * this.query.selectCount()
	     * this.query.selectCount(entity => entity.completed)
	     * @param {?=} predicate
	     * @return {?}
	     */
	    function (predicate) {
	        var _this = this;
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state.entities; })).pipe(map((/**
	         * @return {?}
	         */
	        function () { return _this.getCount(predicate); })));
	    };
	    /**
	     * Get the store's entity collection length
	     *
	     * @example
	     *
	     * this.query.getCount()
	     * this.query.getCount(entity => entity.completed)
	     */
	    /**
	     * Get the store's entity collection length
	     *
	     * \@example
	     *
	     * this.query.getCount()
	     * this.query.getCount(entity => entity.completed)
	     * @param {?=} predicate
	     * @return {?}
	     */
	    QueryEntity.prototype.getCount = /**
	     * Get the store's entity collection length
	     *
	     * \@example
	     *
	     * this.query.getCount()
	     * this.query.getCount(entity => entity.completed)
	     * @param {?=} predicate
	     * @return {?}
	     */
	    function (predicate) {
	        if (isFunction$1(predicate)) {
	            return this.getAll().filter(predicate).length;
	        }
	        return this.getValue().ids.length;
	    };
	    /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectLast = /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    function (project) {
	        return this.selectAt((/**
	         * @param {?} ids
	         * @return {?}
	         */
	        function (ids) { return ids[ids.length - 1]; }), project);
	    };
	    /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectFirst = /**
	     * @template R
	     * @param {?=} project
	     * @return {?}
	     */
	    function (project) {
	        return this.selectAt((/**
	         * @param {?} ids
	         * @return {?}
	         */
	        function (ids) { return ids[0]; }), project);
	    };
	    /**
	     * @deprecated use selectEntityAction
	     *
	     * Select the updated entities ids
	     *
	     *  @example
	     *
	     *  this.query.selectUpdatedEntityIds()
	     *
	     */
	    /**
	     * @deprecated use selectEntityAction
	     *
	     * Select the updated entities ids
	     *
	     * \@example
	     *
	     *  this.query.selectUpdatedEntityIds()
	     *
	     * @return {?}
	     */
	    QueryEntity.prototype.selectUpdatedEntityIds = /**
	     * @deprecated use selectEntityAction
	     *
	     * Select the updated entities ids
	     *
	     * \@example
	     *
	     *  this.query.selectUpdatedEntityIds()
	     *
	     * @return {?}
	     */
	    function () {
	        return this.store.updatedEntityIds$;
	    };
	    /**
	     * @param {?=} action
	     * @return {?}
	     */
	    QueryEntity.prototype.selectEntityAction = /**
	     * @param {?=} action
	     * @return {?}
	     */
	    function (action) {
	        if (isUndefined(action)) {
	            return this.store.selectEntityAction$;
	        }
	        return this.store.selectEntityAction$.pipe(filter((/**
	         * @param {?} ac
	         * @return {?}
	         */
	        function (ac) { return ac.type === action; })), map((/**
	         * @param {?} action
	         * @return {?}
	         */
	        function (action) { return action.ids; })));
	    };
	    /**
	     * @param {?=} projectOrIds
	     * @return {?}
	     */
	    QueryEntity.prototype.hasEntity = /**
	     * @param {?=} projectOrIds
	     * @return {?}
	     */
	    function (projectOrIds) {
	        var _this = this;
	        if (isNil(projectOrIds)) {
	            return this.getValue().ids.length > 0;
	        }
	        if (isFunction$1(projectOrIds)) {
	            return this.getAll().some(projectOrIds);
	        }
	        if (isArray$1(projectOrIds)) {
	            return projectOrIds.every((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) { return ((/** @type {?} */ (id))) in _this.getValue().entities; }));
	        }
	        return ((/** @type {?} */ (projectOrIds))) in this.getValue().entities;
	    };
	    /**
	     * Returns whether entity store has an active entity
	     *
	     * @example
	     *
	     * this.query.hasActive()
	     * this.query.hasActive(3)
	     *
	     */
	    /**
	     * Returns whether entity store has an active entity
	     *
	     * \@example
	     *
	     * this.query.hasActive()
	     * this.query.hasActive(3)
	     *
	     * @param {?=} id
	     * @return {?}
	     */
	    QueryEntity.prototype.hasActive = /**
	     * Returns whether entity store has an active entity
	     *
	     * \@example
	     *
	     * this.query.hasActive()
	     * this.query.hasActive(3)
	     *
	     * @param {?=} id
	     * @return {?}
	     */
	    function (id) {
	        /** @type {?} */
	        var active = this.getValue().active;
	        if (Array.isArray(active)) {
	            if (isDefined(id)) {
	                return active.includes(id);
	            }
	            return active.length > 0;
	        }
	        return isDefined(active);
	    };
	    /**
	     *
	     * Create sub UI query for querying Entity's UI state
	     *
	     * @example
	     *
	     *
	     * export class ProductsQuery extends QueryEntity<ProductsState, Product> {
	     *   ui: EntityUIQuery<ProductsUIState, ProductUI>;
	     *
	     *   constructor(protected store: ProductsStore) {
	     *     super(store);
	     *     this.createUIQuery();
	     *   }
	     *
	     * }
	     */
	    /**
	     *
	     * Create sub UI query for querying Entity's UI state
	     *
	     * \@example
	     *
	     *
	     * export class ProductsQuery extends QueryEntity<ProductsState, Product> {
	     *   ui: EntityUIQuery<ProductsUIState, ProductUI>;
	     *
	     *   constructor(protected store: ProductsStore) {
	     *     super(store);
	     *     this.createUIQuery();
	     *   }
	     *
	     * }
	     * @return {?}
	     */
	    QueryEntity.prototype.createUIQuery = /**
	     *
	     * Create sub UI query for querying Entity's UI state
	     *
	     * \@example
	     *
	     *
	     * export class ProductsQuery extends QueryEntity<ProductsState, Product> {
	     *   ui: EntityUIQuery<ProductsUIState, ProductUI>;
	     *
	     *   constructor(protected store: ProductsStore) {
	     *     super(store);
	     *     this.createUIQuery();
	     *   }
	     *
	     * }
	     * @return {?}
	     */
	    function () {
	        this.ui = new EntityUIQuery(this.__store__.ui);
	    };
	    /**
	     * @private
	     * @template R
	     * @param {?} mapFn
	     * @param {?=} project
	     * @return {?}
	     */
	    QueryEntity.prototype.selectAt = /**
	     * @private
	     * @template R
	     * @param {?} mapFn
	     * @param {?=} project
	     * @return {?}
	     */
	    function (mapFn, project) {
	        var _this = this;
	        return this.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return (/** @type {?} */ (state.ids)); })).pipe(map(mapFn), distinctUntilChanged(), switchMap((/**
	         * @param {?} id
	         * @return {?}
	         */
	        function (id) { return _this.selectEntity(id, project); })));
	    };
	    return QueryEntity;
	}(Query));
	// @internal
	/**
	 * @template UIState, EntityUI
	 */
	var  
	// @internal
	/**
	 * @template UIState, EntityUI
	 */
	EntityUIQuery = /** @class */ (function (_super) {
	    __extends(EntityUIQuery, _super);
	    function EntityUIQuery(store) {
	        return _super.call(this, store) || this;
	    }
	    return EntityUIQuery;
	}(QueryEntity));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * \@example
	 *
	 * query.selectEntity(2).pipe(filterNil)
	 * @type {?}
	 */
	var filterNil = (/**
	 * @template T
	 * @param {?} source
	 * @return {?}
	 */
	function (source) { return source.pipe(filter((/**
	 * @param {?} value
	 * @return {?}
	 */
	function (value) { return value !== null && typeof value !== 'undefined'; }))); });

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @abstract
	 * @template E, S
	 */
	var  /**
	 * @abstract
	 * @template E, S
	 */
	AkitaPlugin = /** @class */ (function () {
	    function AkitaPlugin(query, config) {
	        this.query = query;
	        if (config && config.resetFn) {
	            if (getAkitaConfig().resettable) {
	                this.onReset(config.resetFn);
	            }
	        }
	    }
	    /** This method is responsible for getting access to the query. */
	    /**
	     * This method is responsible for getting access to the query.
	     * @protected
	     * @return {?}
	     */
	    AkitaPlugin.prototype.getQuery = /**
	     * This method is responsible for getting access to the query.
	     * @protected
	     * @return {?}
	     */
	    function () {
	        return this.query;
	    };
	    /** This method is responsible for getting access to the store. */
	    /**
	     * This method is responsible for getting access to the store.
	     * @protected
	     * @return {?}
	     */
	    AkitaPlugin.prototype.getStore = /**
	     * This method is responsible for getting access to the store.
	     * @protected
	     * @return {?}
	     */
	    function () {
	        return this.getQuery().__store__;
	    };
	    /** This method is responsible tells whether the plugin is entityBased or not.  */
	    /**
	     * This method is responsible tells whether the plugin is entityBased or not.
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    AkitaPlugin.prototype.isEntityBased = /**
	     * This method is responsible tells whether the plugin is entityBased or not.
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    function (entityId) {
	        return toBoolean(entityId);
	    };
	    /** This method is responsible for selecting the source; it can be the whole store or one entity. */
	    /**
	     * This method is responsible for selecting the source; it can be the whole store or one entity.
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    AkitaPlugin.prototype.selectSource = /**
	     * This method is responsible for selecting the source; it can be the whole store or one entity.
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    function (entityId) {
	        if (this.isEntityBased(entityId)) {
	            return ((/** @type {?} */ (this.getQuery()))).selectEntity(entityId).pipe(filterNil);
	        }
	        return ((/** @type {?} */ (this.getQuery()))).select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state; }));
	    };
	    /**
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    AkitaPlugin.prototype.getSource = /**
	     * @protected
	     * @param {?} entityId
	     * @return {?}
	     */
	    function (entityId) {
	        if (this.isEntityBased(entityId)) {
	            return ((/** @type {?} */ (this.getQuery()))).getEntity(entityId);
	        }
	        return this.getQuery().getValue();
	    };
	    /** This method is responsible for updating the store or one entity; it can be the whole store or one entity. */
	    /**
	     * This method is responsible for updating the store or one entity; it can be the whole store or one entity.
	     * @protected
	     * @param {?} newState
	     * @param {?=} entityId
	     * @return {?}
	     */
	    AkitaPlugin.prototype.updateStore = /**
	     * This method is responsible for updating the store or one entity; it can be the whole store or one entity.
	     * @protected
	     * @param {?} newState
	     * @param {?=} entityId
	     * @return {?}
	     */
	    function (newState, entityId) {
	        if (this.isEntityBased(entityId)) {
	            this.getStore().update(entityId, newState);
	        }
	        else {
	            this.getStore()._setState((/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) { return (__assign({}, state, newState)); }));
	        }
	    };
	    /**
	     * Function to invoke upon reset
	     */
	    /**
	     * Function to invoke upon reset
	     * @private
	     * @param {?} fn
	     * @return {?}
	     */
	    AkitaPlugin.prototype.onReset = /**
	     * Function to invoke upon reset
	     * @private
	     * @param {?} fn
	     * @return {?}
	     */
	    function (fn) {
	        var _this = this;
	        /** @type {?} */
	        var original = this.getStore().reset;
	        this.getStore().reset = (/**
	         * @param {...?} params
	         * @return {?}
	         */
	        function () {
	            var params = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                params[_i] = arguments[_i];
	            }
	            /** It should run after the plugin destroy method */
	            setTimeout((/**
	             * @return {?}
	             */
	            function () {
	                original.apply(_this.getStore(), params);
	                fn();
	            }));
	        });
	    };
	    return AkitaPlugin;
	}());

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var paginatorDefaults = {
	    pagesControls: false,
	    range: false,
	    startWith: 1,
	    cacheTimeout: undefined,
	    clearStoreWithCache: true
	};
	/**
	 * @template E
	 */
	var PaginatorPlugin = /** @class */ (function (_super) {
	    __extends(PaginatorPlugin, _super);
	    function PaginatorPlugin(query, config) {
	        if (config === void 0) { config = {}; }
	        var _this = _super.call(this, query, {
	            resetFn: (/**
	             * @return {?}
	             */
	            function () {
	                _this.initial = false;
	                _this.destroy({ clearCache: true, currentPage: 1 });
	            })
	        }) || this;
	        _this.query = query;
	        _this.config = config;
	        /**
	         * Save current filters, sorting, etc. in cache
	         */
	        _this.metadata = new Map();
	        _this.pages = new Map();
	        _this.pagination = {
	            currentPage: 1,
	            perPage: 0,
	            total: 0,
	            lastPage: 0,
	            data: []
	        };
	        /**
	         * When the user navigates to a different page and return
	         * we don't want to call `clearCache` on first time.
	         */
	        _this.initial = true;
	        /**
	         * Proxy to the query loading
	         */
	        _this.isLoading$ = _this.query.selectLoading().pipe(delay(0));
	        _this.config = Object.assign(paginatorDefaults, config);
	        var _a = _this.config, startWith = _a.startWith, cacheTimeout = _a.cacheTimeout;
	        _this.page = new BehaviorSubject(startWith);
	        if (isObservable(cacheTimeout)) {
	            _this.clearCacheSubscription = cacheTimeout.subscribe((/**
	             * @param {?} _
	             * @return {?}
	             */
	            function (_) { return _this.clearCache(); }));
	        }
	        return _this;
	    }
	    Object.defineProperty(PaginatorPlugin.prototype, "pageChanges", {
	        /**
	         * Listen to page changes
	         */
	        get: /**
	         * Listen to page changes
	         * @return {?}
	         */
	        function () {
	            return this.page.asObservable();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PaginatorPlugin.prototype, "currentPage", {
	        /**
	         * Get the current page number
	         */
	        get: /**
	         * Get the current page number
	         * @return {?}
	         */
	        function () {
	            return this.pagination.currentPage;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PaginatorPlugin.prototype, "isFirst", {
	        /**
	         * Check if current page is the first one
	         */
	        get: /**
	         * Check if current page is the first one
	         * @return {?}
	         */
	        function () {
	            return this.currentPage === 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PaginatorPlugin.prototype, "isLast", {
	        /**
	         * Check if current page is the last one
	         */
	        get: /**
	         * Check if current page is the last one
	         * @return {?}
	         */
	        function () {
	            return this.currentPage === this.pagination.lastPage;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Whether to generate an array of pages for *ngFor
	     * [1, 2, 3, 4]
	     */
	    /**
	     * Whether to generate an array of pages for *ngFor
	     * [1, 2, 3, 4]
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    PaginatorPlugin.prototype.withControls = /**
	     * Whether to generate an array of pages for *ngFor
	     * [1, 2, 3, 4]
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    function () {
	        (/** @type {?} */ (this)).config.pagesControls = true;
	        return (/** @type {?} */ (this));
	    };
	    /**
	     * Whether to generate the `from` and `to` keys
	     * [1, 2, 3, 4]
	     */
	    /**
	     * Whether to generate the `from` and `to` keys
	     * [1, 2, 3, 4]
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    PaginatorPlugin.prototype.withRange = /**
	     * Whether to generate the `from` and `to` keys
	     * [1, 2, 3, 4]
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    function () {
	        (/** @type {?} */ (this)).config.range = true;
	        return (/** @type {?} */ (this));
	    };
	    /**
	     * Set the loading state
	     */
	    /**
	     * Set the loading state
	     * @param {?=} value
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.setLoading = /**
	     * Set the loading state
	     * @param {?=} value
	     * @return {?}
	     */
	    function (value) {
	        if (value === void 0) { value = true; }
	        this.getStore().setLoading(value);
	    };
	    /**
	     * Update the pagination object and add the page
	     */
	    /**
	     * Update the pagination object and add the page
	     * @param {?} response
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.update = /**
	     * Update the pagination object and add the page
	     * @param {?} response
	     * @return {?}
	     */
	    function (response) {
	        this.pagination = response;
	        this.addPage(response.data);
	    };
	    /**
	     *
	     * Set the ids and add the page to store
	     */
	    /**
	     *
	     * Set the ids and add the page to store
	     * @param {?} data
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.addPage = /**
	     *
	     * Set the ids and add the page to store
	     * @param {?} data
	     * @return {?}
	     */
	    function (data) {
	        var _this = this;
	        this.pages.set(this.currentPage, { ids: data.map((/**
	             * @param {?} entity
	             * @return {?}
	             */
	            function (entity) { return entity[_this.getStore().idKey]; })) });
	        this.getStore().add(data);
	    };
	    /**
	     * Clear the cache.
	     */
	    /**
	     * Clear the cache.
	     * @param {?=} options
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.clearCache = /**
	     * Clear the cache.
	     * @param {?=} options
	     * @return {?}
	     */
	    function (options) {
	        if (options === void 0) { options = {}; }
	        if (!this.initial) {
	            logAction('@Pagination - Clear Cache');
	            if (options.clearStore !== false && (this.config.clearStoreWithCache || options.clearStore)) {
	                this.getStore().remove();
	            }
	            this.pages = new Map();
	            this.metadata = new Map();
	        }
	        this.initial = false;
	    };
	    /**
	     * @param {?} page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.clearPage = /**
	     * @param {?} page
	     * @return {?}
	     */
	    function (page) {
	        this.pages.delete(page);
	    };
	    /**
	     * Clear the cache timeout and optionally the pages
	     */
	    /**
	     * Clear the cache timeout and optionally the pages
	     * @param {?=} __0
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.destroy = /**
	     * Clear the cache timeout and optionally the pages
	     * @param {?=} __0
	     * @return {?}
	     */
	    function (_a) {
	        var _b = _a === void 0 ? {} : _a, clearCache = _b.clearCache, currentPage = _b.currentPage;
	        if (this.clearCacheSubscription) {
	            this.clearCacheSubscription.unsubscribe();
	        }
	        if (clearCache) {
	            this.clearCache();
	        }
	        if (!isUndefined(currentPage)) {
	            this.setPage(currentPage);
	        }
	        this.initial = true;
	    };
	    /**
	     * Whether the provided page is active
	     */
	    /**
	     * Whether the provided page is active
	     * @param {?} page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.isPageActive = /**
	     * Whether the provided page is active
	     * @param {?} page
	     * @return {?}
	     */
	    function (page) {
	        return this.currentPage === page;
	    };
	    /**
	     * Set the current page
	     */
	    /**
	     * Set the current page
	     * @param {?} page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.setPage = /**
	     * Set the current page
	     * @param {?} page
	     * @return {?}
	     */
	    function (page) {
	        if (page !== this.currentPage || !this.hasPage(page)) {
	            this.page.next((this.pagination.currentPage = page));
	        }
	    };
	    /**
	     * Increment current page
	     */
	    /**
	     * Increment current page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.nextPage = /**
	     * Increment current page
	     * @return {?}
	     */
	    function () {
	        if (this.currentPage !== this.pagination.lastPage) {
	            this.setPage(this.pagination.currentPage + 1);
	        }
	    };
	    /**
	     * Decrement current page
	     */
	    /**
	     * Decrement current page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.prevPage = /**
	     * Decrement current page
	     * @return {?}
	     */
	    function () {
	        if (this.pagination.currentPage > 1) {
	            this.setPage(this.pagination.currentPage - 1);
	        }
	    };
	    /**
	     * Set current page to last
	     */
	    /**
	     * Set current page to last
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.setLastPage = /**
	     * Set current page to last
	     * @return {?}
	     */
	    function () {
	        this.setPage(this.pagination.lastPage);
	    };
	    /**
	     * Set current page to first
	     */
	    /**
	     * Set current page to first
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.setFirstPage = /**
	     * Set current page to first
	     * @return {?}
	     */
	    function () {
	        this.setPage(1);
	    };
	    /**
	     * Check if page exists in cache
	     */
	    /**
	     * Check if page exists in cache
	     * @param {?} page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.hasPage = /**
	     * Check if page exists in cache
	     * @param {?} page
	     * @return {?}
	     */
	    function (page) {
	        return this.pages.has(page);
	    };
	    /**
	     * Get the current page if it's in cache, otherwise invoke the request
	     */
	    /**
	     * Get the current page if it's in cache, otherwise invoke the request
	     * @param {?} req
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.getPage = /**
	     * Get the current page if it's in cache, otherwise invoke the request
	     * @param {?} req
	     * @return {?}
	     */
	    function (req) {
	        var _this = this;
	        /** @type {?} */
	        var page = this.pagination.currentPage;
	        if (this.hasPage(page)) {
	            return this.selectPage(page);
	        }
	        else {
	            this.setLoading(true);
	            return from(req()).pipe(switchMap((/**
	             * @param {?} config
	             * @return {?}
	             */
	            function (config) {
	                page = config.currentPage;
	                applyTransaction((/**
	                 * @return {?}
	                 */
	                function () {
	                    _this.setLoading(false);
	                    _this.update(config);
	                }));
	                return _this.selectPage(page);
	            })));
	        }
	    };
	    /**
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.getQuery = /**
	     * @return {?}
	     */
	    function () {
	        return this.query;
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.getFrom = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        if (this.isFirst) {
	            return 1;
	        }
	        return (this.currentPage - 1) * this.pagination.perPage + 1;
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.getTo = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        if (this.isLast) {
	            return this.pagination.total;
	        }
	        return this.currentPage * this.pagination.perPage;
	    };
	    /**
	     * Select the page
	     */
	    /**
	     * Select the page
	     * @private
	     * @param {?} page
	     * @return {?}
	     */
	    PaginatorPlugin.prototype.selectPage = /**
	     * Select the page
	     * @private
	     * @param {?} page
	     * @return {?}
	     */
	    function (page) {
	        var _this = this;
	        return this.query.selectAll({ asObject: true }).pipe(take(1), map((/**
	         * @param {?} entities
	         * @return {?}
	         */
	        function (entities) {
	            /** @type {?} */
	            var response = __assign({}, _this.pagination, { data: _this.pages.get(page).ids.map((/**
	                 * @param {?} id
	                 * @return {?}
	                 */
	                function (id) { return entities[id]; })) });
	            var _a = _this.config, range = _a.range, pagesControls = _a.pagesControls;
	            /** If no total - calc it */
	            if (isNaN(_this.pagination.total)) {
	                if (response.lastPage === 1) {
	                    response.total = response.data ? response.data.length : 0;
	                }
	                else {
	                    response.total = response.perPage * response.lastPage;
	                }
	                _this.pagination.total = response.total;
	            }
	            if (range) {
	                response.from = _this.getFrom();
	                response.to = _this.getTo();
	            }
	            if (pagesControls) {
	                response.pageControls = generatePages(_this.pagination.total, _this.pagination.perPage);
	            }
	            return response;
	        })));
	    };
	    __decorate([
	        action('@Pagination - New Page'),
	        __metadata("design:type", Function),
	        __metadata("design:paramtypes", [Object]),
	        __metadata("design:returntype", void 0)
	    ], PaginatorPlugin.prototype, "update", null);
	    return PaginatorPlugin;
	}(AkitaPlugin));
	/**
	 * Generate an array so we can ngFor them to navigate between pages
	 * @param {?} total
	 * @param {?} perPage
	 * @return {?}
	 */
	function generatePages(total, perPage) {
	    /** @type {?} */
	    var len = Math.ceil(total / perPage);
	    /** @type {?} */
	    var arr = [];
	    for (var i = 0; i < len; i++) {
	        arr.push(i + 1);
	    }
	    return arr;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * \@internal
	 *
	 * \@example
	 *
	 * getValue(state, 'todos.ui')
	 *
	 * @param {?} obj
	 * @param {?} prop
	 * @return {?}
	 */
	function getValue(obj, prop) {
	    /** return the whole state  */
	    if (prop.split('.').length === 1) {
	        return obj;
	    }
	    /** @type {?} */
	    var removeStoreName = prop
	        .split('.')
	        .slice(1)
	        .join('.');
	    return removeStoreName.split('.').reduce((/**
	     * @param {?} acc
	     * @param {?} part
	     * @return {?}
	     */
	    function (acc, part) { return acc && acc[part]; }), obj);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * \@internal
	 *
	 * \@example
	 * setValue(state, 'todos.ui', { filter: {} })
	 * @param {?} obj
	 * @param {?} prop
	 * @param {?} val
	 * @return {?}
	 */
	function setValue(obj, prop, val) {
	    /** @type {?} */
	    var split = prop.split('.');
	    if (split.length === 1) {
	        return val;
	    }
	    obj = __assign({}, obj);
	    /** @type {?} */
	    var lastIndex = split.length - 2;
	    /** @type {?} */
	    var removeStoreName = prop.split('.').slice(1);
	    removeStoreName.reduce((/**
	     * @param {?} acc
	     * @param {?} part
	     * @param {?} index
	     * @return {?}
	     */
	    function (acc, part, index) {
	        if (index === lastIndex) {
	            acc[part] = val;
	        }
	        else {
	            acc[part] = __assign({}, acc[part]);
	        }
	        return acc && acc[part];
	    }), obj);
	    return obj;
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// Todo: Return  AbstractControl interface
	/**
	 * @template T
	 */
	var  
	// Todo: Return  AbstractControl interface
	/**
	 * @template T
	 */
	PersistNgFormPlugin = /** @class */ (function (_super) {
	    __extends(PersistNgFormPlugin, _super);
	    function PersistNgFormPlugin(query, factoryFnOrPath, params) {
	        if (params === void 0) { params = {}; }
	        var _this = _super.call(this, query) || this;
	        _this.query = query;
	        _this.factoryFnOrPath = factoryFnOrPath;
	        _this.params = params;
	        _this.params = __assign({ debounceTime: 300, formKey: 'akitaForm', emitEvent: false, arrControlFactory: (/**
	             * @param {?} v
	             * @return {?}
	             */
	            function (v) { return _this.builder.control(v); }) }, params);
	        _this.isRootKeys = toBoolean(factoryFnOrPath) === false;
	        _this.isKeyBased = isString(factoryFnOrPath) || _this.isRootKeys;
	        return _this;
	    }
	    /**
	     * @template THIS
	     * @this {THIS}
	     * @param {?} form
	     * @param {?=} builder
	     * @return {THIS}
	     */
	    PersistNgFormPlugin.prototype.setForm = /**
	     * @template THIS
	     * @this {THIS}
	     * @param {?} form
	     * @param {?=} builder
	     * @return {THIS}
	     */
	    function (form, builder) {
	        (/** @type {?} */ (this)).form = form;
	        (/** @type {?} */ (this)).builder = builder;
	        (/** @type {?} */ (this)).activate();
	        return (/** @type {?} */ (this));
	    };
	    /**
	     * @param {?=} initialState
	     * @return {?}
	     */
	    PersistNgFormPlugin.prototype.reset = /**
	     * @param {?=} initialState
	     * @return {?}
	     */
	    function (initialState) {
	        var _this = this;
	        var _a;
	        /** @type {?} */
	        var value;
	        if (initialState) {
	            value = initialState;
	        }
	        else {
	            value = this.isKeyBased ? this.initialValue : ((/** @type {?} */ (this))).factoryFnOrPath();
	        }
	        if (this.isKeyBased) {
	            Object.keys(this.initialValue).forEach((/**
	             * @param {?} stateKey
	             * @return {?}
	             */
	            function (stateKey) {
	                /** @type {?} */
	                var value = _this.initialValue[stateKey];
	                if (Array.isArray(value) && _this.builder) {
	                    /** @type {?} */
	                    var formArray = _this.form.controls[stateKey];
	                    _this.cleanArray(formArray);
	                    value.forEach((/**
	                     * @param {?} v
	                     * @param {?} i
	                     * @return {?}
	                     */
	                    function (v, i) {
	                        _this.form.get(stateKey).insert(i, ((/** @type {?} */ (_this.params.arrControlFactory)))(v));
	                    }));
	                }
	            }));
	        }
	        this.form.patchValue(value, { emitEvent: this.params.emitEvent });
	        /** @type {?} */
	        var storeValue = this.isKeyBased ? setValue(this.getQuery().getValue(), this.getStore().storeName + "." + this.factoryFnOrPath, value) : (_a = {}, _a[this.params.formKey] = value, _a);
	        this.updateStore(storeValue);
	    };
	    /**
	     * @private
	     * @param {?} control
	     * @return {?}
	     */
	    PersistNgFormPlugin.prototype.cleanArray = /**
	     * @private
	     * @param {?} control
	     * @return {?}
	     */
	    function (control) {
	        while (control.length !== 0) {
	            control.removeAt(0);
	        }
	    };
	    /**
	     * @private
	     * @param {?} formValue
	     * @param {?} root
	     * @return {?}
	     */
	    PersistNgFormPlugin.prototype.resolveInitialValue = /**
	     * @private
	     * @param {?} formValue
	     * @param {?} root
	     * @return {?}
	     */
	    function (formValue, root) {
	        var _this = this;
	        if (!formValue)
	            return;
	        return Object.keys(formValue).reduce((/**
	         * @param {?} acc
	         * @param {?} stateKey
	         * @return {?}
	         */
	        function (acc, stateKey) {
	            /** @type {?} */
	            var value = root[stateKey];
	            if (Array.isArray(value) && _this.builder) {
	                /** @type {?} */
	                var factory_1 = _this.params.arrControlFactory;
	                _this.cleanArray(_this.form.get(stateKey));
	                value.forEach((/**
	                 * @param {?} v
	                 * @param {?} i
	                 * @return {?}
	                 */
	                function (v, i) {
	                    _this.form.get(stateKey).insert(i, ((/** @type {?} */ (factory_1)))(v));
	                }));
	            }
	            acc[stateKey] = root[stateKey];
	            return acc;
	        }), {});
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    PersistNgFormPlugin.prototype.activate = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        var _a;
	        /** @type {?} */
	        var path;
	        if (this.isKeyBased) {
	            if (this.isRootKeys) {
	                this.initialValue = this.resolveInitialValue(this.form.value, this.getQuery().getValue());
	                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
	            }
	            else {
	                path = this.getStore().storeName + "." + this.factoryFnOrPath;
	                /** @type {?} */
	                var root = getValue(this.getQuery().getValue(), path);
	                this.initialValue = this.resolveInitialValue(root, root);
	                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
	            }
	        }
	        else {
	            if (!((/** @type {?} */ (this.getQuery().getValue())))[this.params.formKey]) {
	                logAction('@PersistNgFormPlugin activate');
	                this.updateStore((_a = {}, _a[this.params.formKey] = ((/** @type {?} */ (this))).factoryFnOrPath(), _a));
	            }
	            /** @type {?} */
	            var value = this.getQuery().getValue()[this.params.formKey];
	            this.form.patchValue(value);
	        }
	        this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe((/**
	         * @param {?} value
	         * @return {?}
	         */
	        function (value) {
	            logAction('@PersistForm - Update');
	            /** @type {?} */
	            var newState;
	            if (_this.isKeyBased) {
	                if (_this.isRootKeys) {
	                    newState = (/**
	                     * @param {?} state
	                     * @return {?}
	                     */
	                    function (state) { return (__assign({}, state, value)); });
	                }
	                else {
	                    newState = (/**
	                     * @param {?} state
	                     * @return {?}
	                     */
	                    function (state) { return setValue(state, path, value); });
	                }
	            }
	            else {
	                newState = (/**
	                 * @return {?}
	                 */
	                function () {
	                    var _a;
	                    return (_a = {}, _a[_this.params.formKey] = value, _a);
	                });
	            }
	            _this.updateStore(newState(_this.getQuery().getValue()));
	        }));
	    };
	    /**
	     * @return {?}
	     */
	    PersistNgFormPlugin.prototype.destroy = /**
	     * @return {?}
	     */
	    function () {
	        this.formChanges && this.formChanges.unsubscribe();
	        this.form = null;
	        this.builder = null;
	    };
	    return PersistNgFormPlugin;
	}(AkitaPlugin));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	// @internal
	/**
	 * @param {?} value
	 * @return {?}
	 */
	function capitalize(value) {
	    return value && value.charAt(0).toUpperCase() + value.slice(1);
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var rootDispatcherSub;
	/** @type {?} */
	var devtoolsSub;
	/**
	 * @param {?=} ngZoneOrOptions
	 * @param {?=} options
	 * @return {?}
	 */
	function akitaDevtools(ngZoneOrOptions, options) {
	    if (options === void 0) { options = {}; }
	    if (!((/** @type {?} */ (window))).__REDUX_DEVTOOLS_EXTENSION__) {
	        return;
	    }
	    rootDispatcherSub && rootDispatcherSub.unsubscribe();
	    devtoolsSub && devtoolsSub();
	    /** @type {?} */
	    var isAngular = ngZoneOrOptions && ngZoneOrOptions['run'];
	    if (!isAngular) {
	        ngZoneOrOptions = ngZoneOrOptions || {};
	        ((/** @type {?} */ (ngZoneOrOptions))).run = (/**
	         * @param {?} cb
	         * @return {?}
	         */
	        function (cb) { return cb(); });
	        options = (/** @type {?} */ (ngZoneOrOptions));
	    }
	    /** @type {?} */
	    var defaultOptions = { name: 'Akita', shallow: true };
	    /** @type {?} */
	    var merged = Object.assign({}, defaultOptions, options);
	    /** @type {?} */
	    var devTools = ((/** @type {?} */ (window))).__REDUX_DEVTOOLS_EXTENSION__.connect(merged);
	    /** @type {?} */
	    var appState = {};
	    rootDispatcherSub = rootDispatcher.subscribe((/**
	     * @param {?} action
	     * @return {?}
	     */
	    function (action$$1) {
	        var _a;
	        if (action$$1.type === 1 /* DELETE_STORE */) {
	            /** @type {?} */
	            var storeName = action$$1.payload.storeName;
	            delete appState[storeName];
	            devTools.send({ type: "[" + storeName + "] - Delete Store" }, appState);
	            return;
	        }
	        if (action$$1.type === 2 /* NEW_STATE */) {
	            var type = currentAction.type, entityIds = currentAction.entityIds, skip$$1 = currentAction.skip;
	            if (skip$$1) {
	                setSkipAction(false);
	                return;
	            }
	            /** @type {?} */
	            var store = __stores__[action$$1.payload.name];
	            if (!store) {
	                return;
	            }
	            if (options.shallow === false && appState[action$$1.payload.name]) {
	                /** @type {?} */
	                var isEqual = JSON.stringify(store._value()) === JSON.stringify(appState[action$$1.payload.name]);
	                if (isEqual)
	                    return;
	            }
	            appState = __assign({}, appState, (_a = {}, _a[action$$1.payload.name] = store._value(), _a));
	            /** @type {?} */
	            var storeName = capitalize(action$$1.payload.name);
	            /** @type {?} */
	            var msg = isDefined(entityIds) ? "[" + storeName + "] - " + type + " (ids: " + entityIds + ")" : "[" + storeName + "] - " + type;
	            if (options.logTrace) {
	                console.group(msg);
	                console.trace();
	                console.groupEnd();
	            }
	            devTools.send({ type: msg }, appState);
	        }
	    }));
	    devtoolsSub = devTools.subscribe((/**
	     * @param {?} message
	     * @return {?}
	     */
	    function (message) {
	        if (message.type === 'ACTION') {
	            var _a = __read(message.payload.split('.'), 1), storeName_1 = _a[0];
	            if (__stores__[storeName_1]) {
	                ((/** @type {?} */ (ngZoneOrOptions))).run((/**
	                 * @return {?}
	                 */
	                function () {
	                    /** @type {?} */
	                    var funcCall = message.payload.replace(storeName_1, "this['" + storeName_1 + "']");
	                    try {
	                        new Function("" + funcCall).call(__stores__);
	                    }
	                    catch (e) {
	                        console.warn('Unknown Method ☹️');
	                    }
	                }));
	            }
	        }
	        if (message.type === 'DISPATCH') {
	            /** @type {?} */
	            var payloadType = message.payload.type;
	            if (payloadType === 'COMMIT') {
	                devTools.init(appState);
	                return;
	            }
	            if (message.state) {
	                /** @type {?} */
	                var rootState_1 = JSON.parse(message.state);
	                var _loop_1 = function (i, keys) {
	                    /** @type {?} */
	                    var storeName = keys[i];
	                    if (__stores__[storeName]) {
	                        ((/** @type {?} */ (ngZoneOrOptions))).run((/**
	                         * @return {?}
	                         */
	                        function () {
	                            __stores__[storeName]._setState((/**
	                             * @return {?}
	                             */
	                            function () { return rootState_1[storeName]; }), false);
	                        }));
	                    }
	                };
	                for (var i = 0, keys = Object.keys(rootState_1); i < keys.length; i++) {
	                    _loop_1(i, keys);
	                }
	            }
	        }
	    }));
	}

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @abstract
	 * @template E, P
	 */
	var  /**
	 * @abstract
	 * @template E, P
	 */
	EntityCollectionPlugin = /** @class */ (function () {
	    function EntityCollectionPlugin(query, entityIds) {
	        this.query = query;
	        this.entityIds = entityIds;
	        this.entities = new Map();
	    }
	    /**
	     * Get the entity plugin instance.
	     */
	    /**
	     * Get the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.getEntity = /**
	     * Get the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        return this.entities.get(id);
	    };
	    /**
	     * Whether the entity plugin exist.
	     */
	    /**
	     * Whether the entity plugin exist.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.hasEntity = /**
	     * Whether the entity plugin exist.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        return this.entities.has(id);
	    };
	    /**
	     * Remove the entity plugin instance.
	     */
	    /**
	     * Remove the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.removeEntity = /**
	     * Remove the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        this.destroy(id);
	        return this.entities.delete(id);
	    };
	    /**
	     * Set the entity plugin instance.
	     */
	    /**
	     * Set the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @param {?} plugin
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.createEntity = /**
	     * Set the entity plugin instance.
	     * @protected
	     * @param {?} id
	     * @param {?} plugin
	     * @return {?}
	     */
	    function (id, plugin) {
	        return this.entities.set(id, plugin);
	    };
	    /**
	     * If the user passes `entityIds` we take them; otherwise, we take all.
	     */
	    /**
	     * If the user passes `entityIds` we take them; otherwise, we take all.
	     * @protected
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.getIds = /**
	     * If the user passes `entityIds` we take them; otherwise, we take all.
	     * @protected
	     * @return {?}
	     */
	    function () {
	        return isUndefined(this.entityIds) ? this.query.getValue().ids : coerceArray(this.entityIds);
	    };
	    /**
	     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
	     */
	    /**
	     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
	     * @protected
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.resolvedIds = /**
	     * When you call one of the plugin methods, you can pass id/ids or undefined which means all.
	     * @protected
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        return isUndefined(ids) ? this.getIds() : coerceArray(ids);
	    };
	    /**
	     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
	     *
	     * For example in your plugin you may do the following:
	     *
	     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
	     */
	    /**
	     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
	     *
	     * For example in your plugin you may do the following:
	     *
	     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
	     * @protected
	     * @param {?} ids
	     * @param {?=} actions
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.rebase = /**
	     * Call this method when you want to activate the plugin on init or when you need to listen to add/remove of entities dynamically.
	     *
	     * For example in your plugin you may do the following:
	     *
	     * this.query.select(state => state.ids).pipe(skip(1)).subscribe(ids => this.activate(ids));
	     * @protected
	     * @param {?} ids
	     * @param {?=} actions
	     * @return {?}
	     */
	    function (ids, actions) {
	        var _this = this;
	        if (actions === void 0) { actions = {}; }
	        /**
	         *
	         * If the user passes `entityIds` & we have new ids check if we need to add/remove instances.
	         *
	         * This phase will be called only upon update.
	         */
	        if (toBoolean(ids)) {
	            /**
	             * Which means all
	             */
	            if (isUndefined(this.entityIds)) {
	                for (var i = 0, len = ids.length; i < len; i++) {
	                    /** @type {?} */
	                    var entityId = ids[i];
	                    if (this.hasEntity(entityId) === false) {
	                        isFunction$1(actions.beforeAdd) && actions.beforeAdd(entityId);
	                        /** @type {?} */
	                        var plugin = this.instantiatePlugin(entityId);
	                        this.entities.set(entityId, plugin);
	                        isFunction$1(actions.afterAdd) && actions.afterAdd(plugin);
	                    }
	                }
	                this.entities.forEach((/**
	                 * @param {?} plugin
	                 * @param {?} entityId
	                 * @return {?}
	                 */
	                function (plugin, entityId) {
	                    if (ids.indexOf(entityId) === -1) {
	                        isFunction$1(actions.beforeRemove) && actions.beforeRemove(plugin);
	                        _this.removeEntity(entityId);
	                    }
	                }));
	            }
	            else {
	                /**
	                 * Which means the user passes specific ids
	                 * @type {?}
	                 */
	                var _ids = coerceArray(this.entityIds);
	                for (var i = 0, len = _ids.length; i < len; i++) {
	                    /** @type {?} */
	                    var entityId = _ids[i];
	                    /** The Entity in current ids and doesn't exist, add it. */
	                    if (ids.indexOf(entityId) > -1 && this.hasEntity(entityId) === false) {
	                        isFunction$1(actions.beforeAdd) && actions.beforeAdd(entityId);
	                        /** @type {?} */
	                        var plugin = this.instantiatePlugin(entityId);
	                        this.entities.set(entityId, plugin);
	                        isFunction$1(actions.afterAdd) && actions.afterAdd(plugin);
	                    }
	                    else {
	                        this.entities.forEach((/**
	                         * @param {?} plugin
	                         * @param {?} entityId
	                         * @return {?}
	                         */
	                        function (plugin, entityId) {
	                            /** The Entity not in current ids and exists, remove it. */
	                            if (ids.indexOf(entityId) === -1 && _this.hasEntity(entityId) === true) {
	                                isFunction$1(actions.beforeRemove) && actions.beforeRemove(plugin);
	                                _this.removeEntity(entityId);
	                            }
	                        }));
	                    }
	                }
	            }
	        }
	        else {
	            /**
	             * Otherwise, start with the provided ids or all.
	             */
	            this.getIds().forEach((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) {
	                if (!_this.hasEntity(id))
	                    _this.createEntity(id, _this.instantiatePlugin(id));
	            }));
	        }
	    };
	    /**
	     * Listen for add/remove entities.
	     */
	    /**
	     * Listen for add/remove entities.
	     * @protected
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.selectIds = /**
	     * Listen for add/remove entities.
	     * @protected
	     * @return {?}
	     */
	    function () {
	        return this.query.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state.ids; }));
	    };
	    /**
	     * Base method for activation, you can override it if you need to.
	     */
	    /**
	     * Base method for activation, you can override it if you need to.
	     * @protected
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.activate = /**
	     * Base method for activation, you can override it if you need to.
	     * @protected
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.rebase(ids);
	    };
	    /**
	     * Loop over each id and invoke the plugin method.
	     */
	    /**
	     * Loop over each id and invoke the plugin method.
	     * @protected
	     * @param {?} ids
	     * @param {?} cb
	     * @return {?}
	     */
	    EntityCollectionPlugin.prototype.forEachId = /**
	     * Loop over each id and invoke the plugin method.
	     * @protected
	     * @param {?} ids
	     * @param {?} cb
	     * @return {?}
	     */
	    function (ids, cb) {
	        /** @type {?} */
	        var _ids = this.resolvedIds(ids);
	        for (var i = 0, len = _ids.length; i < len; i++) {
	            /** @type {?} */
	            var id = _ids[i];
	            if (this.hasEntity(id)) {
	                cb(this.getEntity(id));
	            }
	        }
	    };
	    return EntityCollectionPlugin;
	}());

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @template E, S
	 */
	var  /**
	 * @template E, S
	 */
	StateHistoryPlugin = /** @class */ (function (_super) {
	    __extends(StateHistoryPlugin, _super);
	    function StateHistoryPlugin(query, params, _entityId) {
	        if (params === void 0) { params = {}; }
	        var _this = _super.call(this, query, {
	            resetFn: (/**
	             * @return {?}
	             */
	            function () { return _this.clear(); })
	        }) || this;
	        _this.query = query;
	        _this.params = params;
	        _this._entityId = _entityId;
	        /**
	         * Allow skipping an update from outside
	         */
	        _this.skip = false;
	        _this.history = {
	            past: [],
	            present: null,
	            future: []
	        };
	        /**
	         * Skip the update when redo/undo
	         */
	        _this.skipUpdate = false;
	        params.maxAge = toBoolean(params.maxAge) ? params.maxAge : 10;
	        params.comparator = params.comparator || ((/**
	         * @param {?} prev
	         * @param {?} current
	         * @return {?}
	         */
	        function (prev, current) { return true; }));
	        _this.activate();
	        return _this;
	    }
	    Object.defineProperty(StateHistoryPlugin.prototype, "hasPast", {
	        get: /**
	         * @return {?}
	         */
	        function () {
	            return this.history.past.length > 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StateHistoryPlugin.prototype, "hasFuture", {
	        get: /**
	         * @return {?}
	         */
	        function () {
	            return this.history.future.length > 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.activate = /**
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        this.history.present = this.getSource(this._entityId);
	        this.subscription = this.selectSource(this._entityId)
	            .pipe(pairwise())
	            .subscribe((/**
	         * @param {?} __0
	         * @return {?}
	         */
	        function (_a) {
	            var _b = __read(_a, 2), past = _b[0], present = _b[1];
	            if (_this.skip) {
	                _this.skip = false;
	                return;
	            }
	            /**
	             *  comparator: (prev, current) => isEqual(prev, current) === false
	             * @type {?}
	             */
	            var shouldUpdate = _this.params.comparator(past, present);
	            if (!_this.skipUpdate && shouldUpdate) {
	                if (_this.history.past.length === _this.params.maxAge) {
	                    _this.history.past = _this.history.past.slice(1);
	                }
	                _this.history.past = __spread(_this.history.past, [past]);
	                _this.history.present = present;
	            }
	        }));
	    };
	    /**
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.undo = /**
	     * @return {?}
	     */
	    function () {
	        if (this.history.past.length > 0) {
	            var _a = this.history, past = _a.past, present = _a.present;
	            /** @type {?} */
	            var previous = past[past.length - 1];
	            this.history.past = past.slice(0, past.length - 1);
	            this.history.present = previous;
	            this.history.future = __spread([present], this.history.future);
	            this.update();
	        }
	    };
	    /**
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.redo = /**
	     * @return {?}
	     */
	    function () {
	        if (this.history.future.length > 0) {
	            var _a = this.history, past = _a.past, present = _a.present;
	            /** @type {?} */
	            var next = this.history.future[0];
	            /** @type {?} */
	            var newFuture = this.history.future.slice(1);
	            this.history.past = __spread(past, [present]);
	            this.history.present = next;
	            this.history.future = newFuture;
	            this.update('Redo');
	        }
	    };
	    /**
	     * @param {?} index
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.jumpToPast = /**
	     * @param {?} index
	     * @return {?}
	     */
	    function (index) {
	        if (index < 0 || index >= this.history.past.length)
	            return;
	        var _a = this.history, past = _a.past, future = _a.future;
	        /**
	         *
	         * const past = [1, 2, 3, 4, 5];
	         *
	         * newPast = past.slice(0, 2) = [1, 2];
	         * present = past[index] = 3;
	         * [...past.slice(2 + 1), ...future] = [4, 5];
	         *
	         * @type {?}
	         */
	        var newPast = past.slice(0, index);
	        /** @type {?} */
	        var newFuture = __spread(past.slice(index + 1), future);
	        /** @type {?} */
	        var newPresent = past[index];
	        this.history.past = newPast;
	        this.history.present = newPresent;
	        this.history.future = newFuture;
	        this.update();
	    };
	    /**
	     * @param {?} index
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.jumpToFuture = /**
	     * @param {?} index
	     * @return {?}
	     */
	    function (index) {
	        if (index < 0 || index >= this.history.future.length)
	            return;
	        var _a = this.history, past = _a.past, future = _a.future;
	        /** @type {?} */
	        var newPast = __spread(past, future.slice(0, index));
	        /** @type {?} */
	        var newPresent = future[index];
	        /** @type {?} */
	        var newFuture = future.slice(index + 1);
	        this.history.past = newPast;
	        this.history.present = newPresent;
	        this.history.future = newFuture;
	        this.update('Redo');
	    };
	    /**
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.clear = /**
	     * @return {?}
	     */
	    function () {
	        this.history = {
	            past: [],
	            present: null,
	            future: []
	        };
	    };
	    /**
	     * @param {?=} clearHistory
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.destroy = /**
	     * @param {?=} clearHistory
	     * @return {?}
	     */
	    function (clearHistory) {
	        if (clearHistory === void 0) { clearHistory = false; }
	        if (clearHistory) {
	            this.clear();
	        }
	        this.subscription.unsubscribe();
	    };
	    /**
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.ignoreNext = /**
	     * @return {?}
	     */
	    function () {
	        this.skip = true;
	    };
	    /**
	     * @private
	     * @param {?=} action
	     * @return {?}
	     */
	    StateHistoryPlugin.prototype.update = /**
	     * @private
	     * @param {?=} action
	     * @return {?}
	     */
	    function (action$$1) {
	        if (action$$1 === void 0) { action$$1 = 'Undo'; }
	        this.skipUpdate = true;
	        logAction("@StateHistory - " + action$$1);
	        this.updateStore(this.history.present, this._entityId);
	        this.skipUpdate = false;
	    };
	    return StateHistoryPlugin;
	}(AkitaPlugin));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @template E, P
	 */
	var  /**
	 * @template E, P
	 */
	EntityStateHistoryPlugin = /** @class */ (function (_super) {
	    __extends(EntityStateHistoryPlugin, _super);
	    function EntityStateHistoryPlugin(query, params) {
	        if (params === void 0) { params = {}; }
	        var _this = _super.call(this, query, params.entityIds) || this;
	        _this.query = query;
	        _this.params = params;
	        params.maxAge = toBoolean(params.maxAge) ? params.maxAge : 10;
	        _this.activate();
	        _this.selectIds()
	            .pipe(skip(1))
	            .subscribe((/**
	         * @param {?} ids
	         * @return {?}
	         */
	        function (ids) { return _this.activate(ids); }));
	        return _this;
	    }
	    /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.redo = /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.redo(); }));
	    };
	    /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.undo = /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.undo(); }));
	    };
	    /**
	     * @param {?} id
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.hasPast = /**
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        if (this.hasEntity(id)) {
	            return this.getEntity(id).hasPast;
	        }
	    };
	    /**
	     * @param {?} id
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.hasFuture = /**
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        if (this.hasEntity(id)) {
	            return this.getEntity(id).hasFuture;
	        }
	    };
	    /**
	     * @param {?} ids
	     * @param {?} index
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.jumpToFuture = /**
	     * @param {?} ids
	     * @param {?} index
	     * @return {?}
	     */
	    function (ids, index) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.jumpToFuture(index); }));
	    };
	    /**
	     * @param {?} ids
	     * @param {?} index
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.jumpToPast = /**
	     * @param {?} ids
	     * @param {?} index
	     * @return {?}
	     */
	    function (ids, index) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.jumpToPast(index); }));
	    };
	    /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.clear = /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.clear(); }));
	    };
	    /**
	     * @param {?=} ids
	     * @param {?=} clearHistory
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.destroy = /**
	     * @param {?=} ids
	     * @param {?=} clearHistory
	     * @return {?}
	     */
	    function (ids, clearHistory) {
	        if (clearHistory === void 0) { clearHistory = false; }
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.destroy(clearHistory); }));
	    };
	    /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.ignoreNext = /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.ignoreNext(); }));
	    };
	    /**
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    EntityStateHistoryPlugin.prototype.instantiatePlugin = /**
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        return (/** @type {?} */ (new StateHistoryPlugin(this.query, this.params, id)));
	    };
	    return EntityStateHistoryPlugin;
	}(EntityCollectionPlugin));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/** @type {?} */
	var dirtyCheckDefaultParams = {
	    comparator: (/**
	     * @param {?} head
	     * @param {?} current
	     * @return {?}
	     */
	    function (head, current) { return JSON.stringify(head) !== JSON.stringify(current); })
	};
	/**
	 * @param {?} nestedObj
	 * @param {?} path
	 * @return {?}
	 */
	function getNestedPath(nestedObj, path) {
	    /** @type {?} */
	    var pathAsArray = path.split('.');
	    return pathAsArray.reduce((/**
	     * @param {?} obj
	     * @param {?} key
	     * @return {?}
	     */
	    function (obj, key) { return (obj && obj[key] !== 'undefined' ? obj[key] : undefined); }), nestedObj);
	}
	/**
	 * @template Entity, StoreState
	 */
	var  /**
	 * @template Entity, StoreState
	 */
	DirtyCheckPlugin = /** @class */ (function (_super) {
	    __extends(DirtyCheckPlugin, _super);
	    function DirtyCheckPlugin(query, params, _entityId) {
	        var _this = _super.call(this, query) || this;
	        _this.query = query;
	        _this.params = params;
	        _this._entityId = _entityId;
	        _this.dirty = new BehaviorSubject(false);
	        _this.active = false;
	        _this._reset = new Subject();
	        _this.isDirty$ = _this.dirty.asObservable().pipe(distinctUntilChanged());
	        _this.reset$ = _this._reset.asObservable();
	        _this.params = __assign({}, dirtyCheckDefaultParams, params);
	        if (_this.params.watchProperty) {
	            /** @type {?} */
	            var watchProp = (/** @type {?} */ (coerceArray(_this.params.watchProperty)));
	            if (query instanceof QueryEntity && watchProp.includes('entities') && !watchProp.includes('ids')) {
	                watchProp.push('ids');
	            }
	            _this.params.watchProperty = watchProp;
	        }
	        return _this;
	    }
	    /**
	     * @param {?=} params
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.reset = /**
	     * @param {?=} params
	     * @return {?}
	     */
	    function (params) {
	        if (params === void 0) { params = {}; }
	        /** @type {?} */
	        var currentValue = this.head;
	        if (isFunction$1(params.updateFn)) {
	            if (this.isEntityBased(this._entityId)) {
	                currentValue = params.updateFn(this.head, ((/** @type {?} */ (this.getQuery()))).getEntity(this._entityId));
	            }
	            else {
	                currentValue = params.updateFn(this.head, ((/** @type {?} */ (this.getQuery()))).getValue());
	            }
	        }
	        logAction("@DirtyCheck - Revert");
	        this.updateStore(currentValue, this._entityId);
	        this._reset.next();
	    };
	    /**
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    DirtyCheckPlugin.prototype.setHead = /**
	     * @template THIS
	     * @this {THIS}
	     * @return {THIS}
	     */
	    function () {
	        if (!(/** @type {?} */ (this)).active) {
	            (/** @type {?} */ (this)).activate();
	            (/** @type {?} */ (this)).active = true;
	        }
	        else {
	            (/** @type {?} */ (this)).head = (/** @type {?} */ (this))._getHead();
	        }
	        (/** @type {?} */ (this)).updateDirtiness(false);
	        return (/** @type {?} */ (this));
	    };
	    /**
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.isDirty = /**
	     * @return {?}
	     */
	    function () {
	        return toBoolean(this.dirty.value);
	    };
	    /**
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.hasHead = /**
	     * @return {?}
	     */
	    function () {
	        return toBoolean(this.getHead());
	    };
	    /**
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.destroy = /**
	     * @return {?}
	     */
	    function () {
	        this.head = null;
	        this.subscription && this.subscription.unsubscribe();
	        this._reset && this._reset.complete();
	    };
	    /**
	     * @param {?} path
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.isPathDirty = /**
	     * @param {?} path
	     * @return {?}
	     */
	    function (path) {
	        /** @type {?} */
	        var head = this.getHead();
	        /** @type {?} */
	        var current = ((/** @type {?} */ (this.getQuery()))).getValue();
	        /** @type {?} */
	        var currentPathValue = getNestedPath(current, path);
	        /** @type {?} */
	        var headPathValue = getNestedPath(head, path);
	        return this.params.comparator(currentPathValue, headPathValue);
	    };
	    /**
	     * @protected
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.getHead = /**
	     * @protected
	     * @return {?}
	     */
	    function () {
	        return this.head;
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.activate = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        var _this = this;
	        this.head = this._getHead();
	        /**
	         * if we are tracking specific properties select only the relevant ones
	         * @type {?}
	         */
	        var source = this.params.watchProperty
	            ? ((/** @type {?} */ (this.params.watchProperty))).map((/**
	             * @param {?} prop
	             * @return {?}
	             */
	            function (prop) {
	                return _this.query.select((/**
	                 * @param {?} state
	                 * @return {?}
	                 */
	                function (state) { return state[prop]; })).pipe(map((/**
	                 * @param {?} val
	                 * @return {?}
	                 */
	                function (val) { return ({
	                    val: val,
	                    __akitaKey: prop
	                }); })));
	            }))
	            : [this.selectSource(this._entityId)];
	        this.subscription = combineLatest.apply(void 0, __spread(source)).pipe(skip(1))
	            .subscribe((/**
	         * @param {?} currentState
	         * @return {?}
	         */
	        function (currentState) {
	            if (isUndefined(_this.head))
	                return;
	            /**
	             * __akitaKey is used to determine if we are tracking a specific property or a store change
	             * @type {?}
	             */
	            var isChange = currentState.some((/**
	             * @param {?} state
	             * @return {?}
	             */
	            function (state) {
	                /** @type {?} */
	                var head = state.__akitaKey ? _this.head[(/** @type {?} */ (state.__akitaKey))] : _this.head;
	                /** @type {?} */
	                var compareTo = state.__akitaKey ? state.val : state;
	                return _this.params.comparator(head, compareTo);
	            }));
	            _this.updateDirtiness(isChange);
	        }));
	    };
	    /**
	     * @private
	     * @param {?} isDirty
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.updateDirtiness = /**
	     * @private
	     * @param {?} isDirty
	     * @return {?}
	     */
	    function (isDirty) {
	        this.dirty.next(isDirty);
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype._getHead = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        /** @type {?} */
	        var head = this.getSource(this._entityId);
	        if (this.params.watchProperty) {
	            head = this.getWatchedValues((/** @type {?} */ (head)));
	        }
	        return head;
	    };
	    /**
	     * @private
	     * @param {?} source
	     * @return {?}
	     */
	    DirtyCheckPlugin.prototype.getWatchedValues = /**
	     * @private
	     * @param {?} source
	     * @return {?}
	     */
	    function (source) {
	        return ((/** @type {?} */ (this.params.watchProperty))).reduce((/**
	         * @param {?} watched
	         * @param {?} prop
	         * @return {?}
	         */
	        function (watched, prop) {
	            watched[prop] = source[prop];
	            return watched;
	        }), (/** @type {?} */ ({})));
	    };
	    return DirtyCheckPlugin;
	}(AkitaPlugin));

	/**
	 * @fileoverview added by tsickle
	 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
	 */
	/**
	 * @template E, P
	 */
	var  /**
	 * @template E, P
	 */
	EntityDirtyCheckPlugin = /** @class */ (function (_super) {
	    __extends(EntityDirtyCheckPlugin, _super);
	    function EntityDirtyCheckPlugin(query, params) {
	        if (params === void 0) { params = {}; }
	        var _this = _super.call(this, query, params.entityIds) || this;
	        _this.query = query;
	        _this.params = params;
	        _this._someDirty = new Subject();
	        _this.someDirty$ = merge(_this.query.select((/**
	         * @param {?} state
	         * @return {?}
	         */
	        function (state) { return state.entities; })), _this._someDirty.asObservable()).pipe(auditTime(0), map((/**
	         * @return {?}
	         */
	        function () { return _this.checkSomeDirty(); })));
	        _this.params = __assign({}, dirtyCheckDefaultParams, params);
	        // TODO lazy activate?
	        _this.activate();
	        _this.selectIds()
	            .pipe(skip(1))
	            .subscribe((/**
	         * @param {?} ids
	         * @return {?}
	         */
	        function (ids) {
	            _super.prototype.rebase.call(_this, ids, { afterAdd: (/**
	                 * @param {?} plugin
	                 * @return {?}
	                 */
	                function (plugin) { return plugin.setHead(); }) });
	        }));
	        return _this;
	    }
	    /**
	     * @template THIS
	     * @this {THIS}
	     * @param {?=} ids
	     * @return {THIS}
	     */
	    EntityDirtyCheckPlugin.prototype.setHead = /**
	     * @template THIS
	     * @this {THIS}
	     * @param {?=} ids
	     * @return {THIS}
	     */
	    function (ids) {
	        if ((/** @type {?} */ (this)).params.entityIds && ids) {
	            /** @type {?} */
	            var toArray_1 = (/** @type {?} */ (coerceArray(ids)));
	            /** @type {?} */
	            var someAreWatched = coerceArray((/** @type {?} */ (this)).params.entityIds).some((/**
	             * @param {?} id
	             * @return {?}
	             */
	            function (id) { return toArray_1.indexOf(id) > -1; }));
	            if (someAreWatched === false) {
	                return (/** @type {?} */ (this));
	            }
	        }
	        (/** @type {?} */ (this)).forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.setHead(); }));
	        (/** @type {?} */ (this))._someDirty.next();
	        return (/** @type {?} */ (this));
	    };
	    /**
	     * @param {?} id
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.hasHead = /**
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        if (this.entities.has(id)) {
	            /** @type {?} */
	            var entity = this.getEntity(id);
	            return entity.hasHead();
	        }
	        return false;
	    };
	    /**
	     * @param {?=} ids
	     * @param {?=} params
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.reset = /**
	     * @param {?=} ids
	     * @param {?=} params
	     * @return {?}
	     */
	    function (ids, params) {
	        if (params === void 0) { params = {}; }
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.reset(params); }));
	    };
	    /**
	     * @param {?} id
	     * @param {?=} asObservable
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.isDirty = /**
	     * @param {?} id
	     * @param {?=} asObservable
	     * @return {?}
	     */
	    function (id, asObservable) {
	        if (asObservable === void 0) { asObservable = true; }
	        if (this.entities.has(id)) {
	            /** @type {?} */
	            var entity = this.getEntity(id);
	            return asObservable ? entity.isDirty$ : entity.isDirty();
	        }
	        return false;
	    };
	    /**
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.someDirty = /**
	     * @return {?}
	     */
	    function () {
	        return this.checkSomeDirty();
	    };
	    /**
	     * @param {?} id
	     * @param {?} path
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.isPathDirty = /**
	     * @param {?} id
	     * @param {?} path
	     * @return {?}
	     */
	    function (id, path) {
	        if (this.entities.has(id)) {
	            /** @type {?} */
	            var head = ((/** @type {?} */ (this.getEntity(id)))).getHead();
	            /** @type {?} */
	            var current = this.query.getEntity(id);
	            /** @type {?} */
	            var currentPathValue = getNestedPath(current, path);
	            /** @type {?} */
	            var headPathValue = getNestedPath(head, path);
	            return this.params.comparator(currentPathValue, headPathValue);
	        }
	        return null;
	    };
	    /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.destroy = /**
	     * @param {?=} ids
	     * @return {?}
	     */
	    function (ids) {
	        this.forEachId(ids, (/**
	         * @param {?} e
	         * @return {?}
	         */
	        function (e) { return e.destroy(); }));
	        /** complete only when the plugin destroys */
	        if (!ids) {
	            this._someDirty.complete();
	        }
	    };
	    /**
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.instantiatePlugin = /**
	     * @protected
	     * @param {?} id
	     * @return {?}
	     */
	    function (id) {
	        return (/** @type {?} */ (new DirtyCheckPlugin(this.query, this.params, id)));
	    };
	    /**
	     * @private
	     * @return {?}
	     */
	    EntityDirtyCheckPlugin.prototype.checkSomeDirty = /**
	     * @private
	     * @return {?}
	     */
	    function () {
	        var e_1, _a;
	        /** @type {?} */
	        var entitiesIds = this.resolvedIds();
	        try {
	            for (var entitiesIds_1 = __values(entitiesIds), entitiesIds_1_1 = entitiesIds_1.next(); !entitiesIds_1_1.done; entitiesIds_1_1 = entitiesIds_1.next()) {
	                var id = entitiesIds_1_1.value;
	                if (this.getEntity(id).isDirty()) {
	                    return true;
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (entitiesIds_1_1 && !entitiesIds_1_1.done && (_a = entitiesIds_1.return)) _a.call(entitiesIds_1);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        return false;
	    };
	    return EntityDirtyCheckPlugin;
	}(EntityCollectionPlugin));

	//# sourceMappingURL=datorama-akita.js.map

	class CounterStore extends Store {}
	class CounterQuery extends Query {}

	const store = new CounterStore(
	  {
	    count: 0
	  },
	  { name: 'counter' }
	);

	const query = new CounterQuery(store);

	/* src/App.svelte generated by Svelte v3.2.1 */

	const file = "src/App.svelte";

	function create_fragment(ctx) {
		var h1, t1, button, t2, t3, dispose;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Svelte Akita";
				t1 = space();
				button = element("button");
				t2 = text("Clicks: ");
				t3 = text(ctx.$count);
				add_location(h1, file, 12, 0, 205);
				add_location(button, file, 13, 0, 227);
				dispose = listen(button, "click", handleClick);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
				insert(target, t1, anchor);
				insert(target, button, anchor);
				append(button, t2);
				append(button, t3);
			},

			p: function update(changed, ctx) {
				if (changed.$count) {
					set_data(t3, ctx.$count);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
					detach(t1);
					detach(button);
				}

				dispose();
			}
		};
	}

	function handleClick() {
	  store.update(state => ({
	    count: state.count + 1
	  }));
	}

	function instance($$self, $$props, $$invalidate) {
		let $count;

		let count = query.select("count"); validate_store(count, 'count'); subscribe($$self, count, $$value => { $count = $$value; $$invalidate('$count', $count); });

		return { count, $count };
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, []);
		}
	}

	akitaDevtools();

	const app = new App({
	  target: document.body,
	  intro: true
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
