/**
 * index.js
 * 编译模板(View:事件绑定/指定数据)
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "tool",
            "dom",
            "event",
            "directive"
        ], function (Tool, Dom, Event, directive) {
            return factory(window, Tool, Dom, Event, directive);
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
            this.eleMap = {};
            this.compile();
        },

        /**
         * 数据发送变化,更新DOM之前的回调
         * @param key   数据对应的key
         * @param val   数据值
         */
        "beforeUpdate": function (key, val) {
        },

        /**
         * 数据发送变化,更新DOM
         * @param key   数据对应的key
         * @param val   数据值
         */
        "update": function (key, val) {

        },

        /**
         * 获取节点,过滤掉不编译的节点
         */
        "compile": function () {
            var eles = Tool.toArray(this.roomElement.getElementsByTagName("*"));

            //  便于过滤后的节点列表
            eles.forEach(function (el) {
                if (!~(unCompileElems.indexOf(el.tagName.toLowerCase()))) {
                    var rid = Tool.randomStr();
                    var attrRid = Dom.getAttributes(el, "rid").rid;
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

            var attrs = Tool.toArray(el.attributes);
            var res = [];

            //  将指令的r-xxx写法转换成rXxx写法
            attrs.forEach(function (attr) {
                var name = attr.name;
                var exp = attr.value;

                name = name.replace(/[^\b-]{1,90}/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).replace("-", "");
                }).replace("-", "");

                if (directive.hasOwnProperty(name)) {
                    res.push({
                        "directive": directive[name],
                        "exp": exp
                    });
                }
            }.bind(this));

            return res;
        },

        /**
         * 绑定指令
         * @param scope Scope类的实例
         */
        "link": function (scope) {
            var ele = this.eleMap;
            Object.keys(ele).forEach(function (key) {
                var cEle = ele[key];
                if(!cEle.compiled) {
                    cEle.directives.forEach(function (dir) {
                        var directive = new dir.directive();
                        var exp = scope.exec(dir.exp);
                        directive.link(cEle.el, exp, scope);
                    });
                    this.eleMap.compiled = true;
                }
            }.bind(this));
        }

    };

    return Compile;

}));

