/**
 * index.js
 * 编译模板
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([
            "../libs/TOOL",
            "../libs/DOM",
            "../directives/index"
        ], function (_Tool, _Dom, directiveMap) {
            return factory(window, _Tool, _Dom, directiveMap);
        });
    } else {
        root.bindFor = factory(window, Tool, Dom, directiveMap);
    }

}(window, function (root, _Tool, _Dom, directiveMap, undefined) {

    function complieTemplate(el, model) {

        //  判断el是否是一个有效的HTML元素
        if (_Dom.isHTMLNode(el)) {
            _Tool.exception("element must be a type of DOMElement!");
        }

        //  判断model是否为一个有效的Object
        if(_Tool.isType(model, "Object")) {
            _Tool.exception("model must be a type of Object!");
        }

        //  缓存根节点
        this.$el = el;


    }

    return complieTemplate;

}));

