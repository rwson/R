/**
 * 指令基类,子类只继承构造函数
 */

"use strict";

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["dom"], function (Dom) {
            return factory(root, Dom);
        });
    }

}(window, function (root, Dom, undefined) {

    /**
     * 指令基类
     * @param dir   指令相关配置
     * @constructor
     */
    function DirectiveBase(dir) {
        this.el = dir.el;
        this.parentNode = this.el.parentNode;
        this.directives = dir.directives;
        this.scope = dir.scope;
        this.exp = dir.directives ? dir.directives[0].exp : dir.exp;
        this.rid = Dom.getAttributes(this.el, ["rid"])["rid"];
        this.pPid = Dom.getAttributes(this.parentNode, ["rid"])["rid"];
        this.priority = 0;
    }

    return DirectiveBase;

}));
