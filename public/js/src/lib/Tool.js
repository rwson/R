/***************
 * 工具类
 * *************/

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(window);
        });
    } else {
        root.Tool = factory(window);
    }

}(window, function (root, undefined) {

    var _class2 = {};                                       //  Object.prototype
    var _array2 = [];                                       //  Array.prototype

    var _Tool = {

        /**
         * 去字符串首尾空格
         * @param str   字符串
         * @returns {string}
         */
        "trim": function (str) {
            str = "" + str;
            if (str.trim) {
                return str.trim();
            } else {
                return str.replace(/^\s+/, "").replace(/\s+$/, "");
            }
        },

        /**
         * 给目标对象定义属性和是否可枚举等
         * @param opt   配置参数,包含{target,key,value,writable,enumerable,configurable}
         */
        "defineProperty": function (opt) {
            Object.defineProperty(opt.target, opt.key, {
                "value": opt.value,
                "writable": !!opt.writable,
                "enumerable": !!opt.enumerable,
                "configurable": !!opt.configurable
            });
        },

        /**
         * 处理state或者hash值
         * @param needState 是否支持
         * @param path      目标路由
         */
        "pushStateOrHash": function (needState, path) {
            if (!path) {
                return;
            }
            if (needState) {
                history.pushState("", "", path);
            } else {
                location.hash = path;
            }
        },

        /**
         * 获取页面的hash和state值
         * @param   rootPath    首页路径
         * @returns {hash: "", path: ""}
         */
        "getHashOrState": function (rootPath) {
            var path = decodeURIComponent(location.pathname + _Tool.getSearch());
            var hash = location.href.match(/#(.*)$/);
            var output = {};
            hash = hash ? hash[0].replace(/\#/g, "") : "";
            if (!path.indexOf((rootPath || "/"))) {
                path = "/" + path.slice(rootPath.length);
            }
            output.hash = hash;
            output.path = path;
            return output;
        },

        /**
         * 获取url中那一串?xxx=yyy
         * @returns {String || ""}
         * */
        "getSearch": function () {
            var match = location.href.replace(/#.*/, "").match(/\?.+/);
            return match ? match[0] : "";
        },

        /**
         * 获取url中的查询字符串
         * @param url   被获取的字符串
         * @returns {{}||Object}
         */
        "getQueryString": function (url) {
            var arr = url.split("?")[1].split("&");
            var output = {};
            if (!url || url.indexOf("?") < 0) {
                return output;
            }
            arr.forEach(function (item) {
                var _temp = item.split("=");
                output[_temp[0]] = decodeURIComponent(_temp[1]);
                _temp = null;
            });
            return output;
        },

        /**
         * 合并两个对象
         * @param obj1          第一个对象
         * @param obj2          第二个对象
         * @param override      是否支持相同属性值覆盖
         * @returns {Object}
         */
        "merge": function (obj1, obj2, override) {
            Object.keys(obj2).forEach(function (i) {
                if (obj1[i] && override) {
                    obj1[i] = obj2[i];
                } else if (!obj1[i] && obj2[i]) {
                    obj1[i] = obj2[i];
                }
            });
            return obj1;
        },

        /**
         * 判断一个对象是否为指定类型
         * @param obj       被判断的类型
         * @param typeStr   希望的类型字符串(Boolean Number String Function Array Date RegExp Object)
         * @returns {boolean}
         */
        "isType": function (obj, typeStr) {
            return _class2.toString.call(obj).toLowerCase() === ("[object " + typeStr + "]").toLowerCase();
        },

        /**
         * 判断两个对象是否相等
         * @param obj1  第一个对象
         * @param obj2  第二个对象
         * @returns {boolean}
         */
        "isEqual": function (obj1, obj2) {
            return _eq(obj1, obj2, [], []);
        },

        /**
         * 拷贝一个对象
         * @param obj   被拷贝的对象
         * @param deep  是否深拷贝
         * @returns {*}
         */
        "copy": function (obj, deep) {
            //  typeof []/{} -> "object"
            if (!deep || obj == null || typeof obj !== "object") {
                return obj;
            }
            var copied;
            if (_Tool.isType(obj, "Object")) {
                copied = {};
            } else if (_Tool.isType(obj, "Array")) {
                copied = [];
            }
            for (var i in obj) {
                if (obj.hasOwnProperty(i) || obj[i]) {
                    copied[i] = obj[i];
                }
            }
            return copied;
        },

        /**
         * 判断一个对象是否为伪数组,摘自《javaScript高级程序设计》
         * @param list  被判断的对象
         * @returns {boolean}
         */
        "isFakeArray": function (list) {
            return list && (typeof list === "object") && isFinite(list.length) && (list.length >= 0) && (list.length === Math.floor(list.length)) && list.length < 4294967296;
        },

        /**
         * 把一个伪数组(有length属性,没有数组原型下的方法)转换真数组
         * @param fakeArray     伪数组
         * @returns {Array.<T>}
         */
        "toArray": function (fakeArray) {
            var res = [];
            if (_Tool.isFakeArray(fakeArray)) {
                res = _array2.slice.call(fakeArray);
            }
            return res;
        },

        /**
         * 生成一个随机字符串
         * @returns {string}
         */
        "randomStr": function () {
            return ("" + Math.random()).toString(16).replace(".", "");
        },

        /**
         * 执行回调函数
         * @returns {*}
         */
        "executeCallback": function () {
            var fn = arguments[0];
            var args = _array2.slice.call(arguments, 1);
            if (_Tool.isType(fn, "Function")) {
                return fn.apply(root, args);
            }
        },

        /**
         * http请求(GET)
         * @param opts  配置参数
         */
        "getRequest": function (opts) {
            var xhr = new XMLHttpRequest();
            //  支持带cookie参数发起请求
            xhr.withCredentials = true;
            xhr.open("GET", opts.url, true);
            xhr.send(null);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        _Tool.executeCallback(opts.success, (opts.context || root), xhr);
                    } else {
                        _Tool.executeCallback(opts.fail, (opts.context || root), xhr);
                    }
                }
            };
        },

        /**
         * 抛出异常
         * @param msg   异常信息
         */
        "exception": function (msg) {
            throw msg;
        }

    };

    return _Tool;

}));