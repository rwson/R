/**
 * index.js
 * scope类,指定作用域
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["tool", "watcher"], function (Tool, Watcher) {
            return factory(root, Tool, Watcher);
        });
    }

}(window, function (root, Tool, Watcher, undefined) {

    //  条件判断语句(&&/||/==/===/!=/!==/>/</>=/<=)
    var conditionReg = /((\!)?\=+|>(\=)?|<(\=)?|\|\||\&\&)/g;

    //  boolean值之间的计算(!xyz/!!xyz/!!!xyz/!...xyz)
    var boolReg = /\!+/g;

    //  基本数学计算表达式(+/-/*///%)
    var calculateReg = /[\+|\-|\/*|\/|\%]/g;

    //  三目运算符(a ? 'b' : c)
    var trinocularExpReg = /[\w\W]+\?[\w\W]+\:[\w\W]+/;

    //  括号,指定含有计算表达式中的计算优先级
    var bracketsReg = /^\([\w\W]+\)$/g;

    //  用于替换表达式中的开头和结尾括号
    var bracketsReplace = /^\(|\)$/g;

    /**
     * Controller对应的scope对象
     * @param compile   Compile类的实例
     * @constructor
     */
    function Scope(compile) {
        this.uId = Tool.randomStr();        //  单独的id
        this.compile = compile;             //  存储compile实例
        this.data = {};                     //  数据对象
        this.events = {};                   //  事件对象
    }

    Scope.prototype = {

        "constructor": Scope,

        /**
         * 设置/新增数据
         * @param obj   要设置的数据
         */
        "set": function (obj) {
            //  转换成带getter/setter的对象,实现对数据的监听
            this.data = Tool.transfer(Tool.merge(this.data || {}, obj, true), {
                "context": this.compile,
                "beforeUpdate": this.compile.beforeUpdate,
                "update": this.compile.update
            });

            //  给数据进行第一次赋值
            Object.keys(obj).forEach(function (key) {
                var val = obj[key];
                if (!("" + val).length && Tool.isType(val, "string")) {
                    val = "";
                }
                this.data[key] = val;
            }, this);
        },

        /**
         * 获取this.data中key对应的数据值
         * @param key   属性名
         * @returns {*}
         */
        "get": function (key) {
            var target = this.data[key];
            return Tool.isReferenceType(target) ? Tool.copy(target, true) : target;
        },

        /**
         * 更新数据
         * @param obj   要更新的数据
         */
        "update": function (obj) {
            var watcherList = Watcher.watcherList,
                uId = this.uId,
                updater;
            Object.keys(obj).forEach(function (key) {
                if (!Tool.isEqual(this.get(key), obj[key])) {
                    this.data[key] = obj[key];
                    if (watcherList.length > 1) {
                        watcherList.forEach(function (watcher) {
                            updater = {};
                            if (!Tool.isEqual(watcher.uId, uId) && Tool.isEqual(key, watcher.key)) {
                                updater[key] = obj[key];
                                watcher.scope.update(updater);
                            }
                        });
                    }
                }
            }, this);
        },

        /**
         * 声明事件
         * @param obj   事件对象
         */
        "defineEvents": function (obj) {
            this.events = Tool.copy(obj, true);
        },

        /**
         * 获取数据或者事件回调
         * @param exp   数据或者事件回调对应的key
         * @returns {*}
         */
        "exec": function (exp) {
            return this.get(exp) || this.events[exp];
        },

        /**
         * 获取深层对象下的相关属性值(a["b"]["c"]["d"][,...])
         * @param expStr    指令表达式字符串
         * @param context   被获取属性的对象
         * @returns {{
         *      "executeStr": string,
         *      "result": *
         * }}
         */
        "execDeep": function (expStr, context) {

            if (!expStr) {
                return {
                    "executeStr": "",
                    "result": ""
                };
            }

            var condition = expStr.match(conditionReg),
                strArr, executeStr, canculate, boolean, booleanIn, isTrinocular;

            //  判断是否存在条件判断语句,拼凑不同的数组
            if (condition !== null) {
                condition = condition[0];
                strArr = expStr.split(condition);
            } else {
                strArr = [expStr];
            }

            //  遍历每一项,判断是否需要加this
            strArr = strArr.map(function (strItem) {

                //  去空格
                strItem = Tool.trim(strItem);

                //  判断该条语句中是否存在数学计算和转boolean运算
                canculate = strItem.match(calculateReg);
                boolean = strItem.match(boolReg);

                //  判断是否为三目运算符
                isTrinocular = trinocularExpReg.test(isTrinocular);

                //  存在计算表达式,并且不是三目运算(可能输入含运算符的字符串)
                if (canculate && isTrinocular) {
                    canculate = canculate[0];
                    strItem = strItem.split(canculate);
                    strItem = strItem.map(function (str) {
                        booleanIn = str.match(boolReg);
                        str = Tool.trim(str);

                        //  表达式中含有转boolean匀速
                        if (booleanIn) {
                            booleanIn = booleanIn[0];
                            str = str.replace(booleanIn, "");

                            //  判断是否需要this.
                            try {
                                new Function("return this." + str).call(context);
                                str = booleanIn + "(this." + str + ")";
                            } catch (ex) {
                                str = booleanIn + "(" + str + ")";
                            }
                        } else {
                            try {
                                new Function("return this." + str).call(context);
                                str = "(this." + str + ")";
                            } catch (ex) {
                                str = "(" + str + ")";
                            }
                        }
                        return str;
                    }).join(" " + canculate + " ");
                }

                if (boolean) {
                    boolean = boolean[0];
                    strItem = strItem.replace(boolean, "");
                }

                try {
                    new Function("return this." + strItem);
                    strItem = "(this." + strItem + ")";
                } catch (ex) {
                    strItem = "(" + strItem + ")";
                }

                if (boolean) {
                    strItem = boolean + strItem;
                }

                return strItem;
            });

            if (condition) {
                executeStr = strArr.join(condition);
            } else {
                executeStr = strArr.join(" ");
            }

            return {
                "executeStr": executeStr,
                "result": new Function("return " + executeStr + ";").call(context)
            };
        },

        /**
         * 根据第一次编译拼接好的执行字符串,来获取数据,而不用重新编译
         * @param execStr   执行字符串
         * @param context   上下文作用域
         * @returns {*}
         */
        "execByStr": function (execStr, context) {
            if (!execStr) {
                return;
            }
            return new Function("return " + execStr).call(context);
        },

        /**
         * link方法,做第一次数据绑定,代理执行Compile实例下的link,并且把Scope实例传入当scope
         */
        "link": function () {
            this.compile.link(this);
        }

    };

    return Scope;

}));
