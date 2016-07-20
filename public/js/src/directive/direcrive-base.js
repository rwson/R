/**
 * 指令基类,提供属性(方法)给各指令继承/重写
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return factory(root);
        });
    }

}(window, function (root, undefined) {

    /**
     * 指令基类
     * @param dir   指令信息
     * @constructor
     */
    function DirectiveBase(dir) {
        this.priority = dir.priority;
        this.el = dir.el;
        this.directives = dir.directives;
        this.scope = dir.scope;
        this.exp = dir.directives[0].exp;
    }

    return DirectiveBase;

}));
