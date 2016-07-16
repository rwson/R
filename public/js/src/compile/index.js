/**
 * index.js
 * 编译模板
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "../lib/Tool",
            "../lib/DOM",
            "../lib/Event",
            "../directive/index"
        ], function (Tool, Dom, Event, Directive) {
            return factory(window, Tool, Event, Dom, Directive);
        });
    }

}(window, function (root, Tool, Dom, Event, directive, undefined) {

    //  无需编译的节点
    var unCompileElems = ["html", "head", "meta", "link", "title", "object", "embed", "script"];

    /**
     * 编译模块
     * @param el    根元素选择器
     * @constructor
     */
    function Compile(el) {
        this.bootstrap(el);
    }

    //  原型相关拓展
    Compile.prototype = {
        "constructor": Compile,

        /**
         * 启动
         * @param el    根元素选择器
         */
        "bootstrap": function (el) {
            this.roomElement = document.querySelector(el) || document.body;
            this.data = {};
            this.eleMap = {};
            this.compile();
        },

        /**
         * 设置vm中的数据
         * @param data  数据
         */
        "set": function (data) {
            this.data = Tool.merge(this.data, Tool.transfer(data, {
                "beforeUpdate": this.beforeUpdate,
                "update": this.update
            }));
        },

        "beforeUpdate": function () {
            console.log("我是更新之前的回调...");
        },

        "update": function () {
            console.log("我要开始更新DOM了...");
        },

        /**
         * 获取节点,过滤掉不编译的节点
         */
        "compile": function () {
            var eles = Tool.toArray(this.roomElement.getElementsByTagName("*"));

            //  过滤掉不编译的子元素
            eles = eles.filter(function (el) {
                return !~(unCompileElems.indexOf(el.tagName.toLowerCase()))
            });

            //  便于过滤后的节点列表
            eles = eles.map(function (el) {
                var rid = Tool.randomStr();
                var attrRid = Dom.getAttributes("rid").rid;
                var directives = this.getDirectives(el);
                if (!attrRid) {
                    Dom.setAttributes({
                        "rid": rid
                    });

                    this.eleMap[rid] = {
                        "el": el,
                        "directives": directives
                    };
                }
            }.bind(this));
        },

        /**
         * 获取当前HTML节点上的指令
         * @param el    当前节点
         */
        "getDirectives": function (el) {
            if (!Dom.isHTMLNode(el)) {
                return;
            }

            var directiveKeys = Object.keys(directive);
            var attrs = Tool.toArray(el.attributes);

            //  将指令的r-xxx写法转换成rXxx写法
            attrs = attrs.map(function (attr) {
                return attr.replace(/[^\b-]{1,90}/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).replace("-", "");
                }).replace("-", "");
            });

            //  过滤掉未经过声明的指令
            attrs = attrs.filter(function (attr) {
                return ~directiveKeys.indexOf(attr);
            });
            return attrs;
        },

        /**
         * 执行指令中的表达式
         * @param exp       表达式
         * @returns {*}
         */
        "exec": function (exp) {
            var value;
            if (Tool.isType(exp, "function")) {
                value = exp.call(this);
            } else if (Tool.isType(exp, "string")) {
                try {
                    value = new Function("return this." + exp + ";").bind(this.data)();
                } catch (ex) {
                    value = undefined;
                }
            }
            return value;
        },

        "link": function () {
            this.directives.forEach(function (dir) {
                var targetDirective = directive[dir]();
                var value = this.exec(targetDirective);
                targetDirective.link();
            }.bind(this));
        }

    };

    return Compile;

}));

