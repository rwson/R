/**
 * Provider.js
 * light angularjs
 */

"use strict";

(function (root, undefined) {

    var DIRECTIVES_SUFFIX = "Directive";
    var CONTROLLERS_SUFFIX = "Controller";

    var Provider = {
        _providers: {},
        directive: function (name, fn) {
            this._register(name + DIRECTIVES_SUFFIX, fn);
        },
        controller: function (name, fn) {
            this._register(name + CONTROLLERS_SUFFIX, function () {
                return fn;
            });
            DOMCompiler.bootstrap();
        },
        service: function (name, fn) {
            this._register(name, fn);
        },
        _register: function (name, factory) {
            this._providers[name] = factory;
        },
        get: function (name, locals) {
            if (this._cache[name]) {
                return this._cache[name];
            }
            var provider = this._providers[name];
            if (!provider || typeof provider !== 'function') {
                return null;
            }
            return (this._cache[name] = this.invoke(provider, locals));
        },
        annotate: function (fn) {
            var res = fn.toString()
                .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '')
                .match(/\((.*?)\)/);
            if (res && res[1]) {
                return res[1].split(',').map(function (d) {
                    return d.trim();
                });
            }
            return [];
        },
        invoke: function (fn, locals) {
            locals = locals || {};
            var deps = this.annotate(fn).map(function (s) {
                return locals[s] || this.get(s, locals);
            }, this);
            return fn.apply(null, deps);
        },
        _cache: {$rootScope: new Scope()}
    };

    var DOMCompiler = {
        bootstrap: function (ele) {
            var _this = this;
            if (root.onload === null) {
                root.onload = function () {
                    ele = document.children[0];
                    _this.compile(ele || document.children[0],
                        Provider.get('$rootScope'));
                };
            } else {
                ele = document.children[0];
                this.compile(ele || document.children[0],
                    Provider.get('$rootScope'));
            }
        },
        compile: function (el, scope) {
            //获取某个元素上的所有指令
            var dirs = this._getElDirectives(el);
            var dir;
            var scopeCreated;
            dirs.forEach(function (d) {
                dir = Provider.get(d.name + DIRECTIVES_SUFFIX);
                //dir.scope代表当前 directive是否需要生成新的scope
                //这边的情况是只要有一个指令需要单独的scope，其他的directive也会变成具有新的scope对象，这边是不是不太好
                if (dir.scope && !scopeCreated) {
                    scope = scope.$new();
                    scopeCreated = true;
                }
                dir.link(el, scope, d.value);
            });
            [].slice.call(el.children).forEach(function (c) {
                this.compile(c, scope);
            }, this);
        },
        _getElDirectives: function (el) {
            var attrs = el.attributes;
            var result = [];
            for (var i = 0; i < attrs.length; i += 1) {
                if (Provider.get(attrs[i].name + DIRECTIVES_SUFFIX)) {
                    result.push({
                        name: attrs[i].name,
                        value: attrs[i].value
                    });
                }
            }
            return result;
        }
    };

    function Scope(parent, id) {
        this.$$watchers = [];
        this.$$children = [];
        this.$parent = parent;
        this.$id = id || 0;
    }

    Scope.counter = 0;

    Scope.prototype.$watch = function (exp, fn) {
        var clonedExp;
        try {
            clonedExp = JSON.parse(JSON.stringify(exp));
        } catch (ex) {
            clonedExp = undefined;
        }
        this.$$watchers.push({
            exp: exp,
            fn: fn,
            last: clonedExp
        });
    };

    Scope.prototype.$new = function () {
        Scope.counter += 1;
        var obj = new Scope(this, Scope.counter);
        //设置原型链，把当前的scope对象作为新scope的原型，这样新的scope对象可以访问到父scope的属性方法
        Object.setPrototypeOf(obj, this);
        this.$$children.push(obj);
        return obj;
    };

    Scope.prototype.$destroy = function () {
        var pc = this.$parent.$$children;
        pc.splice(pc.indexOf(this), 1);
    };

    Scope.prototype.$digest = function () {
        var dirty, watcher, current, i;
        do {
            dirty = false;
            for (i = 0; i < this.$$watchers.length; i += 1) {
                watcher = this.$$watchers[i];
                current = this.$eval(watcher.exp);
                if (!_equal(watcher.last, current)) {
                    try {
                        watcher.last = JSON.parse(JSON.stringify(current));
                    } catch (ex) {
                        watcher.last = current;
                    }
                    dirty = true;
                    watcher.fn(current);
                }
            }
        } while (dirty);
        for (i = 0; i < this.$$children.length; i += 1) {
            this.$$children[i].$digest();
        }
    };

    Scope.prototype.$eval = function (exp) {
        var val;
        if (typeof exp === 'function') {
            val = exp.call(this);
        } else {
            try {
                val = new Function('console.log(this);return this.' + exp).bind(this)();
            } catch (e) {
                val = undefined;
            }
        }
        return val;
    };

    Provider.directive('ngl-bind', function () {
        return {
            scope: false,
            link: function (el, scope, exp) {
                el.innerHTML = scope.$eval(exp);
                scope.$watch(exp, function (val) {
                    el.innerHTML = val;
                });
            }
        };
    });

    Provider.directive('ngl-model', function () {
        return {
            link: function (el, scope, exp) {
                el.onkeyup = function () {
                    scope[exp] = el.value;
                    scope.$digest();
                };
                scope.$watch(exp, function (val) {
                    el.value = val;
                });
            }
        };
    });

    Provider.directive('ngl-controller', function () {
        return {
            scope: true,
            link: function (el, scope, exp) {
                var ctrl = Provider.get(exp + CONTROLLERS_SUFFIX);
                Provider.invoke(ctrl, {$scope: scope});
            }
        };
    });

    Provider.directive('ngl-click', function () {
        return {
            scope: false,
            link: function (el, scope, exp) {
                el.onclick = function () {
                    scope.$eval(exp);
                    scope.$digest();
                };
            }
        };
    });

    function _equal(obj1, obj2) {
        try {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        } catch (ex) {
            return obj1 === obj2;
        }
    }

    root.Provider = Provider;

})(window);
