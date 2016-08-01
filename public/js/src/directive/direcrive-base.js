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
        this.rid = Dom.getAttributes(this.el, ["rid"])["rid"];
        this.pPid = Dom.getAttributes(this.parentNode, ["rid"])["rid"];
        this.priority = 0;
        this.exp = "";
        this.updateExp = "";
        this.finalExp = "";
        this.originalData = null;
        this.bindFn = null;

        if (dir.name) {
            var curDirective = this.directives.filter(function (directive) {
                return directive.directiveName === dir.name;
            });
            if (curDirective.length) {
                this.exp = curDirective[0]["exp"];
                this.finalExp = this.exp;

                //  RFor指令的特殊处理
                if (dir.name === "RFor") {
                    this.finalExp = this.exp.split(" ")[2];
                }
            }
        }
    }

    return DirectiveBase;

}));
