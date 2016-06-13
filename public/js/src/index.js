"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            root.RouteAble = factory();
        });
    } else {
        root.RouteAble = factory();
    }

}(window, function (root) {

    var _class2 = {};                                   //  Object.prototype
    var _isSupportPushState = !!history.pushState;      //  当前浏览器支持pushState
    var _aTag;                                          //  存储a标签

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

        /**
         * 配置方法
         * @param opt   配置对象,结构和cfg类似
         */
        "config": function (opt) {
            if (!_isType(opt, "Object")) {
                throw "config exception!the config method expect an argument which is an Object!";
            }
            this.finalCfg = _merge(this.cfg, opt, true);
        },

        /**
         * 获取当前path在配置中的相关参数
         * @param path  当前页面的path
         * @returns {*}
         */
        "getCurrent": function (path) {
            var route = this.finalCfg.path;
            var output;
            if (_isType(route, "Object")) {
                output = route[path];
            } else if (_isType(route, "Array")) {
                for (var i = 0, len = route.length; i < len; i++) {
                    if(route["path"] === path) {
                        output = route[path];
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
        },

        /**
         * 初始化事件(有效a标签的click事件,浏览器的前进后退)
         */
        "initEvents": function () {
        },

        /**
         * 运行事件
         * @param callback
         */
        "run": function (callback) {
        }

    };

    function _xhr(opt) {

    }

    /**
     * 获取所有含有有效href属性(href存在,且不为空)的a标签
     * @returns {Array}
     * @private
     */
    function _getATags() {
        var tags = document.getElementsByTagName("a");
        var output = [];
        if (tags.length) {
            for (var i = 0, len = tags.length; i < len; i++) {
                if (!!tags[i].href) {
                    output.push(tags[i]);
                }
            }
        }
        return output;
    }

    /**
     * 添加事件监听
     * @param obj   HTMLDOMElement
     * @param type  事件类型
     * @param fn    回调函数
     * @private
     */
    function _addEvent(obj, type, fn) {
        if (obj.attachEvent) {
            obj["e" + type + fn] = fn;
            obj[type + fn] = function () {
                obj["e" + type + fn](window.event);
            };
            obj.attachEvent("on" + type, obj[type + fn]);
        } else
            obj.addEventListener(type, fn, false);
    }

    /**
     * 移除事件监听
     * @param obj   HTMLDOMElement
     * @param type  事件类型
     * @param fn    回调函数
     * @private
     */
    function removeEvent(obj, type, fn) {
        if (obj.detachEvent) {
            obj.detachEvent("on" + type, obj[type + fn]);
            obj[type + fn] = null;
        } else
            obj.removeEventListener(type, fn, false);
    }

    /**
     * 执行一个回调,并且传入相关参数
     * @returns {*}
     */
    function execCallback() {
        var fn = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        if (_isType(fn, "Function")) {
            return fn.apply(root, args);
        }
    }

    /**
     * 获取页面的hash和state值
     * @returns {hash: "", state: ""}
     * @private
     */
    function _getHashOrState() {
        var output = {};
        var hash = location.hash;
        if (hash.length) {
            output.hash = hash;
        }
        output.state = "";
        return output;
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
        for (var i in obj) {
            if (obj1[i] && override) {
                obj1[i] = obj2[i];
            } else if (!obj1) {
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
