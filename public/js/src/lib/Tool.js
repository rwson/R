/***************
 * 工具类
 * *************/

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(window);
        });
    }

}(window, function (root, undefined) {

    var _class2 = {};                                       //  Object.prototype
    var _array2 = [];                                       //  Array.prototype

    var Tool = {

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
         * 转换成Object.defineProperty模式,实现数据变化后执行相关回调
         * @param target    目标对象
         * @param opt       配置参数
         */
        "transfer": function (target, opt) {
            var getter, setter;
            if (this.isType(target, "object")) {
                Object.keys(target).forEach(function (key) {
                    //  过滤掉"_xxx"这种key,可减少最多一倍的遍历次数
                    if (!(/^\_/).test(key)) {
                        var _key = "_" + key;
                        Object.defineProperty(target, key, {
                            "get": function () {
                                return this[_key];
                            },
                            "set": function (val) {
                                //  this[_key] !== undefined && !Tool.isEqual(this[_key], val)代表是通过update更新的数据,而不是set新增的
                                if ((!Tool.isUndefined(this[_key]) && !Tool.isEqual(this[_key], val))) {
                                    Tool.isType(opt.beforeUpdate, "function") && opt.beforeUpdate.call((opt.context || this), key, val);
                                    this[_key] = val;
                                    Tool.isType(opt.update, "function") && opt.update.call((opt.context || this), key, val);
                                } else {
                                    this[_key] = val;
                                }
                            }
                        });
                    }
                });
                return target;
            }
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
            rootPath = rootPath || "/";
            var path = decodeURIComponent(location.pathname + Tool.getSearch());
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
                } else {
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
         * 判断一对象是否为undefined
         * @param obj   被判断的对象
         * @returns {boolean}
         */
        "isUndefined": function (obj) {
            return obj === undefined;
        },

        /**
         * 判断当前对象是否是引用数据类型
         * @param obj   被判断的对象
         * @returns {boolean}
         */
        "isReferenceType": function (obj) {
            return this.isType(obj, "Object") || this.isType(obj, "Array");
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
            if (!deep || obj === null || typeof obj !== "object") {
                return obj;
            }
            var copied;
            if (Tool.isType(obj, "Object")) {
                copied = {};
            } else if (Tool.isType(obj, "Array")) {
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
         * 拷贝一个对象的属性,值作为空字符串
         * @param target
         * @returns {{}}
         */
        "copyAsEmpty": function (target) {
            var res = {};
            Object.keys(target).forEach(function (key) {
                res[key] = "";
            });
            return res;
        },

        /**
         * 将"xx-yy-zz"转换成驼峰写法
         * @param str
         * @returns {*}
         */
        "toCamelCase": function (str) {
            str = ("" + str);
            if (!("" + str)) {
                return "";
            }
            return str.replace(/[^\b-]{1,90}/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            }).replace(/\-/g, "");
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
            if (Tool.isFakeArray(fakeArray)) {
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
            if (Tool.isType(fn, "Function")) {
                return fn.apply(root, args);
            }
        },

        /**
         * 返回一个函数执行的后的结果
         * @param body      函数体
         * @param context   作用域
         * @param argus     参数列表
         * @returns {*}
         */
        "buildFunction": function (body, context, argus) {
            if(!arguments.length) {
                return false;
            }
            if (arguments.length > 3) {
                argus = [].slice.call(arguments, 2);
            }
            return new Function(body).apply(context, argus);
        },

        /**
         * http请求(GET)
         * @param opts  配置参数
         */
        "getRequest": function (opts) {
            var xhr = new XMLHttpRequest();
            //  支持带cookie发起请求
            xhr.withCredentials = true;
            xhr.open("GET", opts.url, true);
            xhr.send(null);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                        Tool.executeCallback(opts.success, (opts.context || root), xhr);
                    } else {
                        Tool.executeCallback(opts.fail, (opts.context || root), xhr);
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

    /**
     * 深度判断两个对象是否相等(摘自underscore中的eq方法)
     * @param a         第一个个对象
     * @param b         第二个对象
     * @param aStack    第一个栈
     * @param bStack    第二个栈
     * @returns {boolean}
     * @private
     */
    function _eq(a, b, aStack, bStack) {

        // 获取第一个对象原型上的类名
        var className = _class2.toString.call(a);

        /**
         * 检查两个基本数据类型的值是否相等
         * 对于引用数据类型,如果它们来自同一个引用(同一个对象进行比较),则认为其相等
         * 需要注意的是0 === -0的结果为true,所以后面的1 / a 和 1  / b 是来判断0 和 -0 的情况(1 / -0 = -Infinity) != (1 / 0 = Infinity)
         */
        if (a === b) return a !== 0 || 1 / a == 1 / b;

        /**
         * 处理undefined 和 null的情况
         * undefined == null 的结果为true,而undefined === null 的结果为false
         */
        if (a == null || b == null) return a === b;

        // 两个类名不同,直接返回false
        if (className != _class2.toString.call(b)) return false;

        switch (className) {
            case '[object String]':

                /**
                 * toString.call("str") == "[object String]" -> true
                 * toString.call(String("str")) == "[object String]" -> true
                 * toString.call(new String("str")) == "[object String]" -> true
                 */
                return a == ("" + b);
            case '[object Number]':

                /**
                 * +a 会把 a转换成一个数字,如果转换结果和原来不同则被认为NaN
                 * NaN != NaN,因此当a和b同时为NaN时,无法简单地使用a == b进行匹配,用相同的方法检查b是否为NaN(即 b != +b)
                 * 和刚进方法体一样,判断0和-0的情况
                 */
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':

                /**
                 * 把bool和date类型转换成对应的数字来比较
                 * +true -> 1 / +false -> 0 / +(new Date()) -> (new Date()).getTime()
                 */
                return +a == +b;
            case '[object RegExp]':

                //  匹配正则表达式的相关属性是否相同(元字符串/全局匹配/多行模式/忽略大小写)
                return a.source == b.source &&
                    a.global == b.global &&
                    a.multiline == b.multiline &&
                    a.ignoreCase == b.ignoreCase;
        }

        //  处理数组类型或对象类型(typeof [] = typeof {} = "object")
        if (typeof a != 'object' || typeof b != 'object') return false;

        //  在isEqual方法中传递的是空数组
        //  在方法体内部,判断的会再次进行传递被操作后的a堆和b堆
        var length = aStack.length;

        while (length--) {
            // 如果堆中的某个对象与数据a匹配,则再判断另一个堆中相同位置的对象是否等于第二个对象
            if (aStack[length] == a) return bStack[length] == b;
        }

        // 获取两个对象的构造器
        var aCtor = a.constructor, bCtor = b.constructor;

        //  判断两个对象如果不是不是同一个类的实例则认为不相等
        if (aCtor !== bCtor && !(Tool.isType(bCtor, "function") &&
            (aCtor instanceof aCtor) &&
            Tool.isType(bCtor, "function") &&
            (bCtor instanceof bCtor))) {
            return false;
        }

        // 把a和b分别放到a堆和b堆中
        aStack.push(a);
        bStack.push(b);

        //  局部变量
        var size = 0, result = true;

        // 数组类型比较
        if (className == '[object Array]') {
            size = a.length;

            //  比较两个数组的长度是否相等
            result = size == b.length;

            //  如果长度相同,再依次比较数组的每项
            if (result) {
                while (size--) {
                    if (!(result = _eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {

            // 如果是对象类型,枚举第一个对象,判断b和a中的每个属性值是否相同,记录a中属性值的个数
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    size++;
                    if (!(result = b.hasOwnProperty(key) && _eq(a[key], b[key], aStack, bStack))) break;
                }
            }

            /**
             * 如果a中有的属性b中都有
             * 再枚举b对象,判断长度,如果b中属性值的长度大于size则result为false(!1 = false / !0 = true)
             */
            if (result) {
                for (key in b) {
                    if (b.hasOwnProperty(key) && !(size--)) break;
                }

                // 当对象b中的属性多于对象a, 则认为两个对象不相等
                result = !size;
            }
        }

        // 删除堆中的数据,防止再进行迭代,返回比较结果
        aStack.pop();
        bStack.pop();
        return result;
    }

    return Tool;

}));