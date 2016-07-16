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
    function CompileTemplate(el) {
        this.roomElement = document.querySelector(el) || document.body;
        this.eleMap = {};
        this.compile();
    }

    //  原型相关拓展
    CompileTemplate.prototype = {
        "constructor": CompileTemplate,
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
         * 获取当前节点上的指令
         * @param el    当前节点
         */
        "getDirectives": function (el) {
            if (!Dom.isHTMLNode(el)) {
                return;
            }
            var directiveKeys = Object.keys(directive);
            var attrs = Tool.toArray(el.attributes);
            attrs = attrs.filter(function (attr) {
                return attr.match(/^r\-/) !== null;
            });
            attrs = attrs.map(function (attr) {
                return attr.replace(/[^\b-]{1,90}/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).replace("-", "");
                }).replace("-", "");
            });
            return attrs;
        }
    };

    return CompileTemplate;

}));

