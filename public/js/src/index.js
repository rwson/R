/**
 * RouteAble前端路由
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(window);
        });
    } else {
        root.RouteAble = factory(window);
    }

}(window, function (root) {

    var _class2 = {};                                   //  Object.prototype
    var _array2 = [];                                   //  Array.prototype
    var _isSupportPushState = !!history.pushState;      //  当前浏览器支持pushState
    var paramRoute = /(\/\:\w+)+/g;                     //  带url参数REST风格的路由
    var replaceParam = /(\/\:\w+)/g;                    //  替换掉url中参数的表示

    var RouteAble = {

        //  默认配置
        "cfg": {
            "path": [],             //  Array当path的值,每项由一个Object构成,Object包含三个属性(path,tplPath,controller)
            //  "path": {},         //  Object,由path("/","/list"...)做key,value对应一个Object,包含tplPath,controller两个属性
            "pushState": true,      //  是否支持HTML5的pushState,传入false,即采用hash解决方案
            "default": "/"          //  首页
        },

        //  最后的配置参数
        "finalCfg": {},

        //  url中所带参数,包含queryString和path
        "pageParams": {},

        //  模板显示区域
        "container": document.getElementById("route-app"),

        /**
         * 配置方法
         * @param opt   配置对象,结构和cfg类似
         */
        "config": function (opt) {
            if (!_isType(opt, "Object")) {
                throw "config exception!the config method expect an argument which is an Object!";
            }
            //  处理div#route-app不存在的情况
            if (!this.container) {
                var body = document.getElementsByTagName("body")[0];
                var first = body.getElementsByTagName("*")[0];
                this.container = document.createElement("div");
                this.container.id = "route-app";
                body.insertBefore(this.container, first);
            }
            var finalCfg = _merge(this.cfg, opt, true);
            var res = [];
            var regex;
            if (_isType(finalCfg.path, "Array")) {
                //  Array形式的配置
                for (var i = 0, len = finalCfg.path.length; i < len; i++) {
                    res = finalCfg.path[i].path.match(paramRoute);
                    regex = new RegExp(finalCfg.path[i].path.replace(replaceParam, "\\/\\w+"), "g");
                    if (res) {
                        finalCfg.originPath = finalCfg.path[i].path;
                        finalCfg.path[i].path = regex;
                        finalCfg.path[i].regex = regex;
                    }
                }
            } else if (_isType(finalCfg.path, "Object")) {
                //  Object形式的配置
            }
            this.finalCfg = finalCfg;
        },

        /**
         * 获取当前path在配置中的相关参数
         * @param path  当前页面的path
         * @returns {*}
         */
        "getCurrent": function (path) {
            var route = this.finalCfg.path;
            var tPath;
            var output;
            if (_isType(route, "Object")) {
                output = route[path];
            } else if (_isType(route, "Array")) {
                for (var i = 0, len = route.length; i < len; i++) {
                    tPath = route[i]["path"];
                    if (_isType(tPath, "String") && tPath === path) {
                        output = route[i];
                    } else if (_isType(tPath, "RegExp") && tPath.test(path)) {
                        output = _merge(route[i], {
                            "path": path
                        }, true);
                    }
                }
            }
            return output;
        },

        /**
         * 跳转到某个页面
         * @param path      路径
         * @param callback  回调
         */
        "navigate": function (path, callback) {
            var _this = this;
            var cfg = this.finalCfg;
            var target = this.getCurrent(path);
            var tpl;
            //  该路由没有配置或者上一条路由等于要跳转的,就不用pushState来新增
            if (!target || !target.path) {
                return;
            }
            var finalCallback = function () {
                target.controller.call(this);
                _execCallback(callback);
            };
            _xhrGET(target.tplPath, function (xhr) {
                tpl = xhr.responseText;
                _this.container.innerHTML = tpl;
                _pushStateOrHash(cfg.pushState && _isSupportPushState, path);
                _execCallback(finalCallback);
            }, function (xhr) {
                throw xhr.responseText;
            });
        },

        /**
         * 跳转到某个页面
         * @param path      路径
         * @param callback  回调
         */
        "prevOrBack": function (path, callback) {
            var _this = this;
            var target = this.getCurrent(path);
            var tpl;
            //  该路由没有配置或者上一条路由等于要跳转的,就不用pushState来新增
            if (!target || !target.path) {
                return;
            }
            _xhrGET(target.tplPath, function (xhr) {
                tpl = xhr.responseText;
                _this.container.innerHTML = tpl;
                _execCallback(callback);
            }, function (xhr) {
                throw xhr.responseText;
            });
        },

        /**
         * 初始化事件(有效a标签的click事件,浏览器的前进后退)
         */
        "initEvents": function () {
            var cfg = this.finalCfg;
            var _this = this;
            var path;

            //  document代理a标签的点击事件
            _removeEvent(document, "click");
            _addEvent(document, "click", function (ev) {
                ev = ev || event;
                var target = ev.target;
                path = target.getAttribute("href");
                if (target.tagName.toLowerCase() === "a" && path) {
                    _this.navigate(path);
                }
            });

            //  浏览器前进后退
            if (_isSupportPushState && cfg.pushState) {
                _removeEvent(root, "popstate");
                _addEvent(root, "popstate", function (ev) {
                    var path = _getHashOrState(cfg.default || "/").path;
                    _this.prevOrBack(path);
                });
            } else if (!_isSupportPushState || !cfg.pushState) {
                _removeEvent(root, "hashchange");
                _addEvent(root, "hashchange", function (ev) {
                    var path = _getHashOrState(cfg.default || "/").path;
                    _this.navigate(hash);
                });
            }
        },

        /**
         * 运行事件
         * @param callback  回调函数
         */
        "run": function (callback) {
            var cfg = this.finalCfg;
            var path = cfg.default;
            var cPath = _getHashOrState(cfg.default || "/").path;
            if (cPath) {
                path = cPath;
            }
            this.navigate(path);
            this.initEvents();
        }

    };

    /**
     * 处理state或者hash值
     * @param needState 是否支持
     * @param path      目标路由
     * @private
     */
    function _pushStateOrHash(needState, path) {
        if (!path) {
            return;
        }
        if (needState) {
            history.pushState("", "", path);
        } else {
            location.hash = path;
        }
    }

    /**
     * GET形式的http请求
     * @param url       请求路径
     * @param success   成功回调
     * @param fail      失败回调
     * @private
     */
    function _xhrGET(url, success, fail) {
        if (!url) {
            throw "the method _xhrGET must pass in the url!";
        }
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open("GET", url, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    if (_isType(success, "Function")) {
                        success.call(root, xhr);
                    }
                } else if (_isType(fail, "Function")) {
                    fail.call(root, xhr);
                }
            }
        };
    }

    /**
     * 添加事件监听
     * @param obj   HTMLDOMElement
     * @param type  事件类型
     * @param fn    回调函数
     * @private
     */
    function _addEvent(obj, type, fn) {
        if (!obj) {
            return;
        }
        if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function (ev) {
                ev = ev || root.event;
                obj["e" + type + fn](ev);
                _prevDefault(ev);
            };
            obj.attachEvent("on" + type, function (ev) {
                ev = ev || root.event;
                obj[type + fn](ev);
                _prevDefault(ev);
            });
        } else {
            obj.addEventListener(type, function (ev) {
                ev = ev || root.event;
                fn();
                _prevDefault(ev);
            }, false);
        }
    }

    /**
     * 移除事件监听
     * @param obj   HTMLDOMElement
     * @param type  事件类型
     * @param fn    回调函数
     * @private
     */
    function _removeEvent(obj, type, fn) {
        if (!obj) {
            return;
        }
        if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj[type + fn]);
            obj[type + fn] = null;
        } else {
            obj.removeEventListener(type, fn, false);
        }
    }

    /**
     * 阻止默认事件和事件冒泡
     * @param ev    事件句柄
     * @private
     */
    function _prevDefault(ev) {
        //  阻止冒泡
        if (ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            root.event.cancelBubble = true;
        }

        //  阻止默认事件
        if (ev.preventDefault) {
            ev.preventDefault();
        } else {
            root.event.returnValue = false;
        }
    }

    /**
     * 执行一个回调,并且传入相关参数
     * @returns {*}
     */
    function _execCallback() {
        var fn = arguments[0];
        var args = _array2.slice.call(arguments, 1);
        if (_isType(fn, "Function")) {
            return fn.apply(root, args);
        }
    }

    /**
     * 获取页面的hash和state值
     * @param ev    事件句柄
     * @returns {hash: "", path: ""}
     * @private
     */
    function _getHashOrState(rootPath) {
        var output = {};
        var hash = location.href.match(/#(.*)$/);
        hash = hash ? hash[0] : "";
        var path = decodeURIComponent(location.pathname + _getSearch());
        if (!path.indexOf((rootPath || "/"))) {
            path = "/" + path.slice(rootPath.length);
        }
        output.hash = hash;
        output.path = path;
        return output;
    }

    /**
     * 获取url中那一串?xxx=yyy
     * @returns {String || ""}
     * @private
     * */
    function _getSearch() {
        var match = location.href.replace(/#.*/, "").match(/\?.+/);
        return match ? match[0] : "";
    }

    /**
     * 获取url中的查询字符串
     * @param url   url
     * @returns {Object || {}}
     * @private
     */
    function _getQueryString(url) {
        var output = {};
        var arr = url.split("?")[1].split("&");
        if (!url || url.indexOf("?") < 0) {
            return output;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            var _temp = arr[i].split("=");
            output[_temp[0]] = decodeURIComponent(_temp[1]);
            _temp = null;
        }
        return output;
    }

    /**
     * 合并两个对象
     * @param obj1          第一个对象
     * @param obj2          第二个对象
     * @param override      是否支持相同属性值覆盖
     * @returns {Object}
     * @private
     */
    function _merge(obj1, obj2, override) {
        if (!_isType(obj1, "Object") || !_isType(obj2, "Object")) {
            return;
        }
        for (var i in obj2) {
            if (obj1[i] && override) {
                obj1[i] = obj2[i];
            } else if (!obj1[i] && obj2[i]) {
                obj1[i] = obj2[i];
            }
        }
        return obj1;
    }

    /**
     * 判断一个对象是否为指定类型
     * @param obj       被判断的类型
     * @param typeStr   希望的类型字符串(Boolean Number String Function Array Date RegExp Object)
     * @returns {boolean}
     */
    function _isType(obj, typeStr) {
        return _class2.toString.call(obj).toLowerCase() === ("[object " + typeStr + "]").toLowerCase();
    }

    return RouteAble;

}));
